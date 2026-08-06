-- =====================================================================
-- PLAN DE RESTAURATION — état des politiques RLS au 1er août 2026
-- =====================================================================
--
-- Capture intégrale des politiques AVANT toute modification de sécurité.
-- Rejouer ce fichier tel quel restaure exactement l'état d'origine.
--
--     psql "$DATABASE_URL" -f ROLLBACK-policies-20260801.sql
--
-- Ce fichier ne supprime aucune donnée : il ne touche qu'aux politiques.
-- Il est volontairement idempotent (DROP IF EXISTS avant chaque CREATE).
--
-- Généré depuis pg_policies sur le projet taimtpltpaxugfcmwsux.
-- NE PAS MODIFIER À LA MAIN : c'est une photographie, pas un état cible.
-- =====================================================================

DROP POLICY IF EXISTS authenticated_manage_activities ON public.activities;
CREATE POLICY authenticated_manage_activities ON public.activities AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert activity" ON public.activity_log;
CREATE POLICY "Anyone can insert activity" ON public.activity_log AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Users see own activity" ON public.activity_log;
CREATE POLICY "Users see own activity" ON public.activity_log AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = user_id));

DROP POLICY IF EXISTS activity_log_admin_read ON public.activity_log;
CREATE POLICY activity_log_admin_read ON public.activity_log AS PERMISSIVE FOR SELECT TO public USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text));

DROP POLICY IF EXISTS authenticated_insert_articles ON public.articles;
CREATE POLICY authenticated_insert_articles ON public.articles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_update_articles ON public.articles;
CREATE POLICY authenticated_update_articles ON public.articles AS PERMISSIVE FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read articles" ON public.articles;
CREATE POLICY "public read articles" ON public.articles AS PERMISSIVE FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS anon_insert_bookings ON public.bookings;
CREATE POLICY anon_insert_bookings ON public.bookings AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_manage_bookings ON public.bookings;
CREATE POLICY authenticated_manage_bookings ON public.bookings AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS certs_own ON public.certificates;
CREATE POLICY certs_own ON public.certificates AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));

DROP POLICY IF EXISTS modules_read ON public.course_modules;
CREATE POLICY modules_read ON public.course_modules AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS modules_write ON public.course_modules;
CREATE POLICY modules_write ON public.course_modules AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1 FROM courses WHERE ((courses.id = course_modules.course_id) AND (courses.author_id = auth.uid())))));

DROP POLICY IF EXISTS courses_read ON public.courses;
CREATE POLICY courses_read ON public.courses AS PERMISSIVE FOR SELECT TO authenticated USING ((status = 'published'::text));

DROP POLICY IF EXISTS courses_write_teacher ON public.courses;
CREATE POLICY courses_write_teacher ON public.courses AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = author_id)) WITH CHECK ((auth.uid() = author_id));

DROP POLICY IF EXISTS authenticated_manage_sequences ON public.email_sequences;
CREATE POLICY authenticated_manage_sequences ON public.email_sequences AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS enrollments_formateur_admin_read ON public.enrollments;
CREATE POLICY enrollments_formateur_admin_read ON public.enrollments AS PERMISSIVE FOR SELECT TO public USING (((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text) OR (EXISTS ( SELECT 1 FROM (session_members sm JOIN training_sessions ts ON ((ts.id = sm.session_id))) WHERE ((sm.learner_id = enrollments.user_id) AND (ts.formateur_id = auth.uid()))))));

DROP POLICY IF EXISTS enrollments_own ON public.enrollments;
CREATE POLICY enrollments_own ON public.enrollments AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

DROP POLICY IF EXISTS service_role_all ON public.factures;
CREATE POLICY service_role_all ON public.factures AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS anon_insert_leads ON public.leads;
CREATE POLICY anon_insert_leads ON public.leads AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_manage_leads ON public.leads;
CREATE POLICY authenticated_manage_leads ON public.leads AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS progress_own ON public.lesson_progress;
CREATE POLICY progress_own ON public.lesson_progress AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));

DROP POLICY IF EXISTS lessons_read ON public.lessons;
CREATE POLICY lessons_read ON public.lessons AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS lessons_write ON public.lessons;
CREATE POLICY lessons_write ON public.lessons AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1 FROM courses WHERE ((courses.id = lessons.course_id) AND (courses.author_id = auth.uid())))));

DROP POLICY IF EXISTS orders_insert ON public.orders;
CREATE POLICY orders_insert ON public.orders AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = buyer_id));

DROP POLICY IF EXISTS orders_select ON public.orders;
CREATE POLICY orders_select ON public.orders AS PERMISSIVE FOR SELECT TO public USING (((auth.uid() = buyer_id) OR (( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text)));

DROP POLICY IF EXISTS orders_update_admin ON public.orders;
CREATE POLICY orders_update_admin ON public.orders AS PERMISSIVE FOR UPDATE TO public USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text));

DROP POLICY IF EXISTS orgs_read ON public.organizations;
CREATE POLICY orgs_read ON public.organizations AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS anon_read_stages ON public.pipeline_stages;
CREATE POLICY anon_read_stages ON public.pipeline_stages AS PERMISSIVE FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS authenticated_manage_stages ON public.pipeline_stages;
CREATE POLICY authenticated_manage_stages ON public.pipeline_stages AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
CREATE POLICY "Insert own profile" ON public.profiles AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS "Users see own profile" ON public.profiles;
CREATE POLICY "Users see own profile" ON public.profiles AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = id));

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = id));

DROP POLICY IF EXISTS profiles_own ON public.profiles;
CREATE POLICY profiles_own ON public.profiles AS PERMISSIVE FOR ALL TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS profiles_read ON public.profiles;
CREATE POLICY profiles_read ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS questions_read ON public.quiz_questions;
CREATE POLICY questions_read ON public.quiz_questions AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS questions_write ON public.quiz_questions;
CREATE POLICY questions_write ON public.quiz_questions AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1 FROM quizzes WHERE (quizzes.id = quiz_questions.quiz_id))));

DROP POLICY IF EXISTS quizzes_read ON public.quizzes;
CREATE POLICY quizzes_read ON public.quizzes AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS quizzes_write ON public.quizzes;
CREATE POLICY quizzes_write ON public.quizzes AS PERMISSIVE FOR ALL TO authenticated USING ((EXISTS ( SELECT 1 FROM courses WHERE ((courses.id = quizzes.course_id) AND (courses.author_id = auth.uid())))));

DROP POLICY IF EXISTS scorm_read ON public.scorm_packages;
CREATE POLICY scorm_read ON public.scorm_packages AS PERMISSIVE FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS attendance_formateur ON public.session_attendance;
CREATE POLICY attendance_formateur ON public.session_attendance AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1 FROM training_sessions ts WHERE ((ts.id = session_attendance.session_id) AND ((ts.formateur_id = auth.uid()) OR (( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text)))))) WITH CHECK ((EXISTS ( SELECT 1 FROM training_sessions ts WHERE ((ts.id = session_attendance.session_id) AND (ts.formateur_id = auth.uid())))));

DROP POLICY IF EXISTS attendance_self_read ON public.session_attendance;
CREATE POLICY attendance_self_read ON public.session_attendance AS PERMISSIVE FOR SELECT TO public USING ((learner_id = auth.uid()));

DROP POLICY IF EXISTS session_members_formateur ON public.session_members;
CREATE POLICY session_members_formateur ON public.session_members AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1 FROM training_sessions ts WHERE ((ts.id = session_members.session_id) AND ((ts.formateur_id = auth.uid()) OR (( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text)))))) WITH CHECK ((EXISTS ( SELECT 1 FROM training_sessions ts WHERE ((ts.id = session_members.session_id) AND (ts.formateur_id = auth.uid())))));

DROP POLICY IF EXISTS session_members_self_read ON public.session_members;
CREATE POLICY session_members_self_read ON public.session_members AS PERMISSIVE FOR SELECT TO public USING ((learner_id = auth.uid()));

DROP POLICY IF EXISTS authenticated_manage_sources ON public.sources;
CREATE POLICY authenticated_manage_sources ON public.sources AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public read sources" ON public.sources;
CREATE POLICY "public read sources" ON public.sources AS PERMISSIVE FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS sessions_formateur_all ON public.training_sessions;
CREATE POLICY sessions_formateur_all ON public.training_sessions AS PERMISSIVE FOR ALL TO public USING (((auth.uid() = formateur_id) OR (( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'admin'::text))) WITH CHECK ((auth.uid() = formateur_id));
