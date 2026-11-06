#!/usr/bin/env node
// Checks for the BLA Handbook. Run from the repository folder:
//   node tests/check.js
// No packages needed. Exits with an error if anything is wrong.
//
// 1. _data/key_dates.csv: every row is complete and sensible.
// 2. Every page with a translation points to a page that exists and
//    points back.
// 3. Every internal link (to a .md page, with or without #heading)
//    points to a page and a heading that exist.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const problems = [];
const fail = (msg) => problems.push(msg);

// ---------- helpers ----------
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); if (row.some((x) => x !== "")) rows.push(row); }
  return rows;
}

function frontMatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (m) for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*?)\s*(#.*)?$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { fm, body: m ? text.slice(m[0].length) : text };
}

// kramdown's automatic heading ids (ASCII headings), or an explicit {#id}
function headingIds(body) {
  const ids = new Set();
  ids.explicit = new Set();
  for (const line of body.split("\n")) {
    const h = line.match(/^#{1,6}\s+(.*)$/);
    if (!h) continue;
    const explicit = h[1].match(/\{#([\w-]+)\}\s*$/);
    if (explicit) { ids.add(explicit[1]); ids.explicit.add(explicit[1]); continue; }
    const text = h[1].replace(/<[^>]+>/g, "").replace(/\{[^}]*\}/g, "");
    const id = text.toLowerCase().replace(/[^a-z0-9 _-]/g, "").trim().replace(/\s+/g, "-");
    if (id) ids.add(id);
  }
  // headings produced by the dates table include
  if (body.includes("dates-table.html")) ["t1", "mar", "t2", "jun", "t3", "sep", "t4"].forEach((x) => ids.add(x));
  return ids;
}

// ---------- 1. key dates ----------
const config = fs.readFileSync(path.join(root, "_config.yml"), "utf8");
const year = (config.match(/^dates_year:\s*(\d{4})/m) || [])[1];
const periods = fs.readFileSync(path.join(root, "_data/periods.yml"), "utf8")
  .split("\n").map((l) => (l.match(/code:\s*(\w+)/) || [])[1]).filter(Boolean);

const csv = parseCsv(fs.readFileSync(path.join(root, "_data/key_dates.csv"), "utf8"));
const header = csv[0];
const expected = ["date", "end_date", "approx", "when_en", "when_zh", "period", "flagship", "event_en", "event_zh", "for_en", "for_zh", "notes_en", "notes_zh"];
if (header.join(",") !== expected.join(",")) fail(`key_dates.csv: the header row should be\n  ${expected.join(",")}`);
csv.slice(1).forEach((cells, i) => {
  const line = i + 2;
  if (cells.length !== expected.length) { fail(`key_dates.csv line ${line}: ${cells.length} columns instead of ${expected.length} (a comma inside a cell needs "double quotes")`); return; }
  const r = Object.fromEntries(expected.map((k, j) => [k, cells[j].trim()]));
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + "T00:00:00Z"));
  if (!isDate(r.date)) fail(`key_dates.csv line ${line}: date "${r.date}" is not year-month-day`);
  else if (year && !r.date.startsWith(year)) fail(`key_dates.csv line ${line}: date ${r.date} is not in ${year} (dates_year in _config.yml)`);
  if (r.end_date && (!isDate(r.end_date) || r.end_date < r.date)) fail(`key_dates.csv line ${line}: end_date "${r.end_date}" is not a date after the start date`);
  if (!["", "yes"].includes(r.approx)) fail(`key_dates.csv line ${line}: approx should be "yes" or empty`);
  if (r.approx === "yes" && (!r.when_en || !r.when_zh)) fail(`key_dates.csv line ${line}: approx is yes, so when_en and when_zh are needed`);
  if (r.approx !== "yes" && (r.when_en || r.when_zh)) fail(`key_dates.csv line ${line}: when_en/when_zh are only used when approx is yes`);
  if (!periods.includes(r.period)) fail(`key_dates.csv line ${line}: period "${r.period}" is not one of ${periods.join(", ")}`);
  if (!["", "yes"].includes(r.flagship)) fail(`key_dates.csv line ${line}: flagship should be "yes" or empty`);
  for (const k of ["event_en", "event_zh", "for_en", "for_zh"]) if (!r[k]) fail(`key_dates.csv line ${line}: ${k} is empty`);
  if (!!r.notes_en !== !!r.notes_zh) fail(`key_dates.csv line ${line}: notes in one language but not the other`);
});

// ---------- 2 and 3. pages, translations, links ----------
const pages = {};
function collect(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const rel = path.relative(root, full);
    if (fs.statSync(full).isDirectory()) {
      if (!["_includes", "_sass", "_data", "assets", "tests", ".git", "_site", "node_modules"].includes(f)) collect(full);
    } else if (f.endsWith(".md") && !["README.md", "EDITING.md"].includes(rel)) {
      const { fm, body } = frontMatter(full);
      const url = fm.permalink || "/" + rel.replace(/index\.md$/, "").replace(/\.md$/, ".html");
      pages[rel] = { fm, body, url, ids: headingIds(body) };
    }
  }
}
collect(root);
const byUrl = Object.fromEntries(Object.entries(pages).map(([rel, p]) => [p.url, rel]));

for (const [rel, p] of Object.entries(pages)) {
  if (!p.fm.translation) { fail(`${rel}: no translation in front matter`); continue; }
  const other = byUrl[p.fm.translation];
  if (!other) fail(`${rel}: translation ${p.fm.translation} is not a page`);
  else if (pages[other].fm.translation !== p.url) fail(`${rel}: ${other} does not link back (its translation is ${pages[other].fm.translation})`);
  for (const k of ["title", "owner", "last_reviewed", "description"]) if (!p.fm[k]) fail(`${rel}: ${k} missing from front matter`);

  const linkRe = /\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g;
  let m;
  while ((m = linkRe.exec(p.body))) {
    const target = path.normalize(path.join(path.dirname(rel), m[1]));
    if (!pages[target]) { fail(`${rel}: link to ${m[1]} — no such page`); continue; }
    if (m[2] && !pages[target].ids.has(m[2].slice(1))) fail(`${rel}: link to ${m[1]}${m[2]} — no such heading on that page`);
  }
}

// English and Chinese pages should have the same heading ids (so links work in both)
for (const [rel, p] of Object.entries(pages)) {
  if (rel.startsWith("zh/") || !p.fm.translation) continue;
  const other = byUrl[p.fm.translation];
  if (!other) continue;
  for (const id of pages[other].ids.explicit) {
    if (!p.ids.has(id)) fail(`${other}: heading id #${id} has no matching heading on ${rel}`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n- ` + problems.join("\n- "));
  process.exit(1);
}
console.log(`✓ key_dates.csv: ${csv.length - 1} events; ${Object.keys(pages).length} pages; translations and internal links OK`);
