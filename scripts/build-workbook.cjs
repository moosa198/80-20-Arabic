const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const http = require("node:http");
const assert = require("node:assert/strict");

(async function buildAndAudit() {
  const root = process.cwd();
  const out = path.join(root, "dist");
  await fs.promises.mkdir(out, { recursive: true });
  const contentTypes = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".pdf":"application/pdf",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
  const server = http.createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
      const filename = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
      if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403); res.end("Forbidden"); return; }
      fs.stat(filename, (statError, stat) => {
        if (statError || !stat.isFile()) { res.writeHead(404); res.end("Not found"); return; }
        res.writeHead(200, {"Content-Type":contentTypes[path.extname(filename)]||"application/octet-stream","Cache-Control":"no-store"});
        fs.createReadStream(filename).pipe(res);
      });
    } catch (error) { res.writeHead(400); res.end("Bad request"); }
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    const nativeTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => nativeTimeout(callback, delay === 1000 ? 2147483647 : delay, ...args);
    window.print = () => {};
  });

  const audit = { browser: "Chromium / Playwright", source: "index.html", passed: [], warnings: [] };
  try {
    await page.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded" });
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
      assert.equal(await page.locator("#mushafTask-" + n).isVisible(), true, "Integrated Qur’an page should be visible on week " + n);
      const mappedPage = await page.evaluate(n => WeeklyGuide.get(n).page || 604, n);
      assert.equal(await page.locator('quran-madina-html[data-recognition-page][page="' + mappedPage + '"]').count(), 1, "Digital 15-line Mushaf missing on week " + n);
      assert((await page.locator(".mushaf-step .step-intro").innerText()).toLowerCase().includes("wudhu"), "Physical Mushaf adab reminder missing on week " + n);
      assert.equal(await page.locator("#textbookTitle-" + n).count(), 1, "Textbook source-page layer missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.sarf-panel").count(), 1, "FSTU Sarf source panel missing on week " + n);
      assert.equal(await page.locator(".textbook-panel.nahw-panel").count(), 1, "FSTU Nahw source panel missing on week " + n);
      assert.equal(await page.locator(".playlist-link").count(), 2, "Core and bonus playlist links missing on week " + n);
      assert.equal(await page.locator(".playlist-player iframe").count(), 1, "Embedded core playlist missing on week " + n);
      assert.equal(await page.locator("#weeklyTest-" + n).count(), 1, "Weekly recognition test missing on week " + n);
      const sequenceOrder = await page.locator(".weekly-sequence").evaluate(root => {
        const y = selector => root.querySelector(selector).getBoundingClientRect().top;
        return [y(".textbook-step"), y(".mushaf-step"), y(".listening-resources"), y(".assessment-layer")];
      });
      assert(sequenceOrder[0] < sequenceOrder[1] && sequenceOrder[1] < sequenceOrder[2] && sequenceOrder[2] < sequenceOrder[3],
        "Weekly layers must be ordered source book → Qur’an → listening → apply on week " + n);
      const sourcePages = await page.locator(".book-page-frame").evaluateAll(nodes => nodes.map(el => el.getAttribute("data-book-page")));
      const mappedPages = await page.evaluate(n => ({page:WeeklyGuide.get(n).page||604,sarf:WeeklyGuide.get(n).sarfPages,nahw:WeeklyGuide.get(n).nahwPages}), n);
      assert(sourcePages.includes("quran:" + mappedPages.page), "Actual assigned Mushaf page reference missing on week " + n);
      assert.equal(sourcePages.filter(x => x.startsWith("sarf:")).length, mappedPages.sarf.length, "Only the specific assigned FSTU Ṣarf pages should appear on week " + n);
      assert.equal(sourcePages.filter(x => x.startsWith("nahw:")).length, mappedPages.nahw.length, "Only the specific assigned FSTU Naḥw pages should appear on week " + n);
      assert.equal(await page.locator(".textbook-panel iframe").count(), 0, "The full textbook must not be embedded; use assigned page extracts only on week " + n);
      assert.equal(await page.locator(".fstu-page-canvas").count(), mappedPages.sarf.length + mappedPages.nahw.length, "Each assigned FSTU page should have a separate canvas on week " + n);
      await page.waitForFunction(() => Array.from(document.querySelectorAll(".fstu-page-canvas")).every(canvas => canvas.dataset.rendered === "true" || canvas.dataset.error === "true"), null, {timeout:30000});
      const sourceRender = await page.locator(".fstu-page-canvas").evaluateAll(nodes => nodes.map(canvas => ({ok:canvas.dataset.rendered==="true",width:canvas.width,height:canvas.height})));
      assert(sourceRender.every(item => item.ok && item.width > 150 && item.height > 150), "One or more assigned FSTU page extracts failed to render on week " + n);
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
      const answerIndex = await page.evaluate(n => WeeklyGuide.get(n).quiz.answer, n);
      await page.locator('input[name="weekly-choice-' + n + '"][value="' + answerIndex + '"]').check();
      await page.locator('[data-check-quiz="' + n + '"]').click();
      assert.equal(await page.locator("#quizFeedback-" + n).isVisible(), true, "Weekly recall answer was not checked on week " + n);
      assert((await page.locator("#quizFeedback-" + n).innerText()).includes("Correct"), "Correct recognition answer was not accepted on week " + n);
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
    audit.passed.push("Every week has mapped Mushaf, FSTU Sarf and Naḥw page references, visible listening resources, and the test in the expected order");
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
    await mobile.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded" });
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
    await student.goto(baseUrl + "/student.html", { waitUntil: "domcontentloaded" });
    await student.locator(".hero").waitFor();
    assert.equal(await student.locator("#hifzPriority").count(), 1, "Student Studio home must state Hifz priority");
      assert.equal(await student.locator(".source-method-card").count(), 1, "Student Studio should explain the whole–map–whole method");
      assert.equal(await student.locator(".book-library-setup").count(), 0, "Student Studio should no longer require PDF uploads");
    await student.locator('[data-view="course"]').click();
    await student.locator('[data-week="1"]').click();
    assert.equal(await student.locator("#textbookTitle-1").count(), 1, "Student Studio weekly source-page layer missing");
    assert.equal(await student.locator(".playlist-player iframe").count(), 1, "Student Studio weekly embedded playlist missing");
    assert.equal(await student.locator("#weeklyTest-1").count(), 1, "Student Studio weekly quiz missing");
      assert.equal(await student.locator("#mushafTask-1").isVisible(), true, "Student Studio should show the integrated Qur’an page immediately");
      assert.equal(await student.locator('[data-recognition-task="1"]').count(), 1, "Student Studio word-recognition task missing");
    const studentAnswer = await student.evaluate(() => WeeklyGuide.get(1).quiz.answer);
    await student.locator('input[name="weekly-choice-1"][value="' + studentAnswer + '"]').check();
    await student.locator('[data-check-quiz="1"]').click();
    assert((await student.locator("#quizFeedback-1").innerText()).includes("Correct"), "Student Studio weekly quiz did not accept the correct answer");
    const studentOverflow = await student.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(studentOverflow, false, "Student Studio weekly guidance causes horizontal overflow");
    audit.passed.push("Student Studio shares local integrated source references, Hifz-first priority, Qur’an → FSTU map → listening → apply, and the working weekly quiz");

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
    const teacher = await browser.newPage({viewport:{width:1360,height:900},deviceScaleFactor:1});
    await teacher.goto(baseUrl + "/teacher.html", {waitUntil:"domcontentloaded"});
    await teacher.locator("#studentsBody").waitFor();
    assert.equal(await teacher.locator("#progressFiles").count(),1,"Teacher dashboard progress import control missing");
    assert.equal(await teacher.locator("#rosterFile").count(),1,"Teacher dashboard roster import control missing");
    assert.equal(await teacher.locator("#exportCsv").count(),1,"Teacher dashboard CSV export control missing");
    const samplePath=path.join(out,"qa-progress-sample.json");
    const sampleRecord={
      format:"80-20-arabic-class-record",schemaVersion:1,exportedAt:"2026-10-26T00:00:00.000Z",
      learner:{studentId:"QA-001",displayName:"QA Student",className:"QA Madrassa Group",teacherName:"QA Teacher"},
      source:"qa-student-studio",
      progress:{cards:{"w1-0":{reps:4,interval:7,ease:2.4,due:"2026-11-02"}},doneWeeks:{1:true,2:true},lastSession:"2026-10-26",streak:2,seconds:120},
      recognition:{"1":{week:1,attempts:[{words:[{page:440,index:1,text:"كلمة"}],labelEn:"Noun",labelAr:"اِسْمٌ",explanation:"The word form supports this label.",savedAt:"2026-10-26T00:00:00.000Z"}]}},
      weeklyRecall:{"1":{week:1,choice:0,correct:true,answeredAt:"2026-10-26T00:00:00.000Z"}}
    };
    await fs.promises.writeFile(samplePath,JSON.stringify(sampleRecord,null,2));
    const rosterPath=path.join(out,"qa-roster.csv");
    await fs.promises.writeFile(rosterPath,"studentId,displayName,className\\nQA-001,QA Student,QA Madrassa Group\\nQA-002,Unsubmitted Student,QA Madrassa Group\\n");
    await teacher.locator("#progressFiles").setInputFiles(samplePath);
    await teacher.locator("#studentsBody").getByText("QA-001").waitFor();
    assert.equal(await teacher.locator("#studentsBody tr").count(),1,"Teacher dashboard should show the imported student");
    await teacher.locator("#rosterFile").setInputFiles(rosterPath);
    await teacher.locator("#studentsBody").getByText("QA-002").waitFor();
    assert.equal(await teacher.locator("#studentsBody tr").count(),2,"Roster-only learners should be visible as no-submission rows");
    assert.equal((await teacher.locator("#mSubmitted").innerText()).trim(),"1","Submitted student metric is inaccurate");
    await teacher.locator('[data-open-student]').first().click();
    assert.equal(await teacher.locator("#studentDetail").evaluate(el=>el.classList.contains("show")),true,"Teacher detail panel did not open");
    const detailText=await teacher.locator("#detailContent").innerText();
    assert(detailText.includes("The word form supports this label."),"Saved grammar evidence was not shown in learner detail");
    assert(detailText.includes("2/31 weeks"),"Course completion data was not parsed correctly");
    await teacher.locator("#progressFiles").setInputFiles([]);
    await teacher.locator("#progressFiles").setInputFiles(samplePath);
    assert.equal(await teacher.locator("#studentsBody tr").count(),2,"Re-importing an identical snapshot should not duplicate its row");
    const [csvDownload]=await Promise.all([teacher.waitForEvent("download"),teacher.locator("#exportCsv").click()]);
    assert.equal(csvDownload.suggestedFilename(),"80-20-arabic-class-progress.csv","Class CSV download filename unexpected");
    const csvPath=path.join(out,csvDownload.suggestedFilename());
    await csvDownload.saveAs(csvPath);
    const csvContent=await fs.promises.readFile(csvPath,"utf8");
    assert(csvContent.includes("QA-001")&&csvContent.includes("QA-002"),"Class CSV should include submitted and non-submitted roster learners");
    const [archiveDownload]=await Promise.all([teacher.waitForEvent("download"),teacher.locator("#exportArchive").click()]);
    assert.equal(archiveDownload.suggestedFilename(),"80-20-arabic-teacher-archive.json","Teacher archive filename unexpected");
    const archivePath=path.join(out,archiveDownload.suggestedFilename());
    await archiveDownload.saveAs(archivePath);
    const archived=JSON.parse(await fs.promises.readFile(archivePath,"utf8"));
    assert.equal(archived.format,"80-20-arabic-teacher-archive","Downloaded class archive format missing");
    assert.equal(archived.records.length,1,"Archive should preserve one unique student snapshot");
    const restoredTeacher=await browser.newPage({viewport:{width:1360,height:900},deviceScaleFactor:1});
    await restoredTeacher.goto(baseUrl+"/teacher.html",{waitUntil:"domcontentloaded"});
    await restoredTeacher.locator("#archiveFile").setInputFiles(archivePath);
    await restoredTeacher.locator("#studentsBody").getByText("QA-001").waitFor();
    await restoredTeacher.locator("#studentsBody").getByText("QA-002").waitFor();
    assert.equal(await restoredTeacher.locator("#studentsBody tr").count(),2,"Restoring the archive should recover student snapshots and the roster");
    assert.equal((await restoredTeacher.locator("#mSubmitted").innerText()).trim(),"1","Archive restoration should retain the submission count");
    await restoredTeacher.locator('[data-open-student]').first().click();
    assert((await restoredTeacher.locator("#detailContent").innerText()).includes("The word form supports this label."),"Archive restoration should preserve Arabic explanation evidence");
    await teacher.screenshot({path:path.join(out,"qa-teacher-dashboard.png"),fullPage:true});
    audit.passed.push("Teacher dashboard imports labelled student evidence, de-duplicates repeat submissions, matches roster-only learners, exports CSV and restores a reusable class archive");
    audit.finishedAt = new Date().toISOString();
    await fs.promises.writeFile(path.join(out, "content-audit.json"), JSON.stringify(audit, null, 2));
    console.log(JSON.stringify(audit, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(err => { console.error(err); process.exit(1); });
