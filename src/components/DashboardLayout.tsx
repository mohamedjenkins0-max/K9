import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Award, 
  FileText, 
  Bell, 
  Cake, 
  Building, 
  BarChart3, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight,
  LogOut,
  Building2,
  Lock
} from 'lucide-react';
import { InstitutionId, UserProfile } from '../types/database';
import { OverviewSection } from './dashboard/OverviewSection';
import { AdmissionsSection } from './dashboard/AdmissionsSection';
import { StudentsSection } from './dashboard/StudentsSection';
import { StaffSection } from './dashboard/StaffSection';
import { ClassesSubjectsSection } from './dashboard/ClassesSubjectsSection';
import { AttendanceSection } from './dashboard/AttendanceSection';
import { ResultsGradingSection } from './dashboard/ResultsGradingSection';
import { LearningMaterialsSection } from './dashboard/LearningMaterialsSection';
import { AnnouncementsSection } from './dashboard/AnnouncementsSection';
import { BirthdayWishesSection } from './dashboard/BirthdayWishesSection';
import { SchoolInfoSection } from './dashboard/SchoolInfoSection';
import { ReportsSection } from './dashboard/ReportsSection';
import { SecurityAuditSection } from './dashboard/SecurityAuditSection';
import { K9DataStore } from '../lib/supabase';

interface DashboardLayoutProps {
  currentUser: UserProfile;
  institutionId: InstitutionId;
  onSelectInstitution: (id: InstitutionId) => void;
  onLogout: () => void;
  onBackToPublic: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  institutionId,
  onSelectInstitution,
  onLogout,
  onBackToPublic
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const institutions = K9DataStore.getInstitutions();
  const currentInst = institutions.find(i => i.id === institutionId) || institutions[0];

  const admissions = K9DataStore.getAdmissions(institutionId);
  const pendingCount = admissions.filter(a => a.status === 'pending').length;

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = ['super_admin', 'institution_admin'].includes(currentUser.role);
  const isTeacher = currentUser.role === 'teacher';
  const isStudent = currentUser.role === 'student';
  const isParent = currentUser.role === 'parent';

  // Navigation Items according to security scope
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, visible: true },
    { 
      id: 'admissions', 
      label: 'Admissions & Enrolment', 
      icon: UserPlus, 
      visible: isAdmin, 
      badge: pendingCount > 0 ? pendingCount : undefined 
    },
    { id: 'students', label: 'Students Register', icon: Users, visible: isAdmin || isTeacher },
    { id: 'staff', label: 'Staff & Faculty', icon: GraduationCap, visible: isAdmin || isTeacher },
    { id: 'classes', label: isStudent ? 'My Subjects' : 'Classes & Subjects', icon: BookOpen, visible: true },
    { id: 'attendance', label: isStudent || isParent ? 'My Attendance' : 'Attendance Register', icon: CalendarCheck, visible: true },
    { id: 'grades', label: isStudent || isParent ? 'Terminal Report Card' : 'Results & Grading', icon: Award, visible: true },
    { id: 'materials', label: 'Learning Materials', icon: FileText, visible: true },
    { id: 'announcements', label: 'Announcements', icon: Bell, visible: true },
    { id: 'birthdays', label: 'Birthday Calendar', icon: Cake, visible: isAdmin || isTeacher },
    { id: 'schoolinfo', label: 'Campus Profile', icon: Building, visible: true },
    { id: 'reports', label: 'Institutional Reports', icon: BarChart3, visible: isAdmin },
    { id: 'security', label: 'Security & RLS Console', icon: ShieldCheck, visible: isAdmin }
  ].filter(item => item.visible);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/images/k9_century_crest_1792269350846.jpg"
            alt="K9 Logo"
            className="w-7 h-7 rounded object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-slate-900 text-sm">{currentInst.shortName}</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo & Institution Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/k9_century_crest_1792269350846.jpg"
                alt="K9 Logo"
                className="w-9 h-9 rounded object-cover border border-emerald-500/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 block tracking-wider">
                  K9 Century Portal
                </span>
                <span className="text-sm font-bold text-white block">
                  {currentInst.shortName}
                </span>
              </div>
            </div>

            {/* Institution Switcher (Super Admin Only) */}
            {isSuperAdmin ? (
              <div className="pt-2">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Active Institution (Tenant)</label>
                <select
                  value={institutionId}
                  onChange={(e) => onSelectInstitution(e.target.value as InstitutionId)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value="k9_school">K9 Century School</option>
                  <option value="k9_vocational">K9 Vocational Institute</option>
                </select>
              </div>
            ) : (
              <div className="pt-1">
                <span className="text-xs text-slate-400 block font-mono">
                  Tenant: {currentInst.name}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-900">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
              <div className="text-xs text-slate-400 capitalize truncate">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={onBackToPublic}
              className="flex-1 py-1.5 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors text-left"
            >
              Public Home
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* Context Breadcrumb Topbar */}
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{currentInst.shortName}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold capitalize">
              {navItems.find(n => n.id === activeSection)?.label || 'Console'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 capitalize font-mono">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Dynamic Section Renderer */}
        {activeSection === 'overview' && (
          <OverviewSection
            institutionId={institutionId}
            currentUser={currentUser}
            onNavigateSection={setActiveSection}
          />
        )}

        {activeSection === 'admissions' && (
          <AdmissionsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'students' && (
          <StudentsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'staff' && (
          <StaffSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'classes' && (
          <ClassesSubjectsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'attendance' && (
          <AttendanceSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'grades' && (
          <ResultsGradingSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'materials' && (
          <LearningMaterialsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'announcements' && (
          <AnnouncementsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'birthdays' && (
          <BirthdayWishesSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'schoolinfo' && (
          <SchoolInfoSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'reports' && (
          <ReportsSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'security' && (
          <SecurityAuditSection
            institutionId={institutionId}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
};
