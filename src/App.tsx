/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { PublicHome } from './components/PublicHome';
import { CampusesView } from './components/CampusesView';
import { AdmissionForm } from './components/AdmissionForm';
import { AdmissionStatusTracker } from './components/AdmissionStatusTracker';
import { LoginModal } from './components/LoginModal';
import { DashboardLayout } from './components/DashboardLayout';
import { InstitutionId, UserProfile } from './types/database';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'institutions' | 'apply' | 'track' | 'dashboard'>('home');
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionId>('k9_school');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [prefilledAppNumber, setPrefilledAppNumber] = useState('');

  const handleApplyClick = (inst?: InstitutionId) => {
    if (inst) setSelectedInstitution(inst);
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackClick = (appNumber?: string) => {
    if (appNumber) setPrefilledAppNumber(appNumber);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.institutionId) {
      setSelectedInstitution(user.institutionId);
    }
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Navigation (Hidden when inside Dashboard to give maximum workspace presence) */}
      {currentView !== 'dashboard' && (
        <Header
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          selectedInstitution={selectedInstitution}
          onSelectInstitution={setSelectedInstitution}
        />
      )}

      {/* Main Content Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <PublicHome
            onApply={handleApplyClick}
            onTrack={() => handleTrackClick()}
            onLogin={() => setIsLoginModalOpen(true)}
            onExploreCampus={() => setCurrentView('institutions')}
          />
        )}

        {currentView === 'institutions' && (
          <CampusesView
            onBack={() => setCurrentView('home')}
            onApply={handleApplyClick}
          />
        )}

        {currentView === 'apply' && (
          <AdmissionForm
            initialInstitution={selectedInstitution}
            onBack={() => setCurrentView('home')}
            onTrackApplication={handleTrackClick}
          />
        )}

        {currentView === 'track' && (
          <AdmissionStatusTracker
            initialAppNumber={prefilledAppNumber}
            onBack={() => setCurrentView('home')}
            onApplyNew={() => handleApplyClick()}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardLayout
            currentUser={currentUser}
            institutionId={selectedInstitution}
            onSelectInstitution={setSelectedInstitution}
            onLogout={handleLogout}
            onBackToPublic={() => setCurrentView('home')}
          />
        )}
      </div>

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
