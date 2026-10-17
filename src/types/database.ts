export type InstitutionId = 'k9_school' | 'k9_vocational';

export type UserRole = 'super_admin' | 'institution_admin' | 'teacher' | 'parent' | 'student';

export interface Institution {
  id: InstitutionId;
  name: string;
  shortName: string;
  tagline: string;
  type: 'general_education' | 'vocational_technical';
  location: string;
  phone: string;
  email: string;
  principal: string;
  foundedYear: number;
  academicYear: string;
  term: string;
  currency: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  institutionId?: InstitutionId; // Null for global super_admin
  role: UserRole;
  avatarUrl?: string;
  linkedStudentId?: string; // For parent or student role
  createdAt: string;
}

export type AdmissionStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g., APP-2026-SCH-0042
  institutionId: InstitutionId;
  applicantFullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  parentGuardianName: string;
  parentGuardianPhone: string;
  address: string;
  appliedClassOrCourse: string;
  previousSchool?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    verified: boolean;
  }[];
  status: AdmissionStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  assignedStudentNumber?: string;
  createdAt: string;
  ipAddress?: string;
}

export interface Student {
  id: string;
  studentNumber: string; // e.g., K9-SCH-2026-0012
  institutionId: InstitutionId;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string; // YYYY-MM-DD
  currentClassOrCourse: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  admissionDate: string;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  avatarUrl?: string;
}

export interface Staff {
  id: string;
  staffNumber: string;
  institutionId: InstitutionId;
  fullName: string;
  email: string;
  phone: string;
  roleTitle: string; // e.g., "Senior Mathematics Teacher", "Automotive Systems Master Instructor"
  department: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  qualifications: string;
  joinedDate: string;
  status: 'active' | 'on_leave';
}

export interface ClassSubject {
  id: string;
  institutionId: InstitutionId;
  className: string; // e.g., "JSS 1A", "SSS 2 Science", "NVQ-2 Electrical"
  stream?: string;
  classTeacherId: string;
  classTeacherName: string;
  enrolledCount: number;
  capacity: number;
  subjects: {
    id: string;
    name: string;
    code: string;
    teacherName: string;
    teacherId: string;
    creditHours: number;
  }[];
}

export interface AttendanceRecord {
  id: string;
  institutionId: InstitutionId;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classOrCourse: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'excused';
  remark?: string;
  recordedBy: string;
}

export interface GradeRecord {
  id: string;
  institutionId: InstitutionId;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classOrCourse: string;
  subjectCode: string;
  subjectName: string;
  continuousAssessment: number; // Max 30
  finalExam: number; // Max 70
  totalScore: number; // CA + Exam (0-100)
  letterGrade: string; // A, B, C, D, E, F
  remarks: string;
  isPublished: boolean;
  term: string;
  academicYear: string;
  enteredBy: string;
  enteredAt: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface LearningMaterial {
  id: string;
  institutionId: InstitutionId;
  title: string;
  description: string;
  category: 'Syllabus' | 'Lecture Note' | 'Timetable' | 'Assignment' | 'Workshop Manual';
  targetClassOrCourse: string; // "All" or specific class
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface SchoolAnnouncement {
  id: string;
  institutionId: InstitutionId;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: 'all' | 'staff' | 'parents' | 'students';
  publishedBy: string;
  publishDate: string;
  expiresDate?: string;
  isPinned: boolean;
}

export interface AuditLogEntry {
  id: string;
  institutionId: InstitutionId | 'global';
  action: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  targetEntity: string;
  targetId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}
