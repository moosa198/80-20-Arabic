const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const curriculumContext = { window: {} };
vm.runInNewContext(fs.readFileSync("curriculum.js", "utf8"), curriculumContext, { filename: "curriculum.js" });
const curriculum = curriculumContext.window.Curriculum;
assert.ok(curriculum, "curriculum.js must expose window.Curriculum");
assert.equal(curriculum.lessons.length, 31, "canonical curriculum must have 31 weeks");
assert.equal(curriculum.studentLessons.length, 31, "student journey must use the canonical weeks");
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
for (const [key, term] of Object.entries(curriculum.terms)) { assert.ok(term[2] && term[3] && term[4], "term " + key + " needs vocalised Arabic, transliteration and a gloss"); }

const transferContext = { window: {} };
vm.runInNewContext(fs.readFileSync("progress-transfer.js", "utf8"), transferContext, { filename: "progress-transfer.js" });
const transfer = transferContext.window.ProgressTransfer;
const studentBackup = transfer.toCanonical({
  cards: {
    "w3-1": { reps: 2, interval: 4 },
    "h-الله": { reps: 3, interval: 6 },
    "t-noun": { reps: 1, interval: 2 }
  },
  done: { "1": true, "3": false }
});
assert.ok(studentBackup.doneWeeks["1"], "student backup completion must map to doneWeeks");
assert.ok(studentBackup.cards["w3:1"], "student word-card key must convert to canonical form");
assert.ok(studentBackup.cards["hf:الله"], "student high-frequency card must convert to canonical form");
assert.ok(studentBackup.cards["term:noun"], "student term card must convert to canonical form");
const roundTrip = transfer.toStudent(studentBackup);
assert.ok(roundTrip.done["1"], "canonical completion must map back to student done");
assert.ok(roundTrip.cards["w3-1"] && roundTrip.cards["h-الله"] && roundTrip.cards["t-noun"], "canonical card keys must round-trip to Student Studio");
assert.throws(() => transfer.toCanonical({ cards: {} }), /weekly completion record/, "malformed backups must be rejected cleanly");

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
    assert.equal(JSON.stringify(actual), JSON.stringify(assigned), "week " + n + " must display only assigned " + book + " pages");
  }
}
const guide = fs.readFileSync("weekly-guide.js", "utf8");
assert.ok(!/drive\.google\.com\/file\/d\//i.test(guide), "student lesson renderer must not expose a complete FSTU PDF URL");
assert.ok(!/var\s+(?:preview|direct)\s*=/i.test(guide), "student lesson renderer must not create full-book preview/direct links");
const pageRenderer = fs.readFileSync("book-pages.js", "utf8");
assert.ok(pageRenderer.includes('return kind==="sarf"||kind==="nahw"'), "page renderer must only replace assigned FSTU nodes, never the digital Qur'an viewer");

const indexHtml = fs.readFileSync("index.html", "utf8");
assert.ok(indexHtml.includes('src="./curriculum.js"'), "index.html must use canonical curriculum data");
assert.ok(indexHtml.includes('src="./book-pages.js"'), "index.html must use the assigned-page renderer");
assert.ok(indexHtml.includes('src="./progress-transfer.js"'), "index.html must use shared progress backup format");
assert.ok(indexHtml.includes("pdf.min.js"), "index.html must load PDF.js for local page rendering");
assert.ok(indexHtml.includes("term-transliteration"), "index.html must implement the gradual terminology scaffold");

const studentHtml = fs.readFileSync("student.html", "utf8");
const studentFocus = fs.readFileSync("student-focus.js", "utf8");
assert.ok(studentHtml.includes('src="./curriculum.js"'), "student.html must use canonical curriculum data");
assert.ok(studentHtml.includes('src="./weekly-guide.js"'), "student.html must use the canonical weekly guide data");
assert.ok(studentHtml.includes('src="./book-pages.js"'), "student.html must use the assigned-page renderer");
assert.ok(studentHtml.includes('src="./cloud-progress.js"'), "student.html must retain secure class progress sync");
assert.ok(studentHtml.includes('src="./student-focus.js"'), "student.html must use the simplified weekly journey");
assert.ok(studentHtml.includes('src="./fstu-auto.js"'), "student.html must use automatic FSTU source loading");
assert.ok(studentHtml.includes("pdf.min.js"), "student.html must load PDF.js for assigned source pages");
assert.ok(studentFocus.includes("Hifz-first"), "student journey must make the Hifz-first priority visible");
assert.ok(studentFocus.includes("3 AMANAHS"), "student journey must retain the three-Amanah self-check space");
assert.ok(studentFocus.includes("Secure"), "student journey must retain explicit self-assessment");
assert.ok(studentFocus.includes("solution"), "student journey must retain a solution/recovery path");

const sw = fs.readFileSync("sw.js", "utf8");
assert.ok(sw.includes('"8020-arabic-v6"'), "offline cache version must invalidate stale app UI and cloud-sync wiring");
assert.ok(sw.includes('"./curriculum.js"') && sw.includes('"./book-pages.js"') && sw.includes('"./progress-transfer.js"'), "offline cache must include canonical data, source renderer and progress transfer");

console.log("PASS: 31-week canonical curriculum, source-page map, page-only FSTU UI, simplified Hifz-first student journey and PWA assets.");
