---
title: About
description: What rugpulls.dev tracks and how entries are chosen.
---

# About rugpulls.dev

rugpulls.dev is a community-maintained record of **relicensing events**: moments when the company behind an open source project changed the license that new releases ship under.

People choose dependencies partly on the strength of a license. When that license changes, downstream users, contributors and cloud providers can suddenly find themselves on the wrong side of new terms. This site collects those changes in one place, with a link to each announcement, so the history is easy to find and hard to forget.

## What counts as an event

An entry needs four things:

- **A project** that was published under a recognised license.
- **A change of license** for new versions, announced by the project's steward.
- **A date** the change took effect or was announced.
- **A primary source**, ideally the steward's own blog post, press release or license page.

Most entries move from an [OSI-approved](https://opensource.org/licenses) license to a source-available one such as the [SSPL](./licenses.md#sspl) or the [BUSL](./licenses.md#busl). Some move between two open source licenses (for example, Apache-2.0 to AGPL-3.0). Those are included too, because changing to a stronger copyleft still changes the deal for many users. The table marks each license so you can tell the two apart.

## What the badges mean

- **Green** — the license is approved by the Open Source Initiative.
- **Red** — the license is not OSI-approved. It may still publish source code, but it restricts how the software can be used, typically by prohibiting competing hosted services.

## Where the data lives

The list is the table in the repository [README](https://github.com/caniszczyk/rugpulls.dev#readme). This site reads that table every time it builds, so the README and the site never disagree. See [Contributing](./contributing.md) to add an event.
