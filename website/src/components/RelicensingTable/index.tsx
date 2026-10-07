import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {RelicensingEvent} from '../../../plugins/relicensing-data';
import {licenseInfo} from '../../data/licenses';
import styles from './styles.module.css';

export function LicenseBadge({name}: {name: string}): React.ReactElement {
  const info = licenseInfo(name);
  const title =
    info.osi === true
      ? 'OSI-approved open source license'
      : info.osi === false
        ? 'Not an OSI-approved open source license'
        : undefined;
  const badge = (
    <span
      className={clsx(
        styles.badge,
        info.osi === true && styles.badgeOpen,
        info.osi === false && styles.badgeClosed,
      )}
      title={title}>
      {info.label}
    </span>
  );
  return info.anchor ? (
    <Link to={`/docs/licenses#${info.anchor}`} className={styles.badgeLink}>
      {badge}
    </Link>
  ) : (
    badge
  );
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function projectName(raw: string): string {
  return raw.split(',').map((p) => p.trim()).join(', ');
}

type Props = {events: RelicensingEvent[]};

export default function RelicensingTable({events}: Props): React.ReactElement {
  const [query, setQuery] = useState('');
  const [license, setLicense] = useState<string | null>(null);
  const [onlyLeftOsi, setOnlyLeftOsi] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);

  const destinationLicenses = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      const label = licenseInfo(e.newLicense).label;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [events]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = events.filter((e) => {
      if (license && licenseInfo(e.newLicense).label !== license) return false;
      if (onlyLeftOsi && licenseInfo(e.newLicense).osi !== false) return false;
      if (!q) return true;
      return [e.project, e.company, e.originalLicense, e.newLicense, e.date]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
    return rows.sort((a, b) =>
      newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
  }, [events, query, license, onlyLeftOsi, newestFirst]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search projects, companies, licenses…"
          aria-label="Search relicensing events"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={onlyLeftOsi}
            onChange={(e) => setOnlyLeftOsi(e.target.checked)}
          />
          Only moves to non-OSI licenses
        </label>
      </div>

      <div className={styles.chips} role="group" aria-label="Filter by new license">
        <button
          type="button"
          className={clsx(styles.chip, license === null && styles.chipActive)}
          aria-pressed={license === null}
          onClick={() => setLicense(null)}>
          All <span className={styles.chipCount}>{events.length}</span>
        </button>
        {destinationLicenses.map(([label, count]) => (
          <button
            key={label}
            type="button"
            className={clsx(styles.chip, license === label && styles.chipActive)}
            aria-pressed={license === label}
            onClick={() => setLicense(license === label ? null : label)}>
            {label} <span className={styles.chipCount}>{count}</span>
          </button>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Company</th>
            <th scope="col">License change</th>
            <th scope="col" aria-sort={newestFirst ? 'descending' : 'ascending'}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => setNewestFirst(!newestFirst)}>
                Date {newestFirst ? '↓' : '↑'}
              </button>
            </th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((e) => (
            <tr key={`${e.project}-${e.date}`}>
              <td data-label="Project" className={styles.project}>
                {projectName(e.project)}
              </td>
              <td data-label="Company">{e.company}</td>
              <td data-label="License change">
                <span className={styles.change}>
                  <LicenseBadge name={e.originalLicense} />
                  <span className={styles.arrow} aria-label="changed to">
                    →
                  </span>
                  <LicenseBadge name={e.newLicense} />
                </span>
              </td>
              <td data-label="Date" className={styles.date}>
                <time dateTime={e.date}>{formatDate(e.date)}</time>
              </td>
              <td data-label="Source">
                <a href={e.url} target="_blank" rel="noopener noreferrer">
                  {hostname(e.url)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visible.length === 0 && (
        <p className={styles.empty}>No events match those filters.</p>
      )}
    </div>
  );
}
