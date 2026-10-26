# Supabase setup — 80/20 Arabic Madrassa progress

The website remains usable without Supabase. Cloud sign-in, shared progress and the teacher dashboard become available only after you configure a Supabase project. No database credentials are embedded in the repository.

## 1. Create the project

Create a Supabase project for the Madrassa. Keep the project URL and database credentials private. In Project Settings → API Keys, copy the project URL and the public publishable key (or legacy anon key). Do not use a service_role key or any secret key in browser code.

## 2. Apply the database migration

Open the Supabase SQL Editor and run the contents of:

supabase/migrations/202610260001_madrassa_progress.sql

Run this migration once against a fresh project. It creates the Madrassa, class, membership, progress, review and invitation tables; Auth profile provisioning; class-invitation RPCs; scoped grants; and row-level security (RLS) policies. Do not run the migration a second time unchanged because PostgreSQL enum types and policies already exist.

The migration assumes the pgcrypto extension can be installed in the extensions schema. If the project has a non-standard extension layout, resolve that migration error before enabling sign-ups.

## 3. Configure the browser client

Edit supabase-config.js. Set its url field to the exact project URL and its publishableKey field to the public publishable/anon key shown by Supabase. For example, the values have this shape: project URL https://YOUR-PROJECT-REF.supabase.co and key sb_publishable_YOUR_PUBLIC_KEY.

The public key is expected to be visible in client-side code; RLS and the signed-in user's Auth token must enforce access. Never paste a secret or service_role key into this file.

Commit the config for GitHub Pages only after checking that it contains the public publishable/anon key, not a secret. A better production setup is to template this file in the deployment workflow from repository environment variables.

## 4. Set Auth URLs and account policy

In Supabase Authentication → URL Configuration, add the deployed URLs used by the class:

- https://moosa198.github.io/80-20-Arabic/
- https://moosa198.github.io/80-20-Arabic/student.html
- https://moosa198.github.io/80-20-Arabic/teacher.html

Keep email confirmation enabled for real student/teacher accounts. Confirm SMTP and password recovery settings before inviting a full class. In a pilot, test account creation and email verification with one test student and one test teacher first.

## 5. Create the first Madrassa

1. Open teacher.html and create an account for the Madrassa administrator.
2. Sign in and use Create the first Madrassa and class.
3. Generate a separate one-use code for each teacher/student; choose the correct role and a short expiry.
4. Each invitee creates their own account, confirms their email, then enters their code through Class sync in either student app or the teacher dashboard.
5. The student chooses their class and presses Merge and sync my progress. The first sync merges existing local progress with the class copy before uploading it.

Invitation codes are one-use bearer secrets. Share each code privately with the intended person. If a code is sent to the wrong person, ask an administrator to expire/revoke it before anyone uses it; a dedicated revocation screen is not included in this version.

## 6. What is stored centrally

After a student explicitly syncs a class, the database stores the app's progress snapshots (week completion, spaced-repetition cards, quiz answers and word-recognition evidence), normalised week statuses, and teacher-review records. Teacher reviews are append-only; earlier judgements remain available as a record.

The source FSTU PDFs are not sent to Supabase. The app renders the course-assigned page images locally in the student's browser, and only those assigned pages are saved to IndexedDB on that device. The student’s original PDF is not uploaded.

## 7. Security and pre-launch checks

- Review the migration and test it in a separate development project before using real student records.
- Verify RLS denies cross-class reads/writes: a student must never read another student's progress; teachers must see only classes where their membership permits access; Madrassa administrators can see only their own Madrassa.
- Test sign-up, email confirmation, sign-in, forgotten password, class invitation, expired invitation, reused invitation, progress sync, teacher review and sign-out.
- Confirm that a student account cannot create classes/invitations, read another student's records, or insert teacher reviews.
- Do not enable real student data until the RLS/permission tests pass. The browser uses only the public client key; all sensitive authorization remains at the database layer.

Supabase's official guidance explains [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) and [publishable vs secret API keys](https://supabase.com/docs/guides/getting-started/api-keys). The repository migration follows the same grants-plus-policies model, but a project owner must still execute and test it in their own Supabase environment.
