import React, { useState } from 'react';
import { Award, Plus, CheckCircle2, Lock, Unlock, Eye, Edit3, Printer, AlertCircle } from 'lucide-react';
import { InstitutionId, GradeRecord, UserProfile, Student } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';
import { calculateGrade } from '../../lib/grading';

interface ResultsGradingSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const ResultsGradingSection: React.FC<ResultsGradingSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const [grades, setGrades] = useState<GradeRecord[]>(() =>
    K9DataStore.getGrades(institutionId, currentUser.role, currentUser.linkedStudentId)
  );

  const [students] = useState<Student[]>(() => K9DataStore.getStudents(institutionId));
  const classes = K9DataStore.getClasses(institutionId);

  // New Grade Entry State
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.className || '');
  const [subjectCode, setSubjectCode] = useState(classes[0]?.subjects[0]?.code || '');
  const [subjectName, setSubjectName] = useState(classes[0]?.subjects[0]?.name || '');
  const [caScore, setCaScore] = useState<number>(25);
  const [examScore, setExamScore] = useState<number>(55);
  const [remarks, setRemarks] = useState('Satisfactory mastery of core competencies');
  const [formError, setFormError] = useState<string | null>(null);

  const reloadData = () => {
    setGrades(K9DataStore.getGrades(institutionId, currentUser.role, currentUser.linkedStudentId));
  };

  const isTeacherOrAdmin = ['super_admin', 'institution_admin', 'teacher'].includes(currentUser.role);
  const isAdmin = ['super_admin', 'institution_admin'].includes(currentUser.role);

  // Live calculation of preview grade
  const liveGrade = calculateGrade(caScore, examScore);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (caScore < 0 || caScore > 30) {
      setFormError('Continuous Assessment (CA) must be between 0 and 30 marks.');
      return;
    }
    if (examScore < 0 || examScore > 70) {
      setFormError('Final Examination score must be between 0 and 70 marks.');
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      setFormError('Please select a valid student.');
      return;
    }

    const calc = calculateGrade(caScore, examScore);

    K9DataStore.saveGrade({
      institutionId,
      studentId: student.id,
      studentName: student.fullName,
      studentNumber: student.studentNumber,
      classOrCourse: student.currentClassOrCourse,
      subjectCode,
      subjectName,
      continuousAssessment: caScore,
      finalExam: examScore,
      totalScore: calc.total,
      letterGrade: calc.letter,
      remarks,
      isPublished: false, // Default to draft for moderation
      term: 'Term 1',
      academicYear: '2025/2026',
      enteredBy: currentUser.fullName,
      enteredAt: new Date().toISOString()
    });

    reloadData();
    setShowEntryModal(false);
  };

  const handleTogglePublish = (gradeId: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    K9DataStore.togglePublishGrade(gradeId, !currentStatus, {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role
    });
    reloadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Results, Continuous Assessment & WAEC / TVET Grading
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous Assessment (30%) + Examination (70%) = 100% total grading standard.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowEntryModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Enter Subject Marks
          </button>
        )}
      </div>

      {/* Role explanation banner */}
      {(currentUser.role === 'student' || currentUser.role === 'parent') && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
          <Award className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Official Terminal Transcript: </span>
            Displaying only approved and published results for your student profile. Draft or unmoderated marks remain confidential under institution policy.
          </div>
        </div>
      )}

      {/* Grades Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject & Code</th>
                <th className="py-3 px-4 text-center">CA (30)</th>
                <th className="py-3 px-4 text-center">Exam (70)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4">Status</th>
                {isAdmin && <th className="py-3 px-4 text-right">Moderation</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-8 text-center text-slate-400">
                    No grade records currently available for this view.
                  </td>
                </tr>
              ) : (
                grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{grade.studentName}</div>
                      <span className="font-mono text-xs text-slate-400">{grade.studentNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{grade.subjectName}</div>
                      <span className="font-mono text-xs text-slate-400">{grade.subjectCode}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium tabular-nums text-slate-700">
                      {grade.continuousAssessment}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium tabular-nums text-slate-700">
                      {grade.finalExam}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-slate-900">
                      {grade.totalScore}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-bold font-mono text-xs ${
                        grade.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        grade.letterGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        grade.letterGrade === 'C' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {grade.letterGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {grade.remarks}
                    </td>
                    <td className="py-3 px-4">
                      {grade.isPublished ? (
                        <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Published
                        </span>
                      ) : (
                        <span className="text-xs text-amber-700 font-medium inline-flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-amber-600" /> Draft (Private)
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleTogglePublish(grade.id, grade.isPublished)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                            grade.isPublished
                              ? 'text-slate-600 hover:text-slate-900 border-slate-200 bg-white'
                              : 'text-white bg-emerald-700 hover:bg-emerald-800 border-emerald-700'
                          }`}
                        >
                          {grade.isPublished ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          {grade.isPublished ? 'Unpublish' : 'Publish Result'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Enter Subject Assessment Marks
              </h3>
              <button
                onClick={() => setShowEntryModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentNumber} - {s.currentClassOrCourse})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subject & Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. PHY-201"
                    className="p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Physics"
                    className="p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Continuous Assessment (Max 30)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    required
                    value={caScore}
                    onChange={(e) => setCaScore(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Final Examination (Max 70)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    step="0.5"
                    required
                    value={examScore}
                    onChange={(e) => setExamScore(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Calculated Preview Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Calculated Total</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {liveGrade.total} / 100
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Assigned Grade</span>
                  <span className="text-sm font-bold text-emerald-800 font-mono">
                    Grade {liveGrade.letter} ({liveGrade.description})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Teacher Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
