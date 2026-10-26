begin;

select plan(16);

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.madrassas'::regclass), 'madrassas has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.madrassa_memberships'::regclass), 'madrassa memberships has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.classes'::regclass), 'classes has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.class_memberships'::regclass), 'class memberships has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.student_learning_state'::regclass), 'learning state has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.lesson_progress'::regclass), 'lesson progress has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.teacher_reviews'::regclass), 'teacher reviews has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.class_invites'::regclass), 'class invites has RLS enabled');

select ok(not has_table_privilege('anon', 'public.profiles', 'select'), 'anon cannot read profiles');
select ok(not has_table_privilege('anon', 'public.student_learning_state', 'select'), 'anon cannot read learning state');
select ok(not has_table_privilege('anon', 'public.teacher_reviews', 'insert'), 'anon cannot add teacher reviews');
select ok(not has_table_privilege('authenticated', 'public.class_invites', 'select'), 'client roles cannot directly read invitation records');
select ok(not has_table_privilege('authenticated', 'public.class_invites', 'insert'), 'client roles cannot directly write invitation records');
select ok(has_table_privilege('authenticated', 'public.student_learning_state', 'select'), 'authenticated has the base grant needed for scoped learning-state reads');
select ok(has_table_privilege('authenticated', 'public.teacher_reviews', 'insert'), 'authenticated has the base grant needed for the staff-only insert policy');

select * from finish();
rollback;
