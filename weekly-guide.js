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
    38:"Supplement: Pronouns",42:"Alternate layout: اسم ليس",43:"اسم إنّ as a pronoun",48:"Object (مفعول به)",49:"Deputy Subject (نائب الفاعل)",50:"Adverbs of Place and Time (ظرف)",
    51:"Adverb of Degree / Absolute Object (مفعول مطلق)",53:"Adverbs of Reason (مفعول له)",54:"State (حال)",56:"Exclusion (استثناء)",57:"Supplement: Pronouns",
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
    11:{passage:"Al-ʿĀdiyāt",page:600,nahwPages:[27,76],sarfPages:[19],
      nahw:"FSTU Naḥw, p. 27: particles (حروف). Use p. 76 to review emphatic phrases (توكيد) and how emphasis strengthens a statement.",
      sarf:"FSTU Ṣarf, p. 19: identify the full past/perfect form (فعل ماضٍ) where present; the grammar target is the particle/statement effect.",
      media:"inna and emphasis",
      quiz:{question:"When studying إنّ and related markers, which approach is strongest?",options:["Spot the marker, identify the structure it affects, and explain its effect","Treat every opening particle as having the same meaning","Translate the line without identifying any Arabic clue"],answer:0,why:"A marker's function has to be shown from its place and effect in the statement. Identify the words around it rather than learning one isolated gloss."}},
    12:{passage:"Al-Ghāshiyah",page:592,nahwPages:[34,42],sarfPages:[57,58],
      nahw:"FSTU Naḥw, p. 34 reviews the two-part nominal statement; p. 42 specifically reviews the اسم of ليس. On Al-Ghāshiyah, compare لَيْسَ لَهُمْ طَعَامٌ with a regular nominal sentence. This week focuses on لَيْسَ, not a generic rule for كان and ليس together.",
      sarf:"FSTU Ṣarf, pp. 57–58: review negation (نفي) and how a negative form works with the words that follow. Keep the whole phrase in view.",
      media:"laysa, negation and nominal statements",
      quiz:{question:"In لَيْسَ لَهُمْ طَعَامٌ, what should you identify first?",options:["The form لَيْسَ and the statement it changes","A direct object (مفعول به) after every verb","A possessive construction (إضافة)"],answer:0,why:"لَيْسَ is a special verb used for negation. Read the full statement and use FSTU Naḥw p. 42 to examine its relationship with the اسم of ليس."}},
    13:{passage:"Al-Humazah",page:601,nahwPages:[17],sarfPages:[19,24],
      nahw:"FSTU Naḥw, p. 17 introduces verbs (فعل). On this page, compare the past/perfect form جَمَعَ with the imperfect form يَحْسَبُ; the sūrah does not provide a clean target example for a full negation lesson.",
      sarf:"FSTU Ṣarf, pp. 19 and 24: compare a past/perfect verb (فعل ماضٍ) with an imperfect verb (فعل مضارع). Identify the whole word before considering its root or ending.",
      media:"past and imperfect verbs",
      quiz:{question:"Which word is a past/perfect verb (فعل ماضٍ) in Al-Humazah?",options:["جَمَعَ","يَحْسَبُ","مَالًا"],answer:0,why:"جَمَعَ is a past/perfect verb (فعل ماضٍ). يَحْسَبُ is an imperfect verb (فعل مضارع), while مَالًا is a noun (اسم). Compare these forms on the page."}},
    14:{passage:"Al-Burūj",page:590,nahwPages:[49],sarfPages:[42,43],
      nahw:"FSTU Naḥw, p. 49: the deputy subject (نائب الفاعل) in a passive construction.",
      sarf:"FSTU Ṣarf, pp. 42–43: the passive verb (الفعل المجهول), including the past passive form. Compare the complete word pattern.",
      media:"passive voice and word forms",
      quiz:{question:"In a passive construction (مبني للمجهول), what should you look for?",options:["The passive verb form and the نائب الفاعل","Only the doer (فاعل) stated in the usual way","A preposition phrase (جار ومجرور) in every case"],answer:0,why:"The passive construction foregrounds the action without naming the doer in the usual way. Look for the deputy subject (نائب الفاعل) where present."}},
    15:{passage:"Al-Ghāshiyah 8–16",page:592,nahwPages:[65,99],sarfPages:[65,68],
      nahw:"FSTU Naḥw, pp. 65 and 99: use the described noun/description relationship, not word shape alone.",
      sarf:"FSTU Ṣarf, pp. 65 and 68: compare active participle (اسم الفاعل) and passive participle (اسم المفعول).",
      media:"active and passive participles",
      quiz:{question:"Which pairing correctly matches the two participle terms?",options:["اسم الفاعل = active participle; اسم المفعول = passive participle","اسم الفاعل = passive participle; اسم المفعول = active participle","Both terms mean attached pronoun (ضمير متصل)"],answer:0,why:"اسم الفاعل is the active participle; اسم المفعول is the passive participle. Their shape can help recognition, but context confirms the function."}},
    16:{passage:"Al-Fātiḥah — checkpoint 2",page:1,checkpoint:true,nahwPages:[65,117],sarfPages:[65,68],
      nahw:"Checkpoint review: revisit descriptive phrases (نعت) and relative expressions (اسم موصول) as needed; there is no new Naḥw unit.",
      sarf:"Checkpoint review: compare اسم الفاعل and اسم المفعول only if it helps justify a form.",
      media:"review of relationships and descriptions",
      quiz:{question:"What makes a checkpoint analysis reliable?",options:["A fresh Arabic example, the paired English + Arabic label, and a defensible clue","A remembered translation with no structure identified","A grammar label copied without applying it"],answer:0,why:"A checkpoint tests transfer. You must point to the real Arabic evidence and explain why the label fits."}},
    17:{passage:"Yā-Sīn 28–40",page:442,nahwPages:[27,56],sarfPages:[57,58],
      nahw:"FSTU Naḥw, p. 56 teaches exclusion (استثناء); p. 27 introduces particles (حروف). In إِنْ كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً, examine the restrictive إِنْ ... إِلَّا pattern. Do not label this phrase as a standard conditional sentence (شرط).",
      sarf:"FSTU Ṣarf, pp. 57–58: use the negation examples to revisit how the surrounding form interacts with a small marker. Treat this as support for reading the whole expression, not a claim that every particle has the same function.",
      media:"restriction, particles and exception",
      quiz:{question:"Which phrase uses إِنْ ... إِلَّا to restrict the statement to one thing?",options:["إِنْ كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً","فَإِذَا هُمْ خَامِدُونَ","وَآيَةٌ لَهُمُ الْأَرْضُ الْمَيْتَةُ"],answer:0,why:"إِنْ ... إِلَّا gives a restrictive meaning here: it was only one blast. Recognise the complete construction before interpreting either marker alone."}},
    18:{passage:"Al-Infiṭār 1–19",page:587,nahwPages:[127,137],sarfPages:[16],
      nahw:"FSTU Naḥw, p. 127 covers non-polar questions (استفهام); p. 137 covers direct address (نداء). In مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ and يَا أَيُّهَا الْإِنْسَانُ, identify the question and address separately.",
      sarf:"FSTU Ṣarf, p. 16: review how a pronoun (ضمير) can be attached to a complete verb form; notice the ك in غَرَّكَ rather than separating it from the word.",
      media:"open questions and direct address",
      quiz:{question:"Which phrase is direct address (نداء) in Al-Infiṭār?",options:["يَا أَيُّهَا الْإِنْسَانُ","إِذَا السَّمَاءُ انْفَطَرَتْ","وَإِذَا الْكَوَاكِبُ انْتَثَرَتْ"],answer:0,why:"يَا أَيُّهَا الْإِنْسَانُ calls directly to the person being addressed (نداء). The other options describe events introduced by إذا."}},
    19:{passage:"Al-Fajr 1–5 (oaths)",page:593,nahwPages:[139,50],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 139: oath sentences (قسم). Use p. 50 as a supplementary reference when discussing the time marker إِذَا in وَاللَّيْلِ إِذَا يَسْرِ.",
      sarf:"FSTU Ṣarf, p. 24: recognise complete imperfect forms (فعل مضارع) when useful; do not overanalyse a weak form without need.",
      media:"oaths and time markers",
      quiz:{question:"Which phrase is the opening oath (قسم) of Sūrat al-Fajr?",options:["وَالْفَجْرِ","أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ","إِنَّ رَبَّكَ لَبِالْمِرْصَادِ"],answer:0,why:"وَالْفَجْرِ opens the sūrah with an oath (قسم). Identify what is sworn by, then follow the statement that the oath frames."}},
    20:{passage:"An-Nāziʿāt 34–46",page:584,nahwPages:[50],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 50: adverbs of place/time (ظرف) and how they attach to a statement.",
      sarf:"FSTU Ṣarf, p. 24: revisit full imperfect forms (فعل مضارع) only as a support for reading the action.",
      media:"time/place expressions and clauses",
      quiz:{question:"A time/place expression (ظرف) tells you...",options:["when/where an action or situation is located","who the doer (فاعل) is in every sentence","which noun is the second part of an إضافة"],answer:0,why:"A ظرف indicates time or place in relation to an action or statement. Explain what the expression attaches to."}},
    21:{passage:"Al-Bayyinah 1–8",page:599,nahwPages:[53],sarfPages:[24],
      nahw:"FSTU Naḥw, p. 53 teaches the reason object (مفعول له). On Al-Bayyinah 5, compare لِيَعْبُدُوا اللَّهَ, which uses the purpose lām (لام التعليل), as a separate way to express purpose. These are related in meaning but are not the same grammatical construction.",
      sarf:"FSTU Ṣarf, p. 24: recognise the complete imperfect verb (فعل مضارع) in لِيَعْبُدُوا and connect it to the purpose marker. Do not infer a grammar label from translation alone.",
      media:"reason and purpose: two distinct constructions",
      quiz:{question:"What is the key distinction between مفعول له and لام التعليل?",options:["They can both express reason/purpose, but they are different grammatical constructions","They are two names for the same particle","Neither can relate to an action"],answer:0,why:"FSTU Naḥw p. 53 focuses on مفعول له, while لام التعليل is a lām-prefixed purpose marker, as in لِيَعْبُدُوا اللَّهَ. Compare the form and role, not just the English meaning."}},
    22:{passage:"Aḍ-Ḍuḥā and Ash-Sharḥ",page:596,nahwPages:[54,95],sarfPages:[65],
      nahw:"FSTU Naḥw, pp. 54 and 95: the circumstantial qualifier (حال), including a حال expressed as a clause.",
      sarf:"FSTU Ṣarf, p. 65: review the active participle (اسم الفاعل) as one possible form clue in descriptive wording.",
      media:"ḥāl and descriptions",
      quiz:{question:"A circumstantial qualifier (حال) usually tells you...",options:["the state/circumstance of a person or thing in a situation","the object (مفعول به) of every verb","the second noun in a possessive construction (مضاف إليه)"],answer:0,why:"حال describes a state or circumstance related to the situation. Identify what it describes and show the contextual clue."}},
    23:{passage:"An-Naba 12–16 (retrieval revisit)",page:582,nahwPages:[80],sarfPages:[19],
      nahw:"FSTU Naḥw, p. 80: numeric phrases (عدد). In سَبْعًا شِدَادًا, identify the number and then the counted thing understood in context; compare the description after it without confusing the two roles.",
      sarf:"FSTU Ṣarf, p. 19: use a complete past/perfect verb (فعل ماضٍ) as a supporting clue in the surrounding passage. The main target is the number phrase (عدد).",
      media:"number phrases and descriptive agreement",
      quiz:{question:"Which phrase contains a number (عدد) with its description in An-Naba?",options:["سَبْعًا شِدَادًا","مَاءً ثَجَّاجًا","جَنَّاتٍ أَلْفَافًا"],answer:0,why:"سَبْعًا is the number (عدد), and شِدَادًا describes the seven heavens. The other phrases are descriptive expressions, not the number phrase this task asks you to locate."}},
    24:{passage:"Al-Fātiḥah — checkpoint 3",page:1,checkpoint:true,nahwPages:[38,84],sarfPages:[16,60],
      nahw:"Retrieval checkpoint: find an attached pronoun (ضمير متصل), such as نَا in اهْدِنَا, or a prepositional phrase (جار ومجرور), such as لِلَّهِ or عَلَيْهِمْ. Use the source pages only to resolve a real uncertainty.",
      sarf:"Retrieval checkpoint: revisit p. 16 for pronouns (ضمير) in complete forms and p. 60 for the command (أمر) in اهْدِنَا. There is no new unit this week.",
      media:"retrieval: attached forms, prepositions and commands",
      quiz:{question:"Which word on Al-Fātiḥah is a command verb (فعل أمر) with an attached pronoun (ضمير متصل)?",options:["اهْدِنَا","الرَّحْمَٰنِ","الْحَمْدُ"],answer:0,why:"اهْدِنَا is a command form (فعل أمر) with نَا attached as a pronoun (ضمير متصل). A checkpoint asks you to recognise the form on the real page, not start a new unit."}},
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
    27:{passage:"Al-Fajr 21–30",page:593,nahwPages:[51,48],sarfPages:[70,72],
      nahw:"FSTU Naḥw, p. 51 is the relevant page for the adverb of degree / absolute object (مفعول مطلق). Use p. 48 only as a contrast with the direct object (مفعول به). In دَكًّا دَكًّا, explain how the repeated verbal-noun form reinforces or characterises the action.",
      sarf:"FSTU Ṣarf, pp. 70 and 72: use the short conjugation material and summary to recognise a related verbal noun (مصدر) or root. Root similarity is a clue, not proof of syntactic role.",
      media:"the absolute object and repeated action",
      quiz:{question:"Which phrase illustrates the absolute object (مفعول مطلق) on the assigned Al-Fajr page?",options:["دَكًّا دَكًّا","جِيءَ يَوْمَئِذٍ بِجَهَنَّمَ","يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ"],answer:0,why:"دَكًّا دَكًّا is the repeated expression linked to the action and illustrates the absolute object (مفعول مطلق). FSTU Naḥw p. 51 is the main reference; p. 48 is for comparison with مفعول به."}},
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
    30:{passage:"Al-Ikhlāṣ, Al-Falaq and An-Nās",page:604,nahwPages:[84,72],sarfPages:[57,58],
      nahw:"FSTU Naḥw, p. 84: recognise a prepositional phrase (جار ومجرور); p. 72: recognise the possessive construction (إضافة). In مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ, follow the preposition and the linked noun pair.",
      sarf:"FSTU Ṣarf, pp. 57–58: use لَمْ يَلِدْ وَلَمْ يُولَدْ as a short review of negation (نفي), distinct from the main target of this week.",
      media:"preposition phrases, possessive pairs and a brief negation review",
      quiz:{question:"Which option contains the linked noun pair (مضاف + مضاف إليه) شَرِّ الْوَسْوَاسِ?",options:["مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ","قُلْ هُوَ اللَّهُ أَحَدٌ","لَمْ يَلِدْ وَلَمْ يُولَدْ"],answer:0,why:"In شَرِّ الْوَسْوَاسِ, شَرِّ is the first noun (مضاف) and الْوَسْوَاسِ is the second noun (مضاف إليه). The full phrase also begins with a preposition phrase (جار ومجرور)."}},
    31:{passage:"Al-Ikhlāṣ, Al-Falaq and An-Nās — reference page for the capstone",page:604,capstone:true,nahwPages:[150],sarfPages:[72],
      nahw:"FSTU Naḥw, p. 150: use the English/Arabic index to find only the concept you cannot justify. Then return to your own memorised page.",
      sarf:"FSTU Ṣarf, p. 72: use the summary to revisit only a relevant form or pattern; do not start a new unit.",
      media:"independent analysis of a familiar page",
      quiz:{question:"Which workflow best demonstrates independent recognition on a fresh memorised page?",options:["Read the Arabic, mark evidence, name the paired term, explain the relationship, then check one uncertainty","Translate the page first and guess its grammatical structure","Use the index to copy a term without applying it"],answer:0,why:"Independent analysis means you can point to the Arabic evidence and explain the feature before looking up one unresolved concept. Use p. 604 here as a model page, then repeat on a page chosen with your teacher."}}
  };

  var SPOT_TASKS = {
    1:{prompt:"Find the word that is an اسم (noun).",options:["الْقُرْآنِ","تُنْذِرُ","مِنْ"],answer:0,why:"الْقُرْآنِ is an اسم (noun); تُنْذِرُ is a فعل (verb); مِنْ is a حرف (particle). Compare each choice with the page above."},
    2:{prompt:"In وَهُوَ الْعَزِيزُ الْغَفُورُ, which word is the مبتدأ (topic)?",options:["هُوَ","الْعَزِيزُ","الْغَفُورُ"],answer:0,why:"هُوَ is the مبتدأ (topic); الْعَزِيزُ supplies the خبر (predicate/information). Read the complete nominal sentence (جملة اسمية)."},
    3:{prompt:"In أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا, which noun is the first direct object (مفعول به)?",options:["الْأَرْضَ","نَجْعَلِ","مِهَادًا"],answer:0,why:"الْأَرْضَ is the first direct object (مفعول به) of نَجْعَلِ. The verb and the following expression must be read together."},
    4:{prompt:"Which phrase shows a preposition (حرف جر) linked to a noun in the genitive (مجرور)?",options:["بِثَالِثٍ","جَاءَهَا","الْمُرْسَلُونَ"],answer:0,why:"In بِثَالِثٍ, بِـ is a preposition (حرف جر) and ثَالِثٍ is in the genitive (مجرور)."},
    5:{prompt:"Which marker links the two alternatives as a conjunction (حرف عطف)?",options:["أَوْ","فِي","إِنَّهُ"],answer:0,why:"أَوْ links the two alternatives in أَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ. This is a conjunction link (عطف), not a preposition."},
    6:{prompt:"Which phrase is a possessive construction (إضافة) with a first noun (مضاف) and second noun (مضاف إليه)?",options:["خَلْقِ الرَّحْمَٰنِ","عَلَىٰ كُلِّ شَيْءٍ","وَهُوَ الْعَزِيزُ"],answer:0,why:"In خَلْقِ الرَّحْمَٰنِ, خَلْقِ is the first noun (مضاف) and الرَّحْمَٰنِ is the second noun (مضاف إليه). Read them as one linked unit."},
    7:{prompt:"Which word includes an attached pronoun (ضمير متصل) meaning “them”?",options:["عِلِّيِّينَ","بِهِمْ","الْأَبْرَارَ"],answer:1,why:"بِهِمْ includes the attached pronoun (ضمير متصل) هِمْ. Read the complete word, including the preposition before the pronoun."},
    8:{prompt:"Checkpoint 1 · Which word on Al-Fātiḥah combines a command form (فعل أمر) with an attached pronoun (ضمير متصل)?",options:["اهْدِنَا","الرَّحْمَٰنِ","مَالِكِ"],answer:0,why:"اهْدِنَا is a command form (فعل أمر) with نَا attached as a pronoun (ضمير متصل). Explain the clue aloud before checking notes."},
    9:{prompt:"Which phrase contains a descriptive pair (منعوت + نعت) on the assigned An-Naba page?",options:["كَواعِبَ أَتْرَابًا","مَفَازًا","حَمِيمًا"],answer:0,why:"كَواعِبَ is described by أَتْرَابًا. Identify the described noun (منعوت) and its adjective (نعت), then check the relationship in context."},
    10:{prompt:"Which word opens a relative expression with an اسم موصول (relative pronoun)?",options:["الَّذِي","الْمَرْعَىٰ","غُثَاءً"],answer:0,why:"الَّذِي is an اسم موصول (relative pronoun); the words that follow complete its meaning in the صلة الموصول (relative clause)."},
    11:{prompt:"Which phrase begins with the emphasis marker إِنَّ in Al-ʿĀdiyāt?",options:["إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ","وَالْعَادِيَاتِ ضَبْحًا","فَالْمُورِيَاتِ قَدْحًا"],answer:0,why:"إِنَّ opens the emphatic statement (إنّ وأخواتها). Read the rest of the phrase to see which statement is being strengthened."},
    12:{prompt:"Which phrase contains لَيْسَ, the special verb used for negation?",options:["لَيْسَ لَهُمْ طَعَامٌ","وُجُوهٌ يَوْمَئِذٍ","عَامِلَةٌ نَاصِبَةٌ"],answer:0,why:"لَيْسَ لَهُمْ طَعَامٌ is the negative statement. Use FSTU Naḥw p. 42 to inspect the اسم of ليس and how the statement is structured."},
    13:{prompt:"Which word is a past/perfect verb (فعل ماضٍ) in Al-Humazah?",options:["جَمَعَ","يَحْسَبُ","مَالًا"],answer:0,why:"جَمَعَ is a past/perfect verb (فعل ماضٍ), while يَحْسَبُ is an imperfect verb (فعل مضارع) and مَالًا is a noun (اسم)."},
    14:{prompt:"Which phrase contains a passive construction (مبني للمجهول) and its deputy subject (نائب الفاعل)?",options:["وَالسَّمَاءِ ذَاتِ الْبُرُوجِ","قُتِلَ أَصْحَابُ الْأُخْدُودِ","الْيَوْمِ الْمَوْعُودِ"],answer:1,why:"قُتِلَ is the passive verb (مبني للمجهول), and أَصْحَابُ is the deputy subject (نائب الفاعل)."},
    15:{prompt:"Which phrase contains a passive participle (اسم المفعول)?",options:["سُرُرٌ مَرْفُوعَةٌ","وُجُوهٌ نَاعِمَةٌ","لِسَعْيِهَا رَاضِيَةٌ"],answer:0,why:"مَرْفُوعَةٌ is a passive participle (اسم المفعول); نَاعِمَةٌ and رَاضِيَةٌ are active participles (اسم الفاعل)."},
    16:{prompt:"Checkpoint 2 · Which phrase gives a described noun (منعوت) followed by its adjective (نعت) in Al-Fātiḥah?",options:["الصِّرَاطَ الْمُسْتَقِيمَ","إِيَّاكَ نَعْبُدُ","اهْدِنَا"],answer:0,why:"الصِّرَاطَ is the described noun (منعوت); الْمُسْتَقِيمَ is its adjective (نعت). Explain the visible relationship without translating the entire sūrah."},
    17:{prompt:"Which phrase uses the restrictive إِنْ ... إِلَّا construction (استثناء / restriction)?",options:["إِنْ كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً","فَإِذَا هُمْ خَامِدُونَ","وَآيَةٌ لَهُمُ الْأَرْضُ الْمَيْتَةُ"],answer:0,why:"إِنْ ... إِلَّا restricts the statement here to one blast. This is not the usual conditional sentence (شرط) pattern."},
    18:{prompt:"Which phrase is direct address (نداء) on the assigned Al-Infiṭār page?",options:["يَا أَيُّهَا الْإِنْسَانُ","إِذَا السَّمَاءُ انْفَطَرَتْ","وَإِذَا الْكَوَاكِبُ انْتَثَرَتْ"],answer:0,why:"يَا أَيُّهَا الْإِنْسَانُ is direct address (نداء); compare it with the statements introduced by إذا."},
    19:{prompt:"Which phrase opens Sūrat al-Fajr with an oath (قسم)?",options:["وَالْفَجْرِ","أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ","إِنَّ رَبَّكَ لَبِالْمِرْصَادِ"],answer:0,why:"وَالْفَجْرِ is the opening oath (قسم). Identify what is sworn by and then follow the claim framed by the oath."},
    20:{prompt:"Which phrase contains an explicit time expression (ظرف زمان) in the assigned passage?",options:["يَوْمَ يَتَذَكَّرُ الْإِنْسَانُ مَا سَعَىٰ","فَأَمَّا مَنْ طَغَىٰ","فَإِنَّ الْجَحِيمَ هِيَ الْمَأْوَىٰ"],answer:0,why:"يَوْمَ connects the event to the time at which the person remembers their striving. Use the FSTU Naḥw page on time/place expressions (ظرف)."},
    21:{prompt:"Which phrase uses the purpose lām (لام التعليل)?",options:["لِيَعْبُدُوا اللَّهَ","مُخْلِصِينَ لَهُ الدِّينَ","ذَٰلِكَ دِينُ الْقَيِّمَةِ"],answer:0,why:"The لِـ in لِيَعْبُدُوا expresses purpose (لام التعليل). FSTU Naḥw p. 53 teaches the different construction مفعول له; the two are related in meaning, not identical."},
    22:{prompt:"Which phrase uses a circumstantial qualifier (حال) to describe the state during an action?",options:["وَوَجَدَكَ ضَالًّا فَهَدَىٰ","فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ","أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ"],answer:0,why:"ضَالًّا gives the state associated with وَجَدَكَ and illustrates a circumstantial qualifier (حال). Use the complete phrase as evidence."},
    23:{prompt:"Which phrase contains a number phrase (عدد) rather than a descriptive expression?",options:["سَبْعًا شِدَادًا","مَاءً ثَجَّاجًا","جَنَّاتٍ أَلْفَافًا"],answer:0,why:"سَبْعًا is the number (عدد) in سَبْعًا شِدَادًا. Read the phrase together and distinguish the number from its description."},
    24:{prompt:"Checkpoint 3 · Which word is a command verb (فعل أمر) with an attached pronoun (ضمير متصل)?",options:["اهْدِنَا","الْحَمْدُ","الرَّحْمَٰنِ"],answer:0,why:"اهْدِنَا contains the command verb (فعل أمر) and the attached pronoun (ضمير متصل) نَا. This is a retrieval checkpoint, not a new unit."},
    25:{prompt:"Which phrase uses إِنْ ... إِلَّا to give a restrictive meaning (استثناء / restriction)?",options:["إِنْ يَقُولُونَ إِلَّا كَذِبًا","مَا لَهُم بِهِ مِنْ عِلْمٍ","وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا"],answer:0,why:"إِنْ يَقُولُونَ إِلَّا كَذِبًا limits the claim to falsehood. Distinguish this full construction from the different pattern in مَا لَهُم بِهِ مِنْ عِلْمٍ."},
    26:{prompt:"Which phrase expresses restriction with مَا ... إِلَّا?",options:["وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ","ذَٰلِكَ دِينُ الْقَيِّمَةِ","وَالْفَجْرِ"],answer:0,why:"The paired markers مَا ... إِلَّا restrict the statement. Identify both markers and read what they enclose before interpreting the phrase."},
    27:{prompt:"Which phrase illustrates the absolute object (مفعول مطلق) on the assigned Al-Fajr page?",options:["دَكًّا دَكًّا","جِيءَ يَوْمَئِذٍ بِجَهَنَّمَ","يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ"],answer:0,why:"دَكًّا دَكًّا reinforces the action and illustrates the absolute object (مفعول مطلق). FSTU Naḥw p. 51 is the main source; p. 48 is only a contrast."},
    28:{prompt:"Which phrase begins with a relative pronoun (اسم موصول) whose clause completes it?",options:["الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ","الْحَمْدُ لِلَّهِ","لِيَكُونَ لِلْعَالَمِينَ نَذِيرًا"],answer:0,why:"الَّذِي opens the relative expression (اسم موصول); the following clause is its صلة الموصول (relative clause)."},
    29:{prompt:"Which phrase uses a conjunction link (عطف) between two actions?",options:["يُرَاءُونَ وَيَمْنَعُونَ الْمَاعُونَ","فَوَيْلٌ لِلْمُصَلِّينَ","الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ"],answer:0,why:"وَ links يُرَاءُونَ and يَمْنَعُونَ. Identify the linked actions and explain the conjunction (عطف) in context."},
    30:{prompt:"Which phrase contains the noun pair (مضاف + مضاف إليه) شَرِّ الْوَسْوَاسِ?",options:["مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ","قُلْ هُوَ اللَّهُ أَحَدٌ","لَمْ يَلِدْ وَلَمْ يُولَدْ"],answer:0,why:"In شَرِّ الْوَسْوَاسِ, شَرِّ is the first noun (مضاف) and الْوَسْوَاسِ the second (مضاف إليه). The full phrase also contains a preposition phrase (جار ومجرور)."}
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
    return '<section class="weekly-guide book-library-setup" aria-labelledby="bookLibraryTitle"><div class="guide-eyebrow">SOURCE PAGES · READY TO OPEN</div><h2 id="bookLibraryTitle">No PDF upload or setup needed</h2><p>The assigned 15-line Madina Qur’an page appears in each lesson. FSTU Ṣarf (صرف) and Naḥw (نحو) pages open inside the lesson from Al-Qalam Institute’s official hosted PDFs; select the exact printed page using the tabs.</p><div class="source-credit-grid"><article><b>15-line Madina Qur’an</b><p>Text-rendered 1441H New Madina layout. Compare with your printed Mushaf if the edition or line breaks differ.</p><a href="https://github.com/tarekeldeeb/quran-madina-html" target="_blank" rel="noreferrer">Renderer and project details ↗</a></article><article><b>FSTU Ṣarf (صرف)</b><p>The assigned source page opens inside each weekly lesson.</p><a href="'+SARF_RESOURCES+'" target="_blank" rel="noreferrer">Official Al-Qalam Institute resources ↗</a></article><article><b>FSTU Naḥw (نحو)</b><p>Page references target the August 2026 edition.</p><a href="'+NAHW_RESOURCES+'" target="_blank" rel="noreferrer">Official Al-Qalam Institute resources ↗</a></article></div><p class="guide-small">An internet connection is needed for the digital Qur’an renderer, official textbook viewers and listening links. FSTU materials remain the property of Al-Qalam Institute and are used in accordance with its educational/non-commercial terms.</p></section>';
  }
  function pageFrame(kind,page) {
    page=Number(page)||1;
    if(kind==="quran") return '<div class="book-page-frame quran-page-frame" data-book-page="quran:'+page+'" aria-label="Digital 15-line Madina Mushaf page '+page+'"><quran-madina-html page="'+page+'" data-quran-renderer="1441H"></quran-madina-html><p class="quran-page-caption">Printed Madina page '+page+' · 1441H New Madina digital layout</p></div>';
    return '<div class="book-page-frame" data-book-page="'+kind+':'+page+'"></div>';
  }
  function renderBookGroup(kind,pages,focus) {
    var title=kind==="sarf"?"FSTU Ṣarf (صرف)":"FSTU Naḥw (نحو)",sourcePages=pages||[];
    var titles=kind==="sarf"?SARF_PAGE_TITLES:NAHW_PAGE_TITLES;
    var fileId=kind==="sarf"?"1D4Sr_0iz8fywSmPMB1H9iM1a4FOU7tzr":"1BdY0tAvoaKvJVUhmMQn09bxLh0fAXO03";
    var sourceUrl=kind==="sarf"?SARF_RESOURCES:NAHW_RESOURCES;
    var tabs=sourcePages.map(function(p,i){return '<button type="button" class="fstu-page-tab'+(i===0?" active":"") + '" data-fstu-kind="'+kind+'" data-fstu-page="'+p+'" aria-pressed="'+(i===0?"true":"false")+'">p. '+p+'</button>';}).join("");
    var first=sourcePages.length?sourcePages[0]:1,pageTitle=titles[first]||"Source page";
    var src="https://drive.google.com/file/d/"+fileId+"/preview?rm=minimal#page="+first;
    return '<article class="textbook-panel '+kind+'-panel"><div class="textbook-panel-head"><div><div class="guide-eyebrow">'+(kind==="sarf"?"SOURCE BOOK · MORPHOLOGY":"SOURCE BOOK · GRAMMAR")+'</div><h3>'+title+'</h3></div><span class="book-page-count">'+sourcePages.length+' assigned page'+(sourcePages.length===1?"":"s")+'</span></div><p>'+esc(focus)+'</p><div class="fstu-page-tabs" role="group" aria-label="Choose printed page from '+title+'">'+tabs+'</div><div class="book-page-frame fstu-page-viewer" data-fstu-viewer="'+kind+'" data-book-page="'+kind+':'+first+'"><iframe loading="lazy" title="'+title+' printed page '+first+'" data-fstu-frame="'+kind+'" src="'+src+'" allow="clipboard-read; clipboard-write" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="fstu-print-note"><b>'+title+'</b><p>Assigned printed pages: '+sourcePages.map(function(p){return p+' — '+(titles[p]||"source page");}).join("; ")+'</p><a href="'+sourceUrl+'" target="_blank" rel="noreferrer">Open official resources and full text ↗</a></div></div><div class="textbook-page-caption" data-fstu-caption="'+kind+'">Showing printed p. '+first+' · '+esc(pageTitle)+' · <a href="https://drive.google.com/file/d/'+fileId+'/view?usp=sharing#page='+first+'" target="_blank" rel="noreferrer">Open page in a new tab ↗</a></div></article>';
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
