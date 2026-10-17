import React, { useState } from 'react';
import { Calendar, Check, X, Clock, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { InstitutionId, Student, AttendanceRecord, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface AttendanceSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const classes = K9DataStore.getClasses(institutionId);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.className || '');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [students] = useState<Student[]>(() => K9DataStore.getStudents(institutionId));
  
  // Attendance records map for selected class
  const classStudents = students.filter(s => s.currentClassOrCourse.includes(selectedClass) || selectedClass.includes(s.currentClassOrCourse));
  
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>(() => {
    const existing = K9DataStore.getAttendance(institutionId, selectedDate);
    const state: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    for (const s of classStudents) {
      const match = existing.find(e => e.studentId === s.id);
      state[s.id] = match ? match.status : 'present';
    }
    return state;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
    setSavedSuccess(false);
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const next: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    for (const s of classStudents) {
      next[s.id] = status;
    }
    setAttendanceState(next);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = classStudents.map(s => ({
      id: `att-${s.id}-${selectedDate}`,
      institutionId,
      studentId: s.id,
      studentName: s.fullName,
      studentNumber: s.studentNumber,
      classOrCourse: selectedClass,
      date: selectedDate,
      status: attendanceState[s.id] || 'present',
      recordedBy: currentUser.fullName
    }));

    K9DataStore.recordAttendance(records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const presentCount = Object.values(attendanceState).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceState).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendanceState).filter(s => s === 'late').length;

  const canEdit = ['super_admin', 'institution_admin', 'teacher'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record and audit pupil attendance by class and session date.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" /> Save Attendance Register
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Attendance records updated and synchronized to student ledger.</span>
        </div>
      )}

      {/* Class & Date Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class / Trade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold focus:outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.className}>{c.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Quick bulk action & summary pill */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="font-medium text-emerald-700 font-mono">{presentCount} Present</span>
            <span>·</span>
            <span className="font-medium text-red-700 font-mono">{absentCount} Absent</span>
            <span>·</span>
            <span className="font-medium text-amber-700 font-mono">{lateCount} Late</span>
          </div>

          {canEdit && (
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <button
                onClick={() => handleMarkAll('present')}
                className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
              >
                All Present
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Student ID</th>
              <th className="py-3 px-4">Full Student Name</th>
              <th className="py-3 px-4">Enrolled Class</th>
              <th className="py-3 px-4 text-center">Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No students currently enrolled in {selectedClass}.
                </td>
              </tr>
            ) : (
              classStudents.map((student) => {
                const currentStatus = attendanceState[student.id] || 'present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.studentNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {student.currentClassOrCourse}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
                        <button
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-red-600 text-white font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          disabled={!canEdit}
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            currentStatus === 'excused'
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
