import React, { useState } from 'react';
import { Search, Mail, Phone, Award, BookOpen, Building } from 'lucide-react';
import { InstitutionId, Staff, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface StaffSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const StaffSection: React.FC<StaffSectionProps> = ({
  institutionId
}) => {
  const [staffList] = useState<Staff[]>(() => K9DataStore.getStaff(institutionId));
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = staffList.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.assignedSubjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Academic Faculty & Instructional Staff
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Qualified instructors, heads of department, and assigned course mentors.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search staff by name, department, or assigned subject..."
          className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">{staff.staffNumber}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{staff.fullName}</h3>
                <span className="text-xs text-emerald-700 font-semibold">{staff.roleTitle}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                {staff.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{staff.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Subjects: {staff.assignedSubjects.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{staff.qualifications}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {staff.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {staff.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
