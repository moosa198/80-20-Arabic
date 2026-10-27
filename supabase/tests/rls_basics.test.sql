begin;

select plan(26);

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.classes'::regclass), 'classes has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.class_memberships'::regclass), 'class memberships has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.curriculum_versions'::regclass), 'curriculum versions has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.curriculum_lessons'::regclass), 'curriculum lessons has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.lesson_assignments'::regclass), 'lesson assignments has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.lesson_progress'::regclass), 'lesson progress has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.recognition_attempts'::regclass), 'recognition attempts has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.teacher_reviews'::regclass), 'teacher reviews has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.teacher_notes'::regclass), 'teacher notes has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.student_learning_state'::regclass), 'student learning state has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.class_invitations'::regclass), 'class invitations has RLS enabled');

select ok(not has_table_privilege('anon', 'public.profiles', 'select'), 'anon cannot read profiles');
select ok(not has_table_privilege('anon', 'public.classes', 'select'), 'anon cannot read classes');
select ok(not has_table_privilege('anon', 'public.student_learning_state', 'select'), 'anon cannot read student learning state');
select ok(not has_table_privilege('anon', 'public.teacher_reviews', 'insert'), 'anon cannot add teacher reviews');
select ok(not has_table_privilege('authenticated', 'public.class_invitations', 'select'), 'authenticated cannot directly read invitation records');
select ok(not has_table_privilege('authenticated', 'public.class_invitations', 'insert'), 'authenticated cannot directly write invitation records');
select ok(has_table_privilege('authenticated', 'public.student_learning_state', 'select'), 'authenticated has the base grant needed for scoped learning-state reads');
select ok(has_table_privilege('authenticated', 'public.student_learning_state', 'insert'), 'authenticated has the base grant needed for scoped learning-state inserts');
select ok(has_table_privilege('authenticated', 'public.student_learning_state', 'update'), 'authenticated has the base grant needed for scoped learning-state updates');
select ok(has_table_privilege('authenticated', 'public.teacher_reviews', 'insert'), 'authenticated has the base grant needed for the staff-only review insert policy');
select ok(has_function_privilege('authenticated', 'public.create_class_invite(uuid,text,integer)', 'execute'), 'authenticated may request scoped invitation creation');
select ok(has_function_privilege('authenticated', 'public.accept_class_invite(text)', 'execute'), 'authenticated may redeem a one-use invitation');
select ok(not has_function_privilege('anon', 'public.create_class_invite(uuid,text,integer)', 'execute'), 'anon cannot create invitations');
select ok(not has_function_privilege('anon', 'public.accept_class_invite(text)', 'execute'), 'anon cannot redeem invitations');

select * from finish();
rollback;
