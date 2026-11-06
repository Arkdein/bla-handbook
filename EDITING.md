# Editing the BLA Handbook

All edits can be made on github.com, in the browser. Changes go live about a minute after they are saved ("committed").

## Update the key dates

Every date is in one file: **`_data/key_dates.csv`**. The English and Chinese Key Dates pages and the calendar members subscribe to are all built from it.

1. Open `_data/key_dates.csv` on GitHub and select the pencil (Edit) icon.
2. Change, add or delete a line. One line = one event. Keep the columns in this order:

| Column | What to put | Example |
|---|---|---|
| `date` | The date, as year-month-day | `2027-04-14` |
| `end_date` | Last day, only for events lasting more than one day | `2027-06-23` |
| `approx` | `yes` if the exact day isn't fixed yet; otherwise leave empty | `yes` |
| `when_en`, `when_zh` | Only when `approx` is `yes`: what to show instead of a date | `Mid-April`, `4月中旬` |
| `period` | Which table it goes in: `t1`, `mar`, `t2`, `jun`, `t3`, `sep`, `t4` | `t2` |
| `flagship` | `yes` for CSP and the BLA Symposium | `yes` |
| `event_en`, `event_zh` | Event name | `BLA Symposium`, `BLA研讨会` |
| `for_en`, `for_zh` | Who it is for | `All members`, `全体会员` |
| `notes_en`, `notes_zh` | Anything else (optional) | |

3. If a cell contains a comma, put the whole cell in double quotes: `"Week of 8 Mar, evening"`.
4. Select **Commit changes**.

Lines marked `approx` = `yes` show on the page but are left out of the calendar, because they have no fixed day yet. When the day is fixed, put the real date in `date`, clear `approx`, `when_en` and `when_zh`.

### Each November: next year's dates

1. Replace the lines in `_data/key_dates.csv` with next year's calendar.
2. In `_config.yml`, change `dates_year` to the new year and set `dates_tentative: true`.
3. When the school calendar confirms the dates, set `dates_tentative: false`.

## Edit a page

1. Open the page's `.md` file (Chinese in the main folder, English in `en/`) and select the pencil icon.
2. Edit the text. Keep the block between the two `---` lines at the top as it is, except `last_reviewed`, which you update to the current month.
3. Make the same change to the page in the other language.
4. Select **Commit changes**.

## When the SOP changes

Each section of the Member's Guide ends with a line such as "依据：SOP 2" / "Based on SOP 2". Find the sections based on the SOP you changed, in `members-guide.md` (Chinese) and `en/members-guide.md` (English), and bring them into line.

## Go live

When the content has been checked, set `draft: false` in `_config.yml`. This lets search engines list the site and hides any TODO boxes.

## Check before publishing (optional)

If you have Node installed: `node tests/check.js`. It checks the dates file, that every English page has a Chinese page and the other way round, and that internal links point to pages and headings that exist.
