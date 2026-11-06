# BLA Handbook

The handbook of the Bicultural Leaders Academy (BLA, 双文化领袖学研中心) at River Valley High School, built with GitHub Pages and the [Just the Docs](https://just-the-docs.com/) theme. It follows the same set-up as the ECG@RVHS site, cut down to what BLA needs.

**Owner:** Mr Randall Hoon (repository owner). **Status:** draft (`draft: true` in `_config.yml`: search engines are told not to list the site).

**Live site:** https://arkdein.github.io/bla-handbook/

## Who it is for

Members (Sec 3 to JC2), new members and their parents. It is a **public** website: anyone with the address can read it.

The full Administrative SOP is **not** on this site. The "For Teachers and EXCO" page links to the Google Doc, which only BLA teachers and current EXCO members can open.

## What's where

| File | What it is |
|---|---|
| `index.md`, `about.md`, `key-dates.md`, `members-guide.md`, `teachers-and-exco.md` | English pages |
| `zh/` | The matching Chinese pages (same names), listed under 中文版 in the sidebar |
| `_data/key_dates.csv` | **All the dates.** Both Key Dates pages and the calendar file are built from it |
| `_data/periods.yml` | Term headings used on the Key Dates pages |
| `calendar.ics` | The subscribable calendar (built from the CSV; don't edit by hand) |
| `_config.yml` | Site settings: draft switch, SOP link, dates year |
| `_includes/` | Sidebar logo and title, language switch, dates table, footer |
| `_sass/` | BLA colours (`custom/setup.scss`, taken from the bridge logo) and styles |
| `assets/images/` | BLA logo and icons |
| `tests/check.js` | Checks before publishing: `node tests/check.js` |

## How to make changes

See [EDITING.md](EDITING.md).

## Rules

1. **The SOP is the authority.** The Member's Guide summarises it. When the SOP changes, update the matching section of the Member's Guide in **both** languages (each section ends with "Based on SOP n").
2. **English and Chinese pages change together.**
3. **No student data on this site**: no names with photos, no class lists, no attendance.
4. **Never paste the SOP into this site.**
