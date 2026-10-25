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
    8:"Introduction: Words",17:"Part 2: Verbs",27:"Part 3: Particles",34:"Subject and Information",
    38:"Supplement: Pronouns",48:"Object",49:"Deputy Subject",50:"Adverbs of Place and Time",
    53:"Adverbs of Reason",54:"State",56:"Exclusion",57:"Supplement: Pronouns",
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
      nahw:"FSTU Naḥw, p. 53: adverbs of reason (ظرف/تعبير السبب) as a starting point for why an action occurs; connect this to لام التعليل when found.",
      sarf:"FSTU Ṣarf, p. 24: identify the complete verb form (فعل مضارع) that the purpose expression relates to.",
      media:"purpose expressions",
      quiz:{question:"لام التعليل is best recognised as a marker of...",options:["purpose/reason — why an action is done","a possessive construction (إضافة)","the doer (فاعل) of a verb"],answer:0,why:"لام التعليل expresses purpose/reason. Point out the action it relates to and explain the link rather than assigning a fixed gloss alone."}},
    22:{passage:"Aḍ-Ḍuḥā and Ash-Sharḥ",page:596,nahwPages:[54,95],sarfPages:[65],
      nahw:"FSTU Naḥw, pp. 54 and 95: the circumstantial qualifier (حال), including a حال expressed as a clause.",
      sarf:"FSTU Ṣarf, p. 65: review the active participle (اسم الفاعل) as one possible form clue in descriptive wording.",
      media:"ḥāl and descriptions",
      quiz:{question:"A circumstantial qualifier (حال) usually tells you...",options:["the state/circumstance of a person or thing in a situation","the object (مفعول به) of every verb","the second noun in a possessive construction (مضاف إليه)"],answer:0,why:"حال describes a state or circumstance related to the situation. Identify what it describes and show the contextual clue."}},
    23:{passage:"Al-Balad",page:594,nahwPages:[80],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 80: numeric phrases (عدد) and how the number connects to what is counted.",
      sarf:"FSTU Ṣarf, p. 16: recall singular/dual/plural pronoun categories where useful, while keeping this week's main focus on number phrases.",
      media:"number and the dual",
      quiz:{question:"A dual noun (مثنّى) refers to...",options:["two people or things","one person or thing only","more than two in every case"],answer:0,why:"The dual (مثنّى) refers to two. Do not assume every ending that looks similar is a dual without checking the full word and context."}},
    24:{passage:"Al-Fātiḥah — checkpoint 3",page:1,checkpoint:true,nahwPages:[50,54],sarfPages:[57,60],
      nahw:"Checkpoint review: choose one time/place (ظرف) or state (حال) feature you can justify; no new unit is assigned.",
      sarf:"Checkpoint review: revisit negation (نفي) or command/prohibition (أمر ونهي) only where it helps answer a real-page question.",
      media:"review of connected meaning",
      quiz:{question:"What is the strongest way to test connected meaning on Al-Fātiḥah?",options:["Identify the marker/structure, show its Arabic relationship and explain how it changes the statement","List isolated vocabulary meanings only","Name a term but do not connect it to any words"],answer:0,why:"Connected meaning requires you to explain the relationship between words or clauses using visible Arabic evidence, not only recall isolated terms."}},
    25:{passage:"Al-Kahf 5–8",page:294,nahwPages:[27],sarfPages:[57],
      nahw:"FSTU Naḥw, p. 27: particles (حروف) and their role in a wider statement. Compare the possible readings of من and ما from context.",
      sarf:"FSTU Ṣarf, p. 57: use the negation examples only as a reminder that a particle's effect depends on what follows; do not assume this page covers every function of من/ما.",
      media:"context-sensitive particles",
      quiz:{question:"How should you decide what من or ما means in a particular verse?",options:["Use its function in the sentence and surrounding context","Choose the same English gloss every time","Decide from the Arabic word alone without reading the phrase"],answer:0,why:"من and ما can serve different functions. Identify the expression's role from the full phrase and surrounding context; this is a contextual task, not a one-gloss rule."}},
    26:{passage:"Al-Bayyinah 1–8",page:599,nahwPages:[76,56],sarfPages:[58],
      nahw:"FSTU Naḥw, pp. 76 and 56: review emphasis (توكيد) and exclusion (استثناء) as you distinguish strengthening from restriction.",
      sarf:"FSTU Ṣarf, p. 58: use the surrounding negation examples to notice how particles change the force of a statement; confirm from context.",
      media:"emphasis and restriction",
      quiz:{question:"How are emphasis (توكيد) and restriction (قصر) different?",options:["Emphasis strengthens; restriction limits the meaning to a specified scope","They always mean exactly the same thing","Both identify the doer (فاعل) of a verb"],answer:0,why:"توكيد strengthens or confirms; قصر restricts or limits. Show what is being emphasised or restricted in the actual statement."}},
    27:{passage:"Al-Fajr 21–30",page:593,nahwPages:[48,53],sarfPages:[70,72],
      nahw:"FSTU Naḥw, p. 48: compare the object role (مفعول به) with other complements; p. 53 gives an additional adverbial/reason contrast.",
      sarf:"FSTU Ṣarf, pp. 70 and 72: review the short conjugation material and summary when recognising a verbal noun (مصدر) or a word sharing the verb's root.",
      media:"repetition and the absolute object",
      quiz:{question:"The absolute object (مفعول مطلق) is commonly related to...",options:["a verbal noun (مصدر) that reinforces or characterises the action","the possessor in an إضافة (مضاف إليه)","the adjective (نعت) describing a noun"],answer:0,why:"مفعول مطلق is linked to the action's verbal noun/root and can reinforce or characterise the action. Verify the role from the phrase rather than word shape alone."}},
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
    30:{passage:"Al-Ikhlāṣ, Al-Falaq and An-Nās",page:604,nahwPages:[27,56],sarfPages:[57,58],
      nahw:"FSTU Naḥw, p. 27: particles (حروف); p. 56: exclusion (استثناء). Use the surrounding words to decide what a small marker does.",
      sarf:"FSTU Ṣarf, pp. 57–58: use negation examples to review how particle choice affects the following form and statement.",
      media:"small markers in short sūrahs",
      quiz:{question:"When you recognise a small particle (حرف), what is the best next step?",options:["Check the words around it and explain its function in this sentence","Give it one fixed translation in every verse","Ignore the grammar and use word position alone"],answer:0,why:"A particle's function depends on the construction. Read the full expression and justify the function from context."}},
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
      '<p class="guide-small">Your Hifz teacher’s priorities always take precedence over this optional Arabic supplement.</p></section>';
  }
  function renderLibrarySetup() {
    function book(kind,title,desc,accept) {
      return '<article class="book-upload-card"><div class="book-upload-mark" aria-hidden="true">'+(kind==="quran"?"ق":kind==="sarf"?"ص":"ن")+'</div><div class="book-upload-copy"><h3>'+title+'</h3><p>'+desc+'</p><label class="book-upload-button">Choose PDF<input type="file" accept="'+accept+'" data-book-upload="'+kind+'"></label><p class="book-status" data-book-status="'+kind+'" role="status">Not loaded on this device yet.</p></div></article>';
    }
    return '<section class="weekly-guide book-library-setup" aria-labelledby="bookLibraryTitle"><div class="guide-eyebrow">ONE-TIME SETUP · SAVED ON THIS DEVICE</div><h2 id="bookLibraryTitle">Load your actual Mushaf and FSTU pages</h2><p>Choose each PDF once. The app renders only the pages used in this 31-week course and saves those page images in this browser, so the correct page appears inside each lesson. The original PDF files are <b>not uploaded to a server</b>.</p><div class="book-upload-grid">'+
      book("quran","15-line Madani Mushaf","Required for the real Qur’anic page at the start of each week.","application/pdf")+
      book("sarf","FSTU Ṣarf (صرف)","Required for the actual printed Sarf study page(s) each week.","application/pdf")+
      book("nahw","FSTU Naḥw (نحو) · August 2026 edition","Required for the actual printed Nahw study page(s) each week.","application/pdf")+
      '</div><p class="guide-small">Page mapping uses the supplied edition: the Mushaf PDF has a cover, so the viewer maps printed Mushaf page N to PDF page N+1. FSTU printed page numbers map directly to PDF page numbers. On a different edition, check the page labels before relying on the assignment.</p></section>';
  }
  function pageFrame(kind,page) {
    return '<div class="book-page-frame" data-book-page="'+kind+':'+Number(page)+'" aria-label="'+(kind==="quran"?"Mushaf":kind==="sarf"?"FSTU Sarf":"FSTU Nahw")+' page '+Number(page)+'"><div class="book-page-placeholder">Checking the locally saved source page…</div></div>';
  }
  function renderBookGroup(kind,pages,focus) {
    var title=kind==="sarf"?"FSTU Ṣarf (صرف)":"FSTU Naḥw (نحو)";
    var sourcePages=pages||[];
    return '<article class="textbook-panel '+kind+'-panel"><div class="textbook-panel-head"><div><div class="guide-eyebrow">'+(kind==="sarf"?"SOURCE BOOK · MORPHOLOGY":"SOURCE BOOK · GRAMMAR")+'</div><h3>'+title+'</h3></div><span class="book-page-count">'+sourcePages.length+' page'+(sourcePages.length===1?"":"s")+'</span></div><p>'+esc(focus)+'</p><div class="textbook-pages">'+sourcePages.map(function (p) {
      var pageTitle=(kind==="sarf"?SARF_PAGE_TITLES:NAHW_PAGE_TITLES)[p]||"Source page";
      return '<section class="textbook-page"><div class="textbook-page-caption"><b>Printed p. '+p+'</b><span>'+esc(pageTitle)+'</span></div>'+pageFrame(kind,p)+'</section>';
    }).join("")+'</div></article>';
  }
  function renderPlaylists(week) {
    var d=get(week);
    return '<section class="weekly-guide listening-resources" aria-labelledby="listenTitle-'+week+'"><div class="listen-heading"><div><div class="guide-eyebrow">LEARN BY LISTENING · BEFORE THE TEST</div><h2 id="listenTitle-'+week+'">Listen, learn, then return to the Qur’an</h2><p>Use the core playlist as a regular lesson resource. Choose a short explanation that supports this week’s topic, listen actively, then find the same clue on the Mushaf page. Use the bonus playlist for extra repetition.</p></div><span class="listen-number" aria-hidden="true">♪</span></div><div class="playlist-grid"><article class="playlist-card primary-playlist"><div class="playlist-label">KEY RESOURCE · CORE LESSONS</div><h3>Core Arabic lesson playlist</h3><p>Start here: listen for the rule or pattern, pause, then try to find it on this week’s Qur’anic page before reading the explanation again.</p><div class="playlist-player"><iframe loading="lazy" title="Core Arabic lesson playlist" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLXJPAz2MwdUCSoBK47tg79-BeIF9w2toa" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="playlist-link primary-link" href="'+CORE_PLAYLIST+'" target="_blank" rel="noreferrer">Open the full core lesson playlist ↗</a></article><article class="playlist-card bonus-playlist"><div class="playlist-label">REPEAT · REINFORCE</div><h3>Bonus listening playlist</h3><p>Use for repeated listening and reinforcement. The playlist is a learning resource, not an extra task you must finish to pass this week.</p><div class="bonus-icon" aria-hidden="true">♫</div><a class="playlist-link" href="'+BONUS_PLAYLIST+'" target="_blank" rel="noreferrer">Open the bonus listening playlist ↗</a><p class="guide-small">This week’s target: <b>'+esc(d.media)+'</b>. Ask your teacher to help select the most relevant recording if the playlist contains a broad mix of topics.</p></article></div></section>';
  }
  function renderAssessment(week) {
    var n=Number(week),d=get(n),q=d.quiz;
    return '<section class="weekly-guide assessment-layer" id="weeklyTest-'+n+'" aria-labelledby="testTitle-'+n+'"><div class="test-step-label">03 · TEST WHAT YOU RECOGNISE</div><h2 id="testTitle-'+n+'">'+(d.checkpoint?"Retrieval checkpoint":"Quick recognition test")+'</h2><p class="test-intro">Try the question without opening the textbook again. Then complete the real-page evidence task below. You can retry; the purpose is to improve recognition, not speed.</p><div class="quiz-question"><div class="guide-eyebrow">PART A · RECALL</div><fieldset class="quiz-fieldset"><legend>'+esc(q.question)+'</legend>'+q.options.map(function (option,i) {
      return '<label class="quiz-option"><input type="radio" name="weekly-choice-'+n+'" value="'+i+'"><span>'+esc(option)+'</span></label>';
    }).join("")+'</fieldset><div class="quiz-actions"><button type="button" class="btn" data-check-quiz="'+n+'">Check my answer</button><span class="guide-small">The explanation appears after you check.</span></div><div id="quizFeedback-'+n+'" class="quiz-feedback" role="status" aria-live="polite" hidden></div></div><div class="quiz-application"><div class="guide-eyebrow">PART B · APPLY IT TO THE ACTUAL MUSHAF PAGE</div><h3>Find the Arabic evidence yourself</h3><p>Look at the scanned 15-line page in Step 1. Find a word, phrase or connection that relates to this week’s target. Do not just copy the English gloss.</p><label class="evidence-label">Arabic word or phrase<input type="text" lang="ar" dir="rtl" data-test-evidence="'+n+'" placeholder="اكتب الكلمة أو العبارة من المصحف" autocomplete="off"></label><label class="evidence-label">Where is it, and what clue supports your answer?<textarea data-test-explanation="'+n+'" rows="2" placeholder="Write the ayah/line or nearby words, then explain the Arabic clue in your own words."></textarea></label><div class="actions"><button type="button" class="btn" data-save-evidence="'+n+'">Save my page evidence</button><span class="guide-small">Stored on this device so you can revisit your attempt.</span></div><div id="evidenceFeedback-'+n+'" class="evidence-feedback" role="status" aria-live="polite" hidden></div><div class="test-checklist"><b>Before you mark the week complete, check:</b><label><input type="checkbox"> I found the feature on the real page.</label><label><input type="checkbox"> I can point to the exact Arabic clue.</label><label><input type="checkbox"> I can explain it using the English + Arabic term.</label></div></div></section>';
  }
  function renderSequence(week, options) {
    options=options||{};
    var n=Number(week),d=get(n),page=Number(d.page||604);
    var passage=options.passage||d.passage;
    var apply=options.apply||(d.capstone?"Use this reference page as a model. Then repeat the same analysis on a full page from your own memorised Qur’an, selected with your teacher.":"Find one example of this week’s target, point to the Arabic evidence and explain it in your own words.");
    var pageNote=d.capstone
      ?"Reference page 604 is provided for practice. For the capstone, repeat the task on a full page from your own memorised Qur’an."
      :"This is the actual scanned page from the supplied Madani 15-line Mushaf. Its PDF cover is accounted for in the page mapping.";
    return '<div class="weekly-sequence" data-week-sequence="'+n+'"><div class="sequence-overview"><div class="sequence-node active"><span>01</span><b>Mushaf page</b></div><div class="sequence-line"></div><div class="sequence-node"><span>02</span><b>Sarf + Nahw</b></div><div class="sequence-line"></div><div class="sequence-node"><span>03</span><b>Test</b></div></div>'+
      '<section class="weekly-step mushaf-step" aria-labelledby="mushafTitle-'+n+'"><div class="step-topline"><span class="step-number">01</span><div><div class="guide-eyebrow">FIRST · READ THE REAL PAGE</div><h2 id="mushafTitle-'+n+'">The actual 15-line Mushaf page</h2></div></div><p class="step-intro">Make wudhu before handling your physical Mushaf. Start with the Qur’anic page itself; look at the Arabic before trying to translate it.</p><label class="guide-check wudhu-confirm"><input type="checkbox" id="wudhuReady-'+n+'"> <span>I have made wudhu and am ready to handle my Mushaf.</span></label><div class="guide-actions"><button type="button" class="btn guide-reveal" id="revealMushaf-'+n+'" disabled>Reveal the actual Mushaf page</button><span class="guide-small">The scanned page is shown after you confirm readiness.</span></div><div id="mushafTask-'+n+'" class="mushaf-task" hidden><div class="mushaf-reference"><div class="mushaf-reference-meta"><span class="guide-eyebrow">TARGET PASSAGE</span><span class="page-pill">Printed Mushaf p. '+page+'</span></div><h3>'+esc(passage)+'</h3><p class="guide-small">'+esc(pageNote)+'</p></div>'+pageFrame("quran",page)+'<p class="mushaf-application">'+esc(apply)+'</p><div class="mushaf-transfer-note"><b>Your first task</b><p>Before opening the textbook pages, point to one place on this actual page that you think shows the week’s target. Keep your finger/eyes on the Arabic evidence.</p></div></div></section>'+
      '<section class="weekly-step textbook-step" aria-labelledby="textbookTitle-'+n+'"><div class="step-topline"><span class="step-number">02</span><div><div class="guide-eyebrow">SECOND · STUDY THE ACTUAL SOURCE PAGES</div><h2 id="textbookTitle-'+n+'">Read the FSTU pages, then return to the Mushaf</h2></div></div><p class="step-intro">These are scans rendered from the exact PDFs you load on this device. Read the assigned page(s) rather than relying on a summary alone. The note explains what to look for on each source page.</p><div class="textbook-focus-note"><div class="textbook-focus-item"><b>Ṣarf · صرف</b><p>'+esc(options.sarf||d.sarf)+'</p></div><div class="textbook-focus-item nahw-focus"><b>Naḥw · نحو</b><p>'+esc(options.nahw||d.nahw)+'</p></div></div><div class="textbook-stack">'+renderBookGroup("sarf",d.sarfPages,options.sarf||d.sarf)+renderBookGroup("nahw",d.nahwPages,options.nahw||d.nahw)+'</div></section>'+
      renderPlaylists(n)+renderAssessment(n)+'</div>';
  }
  function bindAssessment(week) {
    var n=Number(week),d=get(n),q=d.quiz;
    var check=root.document.getElementById("weeklyTest-"+n);
    if(!check)return;
    var answerButton=check.querySelector('[data-check-quiz="'+n+'"]');
    var feedback=check.querySelector("#quizFeedback-"+n);
    var evidenceButton=check.querySelector('[data-save-evidence="'+n+'"]');
    var evidenceFeedback=check.querySelector("#evidenceFeedback-"+n);
    var evidenceField=check.querySelector('[data-test-evidence="'+n+'"]');
    var explanationField=check.querySelector('[data-test-explanation="'+n+'"]');
    var storageKey="8020-weekly-assessment-v1";
    function loadSaved() {
      try { var all=JSON.parse(root.localStorage.getItem(storageKey)||"{}");return all[n]||{}; } catch(e) { return {}; }
    }
    function writeSaved(patch) {
      var all={};try {all=JSON.parse(root.localStorage.getItem(storageKey)||"{}");}catch(e){}
      all[n]=Object.assign(all[n]||{},patch);
      try {root.localStorage.setItem(storageKey,JSON.stringify(all));}catch(e){}
    }
    var previous=loadSaved();
    if(previous.evidence&&evidenceField)evidenceField.value=previous.evidence;
    if(previous.explanation&&explanationField)explanationField.value=previous.explanation;
    if(previous.choice!==undefined) {
      var old=check.querySelector('input[name="weekly-choice-'+n+'"][value="'+previous.choice+'"]');
      if(old)old.checked=true;
    }
    if(answerButton)answerButton.addEventListener("click",function(){
      var chosen=check.querySelector('input[name="weekly-choice-'+n+'"]:checked');
      if(!chosen){feedback.hidden=false;feedback.className="quiz-feedback needs-answer";feedback.innerHTML="<b>Choose an answer first.</b><p>Try from memory; then check your reasoning.</p>";return;}
      var isRight=Number(chosen.value)===q.answer;
      writeSaved({choice:Number(chosen.value),correct:isRight,answeredAt:new Date().toISOString()});
      feedback.hidden=false;
      feedback.className="quiz-feedback "+(isRight?"quiz-correct":"quiz-review");
      feedback.innerHTML="<b>"+(isRight?"Correct — good recognition.":"Not yet — review the source page, then try again.")+"</b><p><b>Answer:</b> "+esc(q.options[q.answer])+"</p><p>"+esc(q.why)+"</p><p>Now complete Part B using the actual Mushaf scan above.</p>";
    });
    if(evidenceButton)evidenceButton.addEventListener("click",function(){
      var evidence=evidenceField?evidenceField.value.trim():"";
      var explanation=explanationField?explanationField.value.trim():"";
      writeSaved({evidence:evidence,explanation:explanation,evidenceSavedAt:new Date().toISOString()});
      evidenceFeedback.hidden=false;
      evidenceFeedback.className="evidence-feedback";
      evidenceFeedback.innerHTML="<b>Saved on this device.</b><p>"+(evidence&&explanation?"Now compare your example and explanation with the FSTU page and your teacher's feedback. The app checks the recall question, but it does not automatically grade a student's free-text Qur'anic analysis.":"Add both the Arabic example and the clue/explanation to make this a complete evidence record.")+"</p>";
    });
  }
  function bind(week) {
    var n=Number(week);
    var ready=root.document&&root.document.getElementById("wudhuReady-"+n);
    var reveal=root.document&&root.document.getElementById("revealMushaf-"+n);
    var task=root.document&&root.document.getElementById("mushafTask-"+n);
    if(ready&&reveal&&task) {
      ready.addEventListener("change",function(){reveal.disabled=!ready.checked;});
      reveal.addEventListener("click",function(){
        if(!ready.checked)return;
        task.hidden=false;
        reveal.textContent="Mushaf page revealed";
        reveal.disabled=true;
        task.scrollIntoView({behavior:"smooth",block:"nearest"});
      });
    }
    bindAssessment(n);
    if(root.BookPages&&root.document)root.BookPages.hydrate(root.document);
  }

  root.WeeklyGuide={
    get:get, getPageSourceMap:getPageSourceMap,
    renderPriority:renderPriority, renderLibrarySetup:renderLibrarySetup,
    renderMushafTask:renderSequence, renderStudySupport:function(){return "";},
    renderSequence:renderSequence, bind:bind,
    playlists:{core:CORE_PLAYLIST,bonus:BONUS_PLAYLIST},
    pageTitles:{nahw:NAHW_PAGE_TITLES,sarf:SARF_PAGE_TITLES}
  };
}(window));
