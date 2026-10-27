# Supabase foundation — 80/20 Arabic

The app is local-first. The optional cloud connection uses the current `classes` and `class_memberships` data model: one Supabase project can support multiple Madrassa classes. There is no separate organisation/Madrassa record in the current schema.

## Migrations

Apply these in order to a fresh project:

1. `migrations/202610260001_madrassa_progress.sql` — profiles, classes, memberships, versioned curriculum metadata, assignments, learner-reported progress, recognition attempts, teacher reviews and notes, class-scoped RLS helpers/policies and mastery views.
2. `migrations/202610270001_student_sync_and_invites.sql` — class-scoped student app snapshots plus one-use class invitations and authenticated RPCs.

The second migration adds `student_learning_state` for syncing the existing local app stores and `class_invitations` for expiring, one-use codes. The invitation table has no direct browser API grants; the teacher creates codes through `create_class_invite`, and a signed-in invitee redeems a code through `accept_class_invite`. The progress snapshot table grants students access only to their own records in a class where they have student membership; class staff can read snapshots only for classes where their membership grants access.

**For an existing project with migration 1 already applied, apply only migration 2.** Do not re-run migration 1 unchanged. Future schema changes should be added as new, versioned migrations.

## Role model

- `profiles.role` is a global role: `student`, `teacher`, or `madrassa_admin`.
- `class_memberships.role` is class-scoped: `student`, `teacher`, or `class_admin`.
- New Auth users receive a profile with global role `student`. A teacher account is provisioned by an authorised project owner.
- When a user with the global `teacher` profile creates a class, a database trigger makes that user a `class_admin` of that class only.
- A class admin can issue student/teacher/class-admin invitations for that class. Codes are random, one-use and expire between 1 and 30 days.
- Students cannot self-promote, cannot issue invitations, and cannot read or update another student's progress.

## Client integration

The main app and Student Studio load `supabase-config.js`, Supabase JS and `cloud-progress.js`. Without an authenticated student session and selected class, progress remains local. After a student explicitly syncs, local and server snapshots are merged and subsequent supported local-progress changes are autosaved to that selected class.

The Teacher Dashboard can create classes, issue invitation codes and display synced learner week completion / recognition-attempt counts and the latest sync time. Completion is learner-reported and is not equivalent to teacher-verified mastery. A full evidence-by-concept review UI and class-specific assignment editor are still separate work.

## Source material

The migrations store curriculum metadata and references only; they do not upload or redistribute FSTU books or Qur'an PDFs. The browser-side source library renders only the FSTU pages mapped to the current lesson, with the original PDF and rendered page cache remaining on the student's device. Cloud-sync changes must preserve this behaviour.

## Before real use

1. Test in a separate development Supabase project when possible.
2. Apply both migrations in order and inspect every SQL/RLS error.
3. Create a teacher and student test account, one class, and a one-use student invitation.
4. Verify invitation expiry/reuse is rejected, class isolation is enforced, the student can sync only their own data, and staff cannot see classes outside their membership.
5. Test sign-out, local progress persistence, and cloud sync on more than one device.
6. Populate and publish the canonical curriculum before depending on the database curriculum metadata/assignment tables; the migrations intentionally do not seed lesson data.

The browser must use only the project's public publishable (or legacy anon) key. Never put a secret or service-role key in static files. Review Supabase's guidance on [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) and [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
