import React, { useState } from 'react';
import { Search, UserPlus, Eye, Phone, MapPin, Calendar, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { InstitutionId, Student, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface StudentsSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const StudentsSection: React.FC<StudentsSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const [students, setStudents] = useState<Student[]>(() => K9DataStore.getStudents(institutionId));
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const classes = K9DataStore.getClasses(institutionId);

  const filtered = students.filter(s => {
    const matchesClass = classFilter === 'all' || s.currentClassOrCourse === classFilter;
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.currentClassOrCourse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Register & Enrolment Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified student records, guardian emergency contacts, and active class allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Classes / Courses</option>
            {classes.map(c => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, ID number (e.g. K9-SCH-2025-0012), or course..."
          className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
        />
      </div>

      {/* Students Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Full Legal Name</th>
                <th className="py-3 px-4">Class / Division</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Guardian & Emergency Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No enrolled students match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {student.studentNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {student.currentClassOrCourse}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {student.gender}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{student.parentGuardianName}</div>
                      <span className="font-mono text-slate-400">{student.parentGuardianPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Enrolment
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <span className="text-xs font-mono text-emerald-800 font-semibold">{selectedStudent.studentNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Class / Trade</span>
                <span className="font-semibold text-slate-800">{selectedStudent.currentClassOrCourse}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date of Birth</span>
                <span className="font-mono text-slate-800">{selectedStudent.dateOfBirth} ({selectedStudent.gender})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Enrolment Date</span>
                <span className="font-mono text-slate-800">{selectedStudent.admissionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-semibold text-emerald-700 capitalize">{selectedStudent.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Residential Address</span>
                <span className="text-slate-700">{selectedStudent.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Parent / Guardian</span>
                <span className="font-medium text-slate-800">{selectedStudent.parentGuardianName}</span>
                <span className="block font-mono text-slate-500">{selectedStudent.parentGuardianPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Emergency Contact</span>
                <span className="font-medium text-slate-800">{selectedStudent.emergencyContact}</span>
                <span className="block font-mono text-slate-500">{selectedStudent.emergencyPhone}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Identity record protected under K9 Century Privacy & Row-Level Security Policies.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
