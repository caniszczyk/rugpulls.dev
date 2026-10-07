import React, {useMemo} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import RelicensingTable from '@site/src/components/RelicensingTable';
import type {RelicensingData} from '@site/plugins/relicensing-data';
import {licenseInfo} from '@site/src/data/licenses';
import styles from './index.module.css';

function useStats(data: RelicensingData) {
  return useMemo(() => {
    const {events} = data;
    const companies = new Set(events.map((e) => e.company));
    const leftOsi = events.filter(
      (e) => licenseInfo(e.originalLicense).osi === true && licenseInfo(e.newLicense).osi === false,
    ).length;

    const destinations = new Map<string, number>();
    for (const e of events) {
      const label = licenseInfo(e.newLicense).label;
      destinations.set(label, (destinations.get(label) ?? 0) + 1);
    }
    const [topLicense, topCount] = [...destinations.entries()].sort((a, b) => b[1] - a[1])[0] ?? [
      '—',
      0,
    ];

    const years = events.map((e) => Number(e.date.slice(0, 4)));
    const first = Math.min(...years);
    const last = Math.max(...years);
    const byYear = [];
    for (let y = first; y <= last; y++) {
      const inYear = events.filter((e) => e.date.startsWith(String(y)));
      byYear.push({
        year: y,
        closed: inYear.filter((e) => licenseInfo(e.newLicense).osi === false).length,
        other: inYear.filter((e) => licenseInfo(e.newLicense).osi !== false).length,
      });
    }
    const maxPerYear = Math.max(1, ...byYear.map((y) => y.closed + y.other));

    return {
      total: events.length,
      companies: companies.size,
      leftOsi,
      topLicense,
      topCount,
      first,
      byYear,
      maxPerYear,
    };
  }, [data]);
}

const BAR_AREA_PX = 140;

function Timeline({stats}: {stats: ReturnType<typeof useStats>}) {
  return (
    <figure className={styles.timeline}>
      <div className={styles.bars} role="img" aria-label="Relicensing events per year">
        {stats.byYear.map(({year, closed, other}) => (
          <div key={year} className={styles.barColumn}>
            <span className={styles.barCount}>{closed + other || ''}</span>
            <div
              className={styles.barStack}
              style={{height: `${((closed + other) / stats.maxPerYear) * BAR_AREA_PX}px`}}>
              <div
                className={styles.barClosed}
                style={{flexGrow: closed}}
                title={`${year}: ${closed} to a non-OSI license`}
              />
              <div
                className={styles.barOther}
                style={{flexGrow: other}}
                title={`${year}: ${other} to an OSI-approved license`}
              />
            </div>
            <span className={styles.barYear}>’{String(year).slice(2)}</span>
          </div>
        ))}
      </div>
      <figcaption className={styles.legend}>
        <span>
          <i className={styles.swatchClosed} /> To a non-OSI license
        </span>
        <span>
          <i className={styles.swatchOther} /> To another OSI license
        </span>
      </figcaption>
    </figure>
  );
}

export default function Home(): React.ReactElement {
  const data = usePluginData('relicensing-data') as RelicensingData;
  const stats = useStats(data);

  return (
    <Layout
      title="Open source relicensing events"
      description="A community-maintained record of open source projects that changed their license.">
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>rugpulls.dev</p>
          <h1 className={styles.title}>
            The license you adopted
            <br />
            isn’t always the license you keep.
          </h1>
          <p className={styles.lede}>
            A community-maintained record of open source projects that changed their license,
            most often from an OSI-approved license to a source-available one. Every entry links
            to the announcement.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="#events">
              Browse the events
            </Link>
            <Link className={styles.secondaryAction} to="/docs/contributing">
              Report a relicensing →
            </Link>
          </div>

          <dl className={styles.stats}>
            <div>
              <dt>Events recorded</dt>
              <dd>{stats.total}</dd>
            </div>
            <div>
              <dt>Companies</dt>
              <dd>{stats.companies}</dd>
            </div>
            <div>
              <dt>Left OSI licensing</dt>
              <dd>
                {stats.leftOsi}
                <small> of {stats.total}</small>
              </dd>
            </div>
            <div>
              <dt>Most common destination</dt>
              <dd className={styles.statText}>{stats.topLicense}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Relicensing by year</h2>
            <Timeline stats={stats} />
          </div>
        </section>

        <section className={styles.section} id="events">
          <div className="container">
            <h2 className={styles.sectionTitle}>All events</h2>
            <p className={styles.sectionLede}>
              Green badges are OSI-approved licenses; red badges are not. Click a badge to read
              what the license allows.
            </p>
            <RelicensingTable events={data.events} />
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <h2>Know of one we missed?</h2>
            <p>
              The list lives in the repository README. Adding a row is a one-line pull request.
            </p>
            <Link className="button button--primary" to="/docs/contributing">
              How to add an event
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
