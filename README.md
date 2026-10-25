# 80/20 Arabic

**See the Qur’an. Understand the structure.** A 31-week Qur’an-first learning product for students who are memorising the Qur’an and want to recognise the Arabic words and structures they already encounter.

## Open the product

- Main learning site: https://moosa198.github.io/80-20-Arabic/
- Student Studio: https://moosa198.github.io/80-20-Arabic/student.html
- Source repository: https://github.com/moosa198/80-20-Arabic
- Printable workbook: use the Print full course workbook control in the main app; GitHub Actions builds and audits the workbook.

## Student experience

- Follow the 31-week sequence from word types and verb forms to connected structures and independent analysis.
- See the assigned 15-line Madina Qur’an page immediately. There is no PDF upload or setup step.
- Open the assigned FSTU Ṣarf (صرف) and Naḥw (نحو) pages in an embedded viewer for the official hosted PDFs; select the exact printed page assigned for that lesson.
- Complete a graded “Spot it on the Qur’anic page” selection task in each teaching week. The learner is prompted to locate the actual Arabic example, select it and receive an explanation. The selection is stored locally.
- Continue with a recall question and a free-text Qur’anic evidence task. The app grades selection questions; it does not pretend to auto-grade a learner’s full grammatical analysis.
- Complete Al-Fātiḥah retrieval checkpoints at weeks 8, 16 and 24, then an independent Week 31 capstone using a chosen printed Mushaf page and a page the student has memorised.
- Learn seven lexical words in each teaching week, alongside recurring high-frequency function words.
- Keep technical grammar labels paired in English and Arabic, such as pronoun (ضمير), nominal sentence (جملة اسمية), prepositional phrase (جار ومجرور) and absolute object (مفعول مطلق).
- Protect the Hifz priorities: Sabaq, Sabaq Sipara/Sabqi and Dhor/Dawr come first; Arabic supports Hifz rather than competing with it.

## Weekly learning flow

1. **Look at the Qur’an.** The assigned 15-line page appears immediately. The wudhu reminder concerns handling a physical Mushaf; it is not an on-screen gate.
2. **Check the source.** Read the assigned FSTU Ṣarf and Naḥw page in the official hosted PDF viewer. The page tabs switch between the printed page numbers set for the week.
3. **Listen.** Use the core lesson playlist and, when useful, the optional bonus playlist.
4. **Apply.** Find the structure, identify the supporting Arabic evidence, retrieve the rule and save an explanation for teacher feedback.

The sequence progresses from guided recognition (weeks 1–7), through retrieval and more complex structures (weeks 8–24), to lower-scaffold transfer (weeks 25–30) and the independent capstone (week 31). The course is designed around a 45-minute weekly class and short practice between lessons.

## Source editions and page mapping

The integrated Qur’an page uses the publicly published quran-madina-html browser renderer, which displays a text-rendered 15-line Madina layout rather than the scanned PDF originally used to build the page map. Renderer reference: https://github.com/tarekeldeeb/quran-madina-html. Its default dataset is identified by that project as Madina05. Different Mushaf editions can have different typography or line breaks, so teachers and learners should confirm the passage against the printed Mushaf they use. Week 31 lets the student choose a printed page number from 1 to 604.

FSTU source pages are opened from Al-Qalam Institute’s official hosted PDFs:

- FSTU Naḥw (نحو): https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources — the mappings target the August 2026 edition.
- FSTU Ṣarf (صرف): https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources — use the edition linked by the Institute’s official resource page.

The original content audit used the supplied 15 Line Qur’an PDF, FSTU Ṣarf (First Edition, March 2022) and FSTU Naḥw (First Edition, August 2026). Some weekly pairings were corrected to match the teaching target more accurately, including laysa in week 12, past vs imperfect forms in week 13, restriction vs condition in week 17, the distinct purpose constructions in week 21, the number phrase in week 23 and the absolute object in week 27.

### Attribution and use

FSTU textbook material belongs to Al-Qalam Institute. This site links to the official hosted sources and does not rehost the full PDFs. Follow the Institute’s current educational/non-commercial use and attribution requirements; obtain written permission before commercial reuse. Check the renderer repository for its current licence and terms, and do not assume the text-rendered digital layout is identical to the scan supplied by a student.

## Learning design and assessment

The course uses active recall, spaced practice, mixed review, cumulative checkpoints and transfer tasks. The recognition tasks grade a selected answer, not complete understanding of Arabic. Independent understanding should still be checked by a qualified teacher using fresh Qur’an passages and explanations backed by Arabic evidence. Short vocabulary glosses are recall cues, not exhaustive dictionary definitions.

Grammar recall uses English-to-Arabic term cards. The progress tracker treats a card answered successfully four times as well-established; this is a practical study signal, not a formal measure of comprehension. Students can export and import a local progress backup.

## Privacy, connectivity and printing

The app is a static progressive web app. Progress, vocabulary review, spot-task answers and saved free-text evidence are stored in the current browser’s local storage. It no longer asks students to upload PDFs or stores their page images locally.

An internet connection is needed to load the digital Qur’an renderer, official FSTU PDF viewers and YouTube playlists. The site shell may be cached after a first visit, but the external source content and renderer should not be described as fully offline.

The printable workbook is a student copy with writing space and no answer key. GitHub Actions renders the lesson UI in Chromium, checks the content and interactions, then generates the PDF and QA screenshots. Automated checks cover all 31 lessons, bilingual terminology, seven-word pattern, Al-Fātiḥah checkpoints, four-step sequence, recognition feedback, mobile width and printable page count.

## Scope

This is a practical teaching aid, not a replacement for a qualified teacher, reliable tafsīr, dictionary work or careful tarkīb. It is designed to build recognition and confidence while keeping Qur’an memorisation and revision central.