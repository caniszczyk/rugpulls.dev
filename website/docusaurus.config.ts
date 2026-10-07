import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const repoUrl = 'https://github.com/caniszczyk/rugpulls.dev';

const config: Config = {
  title: 'rugpulls.dev',
  tagline: 'A public record of open source projects that changed their license',
  favicon: 'img/favicon.svg',

  url: 'https://rugpulls.dev',
  baseUrl: '/',

  organizationName: 'caniszczyk',
  projectName: 'rugpulls.dev',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap',
      type: 'text/css',
    },
  ],

  plugins: ['./plugins/relicensing-data.ts'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/tree/main/website/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    metadata: [
      {name: 'keywords', content: 'open source, relicensing, license change, SSPL, BUSL, source available'},
    ],
    navbar: {
      title: 'rugpulls.dev',
      logo: {
        alt: 'rugpulls.dev logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/#events', label: 'Events', position: 'left'},
        {to: '/docs/licenses', label: 'Licenses', position: 'left'},
        {to: '/docs/about', label: 'About', position: 'left'},
        {to: '/docs/contributing', label: 'Contribute', position: 'left'},
        {
          href: repoUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'The record',
          items: [
            {label: 'All events', to: '/#events'},
            {label: 'License glossary', to: '/docs/licenses'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'About', to: '/docs/about'},
            {label: 'Add an event', to: '/docs/contributing'},
            {label: 'GitHub', href: repoUrl},
          ],
        },
        {
          title: 'Further reading',
          items: [
            {label: 'OSI approved licenses', href: 'https://opensource.org/licenses'},
            {label: 'SPDX license list', href: 'https://spdx.org/licenses/'},
          ],
        },
      ],
      copyright: `Licensed under <a href="${repoUrl}/blob/main/LICENSE">Apache-2.0</a> — and we intend to keep it that way. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
