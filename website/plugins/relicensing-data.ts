import fs from 'node:fs';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';

/**
 * The README table at the repository root is the single source of truth.
 * Contributors keep adding rows there; this plugin parses it at build time
 * and exposes the rows to the site through Docusaurus global data.
 */

export type RelicensingEvent = {
  project: string;
  company: string;
  originalLicense: string;
  newLicense: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  url: string;
};

export type RelicensingData = {events: RelicensingEvent[]};

const COLUMN_KEYS: Record<string, keyof RelicensingEvent> = {
  project: 'project',
  company: 'company',
  'original license': 'originalLicense',
  'new license': 'newLicense',
  'date of change': 'date',
  date: 'date',
  url: 'url',
};

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function normalizeDate(raw: string): string {
  // README uses YYYY/MM/DD; accept YYYY-MM-DD too.
  const match = raw.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) {
    throw new Error(`relicensing-data: unrecognised date "${raw}"`);
  }
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function parseReadmeTable(markdown: string): RelicensingEvent[] {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    const cells = splitRow(line).map((c) => c.toLowerCase());
    return line.trim().startsWith('|') && cells.includes('project') && cells.includes('url');
  });
  if (headerIndex === -1) {
    throw new Error('relicensing-data: could not find the events table in README.md');
  }

  const header = splitRow(lines[headerIndex]).map((c) => COLUMN_KEYS[c.toLowerCase()]);
  const events: RelicensingEvent[] = [];

  // Skip the header and the |:---| separator row; stop at the first non-table line.
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith('|')) break;
    const cells = splitRow(line);
    const row: Partial<RelicensingEvent> = {};
    header.forEach((key, i) => {
      if (key) row[key] = cells[i] ?? '';
    });
    if (!row.project) continue;
    events.push({
      project: row.project,
      company: row.company ?? '',
      originalLicense: row.originalLicense ?? '',
      newLicense: row.newLicense ?? '',
      date: normalizeDate(row.date ?? ''),
      url: row.url ?? '',
    });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export default function relicensingDataPlugin(
  context: LoadContext,
): Plugin<RelicensingData> {
  const readmePath = path.resolve(context.siteDir, '..', 'README.md');
  return {
    name: 'relicensing-data',
    getPathsToWatch() {
      return [readmePath];
    },
    async loadContent() {
      const markdown = await fs.promises.readFile(readmePath, 'utf8');
      return {events: parseReadmeTable(markdown)};
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
}
