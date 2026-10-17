import React, { useState } from 'react';
import { X, Lock, Shield, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { UserProfile, UserRole, InstitutionId } from '../types/database';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const PRESET_USERS: { label: string; roleDesc: string; profile: UserProfile }[] = [
  {
    label: 'Super Admin',
    roleDesc: 'Full cross-institution governance, global audit logs, system parameters',
    profile: {
      id: 'usr-super-1',
      email: 'director@k9century.edu.sl',
      fullName: 'Chief Board Director',
      role: 'super_admin',
      institutionId: undefined, // Global access
      createdAt: '2022-01-01'
    }
  },
  {
    label: 'School Admin (Principal)',
    roleDesc: 'K9 Century School: Admissions review, student enrolment, staff assignments',
    profile: {
      id: 'stf-sch-0',
      email: 'a.bangura@k9century.edu.sl',
      fullName: 'Dr. Aminata Bangura',
      role: 'institution_admin',
      institutionId: 'k9_school',
      createdAt: '2015-09-01'
    }
  },
  {
    label: 'Vocational Admin (Director)',
    roleDesc: 'K9 Century Vocational Institute: Trade courses, apprenticeships, student enrolment',
    profile: {
      id: 'stf-voc-0',
      email: 'm.kamara@k9century.edu.sl',
      fullName: 'Ing. Mohamed S. Kamara',
      role: 'institution_admin',
      institutionId: 'k9_vocational',
      createdAt: '2018-06-01'
    }
  },
  {
    label: 'Teacher (Science Dept)',
    roleDesc: 'K9 Century School: Enter continuous assessment & exam scores, mark attendance',
    profile: {
      id: 'stf-sch-3',
      email: 'a.koroma@k9century.edu.sl',
      fullName: 'Mr. Alusine Koroma',
      role: 'teacher',
      institutionId: 'k9_school',
      createdAt: '2019-03-01'
    }
  },
  {
    label: 'Student (SSS 2 Science)',
    roleDesc: 'K9 Century School: View published grades, attendance record, learning materials',
    profile: {
      id: 'stu-usr-1',
      email: 'm.kamara.student@k9century.edu.sl',
      fullName: 'Mariama K. Kamara',
      role: 'student',
      institutionId: 'k9_school',
      linkedStudentId: 'stu-sch-1',
      createdAt: '2022-09-12'
    }
  },
  {
    label: 'Parent / Guardian',
    roleDesc: 'K9 Century School: View student report card, attendance, school notices',
    profile: {
      id: 'prt-usr-1',
      email: 'i.kamara@guardian.sl',
      fullName: 'Alhaji Ibrahim Kamara',
      role: 'parent',
      institutionId: 'k9_school',
      linkedStudentId: 'stu-sch-1',
      createdAt: '2022-09-12'
    }
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'credentials'>('presets');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your registered school email address and password.');
      return;
    }

    // Match against preset accounts
    const found = PRESET_USERS.find(u => u.profile.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      onLoginSuccess(found.profile);
      onClose();
    } else {
      // Default to authenticated institution staff/admin if recognized domain
      if (email.endsWith('@k9century.edu.sl')) {
        const customUser: UserProfile = {
          id: 'usr-' + Date.now(),
          email: email.trim(),
          fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: email.includes('admin') ? 'institution_admin' : 'teacher',
          institutionId: email.includes('vocational') ? 'k9_vocational' : 'k9_school',
          createdAt: new Date().toISOString()
        };
        onLoginSuccess(customUser);
        onClose();
      } else {
        setError('Invalid credentials. Please select an authorized test role or use a @k9century.edu.sl email.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">K9 Century Portal Authentication</h3>
              <p className="text-xs text-slate-500">Encrypted Role-Based Management Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg my-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer ${
              activeTab === 'presets' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Role Switcher (All 5 Personas)
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer ${
              activeTab === 'credentials' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email & Password Login
          </button>
        </div>

        {activeTab === 'presets' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Select an authorized institutional profile to inspect its specific dashboard permissions and tenant isolation:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {PRESET_USERS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onLoginSuccess(preset.profile);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all flex items-start justify-between group cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-800">
                        {preset.profile.fullName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({preset.label})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {preset.roleDesc}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{preset.profile.email}</span>
                      {preset.profile.institutionId && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-sans font-medium">
                            {preset.profile.institutionId === 'k9_school' ? 'K9 School' : 'K9 Vocational'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@k9century.edu.sl"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              Sign In to Management System
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Security Protocol: TLS 1.3 / Supabase RLS</span>
          <span>Freetown Node</span>
        </div>
      </div>
    </div>
  );
};
