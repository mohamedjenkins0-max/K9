import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Institution, 
  UserProfile, 
  AdmissionApplication, 
  Student, 
  Staff, 
  ClassSubject, 
  AttendanceRecord, 
  GradeRecord, 
  LearningMaterial, 
  SchoolAnnouncement, 
  AuditLogEntry, 
  InstitutionId,
  UserRole
} from '../types/database';

// Read client credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

// Real Supabase Client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ============================================================================
// DEFAULT SEED DATA (SIERRA LEONE CONTEXT)
// ============================================================================

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'k9_school',
    name: 'K9 Century School',
    shortName: 'K9 School',
    tagline: 'Fostering Academic Excellence, Moral Integrity & Leadership',
    type: 'general_education',
    location: '14 Wilkinson Road, Freetown, Sierra Leone',
    phone: '+232 76 990 001',
    email: 'admissions@k9century.edu.sl',
    principal: 'Dr. Aminata Bangura (PhD, EdM)',
    foundedYear: 2012,
    academicYear: '2025/2026',
    term: 'Term 1',
    currency: 'SLE'
  },
  {
    id: 'k9_vocational',
    name: 'K9 Century Vocational Institute',
    shortName: 'K9 Vocational',
    tagline: 'Empowering West Africa with Technical Mastery & Industrial Skills',
    type: 'vocational_technical',
    location: '88 Bai Bureh Road, Kissy, Freetown, Sierra Leone',
    phone: '+232 78 880 002',
    email: 'vocational@k9century.edu.sl',
    principal: 'Ing. Mohamed S. Kamara (MSc, PE)',
    foundedYear: 2018,
    academicYear: '2025/2026',
    term: 'Semester 1',
    currency: 'SLE'
  }
];

export const INITIAL_CLASSES: ClassSubject[] = [
  // K9 Century School
  {
    id: 'cls-sch-1',
    institutionId: 'k9_school',
    className: 'JSS 1A',
    stream: 'Junior Secondary',
    classTeacherId: 'stf-sch-1',
    classTeacherName: 'Mr. Joseph Conteh',
    enrolledCount: 38,
    capacity: 40,
    subjects: [
      { id: 'sub-1', name: 'Mathematics', code: 'MTH-101', teacherName: 'Mr. Joseph Conteh', teacherId: 'stf-sch-1', creditHours: 4 },
      { id: 'sub-2', name: 'English Language', code: 'ENG-101', teacherName: 'Mrs. Fatmata Sesay', teacherId: 'stf-sch-2', creditHours: 4 },
      { id: 'sub-3', name: 'Integrated Science', code: 'SCI-101', teacherName: 'Mr. Alusine Koroma', teacherId: 'stf-sch-3', creditHours: 3 },
      { id: 'sub-4', name: 'Social Studies & Sierra Leone History', code: 'SOC-101', teacherName: 'Mrs. Hawa Mansaray', teacherId: 'stf-sch-4', creditHours: 3 }
    ]
  },
  {
    id: 'cls-sch-2',
    institutionId: 'k9_school',
    className: 'SSS 2 Science',
    stream: 'Senior Secondary (Science)',
    classTeacherId: 'stf-sch-3',
    classTeacherName: 'Mr. Alusine Koroma',
    enrolledCount: 32,
    capacity: 35,
    subjects: [
      { id: 'sub-5', name: 'Physics (WASSCE)', code: 'PHY-201', teacherName: 'Mr. Alusine Koroma', teacherId: 'stf-sch-3', creditHours: 4 },
      { id: 'sub-6', name: 'Chemistry', code: 'CHM-201', teacherName: 'Dr. Aminata Bangura', teacherId: 'stf-sch-0', creditHours: 4 },
      { id: 'sub-7', name: 'Biology', code: 'BIO-201', teacherName: 'Mrs. Fatmata Sesay', teacherId: 'stf-sch-2', creditHours: 4 },
      { id: 'sub-8', name: 'Further Mathematics', code: 'FMTH-201', teacherName: 'Mr. Joseph Conteh', teacherId: 'stf-sch-1', creditHours: 4 }
    ]
  },
  {
    id: 'cls-sch-3',
    institutionId: 'k9_school',
    className: 'SSS 2 Commercial & Arts',
    stream: 'Senior Secondary (Commercial)',
    classTeacherId: 'stf-sch-4',
    classTeacherName: 'Mrs. Hawa Mansaray',
    enrolledCount: 30,
    capacity: 35,
    subjects: [
      { id: 'sub-9', name: 'Financial Accounting', code: 'ACC-201', teacherName: 'Mrs. Hawa Mansaray', teacherId: 'stf-sch-4', creditHours: 4 },
      { id: 'sub-10', name: 'Economics', code: 'ECN-201', teacherName: 'Mr. Joseph Conteh', teacherId: 'stf-sch-1', creditHours: 4 },
      { id: 'sub-11', name: 'Literature in English', code: 'LIT-201', teacherName: 'Mrs. Fatmata Sesay', teacherId: 'stf-sch-2', creditHours: 3 }
    ]
  },
  // K9 Century Vocational Institute
  {
    id: 'cls-voc-1',
    institutionId: 'k9_vocational',
    className: 'NVQ Level 2 Electrical & Solar Engineering',
    stream: 'Electrical Energy Division',
    classTeacherId: 'stf-voc-1',
    classTeacherName: 'Engr. Sahr Tamba',
    enrolledCount: 24,
    capacity: 25,
    subjects: [
      { id: 'sub-v1', name: 'Solar PV Systems & Grid-Tie Inverters', code: 'V-SOL-201', teacherName: 'Engr. Sahr Tamba', teacherId: 'stf-voc-1', creditHours: 6 },
      { id: 'sub-v2', name: 'Industrial Domestic Wiring & Safety (IEE)', code: 'V-ELE-202', teacherName: 'Engr. Sahr Tamba', teacherId: 'stf-voc-1', creditHours: 5 },
      { id: 'sub-v3', name: 'Applied Technical Mathematics', code: 'V-MTH-203', teacherName: 'Ing. Mohamed S. Kamara', teacherId: 'stf-voc-0', creditHours: 3 }
    ]
  },
  {
    id: 'cls-voc-2',
    institutionId: 'k9_vocational',
    className: 'NVQ Level 2 Automotive Diagnostics & Mechatronics',
    stream: 'Mechanical Systems Division',
    classTeacherId: 'stf-voc-2',
    classTeacherName: 'Mr. Abu Bakarr Jalloh',
    enrolledCount: 22,
    capacity: 25,
    subjects: [
      { id: 'sub-v4', name: 'Electronic Engine Management & ECU Scan', code: 'V-AUT-201', teacherName: 'Mr. Abu Bakarr Jalloh', teacherId: 'stf-voc-2', creditHours: 6 },
      { id: 'sub-v5', name: 'Hydraulic Braking & Steering Systems', code: 'V-AUT-202', teacherName: 'Mr. Abu Bakarr Jalloh', teacherId: 'stf-voc-2', creditHours: 4 }
    ]
  },
  {
    id: 'cls-voc-3',
    institutionId: 'k9_vocational',
    className: 'NVQ Level 1 Information Tech & Network Support',
    stream: 'Computing & Digital Trades',
    classTeacherId: 'stf-voc-3',
    classTeacherName: 'Ms. Isata Turay',
    enrolledCount: 28,
    capacity: 30,
    subjects: [
      { id: 'sub-v6', name: 'Computer Hardware, Fibre & LAN Routing', code: 'V-NET-101', teacherName: 'Ms. Isata Turay', teacherId: 'stf-voc-3', creditHours: 5 },
      { id: 'sub-v7', name: 'Cybersecurity Hygiene & Office Systems', code: 'V-IT-102', teacherName: 'Ms. Isata Turay', teacherId: 'stf-voc-3', creditHours: 4 }
    ]
  }
];

export const INITIAL_STAFF: Staff[] = [
  // School Staff
  {
    id: 'stf-sch-0',
    staffNumber: 'STF-SCH-001',
    institutionId: 'k9_school',
    fullName: 'Dr. Aminata Bangura',
    email: 'a.bangura@k9century.edu.sl',
    phone: '+232 76 112 233',
    roleTitle: 'Principal & Head of Sciences',
    department: 'Administration & Sciences',
    assignedClasses: ['SSS 2 Science'],
    assignedSubjects: ['Chemistry'],
    qualifications: 'BSc Pure Chem (FBC), MSc Ed (Leeds), PhD Curriculum Studies',
    joinedDate: '2015-09-01',
    status: 'active'
  },
  {
    id: 'stf-sch-1',
    staffNumber: 'STF-SCH-002',
    institutionId: 'k9_school',
    fullName: 'Mr. Joseph Conteh',
    email: 'j.conteh@k9century.edu.sl',
    phone: '+232 77 445 566',
    roleTitle: 'Senior Mathematics Master',
    department: 'Mathematics & Computing',
    assignedClasses: ['JSS 1A', 'SSS 2 Science'],
    assignedSubjects: ['Mathematics', 'Further Mathematics'],
    qualifications: 'BSc Mathematics Education (Njala University)',
    joinedDate: '2018-01-15',
    status: 'active'
  },
  {
    id: 'stf-sch-2',
    staffNumber: 'STF-SCH-003',
    institutionId: 'k9_school',
    fullName: 'Mrs. Fatmata Sesay',
    email: 'f.sesay@k9century.edu.sl',
    phone: '+232 78 778 899',
    roleTitle: 'Senior English & Biology Tutor',
    department: 'Humanities & Life Sciences',
    assignedClasses: ['JSS 1A', 'SSS 2 Commercial & Arts'],
    assignedSubjects: ['English Language', 'Literature in English'],
    qualifications: 'BA English Literature, Dip.Ed (Fourah Bay College)',
    joinedDate: '2019-03-01',
    status: 'active'
  },
  // Vocational Staff
  {
    id: 'stf-voc-0',
    staffNumber: 'STF-VOC-001',
    institutionId: 'k9_vocational',
    fullName: 'Ing. Mohamed S. Kamara',
    email: 'm.kamara@k9century.edu.sl',
    phone: '+232 76 554 433',
    roleTitle: 'Institute Director & Chief Technical Officer',
    department: 'Executive Technical Leadership',
    assignedClasses: ['NVQ Level 2 Electrical & Solar Engineering'],
    assignedSubjects: ['Applied Technical Mathematics'],
    qualifications: 'BEng Electrical (COMAHS/FBC), MSc Power Engineering (Dortmund), Registered Professional Engineer (SLIE)',
    joinedDate: '2018-06-01',
    status: 'active'
  },
  {
    id: 'stf-voc-1',
    staffNumber: 'STF-VOC-002',
    institutionId: 'k9_vocational',
    fullName: 'Engr. Sahr Tamba',
    email: 's.tamba@k9century.edu.sl',
    phone: '+232 79 332 211',
    roleTitle: 'Lead Solar & Electrical Systems Instructor',
    department: 'Renewable Energy & Electrical Engineering',
    assignedClasses: ['NVQ Level 2 Electrical & Solar Engineering'],
    assignedSubjects: ['Solar PV Systems', 'Domestic & Industrial Wiring'],
    qualifications: 'Higher National Diploma (HND) Electrical Power, City & Guilds London Master Certified',
    joinedDate: '2019-09-15',
    status: 'active'
  },
  {
    id: 'stf-voc-2',
    staffNumber: 'STF-VOC-003',
    institutionId: 'k9_vocational',
    fullName: 'Mr. Abu Bakarr Jalloh',
    email: 'a.jalloh@k9century.edu.sl',
    phone: '+232 77 998 877',
    roleTitle: 'Master Mechatronics & Automotive Instructor',
    department: 'Automotive & Mechanical Systems',
    assignedClasses: ['NVQ Level 2 Automotive Diagnostics & Mechatronics'],
    assignedSubjects: ['Electronic Engine Management & ECU Scan', 'Hydraulic Braking'],
    qualifications: 'Bosch Certified Automotive Diagnostic Specialist, HND Mechanical',
    joinedDate: '2020-02-10',
    status: 'active'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  // School Students
  {
    id: 'stu-sch-1',
    studentNumber: 'K9-SCH-2025-0012',
    institutionId: 'k9_school',
    fullName: 'Mariama K. Kamara',
    gender: 'Female',
    dateOfBirth: '2009-04-14',
    currentClassOrCourse: 'SSS 2 Science',
    parentGuardianName: 'Alhaji Ibrahim Kamara',
    parentGuardianPhone: '+232 76 432 109',
    address: '42 Main Motor Road, Congo Cross, Freetown',
    emergencyContact: 'Alhaji Ibrahim Kamara',
    emergencyPhone: '+232 76 432 109',
    admissionDate: '2022-09-12',
    status: 'active'
  },
  {
    id: 'stu-sch-2',
    studentNumber: 'K9-SCH-2025-0013',
    institutionId: 'k9_school',
    fullName: 'Alhassan Dumbuya',
    gender: 'Male',
    dateOfBirth: '2010-06-22',
    currentClassOrCourse: 'SSS 2 Science',
    parentGuardianName: 'Fatu Dumbuya',
    parentGuardianPhone: '+232 78 654 321',
    address: '15 Savage Street, Central Freetown',
    emergencyContact: 'Fatu Dumbuya (Mother)',
    emergencyPhone: '+232 78 654 321',
    admissionDate: '2022-09-12',
    status: 'active'
  },
  {
    id: 'stu-sch-3',
    studentNumber: 'K9-SCH-2025-0045',
    institutionId: 'k9_school',
    fullName: 'Fatmata B. Sesay',
    gender: 'Female',
    dateOfBirth: '2012-10-25', // Birthday approaching!
    currentClassOrCourse: 'JSS 1A',
    parentGuardianName: 'Mohamed Sesay',
    parentGuardianPhone: '+232 77 112 299',
    address: '8 Siaka Stevens Street, Freetown',
    emergencyContact: 'Mohamed Sesay',
    emergencyPhone: '+232 77 112 299',
    admissionDate: '2025-09-08',
    status: 'active'
  },
  {
    id: 'stu-sch-4',
    studentNumber: 'K9-SCH-2025-0046',
    institutionId: 'k9_school',
    fullName: 'Samuel O. Koroma',
    gender: 'Male',
    dateOfBirth: '2012-10-20', // Birthday approaching!
    currentClassOrCourse: 'JSS 1A',
    parentGuardianName: 'Pastor David Koroma',
    parentGuardianPhone: '+232 76 991 188',
    address: '22 Pademba Road, Freetown',
    emergencyContact: 'Pastor David Koroma',
    emergencyPhone: '+232 76 991 188',
    admissionDate: '2025-09-08',
    status: 'active'
  },
  // Vocational Students
  {
    id: 'stu-voc-1',
    studentNumber: 'K9-VOC-2025-0004',
    institutionId: 'k9_vocational',
    fullName: 'Emmanuel S. Conteh',
    gender: 'Male',
    dateOfBirth: '2004-10-28', // Upcoming birthday!
    currentClassOrCourse: 'NVQ Level 2 Electrical & Solar Engineering',
    parentGuardianName: 'Kallon Conteh',
    parentGuardianPhone: '+232 79 443 322',
    address: '102 Bai Bureh Road, Wellington, Freetown',
    emergencyContact: 'Kallon Conteh (Uncle)',
    emergencyPhone: '+232 79 443 322',
    admissionDate: '2024-10-01',
    status: 'active'
  },
  {
    id: 'stu-voc-2',
    studentNumber: 'K9-VOC-2025-0005',
    institutionId: 'k9_vocational',
    fullName: 'Zainab J. Bangura',
    gender: 'Female',
    dateOfBirth: '2005-02-18',
    currentClassOrCourse: 'NVQ Level 2 Automotive Diagnostics & Mechatronics',
    parentGuardianName: 'Madam Isata Bangura',
    parentGuardianPhone: '+232 76 887 766',
    address: '14 Blackhall Road, Kissy, Freetown',
    emergencyContact: 'Madam Isata Bangura (Mother)',
    emergencyPhone: '+232 76 887 766',
    admissionDate: '2024-10-01',
    status: 'active'
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-sch-01',
    applicationNumber: 'APP-2026-SCH-0101',
    institutionId: 'k9_school',
    applicantFullName: 'Bintu Patricia Cole',
    dateOfBirth: '2012-08-14',
    gender: 'Female',
    parentGuardianName: 'Mr. Patrick Cole',
    parentGuardianPhone: '+232 77 554 433',
    address: '18 Regent Road, Lumley, Freetown',
    appliedClassOrCourse: 'JSS 1A',
    previousSchool: 'St. Anthony Primary School, Brookfields',
    emergencyContactName: 'Mrs. Veronica Cole',
    emergencyContactPhone: '+232 77 554 434',
    emergencyRelationship: 'Mother',
    status: 'pending',
    documents: [
      { id: 'doc-1', name: 'NPSE_Result_Slip_2025.pdf', type: 'application/pdf', url: '#doc-preview', verified: true },
      { id: 'doc-2', name: 'Birth_Certificate_Certified.jpg', type: 'image/jpeg', url: '#doc-preview', verified: false }
    ],
    createdAt: '2026-10-15T09:20:00Z',
    ipAddress: '197.242.112.4'
  },
  {
    id: 'adm-voc-01',
    applicationNumber: 'APP-2026-VOC-0089',
    institutionId: 'k9_vocational',
    applicantFullName: 'Mohamed Lamin Tarawallie',
    dateOfBirth: '2006-03-12',
    gender: 'Male',
    parentGuardianName: 'Chief Sheku Tarawallie',
    parentGuardianPhone: '+232 76 221 144',
    address: '5 Mountain Cut, Freetown',
    appliedClassOrCourse: 'NVQ Level 2 Electrical & Solar Engineering',
    previousSchool: 'Government Secondary Technical School',
    emergencyContactName: 'Pa Brima Tarawallie',
    emergencyContactPhone: '+232 76 221 145',
    emergencyRelationship: 'Brother',
    status: 'pending',
    documents: [
      { id: 'doc-3', name: 'WASSCE_Result_Slip.pdf', type: 'application/pdf', url: '#doc-preview', verified: true },
      { id: 'doc-4', name: 'Technical_Recommendation.pdf', type: 'application/pdf', url: '#doc-preview', verified: true }
    ],
    createdAt: '2026-10-16T11:45:00Z',
    ipAddress: '197.242.115.88'
  },
  {
    id: 'adm-sch-02',
    applicationNumber: 'APP-2026-SCH-0098',
    institutionId: 'k9_school',
    applicantFullName: 'Sulaiman Mansaray',
    dateOfBirth: '2009-11-04',
    gender: 'Male',
    parentGuardianName: 'Haja Fatmata Mansaray',
    parentGuardianPhone: '+232 78 333 444',
    address: '7 Circular Road, Freetown',
    appliedClassOrCourse: 'SSS 2 Science',
    previousSchool: 'Albert Academy, Freetown',
    emergencyContactName: 'Haja Fatmata Mansaray',
    emergencyContactPhone: '+232 78 333 444',
    emergencyRelationship: 'Mother',
    status: 'approved',
    reviewNotes: 'Outstanding BECE science aggregate (Aggregate 9). Enrolled into SSS 2 Science batch.',
    reviewedBy: 'Dr. Aminata Bangura',
    reviewedAt: '2026-10-10T14:30:00Z',
    assignedStudentNumber: 'K9-SCH-2026-0041',
    documents: [
      { id: 'doc-5', name: 'BECE_Certificate.pdf', type: 'application/pdf', url: '#doc-preview', verified: true }
    ],
    createdAt: '2026-10-08T10:15:00Z',
    ipAddress: '197.242.110.12'
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-1',
    institutionId: 'k9_school',
    studentId: 'stu-sch-1',
    studentName: 'Mariama K. Kamara',
    studentNumber: 'K9-SCH-2025-0012',
    classOrCourse: 'SSS 2 Science',
    subjectCode: 'PHY-201',
    subjectName: 'Physics (WASSCE)',
    continuousAssessment: 27.5, // out of 30
    finalExam: 62.0, // out of 70
    totalScore: 89.5,
    letterGrade: 'A',
    remarks: 'Distinction performance in electromagnetism',
    isPublished: true,
    term: 'Term 1',
    academicYear: '2025/2026',
    enteredBy: 'Mr. Alusine Koroma',
    enteredAt: '2026-10-12T10:00:00Z'
  },
  {
    id: 'grd-2',
    institutionId: 'k9_school',
    studentId: 'stu-sch-1',
    studentName: 'Mariama K. Kamara',
    studentNumber: 'K9-SCH-2025-0012',
    classOrCourse: 'SSS 2 Science',
    subjectCode: 'CHM-201',
    subjectName: 'Chemistry',
    continuousAssessment: 26.0,
    finalExam: 58.5,
    totalScore: 84.5,
    letterGrade: 'A',
    remarks: 'Excellent mastery of stoichiometry & titration',
    isPublished: true,
    term: 'Term 1',
    academicYear: '2025/2026',
    enteredBy: 'Dr. Aminata Bangura',
    enteredAt: '2026-10-12T14:00:00Z'
  },
  {
    id: 'grd-3',
    institutionId: 'k9_school',
    studentId: 'stu-sch-2',
    studentName: 'Alhassan Dumbuya',
    studentNumber: 'K9-SCH-2025-0013',
    classOrCourse: 'SSS 2 Science',
    subjectCode: 'PHY-201',
    subjectName: 'Physics (WASSCE)',
    continuousAssessment: 21.0,
    finalExam: 47.0,
    totalScore: 68.0,
    letterGrade: 'C',
    remarks: 'Satisfactory credit. Needs revision on wave optics.',
    isPublished: true,
    term: 'Term 1',
    academicYear: '2025/2026',
    enteredBy: 'Mr. Alusine Koroma',
    enteredAt: '2026-10-12T10:05:00Z'
  },
  // Unpublished draft grade (Protected by RLS)
  {
    id: 'grd-4',
    institutionId: 'k9_school',
    studentId: 'stu-sch-2',
    studentName: 'Alhassan Dumbuya',
    studentNumber: 'K9-SCH-2025-0013',
    classOrCourse: 'SSS 2 Science',
    subjectCode: 'FMTH-201',
    subjectName: 'Further Mathematics',
    continuousAssessment: 24.0,
    finalExam: 52.0,
    totalScore: 76.0,
    letterGrade: 'B',
    remarks: 'Internal draft score awaiting department moderation',
    isPublished: false, // Private draft!
    term: 'Term 1',
    academicYear: '2025/2026',
    enteredBy: 'Mr. Joseph Conteh',
    enteredAt: '2026-10-14T11:20:00Z'
  },
  // Vocational Grade
  {
    id: 'grd-v1',
    institutionId: 'k9_vocational',
    studentId: 'stu-voc-1',
    studentName: 'Emmanuel S. Conteh',
    studentNumber: 'K9-VOC-2025-0004',
    classOrCourse: 'NVQ Level 2 Electrical & Solar Engineering',
    subjectCode: 'V-SOL-201',
    subjectName: 'Solar PV Systems & Grid-Tie Inverters',
    continuousAssessment: 28.5,
    finalExam: 64.0,
    totalScore: 92.5,
    letterGrade: 'A',
    remarks: 'Flawless safety rating on 5kW rooftop array commissioning',
    isPublished: true,
    term: 'Semester 1',
    academicYear: '2025/2026',
    enteredBy: 'Engr. Sahr Tamba',
    enteredAt: '2026-10-11T16:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'anc-sch-1',
    institutionId: 'k9_school',
    title: 'WASSCE & BECE Term 1 Mock Examinations Timetable Released',
    content: 'All SSS 3 and JSS 3 candidates are hereby notified that the official First Term Mock Examinations timetable has been published on the student portal. Practical science sessions begin Monday, 9:00 AM prompt.',
    priority: 'urgent',
    targetAudience: 'all',
    publishedBy: 'Academic Registrar',
    publishDate: '2026-10-14',
    isPinned: true
  },
  {
    id: 'anc-sch-2',
    institutionId: 'k9_school',
    title: 'Parent-Teacher Association (PTA) General Assembly Notice',
    content: 'The Executive Board cordially invites all parents and guardians to the Term 1 PTA Assembly at the School Assembly Hall, Wilkinson Road, this Saturday at 10:00 AM GMT.',
    priority: 'important',
    targetAudience: 'parents',
    publishedBy: 'PTA Secretariat',
    publishDate: '2026-10-12',
    isPinned: false
  },
  {
    id: 'anc-voc-1',
    institutionId: 'k9_vocational',
    title: 'Industry Internship Placements with Sierra Leone Solar Alliance',
    content: 'NVQ Level 2 Electrical candidates have been scheduled for direct 6-week industrial attachments with certified commercial solar contractors across the Western Area Urban & Rural.',
    priority: 'urgent',
    targetAudience: 'students',
    publishedBy: 'Industrial Liaison Office',
    publishDate: '2026-10-15',
    isPinned: true
  }
];

export const INITIAL_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-1',
    institutionId: 'k9_school',
    title: 'SSS 2 Physics: Electromagnetism & Induction Lecture Notes',
    description: 'Comprehensive study packet with worked WAEC past question solutions from 2018–2025.',
    category: 'Lecture Note',
    targetClassOrCourse: 'SSS 2 Science',
    fileUrl: '#physics-packet',
    fileSize: '4.2 MB',
    fileType: 'PDF Document',
    uploadedBy: 'Mr. Alusine Koroma',
    createdAt: '2026-10-11',
    isPrivate: true
  },
  {
    id: 'mat-2',
    institutionId: 'k9_school',
    title: 'JSS 1 Integrated Science Practical Lab Safety Manual',
    description: 'Essential chemistry and biology laboratory protocols for first-year secondary pupils.',
    category: 'Syllabus',
    targetClassOrCourse: 'JSS 1A',
    fileUrl: '#lab-manual',
    fileSize: '1.8 MB',
    fileType: 'PDF Document',
    uploadedBy: 'Mrs. Fatmata Sesay',
    createdAt: '2026-10-09',
    isPrivate: false
  },
  {
    id: 'mat-v1',
    institutionId: 'k9_vocational',
    title: 'Wiring Regulations: IEE 18th Edition & Sierra Leone Code Compliance',
    description: 'Workshop blueprints, wire gauge calculations, and grounding rod installation standards.',
    category: 'Workshop Manual',
    targetClassOrCourse: 'NVQ Level 2 Electrical & Solar Engineering',
    fileUrl: '#solar-blueprints',
    fileSize: '8.5 MB',
    fileType: 'PDF Blueprint',
    uploadedBy: 'Engr. Sahr Tamba',
    createdAt: '2026-10-13',
    isPrivate: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    institutionId: 'k9_school',
    action: 'ADMISSION_APPROVED',
    actorId: 'stf-sch-0',
    actorEmail: 'a.bangura@k9century.edu.sl',
    actorRole: 'institution_admin',
    targetEntity: 'AdmissionApplication',
    targetId: 'adm-sch-02',
    details: {
      applicant: 'Sulaiman Mansaray',
      assignedStudentNumber: 'K9-SCH-2026-0041',
      enrolledClass: 'SSS 2 Science'
    },
    timestamp: '2026-10-10T14:30:00Z',
    ipAddress: '197.242.110.12'
  },
  {
    id: 'aud-002',
    institutionId: 'k9_school',
    action: 'GRADE_PUBLISHED',
    actorId: 'stf-sch-0',
    actorEmail: 'a.bangura@k9century.edu.sl',
    actorRole: 'institution_admin',
    targetEntity: 'GradeRecord',
    targetId: 'grd-1',
    details: {
      studentNumber: 'K9-SCH-2025-0012',
      subjectCode: 'PHY-201',
      totalScore: 89.5,
      grade: 'A'
    },
    timestamp: '2026-10-12T10:15:00Z',
    ipAddress: '197.242.110.12'
  }
];

// ============================================================================
// RESILIENT PERSISTENT LOCAL DATA REPOSITORY
// Implements full relational state matching Supabase PostgreSQL schema
// ============================================================================

const STORAGE_PREFIX = 'k9_century_edu_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export class K9DataStore {
  static getInstitutions(): Institution[] {
    return getStored('institutions', INITIAL_INSTITUTIONS);
  }

  static getClasses(institutionId?: InstitutionId): ClassSubject[] {
    const list = getStored<ClassSubject[]>('classes', INITIAL_CLASSES);
    return institutionId ? list.filter(c => c.institutionId === institutionId) : list;
  }

  static getStaff(institutionId?: InstitutionId): Staff[] {
    const list = getStored<Staff[]>('staff', INITIAL_STAFF);
    return institutionId ? list.filter(s => s.institutionId === institutionId) : list;
  }

  static getStudents(institutionId?: InstitutionId): Student[] {
    const list = getStored<Student[]>('students', INITIAL_STUDENTS);
    return institutionId ? list.filter(s => s.institutionId === institutionId) : list;
  }

  static getAdmissions(institutionId?: InstitutionId): AdmissionApplication[] {
    const list = getStored<AdmissionApplication[]>('admissions', INITIAL_ADMISSIONS);
    return institutionId ? list.filter(a => a.institutionId === institutionId) : list;
  }

  static submitAdmission(data: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'status' | 'createdAt'>): AdmissionApplication {
    const list = this.getAdmissions();
    const prefix = data.institutionId === 'k9_school' ? 'SCH' : 'VOC';
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const appNumber = `APP-${year}-${prefix}-${randomSeq}`;

    const newRecord: AdmissionApplication = {
      ...data,
      id: 'adm-' + Date.now(),
      applicationNumber: appNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setStored('admissions', [newRecord, ...list]);

    // Record audit log
    this.addAuditLog({
      institutionId: data.institutionId,
      action: 'PUBLIC_ADMISSION_SUBMITTED',
      actorId: 'guest-applicant',
      actorEmail: 'applicant@public.sl',
      actorRole: 'student',
      targetEntity: 'AdmissionApplication',
      targetId: newRecord.id,
      details: {
        applicationNumber: appNumber,
        applicant: data.applicantFullName,
        appliedClass: data.appliedClassOrCourse
      }
    });

    return newRecord;
  }

  static reviewAdmission(
    applicationId: string, 
    decision: 'approved' | 'rejected', 
    reviewerName: string, 
    reviewerRole: UserRole,
    notes: string
  ): { application: AdmissionApplication; newStudent?: Student } {
    const admissions = this.getAdmissions();
    const appIndex = admissions.findIndex(a => a.id === applicationId);
    if (appIndex === -1) throw new Error('Application not found');

    const app = admissions[appIndex];
    if (app.status === 'approved') throw new Error('Application has already been approved');

    const now = new Date().toISOString();
    let assignedStudentNumber: string | undefined = undefined;
    let newStudent: Student | undefined = undefined;

    if (decision === 'approved') {
      const year = new Date().getFullYear();
      const code = app.institutionId === 'k9_school' ? 'SCH' : 'VOC';
      const seq = Math.floor(10 + Math.random() * 90);
      assignedStudentNumber = `K9-${code}-${year}-00${seq}`;

      // Prevent duplicate enrollments check
      const students = this.getStudents();
      const existing = students.find(s => 
        s.fullName.toLowerCase() === app.applicantFullName.toLowerCase() && 
        s.institutionId === app.institutionId
      );

      if (existing) {
        throw new Error(`A student named ${app.applicantFullName} already has an active enrolment (${existing.studentNumber})`);
      }

      // Create new student enrolment record safely
      newStudent = {
        id: 'stu-' + Date.now(),
        studentNumber: assignedStudentNumber,
        institutionId: app.institutionId,
        fullName: app.applicantFullName,
        gender: app.gender,
        dateOfBirth: app.dateOfBirth,
        currentClassOrCourse: app.appliedClassOrCourse,
        parentGuardianName: app.parentGuardianName,
        parentGuardianPhone: app.parentGuardianPhone,
        address: app.address,
        emergencyContact: app.emergencyContactName,
        emergencyPhone: app.emergencyContactPhone,
        admissionDate: now.split('T')[0],
        status: 'active'
      };

      setStored('students', [newStudent, ...students]);
    }

    const updatedApp: AdmissionApplication = {
      ...app,
      status: decision,
      reviewNotes: notes,
      reviewedBy: reviewerName,
      reviewedAt: now,
      assignedStudentNumber
    };

    admissions[appIndex] = updatedApp;
    setStored('admissions', admissions);

    // Write audit log
    this.addAuditLog({
      institutionId: app.institutionId,
      action: decision === 'approved' ? 'ADMISSION_APPROVED' : 'ADMISSION_REJECTED',
      actorId: reviewerName,
      actorEmail: `${reviewerName.toLowerCase().replace(/\s+/g, '.')}@k9century.edu.sl`,
      actorRole: reviewerRole,
      targetEntity: 'AdmissionApplication',
      targetId: app.id,
      details: {
        applicationNumber: app.applicationNumber,
        decision,
        notes,
        assignedStudentNumber
      }
    });

    return { application: updatedApp, newStudent };
  }

  static getGrades(institutionId?: InstitutionId, userRole?: UserRole, linkedStudentId?: string): GradeRecord[] {
    const list = getStored<GradeRecord[]>('grades', INITIAL_GRADES);
    let filtered = institutionId ? list.filter(g => g.institutionId === institutionId) : list;

    // RLS Enforcement: Students and parents CANNOT see unpublished grades!
    if (userRole === 'student' || userRole === 'parent') {
      filtered = filtered.filter(g => g.isPublished);
      if (linkedStudentId) {
        filtered = filtered.filter(g => g.studentId === linkedStudentId);
      }
    }

    return filtered;
  }

  static saveGrade(grade: Omit<GradeRecord, 'id'>, existingId?: string): GradeRecord {
    const list = this.getGrades();
    if (existingId) {
      const idx = list.findIndex(g => g.id === existingId);
      if (idx !== -1) {
        const updated = {
          ...list[idx],
          ...grade,
          lastUpdatedAt: new Date().toISOString()
        };
        list[idx] = updated;
        setStored('grades', list);
        return updated;
      }
    }

    const newRecord: GradeRecord = {
      ...grade,
      id: 'grd-' + Date.now()
    };
    setStored('grades', [newRecord, ...list]);
    return newRecord;
  }

  static togglePublishGrade(gradeId: string, publish: boolean, actor: { id: string; email: string; role: UserRole }): GradeRecord {
    const list = this.getGrades();
    const idx = list.findIndex(g => g.id === gradeId);
    if (idx === -1) throw new Error('Grade record not found');

    list[idx].isPublished = publish;
    list[idx].lastUpdatedBy = actor.email;
    list[idx].lastUpdatedAt = new Date().toISOString();
    setStored('grades', list);

    this.addAuditLog({
      institutionId: list[idx].institutionId,
      action: publish ? 'GRADE_PUBLISHED' : 'GRADE_UNPUBLISHED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      targetEntity: 'GradeRecord',
      targetId: gradeId,
      details: {
        student: list[idx].studentName,
        subject: list[idx].subjectName,
        score: list[idx].totalScore
      }
    });

    return list[idx];
  }

  static getAttendance(institutionId?: InstitutionId, date?: string): AttendanceRecord[] {
    const list = getStored<AttendanceRecord[]>('attendance', []);
    let filtered = institutionId ? list.filter(a => a.institutionId === institutionId) : list;
    if (date) {
      filtered = filtered.filter(a => a.date === date);
    }
    return filtered;
  }

  static recordAttendance(records: AttendanceRecord[]): void {
    const existing = this.getAttendance();
    const map = new Map<string, AttendanceRecord>();
    
    // Key by institution + studentId + date
    for (const r of existing) {
      map.set(`${r.institutionId}_${r.studentId}_${r.date}`, r);
    }
    for (const r of records) {
      map.set(`${r.institutionId}_${r.studentId}_${r.date}`, r);
    }

    setStored('attendance', Array.from(map.values()));
  }

  static getLearningMaterials(institutionId?: InstitutionId): LearningMaterial[] {
    const list = getStored<LearningMaterial[]>('learning_materials', INITIAL_LEARNING_MATERIALS);
    return institutionId ? list.filter(m => m.institutionId === institutionId) : list;
  }

  static addLearningMaterial(material: Omit<LearningMaterial, 'id' | 'createdAt'>): LearningMaterial {
    const list = this.getLearningMaterials();
    const newRecord: LearningMaterial = {
      ...material,
      id: 'mat-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStored('learning_materials', [newRecord, ...list]);
    return newRecord;
  }

  static getAnnouncements(institutionId?: InstitutionId): SchoolAnnouncement[] {
    const list = getStored<SchoolAnnouncement[]>('announcements', INITIAL_ANNOUNCEMENTS);
    return institutionId ? list.filter(a => a.institutionId === institutionId) : list;
  }

  static addAnnouncement(announcement: Omit<SchoolAnnouncement, 'id' | 'publishDate'>): SchoolAnnouncement {
    const list = this.getAnnouncements();
    const newRecord: SchoolAnnouncement = {
      ...announcement,
      id: 'anc-' + Date.now(),
      publishDate: new Date().toISOString().split('T')[0]
    };
    setStored('announcements', [newRecord, ...list]);
    return newRecord;
  }

  static getAuditLogs(institutionId?: InstitutionId | 'global'): AuditLogEntry[] {
    const list = getStored<AuditLogEntry[]>('audit_logs', INITIAL_AUDIT_LOGS);
    if (!institutionId || institutionId === 'global') return list;
    return list.filter(l => l.institutionId === institutionId || l.institutionId === 'global');
  }

  static addAuditLog(log: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    const newRecord: AuditLogEntry = {
      ...log,
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };
    setStored('audit_logs', [newRecord, ...list]);
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_PREFIX + 'institutions');
    localStorage.removeItem(STORAGE_PREFIX + 'classes');
    localStorage.removeItem(STORAGE_PREFIX + 'staff');
    localStorage.removeItem(STORAGE_PREFIX + 'students');
    localStorage.removeItem(STORAGE_PREFIX + 'admissions');
    localStorage.removeItem(STORAGE_PREFIX + 'grades');
    localStorage.removeItem(STORAGE_PREFIX + 'attendance');
    localStorage.removeItem(STORAGE_PREFIX + 'learning_materials');
    localStorage.removeItem(STORAGE_PREFIX + 'announcements');
    localStorage.removeItem(STORAGE_PREFIX + 'audit_logs');
  }
}
