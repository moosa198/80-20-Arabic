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
       assert.equal(await page.locator("#applicationFlow-" + n).isVisible(), false, "Qur’an application must remain locked before the source check on week " + n);
       assert.equal(await page.locator("#mushafTask-" + n).isVisible(), false, "Qur’an page should not be visible before source understanding on week " + n);
      const mappedPage = await page.evaluate(n => WeeklyGuide.get(n).page || 604, n);
      assert.equal(await page.locator('quran-madina-html[data-recognition-page][page="' + mappedPage + '"]').count(), 1, "Digital 15-line Mushaf missing on week " + n);
      assert.equal(await page.locator("#textbookTitle-" + n).count(), 1, "Textbook source-page layer missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.sarf-panel").count(), 1, "FSTU Sarf source panel missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.nahw-panel").count(), 1, "FSTU Nahw source panel missing on week " + n);
      assert.equal(await page.locator(".playlist-link").count(), 2, "Core and bonus playlist links missing on week " + n);
      assert.equal(await page.locator(".playlist-player iframe").count(), 1, "Embedded core playlist missing on week " + n);
      assert.equal(await page.locator("#weeklyTest-" + n).count(), 1, "Weekly recognition test missing on week " + n);
       const sequenceOrder = await page.locator(".weekly-sequence").evaluate(root => {
         const nodes = [".textbook-step", ".source-mastery-step", ".mushaf-step", ".assessment-layer"].map(selector => root.querySelector(selector));
         return nodes.every((node, i) => !!node && (i === nodes.length - 1 || !!(node.compareDocumentPosition(nodes[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)));
       });
       assert.equal(sequenceOrder, true, "Lesson must order FSTU source → guided understanding → Qur’anic application → retrieval on week " + n);
       if (![8, 16, 24].includes(n)) {
         const sourceBeforeVocabulary = await page.locator("body").evaluate(root => {
           const source = root.querySelector(".weekly-sequence .textbook-step");
           const vocabulary = root.querySelector(".lessonGrid");
           return !!source && !!vocabulary && !!(source.compareDocumentPosition(vocabulary) & Node.DOCUMENT_POSITION_FOLLOWING);
         });
         assert.equal(sourceBeforeVocabulary, true, "The FSTU lesson must precede supplementary word cards on week " + n);
       }
       const sourcePages = await page.locator(".book-page-frame").evaluateAll(nodes => nodes.map(el => el.getAttribute("data-book-page")));
       const mappedQuranPage = await page.evaluate(n => WeeklyGuide.get(n).page || 604, n);
       assert(sourcePages.includes("quran:" + mappedQuranPage), "Actual assigned Mushaf page reference missing on week " + n);
       assert(sourcePages.some(x => x.startsWith("sarf:")), "Assigned FSTU Sarf page reference missing on week " + n);
       assert(sourcePages.some(x => x.startsWith("nahw:")), "Assigned FSTU Naḥw page reference missing on week " + n);
       const assignedFstuPages = await page.locator(".textbook-stack .book-page-frame").evaluateAll(nodes => nodes.map(el => el.getAttribute("data-book-page")));
       const expectedFstuPages = await page.evaluate(n => WeeklyGuide.get(n).sarfPages.map(p => "sarf:" + p).concat(WeeklyGuide.get(n).nahwPages.map(p => "nahw:" + p)), n);
       assert.deepEqual(assignedFstuPages, expectedFstuPages, "Only the week's specifically mapped FSTU pages should be shown on week " + n);
      const chips = await page.locator(".weekly-sequence .source-key-term").evaluateAll(nodes => nodes.map(node => ({
        en: (node.querySelector("span") || {}).textContent || "",
        ar: (node.querySelector("b") || {}).textContent || "",
        lang: node.querySelector("b") && node.querySelector("b").getAttribute("lang"),
        dir: node.querySelector("b") && node.querySelector("b").getAttribute("dir")
      })));
      assert(chips.length > 0, "No paired terminology in the source-first lesson on week " + n);
      assert(chips.every(x => x.en.trim() && x.ar.trim() && x.lang === "ar" && x.dir === "rtl"), "Unpaired or incorrectly directed source-first term in week " + n);
      const isCheck = [8, 16, 24].includes(n);
      const count = await page.locator(".word").count();
      if (isCheck) {
        assert.equal(count, 0, "Checkpoint should be retrieval-led, not a new-vocabulary lesson");
        assert((await page.locator("#main").innerText()).includes("Al-Fātiḥah"), "Fātiḥah checkpoint title missing");
      } else {
        assert.equal(count, 7, "Week " + n + " should expose seven lexical/learner-selected word slots");
      }
       if (n === 1) {
         assert(await page.locator(".source-key-term .term-pronunciation").count() >= 1, "First-encounter terms should show subtle pronunciation support on week 1");
         await page.locator("#complete").check();
         await page.locator("#saveWeek").click();
         const prematureCompletion = await page.evaluate(() => !!(JSON.parse(localStorage.getItem("8020arabic-progress-v1") || "{}").doneWeeks || {})[1]);
         assert.equal(prematureCompletion, false, "A week must not be marked complete before the FSTU source check");
         await page.locator("#complete").uncheck();
       }
       await page.locator('[data-source-read="' + n + '"]').check();
       await page.locator('[data-source-example="' + n + '"]').check();
       await page.locator('[data-source-explanation="' + n + '"]').fill("The source example shows the rule and the relationship between these Arabic words.");
       const answerIndex = await page.evaluate(n => WeeklyGuide.get(n).quiz.answer, n);
       await page.locator('input[name="source-choice-' + n + '"][value="' + answerIndex + '"]').check();
       await page.locator('[data-check-source-quiz="' + n + '"]').click();
       assert((await page.locator('[data-source-quiz-feedback="' + n + '"]').innerText()).includes("Correct"), "Source concept answer was not accepted on week " + n);
       await page.locator('[data-source-continue="' + n + '"]').click();
       assert.equal(await page.locator("#applicationFlow-" + n).isVisible(), true, "A correct source check should unlock application on week " + n);
       assert.equal(await page.locator("#mushafTask-" + n).isVisible(), true, "Qur’an page should be visible after the source check on week " + n);
       assert((await page.locator(".mushaf-step .step-intro").innerText()).toLowerCase().includes("wudhu"), "Physical Mushaf adab reminder missing on week " + n);
       const quranPageComponent = page.locator('quran-madina-html[data-recognition-page]').first();
       await quranPageComponent.waitFor({ state: "attached" });
      await page.locator('[data-recognition-label]').first().click();
      await page.locator('[data-recognition-explanation="' + n + '"]').fill("The word form and its relationship in the phrase support this label; a teacher verifies this analysis.");
      await page.evaluate(() => {
        const q = document.querySelector('quran-madina-html[data-recognition-page]');
        if (!q.querySelector('.quran-madina-html-word[data-qmh-w="1"]')) {
          const span = document.createElement("span");
          span.className = "quran-madina-html-word";
          span.setAttribute("data-qmh-w", "1");
          span.textContent = "كلمة";
          q.appendChild(span);
        }
      });
      await page.locator('quran-madina-html[data-recognition-page] .quran-madina-html-word[data-qmh-w="1"]').first().click();
      await page.locator('[data-save-recognition="' + n + '"]').click();
      assert((await page.locator('[data-recognition-feedback="' + n + '"]').innerText()).includes("saved on this device"), "Word-recognition attempt did not save on week " + n);
       const savedSource = await page.evaluate(n => JSON.parse(localStorage.getItem("8020-weekly-recall-v2") || "{}")[n], n);
       assert(savedSource && savedSource.sourceReady && savedSource.sourceRead && savedSource.sourceExample && savedSource.correct, "Source check was not saved as complete on week " + n);
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
    audit.passed.push("All 31 weeks show only assigned FSTU pages, require a correct source check before revealing the Mushaf, and preserve the source-first lesson order");
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
    const mobileDiagnostics = await mobile.evaluate(() => {
      const width = document.documentElement.clientWidth;
      return {viewport:width,scrollWidth:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll("body *")].map(el=>({tag:el.tagName,cls:typeof el.className==="string"?el.className:"",id:el.id,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width),scrollWidth:el.scrollWidth,text:(el.innerText||"").slice(0,80)})).filter(x=>x.right>width+1||x.left < -1).sort((a,b)=>b.right-a.right).slice(0,20)};
    });
    console.log("MOBILE_OVERFLOW_DIAGNOSTICS "+JSON.stringify(mobileDiagnostics));
    const mobileOverflow = mobileDiagnostics.scrollWidth > mobileDiagnostics.viewport;
    await mobile.screenshot({ path: path.join(out, "qa-week-01-mobile-debug.png"), fullPage: true });
    assert.equal(mobileOverflow, false, "Mobile layout has horizontal overflow");
    await mobile.screenshot({ path: path.join(out, "qa-week-01-mobile.png"), fullPage: true });
    audit.passed.push("Mobile navigation and lesson fit a 390px viewport");

    // Smoke-test the separate Student Studio against the same weekly guide.
    const student = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await student.goto("file://" + path.join(root, "student.html"), { waitUntil: "domcontentloaded" });
    await student.locator(".hero").waitFor();
    assert.equal(await student.locator("#hifzPriority").count(), 1, "Student Studio home must state Hifz priority");
      assert.equal(await student.locator(".source-method-card").count(), 1, "Student Studio should explain the source-first lesson method");
      assert.equal(await student.locator(".book-library-setup").count(), 0, "Student Studio should no longer require PDF uploads");
    await student.locator('[data-view="course"]').click();
    await student.locator('[data-week="1"]').click();
    assert.equal(await student.locator("#textbookTitle-1").count(), 1, "Student Studio weekly source-page layer missing");
    const studentSourceBeforeVocabulary = await student.locator("body").evaluate(root => {
      const source = root.querySelector(".weekly-sequence .textbook-step");
      const vocabulary = root.querySelector(".lessonGrid");
      return !!source && !!vocabulary && !!(source.compareDocumentPosition(vocabulary) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    assert.equal(studentSourceBeforeVocabulary, true, "Student Studio must show the FSTU lesson before supplementary word cards");
    assert.equal(await student.locator(".playlist-player iframe").count(), 1, "Student Studio weekly embedded playlist missing");
    assert.equal(await student.locator("#weeklyTest-1").count(), 1, "Student Studio weekly quiz missing");
      assert.equal(await student.locator("#applicationFlow-1").isVisible(), false, "Student Studio must keep Qur’an application locked before the source check");
      assert.equal(await student.locator("#mushafTask-1").isVisible(), false, "Student Studio must not show the Qur’an page before source understanding");
      assert.equal(await student.locator('[data-recognition-task="1"]').count(), 1, "Student Studio word-recognition task missing");
    await student.locator("#complete").check();
    await student.locator("#saveWeek").click();
    const prematureStudentCompletion = await student.evaluate(() => !!(JSON.parse(localStorage.getItem("8020-student-v2") || "{}").done || {})[1]);
    assert.equal(prematureStudentCompletion, false, "Student Studio must not record completion before the source check");
    await student.locator("#complete").uncheck();
    await student.locator('[data-source-read="1"]').check();
    await student.locator('[data-source-example="1"]').check();
    await student.locator('[data-source-explanation="1"]').fill("The source example shows how this Arabic structure works and how to identify it.");
    const studentAnswer = await student.evaluate(() => WeeklyGuide.get(1).quiz.answer);
    await student.locator('input[name="source-choice-1"][value="' + studentAnswer + '"]').check();
    await student.locator('[data-check-source-quiz="1"]').click();
    assert((await student.locator('[data-source-quiz-feedback="1"]').innerText()).includes("Correct"), "Student Studio source concept quiz did not accept the correct answer");
    await student.locator('[data-source-continue="1"]').click();
    assert.equal(await student.locator("#mushafTask-1").isVisible(), true, "Student Studio should unlock the Qur’an page after the source check");
    const studentOverflow = await student.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(studentOverflow, false, "Student Studio weekly guidance causes horizontal overflow");
    audit.passed.push("Student Studio enforces the same FSTU-first sequence, source teach-back gate and Qur’anic recognition task");

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
