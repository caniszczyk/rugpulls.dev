/**
 * Metadata about the licenses that appear in the README table.
 * `osi` marks licenses approved by the Open Source Initiative, which is
 * the line the site uses between "open source" and "source available".
 */
export type LicenseInfo = {
  label: string;
  /** null when the license is not in this list */
  osi: boolean | null;
  /** Anchor on /docs/licenses, if the license has a glossary entry. */
  anchor?: string;
};

const LICENSES: Record<string, LicenseInfo> = {
  'apache2.0': {label: 'Apache-2.0', osi: true},
  mit: {label: 'MIT', osi: true},
  'mpl1.0': {label: 'MPL-1.0', osi: true},
  'mpl2.0': {label: 'MPL-2.0', osi: true},
  'agpl3.0': {label: 'AGPL-3.0', osi: true, anchor: 'agpl'},
  sspl: {label: 'SSPL', osi: false, anchor: 'sspl'},
  busl: {label: 'BUSL', osi: false, anchor: 'busl'},
  bsl: {label: 'BUSL', osi: false, anchor: 'busl'},
  commonsclause: {label: 'Commons Clause', osi: false, anchor: 'commons-clause'},
  'elasticlicensev2.0': {label: 'Elastic License v2.0', osi: false, anchor: 'elv2'},
  elv2: {label: 'Elastic License v2.0', osi: false, anchor: 'elv2'},
  confluentcommunitylicense: {label: 'Confluent Community License', osi: false, anchor: 'confluent'},
  timescalelicense: {label: 'Timescale License', osi: false, anchor: 'timescale'},
};

function key(name: string): string {
  return name.toLowerCase().replace(/[\s_-]+/g, '');
}

export function licenseInfo(name: string): LicenseInfo {
  return LICENSES[key(name)] ?? {label: name, osi: null};
}
