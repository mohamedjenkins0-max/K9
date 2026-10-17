import React, { useState } from 'react';
import { BookOpen, Users, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { InstitutionId, ClassSubject, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface ClassesSubjectsSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const ClassesSubjectsSection: React.FC<ClassesSubjectsSectionProps> = ({
  institutionId
}) => {
  const [classes] = useState<ClassSubject[]>(() => K9DataStore.getClasses(institutionId));
  const [expandedClassId, setExpandedClassId] = useState<string | null>(classes[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedClassId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Classes, Curricula & Subject Allocation
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic syllabus streams, form masters, and subject teacher assignments.
        </p>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => {
          const isExpanded = expandedClassId === cls.id;
          const fillPercentage = Math.round((cls.enrolledCount / cls.capacity) * 100);

          return (
            <div key={cls.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div 
                onClick={() => toggleExpand(cls.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{cls.className}</h3>
                    {cls.stream && (
                      <span className="text-xs text-slate-500 font-medium">({cls.stream})</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Form Master / Lead Instructor: <strong className="text-slate-800">{cls.classTeacherName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                        {cls.enrolledCount} / {cls.capacity}
                      </span>
                      <span className="text-xs text-slate-400">({fillPercentage}%)</span>
                    </div>
                    <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full ${fillPercentage > 90 ? 'bg-amber-500' : 'bg-emerald-600'}`} 
                        style={{ width: `${Math.min(100, fillPercentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expandable Subjects Table */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Allocated Subjects & Faculty Lecturers ({cls.subjects.length} Subjects)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cls.subjects.map((sub) => (
                      <div key={sub.id} className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800">{sub.code}</span>
                            <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                          </div>
                          <div className="text-xs text-slate-500">Instructor: {sub.teacherName}</div>
                        </div>

                        <span className="text-xs font-mono text-slate-400 shrink-0">
                          {sub.creditHours} hrs/wk
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
