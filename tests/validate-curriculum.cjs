const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const curriculumContext = { window: {} };
vm.runInNewContext(fs.readFileSync("curriculum.js", "utf8"), curriculumContext, { filename: "curriculum.js" });
const curriculum = curriculumContext.window.Curriculum;
assert.ok(curriculum, "curriculum.js must expose window.Curriculum");
assert.equal(curriculum.lessons.length, 31, "canonical curriculum must have 31 weeks");
assert.equal(curriculum.studentLessons.length, 31, "Student Studio must use the canonical weeks");
assert.deepEqual(Array.from(curriculum.lessons, week => week.n), Array.from({ length: 31 }, (_, i) => i + 1), "week numbers must be continuous");
const missingTerms = [];
for (const week of curriculum.lessons) {
  assert.ok(week.title, "week " + week.n + " must have a title");
  assert.ok(week.focus && week.focus.length, "week " + week.n + " must define a concept focus");
  for (const key of week.focus) if (!curriculum.terms[key]) missingTerms.push("week " + week.n + ": " + key);
  if (!week.checkpoint && !week.capstone) assert.equal(week.words.length, 7, "teaching week " + week.n + " must have seven lexical words");
  assert.ok(week.page || week.checkpoint || week.capstone, "week " + week.n + " must have a page or checkpoint/capstone status");
}
assert.deepEqual(missingTerms, [], "every lesson focus term must be mapped");
assert.deepEqual(Array.from(curriculum.lessons.filter(week => week.checkpoint), week => week.n), [8, 16, 24], "the three Al-Fatihah checkpoints must remain");
assert.ok(curriculum.lessons.some(week => week.n === 31 && week.capstone), "week 31 must remain an independent capstone");
assert.ok(curriculum.terms.noun[2] && curriculum.terms.noun[3], "technical terms must support fully vocalised Arabic and transliteration");

const guideContext = { window: {} };
vm.runInNewContext(fs.readFileSync("weekly-guide.js", "utf8"), guideContext, { filename: "weekly-guide.js" });
const pageMap = guideContext.window.WeeklyGuide.getPageSourceMap();
for (const book of ["sarf", "nahw"]) {
  assert.ok(pageMap[book].length > 0, "source map must include " + book);
  assert.equal(new Set(pageMap[book]).size, pageMap[book].length, book + " pages must be unique");
  assert.ok(pageMap[book].every(page => Number.isInteger(page) && page > 0), book + " pages must be positive printed page numbers");
}
for (let n = 1; n <= 31; n++) {
  const week = guideContext.window.WeeklyGuide.get(n);
  const rendered = guideContext.window.WeeklyGuide.renderSequence(n);
  assert.ok(!rendered.includes("drive.google.com/file/d/"), "week " + n + " must not link to a full FSTU PDF");
  for (const book of ["sarf", "nahw"]) {
    const actual = Array.from(rendered.matchAll(new RegExp('data-book-page="' + book + ':([0-9]+)"', "g")), match => Number(match[1])).sort((a, b) => a - b);
    const assigned = Array.from(week[book + "Pages"] || [], Number).sort((a, b) => a - b);
    assert.deepEqual(actual, assigned, "week " + n + " must display only assigned " + book + " pages");
  }
}
const guide = fs.readFileSync("weekly-guide.js", "utf8");
assert.ok(!/drive\.google\.com\/file\/d\//i.test(guide), "student lesson renderer must not expose a complete FSTU PDF URL");
assert.ok(!/var\s+(?:preview|direct)\s*=/i.test(guide), "student lesson renderer must not create full-book preview/direct links");
const pageRenderer = fs.readFileSync("book-pages.js", "utf8");
assert.ok(pageRenderer.includes('return kind==="sarf"||kind==="nahw"'), "page renderer must only replace assigned FSTU nodes, never the digital Qur'an viewer");

for (const file of ["index.html", "student.html"]) {
  const html = fs.readFileSync(file, "utf8");
  assert.ok(html.includes('src="./curriculum.js"'), file + " must use canonical curriculum data");
  assert.ok(html.includes('src="./book-pages.js"'), file + " must use the assigned-page renderer");
  assert.ok(html.includes("pdf.min.js"), file + " must load PDF.js for local page rendering");
  assert.ok(html.includes("term-transliteration"), file + " must implement the gradual terminology scaffold");
}
const sw = fs.readFileSync("sw.js", "utf8");
assert.ok(sw.includes('"8020-arabic-v4"'), "offline cache version must invalidate stale full-book UI");
assert.ok(sw.includes('"./curriculum.js"') && sw.includes('"./book-pages.js"'), "offline cache must include canonical data and page renderer");

console.log("PASS: 31-week canonical curriculum, term coverage, source-page map, page-only FSTU UI, scaffolding and PWA assets.");
