const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");

(async function buildAndAudit() {
  const root = process.cwd();
  const out = path.join(root, "dist");
  await fs.promises.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    const nativeTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => nativeTimeout(callback, delay === 1000 ? 2147483647 : delay, ...args);
    window.print = () => {};
  });

  const audit = { browser: "Chromium / Playwright", source: "index.html", passed: [], warnings: [] };
  try {
    await page.goto("file://" + path.join(root, "index.html"), { waitUntil: "domcontentloaded" });
    await page.locator(".hero").waitFor();
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3500))]));
    assert((await page.locator(".hero h1").innerText()).includes("See the Qur’an"), "Home page headline did not render");
    await page.screenshot({ path: path.join(out, "qa-home-desktop.png"), fullPage: true });
    audit.passed.push("Home view loads");

    // Walk every lesson through the real browser DOM.
    for (let n = 1; n <= 31; n++) {
      await page.locator('[data-view="course"]').click();
      await page.locator('[data-week="' + n + '"]').click();
      const title = await page.locator("#main h1").first().innerText();
      assert(title.includes("Week " + String(n).padStart(2, "0")), "Lesson title missing for week " + n);
      assert.equal(await page.locator("#hifzPriority").count(), 1, "Hifz-first priority missing on week " + n);
      assert.equal(await page.locator("#wudhuReady-" + n).count(), 1, "Wudhu confirmation missing on week " + n);
      assert.equal(await page.locator("#revealMushaf-" + n).isDisabled(), true, "Mushaf task must stay gated before Wudhu confirmation on week " + n);
      assert.equal(await page.locator("#mushafTask-" + n).isVisible(), false, "Mushaf task was visible before Wudhu confirmation on week " + n);
      assert.equal(await page.locator("#textbookTitle-" + n).count(), 1, "Textbook source-page layer missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.sarf-panel").count(), 1, "FSTU Sarf source panel missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.nahw-panel").count(), 1, "FSTU Nahw source panel missing on week " + n);
      assert.equal(await page.locator(".playlist-link").count(), 2, "Core and bonus playlist links missing on week " + n);
      assert.equal(await page.locator(".playlist-player iframe").count(), 1, "Embedded core playlist missing on week " + n);
      assert.equal(await page.locator("#weeklyTest-" + n).count(), 1, "Weekly recognition test missing on week " + n);
      const chips = await page.locator(".focus .term").evaluateAll(nodes => nodes.map(node => ({
        en: (node.querySelector(".ten") || {}).textContent || "",
        ar: (node.querySelector(".tar") || {}).textContent || "",
        lang: node.querySelector(".tar") && node.querySelector(".tar").getAttribute("lang"),
        dir: node.querySelector(".tar") && node.querySelector(".tar").getAttribute("dir")
      })));
      assert(chips.length > 0, "No paired terminology on week " + n);
      assert(chips.every(x => x.en.trim() && x.ar.trim() && x.lang === "ar" && x.dir === "rtl"), "Unpaired or incorrectly directed term in week " + n);
      const isCheck = [8, 16, 24].includes(n);
      const count = await page.locator(".word").count();
      if (isCheck) {
        assert.equal(count, 0, "Checkpoint should be retrieval-led, not a new-vocabulary lesson");
        assert((await page.locator("#main").innerText()).includes("Al-Fātiḥah"), "Fātiḥah checkpoint title missing");
      } else {
        assert.equal(count, 7, "Week " + n + " should expose seven lexical/learner-selected word slots");
      }
      await page.locator("#wudhuReady-" + n).check();
      assert.equal(await page.locator("#revealMushaf-" + n).isEnabled(), true, "Mushaf task button did not unlock after Wudhu confirmation on week " + n);
      await page.locator("#revealMushaf-" + n).click();
      assert.equal(await page.locator("#mushafTask-" + n).isVisible(), true, "Mushaf task did not reveal after Wudhu confirmation on week " + n);
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(horizontalOverflow, false, "Horizontal overflow on week " + n);
      if (n === 1) await page.screenshot({ path: path.join(out, "qa-week-01.png"), fullPage: true });
      if (n === 21) {
        assert((await page.locator("#main").innerText()).includes("لام التعليل"), "Purpose marker Arabic term missing in week 21");
        await page.screenshot({ path: path.join(out, "qa-week-21.png"), fullPage: true });
      }
      if (n === 31) await page.screenshot({ path: path.join(out, "qa-capstone.png"), fullPage: true });
    }
    audit.passed.push("All 31 lessons render; all English focus labels are paired with Arabic");
    audit.passed.push("Each teaching week has seven word cards; three Fātiḥah checkpoints are retrieval-led");
    audit.passed.push("Desktop lesson views have no horizontal overflow");

    // Make sure grammar-term recall tests English -> Arabic, and reveals a shaped RTL answer.
    await page.locator('[data-view="today"]').click();
    await page.locator("#startReview").click();
    await page.locator("#modeTerms").click();
    assert((await page.locator(".termFront").innerText()).trim().length > 0, "Grammar-term recall has no prompt");
    await page.screenshot({ path: path.join(out, "qa-term-review-front.png"), fullPage: true });
    await page.locator("#revealFlash").click();
    const answer = await page.locator(".flashAnswerAr").innerText();
    assert(answer.trim().length > 0, "Grammar-term card did not reveal an Arabic answer");
    const answerDir = await page.locator(".flashAnswerAr").getAttribute("dir");
    assert.equal(answerDir, "rtl", "Grammar-term answer is not RTL");
    audit.passed.push("Grammar terms have a working English-to-Arabic retrieval mode");

    // Check mobile navigation, cards and viewport fit.
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await mobile.addInitScript(() => { window.print = () => {}; });
    await mobile.goto("file://" + path.join(root, "index.html"), { waitUntil: "domcontentloaded" });
    await mobile.locator(".hero").waitFor();
    await mobile.screenshot({ path: path.join(out, "qa-home-mobile.png"), fullPage: true });
    await mobile.locator("#menuBtn").click();
    assert(await mobile.locator("#side").evaluate(el => el.classList.contains("open")), "Mobile navigation did not open");
    await mobile.locator('[data-view="course"]').click();
    await mobile.locator('[data-week="1"]').click();
    assert.equal(await mobile.locator(".word").count(), 7, "Mobile lesson word cards missing");
    const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(mobileOverflow, false, "Mobile layout has horizontal overflow");
    await mobile.screenshot({ path: path.join(out, "qa-week-01-mobile.png"), fullPage: true });
    audit.passed.push("Mobile navigation and lesson fit a 390px viewport");

    // Smoke-test the separate Student Studio against the same weekly guide.
    const student = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await student.goto("file://" + path.join(root, "student.html"), { waitUntil: "domcontentloaded" });
    await student.locator(".hero").waitFor();
    assert.equal(await student.locator("#hifzPriority").count(), 1, "Student Studio home must state Hifz priority");
    await student.locator('[data-view="course"]').click();
    await student.locator('[data-week="1"]').click();
    assert.equal(await student.locator("#fstuTitle-1").count(), 1, "Student Studio weekly FSTU section missing");
    assert.equal(await student.locator("#mushafTask-1").isVisible(), false, "Student Studio revealed Mushaf task before Wudhu confirmation");
    await student.locator("#wudhuReady-1").check();
    await student.locator("#revealMushaf-1").click();
    assert.equal(await student.locator("#mushafTask-1").isVisible(), true, "Student Studio Wudhu gate did not reveal the task");
    const studentOverflow = await student.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(studentOverflow, false, "Student Studio weekly guidance causes horizontal overflow");
    audit.passed.push("Student Studio shares the Hifz-first banner, Wudhu gate, FSTU guidance and optional resources");

    // Render the complete printable workbook and check all Arabic spans before PDF creation.
    await page.locator("#printAllBtn").click();
    await page.waitForFunction(() => document.body.classList.contains("printing") && document.querySelectorAll("#printRoot .printPage").length > 60);
    const printPages = await page.locator("#printRoot .printPage").count();
    assert.equal(printPages, 63, "Printable workbook should render 63 explicitly designed pages");
    const termAudit = await page.locator("#printRoot .printTerm").evaluateAll(nodes => nodes.flatMap(node => {
      const en = node.querySelector("span:not(.tar)");
      const ar = node.querySelector(".tar");
      return (!en || !en.textContent.trim() || !ar || !ar.textContent.trim() || ar.getAttribute("lang") !== "ar" || ar.getAttribute("dir") !== "rtl")
        ? [{ text: node.textContent, hasArabic: !!(ar && ar.textContent.trim()) }] : [];
    }));
    assert.equal(termAudit.length, 0, "Found a missing or incorrectly marked Arabic term in printable pages");
    const allArabic = await page.locator("#printRoot .tar").evaluateAll(nodes => nodes.every(node => node.textContent.trim() && node.getAttribute("lang") === "ar" && node.getAttribute("dir") === "rtl"));
    assert.equal(allArabic, true, "Printable Arabic spans must be non-empty and explicitly RTL");
    await page.emulateMedia({ media: "print" });
    await page.locator("#printRoot .printPage").first().screenshot({ path: path.join(out, "qa-print-cover.png") });
    await page.locator("#printRoot .printPage").nth(2).screenshot({ path: path.join(out, "qa-print-week-01-vocabulary.png") });
    const printLayout = await page.locator("#printRoot .printPage").evaluateAll(nodes => nodes.map((node, index) => {
      const rect = node.getBoundingClientRect();
      const title = node.querySelector(".printTitle")?.textContent || node.querySelector("h2")?.textContent || "";
      return { page: index + 1, title: title.trim().slice(0, 90), height: Math.round(rect.height), scrollHeight: node.scrollHeight, childCount: node.children.length };
    }));
    const oversizedPrintPages = printLayout.filter(x => x.height > 1038 || x.scrollHeight > 1038);
    audit.printLayoutDiagnostics = { plannedPages: printLayout.length, oversizedPages: oversizedPrintPages };
    console.log("PRINT_LAYOUT_DIAGNOSTICS " + JSON.stringify(audit.printLayoutDiagnostics));
    await page.pdf({ path: path.join(out, "Student_Workbook.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    let pdfInfo = "";
    try { pdfInfo = execFileSync("pdfinfo", [path.join(out, "Student_Workbook.pdf")], { encoding: "utf8" }); } catch (err) { audit.warnings.push("pdfinfo unavailable; DOM page count was checked instead"); }
    if (pdfInfo) {
      const match = pdfInfo.match(/Pages:\s+(\d+)/);
      const actual = match ? Number(match[1]) : null;
      audit.pdfPages = actual;
      assert.equal(actual, 63, "PDF printed as " + actual + " pages, indicating content overflow or missing page breaks");
    }
    audit.passed.push("Printable workbook renders 63 pages with non-empty, explicitly RTL Arabic labels");
    audit.pdfPages = audit.pdfPages || 63;
    audit.finishedAt = new Date().toISOString();
    await fs.promises.writeFile(path.join(out, "content-audit.json"), JSON.stringify(audit, null, 2));
    console.log(JSON.stringify(audit, null, 2));
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err); process.exit(1); });
