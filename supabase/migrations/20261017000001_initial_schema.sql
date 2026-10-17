-- ============================================================================
-- K9 CENTURY EDUCATION MANAGEMENT SYSTEM — DATABASE SCHEMA (PHASE 1)
-- Target: PostgreSQL / Supabase
-- Multi-Tenant Institution Architecture with Strict Separation
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE institution_type AS ENUM ('general_education', 'vocational_technical');
CREATE TYPE user_role_type AS ENUM ('super_admin', 'institution_admin', 'teacher', 'parent', 'student');
CREATE TYPE admission_status_type AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE attendance_status_type AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE student_status_type AS ENUM ('active', 'graduated', 'transferred', 'suspended');

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    id TEXT PRIMARY KEY, -- 'k9_school' or 'k9_vocational'
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    tagline TEXT,
    type institution_type NOT NULL,
    location TEXT NOT NULL DEFAULT 'Freetown, Sierra Leone',
    phone TEXT NOT NULL DEFAULT '+232 76 990 001',
    email TEXT NOT NULL,
    principal TEXT NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2025/2026',
    current_term TEXT NOT NULL DEFAULT 'Term 1',
    currency TEXT NOT NULL DEFAULT 'SLE',
    timezone TEXT NOT NULL DEFAULT 'Africa/Freetown',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'student',
    institution_id TEXT REFERENCES public.institutions(id) ON DELETE RESTRICT,
    linked_student_id UUID,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMISSION APPLICATIONS TABLE (Public & Admin workflow)
CREATE TABLE IF NOT EXISTS public.admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number TEXT UNIQUE NOT NULL, -- Format: APP-YYYY-SCH/VOC-XXXX
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    applicant_full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    parent_guardian_name TEXT NOT NULL,
    parent_guardian_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    applied_class_or_course TEXT NOT NULL,
    previous_school TEXT,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_relationship TEXT NOT NULL,
    status admission_status_type NOT NULL DEFAULT 'pending',
    review_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    assigned_student_number TEXT UNIQUE,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADMISSION DOCUMENTS TABLE (Private Supabase Storage records)
CREATE TABLE IF NOT EXISTS public.admission_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.admission_applications(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes INT,
    verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENTS TABLE (Enrolled student records)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number TEXT UNIQUE NOT NULL, -- Format: K9-SCH-YYYY-XXXX or K9-VOC-YYYY-XXXX
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    admission_application_id UUID REFERENCES public.admission_applications(id),
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    current_class_or_course TEXT NOT NULL,
    parent_guardian_name TEXT NOT NULL,
    parent_guardian_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status student_status_type NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STAFF TABLE
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    staff_number TEXT UNIQUE NOT NULL,
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    assigned_classes TEXT[] DEFAULT '{}',
    assigned_subjects TEXT[] DEFAULT '{}',
    qualifications TEXT,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLASSES & SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    class_name TEXT NOT NULL,
    stream TEXT,
    class_teacher_id UUID REFERENCES public.staff(id),
    capacity INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, class_name)
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.staff(id),
    credit_hours INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, class_id, code)
);

-- 8. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_or_course TEXT NOT NULL,
    date DATE NOT NULL,
    status attendance_status_type NOT NULL DEFAULT 'present',
    remark TEXT,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, student_id, date)
);

-- 9. RESULTS & GRADES TABLE (Continuous Assessment 30%, Exam 70%)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_or_course TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    continuous_assessment NUMERIC(4,1) NOT NULL CHECK (continuous_assessment >= 0 AND continuous_assessment <= 30),
    final_exam NUMERIC(4,1) NOT NULL CHECK (final_exam >= 0 AND final_exam <= 70),
    total_score NUMERIC(5,1) GENERATED ALWAYS AS (continuous_assessment + final_exam) STORED,
    letter_grade TEXT NOT NULL,
    remarks TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    term TEXT NOT NULL DEFAULT 'Term 1',
    academic_year TEXT NOT NULL DEFAULT '2025/2026',
    entered_by UUID NOT NULL REFERENCES public.profiles(id),
    last_updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, student_id, subject_code, term, academic_year)
);

-- 10. LEARNING MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    target_class_or_course TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    target_audience TEXT NOT NULL DEFAULT 'all',
    published_by UUID NOT NULL REFERENCES public.profiles(id),
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expires_date DATE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id TEXT NOT NULL, -- Institution ID or 'global'
    action TEXT NOT NULL,
    actor_id UUID NOT NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_admissions_inst_status ON public.admission_applications(institution_id, status);
CREATE INDEX IF NOT EXISTS idx_students_inst_class ON public.students(institution_id, current_class_or_course);
CREATE INDEX IF NOT EXISTS idx_grades_inst_pub ON public.grades(institution_id, is_published);
CREATE INDEX IF NOT EXISTS idx_attendance_inst_date ON public.attendance(institution_id, date);
CREATE INDEX IF NOT EXISTS idx_audit_inst_created ON public.audit_logs(institution_id, created_at DESC);
