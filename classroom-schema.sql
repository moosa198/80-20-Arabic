-- 80/20 Arabic classroom tracking — Supabase PostgreSQL schema
-- Use a NEW Supabase project. Run this file in SQL Editor as project owner.
-- Only the public anon/publishable key belongs in browser configuration.
-- NEVER put a service_role key in this static site.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  school_name text not null,
  class_name text not null,
  join_code text not null unique default upper(encode(extensions.gen_random_bytes(5), 'hex')),
  created_at timestamptz not null default now(),
  constraint classes_school_name_length check (char_length(school_name) between 1 and 100),
  constraint classes_class_name_length check (char_length(class_name) between 1 and 100)
);

create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  display_name text not null,
  access_code_hash text not null unique,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  joined_at timestamptz,
  constraint class_students_display_name_length check (char_length(display_name) between 1 and 100)
);

create table if not exists public.student_progress (
  student_id uuid primary key references public.class_students(id) on delete cascade,
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.student_progress enable row level security;

-- Classes can only be managed by their teacher. Student anonymous sessions have no email.
drop policy if exists "Teachers read their own classes" on public.classes;
create policy "Teachers read their own classes" on public.classes
for select to authenticated using (teacher_id = (select auth.uid()));

drop policy if exists "Email-authenticated users create their own classes" on public.classes;
create policy "Email-authenticated users create their own classes" on public.classes
for insert to authenticated
with check (
  teacher_id = (select auth.uid())
  and nullif((select auth.jwt()->>'email'), '') is not null
);

drop policy if exists "Teachers update their own classes" on public.classes;
create policy "Teachers update their own classes" on public.classes
for update to authenticated using (teacher_id = (select auth.uid()))
with check (teacher_id = (select auth.uid()));

drop policy if exists "Teachers delete their own classes" on public.classes;
create policy "Teachers delete their own classes" on public.classes
for delete to authenticated using (teacher_id = (select auth.uid()));

-- Class owners can see the roster; raw student access codes are returned only once by the RPC.
drop policy if exists "Teachers read their own roster" on public.class_students;
create policy "Teachers read their own roster" on public.class_students
for select to authenticated
using (exists (
  select 1 from public.classes c
  where c.id = class_students.class_id and c.teacher_id = (select auth.uid())
));

drop policy if exists "Learners read their own roster row" on public.class_students;
create policy "Learners read their own roster row" on public.class_students
for select to authenticated
using (auth_user_id = (select auth.uid()));

drop policy if exists "Teachers update their own roster" on public.class_students;
create policy "Teachers update their own roster" on public.class_students
for update to authenticated
using (exists (
  select 1 from public.classes c
  where c.id = class_students.class_id and c.teacher_id = (select auth.uid())
))
with check (exists (
  select 1 from public.classes c
  where c.id = class_students.class_id and c.teacher_id = (select auth.uid())
));

drop policy if exists "Teachers delete their own roster" on public.class_students;
create policy "Teachers delete their own roster" on public.class_students
for delete to authenticated
using (exists (
  select 1 from public.classes c
  where c.id = class_students.class_id and c.teacher_id = (select auth.uid())
));

-- Teachers can read only their own class progress. Students can read/write only their own row.
drop policy if exists "Teachers and learners read permitted progress" on public.student_progress;
create policy "Teachers and learners read permitted progress" on public.student_progress
for select to authenticated using (
  exists (
    select 1 from public.class_students s
    where s.id = student_progress.student_id and s.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1 from public.class_students s
    join public.classes c on c.id = s.class_id
    where s.id = student_progress.student_id and c.teacher_id = (select auth.uid())
  )
);

drop policy if exists "Learners insert their own progress" on public.student_progress;
create policy "Learners insert their own progress" on public.student_progress
for insert to authenticated with check (
  exists (
    select 1 from public.class_students s
    where s.id = student_progress.student_id and s.auth_user_id = (select auth.uid())
  )
);

drop policy if exists "Learners update their own progress" on public.student_progress;
create policy "Learners update their own progress" on public.student_progress
for update to authenticated using (
  exists (
    select 1 from public.class_students s
    where s.id = student_progress.student_id and s.auth_user_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.class_students s
    where s.id = student_progress.student_id and s.auth_user_id = (select auth.uid())
  )
);

-- Do not give the unauthenticated anon role direct table access.
revoke all on public.classes, public.class_students, public.student_progress from anon;
grant select, insert, update, delete on public.classes to authenticated;
-- Do not expose access_code_hash to authenticated API clients.
revoke all on public.class_students from authenticated;
grant select (id, class_id, display_name, auth_user_id, created_at, joined_at) on public.class_students to authenticated;
grant update, delete on public.class_students to authenticated;
grant select, insert, update, delete on public.student_progress to authenticated;

-- Teacher uploads a roster as names. Codes are random, hashed in the database, and returned once.
create or replace function public.add_class_students(p_class_id uuid, p_names text[])
returns table(student_id uuid, display_name text, access_code text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_name text;
  v_code text;
  v_count integer := 0;
  v_id uuid;
begin
  if auth.uid() is null or nullif(auth.jwt()->>'email', '') is null then
    raise exception 'Teacher sign-in is required.';
  end if;
  if not exists (
    select 1 from public.classes c where c.id = p_class_id and c.teacher_id = auth.uid()
  ) then
    raise exception 'Class not found or not owned by this teacher.';
  end if;
  if p_names is null or cardinality(p_names) = 0 then
    raise exception 'Enter at least one learner name.';
  end if;
  if cardinality(p_names) > 100 then
    raise exception 'Add no more than 100 learners in one batch.';
  end if;

  foreach v_name in array p_names loop
    v_name := btrim(regexp_replace(coalesce(v_name, ''), '[[:cntrl:]]', '', 'g'));
    if v_name = '' then continue; end if;
    if char_length(v_name) > 100 then
      raise exception 'Learner names must be 100 characters or fewer.';
    end if;
    v_code := upper(encode(extensions.gen_random_bytes(6), 'hex'));
    insert into public.class_students(class_id, display_name, access_code_hash)
    values (
      p_class_id,
      v_name,
      encode(extensions.digest(convert_to(v_code, 'UTF8'), 'sha256'), 'hex')
    )
    returning id into v_id;
    student_id := v_id;
    display_name := v_name;
    access_code := v_code;
    return next;
    v_count := v_count + 1;
  end loop;

  if v_count = 0 then raise exception 'No non-empty learner names were supplied.'; end if;
end;
$$;

create or replace function public.join_class_student(p_class_code text, p_access_code text)
returns table(student_id uuid, display_name text, class_name text, school_name text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_student public.class_students%rowtype;
  v_class public.classes%rowtype;
  v_hash text;
begin
  if auth.uid() is null then raise exception 'Student sign-in is required.'; end if;
  if nullif(auth.jwt()->>'email', '') is not null then
    raise exception 'Use the student class-join form with an anonymous student session, not a teacher account.';
  end if;
  if coalesce(btrim(p_class_code), '') = '' or coalesce(btrim(p_access_code), '') = '' then
    raise exception 'Enter both the class code and your personal access code.';
  end if;
  v_hash := encode(extensions.digest(convert_to(upper(btrim(p_access_code)), 'UTF8'), 'sha256'), 'hex');

  select s.* into v_student
  from public.class_students s
  join public.classes c on c.id = s.class_id
  where upper(c.join_code) = upper(btrim(p_class_code))
    and s.access_code_hash = v_hash
  for update of s;

  if not found then raise exception 'Those codes do not match a learner in this class.'; end if;
  if v_student.auth_user_id is not null and v_student.auth_user_id <> auth.uid() then
    raise exception 'This learner code is already linked to another browser session. Ask your teacher to reset it.';
  end if;

  update public.class_students
  set auth_user_id = auth.uid(), joined_at = coalesce(joined_at, now())
  where id = v_student.id;

  select c.* into v_class from public.classes c where c.id = v_student.class_id;
  return query select v_student.id, v_student.display_name, v_class.class_name, v_class.school_name;
end;
$$;

-- Reset one learner's access code when a device is lost. Existing progress is kept.
create or replace function public.reset_student_access_code(p_student_id uuid)
returns text
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_code text := upper(encode(extensions.gen_random_bytes(6), 'hex'));
begin
  if auth.uid() is null or nullif(auth.jwt()->>'email', '') is null then
    raise exception 'Teacher sign-in is required.';
  end if;
  if not exists (
    select 1 from public.class_students s
    join public.classes c on c.id = s.class_id
    where s.id = p_student_id and c.teacher_id = auth.uid()
  ) then
    raise exception 'Learner not found or not owned by this teacher.';
  end if;
  update public.class_students
  set access_code_hash = encode(extensions.digest(convert_to(v_code, 'UTF8'), 'sha256'), 'hex'),
      auth_user_id = null,
      joined_at = null
  where id = p_student_id;
  return v_code;
end;
$$;

revoke all on function public.add_class_students(uuid, text[]) from public, anon;
revoke all on function public.join_class_student(text, text) from public, anon;
revoke all on function public.reset_student_access_code(uuid) from public, anon;
grant execute on function public.add_class_students(uuid, text[]) to authenticated;
grant execute on function public.join_class_student(text, text) to authenticated;
grant execute on function public.reset_student_access_code(uuid) to authenticated;

-- Recommended project setting: enable Anonymous Sign-Ins under Authentication for student sessions.
