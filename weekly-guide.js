/* 80/20 Arabic — source-page-first weekly lesson sequence.
   Quran page numbers are the printed Madani 15-line page numbers.
   Quran PDF page index = printed Mushaf page + 1 (the supplied PDF has a cover).
   FSTU PDF page indices match the printed page numbers in the supplied editions.
*/
(function (root) {
  "use strict";

  var CORE_PLAYLIST = "https://youtube.com/playlist?list=PLXJPAz2MwdUCSoBK47tg79-BeIF9w2toa";
  var BONUS_PLAYLIST = "https://youtube.com/playlist?list=PLe15deUUtdVLEWAMlit0drqO3Cjm7zYY7";
  var NAHW_RESOURCES = "https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources";
  var SARF_RESOURCES = "https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources";

  var NAHW_PAGE_TITLES = {
    8:"Introduction: Words",12:"Characteristic 3: Number",17:"Part 2: Verbs",20:"Affirmative and Negative Verbs",21:"Summary of Negative Particles",27:"Part 3: Particles",34:"Introduction: Sentences",
    36:"Part 2: Prefixes",37:"ما المشبهة بليس",38:"Supplement: Pronouns",41:"The اسم of كان and ليس as a Pronoun",48:"Part 2: Object",49:"Part 3: Deputy Subject",50:"Adverbs of Place and Time",51:"Adverbs of Degree",
    52:"Adverbs of Frequency and مفعول مطلق للعدد",53:"Adverbs of Reason (مفعول لأجله)",54:"State",56:"Exclusion",57:"Supplement: Pronouns",
    65:"Descriptive Phrases",69:"Conjunction Phrases",72:"Possessive Phrases",
    76:"Emphatic Phrases",80:"Numeric Phrases",84:"Prepositional Phrase",
    93:"The خبر as a small sentence",95:"The حال as a small sentence",
    99:"The نعت as a small sentence",100:"The معطوف as a small sentence",
    101:"The مضاف إليه as a small sentence",117:"Relative Nouns and their صلة",
    125:"Polar Questions",127:"Non-Polar Questions",133:"Parenthetical Sentence",
    137:"Vocative Sentence",139:"Oath Sentence",140:"Conditional Sentence",
    145:"Result Sentence",150:"Index: English and Arabic"
  };
  var SARF_PAGE_TITLES = {
    16:"Introduction: verb + pronoun",17:"Verb conjugation",19:"Part 1: Past/perfect form",
    24:"Part 2: Imperfect form",29:"Part 3: Verb chapters",42:"Part 4: Passive verb",
    43:"Passive past form",57:"Part 6: Negating the verb",58:"Negation examples",
    60:"Part 7: Command and prohibition",62:"Prohibition",65:"Part 8: Active participle",
    68:"Part 8: Passive participle",70:"Part 9: Short conjugation table",
    72:"Sarf summary",73:"Sarf vocabulary"
  };

  var WEEKS = {
    1:{passage:"Yā-Sīn 1–12",page:440,nahwPages:[8],sarfPages:[19,24],
      nahw:"FSTU Naḥw, p. 8: classify words as اسم (noun), فعل (verb) or حرف (particle). Say the Arabic label with the English label.",
      sarf:"FSTU Ṣarf, pp. 19 and 24: compare a past/perfect verb (فعل ماضٍ) with an imperfect verb (فعل مضارع). Read whole forms; do not start by memorising the full table.",
      media:"word types and basic verb forms",
      quiz:{question:"Which three word types (أنواع الكلمة) are introduced in FSTU Naḥw?",options:["اسم، فعل، حرف — noun, verb, particle","مبتدأ، خبر، فاعل — topic, predicate, doer","ماضٍ، مضارع، أمر — past, imperfect, command"],answer:0,why:"The three broad word types are اسم (noun), فعل (verb) and حرف (particle). A verb's tense/form is a further distinction within فعل."}},
    2:{passage:"Al-Mulk 1–12",page:562,nahwPages:[34],sarfPages:[19],
      nahw:"FSTU Naḥw, p. 34: find the topic/information relationship in a nominal sentence (جملة اسمية).",
      sarf:"FSTU Ṣarf, p. 19: keep an eye on the complete past/perfect verb form (فعل ماضٍ) when one appears in the passage. This is supporting recognition; the main target is sentence structure.",
      media:"nominal sentences, mubtada and khabar",
      quiz:{question:"A nominal sentence (جملة اسمية) commonly starts with its topic (مبتدأ), followed by the...",options:["predicate / information (خبر)","object (مفعول به)","prepositional phrase (جار ومجرور)"],answer:0,why:"The مبتدأ is the topic, and the خبر supplies information about it. Find the relationship in the Qur'anic line rather than relying on the first word alone."}},
    3:{passage:"An-Naba 1–29",page:582,nahwPages:[17,48],sarfPages:[19,24],
      nahw:"FSTU Naḥw, p. 17: verbs (فعل). Use p. 48 to review the object (مفعول به) when the verb takes one.",
      sarf:"FSTU Ṣarf, pp. 19 and 24: compare the whole past/perfect and imperfect forms (فعل ماضٍ / فعل مضارع).",
      media:"verbal sentences, subject and object",
      quiz:{question:"In a verbal sentence (جملة فعلية), which term identifies the doer of the action?",options:["فاعل — doer/subject","مبتدأ — topic of a nominal sentence","مجرور — noun in the genitive"],answer:0,why:"فاعل identifies the doer of the verb. A مفعول به, where present, is the object affected by the action. Use the whole sentence as evidence."}},
    4:{passage:"Yā-Sīn 13–27",page:441,nahwPages:[84],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 84: identify a prepositional phrase (جار ومجرور) and what it connects to.",
      sarf:"FSTU Ṣarf, p. 16: recognise how a verb and its pronoun (ضمير) can form one complete word. Do not isolate an attached piece from its word.",
      media:"prepositions and attached pronouns",
      quiz:{question:"A prepositional phrase (جار ومجرور) is recognised by...",options:["a preposition (حرف جر) linked to a noun in the genitive (مجرور)","a noun followed by an adjective (نعت) only","a verb followed by its doer (فاعل) only"],answer:0,why:"The preposition (حرف جر) governs a following noun in the genitive (مجرور); together they form جار ومجرور."}},
    5:{passage:"Al-Mulk 13–26",page:563,nahwPages:[69],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 69: follow a conjunction phrase (عطف) and say which words or clauses are linked.",
      sarf:"FSTU Ṣarf, p. 24: briefly retrieve the imperfect verb form (فعل مضارع) if it helps you read the linked clause. The new focus is the connection.",
      media:"conjunctions and links",
      quiz:{question:"The main job of conjunction (عطف) is to...",options:["link words, phrases or statements","turn every noun into a verb","show that a noun must be in the genitive (مجرور)"],answer:0,why:"A conjunction link tells you which items belong together. Identify the linked parts on the actual Mushaf page."}},
    6:{passage:"Al-Mulk 1–12",page:562,nahwPages:[72],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 72: read a possessive construction (إضافة) as a linked noun pair: مضاف then مضاف إليه.",
      sarf:"FSTU Ṣarf, p. 16: retrieve the idea of a pronoun (ضمير) as part of a complete form where relevant. Keep it as supporting review, not the main rule for إضافة.",
      media:"iḍāfah and linked nouns",
      quiz:{question:"In a possessive construction (إضافة), what is the role of the second noun?",options:["مضاف إليه — the genitive complement/possessor","مضاف — the first noun in the construction","فاعل — the doer of a verb"],answer:0,why:"In the usual إضافة sequence, the first noun is مضاف and the second is مضاف إليه. Read the two nouns as one linked unit."}},
    7:{passage:"Selected verses from Al-Muṭaffifīn",page:588,nahwPages:[38,57],sarfPages:[16,17],
      nahw:"FSTU Naḥw, pp. 38 and 57: review pronouns (ضمائر), including the patterns used to identify their referents.",
      sarf:"FSTU Ṣarf, pp. 16–17: see how a verb and its attached pronoun can indicate person, gender and number. Read the full form.",
      media:"pronouns and attached forms",
      quiz:{question:"When you notice an attached pronoun (ضمير متصل), what should you do first?",options:["Read the entire word and work out who/what the pronoun refers to","Translate the suffix alone without the word around it","Assume the suffix always names the doer (فاعل)"],answer:0,why:"An attached pronoun is part of a larger word. Its role depends on the complete form and context; it does not always name the doer."}},
    8:{passage:"Al-Fātiḥah — checkpoint 1",page:1,checkpoint:true,nahwPages:[8,34],sarfPages:[19,24],
      nahw:"Checkpoint review: use p. 8 for word types and p. 34 for the topic/information relationship. Do not treat this as a new unit.",
      sarf:"Checkpoint review: revisit pp. 19 and 24 only to help identify a complete verb form (فعل ماضٍ / فعل مضارع).",
      media:"review of foundations",
      quiz:{question:"Which answer best demonstrates recognition on Al-Fātiḥah, not just memorised translation?",options:["Point to an Arabic example, name the English + Arabic term, and explain the clue","Translate the whole sūrah but give no Arabic evidence","Name a grammar term without showing where it occurs"],answer:0,why:"A good recognition answer identifies the real Arabic evidence, names the paired terminology and explains the function."}},
    9:{passage:"An-Naba 31–40",page:583,nahwPages:[65,99],sarfPages:[65],
      nahw:"FSTU Naḥw, p. 65: descriptive phrases. Use p. 99 to revisit نعت as part of a wider structure.",
      sarf:"FSTU Ṣarf, p. 65: active participle (اسم الفاعل). Treat word shape as a clue, then confirm the descriptive relationship in context.",
      media:"adjectives and agreement",
      quiz:{question:"When checking a descriptive pair (نعت + منعوت), what should you compare?",options:["Agreement clues and the link between described noun and descriptor","Only the English translation","Only whether the words are next to each other"],answer:0,why:"Check the description (نعت) against the described noun (منعوت), including relevant agreement clues. Proximity alone is not proof."}},
    10:{passage:"Al-Aʿlā",page:591,nahwPages:[117],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 117: relative pronouns (اسم موصول) and the clause completing them (صلة الموصول).",
      sarf:"FSTU Ṣarf, p. 16: retrieve the role of pronouns (ضمير) in whole word forms as you trace who is being referred to.",
      media:"relative pronouns and clauses",
      quiz:{question:"What completes the meaning of a relative pronoun (اسم موصول)?",options:["صلة الموصول — the completing relative clause","مضاف إليه — the second noun in an إضافة","مفعول به — the object of a verb"],answer:0,why:"An اسم موصول links to a صلة الموصول. Read through the connected clause before deciding what the whole expression means."}},
    11:{passage:"Al-ʿĀdiyāt — opening oath",page:600,nahwPages:[139,27],sarfPages:[19],
      nahw:"The sūrah opens with وَالْعَادِيَاتِ: use p. 139 for the oath sentence (قسم) and p. 27 as a reference for the particle. Do not label this opening as إنّ.",
      sarf:"FSTU Ṣarf, p. 19: identify the full past/perfect form (فعل ماضٍ) where present; the grammar target is the particle/statement effect.",
      media:"oaths and emphatic openings",
      quiz:{question:"In وَالْعَادِيَاتِ, what is the opening و functioning as?",options:["The oath marker (واو القسم)","A conjunction linking two ordinary nouns (حرف عطف)","A negation marker (حرف نفي)"],answer:0,why:"At the start of this sūrah, وَالْعَادِيَاتِ is an oath: identify the oath marker, what is sworn by, and the statement that follows."}},
    12:{passage:"Al-Ghāshiyah",page:592,nahwPages:[34,65],sarfPages:[24],
      nahw:"Start with the complete nominal statement (جملة اسمية): in وُجُوهٌ يَوْمَئِذٍ خَاشِعَةٌ, ask what is the topic (مبتدأ) and what is said about it (خبر). Use p. 65 to compare a predicate with a descriptive adjective (نعت); do not assume every description is a نعت.",
      sarf:"FSTU Ṣarf, pp. 19 and 24: recognise the complete verb form before considering how the statement changes.",
      media:"nominal statements and the roles of words",
      quiz:{question:"In وُجُوهٌ يَوْمَئِذٍ خَاشِعَةٌ, what is the most useful first analysis?",options:["Read it as a nominal statement (جملة اسمية) and test the topic/predicate relationship (مبتدأ / خبر)","Assume خاشعة must always be an adjective (نعت)","Search for كان or ليس even though neither appears here"],answer:0,why:"Begin with the whole statement and its relationship. Distinguish the predicate (خبر) from an adjective (نعت) by the construction, not by English translation alone."}},
    13:{passage:"Al-Ikhlāṣ 3–4 — لم يلد ولم يولد",page:604,nahwPages:[20,21],sarfPages:[57,58],
      nahw:"Use pp. 20–21 for the forms of negation (نفي) and the grammatical clue they give. The selected verses contain لم يلد ولم يولد, so the target is actually present on the page.",
      sarf:"FSTU Ṣarf, p. 57: negation of the verb (نفي الفعل). Check both the negation marker and the form that follows it.",
      media:"negation and the form after لم",
      quiz:{question:"In لَمْ يَلِدْ, what should you recognise together?",options:["The negation marker (حرف نفي) and the jussive imperfect verb (فعل مضارع مجزوم)","A passive participle (اسم المفعول) and an adjective (نعت)","A possessive construction (إضافة)"],answer:0,why:"لم negates the imperfect verb and causes jussive mood. Identify the marker and the form it governs; do not learn the two as unrelated items."}},
    14:{passage:"Al-Burūj",page:590,nahwPages:[49],sarfPages:[42,43],
      nahw:"FSTU Naḥw, p. 49: the deputy subject (نائب الفاعل) in a passive construction.",
      sarf:"FSTU Ṣarf, pp. 42–43: the passive verb (الفعل المجهول), including the past passive form. Compare the complete word pattern.",
      media:"passive voice and word forms",
      quiz:{question:"In a passive construction (مبني للمجهول), what should you look for?",options:["The passive verb form and the نائب الفاعل","Only the doer (فاعل) stated in the usual way","A preposition phrase (جار ومجرور) in every case"],answer:0,why:"The passive construction foregrounds the action without naming the doer in the usual way. Look for the deputy subject (نائب الفاعل) where present."}},
    15:{passage:"Al-Burūj 1–3 — شاهد ومشهود",page:590,nahwPages:[65],sarfPages:[65,68],
      nahw:"Use p. 65 to explain the relationship between a described noun (منعوت) and its descriptor (نعت) when relevant; first identify the word forms on the page.",
      sarf:"FSTU Ṣarf, pp. 65 and 68: compare the active participle (اسم الفاعل) شاهد and the passive participle (اسم المفعول) مشهود.",
      media:"active and passive participles in the oath passage",
      quiz:{question:"In وَشَاهِدٍ وَمَشْهُودٍ, which pairing best matches the two word forms?",options:["شاهد — active participle (اسم الفاعل); مشهود — passive participle (اسم المفعول)","شاهد — passive participle (اسم المفعول); مشهود — active participle (اسم الفاعل)","Both are attached pronouns (ضمائر متصلة)"],answer:0,why:"The form and meaning reinforce each other: شاهد is a witness, while مشهود is that which is witnessed. Use full context to confirm."}},
    16:{passage:"Al-Fātiḥah — checkpoint 2",page:1,checkpoint:true,nahwPages:[65,117],sarfPages:[65,68],
      nahw:"Checkpoint review: revisit descriptive phrases (نعت) and relative expressions (اسم موصول) as needed; there is no new Naḥw unit.",
      sarf:"Checkpoint review: compare اسم الفاعل and اسم المفعول only if it helps justify a form.",
      media:"review of relationships and descriptions",
      quiz:{question:"What makes a checkpoint analysis reliable?",options:["A fresh Arabic example, the paired English + Arabic label, and a defensible clue","A remembered translation with no structure identified","A grammar label copied without applying it"],answer:0,why:"A checkpoint tests transfer. You must point to the real Arabic evidence and explain why the label fits."}},
    17:{passage:"Yā-Sīn 28–40",page:442,nahwPages:[56,27],sarfPages:[57,58],
      nahw:"The passage contains an exceptive/restrictive construction (استثناء), including إِلَّا صَيْحَةً وَاحِدَةً. Use p. 56 for exclusion and p. 27 as the general particles reference. Do not teach this passage primarily as a conditional sentence.",
      sarf:"FSTU Ṣarf, p. 24: recognise the imperfect verb (فعل مضارع) in a connected statement.",
      media:"exception, negation and restriction",
      quiz:{question:"When you meet إِلَّا in this passage, what must you identify?",options:["What is being excluded or restricted (استثناء) in the whole statement","The result of a condition (جواب الشرط) in every case","A possessive complement (مضاف إليه)"],answer:0,why:"إلا limits or excludes an item from the statement. Read what comes before and after it, then explain the scope."}},
    18:{passage:"Al-Infiṭār 1–19",page:587,nahwPages:[127,137],sarfPages:[16],
      nahw:"Use p. 127 for a non-polar question (استفهام غير تصديقي), as in مَا غَرَّكَ, and p. 137 for direct address (نداء), as in يَا أَيُّهَا الْإِنْسَانُ. Both are visible in this passage.",
      sarf:"FSTU Ṣarf, p. 16: read the whole verb form and any pronoun (ضمير) with it; do not assign a command/prohibition rule to this passage.",
      media:"question words and direct address",
      quiz:{question:"Which pair names this week's two main structures?",options:["استفهام — question; نداء — direct address/vocative","إضافة — possessive construction; عطف — conjunction","نفي — negation; شرط — condition"],answer:0,why:"استفهام introduces a question, while نداء is used for direct address. Find the relevant marker and explain its role."}},
    19:{passage:"Selected passage from Al-Fajr",page:593,nahwPages:[139,50],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 139: oath sentences (قسم). Use p. 50 to review time/place adverbs (ظرف) if they frame the statement.",
      sarf:"FSTU Ṣarf, p. 24: identify complete imperfect forms (فعل مضارع) where useful; do not overanalyse a weak form without need.",
      media:"oaths, time markers and weak forms",
      quiz:{question:"When you identify an oath (قسم), what should you do next?",options:["Identify the oath marker and the statement it frames","Assume every و is an oath marker","Ignore the statement after the oath"],answer:0,why:"A letter can have different functions in context. Show why the marker is functioning as an oath and explain the statement it frames."}},
    20:{passage:"An-Nāziʿāt 34–46",page:584,nahwPages:[50],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 50: adverbs of place/time (ظرف) and how they attach to a statement.",
      sarf:"FSTU Ṣarf, p. 24: revisit full imperfect forms (فعل مضارع) only as a support for reading the action.",
      media:"time/place expressions and clauses",
      quiz:{question:"A time/place expression (ظرف) tells you...",options:["when/where an action or situation is located","who the doer (فاعل) is in every sentence","which noun is the second part of an إضافة"],answer:0,why:"A ظرف indicates time or place in relation to an action or statement. Explain what the expression attaches to."}},
    21:{passage:"Al-Bayyinah 1–8",page:599,nahwPages:[53],sarfPages:[24],
      nahw:"This page contains لِيَعْبُدُوا اللهَ: the lām of purpose (لام التعليل) is the target. FSTU Naḥw p. 53 teaches the related but distinct purpose/reason object (مفعول لأجله); explain the difference rather than presenting them as the same construction.",
      sarf:"FSTU Ṣarf, p. 24: identify the complete verb form (فعل مضارع) that the purpose expression relates to.",
      media:"purpose expressions",
      quiz:{question:"In لِيَعْبُدُوا اللهَ, what does the lām introduce?",options:["Purpose (لام التعليل): the aim of the action","A possessive construction (إضافة)","The doer (فاعل) of the verb"],answer:0,why:"The purpose lām links the act to its aim. FSTU p. 53 is useful for comparing reason/purpose, but مفعول لأجله and لام التعليل are distinct forms."}},
    22:{passage:"Aḍ-Ḍuḥā and Ash-Sharḥ",page:596,nahwPages:[54,95],sarfPages:[65],
      nahw:"FSTU Naḥw, pp. 54 and 95: the circumstantial qualifier (حال), including a حال expressed as a clause.",
      sarf:"FSTU Ṣarf, p. 65: review the active participle (اسم الفاعل) as one possible form clue in descriptive wording.",
      media:"ḥāl and descriptions",
      quiz:{question:"A circumstantial qualifier (حال) usually tells you...",options:["the state/circumstance of a person or thing in a situation","the object (مفعول به) of every verb","the second noun in a possessive construction (مضاف إليه)"],answer:0,why:"حال describes a state or circumstance related to the situation. Identify what it describes and show the contextual clue."}},
    23:{passage:"Al-Balad",page:594,nahwPages:[12],sarfPages:[16],
      nahw:"FSTU Naḥw p. 12 teaches noun number: the dual (مثنّى) refers to two. Find النَّجْدَيْنِ in وَهَدَيْنَاهُ النَّجْدَيْنِ and use the ending as evidence; distinguish noun dual formation from numeric phrases.",
      sarf:"FSTU Ṣarf, p. 16: recall singular/dual/plural pronoun categories where useful, while keeping this week's main focus on number phrases.",
      media:"noun number and the dual form",
      quiz:{question:"In النَّجْدَيْنِ, what does the form tell you?",options:["It is a dual noun (مثنّى), referring to two paths","It is a feminine plural (جمع مؤنث سالم)","It is a verb in the imperfect form (فعل مضارع)"],answer:0,why:"The dual form refers to two. Identify the full noun and its ending in the verse rather than guessing from translation."}},
    24:{passage:"Al-Fātiḥah — checkpoint 3",page:1,checkpoint:true,nahwPages:[50,54],sarfPages:[57,60],
      nahw:"Start with a structure you can genuinely justify on Al-Fātiḥah, such as إضافة (رب العالمين / مالك يوم الدين), a prepositional phrase (جار ومجرور), or the relative expression (الذين أنعمت عليهم). If testing حال or ظرف from the phase, load a second memorised page; do not pretend these features occur in Al-Fātiḥah.",
      sarf:"Use negation (نفي) or command/prohibition (أمر / نهي) only on a second page where the actual Arabic supplies that evidence; the checkpoint is retrieval, not a new unit.",
      media:"review of connected meaning",
      quiz:{question:"What is the strongest way to test connected meaning on Al-Fātiḥah?",options:["Identify the marker/structure, show its Arabic relationship and explain how it changes the statement","List isolated vocabulary meanings only","Name a term but do not connect it to any words"],answer:0,why:"Connected meaning requires you to explain the relationship between words or clauses using visible Arabic evidence, not only recall isolated terms."}},
    25:{passage:"Al-Kahf 5–8",page:294,nahwPages:[27],sarfPages:[57],
      nahw:"FSTU Naḥw, p. 27: particles (حروف) and their role in a wider statement. Compare the possible readings of من and ما from context.",
      sarf:"FSTU Ṣarf, p. 57: use the negation examples only as a reminder that a particle's effect depends on what follows; do not assume this page covers every function of من/ما.",
      media:"context-sensitive particles",
      quiz:{question:"How should you decide what من or ما means in a particular verse?",options:["Use its function in the sentence and surrounding context","Choose the same English gloss every time","Decide from the Arabic word alone without reading the phrase"],answer:0,why:"من and ما can serve different functions. Identify the expression's role from the full phrase and surrounding context; this is a contextual task, not a one-gloss rule."}},
    26:{passage:"Al-Bayyinah 1–8",page:599,nahwPages:[20,36,41],sarfPages:[57,58],
      nahw:"The page contains لَمْ يَكُنِ الَّذِينَ كَفَرُوا: combine the negation reference (نفي) with the discussion of ناقص كان and its noun (اسم كان) on pp. 36 and 41. Explain the relation inside the whole statement.",
      sarf:"FSTU Ṣarf, p. 58: use the surrounding negation examples to notice how particles change the force of a statement; confirm from context.",
      media:"negation with كان and sentence structure",
      quiz:{question:"In لَمْ يَكُنِ الَّذِينَ كَفَرُوا, what is the best first step?",options:["Identify لم, then examine كان and the role of the words that follow","Treat لم and يكن as unrelated vocabulary","Call الذين كفروا a possessive construction (إضافة)"],answer:0,why:"The negative marker affects the verb form, while كان participates in the sentence structure. Read the phrase as a whole and justify each role from the text."}},
    27:{passage:"Al-Fajr 21–30 — دكًّا دكًّا",page:593,nahwPages:[52],sarfPages:[70,72],
      nahw:"FSTU Naḥw p. 52, Adverbs of Frequency, gives the absolute object for number (مفعول مطلق للعدد). In كَلَّا إِذَا دُكَّتِ الْأَرْضُ دَكًّا دَكًّا, identify the passive verb (فعل مبني للمجهول) and repeating verbal-noun expression (مصدر).",
      sarf:"FSTU Ṣarf pp. 70 and 72: use the short conjugation table and summary to connect a verbal noun (مصدر) to its root/action; this is supporting recognition, not a full new Sarf unit.",
      media:"repetition and the absolute object",
      quiz:{question:"In دُكَّتِ الْأَرْضُ دَكًّا دَكًّا, what does دكًّا دكًّا illustrate?",options:["An absolute object (مفعول مطلق) related to the action","The second noun of a possessive construction (مضاف إليه)","A relative clause (صلة الموصول)"],answer:0,why:"This is an absolute object for number (مفعول مطلق للعدد). FSTU Naḥw p. 52 is the precise reference; p. 48 covers the ordinary object (مفعول به)."}},
    28:{passage:"Al-Kahf 1–4",page:293,nahwPages:[117],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 117: locate the relative pronoun (اسم موصول) and its completing clause (صلة الموصول).",
      sarf:"FSTU Ṣarf, p. 16: keep pronouns (ضمير) and complete word forms in view as you track reference across the clause.",
      media:"relative clauses and connected statements",
      quiz:{question:"A relative clause (صلة الموصول) should be read...",options:["together with its relative pronoun (اسم موصول) as a connected expression","as an unrelated sentence fragment","as the same thing as a preposition phrase (جار ومجرور)"],answer:0,why:"The اسم موصول and صلة الموصول form a connected expression. Then explain how that expression fits into the wider sentence."}},
    29:{passage:"Al-Māʿūn",page:602,nahwPages:[69],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 69: conjunction phrases (عطف), revisiting how the linked words or statements relate.",
      sarf:"FSTU Ṣarf, p. 24: use the whole imperfect form (فعل مضارع) as a reading clue where the verse has one.",
      media:"conjunctions and sentence links",
      quiz:{question:"When you find a conjunction (عطف), what must you identify?",options:["the items being linked and the relationship shown by the link","only the English meaning of the conjunction","the object (مفعول به) even if the verse has none"],answer:0,why:"The conjunction is a link. Point to both sides of it and say what connection the Arabic supports."}},
    30:{passage:"Al-Ikhlāṣ, Al-Falaq and An-Nās",page:604,nahwPages:[72,84],sarfPages:[16],
      nahw:"Use the short sūrahs to retrieve two visible structures: إضافة (e.g. رَبِّ الْفَلَقِ / رَبِّ النَّاسِ) and a prepositional phrase (جار ومجرور), as in مِنْ شَرِّ. FSTU pp. 72 and 84 teach these relationships.",
      sarf:"FSTU Ṣarf, pp. 57–58: use negation examples to review how particle choice affects the following form and statement.",
      media:"possessive and prepositional phrases in short sūrahs",
      quiz:{question:"In مِنْ شَرِّ الْوَسْوَاسِ, which two relationships are visible?",options:["A prepositional phrase (جار ومجرور) and an إضافة (مضاف + مضاف إليه)","A passive construction (مبني للمجهول) and نائب الفاعل","A conditional sentence (شرط) and جواب الشرط"],answer:0,why:"مِنْ links to شَرِّ as a prepositional phrase; شَرِّ الْوَسْوَاسِ forms an إضافة. A single phrase can contain more than one relationship."}},
    31:{passage:"Al-Ikhlāṣ, Al-Falaq and An-Nās — reference page for the capstone",page:604,capstone:true,nahwPages:[150],sarfPages:[72],
      nahw:"FSTU Naḥw, p. 150: use the English/Arabic index to find only the concept you cannot justify. Then return to your own memorised page.",
      sarf:"FSTU Ṣarf, p. 72: use the summary to revisit only a relevant form or pattern; do not start a new unit.",
      media:"independent analysis of a familiar page",
      quiz:{question:"Which workflow best demonstrates independent recognition on a fresh memorised page?",options:["Read the Arabic, mark evidence, name the paired term, explain the relationship, then check one uncertainty","Translate the page first and guess its grammatical structure","Use the index to copy a term without applying it"],answer:0,why:"Independent analysis means you can point to the Arabic evidence and explain the feature before looking up one unresolved concept. Use p. 604 here as a model page, then repeat on a page chosen with your teacher."}}
  };

  function esc(value, custom) {
    if (typeof custom === "function") return custom(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function get(week) { return WEEKS[Number(week)] || WEEKS[31]; }
  function uniqueSorted(values) {
    var seen = {};
    return values.filter(function (v) { if (!v || seen[v]) return false; seen[v] = true; return true; }).sort(function (a,b) { return a-b; });
  }
  function getPageSourceMap() {
    var quran=[],sarf=[],nahw=[];
    Object.keys(WEEKS).forEach(function (key) {
      var w=WEEKS[key];
      if (w.page) quran.push(Number(w.page));
      (w.sarfPages||[]).forEach(function (p) { sarf.push(Number(p)); });
      (w.nahwPages||[]).forEach(function (p) { nahw.push(Number(p)); });
    });
    return {quran:uniqueSorted(quran),sarf:uniqueSorted(sarf),nahw:uniqueSorted(nahw)};
  }
  function renderPriority() {
    return '<section id="hifzPriority" class="weekly-guide hifz-priority" aria-labelledby="hifzPriorityTitle">' +
      '<div class="guide-eyebrow">PRIORITY 1 · HIFZ FIRST</div><h2 id="hifzPriorityTitle">Complete your Hifz targets first</h2>' +
      '<p>Complete your teacher-assigned <b>Sabaq</b>, <b>Sabaq Sipara / Sabqi</b> and <b>Dhor / Dawr</b> first. Arabic is support for Hifz, not a competing target. If your Hifz work is unfinished or you are tired, defer Arabic without guilt.</p>' +
      '<p class="guide-small">The Arabic loop is whole → map → whole → retrieve: begin with the Qur’anic structure, learn only the rule needed to explain it, then return to the same words and find the pattern again elsewhere.</p></section>';
  }
  function renderLibrarySetup() {
    return '<section class="weekly-guide source-method-card" aria-labelledby="sourceMethodTitle"><div class="guide-eyebrow">HOW THE METHOD WORKS</div><h2 id="sourceMethodTitle">See the structure before collecting rules</h2><div class="method-rhythm"><div><b>1 · Whole</b><p>Begin with the Qur’anic phrase. Notice what the statement is doing before analysing a word.</p></div><div><b>2 · Map</b><p>Zoom in to the smallest useful clue: word type, form, phrase relationship or sentence role. Pair every English grammar term with Arabic.</p></div><div><b>3 · Return</b><p>Use FSTU as a focused reference, then return to the same words and explain the relationship in context.</p></div><div><b>4 · Retrieve</b><p>Tap the evidence, name the role, explain the clue and revisit the pattern later on another memorised page.</p></div></div><p class="guide-small">The Qur’an viewer is a digital 15-line Madina layout and may differ in calligraphy or line breaks from your printed Mushaf. Verify the sūrah, page number and verse context with your teacher. Official FSTU copies are embedded from Al-Qalam Institute; Ṣarf page labels may vary between editions.</p><p class="guide-small">Sources: <a href="https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources" target="_blank" rel="noreferrer">FSTU Naḥw</a> · <a href="https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources" target="_blank" rel="noreferrer">FSTU Ṣarf</a> · <a href="https://github.com/tarekeldeeb/quran-madina-html" target="_blank" rel="noreferrer">digital Mushaf renderer</a>. References are provided for educational study with attribution; the source books are not republished by this site.</p></section>';
  }
  function pageFrame(kind,page) {
    var p=Number(page);
    if(kind==="quran"){
      return '<div class="book-page-frame digital-mushaf-frame" data-book-page="quran:'+p+'" aria-label="Digital 15-line Madina Qur’an page '+p+'"><quran-madina-html page="'+p+'" headless="true" highlight="1" data-font-size="24" data-recognition-page="true" aria-label="Qur’an page '+p+'"><p class="digital-reader-fallback">The digital page viewer is loading. If it does not load, check your connection and use your own Mushaf with the same page number.</p></quran-madina-html><p class="page-caption">Digital 15-line Madina layout · page '+p+' · tap an Arabic word to select it</p></div>';
    }
    var id=kind==="sarf"?"1D4Sr_0iz8fywSmPMB1H9iM1a4FOU7tzr":"1BdY0tAvoaKvJVUhmMQn09bxLh0fAXO03";
    var label=kind==="sarf"?"Official FSTU Ṣarf resource (2023 October edition)":"Official FSTU Naḥw resource (August 2026 edition)";
    var direct="https://drive.google.com/file/d/"+id+"/view#page="+p;
    var preview="https://drive.google.com/file/d/"+id+"/preview#page="+p;
    return '<div class="book-page-frame fstu-page-frame" data-book-page="'+kind+':'+p+'" aria-label="'+(kind==="sarf"?"FSTU Ṣarf":"FSTU Naḥw")+' assigned page '+p+'"><iframe loading="lazy" title="'+label+' · page '+p+'" src="'+preview+'" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen"></iframe><p class="fstu-open-link"><a href="'+direct+'" target="_blank" rel="noreferrer">Open official source at printed page '+p+' ↗</a></p></div>';
  }
  function renderBookGroup(kind,pages,focus) {
    var title=kind==="sarf"?"FSTU Ṣarf (صرف)":"FSTU Naḥw (نحو)";
    var sourcePages=pages||[];
    var note=kind==="sarf"
      ?'<p class="source-edition-note">The embedded source is Al-Qalam Institute’s October 2023 resource. This course was initially mapped against a March 2022 copy; check the section heading if the page number differs in your edition.</p>'
      :'<p class="source-edition-note">Embedded from Al-Qalam Institute’s August 2026 FSTU Naḥw resource.</p>';
    return '<article class="textbook-panel '+kind+'-panel"><div class="textbook-panel-head"><div><div class="guide-eyebrow">'+(kind==="sarf"?"SOURCE BOOK · MORPHOLOGY":"SOURCE BOOK · GRAMMAR")+'</div><h3>'+title+'</h3></div><span class="book-page-count">'+sourcePages.length+' page'+(sourcePages.length===1?"":"s")+'</span></div><p>'+esc(focus)+'</p>'+note+'<div class="textbook-pages">'+sourcePages.map(function (p) {
      var pageTitle=(kind==="sarf"?SARF_PAGE_TITLES:NAHW_PAGE_TITLES)[p]||"Source page";
      return '<section class="textbook-page"><div class="textbook-page-caption"><b>Printed p. '+p+'</b><span>'+esc(pageTitle)+'</span></div>'+pageFrame(kind,p)+'</section>';
    }).join("")+'</div></article>';
  }
  function renderPlaylists(week) {
    var d=get(week);
    return '<section class="weekly-guide listening-resources" aria-labelledby="listenTitle-'+week+'"><div class="listen-heading"><div><div class="guide-eyebrow">LEARN BY LISTENING · BEFORE THE TEST</div><h2 id="listenTitle-'+week+'">Listen, learn, then return to the Qur’an</h2><p>Use the core playlist as a regular lesson resource. Choose a short explanation that supports this week’s topic, listen actively, then find the same clue on the Mushaf page. Use the bonus playlist for extra repetition.</p></div><span class="listen-number" aria-hidden="true">♪</span></div><div class="playlist-grid"><article class="playlist-card primary-playlist"><div class="playlist-label">KEY RESOURCE · CORE LESSONS</div><h3>Core Arabic lesson playlist</h3><p>Start here: listen for the rule or pattern, pause, then try to find it on this week’s Qur’anic page before reading the explanation again.</p><div class="playlist-player"><iframe loading="lazy" title="Core Arabic lesson playlist" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLXJPAz2MwdUCSoBK47tg79-BeIF9w2toa" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="playlist-link primary-link" href="'+CORE_PLAYLIST+'" target="_blank" rel="noreferrer">Open the full core lesson playlist ↗</a></article><article class="playlist-card bonus-playlist"><div class="playlist-label">REPEAT · REINFORCE</div><h3>Bonus listening playlist</h3><p>Use for repeated listening and reinforcement. The playlist is a learning resource, not an extra task you must finish to pass this week.</p><div class="bonus-icon" aria-hidden="true">♫</div><a class="playlist-link" href="'+BONUS_PLAYLIST+'" target="_blank" rel="noreferrer">Open the bonus listening playlist ↗</a><p class="guide-small">This week’s target: <b>'+esc(d.media)+'</b>. Ask your teacher to help select the most relevant recording if the playlist contains a broad mix of topics.</p></article></div></section>';
  }
  var RECOGNITION_TASKS={
    1:{stage:"Guided spotting",prompt:"Tap one clear example of each word type on the page, or start with one and explain your clue.",labels:[["Noun","اسم"],["Verb","فعل"],["Particle","حرف"]]},
    2:{stage:"Guided spotting",prompt:"Tap the topic and the information given about it. If you tap two words, explain how they make one statement.",labels:[["Topic","مبتدأ"],["Predicate / information","خبر"]]},
    3:{stage:"Guided spotting",prompt:"Tap the action's doer, and then its object where the verse has one. Do not assume every verb takes an object.",labels:[["Doer / subject","فاعل"],["Object","مفعول به"]]},
    4:{stage:"Guided spotting",prompt:"Tap a preposition and the noun it governs. Explain the pair as one connected phrase.",labels:[["Preposition","حرف جر"],["Genitive noun","اسم مجرور"]]},
    5:{stage:"Guided spotting",prompt:"Tap a conjunction and the item or clause it links. Say what the link connects.",labels:[["Conjunction particle","حرف عطف"],["Linked item","معطوف"]]},
    6:{stage:"Guided spotting",prompt:"Tap the two parts of an إضافة construction. Read them as a linked noun pair rather than a standalone adjective phrase.",labels:[["First noun","مضاف"],["Second noun / genitive complement","مضاف إليه"]]},
    7:{stage:"Guided spotting",prompt:"Tap a pronoun as a separate word or inside a larger word. Explain who or what it refers to.",labels:[["Pronoun","ضمير"],["Attached pronoun","ضمير متصل"]]},
    8:{stage:"Retrieve foundations",prompt:"Retrieve a real example on Al-Fātiḥah. You may load another memorised page if a label is not supported on p. 1; never force an analysis.",labels:[["Noun","اسم"],["Verb","فعل"],["Particle","حرف"],["Topic","مبتدأ"],["Predicate","خبر"],["First noun","مضاف"],["Second noun","مضاف إليه"],["Prepositional phrase","جار ومجرور"]]},
    9:{stage:"Guided relationships",prompt:"Find a noun with a describing word. Tap both if helpful, then justify the relationship using more than word order alone.",labels:[["Described noun","منعوت"],["Adjective / descriptor","نعت"]]},
    10:{stage:"Guided relationships",prompt:"Tap a relative opening and the words that complete its meaning. Read the clause with its relative noun.",labels:[["Relative noun","اسم موصول"],["Completing relative clause","صلة الموصول"]]},
    11:{stage:"Guided relationships",prompt:"Start with the opening oath on this page. Identify the marker, what is sworn by and the statement framed by the oath.",labels:[["Oath marker","واو القسم"],["Object sworn by","مقسم به"],["Oath response","جواب القسم"]]},
    12:{stage:"Guided relationships",prompt:"Read وُجُوهٌ يَوْمَئِذٍ خَاشِعَةٌ as a whole statement. Test topic/predicate first; do not automatically call خاشعة an adjective.",labels:[["Topic","مبتدأ"],["Predicate / information","خبر"],["Time expression","ظرف زمان"],["Adjective / descriptor","نعت"]]},
    13:{stage:"Guided relationships",prompt:"On p. 604, tap لم and the verb it governs in لم يلد ولم يولد. Explain what changes when the negation marker is present.",labels:[["Negation marker","حرف نفي"],["Imperfect verb","فعل مضارع"],["Jussive form","مجزوم"]]},
    14:{stage:"Guided relationships",prompt:"Identify a passive verb form and the noun taking the role of deputy subject. Use the vowels and sentence relationship as evidence.",labels:[["Passive verb","فعل مبني للمجهول"],["Deputy subject","نائب الفاعل"]]},
    15:{stage:"Guided relationships",prompt:"Compare شاهد and مشهود in the oath passage. Use word shape and meaning together to identify the two participle forms.",labels:[["Active participle","اسم الفاعل"],["Passive participle","اسم المفعول"]]},
    16:{stage:"Cumulative retrieval",prompt:"Use Al-Fātiḥah first and justify only what is actually present. If you test a feature from the previous phase that is absent, load a second memorised page and mark it as transfer.",labels:[["Described noun","منعوت"],["Adjective / descriptor","نعت"],["Relative noun","اسم موصول"],["Completing relative clause","صلة الموصول"],["Active participle","اسم الفاعل"],["Passive participle","اسم المفعول"],["Negation marker","حرف نفي"]]},
    17:{stage:"Explain the relationship",prompt:"Find the exception/restriction around إلا صيحة واحدة. Tap the marker and the item it limits, then explain what remains in scope.",labels:[["Exception marker","أداة استثناء"],["Excluded / limited item","مستثنى"],["Negation marker","حرف نفي"]]},
    18:{stage:"Explain the relationship",prompt:"Find both ما غرّك and يا أيها الإنسان. Explain what the question word asks and whom the vocative addresses.",labels:[["Question word","أداة استفهام"],["Vocative marker","أداة نداء"],["Person addressed","منادى"]]},
    19:{stage:"Explain the relationship",prompt:"Follow the opening oath in Al-Fajr. Tap the oath marker, what is sworn by and the response framed by the oath.",labels:[["Oath marker","واو القسم"],["Object sworn by","مقسم به"],["Oath response","جواب القسم"]]},
    20:{stage:"Explain the relationship",prompt:"Locate يوم or another time/place expression. Explain what event or statement it locates.",labels:[["Time expression","ظرف زمان"],["Place expression","ظرف مكان"],["Verb","فعل"]]},
    21:{stage:"Explain the relationship",prompt:"In ليعبدوا الله, identify the purpose lām and the action it connects to its aim. Distinguish this from مفعول لأجله.",labels:[["Purpose lām","لام التعليل"],["Imperfect verb","فعل مضارع"],["Purpose relationship","تعبير عن الغرض"]]},
    22:{stage:"Explain the relationship",prompt:"In وجدك ضالاً فهدى, identify حال and the circumstance it describes. Explain why the word contributes that role in the phrase.",labels:[["Circumstantial qualifier","حال"],["Verb","فعل"],["Doer / subject","فاعل"]]},
    23:{stage:"Explain the relationship",prompt:"Find النجدين in وهديناه النجدين. Identify the dual form and use its ending to show why it refers to two.",labels:[["Dual noun","مثنّى"],["Object","مفعول به"],["Verb","فعل"]]},
    24:{stage:"Cumulative retrieval",prompt:"Start with a structure you can truly justify on Al-Fātiḥah (for example, إضافة, جار ومجرور or the relative expression). For a phase feature not present, load a transfer page; do not invent evidence.",labels:[["First noun","مضاف"],["Second noun","مضاف إليه"],["Preposition phrase","جار ومجرور"],["Relative noun","اسم موصول"],["Completing relative clause","صلة الموصول"],["Topic","مبتدأ"],["Predicate","خبر"]]},
    25:{stage:"Context-sensitive reading",prompt:"For من / ما, use the whole phrase and the surrounding statement to infer function. Tap the marker and one linked word, then state why a fixed one-word translation is insufficient.",labels:[["Context-sensitive particle","من / ما بحسب السياق"],["Negation marker","حرف نفي"],["Exception marker","أداة استثناء"]]},
    26:{stage:"Context-sensitive reading",prompt:"In لم يكن الذين كفروا, trace the negative marker into كان and the statement around it. Identify each role using the full expression.",labels:[["Negation marker","حرف نفي"],["Incomplete verb","فعل ناقص"],["Noun of كان","اسم كان"],["Jussive form","مجزوم"]]},
    27:{stage:"Context-sensitive reading",prompt:"In دكت الأرض دكاً دكاً, tap the verb and the repeated verbal noun. Explain the relationship that makes it an absolute object.",labels:[["Absolute object","مفعول مطلق"],["Verbal noun","مصدر"],["Verb","فعل"]]},
    28:{stage:"Context-sensitive reading",prompt:"Tap the relative noun and the clause it introduces. Read them together before explaining how the complete expression fits the sentence.",labels:[["Relative noun","اسم موصول"],["Completing relative clause","صلة الموصول"]]},
    29:{stage:"Context-sensitive reading",prompt:"Choose a conjunction on the page and identify both sides of the link. Explain the relationship rather than translating the connector alone.",labels:[["Conjunction particle","حرف عطف"],["Linked item","معطوف"],["Conjunction relationship","عطف"]]},
    30:{stage:"Context-sensitive reading",prompt:"Use the short sūrahs to find both مِنْ شَرِّ (جار ومجرور) and رَبِّ الْفَلَقِ / رَبِّ النَّاسِ (إضافة). A phrase may contain more than one relationship.",labels:[["Preposition","حرف جر"],["Genitive noun","اسم مجرور"],["First noun","مضاف"],["Second noun","مضاف إليه"]]},
    31:{stage:"Independent page analysis",prompt:"Choose a full page you already know. Select evidence, classify the role, explain the relationship and note one uncertainty you checked. Your teacher verifies the analysis; the app does not auto-grade grammar.",labels:[["Word type","نوع الكلمة"],["Sentence role","وظيفة الكلمة"],["Phrase relationship","العلاقة بين الكلمات"],["Verb form","صيغة الفعل"],["Particle function","وظيفة الحرف"]]}
  };
  function renderRecognitionLab(week) {
    var t=RECOGNITION_TASKS[Number(week)]||RECOGNITION_TASKS[31];
    return '<section class="recognition-lab" data-recognition-task="'+Number(week)+'" aria-labelledby="recognitionTitle-'+Number(week)+'"><div class="guide-eyebrow">PART B · RECOGNISE IT ON THE PAGE</div><h3 id="recognitionTitle-'+Number(week)+'">Tap the Arabic evidence</h3><p class="recognition-stage">'+esc(t.stage)+'</p><p>'+esc(t.prompt)+'</p><div class="recognition-selected" aria-live="polite"><b>Selected word(s)</b><span class="selected-arabic" data-recognition-selected lang="ar" dir="rtl">No words selected yet</span><small data-recognition-location>Choose a word from the digital Qur’an page above.</small></div><div class="recognition-actions"><button type="button" class="btn light" data-clear-recognition="'+Number(week)+'">Clear selection</button></div><div class="recognition-labels" role="group" aria-label="Choose the grammatical role">'+t.labels.map(function(x){return '<button type="button" class="recognition-label" data-recognition-label="'+esc(x[1])+'" data-recognition-en="'+esc(x[0])+'"><span>'+esc(x[0])+'</span><b lang="ar" dir="rtl">'+esc(x[1])+'</b></button>';}).join("")+'</div><label class="evidence-label">Your explanation (required)<textarea data-recognition-explanation="'+Number(week)+'" rows="3" placeholder="Which clue in the Arabic supports your choice? How do the words relate?"></textarea></label><div class="actions"><button type="button" class="btn" data-save-recognition="'+Number(week)+'">Save recognition attempt</button><span class="guide-small">Saved on this device. This is evidence for learning, not an automatic grammar mark; ask your teacher to verify the role.</span></div><div class="recognition-feedback" data-recognition-feedback="'+Number(week)+'" role="status" aria-live="polite" hidden></div></section>';
  }
  function renderAssessment(week) {
    var n=Number(week),d=get(n),q=d.quiz;
    return '<section class="weekly-guide assessment-layer" id="weeklyTest-'+n+'" aria-labelledby="testTitle-'+n+'"><div class="test-step-label">04 · APPLY AND EXPLAIN</div><h2 id="testTitle-'+n+'">'+(d.checkpoint?"Cumulative retrieval checkpoint":"Quick retrieval, then real-page analysis")+'</h2><p class="test-intro">First retrieve the idea without reopening the source. Then tap actual Arabic evidence, identify the role and explain the clue. The small quiz is a prompt, not proof of independent understanding.</p><div class="quiz-question"><div class="guide-eyebrow">PART A · RETRIEVE</div><fieldset class="quiz-fieldset"><legend>'+esc(q.question)+'</legend>'+q.options.map(function (option,i) {
      return '<label class="quiz-option"><input type="radio" name="weekly-choice-'+n+'" value="'+i+'"><span>'+esc(option)+'</span></label>';
    }).join("")+'</fieldset><div class="quiz-actions"><button type="button" class="btn" data-check-quiz="'+n+'">Check my answer</button><span class="guide-small">Try from memory first; the explanation appears after checking.</span></div><div id="quizFeedback-'+n+'" class="quiz-feedback" role="status" aria-live="polite" hidden></div></div>'+renderRecognitionLab(n)+'</section>';
  }  function renderSequence(week, options) {
    options=options||{};
    var n=Number(week),d=get(n),page=Number(d.page||604);
    var passage=options.passage||d.passage;
    var apply=options.apply||(d.capstone?"Use the reference page as a model, then repeat the analysis on a full page from your own memorised Qur’an.":"Find one example of this week’s target, point to the Arabic evidence and explain it in your own words.");
    var pageNote=d.capstone
      ?"Page 604 is the starting model only. For independent transfer, load a different page from your own memorised Qur’an."
      :"Begin with the whole passage. The online renderer uses a digital 15-line Madina layout; check page and verse context against the edition you use in class.";
    var picker=(d.checkpoint||d.capstone)
      ?'<div class="transfer-page-picker"><label for="transferPage-'+n+'">'+(d.capstone?"Choose your capstone page (1–604)":"Optional transfer page (1–604)")+'</label><div><input id="transferPage-'+n+'" data-transfer-page="'+n+'" type="number" min="1" max="604" value="'+(d.capstone?604:page)+'" inputmode="numeric"><button type="button" class="btn light" data-load-transfer-page="'+n+'">Load page</button></div><small>For Weeks 8, 16 and 24, start with Al-Fātiḥah and use another memorised page only when the target feature is not present there.</small></div>'
      :"";
    return '<div class="weekly-sequence" data-week-sequence="'+n+'"><div class="sequence-overview" aria-label="Four lesson stages"><div class="sequence-node active"><span>01</span><b>Qur’an</b></div><div class="sequence-line"></div><div class="sequence-node"><span>02</span><b>Map</b></div><div class="sequence-line"></div><div class="sequence-node"><span>03</span><b>Listen</b></div><div class="sequence-line"></div><div class="sequence-node"><span>04</span><b>Apply</b></div></div>'+
      '<section class="weekly-step mushaf-step" aria-labelledby="mushafTitle-'+n+'"><div class="step-topline"><span class="step-number">01</span><div><div class="guide-eyebrow">START WITH THE WHOLE · THEN NOTICE THE CLUE</div><h2 id="mushafTitle-'+n+'">Read the Qur’anic passage first</h2></div></div><p class="step-intro">Look at the whole phrase before analysing a part. Ask what the statement is about, what is happening, and which words connect. If handling a physical Mushaf, make wudhu first; this online study aid does not enforce an adab reminder as a software gate.</p><div class="mushaf-task" id="mushafTask-'+n+'"><div class="mushaf-reference"><div class="mushaf-reference-meta"><span class="guide-eyebrow">TARGET PASSAGE</span><span class="page-pill">Madina page '+page+'</span></div><h3>'+esc(passage)+'</h3><p class="guide-small">'+esc(pageNote)+'</p>'+picker+'</div>'+pageFrame("quran",page)+'<p class="mushaf-application">'+esc(apply)+'</p><div class="mushaf-transfer-note"><b>First pass · without notes</b><p>Before reading the rule, try to spot one feature in the whole phrase. Tap the exact word or words that led you to your decision. After studying the map, return here and revise your explanation if needed.</p></div></div></section>'+
      '<section class="weekly-step textbook-step" aria-labelledby="textbookTitle-'+n+'"><div class="step-topline"><span class="step-number">02</span><div><div class="guide-eyebrow">A SMALL MAP · NOT A CATALOGUE</div><h2 id="textbookTitle-'+n+'">Use the FSTU page to explain what you saw</h2></div></div><p class="step-intro">Read only the assigned section. Identify the minimum rule needed to explain the pattern, say the English term with its Arabic equivalent, then return to the Qur’anic words. The official source opens below; the assigned heading matters if editions paginate differently.</p><div class="textbook-focus-note"><div class="textbook-focus-item"><b>Ṣarf · صرف</b><p>'+esc(options.sarf||d.sarf)+'</p></div><div class="textbook-focus-item nahw-focus"><b>Naḥw · نحو</b><p>'+esc(options.nahw||d.nahw)+'</p></div></div><div class="textbook-stack">'+renderBookGroup("sarf",d.sarfPages,options.sarf||d.sarf)+renderBookGroup("nahw",d.nahwPages,options.nahw||d.nahw)+'</div><p class="source-return-note"><b>Return to the whole:</b> close or minimise the source view and explain how the rule helps you read the same Qur’anic phrase.</p></section>'+
      renderPlaylists(n)+renderAssessment(n)+'</div>';
  }  function bindAssessment(week) {
    var n=Number(week),d=get(n),q=d.quiz;
    var panel=root.document.getElementById("weeklyTest-"+n);
    if(!panel)return;
    var answerButton=panel.querySelector('[data-check-quiz="'+n+'"]');
    var feedback=panel.querySelector("#quizFeedback-"+n);
    var key="8020-weekly-recall-v2";
    var previous={};
    try{previous=JSON.parse(root.localStorage.getItem(key)||"{}")[n]||{};}catch(e){}
    if(previous.choice!==undefined){
      var old=panel.querySelector('input[name="weekly-choice-'+n+'"][value="'+previous.choice+'"]');
      if(old)old.checked=true;
    }
    if(answerButton)answerButton.addEventListener("click",function(){
      var chosen=panel.querySelector('input[name="weekly-choice-'+n+'"]:checked');
      if(!chosen){feedback.hidden=false;feedback.textContent="Choose an answer, then check your reasoning.";return;}
      var correct=Number(chosen.value)===q.answer;
      var record={};try{record=JSON.parse(root.localStorage.getItem(key)||"{}");}catch(e){}
      record[n]={week:n,choice:Number(chosen.value),correct:correct,answeredAt:new Date().toISOString()};
      var saved=true;try{root.localStorage.setItem(key,JSON.stringify(record));}catch(e){saved=false;}
      feedback.hidden=false;
      feedback.className="quiz-feedback "+(correct?"quiz-correct":"quiz-review");
      feedback.innerHTML="<b>"+(correct?"Correct — good recognition.":"Not yet — inspect the source and try again.")+"</b><p><b>Answer:</b> "+esc(q.options[q.answer])+"</p><p>"+esc(q.why)+"</p><p>Now complete the real-page word-recognition task below.</p>"+(saved?"":"<p>Your browser did not save this quiz result.</p>");
    });
  }
  function bind(week) {
    var n=Number(week);
    bindAssessment(n);
    if(root.Recognition&&root.document)root.Recognition.bind(n);
  }

  root.WeeklyGuide={
    get:get, getPageSourceMap:getPageSourceMap,
    renderPriority:renderPriority, renderLibrarySetup:renderLibrarySetup,
    renderMushafTask:renderSequence, renderStudySupport:function(){return "";},
    renderSequence:renderSequence, bind:bind, recognitionTasks:RECOGNITION_TASKS,
    playlists:{core:CORE_PLAYLIST,bonus:BONUS_PLAYLIST},
    pageTitles:{nahw:NAHW_PAGE_TITLES,sarf:SARF_PAGE_TITLES}
  };
}(window));
