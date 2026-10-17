import React from 'react';
import { InstitutionId, UserProfile } from '../types/database';

interface HeaderProps {
  currentView: 'home' | 'apply' | 'track' | 'dashboard' | 'institutions';
  onNavigate: (view: 'home' | 'apply' | 'track' | 'dashboard' | 'institutions') => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  selectedInstitution: InstitutionId;
  onSelectInstitution: (id: InstitutionId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenLogin,
  onLogout,
  selectedInstitution,
  onSelectInstitution
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <img
              src="/src/assets/images/k9_century_crest_1792269350846.jpg"
              alt="K9 Century Crest"
              className="w-9 h-9 rounded object-cover shadow-xs border border-emerald-700/20"
              referrerPolicy="no-referrer"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              K9 Century Education
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'home' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('institutions')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'institutions' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Our Campuses
            </button>
            <button
              onClick={() => onNavigate('apply')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'apply' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Online Admission
            </button>
            <button
              onClick={() => onNavigate('track')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'track' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              Check Status
            </button>
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentView === 'dashboard' ? 'text-emerald-700 font-semibold' : ''
                }`}
              >
                Management Dashboard
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.fullName.split(' ')[0]}
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                Portal Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
