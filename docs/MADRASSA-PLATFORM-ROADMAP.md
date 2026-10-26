# Madrassa platform roadmap — 80/20 Arabic

**Status: foundation branch; hosted authentication and multi-device sync are not live yet.**

## Objective

Evolve the existing Qur'an-first 31-week course from a single-browser learning aid into a shared Madrassa platform without losing its established lesson content, Hifz-first workflow, printable workbook or source-page handling.

The system must distinguish four different things:

1. **Participation:** did the learner open or attempt the lesson?
2. **Self-reported completion:** did the learner mark the lesson complete?
3. **Evidence:** which Qur'anic words did the learner select, which role did they choose, and what explanation did they give?
4. **Verified mastery:** has a teacher judged the concept Secure, Developing or Revisit?

These must not be collapsed into one progress percentage. Completion is useful operational data; teacher-verified evidence is the basis for concept mastery. The software must not pretend to auto-grade nuanced tarkīb.

## Current repository assessment

The current app already provides a strong starting point:

- 31 weeks, including Al-Fātiḥah retrieval checkpoints in Weeks 8, 16 and 24.
- Seven new lexical words per teaching week and a separate high-frequency-word review set.
- English–Arabic grammar labels, Hifz-first reminders and a 15-line digital Mushaf reader.
- Full FSTU Naḥw and Ṣarf PDFs are supported through the existing source-page library. The guide maps each week to exact printed pages, renders only those assigned pages, and caches the rendered page images locally; it does not upload the full PDF to a server.
- Word selection, a required written explanation, multiple recognition attempts, local progress and JSON export/import.
- A printable student workbook and browser-based quality checks.

The main platform limitations are:

- Progress and recognition attempts are stored in the current browser rather than a shared database.
- There is no sign-in, class membership, teacher role or teacher dashboard.
- The curriculum definitions are duplicated between index.html and student.html. This is a drift risk: the two student experiences can diverge when a lesson is edited.
- Current progress can be moved only via a learner-managed export/import file; it is not centrally visible to teachers.

Keep the present app functioning while the database and front-end migration are built and tested separately.

## Architecture

    STUDENT EXPERIENCE
    - Hifz-first weekly lesson
    - Relevant FSTU page(s), not a textbook-wide reading task
    - Guided concept understanding
    - Qur'anic word selection and explanation
    - Retrieval, transfer and personal progress

                 | authenticated, least-privilege access

    TEACHER EXPERIENCE
    - Classes and assigned learners
    - Week-by-week progress
    - Recognition evidence and explanation
    - Secure / Developing / Revisit concept judgements
    - Teacher-only notes and revision assignments

                 | Supabase Auth + Postgres RLS

    SHARED DATA
    - Profiles, classes and memberships
    - Centrally versioned 31-week curriculum
    - Assignments, progress and immutable attempts
    - Teacher reviews and private notes
    - Concept-mastery views based on latest teacher review

The migration lives in supabase/migrations. The schema and setup assumptions are documented in supabase/README.md. It has not been applied to a hosted Supabase project or connected to the GitHub Pages frontend.

## Pedagogical contract for every teaching week

Use a consistent lesson structure, with short activities scaled to a 45-minute class:

1. **Whole Qur'anic phrase:** show the passage in its context and ask what the student notices.
2. **Focused source lesson:** direct the student to the exact FSTU Naḥw / Ṣarf page(s) required. Use the publisher's source page as the conceptual reference; add our explanation alongside it rather than altering the source page.
3. **Guided understanding:** explain the concept in plain language, give two or three examples, and check understanding before application.
4. **Return to the same phrase:** relate the concept to actual Qur'anic evidence.
5. **Recognition:** have the student select the relevant word or words, pair the English and Arabic role labels, and write a short reason.
6. **Retrieval:** hide the explanation and ask the learner to recall the concept again.
7. **Transfer:** find the same feature on another familiar Hifz page. If the structure is absent from Al-Fātiḥah at a checkpoint, use a suitable transfer page rather than forcing a false example.
8. **Teacher evidence:** save the attempt, then record Secure / Developing / Revisit and a concise note where needed.

The exact page mapping should stay as lesson metadata, not be replaced by a generic link to a whole textbook. Keep source editions and pagination notes visible, since editions can differ.

### Arabic terminology and pronunciation support

Maintain one central terminology map with separate fields for the English label, Arabic label, scholarly transliteration and short teaching gloss. In the interface:

- Arabic remains primary and uses lang=ar and dir=rtl in its own element.
- Introduce a new technical label with full vocalisation, transliteration and a short English gloss. For example: مَفْعُولٌ بِهِ — mafʿūlun bihi — object.
- As students become familiar with a label, reduce scaffolding in retrieval tasks: first remove transliteration, then require recall of the Arabic term with the English meaning.
- Do not add transliteration to every Qur'anic word or use it as a permanent replacement for Arabic script.
- Do not strip the diacritics from the actual Qur'anic passage. Teaching examples and technical terminology may be fully vocalised when first introduced.

A future curriculum audit should verify the exact Arabic vocalisation, transliteration and English gloss of each introduced term before these fields are used in the app.

## Delivery plan

### Stage 1 — Secure data foundation (this branch)

- Create separate tables for profiles, classes, memberships, published curriculum versions, assignments, student progress, recognition attempts, teacher reviews and private notes.
- Enable RLS on every app table and restrict both SQL grants and row policies.
- Keep raw student attempts immutable; store teacher judgement separately.
- Provide concept-mastery views whose denominator is students with a recorded teacher judgement, not all enrolled students.
- Document local setup, administrator bootstrap and a manual isolation-test checklist.

**Exit gate:** migration applies cleanly to a local Supabase database; role-isolation tests pass for two students, two teachers and separate classes. This branch is not the complete app.

### Stage 2 — Canonical curriculum and source mapping

- Consolidate duplicated course definitions into one canonical curriculum module/data file.
- Add a schema/content validator for all 31 lessons, all three checkpoints, paired English/Arabic terminology, seven lexical slots per teaching week and source-edition references.
- Import and version the initial course as a draft; review it; then publish it.
- Keep source_refs to resource identifier, edition, printed page or page range, URL and attribution. Do not store copyrighted page scans in the database.
- Preserve and regression-test the existing assigned-page renderer against the canonical source map; correct only any missing or inaccurate page mappings, edition mismatches or display issues.

**Exit gate:** both current student entry points render the same canonical lesson data; all 31 weeks have a valid versioned record, and the existing FSTU page map still opens only each lesson's assigned page(s).

### Stage 3 — Authentication and resilient sync

- Add sign-in and invitation-based enrolment. Public sign-up must never grant a teacher or administrator role.
- Add a configuration layer for the project URL and publishable key. Do not commit credentials; never ship a secret/service-role key in a browser app.
- Introduce a storage adapter behind existing progress/recognition APIs so the interface no longer writes directly to localStorage.
- Preserve a local cache and export/import path. Sync only signed-in learner records, retry safely when the device reconnects, and avoid duplicating attempts on retry.
- Make conflict handling explicit: append-only recognition attempts; per-week completion updates; teacher reviews kept as a timestamped history.
- Keep PDF page rendering local to the device as it is today. Do not upload the learner's whole source PDF or page images.

**Exit gate:** offline work does not disappear; re-sync does not duplicate attempts; signed-out users cannot query learner data; the old export format has a tested import path.

### Stage 4 — Teacher and administrator experience

- Class dashboard: each student by week, with not-started / in-progress / complete and links to evidence.
- Student detail: selected words, chosen English/Arabic role, explanation, page context, prior attempts and teacher review history.
- Concept dashboard: Secure / Developing / Revisit counts and secure percentage for teacher-assessed students, with the denominator displayed.
- Revision actions: assign a targeted retrieval task, source page and transfer page; record a teacher note.
- Admin tools: create classes, assign teachers, enrol students and publish canonical curriculum versions.
- Teachers may add notes, assignments and local examples but cannot edit the canonical curriculum.

**Exit gate:** a teacher in Class A cannot view Class B; a learner sees only their own learning record and feedback; only a Madrassa administrator can publish curriculum changes.

### Stage 5 — Pilot, audit and rollout

- Use fake accounts and dummy data first, including adversarial checks for direct API access.
- Verify RLS, table grants, class removal and role changes through the same browser/API client used by the app. SQL Editor tests alone do not demonstrate learner-level restrictions.
- Confirm accessibility, RTL layout, mobile widths, printed workbook generation, PWA offline behaviour and page selection.
- Keep the first real class as a small opt-in pilot. Provide export and a clear explanation of what is stored centrally.
- Do not migrate real student records until privacy notice, data retention, administrator access and recovery processes are agreed with the Madrassa.

## Data and privacy rules

- Collect only information needed to teach and monitor the course. Prefer a display name over unnecessary personal details.
- Private teacher notes are different from student-facing feedback and must have different access policies.
- Do not put written student explanations or personal information into analytics logs.
- Keep Auth accounts, class enrolment and role assignment under administrator control.
- Establish a retention/deletion process before the multi-class version is used with children.
- The current local-first app remains the source of truth until the migration path is deliberately switched on. A database schema alone does not sync existing local data.

## Definition of done for the complete platform

The project is ready for a live multi-class pilot only when every item below is true:

- [ ] One canonical source for the 31-week curriculum; no divergence between student pages.
- [ ] Correct lesson-source references and the exact relevant FSTU page(s) per week.
- [ ] Arabic terms consistently paired with English; checked transliteration and initial vowelisation; progressive support removal.
- [ ] Supabase Auth, invitation flow and protected global roles.
- [ ] RLS and grants tested with independent users, including cross-class and attempted role escalation.
- [ ] Central progress sync, duplicate-safe attempt writes, offline fallback and export/import.
- [ ] Teacher dashboard with evidence, review history, notes and concept-level mastery.
- [ ] Published curriculum version is immutable to teachers and can be deliberately superseded by an administrator.
- [ ] Privacy and data-retention processes agreed for the actual Madrassa.
- [ ] Automated browser/workbook checks pass on the final branch and a human teacher validates sample lessons.

