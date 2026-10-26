# Curriculum and pedagogy audit — 26 October 2026

## Outcome and method

The course uses **source → teach back → Qur’an → retrieve → transfer**. Each student studies the exact FSTU pages assigned for that week, then answers a source-concept question and explains the concept in their own words. Only after passing this self-check does the 15-line Qur’an stage open. The lesson presents fully vowelled key Arabic terms with subtle transliteration, especially in the source-concept checklist and role labels used for word-level recognition.

The course keeps FSTU as its primary source because the materials explicitly develop rule application and tarkīb (تَرْكِيبٌ, tarkīb). The official page cards open at the assigned page rather than embedding an entire book as an inline learning resource. The external preview may permit navigation elsewhere; the lesson itself lists only the assigned page numbers. The digital Qur’an layout may differ from a student’s physical Mushaf, so the passage context should be checked with a teacher.

The app records progress and student explanations but does not automatically grade nuanced grammar. Hifz remains the priority: Sabaq, Sabaq Sipara / Sabqi and Dhor / Dawr come first. The Wudhu reminder remains adab guidance for physical Mushaf handling, not a software gate.

## Classroom monitoring and security

The Teacher Classroom is designed for multiple teachers, with teacher-owned classes, class codes, individual learner codes, row-level security, and progress/evidence review. Learner access codes are hashed; raw codes are shown only once when the roster is generated. A teacher must configure a Supabase project controlled by the madrassa, run `classroom-schema.sql`, and enable Anonymous Sign-Ins for learners. Until that project is configured, progress remains local to the browser and is not visible centrally.

On shared devices, the learner should disconnect before the next learner uses the device. Disconnect attempts to sync first, unlinks the session and clears local learning stores. This reduces—but cannot eliminate all risks from—shared-browser or failed-network situations. The deployment should be approved by the madrassa, with age-appropriate privacy information for children and parents and a clear retention/deletion process.

## Week-by-week mapping and decisions
## Week-by-week mapping and decisions

| Week | Qur’anic passage / target | FSTU references | Audit decision |
|---:|---|---|---|
| 1 | Yā-Sīn 1–12, p. 440: اسم / فعل / حرف | Naḥw p. 8; Ṣarf pp. 19, 24 | Begin with word types; recognise full forms, then return to the phrase. |
| 2 | Al-Mulk 1–12, p. 562: مبتدأ / خبر | Naḥw p. 34; Ṣarf p. 19 | Start from the complete statement, not two disconnected word labels. |
| 3 | An-Naba 1–29, p. 582: فاعل / مفعول به | Naḥw pp. 47–48; Ṣarf pp. 19, 24 | Direct source pages identify doer and object. Only assign an object when the verb/context supports one. |
| 4 | Yā-Sīn 13–27, p. 441: حرف جر / اسم مجرور | Naḥw p. 84; Ṣarf p. 16 | Teach the preposition and governed noun as one connected phrase. |
| 5 | Al-Mulk 13–26, p. 563: عطف | Naḥw p. 69; Ṣarf p. 24 | Ask which two elements are linked, not merely what the conjunction translates as. |
| 6 | Al-Mulk 1–12, p. 562: إضافة | Naḥw p. 72; Ṣarf p. 16 | Distinguish مضاف / مضاف إليه from an adjective construction. |
| 7 | Selected Al-Muṭaffifīn, p. 588: ضمير | Naḥw pp. 38, 57; Ṣarf pp. 16–17 | Read attached pronouns within their complete words. |
| 8 | Al-Fātiḥah, p. 1: foundation checkpoint | Naḥw pp. 8, 34; Ṣarf pp. 19, 24 | Retrieval only; the app says to move to a memorised transfer page if a feature is absent. |
| 9 | An-Naba 31–40, p. 583: نعت / منعوت | Naḥw pp. 65, 99; Ṣarf p. 65 | Word proximity alone is not evidence of the adjective relationship. |
| 10 | Al-Aʿlā, p. 591: اسم موصول / صلة الموصول | Naḥw p. 117; Ṣarf p. 16 | Read the relative noun together with its completing clause. |
| 11 | Al-ʿĀdiyāt, p. 600: opening oath | Naḥw p. 139 and p. 27; Ṣarf p. 19 | Corrected the old “inna and emphasis” focus: this sūrah opens with وَالْعَادِيَاتِ. |
| 12 | Al-Ghāshiyah, p. 592: nominal statement | Naḥw pp. 34, 65; Ṣarf p. 24 | Replaced the absent kāna/laysa example with topic/predicate and a predicate-versus-adjective distinction. |
| 13 | Al-Ikhlāṣ 3–4, p. 604: لم يلد / لم يولد | Naḥw pp. 20–21; Ṣarf pp. 57–58 | Selected text provides an explicit negation marker and the governed imperfect verb. |
| 14 | Al-Burūj, p. 590: passive verb / deputy subject | Naḥw p. 49; Ṣarf pp. 42–43 | Look for a passive form and نائب الفاعل only where the construction supplies it. |
| 15 | Al-Burūj 1–3, p. 590: شاهد / مشهود | Naḥw p. 65 as contrast; Ṣarf pp. 65, 68 | Clearer active/passive participle contrast than the previous passage. |
| 16 | Al-Fātiḥah, p. 1: cumulative checkpoint | Naḥw pp. 65, 117; Ṣarf pp. 65, 68 | Retrieval and transfer, not an assumption that every target appears in Al-Fātiḥah. |
| 17 | Yā-Sīn 28–40, p. 442: إلا / exception | Naḥw pp. 56, 27; Ṣarf pp. 57–58 | Replaced conditional focus with the visible exception/restriction construction. |
| 18 | Al-Infiṭār, p. 587: ما غرّك / يا أيها الإنسان | Naḥw pp. 127, 137; Ṣarf p. 16 | Corrected page focus to non-polar question and direct address. |
| 19 | Al-Fajr, p. 593: oath | Naḥw pp. 139, 50; Ṣarf p. 24 | Start with the oath marker and explain the statement it frames. |
| 20 | An-Nāziʿāt 34–46, p. 584: time/place expressions | Naḥw p. 50; Ṣarf p. 24 | Explain what the ظرف locates within the statement. |
| 21 | Al-Bayyinah, p. 599: لام التعليل | Naḥw p. 53 as a contrast; Ṣarf p. 24 | Explicitly distinguish purpose lām from مفعول لأجله, which is a related but different form. |
| 22 | Aḍ-Ḍuḥā / Ash-Sharḥ, p. 596: حال | Naḥw pp. 54, 95; Ṣarf p. 65 | Explain the circumstance and the word/expression it qualifies. |
| 23 | Al-Balad, p. 594: النجدين / dual noun | Naḥw p. 12; Ṣarf p. 16 as contrast | Corrected the previous number-phrase page mismatch; p. 12 directly teaches noun number/dual. |
| 24 | Al-Fātiḥah, p. 1: cumulative checkpoint | Naḥw pp. 50, 54; Ṣarf pp. 57, 60 | Do not force حال or ظرف onto Al-Fātiḥah; choose a transfer page when appropriate. |
| 25 | Al-Kahf 5–8, p. 294: من / ما in context | Naḥw p. 27; Ṣarf p. 57 | Read the whole expression rather than applying a fixed one-word gloss. |
| 26 | Al-Bayyinah, p. 599: لم يكن الذين كفروا | Naḥw pp. 20, 36, 41; Ṣarf pp. 57–58 | Changed to visible negation + كان rather than a less direct emphasis/restriction match. |
| 27 | Al-Fajr 21–30, p. 593: دكت الأرض دكاً دكاً | Naḥw p. 52; Ṣarf pp. 70, 72 | Corrected the page reference: p. 51 is degree; p. 52 directly teaches frequency and مفعول مطلق للعدد. |
| 28 | Al-Kahf 1–4, p. 293: relative clause | Naḥw p. 117; Ṣarf p. 16 | Keep اسم موصول connected to صلة الموصول. |
| 29 | Al-Māʿūn, p. 602: عطف | Naḥw p. 69; Ṣarf p. 24 | Identify both sides of the link and describe the relationship. |
| 30 | Short sūrahs, p. 604: إضافة + جار ومجرور | Naḥw pp. 72, 84; Ṣarf p. 16 as contrast | Replaced an imprecise particles/negation focus with structures visible on the page. |
| 31 | Student-selected familiar page: independent analysis | Naḥw p. 150; Ṣarf p. 72 | Student identifies evidence, gives paired terminology, explains the relationship and checks one uncertainty. |

## Source and accuracy caveats

- The integrated reader uses a digital 15-line Madina layout. It may not reproduce the exact calligraphy or line breaks of the supplied King Fahd Complex PDF. The student must confirm the passage with the teacher and the physical Mushaf.
- FSTU Naḥw references use the official August 2026 resource. The embedded FSTU Ṣarf resource is October 2023; earlier mapping was made against a March 2022 copy. If pagination differs, use the printed section heading and check with a teacher. The weekly notes explain this where the reference is shown.
- The lesson lists only the FSTU page numbers assigned for the current week and opens each source preview at that printed page. The external preview may permit navigation elsewhere, so the code does not claim that every other page is technically inaccessible. Al-Qalam’s published terms support educational/non-commercial use with attribution; obtain written permission for commercial use or broader republication.
- The renderer is an upstream dependency. Its published licence should be checked before redistributing a bundled copy of the code.
- These are instructional mappings, not claims that every disputed Qur’anic parse has one uncontested answer. The app deliberately saves explanations for teacher review rather than pretending an automated test can grade all syntax.

## Additional delivery QA

1. Confirm Qur’an application remains closed until the FSTU source checks, explanation and correct source-concept answer are completed.
2. Confirm each lesson’s FSTU source-card set exactly equals that week’s assigned page references.
3. Verify multiple saved recognition attempts, Fātiḥah checkpoints and custom page loading.
4. Check desktop/mobile width, RTL rendering, vowel marks, transliteration legibility, printed workbook pagination and Hifz-first language.
5. Verify teacher isolation, student own-row policies, learner-code reset and shared-device disconnect/restore against a configured Supabase project before enrolling learners.
6. Confirm GitHub Actions build, workbook generation and Pages deployment are successful before considering the rollout complete.
