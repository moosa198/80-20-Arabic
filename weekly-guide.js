/* 80/20 Arabic — shared weekly Hifz-first guide.
   Keep weekly page/resource guidance here so both student interfaces stay aligned.
   FSTU page numbers are never guessed: see fstuStatus and the visible edition-check note.
*/
(function (root) {
  "use strict";

  var CORE_PLAYLIST = "https://youtube.com/playlist?list=PLXJPAz2MwdUCSoBK47tg79-BeIF9w2toa";
  var BONUS_PLAYLIST = "https://youtube.com/playlist?list=PLe15deUUtdVLEWAMlit0drqO3Cjm7zYY7";
  var NAHW_RESOURCES = "https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources";
  var SARF_RESOURCES = "https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources";

  var WEEKS = {
    1:  { passage: "Yā-Sīn 1–12", page: 440, nahw: "Classify اسم (noun), فعل (verb) and حرف (particle); justify one choice from a visible clue.", sarf: "Recognise completed/past and ongoing/imperfect verb forms without trying to memorise a full paradigm.", media: "word types and basic verb forms", legacy: true },
    2:  { passage: "Al-Mulk 1–12", page: 562, nahw: "Recognise a nominal sentence (جملة اسمية), its topic (مبتدأ) and predicate (خبر).", sarf: "Briefly retrieve familiar verb forms only; the main objective is sentence structure.", media: "nominal sentences, mubtada and khabar" },
    3:  { passage: "An-Naba 1–29", page: 582, nahw: "Recognise a verbal sentence (جملة فعلية), doer (فاعل) and, where present, object (مفعول به).", sarf: "Notice the full verb form and the person encoded in it.", media: "verbal sentences, subject and object" },
    4:  { passage: "Yā-Sīn 13–27", page: 441, nahw: "Recognise a preposition (حرف جر) and its linked phrase (جار ومجرور).", sarf: "Notice attached pronouns (ضمير متصل) inside complete words.", media: "prepositions and attached pronouns" },
    5:  { passage: "Al-Mulk 13–26", page: 563, nahw: "Trace conjunctions (عطف) and explain what the link joins or contributes.", sarf: "Retrieve a familiar verb form only if it supports the reading.", media: "conjunctions and links" },
    6:  { passage: "Al-Mulk 1–12", page: 562, nahw: "Recognise an iḍāfah (إضافة): first noun (مضاف) and second noun (مضاف إليه).", sarf: "Read the full word before deciding whether a suffix is attached.", media: "iḍāfah and linked nouns" },
    7:  { passage: "Selected verses from Al-Muṭaffifīn", page: 588, nahw: "Recognise separate and attached pronouns (ضمير / ضمير متصل) and what they refer to.", sarf: "Notice person/number clues inside verb forms; do not detach endings from the whole word.", media: "pronouns and attached forms" },
    8:  { passage: "Al-Fātiḥah — checkpoint 1", page: 1, checkpoint: true, nahw: "Retrieve the first-phase structures from memory; use FSTU only to correct a specific uncertainty.", sarf: "No new Ṣarf assignment: retrieve familiar forms from the first phase.", media: "review of foundations" },
    9:  { passage: "An-Naba 31–40", page: 583, nahw: "Recognise a descriptive pair (نعت + منعوت) and compare agreement clues.", sarf: "Use word form only as one clue; confirm the role from context.", media: "adjectives and agreement" },
    10: { passage: "Al-Aʿlā", page: 591, nahw: "Find a relative pronoun (اسم موصول) and its completing clause (صلة الموصول).", sarf: "Recognise familiar word forms without requiring a full derivation.", media: "relative pronouns and clauses" },
    11: { passage: "Al-ʿĀdiyāt", page: 600, nahw: "Recognise إِنَّ وأخواتها and the role of emphasis (توكيد) in the statement.", sarf: "Review a familiar verb/word form only where it helps identify the structure.", media: "inna and emphasis" },
    12: { passage: "Al-Ghāshiyah", page: 592, nahw: "Notice how كان وأخواتها and ليس affect the parts of a statement.", sarf: "Distinguish the full form in context; do not infer a meaning from one letter alone.", media: "kāna, laysa and nominal sentences" },
    13: { passage: "Al-Humazah", page: 601, nahw: "Compare common negation markers (نفي) and observe the form that follows.", sarf: "Compare the base verb with the form following the negation marker.", media: "negation markers" },
    14: { passage: "Al-Burūj", page: 590, nahw: "Recognise the passive (مبني للمجهول) and its نائب الفاعل where appropriate.", sarf: "Compare visible active/passive form patterns; confirm the reading with the teacher.", media: "passive voice and word forms" },
    15: { passage: "Al-Ghāshiyah 8–16", page: 592, nahw: "Notice how a word functions in the phrase before naming its grammatical category.", sarf: "Compare اسم الفاعل and اسم المفعول as common patterns, without treating shape as proof.", media: "active and passive participles" },
    16: { passage: "Al-Fātiḥah — checkpoint 2", page: 1, checkpoint: true, nahw: "Retrieve the second-phase structures from memory; revisit FSTU only for a specific correction.", sarf: "No new Ṣarf assignment: retrieve previously studied forms.", media: "review of relationships and descriptions" },
    17: { passage: "Yā-Sīn 28–40", page: 442, nahw: "Recognise a condition (شرط), its result (جواب الشرط) or an exception (استثناء).", sarf: "Read the whole verb form and identify what it reveals about the action.", media: "conditions and exceptions" },
    18: { passage: "Al-Infiṭār 1–19", page: 587, nahw: "Recognise question markers (استفهام) and direct address (نداء).", sarf: "Observe the full vocalised form before explaining the meaning.", media: "questions and direct address" },
    19: { passage: "Selected passage from Al-Fajr", page: 593, nahw: "Notice an oath (قسم) or time/place expression (ظرف) and the statement it frames.", sarf: "Recognise a weak form (فعل معتل) as a pattern clue; do not overanalyse.", media: "oaths, time markers and weak forms" },
    20: { passage: "An-Nāziʿāt 34–46", page: 584, nahw: "Find an expression of time/place (ظرف) and explain what it attaches to.", sarf: "Keep each word inside its phrase when considering its form.", media: "time/place expressions and clauses" },
    21: { passage: "Al-Bayyinah 1–8", page: 599, nahw: "Recognise a purpose expression, including لام التعليل, and the action it introduces.", sarf: "Identify familiar forms in the phrase; do not treat purpose and morphology as the same question.", media: "purpose expressions" },
    22: { passage: "Aḍ-Ḍuḥā and Ash-Sharḥ", page: 596, nahw: "Recognise a circumstantial qualifier (حال) and identify the person or thing whose state it describes.", sarf: "Observe descriptive word forms and confirm the function from context.", media: "ḥāl and descriptions" },
    23: { passage: "Al-Balad", page: 594, nahw: "Recognise number (عدد) and the dual (مثنّى) where it appears.", sarf: "Inspect endings and complete forms; do not assume every ending represents a dual.", media: "number and the dual" },
    24: { passage: "Al-Fātiḥah — checkpoint 3", page: 1, checkpoint: true, nahw: "Retrieve the connected-meaning phase; use the Mushaf and Arabic evidence before checking notes.", sarf: "No new Ṣarf assignment: review only the forms needed to explain an answer.", media: "review of connected meaning" },
    25: { passage: "Al-Kahf 5–8", page: 294, nahw: "Use context to distinguish the possible functions of من and ما; avoid a single memorised translation.", sarf: "Check the complete expression and surrounding words before selecting a meaning.", media: "context-sensitive particles" },
    26: { passage: "Al-Bayyinah 1–8", page: 599, nahw: "Distinguish emphasis (توكيد) from restriction (قصر) and show what the marker does.", sarf: "Recognise recurring forms but confirm their role from the whole phrase.", media: "emphasis and restriction" },
    27: { passage: "Al-Fajr 21–30", page: 593, nahw: "Recognise مفعول مطلق where the expression reinforces or characterises an action.", sarf: "Compare repeated or related word forms and notice shared roots.", media: "repetition and the absolute object" },
    28: { passage: "Al-Kahf 1–4", page: 293, nahw: "Separate the main statement from its connected clauses (جملة / صلة الموصول) and track the links.", sarf: "Notice who is referred to in repeated forms, keeping each form in context.", media: "relative clauses and connected statements" },
    29: { passage: "Al-Māʿūn", page: 602, nahw: "Trace conjunctions (عطف) and explain which words, phrases or statements they connect.", sarf: "Use recurring verb forms as recognition clues, not as a new conjugation task.", media: "conjunctions and sentence links" },
    30: { passage: "Al-Ikhlāṣ, Al-Falaq and An-Nās", page: 604, nahw: "Compare recurring small markers and explain their function from the surrounding words.", sarf: "Compare familiar forms in short sūrahs and state what the evidence does and does not show.", media: "small markers in short sūrahs" },
    31: { passage: "A full page chosen from the student's memorised Qur'an", page: null, capstone: true, nahw: "Use the index to revisit only the structure that could not be justified; do not begin a new unit.", sarf: "Check a word form only where it helps explain the chosen passage.", media: "independent analysis of a familiar page" }
  };

  function esc(value, custom) {
    if (typeof custom === "function") return custom(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function get(week) { return WEEKS[Number(week)] || WEEKS[31]; }

  function renderPriority() {
    return '<section id="hifzPriority" class="weekly-guide hifz-priority" aria-labelledby="hifzPriorityTitle">' +
      '<div class="guide-eyebrow">PRIORITY 1 · HIFZ FIRST</div>' +
      '<h2 id="hifzPriorityTitle">Complete your Hifz targets first</h2>' +
      '<p>Complete your teacher-assigned <b>Sabaq</b>, <b>Sabaq Sipara / Sabqi</b> and <b>Dhor / Dawr</b> first. Arabic is a small aid to your Hifz, not a competing target. If your Hifz work is unfinished or you are tired, defer the Arabic task without guilt.</p>' +
      '<p class="guide-small">Your Hifz teacher’s priorities always take precedence over this optional Arabic supplement.</p>' +
      '</section>';
  }

  function renderMushafTask(week, options) {
    options = options || {};
    var n = Number(week), d = get(n);
    var passage = options.passage || d.passage;
    var page = d.page;
    var apply = options.apply || "Find one example of this week's idea, point to the Arabic evidence and explain it in your own words.";
    var pageText = page == null
      ? "Choose a full page from your own memorised Qur’an with your teacher."
      : "Madani 15-line Mushaf · p. " + page;
    var pageNote = page == null
      ? "Use a page you already know well. This is a capstone task, not a new Hifz assignment."
      : "Page numbering can differ between editions. Confirm the page and passage in your own Mushaf before beginning.";
    return '<section class="weekly-guide mushaf-gate" aria-labelledby="mushafTitle-' + n + '">' +
      '<div class="guide-eyebrow">QUR’AN APPLICATION · PREPARE FIRST</div>' +
      '<h2 id="mushafTitle-' + n + '">Make wudhu before handling your Mushaf</h2>' +
      '<p>Before touching the physical Qur’an page, make wudhu and follow your Hifz teacher’s instructions. This reminder is here to help you prepare before the page activity.</p>' +
      '<label class="guide-check"><input type="checkbox" id="wudhuReady-' + n + '"> <span>I have made wudhu and am ready to handle my Mushaf.</span></label>' +
      '<div class="guide-actions"><button type="button" class="btn guide-reveal" id="revealMushaf-' + n + '" disabled>Show this week’s Mushaf task</button><span class="guide-small">The task stays hidden until you confirm readiness.</span></div>' +
      '<div id="mushafTask-' + n + '" class="mushaf-task" hidden>' +
      '<div class="mushaf-reference"><span class="guide-eyebrow">TARGET PASSAGE</span><h3>' + esc(passage, options.esc) + '</h3><p><b>' + esc(pageText, options.esc) + '</b></p><p class="guide-small">' + esc(pageNote, options.esc) + '</p></div>' +
      '<p class="mushaf-application">' + esc(apply, options.esc) + '</p>' +
      '<div class="guide-tasks"><label class="guide-check"><input type="checkbox"> <span>I found the feature in the stated passage.</span></label><label class="guide-check"><input type="checkbox"> <span>I can point to the exact Arabic clue.</span></label><label class="guide-check"><input type="checkbox"> <span>I can explain one thing I noticed without reading a translation first.</span></label></div>' +
      '<div class="appreciation-question"><b>One thing I noticed</b><p>What did you notice in this Qur’anic passage today that you had not noticed before?</p><div class="reflection-lines" aria-hidden="true"></div><div class="reflection-lines" aria-hidden="true"></div></div>' +
      '</div></section>';
  }

  function renderStudySupport(week, options) {
    options = options || {};
    var n = Number(week), d = get(n);
    var nahwText = options.nahw || d.nahw;
    var sarfText = options.sarf || d.sarf;
    var note = options.fstu || "";
    var pageStatus;
    if (d.checkpoint) {
      pageStatus = "This is a retrieval checkpoint: no new FSTU page is required. Review the previous phase and only return to a page needed to correct a specific uncertainty.";
    } else if (d.capstone) {
      pageStatus = "No new chapter is assigned. Use the index to revisit only the page for a concept you could not justify.";
    } else if (d.legacy) {
      pageStatus = "The saved legacy Week 1 guide lists Naḥw Unit 1 pp. 8–28 and Ṣarf Unit 1 pp. 16–41. These are broad ranges, not a verified short weekly assignment. Confirm the edition and select one relevant example/exercise only.";
    } else {
      pageStatus = "Exact page and exercise numbers have not been verified against the edition your students use. The teacher should fill in the matching page and select one short example/exercise before assigning it. Do not guess page numbers or assign a whole unit.";
    }

    return '<section class="weekly-guide fstu-guide" aria-labelledby="fstuTitle-' + n + '">' +
      '<div class="guide-eyebrow">TARGETED PRACTICE · ONLY AS MUCH AS HELPS</div><h2 id="fstuTitle-' + n + '">FSTU Naḥw (نحو) and Ṣarf (صرف)</h2>' +
      '<div class="fstu-focus-grid"><article class="fstu-focus"><h3>Naḥw · نحو</h3><p>' + esc(nahwText, options.esc) + '</p><a href="' + NAHW_RESOURCES + '" target="_blank" rel="noreferrer">FSTU Naḥw text and resources ↗</a></article>' +
      '<article class="fstu-focus sarf-focus"><h3>Ṣarf · صرف</h3><p>' + esc(sarfText, options.esc) + '</p><a href="' + SARF_RESOURCES + '" target="_blank" rel="noreferrer">FSTU Ṣarf text and resources ↗</a></article></div>' +
      '<div class="edition-note"><b>Page-level assignment status</b><p>' + esc(pageStatus, options.esc) + '</p><p class="guide-small">Keep this task small: choose one example or exercise, stop once you can recognise and explain the feature, and return to Hifz.</p></div>' +
      (note ? '<details class="lesson-note"><summary>Existing course note</summary><p>' + esc(note, options.esc) + '</p></details>' : '') +
      '<div class="optional-media"><div class="guide-eyebrow">OPTIONAL REINFORCEMENT · NEVER REQUIRED</div><h3>Want to revisit this week’s idea?</h3><p>Look for a short explanation of <b>' + esc(d.media, options.esc) + '</b> in the playlists below, or ask your teacher to choose a relevant recording. Exact video titles and timestamps have not been verified; playlist order is not the course order.</p>' +
      '<p><a href="' + CORE_PLAYLIST + '" target="_blank" rel="noreferrer">Core Arabic lesson playlist ↗</a></p>' +
      '<p><a href="' + BONUS_PLAYLIST + '" target="_blank" rel="noreferrer">Bonus listening playlist ↗</a></p>' +
      '<p class="guide-small">Skipping a video never blocks lesson completion.</p></div></section>';
  }

  function bind(week) {
    var n = Number(week);
    var ready = root.document && root.document.getElementById("wudhuReady-" + n);
    var reveal = root.document && root.document.getElementById("revealMushaf-" + n);
    var task = root.document && root.document.getElementById("mushafTask-" + n);
    if (!ready || !reveal || !task) return;
    ready.addEventListener("change", function () { reveal.disabled = !ready.checked; });
    reveal.addEventListener("click", function () {
      if (!ready.checked) return;
      task.hidden = false;
      reveal.textContent = "Mushaf task revealed";
      reveal.disabled = true;
      task.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  root.WeeklyGuide = {
    get: get,
    renderPriority: renderPriority,
    renderMushafTask: renderMushafTask,
    renderStudySupport: renderStudySupport,
    bind: bind,
    playlists: { core: CORE_PLAYLIST, bonus: BONUS_PLAYLIST }
  };
}(window));
