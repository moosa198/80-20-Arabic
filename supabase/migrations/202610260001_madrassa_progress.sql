-- 80/20 Arabic: multi-class progress and teacher verification
-- Apply once to a Supabase project using the SQL Editor or Supabase CLI.
-- Browser clients use only the publishable/anon key; RLS is the security boundary.

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create type public.madrassa_member_role as enum ('madrassa_admin', 'member');
create type public.class_member_role as enum ('class_admin', 'teacher', 'student');
create type public.lesson_progress_status as enum ('not_started', 'in_progress', 'completed');
create type public.concept_review_status as enum ('secure', 'developing', 'revisit');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.madrassas (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  created_by uuid not null references public.profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.madrassa_memberships (
  madrassa_id uuid not null references public.madrassas(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  role public.madrassa_member_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (madrassa_id, user_id)
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  madrassa_id uuid not null references public.madrassas(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 160),
  cohort_label text not null default '',
  curriculum_version text not null default '1.0.0',
  active boolean not null default true,
  created_by uuid not null references public.profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, madrassa_id)
);

create table public.class_memberships (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  role public.class_member_role not null,
  created_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

create table public.student_learning_state (
  class_id uuid not null,
  student_user_id uuid not null,
  store_key text not null check (store_key in (
    '8020arabic-progress-v1',
    '8020-word-recognition-v1',
    '8020-weekly-recall-v2',
    '8020-student-v2'
  )),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (class_id, student_user_id, store_key),
  foreign key (class_id, student_user_id)
    references public.class_memberships(class_id, user_id) on delete cascade
);

create table public.lesson_progress (
  class_id uuid not null,
  student_user_id uuid not null,
  week_no smallint not null check (week_no between 1 and 31),
  status public.lesson_progress_status not null default 'not_started',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (class_id, student_user_id, week_no),
  foreign key (class_id, student_user_id)
    references public.class_memberships(class_id, user_id) on delete cascade,
  check ((status = 'completed' and completed_at is not null) or
         (status <> 'completed' and completed_at is null))
);

create table public.teacher_reviews (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null,
  student_user_id uuid not null,
  week_no smallint not null check (week_no between 1 and 31),
  concept_key text not null check (char_length(trim(concept_key)) between 1 and 120),
  status public.concept_review_status not null,
  note text not null default '' check (char_length(note) <= 4000),
  reviewer_user_id uuid not null references public.profiles(user_id),
  created_at timestamptz not null default now(),
  foreign key (class_id, student_user_id)
    references public.class_memberships(class_id, user_id) on delete cascade
);

create table public.class_invites (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  member_role public.class_member_role not null,
  token_hash text not null unique,
  created_by uuid not null references public.profiles(user_id),
  expires_at timestamptz not null,
  accepted_by uuid references public.profiles(user_id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  check ((accepted_by is null and accepted_at is null) or
         (accepted_by is not null and accepted_at is not null))
);

create index class_memberships_user_idx on public.class_memberships(user_id);
create index madrassa_memberships_user_idx on public.madrassa_memberships(user_id);
create index classes_madrassa_idx on public.classes(madrassa_id);
create index learning_state_class_updated_idx on public.student_learning_state(class_id, updated_at desc);
create index lesson_progress_class_week_idx on public.lesson_progress(class_id, week_no, status);
create index teacher_reviews_student_week_idx on public.teacher_reviews(class_id, student_user_id, week_no, concept_key, created_at desc);
create index class_invites_class_idx on public.class_invites(class_id, expires_at);

create function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger madrassas_set_updated_at before update on public.madrassas
for each row execute function private.set_updated_at();
create trigger classes_set_updated_at before update on public.classes
for each row execute function private.set_updated_at();
create trigger learning_state_set_updated_at before update on public.student_learning_state
for each row execute function private.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function private.set_updated_at();

create function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(split_part(coalesce(new.email, ''), '@', 1)), ''),
    'Student'
  );
  insert into public.profiles(user_id, display_name)
  values (new.id, left(v_name, 100))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

create function private.add_creator_as_madrassa_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.madrassa_memberships(madrassa_id, user_id, role)
  values (new.id, new.created_by, 'madrassa_admin')
  on conflict (madrassa_id, user_id) do update set role = 'madrassa_admin';
  return new;
end;
$$;

create trigger madrassa_creator_membership
after insert on public.madrassas
for each row execute function private.add_creator_as_madrassa_admin();

create function private.is_madrassa_member(p_madrassa_id uuid, p_user_id uuid default (select auth.uid()))
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.madrassa_memberships mm
    where mm.madrassa_id = p_madrassa_id and mm.user_id = p_user_id
  );
$$;

create function private.is_madrassa_admin(p_madrassa_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.madrassa_memberships mm
    where mm.madrassa_id = p_madrassa_id
      and mm.user_id = (select auth.uid())
      and mm.role = 'madrassa_admin'
  );
$$;

create function private.can_manage_madrassa_classes(p_madrassa_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_madrassa_admin(p_madrassa_id)
    or exists (
      select 1
      from public.class_memberships cm
      join public.classes c on c.id = cm.class_id
      where c.madrassa_id = p_madrassa_id
        and cm.user_id = (select auth.uid())
        and cm.role = 'class_admin'
    );
$$;

create function private.is_class_member(p_class_id uuid, p_user_id uuid default (select auth.uid()))
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.class_memberships cm
    where cm.class_id = p_class_id and cm.user_id = p_user_id
  );
$$;

create function private.is_student_in_class(p_class_id uuid, p_student_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.class_memberships cm
    where cm.class_id = p_class_id
      and cm.user_id = p_student_user_id
      and cm.role = 'student'
  );
$$;

create function private.is_class_staff(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = p_class_id
      and private.is_madrassa_admin(c.madrassa_id)
  ) or exists (
    select 1 from public.class_memberships cm
    where cm.class_id = p_class_id
      and cm.user_id = (select auth.uid())
      and cm.role in ('class_admin', 'teacher')
  );
$$;

create function private.can_manage_class(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = p_class_id
      and private.can_manage_madrassa_classes(c.madrassa_id)
  );
$$;

create function private.can_read_class(p_class_id uuid, p_madrassa_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_madrassa_member(p_madrassa_id)
    and (
      private.can_manage_madrassa_classes(p_madrassa_id)
      or private.is_class_member(p_class_id)
    );
$$;

create function private.can_read_profile(p_target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_target_user_id = (select auth.uid())
    or exists (
      select 1
      from public.class_memberships mine
      join public.class_memberships theirs on theirs.class_id = mine.class_id
      where mine.user_id = (select auth.uid())
        and mine.role in ('teacher', 'class_admin')
        and theirs.user_id = p_target_user_id
    )
    or exists (
      select 1
      from public.madrassa_memberships mine
      join public.madrassa_memberships theirs on theirs.madrassa_id = mine.madrassa_id
      where mine.user_id = (select auth.uid())
        and mine.role = 'madrassa_admin'
        and theirs.user_id = p_target_user_id
    );
$$;

create function private.provision_madrassa_membership_from_class()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_madrassa_id uuid;
begin
  select c.madrassa_id into v_madrassa_id from public.classes c where c.id = new.class_id;
  if v_madrassa_id is not null then
    insert into public.madrassa_memberships(madrassa_id, user_id, role)
    values (v_madrassa_id, new.user_id, 'member')
    on conflict (madrassa_id, user_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger provision_madrassa_member
after insert or update of class_id, user_id on public.class_memberships
for each row execute function private.provision_madrassa_membership_from_class();

create function private.add_class_creator_as_class_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.class_memberships(class_id, user_id, role)
  values (new.id, new.created_by, 'class_admin')
  on conflict (class_id, user_id) do nothing;
  return new;
end;
$$;

create trigger class_creator_membership
after insert on public.classes
for each row execute function private.add_class_creator_as_class_admin();

create function public.create_class_invite(
  p_class_id uuid,
  p_role public.class_member_role default 'student',
  p_expires_in_days integer default 7
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'Sign in before creating an invitation.';
  end if;
  if not private.can_manage_class(p_class_id) then
    raise exception 'You do not have permission to invite members to this class.';
  end if;
  if p_expires_in_days < 1 or p_expires_in_days > 30 then
    raise exception 'Invitation expiry must be between 1 and 30 days.';
  end if;

  v_code := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  insert into public.class_invites(class_id, member_role, token_hash, created_by, expires_at)
  values (
    p_class_id,
    p_role,
    encode(extensions.digest(v_code, 'sha256'), 'hex'),
    auth.uid(),
    now() + make_interval(days => p_expires_in_days)
  );
  return v_code;
end;
$$;

create function public.accept_class_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.class_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in before accepting a class invitation.';
  end if;
  if nullif(trim(p_code), '') is null then
    raise exception 'Enter an invitation code.';
  end if;

  select * into v_invite
  from public.class_invites ci
  where ci.token_hash = encode(extensions.digest(trim(p_code), 'sha256'), 'hex')
    and ci.accepted_at is null
    and ci.expires_at > now()
  for update;

  if not found then
    raise exception 'This invitation is invalid, expired or already used.';
  end if;

  if exists (
    select 1 from public.class_memberships cm
    where cm.class_id = v_invite.class_id and cm.user_id = auth.uid()
  ) then
    raise exception 'This account is already a member of the class.';
  end if;

  insert into public.class_memberships(class_id, user_id, role)
  values (v_invite.class_id, auth.uid(), v_invite.member_role);

  update public.class_invites
  set accepted_by = auth.uid(), accepted_at = now()
  where id = v_invite.id;

  return v_invite.class_id;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;
revoke all on function private.add_creator_as_madrassa_admin() from public, anon, authenticated;
revoke all on function private.is_madrassa_member(uuid, uuid) from public, anon;
revoke all on function private.is_madrassa_admin(uuid) from public, anon;
revoke all on function private.can_manage_madrassa_classes(uuid) from public, anon;
revoke all on function private.is_class_member(uuid, uuid) from public, anon;
revoke all on function private.is_student_in_class(uuid, uuid) from public, anon;
revoke all on function private.is_class_staff(uuid) from public, anon;
revoke all on function private.can_manage_class(uuid) from public, anon;
revoke all on function private.can_read_class(uuid, uuid) from public, anon;
revoke all on function private.can_read_profile(uuid) from public, anon;
revoke all on function private.provision_madrassa_membership_from_class() from public, anon, authenticated;
revoke all on function private.add_class_creator_as_class_admin() from public, anon, authenticated;

grant execute on function private.is_madrassa_member(uuid, uuid) to authenticated;
grant execute on function private.is_madrassa_admin(uuid) to authenticated;
grant execute on function private.can_manage_madrassa_classes(uuid) to authenticated;
grant execute on function private.is_class_member(uuid, uuid) to authenticated;
grant execute on function private.is_student_in_class(uuid, uuid) to authenticated;
grant execute on function private.is_class_staff(uuid) to authenticated;
grant execute on function private.can_manage_class(uuid) to authenticated;
grant execute on function private.can_read_class(uuid, uuid) to authenticated;
grant execute on function private.can_read_profile(uuid) to authenticated;

revoke all on function public.create_class_invite(uuid, public.class_member_role, integer) from public, anon;
revoke all on function public.accept_class_invite(text) from public, anon;
grant execute on function public.create_class_invite(uuid, public.class_member_role, integer) to authenticated;
grant execute on function public.accept_class_invite(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.madrassas enable row level security;
alter table public.madrassa_memberships enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.student_learning_state enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.teacher_reviews enable row level security;
alter table public.class_invites enable row level security;

revoke all on public.profiles, public.madrassas, public.madrassa_memberships,
  public.classes, public.class_memberships, public.student_learning_state,
  public.lesson_progress, public.teacher_reviews, public.class_invites
from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.madrassas to authenticated;
grant select, insert, update, delete on public.madrassa_memberships to authenticated;
grant select, insert, update, delete on public.classes to authenticated;
grant select, insert, update, delete on public.class_memberships to authenticated;
grant select, insert, update on public.student_learning_state to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
grant select, insert on public.teacher_reviews to authenticated;
-- class_invites is reachable only through the two permission-checking RPC functions.

create policy profiles_read_scoped
on public.profiles for select to authenticated
using (private.can_read_profile(user_id));

create policy profiles_insert_self
on public.profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy profiles_update_self
on public.profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy madrassas_read_members
on public.madrassas for select to authenticated
using (private.is_madrassa_member(id));

create policy madrassas_create_self
on public.madrassas for insert to authenticated
with check ((select auth.uid()) = created_by);

create policy madrassas_update_admin
on public.madrassas for update to authenticated
using (private.is_madrassa_admin(id))
with check (private.is_madrassa_admin(id));

create policy madrassas_delete_admin
on public.madrassas for delete to authenticated
using (private.is_madrassa_admin(id));

create policy madrassa_memberships_read_scoped
on public.madrassa_memberships for select to authenticated
using (user_id = (select auth.uid()) or private.is_madrassa_admin(madrassa_id));

create policy madrassa_memberships_insert_admin
on public.madrassa_memberships for insert to authenticated
with check (private.is_madrassa_admin(madrassa_id));

create policy madrassa_memberships_update_admin
on public.madrassa_memberships for update to authenticated
using (private.is_madrassa_admin(madrassa_id))
with check (private.is_madrassa_admin(madrassa_id));

create policy madrassa_memberships_delete_admin
on public.madrassa_memberships for delete to authenticated
using (private.is_madrassa_admin(madrassa_id));

create policy classes_read_scoped
on public.classes for select to authenticated
using (private.can_read_class(id, madrassa_id));

create policy classes_insert_managers
on public.classes for insert to authenticated
with check (
  created_by = (select auth.uid())
  and private.can_manage_madrassa_classes(madrassa_id)
);

create policy classes_update_managers
on public.classes for update to authenticated
using (private.can_manage_madrassa_classes(madrassa_id))
with check (private.can_manage_madrassa_classes(madrassa_id));

create policy classes_delete_managers
on public.classes for delete to authenticated
using (private.can_manage_madrassa_classes(madrassa_id));

create policy class_memberships_read_self_or_staff
on public.class_memberships for select to authenticated
using (user_id = (select auth.uid()) or private.is_class_staff(class_id));

create policy class_memberships_insert_managers
on public.class_memberships for insert to authenticated
with check (private.can_manage_class(class_id));

create policy class_memberships_update_managers
on public.class_memberships for update to authenticated
using (private.can_manage_class(class_id))
with check (private.can_manage_class(class_id));

create policy class_memberships_delete_managers
on public.class_memberships for delete to authenticated
using (private.can_manage_class(class_id));

create policy learning_state_read_owner_or_teacher
on public.student_learning_state for select to authenticated
using (student_user_id = (select auth.uid()) or private.is_class_staff(class_id));

create policy learning_state_insert_student
on public.student_learning_state for insert to authenticated
with check (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
);

create policy learning_state_update_student
on public.student_learning_state for update to authenticated
using (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
)
with check (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
);

create policy lesson_progress_read_owner_or_teacher
on public.lesson_progress for select to authenticated
using (student_user_id = (select auth.uid()) or private.is_class_staff(class_id));

create policy lesson_progress_insert_student
on public.lesson_progress for insert to authenticated
with check (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
);

create policy lesson_progress_update_student
on public.lesson_progress for update to authenticated
using (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
)
with check (
  student_user_id = (select auth.uid())
  and private.is_student_in_class(class_id, student_user_id)
);

create policy teacher_reviews_read_owner_or_staff
on public.teacher_reviews for select to authenticated
using (student_user_id = (select auth.uid()) or private.is_class_staff(class_id));

create policy teacher_reviews_insert_staff
on public.teacher_reviews for insert to authenticated
with check (
  reviewer_user_id = (select auth.uid())
  and private.is_class_staff(class_id)
  and private.is_student_in_class(class_id, student_user_id)
);

grant usage on type public.madrassa_member_role, public.class_member_role,
  public.lesson_progress_status, public.concept_review_status to authenticated;

commit;
