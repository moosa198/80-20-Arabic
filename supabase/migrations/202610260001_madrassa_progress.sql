-- 80/20 Arabic — multi-class Madrassa data foundation
-- Apply through the Supabase CLI migration workflow after reviewing and testing.
-- This migration does not import student data or redistribute FSTU/Qur'an source files.

begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 100),
  role text not null default 'student'
    check (role in ('student', 'teacher', 'class_admin', 'madrassa_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  year_group text check (year_group is null or char_length(year_group) <= 80),
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'class_admin')),
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (class_id, user_id)
);

create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique check (char_length(btrim(version)) between 1 and 40),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  change_summary text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.curriculum_lessons (
  id uuid primary key default gen_random_uuid(),
  curriculum_version_id uuid not null references public.curriculum_versions(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 31),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  is_checkpoint boolean not null default false,
  target_concepts text[] not null default '{}',
  source_refs jsonb not null default '[]'::jsonb
    check (jsonb_typeof(source_refs) = 'array'),
  lesson_payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(lesson_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_version_id, week_number)
);

create table public.lesson_assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  curriculum_version_id uuid not null,
  week_number smallint not null check (week_number between 1 and 31),
  assigned_by uuid not null references public.profiles(id) on delete restrict,
  due_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  foreign key (curriculum_version_id, week_number)
    references public.curriculum_lessons(curriculum_version_id, week_number) on delete restrict
);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  curriculum_version_id uuid not null,
  week_number smallint not null check (week_number between 1 and 31),
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'complete')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, class_id, curriculum_version_id, week_number),
  foreign key (curriculum_version_id, week_number)
    references public.curriculum_lessons(curriculum_version_id, week_number) on delete restrict,
  check ((status = 'complete') = (completed_at is not null))
);

create table public.recognition_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  curriculum_version_id uuid not null,
  week_number smallint not null check (week_number between 1 and 31),
  concept_key text not null check (char_length(btrim(concept_key)) between 1 and 100),
  source_page smallint not null check (source_page between 1 and 604),
  selected_words jsonb not null
    check (
      case when jsonb_typeof(selected_words) = 'array'
        then jsonb_array_length(selected_words) between 1 and 20
        else false
      end
    ),
  selected_label_en text not null check (char_length(btrim(selected_label_en)) between 1 and 120),
  selected_label_ar text not null check (char_length(btrim(selected_label_ar)) between 1 and 120),
  explanation text not null check (char_length(btrim(explanation)) between 1 and 3000),
  created_at timestamptz not null default now(),
  foreign key (curriculum_version_id, week_number)
    references public.curriculum_lessons(curriculum_version_id, week_number) on delete restrict
);

create table public.teacher_reviews (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  curriculum_version_id uuid not null,
  week_number smallint not null check (week_number between 1 and 31),
  concept_key text not null check (char_length(btrim(concept_key)) between 1 and 100),
  status text not null check (status in ('secure', 'developing', 'revisit')),
  note text not null default '' check (char_length(note) <= 3000),
  reviewed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (curriculum_version_id, week_number)
    references public.curriculum_lessons(curriculum_version_id, week_number) on delete restrict
);

create table public.teacher_notes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  week_number smallint check (week_number is null or week_number between 1 and 31),
  concept_key text check (concept_key is null or char_length(concept_key) <= 100),
  note text not null check (char_length(btrim(note)) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_memberships_user_idx on public.class_memberships (user_id, class_id);
create index lesson_assignments_class_idx on public.lesson_assignments (class_id, week_number, is_active);
create index lesson_assignments_student_idx on public.lesson_assignments (student_id, due_at);
create index lesson_progress_student_idx on public.lesson_progress (user_id, class_id, week_number);
create index recognition_attempts_student_concept_idx on public.recognition_attempts (user_id, class_id, concept_key, created_at desc);
create index recognition_attempts_class_week_idx on public.recognition_attempts (class_id, week_number, created_at desc);
create index teacher_reviews_student_concept_idx on public.teacher_reviews (student_id, class_id, concept_key, reviewed_at desc);
create index teacher_reviews_class_concept_idx on public.teacher_reviews (class_id, concept_key, reviewed_at desc);
create index teacher_notes_student_idx on public.teacher_notes (student_id, class_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Student'
    ),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger auth_user_profile_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger classes_set_updated_at
  before update on public.classes
  for each row execute procedure public.set_updated_at();

create trigger curriculum_lessons_set_updated_at
  before update on public.curriculum_lessons
  for each row execute procedure public.set_updated_at();

create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute procedure public.set_updated_at();

create trigger teacher_reviews_set_updated_at
  before update on public.teacher_reviews
  for each row execute procedure public.set_updated_at();

create trigger teacher_notes_set_updated_at
  before update on public.teacher_notes
  for each row execute procedure public.set_updated_at();

-- Security-definer helpers avoid recursive membership/profile RLS policy evaluation.
-- Their search_path is empty and all application objects are fully schema-qualified.

create or replace function public.is_global_class_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('class_admin', 'madrassa_admin')
  );
$$;

create or replace function public.is_madrassa_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'madrassa_admin'
  );
$$;

create or replace function public.is_class_staff(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_global_class_admin()
    or exists (
      select 1
      from public.class_memberships cm
      where cm.class_id = target_class_id
        and cm.user_id = (select auth.uid())
        and cm.role in ('teacher', 'class_admin')
    );
$$;

create or replace function public.can_manage_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_global_class_admin()
    or exists (
      select 1
      from public.class_memberships cm
      where cm.class_id = target_class_id
        and cm.user_id = (select auth.uid())
        and cm.role = 'class_admin'
    );
$$;

create or replace function public.is_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_global_class_admin()
    or exists (
      select 1
      from public.class_memberships cm
      where cm.class_id = target_class_id
        and cm.user_id = (select auth.uid())
    );
$$;

create or replace function public.is_student_in_class(target_class_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select exists (
    select 1
    from public.class_memberships cm
    where cm.class_id = target_class_id
      and cm.user_id = target_user_id
      and cm.role = 'student'
  );
$;


create or replace function public.is_published_lesson(
  target_curriculum_version_id uuid,
  target_week_number smallint
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $
  select exists (
    select 1
    from public.curriculum_lessons cl
    join public.curriculum_versions cv
      on cv.id = cl.curriculum_version_id
    where cl.curriculum_version_id = target_curriculum_version_id
      and cl.week_number = target_week_number
      and cv.status = 'published'
  );
$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.is_global_class_admin() from public, anon;
revoke all on function public.is_madrassa_admin() from public, anon;
revoke all on function public.is_class_staff(uuid) from public, anon;
revoke all on function public.can_manage_class(uuid) from public, anon;
revoke all on function public.is_class_member(uuid) from public, anon;
revoke all on function public.is_student_in_class(uuid, uuid) from public, anon;
revoke all on function public.is_published_lesson(uuid, smallint) from public, anon;

grant execute on function public.is_global_class_admin() to authenticated;
grant execute on function public.is_madrassa_admin() to authenticated;
grant execute on function public.is_class_staff(uuid) to authenticated;
grant execute on function public.can_manage_class(uuid) to authenticated;
grant execute on function public.is_class_member(uuid) to authenticated;
grant execute on function public.is_student_in_class(uuid, uuid) to authenticated;
grant execute on function public.is_published_lesson(uuid, smallint) to authenticated;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.curriculum_versions enable row level security;
alter table public.curriculum_lessons enable row level security;
alter table public.lesson_assignments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.recognition_attempts enable row level security;
alter table public.teacher_reviews enable row level security;
alter table public.teacher_notes enable row level security;

-- Profiles: users cannot promote themselves or edit the role column from the browser.
create policy profiles_select_self_or_class_context
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_global_class_admin())
    or exists (
      select 1
      from public.class_memberships cm
      where cm.user_id = profiles.id
        and (select public.is_class_staff(cm.class_id))
    )
  );

create policy profiles_update_own_display_name
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy classes_select_members
  on public.classes for select to authenticated
  using ((select public.is_class_member(id)));

create policy classes_insert_global_admin
  on public.classes for insert to authenticated
  with check (
    (select public.is_global_class_admin())
    and created_by = (select auth.uid())
  );

create policy classes_update_managers
  on public.classes for update to authenticated
  using ((select public.can_manage_class(id)))
  with check ((select public.can_manage_class(id)));

create policy classes_delete_managers
  on public.classes for delete to authenticated
  using ((select public.can_manage_class(id)));

create policy memberships_select_self_or_staff
  on public.class_memberships for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_class_staff(class_id))
  );

create policy memberships_insert_managers
  on public.class_memberships for insert to authenticated
  with check (
    (select public.can_manage_class(class_id))
    and added_by = (select auth.uid())
  );

create policy memberships_update_managers
  on public.class_memberships for update to authenticated
  using ((select public.can_manage_class(class_id)))
  with check ((select public.can_manage_class(class_id)));

create policy memberships_delete_managers
  on public.class_memberships for delete to authenticated
  using ((select public.can_manage_class(class_id)));

-- Only published curriculum is visible to ordinary signed-in users.
-- Curriculum writes are central-admin-only; teachers can add notes, not edit core lessons.
create policy curriculum_versions_select_published
  on public.curriculum_versions for select to authenticated
  using (status = 'published' or (select public.is_madrassa_admin()));

create policy curriculum_versions_insert_admin
  on public.curriculum_versions for insert to authenticated
  with check (
    (select public.is_madrassa_admin())
    and (created_by is null or created_by = (select auth.uid()))
  );

create policy curriculum_versions_update_admin
  on public.curriculum_versions for update to authenticated
  using ((select public.is_madrassa_admin()))
  with check ((select public.is_madrassa_admin()));

create policy curriculum_versions_delete_admin
  on public.curriculum_versions for delete to authenticated
  using ((select public.is_madrassa_admin()));

create policy curriculum_lessons_select_published
  on public.curriculum_lessons for select to authenticated
  using (
    exists (
      select 1
      from public.curriculum_versions cv
      where cv.id = curriculum_lessons.curriculum_version_id
        and cv.status = 'published'
    )
    or (select public.is_madrassa_admin())
  );

create policy curriculum_lessons_insert_admin
  on public.curriculum_lessons for insert to authenticated
  with check ((select public.is_madrassa_admin()));

create policy curriculum_lessons_update_admin
  on public.curriculum_lessons for update to authenticated
  using ((select public.is_madrassa_admin()))
  with check ((select public.is_madrassa_admin()));

create policy curriculum_lessons_delete_admin
  on public.curriculum_lessons for delete to authenticated
  using ((select public.is_madrassa_admin()));

create policy assignments_select_class_scope
  on public.lesson_assignments for select to authenticated
  using (
    (select public.is_class_staff(class_id))
    or (
      (select public.is_student_in_class(class_id, (select auth.uid())))
      and (student_id is null or student_id = (select auth.uid()))
    )
  );

create policy assignments_insert_staff
  on public.lesson_assignments for insert to authenticated
  with check (
    (select public.is_class_staff(class_id))
    and assigned_by = (select auth.uid())
    and (select public.is_published_lesson(curriculum_version_id, week_number))
    and (student_id is null or (select public.is_student_in_class(class_id, student_id)))
  );

create policy assignments_update_staff
  on public.lesson_assignments for update to authenticated
  using ((select public.is_class_staff(class_id)))
  with check (
    (select public.is_class_staff(class_id))
    and (select public.is_published_lesson(curriculum_version_id, week_number))
    and (student_id is null or (select public.is_student_in_class(class_id, student_id)))
  );

create policy assignments_delete_staff
  on public.lesson_assignments for delete to authenticated
  using ((select public.is_class_staff(class_id)));

-- Completion is learner-reported. A separate teacher_reviews record captures verified mastery.
create policy lesson_progress_select_self_or_staff
  on public.lesson_progress for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_class_staff(class_id))
  );

create policy lesson_progress_insert_self
  on public.lesson_progress for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
    and (select public.is_published_lesson(curriculum_version_id, week_number))
  );

create policy lesson_progress_update_self
  on public.lesson_progress for update to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
  )
  with check (
    user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
    and (select public.is_published_lesson(curriculum_version_id, week_number))
  );

create policy recognition_attempts_select_self_or_staff
  on public.recognition_attempts for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_class_staff(class_id))
  );

create policy recognition_attempts_insert_self
  on public.recognition_attempts for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
    and (select public.is_published_lesson(curriculum_version_id, week_number))
  );

create policy teacher_reviews_select_student_or_staff
  on public.teacher_reviews for select to authenticated
  using (
    student_id = (select auth.uid())
    or (select public.is_class_staff(class_id))
  );

create policy teacher_reviews_insert_staff
  on public.teacher_reviews for insert to authenticated
  with check (
    teacher_id = (select auth.uid())
    and (select public.is_class_staff(class_id))
    and (select public.is_student_in_class(class_id, student_id))
    and (select public.is_published_lesson(curriculum_version_id, week_number))
  );

create policy teacher_reviews_update_author_or_manager
  on public.teacher_reviews for update to authenticated
  using (
    (teacher_id = (select auth.uid()) and (select public.is_class_staff(class_id)))
    or (select public.can_manage_class(class_id))
  )
  with check (
    (teacher_id = (select auth.uid()) and (select public.is_class_staff(class_id)))
    or (select public.can_manage_class(class_id))
  );

-- Teacher-only working notes are intentionally not visible to students.
create policy teacher_notes_select_staff
  on public.teacher_notes for select to authenticated
  using ((select public.is_class_staff(class_id)));

create policy teacher_notes_insert_staff
  on public.teacher_notes for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (select public.is_class_staff(class_id))
    and (select public.is_student_in_class(class_id, student_id))
  );

create policy teacher_notes_update_author_or_manager
  on public.teacher_notes for update to authenticated
  using (
    (author_id = (select auth.uid()) and (select public.is_class_staff(class_id)))
    or (select public.can_manage_class(class_id))
  )
  with check (
    (author_id = (select auth.uid()) and (select public.is_class_staff(class_id)))
    or (select public.can_manage_class(class_id))
  );

create policy teacher_notes_delete_author_or_manager
  on public.teacher_notes for delete to authenticated
  using (
    (author_id = (select auth.uid()) and (select public.is_class_staff(class_id)))
    or (select public.can_manage_class(class_id))
  );

-- Lock down API table grants as well as RLS. A policy alone is not a permission grant.
revoke all on table
  public.profiles,
  public.classes,
  public.class_memberships,
  public.curriculum_versions,
  public.curriculum_lessons,
  public.lesson_assignments,
  public.lesson_progress,
  public.recognition_attempts,
  public.teacher_reviews,
  public.teacher_notes
from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select, insert, delete on public.classes to authenticated;
grant update (name, year_group, is_active) on public.classes to authenticated;
grant select, insert, update, delete on public.class_memberships to authenticated;

grant select, insert, update, delete on public.curriculum_versions to authenticated;
grant select, insert, update, delete on public.curriculum_lessons to authenticated;

grant select, insert, delete on public.lesson_assignments to authenticated;
grant update (student_id, curriculum_version_id, week_number, due_at, is_active)
  on public.lesson_assignments to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
grant select, insert on public.recognition_attempts to authenticated;
grant select, insert, update on public.teacher_reviews to authenticated;
grant select, insert, delete on public.teacher_notes to authenticated;
grant update (week_number, concept_key, note) on public.teacher_notes to authenticated;

-- Latest teacher judgement per student/concept. Views run with caller privileges so that
-- base-table RLS remains effective; they do not auto-grade student-written explanations.
create view public.student_concept_mastery
with (security_invoker = true)
as
with ranked as (
  select
    tr.class_id,
    tr.student_id,
    tr.concept_key,
    tr.status,
    tr.reviewed_at,
    row_number() over (
      partition by tr.class_id, tr.student_id, tr.concept_key
      order by tr.reviewed_at desc, tr.id desc
    ) as position
  from public.teacher_reviews tr
)
select class_id, student_id, concept_key, status, reviewed_at
from ranked
where position = 1;

create view public.class_concept_mastery
with (security_invoker = true)
as
select
  class_id,
  concept_key,
  count(*)::integer as assessed_students,
  count(*) filter (where status = 'secure')::integer as secure_count,
  count(*) filter (where status = 'developing')::integer as developing_count,
  count(*) filter (where status = 'revisit')::integer as revisit_count,
  round(
    100.0 * count(*) filter (where status = 'secure') / nullif(count(*), 0),
    1
  ) as secure_percent
from public.student_concept_mastery
group by class_id, concept_key;

revoke all on public.student_concept_mastery, public.class_concept_mastery from anon, authenticated;
grant select on public.student_concept_mastery, public.class_concept_mastery to authenticated;

commit;
