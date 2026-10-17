-- ============================================================================
-- K9 CENTURY EDUCATION MANAGEMENT SYSTEM — ROW LEVEL SECURITY POLICIES (PHASE 1)
-- Enforces Multi-Tenant Isolation & Least Privilege Access
-- ============================================================================

-- Enable RLS on ALL tables containing private information
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SECURITY HELPER FUNCTIONS (SECURITY DEFINER)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_current_profile()
RETURNS public.profiles AS $$
    SELECT * FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_institution_access(target_inst_id TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (
            role = 'super_admin' OR
            (institution_id = target_inst_id AND role IN ('institution_admin', 'teacher', 'parent', 'student'))
        )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_institution_admin_or_higher(target_inst_id TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (
            role = 'super_admin' OR
            (institution_id = target_inst_id AND role = 'institution_admin')
        )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_institution_staff(target_inst_id TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (
            role = 'super_admin' OR
            (institution_id = target_inst_id AND role IN ('institution_admin', 'teacher'))
        )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 1. INSTITUTIONS POLICIES
-- ----------------------------------------------------------------------------
-- Public can view institution basic directory (for landing and admissions)
CREATE POLICY "Institutions directory is viewable by all"
    ON public.institutions FOR SELECT
    USING (true);

-- Only super admins can modify institution records
CREATE POLICY "Super admins can manage institutions"
    ON public.institutions FOR ALL
    USING (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Admins can view profiles in their institution
CREATE POLICY "Admins can view institution profiles"
    ON public.profiles FOR SELECT
    USING (
        public.is_super_admin() OR
        public.is_institution_admin_or_higher(institution_id)
    );

-- Only super admins and authorized institution admins can assign roles
CREATE POLICY "Only authorized admins can update profiles"
    ON public.profiles FOR UPDATE
    USING (
        public.is_super_admin() OR
        (public.is_institution_admin_or_higher(institution_id) AND role != 'super_admin')
    );

-- ----------------------------------------------------------------------------
-- 3. ADMISSION APPLICATIONS POLICIES
-- ----------------------------------------------------------------------------
-- Anyone (public applicants) can submit a new admission application
-- Enforce that new submissions must always be in 'pending' status
CREATE POLICY "Public can submit pending admission application"
    ON public.admission_applications FOR INSERT
    WITH CHECK (status = 'pending');

-- Institution Admins and Super Admins can view and review applications for their institution
CREATE POLICY "Admins can view institution applications"
    ON public.admission_applications FOR SELECT
    USING (
        public.is_super_admin() OR
        public.is_institution_admin_or_higher(institution_id)
    );

CREATE POLICY "Admins can review applications for their institution"
    ON public.admission_applications FOR UPDATE
    USING (
        public.is_super_admin() OR
        public.is_institution_admin_or_higher(institution_id)
    );

-- ----------------------------------------------------------------------------
-- 4. STUDENTS POLICIES (Strict Privacy)
-- ----------------------------------------------------------------------------
-- Staff of the institution can view student records
CREATE POLICY "Institution staff can view students"
    ON public.students FOR SELECT
    USING (public.is_institution_staff(institution_id));

-- Students can only view their own record
CREATE POLICY "Students can view own record"
    ON public.students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.linked_student_id = public.students.id
        )
    );

-- Parents can view only their linked child's record
CREATE POLICY "Parents can view linked child"
    ON public.students FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'parent' AND p.linked_student_id = public.students.id
        )
    );

-- Only admins can create or update student enrolments
CREATE POLICY "Admins can manage student enrollments"
    ON public.students FOR ALL
    USING (public.is_institution_admin_or_higher(institution_id));

-- ----------------------------------------------------------------------------
-- 5. GRADES & RESULTS POLICIES
-- ----------------------------------------------------------------------------
-- Staff can view all grades in their institution
CREATE POLICY "Staff can view institution grades"
    ON public.grades FOR SELECT
    USING (public.is_institution_staff(institution_id));

-- Teachers and admins can enter and update marks
CREATE POLICY "Teachers can enter marks"
    ON public.grades FOR INSERT
    WITH CHECK (public.is_institution_staff(institution_id));

CREATE POLICY "Teachers can update marks"
    ON public.grades FOR UPDATE
    USING (public.is_institution_staff(institution_id));

-- Students & Parents can ONLY view PUBLISHED results for their own record
CREATE POLICY "Students and parents can only view published results"
    ON public.grades FOR SELECT
    USING (
        is_published = true AND (
            EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.id = auth.uid() AND p.linked_student_id = public.grades.student_id
            )
        )
    );

-- ----------------------------------------------------------------------------
-- 6. ATTENDANCE POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff can view attendance"
    ON public.attendance FOR SELECT
    USING (public.is_institution_staff(institution_id));

CREATE POLICY "Staff can record attendance"
    ON public.attendance FOR INSERT
    WITH CHECK (public.is_institution_staff(institution_id));

CREATE POLICY "Students can view own attendance"
    ON public.attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.linked_student_id = public.attendance.student_id
        )
    );

-- ----------------------------------------------------------------------------
-- 7. AUDIT LOGS (IMMUTABLE)
-- ----------------------------------------------------------------------------
-- Super admins can view all audit logs
CREATE POLICY "Super admins can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_super_admin());

-- Institution admins can view logs for their institution
CREATE POLICY "Institution admins can view their logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_institution_admin_or_higher(institution_id));

-- System actors can insert logs
CREATE POLICY "Authenticated users can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (auth.uid() = actor_id);

-- NO UPDATE OR DELETE POLICIES ON AUDIT LOGS — LOGS ARE PERMANENT AND TAMPER-PROOF!
