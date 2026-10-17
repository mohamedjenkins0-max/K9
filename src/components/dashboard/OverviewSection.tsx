import React from 'react';
import { Users, UserPlus, BookOpen, Award, CheckCircle2, AlertCircle, Clock, Building, ArrowUpRight } from 'lucide-react';
import { InstitutionId, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface OverviewSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
  onNavigateSection: (section: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  institutionId,
  currentUser,
  onNavigateSection
}) => {
  const students = K9DataStore.getStudents(institutionId);
  const staff = K9DataStore.getStaff(institutionId);
  const admissions = K9DataStore.getAdmissions(institutionId);
  const pendingAdmissions = admissions.filter(a => a.status === 'pending');
  const classes = K9DataStore.getClasses(institutionId);
  const grades = K9DataStore.getGrades(institutionId, currentUser.role, currentUser.linkedStudentId);
  const publishedGrades = grades.filter(g => g.isPublished);
  const announcements = K9DataStore.getAnnouncements(institutionId);
  const institutions = K9DataStore.getInstitutions();
  const currentInst = institutions.find(i => i.id === institutionId) || institutions[0];

  const isVocational = institutionId === 'k9_vocational';

  return (
    <div className="space-y-6">
      {/* Editorial Welcome Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>{currentInst.name}</span>
            <span aria-hidden="true">·</span>
            <span>{currentInst.location}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {currentUser.role === 'student' ? `Welcome, ${currentUser.fullName}` : 
             currentUser.role === 'parent' ? `Welcome, Guardian ${currentUser.fullName}` :
             `Academic Governance & Operations Console`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {currentInst.tagline} · Academic Year <span className="font-mono font-medium">{currentInst.academicYear}</span> ({currentInst.term}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Currency</span>
            <span className="text-xs font-mono font-bold text-slate-700">Leone (SLE)</span>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Timezone</span>
            <span className="text-xs font-mono font-bold text-emerald-700">Africa/Freetown (GMT)</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {students.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Active registrations</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {isVocational ? 'Trade Courses' : 'Academic Classes'}
            </span>
            <Building className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {classes.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {isVocational ? 'NVQ Level 1-2' : 'JSS & SSS streams'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Admissions</span>
            <UserPlus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {pendingAdmissions.length}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            {pendingAdmissions.length > 0 ? 'Requires board review' : 'All applications reviewed'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Published Results</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
            {publishedGrades.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {grades.length - publishedGrades.length} draft marks in review
          </div>
        </div>
      </div>

      {/* Quick Action Strip & Pending Admissions Callout */}
      {pendingAdmissions.length > 0 && ['super_admin', 'institution_admin'].includes(currentUser.role) && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                {pendingAdmissions.length} New Online Admission Application{pendingAdmissions.length > 1 ? 's' : ''} Awaiting Review
              </span>
              <span className="text-xs text-amber-800">
                Applicants have submitted supporting academic certificates and are awaiting enrolment approval.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateSection('admissions')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Review Admissions
          </button>
        </div>
      )}

      {/* Main Grid: Announcements & Class Rosters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Notices */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Official Institutional Notices</h3>
            <button
              onClick={() => onNavigateSection('announcements')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((notice) => (
              <div key={notice.id} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-900 line-clamp-1">{notice.title}</span>
                  <span className="text-xs text-slate-400 font-mono shrink-0">{notice.publishDate}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Target: {notice.targetAudience}</span>
                  <span>·</span>
                  <span>By: {notice.publishedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Classes Roster & Faculty */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              {isVocational ? 'Active Workshops & Trades' : 'Active Classes & Form Masters'}
            </h3>
            <button
              onClick={() => onNavigateSection('classes')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {classes.map((cls) => (
              <div key={cls.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-900">{cls.className}</div>
                  <div className="text-xs text-slate-500">{cls.classTeacherName}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                    {cls.enrolledCount}/{cls.capacity}
                  </span>
                  <span className="text-xs text-slate-400 block">Enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
