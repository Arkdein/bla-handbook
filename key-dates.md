---
title: Key Dates
nav_order: 3
owner: Mr Randall Hoon
last_reviewed: Nov 2026
description: BLA's key dates for the year, and a calendar you can subscribe to.
translation: /zh/key-dates.html
translation_label: 中文
translation_lang: zh-Hans
---

{% include lang-switch.html %}

# Key Dates {{ site.dates_year }}
{: .no_toc }

BLA activities for the year. Academy Time is on Mondays unless stated.
{: .fs-6 .fw-300 }

{% if site.dates_tentative %}
{: .note }
These dates are **tentative** until the school calendar for {{ site.dates_year }} is confirmed. Each activity's notice, sent 2 weeks before (4 weeks for flagship events), has the final date, time and venue.
{% endif %}

## Add these dates to your calendar

Subscribe once and your calendar app will update itself when a date changes. Dates without a fixed day yet (marked "week of" or "mid-") are not in the calendar.

<div class="bla-start-here" markdown="1">
[Subscribe (phone or Mac)](webcal://{{ site.url | remove: 'https://' | remove: 'http://' }}{{ site.baseurl }}/calendar.ics){: .btn .btn-primary }
[Download calendar file (.ics)]({{ '/calendar.ics' | relative_url }}){: .btn }
</div>

<details class="bla-more" markdown="1">
<summary>Using Google Calendar?</summary>

1. On a computer, open Google Calendar.
2. Next to **Other calendars**, select **+** and then **From URL**.
3. Paste this address: `{{ '/calendar.ics' | absolute_url }}`
4. Select **Add calendar**.

</details>

## Good to know

- **Term 1 activities are for Sec 4 and JC2 members.** New Sec 3 and JC1 members join at the orientation in Term 2.
- **JC2 members** are excused from Academy Time in Semester 2.
- **Flagship events** are the China Studies Perspectives Forum and the BLA Symposium. Attend both unless there is an emergency.
- For anything run by MOE or another school, the notice says who takes part.

{% include dates-table.html lang="en" %}
