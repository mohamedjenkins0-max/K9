-- ============================================================================
-- K9 CENTURY EDUCATION MANAGEMENT SYSTEM — SEED DATA (PHASE 1)
-- Freetown, Sierra Leone
-- ============================================================================

-- 1. SEED INSTITUTIONS
INSERT INTO public.institutions (id, name, short_name, tagline, type, location, phone, email, principal, academic_year, current_term, currency)
VALUES 
(
    'k9_school', 
    'K9 Century School', 
    'K9 School', 
    'Excellence in Academic Foundations & Character Building', 
    'general_education', 
    '14 Wilkinson Road, Freetown, Sierra Leone', 
    '+232 76 990 001', 
    'info.school@k9century.edu.sl', 
    'Dr. Aminata Bangura (PhD, EdM)', 
    '2025/2026', 
    'Term 1', 
    'SLE'
),
(
    'k9_vocational', 
    'K9 Century Vocational Institute', 
    'K9 Vocational', 
    'Practical Skills, Technical Mastery & National Empowerment', 
    'vocational_technical', 
    '88 Bai Bureh Road, Kissy, Freetown, Sierra Leone', 
    '+232 78 880 002', 
    'admissions.vocational@k9century.edu.sl', 
    'Ing. Mohamed S. Kamara (MSc, PE)', 
    '2025/2026', 
    'Term 1', 
    'SLE'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    location = EXCLUDED.location;
