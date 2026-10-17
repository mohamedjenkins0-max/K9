import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (Firebase Auth UID integrated)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').notNull().default('student'), // 'super_admin' | 'institution_admin' | 'teacher' | 'parent' | 'student'
  institutionId: text('institution_id'), // 'k9_school' | 'k9_vocational'
  linkedStudentId: text('linked_student_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Institutions table
export const institutions = pgTable('institutions', {
  id: text('id').primaryKey(), // 'k9_school' | 'k9_vocational'
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  tagline: text('tagline'),
  type: text('type').notNull(),
  location: text('location').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  principal: text('principal').notNull(),
  academicYear: text('academic_year').notNull().default('2025/2026'),
  term: text('term').notNull().default('Term 1'),
  currency: text('currency').notNull().default('SLE'),
});

// 3. Admission Applications table
export const admissionApplications = pgTable('admission_applications', {
  id: text('id').primaryKey(),
  applicationNumber: text('application_number').notNull().unique(),
  institutionId: text('institution_id').notNull(),
  applicantFullName: text('applicant_full_name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  parentGuardianName: text('parent_guardian_name').notNull(),
  parentGuardianPhone: text('parent_guardian_phone').notNull(),
  address: text('address').notNull(),
  appliedClassOrCourse: text('applied_class_or_course').notNull(),
  previousSchool: text('previous_school'),
  emergencyContactName: text('emergency_contact_name').notNull(),
  emergencyContactPhone: text('emergency_contact_phone').notNull(),
  emergencyRelationship: text('emergency_relationship').notNull(),
  status: text('status').notNull().default('pending'),
  reviewNotes: text('review_notes'),
  reviewedBy: text('reviewed_by'),
  reviewedAt: text('reviewed_at'),
  assignedStudentNumber: text('assigned_student_number'),
  documentsJson: text('documents_json').default('[]'),
  createdAt: text('created_at').notNull(),
});

// 4. Students table
export const students = pgTable('students', {
  id: text('id').primaryKey(),
  studentNumber: text('student_number').notNull().unique(),
  institutionId: text('institution_id').notNull(),
  fullName: text('full_name').notNull(),
  gender: text('gender').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  currentClassOrCourse: text('current_class_or_course').notNull(),
  parentGuardianName: text('parent_guardian_name').notNull(),
  parentGuardianPhone: text('parent_guardian_phone').notNull(),
  address: text('address').notNull(),
  emergencyContact: text('emergency_contact').notNull(),
  emergencyPhone: text('emergency_phone').notNull(),
  admissionDate: text('admission_date').notNull(),
  status: text('status').notNull().default('active'),
});

// 5. Staff table
export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  staffNumber: text('staff_number').notNull().unique(),
  institutionId: text('institution_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  roleTitle: text('role_title').notNull(),
  department: text('department').notNull(),
  assignedClasses: text('assigned_classes').notNull(), // JSON array
  assignedSubjects: text('assigned_subjects').notNull(), // JSON array
  qualifications: text('qualifications'),
  status: text('status').notNull().default('active'),
});

// 6. Classes table
export const classes = pgTable('classes', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  className: text('class_name').notNull(),
  stream: text('stream'),
  classTeacherId: text('class_teacher_id'),
  classTeacherName: text('class_teacher_name').notNull(),
  enrolledCount: integer('enrolled_count').notNull().default(0),
  capacity: integer('capacity').notNull().default(40),
  subjectsJson: text('subjects_json').notNull(),
});

// 7. Attendance table
export const attendance = pgTable('attendance', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  studentNumber: text('student_number').notNull(),
  classOrCourse: text('class_or_course').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(),
  recordedBy: text('recorded_by').notNull(),
});

// 8. Grades table
export const grades = pgTable('grades', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  studentNumber: text('student_number').notNull(),
  classOrCourse: text('class_or_course').notNull(),
  subjectCode: text('subject_code').notNull(),
  subjectName: text('subject_name').notNull(),
  continuousAssessment: doublePrecision('continuous_assessment').notNull(),
  finalExam: doublePrecision('final_exam').notNull(),
  totalScore: doublePrecision('total_score').notNull(),
  letterGrade: text('letter_grade').notNull(),
  remarks: text('remarks'),
  isPublished: boolean('is_published').notNull().default(false),
  term: text('term').notNull(),
  academicYear: text('academic_year').notNull(),
  enteredBy: text('entered_by').notNull(),
  enteredAt: text('entered_at').notNull(),
});

// 9. Learning Materials table
export const learningMaterials = pgTable('learning_materials', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  targetClassOrCourse: text('target_class_or_course').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size'),
  fileType: text('file_type'),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: text('created_at').notNull(),
  isPrivate: boolean('is_private').notNull().default(true),
});

// 10. Announcements table
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  priority: text('priority').notNull().default('normal'),
  targetAudience: text('target_audience').notNull().default('all'),
  publishedBy: text('published_by').notNull(),
  publishDate: text('publish_date').notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
});

// 11. Audit Logs table
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull(),
  action: text('action').notNull(),
  actorId: text('actor_id').notNull(),
  actorEmail: text('actor_email').notNull(),
  actorRole: text('actor_role').notNull(),
  targetEntity: text('target_entity').notNull(),
  targetId: text('target_id').notNull(),
  detailsJson: text('details_json').notNull(),
  timestamp: text('timestamp').notNull(),
});
