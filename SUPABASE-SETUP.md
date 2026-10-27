# Supabase setup — 80/20 Arabic class sync

The teaching app remains usable locally. Supabase adds authenticated class membership and optional, class-scoped progress sync. Only the public publishable key belongs in browser code; never use a secret or service-role key.

## 1. Configure Supabase Auth

In Supabase Authentication → URL Configuration, add the deployed URLs:

- https://moosa198.github.io/80-20-Arabic/
- https://moosa198.github.io/80-20-Arabic/student.html
- https://moosa198.github.io/80-20-Arabic/teacher.html

For real accounts, keep email confirmation enabled and test that email confirmation and password sign-in work before inviting a class.

## 2. Apply the migrations in order

Open Supabase SQL Editor and apply the following files in this order:

1. `supabase/migrations/202610260001_madrassa_progress.sql` — profiles, classes, class memberships, curriculum metadata, lesson assignments, learner progress, recognition attempts, teacher reviews/notes, RLS helpers and policies.
2. `supabase/migrations/202610270001_student_sync_and_invites.sql` — the class-scoped `student_learning_state` table plus one-use invitation codes and the authenticated `create_class_invite` / `accept_class_invite` RPCs.

**For the project that already has migration 1 applied, run only migration 2 now.** Run each migration once. Do not rerun migration 1 to try to repair an app error; make future changes as new versioned migrations.

## 3. Configure the browser client

In `supabase-config.js`, the `url` must be the project's exact URL and `publishableKey` must be its public publishable key (or legacy anon key). These values are expected to be visible in a static website. Security depends on authenticated sessions, database grants and RLS, not on hiding the publishable key.

Never paste a Supabase secret or service-role key into the config, HTML, GitHub Pages, or student materials.

## 4. Create the first class and invite students

1. Create the first teacher account in Supabase Auth and set that account's `public.profiles.role` to `teacher`.
2. Sign in at `teacher.html` and create a class. The database trigger grants the creator the `class_admin` role for that class only.
3. In the class workspace, use **Generate one-use code**. Choose Student and an expiry of 1–30 days. Share the code privately with one intended student.
4. The student opens the main app or `student.html`, selects **Class sync**, creates an account (if needed), confirms email if prompted, and signs in.
5. The student enters the invitation code, joins the class, then selects the class and chooses to sync progress.

A newly registered user's global profile role defaults to `student`; the invitation controls the class membership. Students cannot promote their own global profile role from the browser. Invitation codes are one-use bearer secrets, so share them privately. There is not yet a teacher-facing invitation-revocation screen; use short expiries during the pilot.

## 5. What sync does

After a student explicitly syncs, the app merges local and server snapshots for spaced-repetition cards, weekly completion, recall and word-recognition activity. Subsequent progress changes are autosaved to the selected class. The teacher dashboard displays synced week-completion and recognition-attempt counts, plus the last sync time.

A completion count is learner-reported activity, **not verified mastery**. The current teacher screen is a basic progress view; it is not yet a full concept-by-concept Secure / Developing / Revisit assessment interface.

The FSTU source PDFs are not uploaded to Supabase. The app keeps the source PDF in the student's browser and renders the mapped lesson pages locally. The app's curriculum page map controls which FSTU pages are presented for each week; class cloud sync does not itself create per-class lesson assignments.

## 6. Pilot security checklist

Before adding real student data, use one teacher and one test student and confirm:

- The teacher can create a class and issue an invitation, but a student cannot.
- An invitation can be used once, expires as configured, and cannot be redeemed twice.
- A student can read and update only their own progress in a class where they have student membership.
- Class staff can read progress only in their own class.
- Signing out leaves the student's local backup available but stops further cloud writes.
- The student app displays only curriculum-mapped source pages and does not upload original FSTU PDFs.

See Supabase's official guidance on [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) and [publishable vs secret API keys](https://supabase.com/docs/guides/getting-started/api-keys). The migrations configure policy and grants, but the project owner should still test the live project before using real student records.
