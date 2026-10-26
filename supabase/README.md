# Supabase setup for 80/20 Arabic

This directory contains the first database migration for the multi-class Madrassa system. It is a foundation, not a live integration: the existing GitHub Pages app remains local-first until authentication, sync and teacher screens are connected and tested.

## What the migration creates

- Profiles with a protected system role.
- Classes and class memberships.
- Versioned curriculum metadata and lesson payloads.
- Class-wide or student-specific assignments.
- Learner-reported week completion.
- Immutable word-selection / recognition evidence.
- Teacher reviews using Secure / Developing / Revisit.
- Private teacher notes.
- Secure views showing the latest teacher-verified concept status.

The migration stores lesson metadata and source-page references. It does **not** upload or reproduce FSTU pages, Qur'an PDFs or rendered page images. The existing app already accepts the full FSTU PDFs through its source-page library and renders only mapped pages for the lesson; the page images are cached in the learner's browser. Keep that privacy-preserving behaviour when adding central progress sync.

## Safety model

- Every application table has Row Level Security (RLS) enabled.
- Table grants and RLS policies are both restricted. RLS alone is not treated as a substitute for SQL grants.
- A student can read their own progress and recognition attempts. They can create their own attempts and report their own completion, but cannot write teacher reviews.
- A teacher can see learners and evidence in classes where they have a teacher membership. A teacher cannot access another teacher's class.
- Class administrators manage memberships and class assignments; only the Madrassa administrator can edit canonical curriculum versions.
- Teacher-only notes are not visible to students.
- The student completion flag is not mastery. Only a teacher review records Secure / Developing / Revisit. Student explanations are never automatically marked correct by SQL.
- New Auth users are created with the Student role. The global profile role is limited to Student, Teacher or Madrassa Admin. `class_admin` is a class-membership role, not a global role: a Teacher who creates a class is automatically made a class administrator for that class only. A user must never be able to self-promote; do not trust role values sent in sign-up metadata.

## Before applying to a hosted project

1. Create a **separate development Supabase project** first. Do not run a new schema migration directly against a live student database.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) and initialise its configuration in the repository with `supabase init`.
3. Start the local database and apply migrations with `supabase start` and `supabase db reset`. Review any errors, then test the permissions in the checklist below.
4. Link the CLI to the development project and deploy only after the local migration is clean. Supabase recommends versioned migrations rather than undocumented edits to the hosted database: https://supabase.com/docs/guides/deployment/database-migrations
5. Create a test student, a test teacher and two separate classes. Verify the access boundaries before inviting real students.

The repository does not contain a Supabase project URL or browser key, and this migration has **not** been applied to a remote database.

## First administrator

Sign up a trusted administrator through Supabase Auth, then use the Supabase SQL Editor (as a project owner) to promote that exact Auth user ID:

    update public.profiles
    set role = 'madrassa_admin'
    where id = 'REPLACE-WITH-TRUSTED-AUTH-USER-UUID';

Never run this as a public browser action. Do not allow a user to set their own role. The role-management UI and invitation workflow have not been implemented yet.

## Keys and browser configuration

The browser must use a Supabase **publishable** key with the project URL, with RLS enforcing every data access. A publishable key is expected to be visible in a static website, so it is safe only when policies and grants are correct. Never put a Supabase secret key (or legacy service-role key) into index.html, student.html, any committed config file, or a GitHub Pages build.

Supabase is moving away from the legacy anon / service_role names by the end of 2026. Prefer the current publishable / secret key model:
- API-key guidance: https://supabase.com/docs/guides/getting-started/api-keys
- RLS guidance: https://supabase.com/docs/guides/database/postgres/row-level-security

No credentials or .env values are included in this repository.

## Curriculum seeding requirement

The migration intentionally creates no lesson rows. Before enabling student progress writes, import the canonical 31-week lesson sequence as a published curriculum version with all 31 week records, including the three Al-Fātiḥah checkpoints. Each source reference should contain only the source identifier, edition, printed page(s), and attribution — not a copy of a textbook page.

Before seeding, consolidate the lesson definitions currently duplicated between index.html and student.html into one canonical curriculum data file. The importer should map the existing weekly guide and source-page map to that canonical version rather than maintain another manually edited curriculum copy.

## Manual access-control test checklist

Use separate Auth test accounts and verify each item through the Supabase API as the signed-in user, not only through the SQL Editor (the SQL Editor normally has elevated database privileges).

- [ ] Student A can read only their own progress and recognition attempts.
- [ ] Student A cannot read Student B's progress or attempts, including when both students are in the same class.
- [ ] Student A cannot insert a record with another student's user_id.
- [ ] Student A cannot update profiles.role or create teacher reviews.
- [ ] Teacher A can read only members, progress, attempts and reviews for Teacher A's classes.
- [ ] Teacher A cannot read a separate class that Teacher A does not teach.
- [ ] Teacher A can add a review only for a student in a class they teach.
- [ ] Student can read their own review feedback but cannot read private teacher_notes.
- [ ] Class administrator can manage memberships and assignments but cannot edit the canonical curriculum.
- [ ] Only the Madrassa administrator can publish or change the canonical curriculum.
- [ ] A teacher who creates a class is automatically a class administrator for that class only, and cannot see or manage other classes.
- [ ] An unauthenticated request receives no student or teacher data.
- [ ] Removing a user's class membership removes that class's access on the next request.

## Rollout boundary

Until the frontend uses Supabase Auth and the new tables, the current browser-local progress remains the active store. Do not claim that learner progress is centrally synced simply because this migration exists. Keep the existing export/import backup available during the migration and provide an explicit, consented import path rather than silently uploading browser records.
