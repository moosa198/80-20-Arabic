-- 80/20 Arabic — student cloud sync and one-use class invitations.
-- Apply after 202610260001_madrassa_progress.sql. No student learning data is imported.

begin;

create table public.student_learning_state (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  store_key text not null check (
    store_key in (
      '8020arabic-progress-v1',
      '8020-word-recognition-v1',
      '8020-weekly-recall-v2',
      '8020-student-v2'
    )
  ),
  state jsonb not null default '{}'::jsonb
    check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (class_id, student_user_id, store_key)
);

create index student_learning_state_student_idx
  on public.student_learning_state (student_user_id, class_id);

create trigger student_learning_state_set_updated_at
  before update on public.student_learning_state
  for each row execute procedure public.set_updated_at();

alter table public.student_learning_state enable row level security;

create policy student_learning_state_select_self_or_staff
  on public.student_learning_state for select to authenticated
  using (
    (
      student_user_id = (select auth.uid())
      and (select public.is_student_in_class(class_id, (select auth.uid())))
    )
    or (select public.is_class_staff(class_id))
  );

create policy student_learning_state_insert_self
  on public.student_learning_state for insert to authenticated
  with check (
    student_user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
  );

create policy student_learning_state_update_self
  on public.student_learning_state for update to authenticated
  using (
    student_user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
  )
  with check (
    student_user_id = (select auth.uid())
    and (select public.is_student_in_class(class_id, (select auth.uid())))
  );

revoke all on table public.student_learning_state from anon, authenticated;
grant select, insert, update on public.student_learning_state to authenticated;

-- Invitation codes are long random bearer tokens. The table is not exposed through
-- the browser API; authenticated users can only use the two narrowly scoped RPCs.
create table public.class_invitations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  code text not null unique,
  invited_role text not null
    check (invited_role in ('student', 'teacher', 'class_admin')),
  created_by uuid not null references public.profiles(id) on delete restrict,
  expires_at timestamptz not null,
  used_by uuid references public.profiles(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index class_invitations_class_created_idx
  on public.class_invitations (class_id, created_at desc);

alter table public.class_invitations enable row level security;
revoke all on table public.class_invitations from anon, authenticated;

create or replace function public.create_class_invite(
  p_class_id uuid,
  p_role text,
  p_expires_in_days integer default 7
)
returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_code text;
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in before creating an invitation.' using errcode = '42501';
  end if;

  if p_role not in ('student', 'teacher', 'class_admin') then
    raise exception 'Invalid class invitation role.' using errcode = '22023';
  end if;

  if p_expires_in_days is null or p_expires_in_days < 1 or p_expires_in_days > 30 then
    raise exception 'Invitation expiry must be between 1 and 30 days.' using errcode = '22023';
  end if;

  if not (select public.can_manage_class(p_class_id)) then
    raise exception 'Only a class administrator can create invitations for this class.'
      using errcode = '42501';
  end if;

  v_code := upper(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''));

  insert into public.class_invitations (
    class_id, code, invited_role, created_by, expires_at
  )
  values (
    p_class_id, v_code, p_role, (select auth.uid()),
    now() + make_interval(days => p_expires_in_days)
  );

  return v_code;
end;
$fn$;

create or replace function public.accept_class_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_invite public.class_invitations%rowtype;
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'Sign in before accepting an invitation.' using errcode = '42501';
  end if;

  if p_code is null or char_length(btrim(p_code)) < 32 then
    raise exception 'Enter a valid one-use class invitation code.' using errcode = '22023';
  end if;

  select ci.*
    into v_invite
  from public.class_invitations ci
  where ci.code = upper(btrim(p_code))
    and ci.used_at is null
    and ci.expires_at > now()
  for update;

  if not found then
    raise exception 'This invitation is invalid, expired, or already used.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.class_memberships cm
    where cm.class_id = v_invite.class_id
      and cm.user_id = v_user_id
  ) then
    raise exception 'This account is already a member of the class.'
      using errcode = '23505';
  end if;

  insert into public.class_memberships (
    class_id, user_id, role, added_by
  )
  values (
    v_invite.class_id, v_user_id, v_invite.invited_role, v_invite.created_by
  );

  update public.class_invitations
    set used_by = v_user_id, used_at = now()
  where id = v_invite.id;

  return v_invite.class_id;
end;
$fn$;

revoke all on function public.create_class_invite(uuid, text, integer) from public, anon;
revoke all on function public.accept_class_invite(text) from public, anon;
grant execute on function public.create_class_invite(uuid, text, integer) to authenticated;
grant execute on function public.accept_class_invite(text) to authenticated;

commit;
