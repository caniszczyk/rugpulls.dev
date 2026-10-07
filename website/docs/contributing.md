---
title: Contributing
description: How to add or correct a relicensing event.
---

# Contributing

The record is the table in the repository [README.md](https://github.com/caniszczyk/rugpulls.dev/blob/main/README.md). The website reads it at build time, so **you only ever edit the README**.

## Add an event

1. [Edit README.md on GitHub](https://github.com/caniszczyk/rugpulls.dev/edit/main/README.md).
2. Add one row to the table:

   ```md
   |Project|Company|Original License|New License|YYYY/MM/DD|https://link-to-announcement|
   ```

3. Open a pull request with the project name in the title.

### Row guidelines

- **Project** — the project's common name. Several projects relicensed in one announcement can share a row, separated by commas (`Terraform,Vault,Consul`).
- **Company** — the steward that made the change.
- **Licenses** — use [SPDX identifiers](https://spdx.org/licenses/) where one exists (`Apache-2.0`, `AGPL-3.0`, `MPL-2.0`), otherwise the license's own name (`SSPL`, `BUSL`, `Elastic License v2.0`).
- **Date** — when the change was announced or took effect, as `YYYY/MM/DD`. The build fails on any other format, which catches typos.
- **URL** — a primary source: the steward's announcement or license page, not a news article if you can avoid it.

Row order doesn't matter; the site sorts by date.

## Correct an event

Open a pull request changing the row, and link a source for the correction in the description.

## Work on the website

The site lives in [`website/`](https://github.com/caniszczyk/rugpulls.dev/tree/main/website) and is built with [Docusaurus](https://docusaurus.io/).

```bash
cd website
npm install
npm start
```

`npm start` serves the site at `http://localhost:3000` and reloads when you edit the README or any page. If a newly added license should get a green or red badge and a glossary link, add it to `website/src/data/licenses.ts` and, if needed, a section to `website/docs/licenses.md`.
