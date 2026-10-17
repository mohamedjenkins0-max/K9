import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, CheckCircle2, XCircle, FileText, Printer } from 'lucide-react';
import { K9DataStore } from '../lib/supabase';
import { AdmissionApplication } from '../types/database';

interface AdmissionStatusTrackerProps {
  initialAppNumber?: string;
  onBack: () => void;
  onApplyNew: () => void;
}

export const AdmissionStatusTracker: React.FC<AdmissionStatusTrackerProps> = ({
  initialAppNumber = '',
  onBack,
  onApplyNew
}) => {
  const [appNumber, setAppNumber] = useState(initialAppNumber);
  const [guardianPhone, setGuardianPhone] = useState('');
  const [searchResult, setSearchResult] = useState<AdmissionApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHasSearched(true);

    const cleanNumber = appNumber.trim().toUpperCase();
    if (!cleanNumber) {
      setError('Please enter a valid Application Reference Number.');
      setSearchResult(null);
      return;
    }

    const allAdmissions = K9DataStore.getAdmissions();
    const match = allAdmissions.find(a => 
      a.applicationNumber.toUpperCase() === cleanNumber || 
      a.id.toLowerCase() === cleanNumber.toLowerCase()
    );

    if (match) {
      setSearchResult(match);
    } else {
      setSearchResult(null);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Admission Application Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Verify the current review status and assigned student number for K9 Century School or Vocational Institute.
        </p>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-8">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Application Reference Number (e.g. APP-2026-SCH-0101)
            </label>
            <input
              type="text"
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              placeholder="APP-2026-SCH-..."
              className="w-full px-3.5 py-2.5 text-xs font-mono uppercase border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Check Status
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
      </form>

      {/* Result Display */}
      {hasSearched && (
        <div>
          {searchResult ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs print:border-none print:shadow-none">
              {/* Header Status Bar */}
              <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Application Number:</span>
                  <div className="text-lg font-bold text-slate-900 font-mono">
                    {searchResult.applicationNumber}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {searchResult.status === 'pending' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" /> Pending Administrative Review
                    </div>
                  )}

                  {searchResult.status === 'approved' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Admission Approved & Enrolled
                    </div>
                  )}

                  {searchResult.status === 'rejected' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                      <XCircle className="w-4 h-4 text-red-600" /> Application Not Accepted
                    </div>
                  )}
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="p-6 space-y-6">
                {searchResult.status === 'approved' && searchResult.assignedStudentNumber && (
                  <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">Official Student Number</span>
                      <div className="text-xl font-extrabold text-emerald-900 font-mono tracking-wider mt-0.5">
                        {searchResult.assignedStudentNumber}
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">
                        Student enrolment has been confirmed. Please present this number at the bursar's office.
                      </p>
                    </div>

                    <button
                      onClick={handlePrintSlip}
                      className="px-3 py-2 text-xs font-medium text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 print:hidden cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print Slip
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Applicant Full Name</span>
                    <span className="font-semibold text-slate-800 text-sm">{searchResult.applicantFullName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Institution</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {searchResult.institutionId === 'k9_school' ? 'K9 Century School' : 'K9 Century Vocational Institute'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Applied Class / Trade</span>
                    <span className="font-semibold text-slate-800">{searchResult.appliedClassOrCourse}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Submission Date</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {new Date(searchResult.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Parent / Guardian</span>
                    <span className="font-semibold text-slate-800">{searchResult.parentGuardianName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Guardian Phone</span>
                    <span className="font-semibold text-slate-800 font-mono">{searchResult.parentGuardianPhone}</span>
                  </div>
                </div>

                {searchResult.reviewNotes && (
                  <div className="pt-4 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">Admissions Board Official Notes:</span>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      "{searchResult.reviewNotes}"
                    </p>
                    {searchResult.reviewedBy && (
                      <span className="text-xs text-slate-400 mt-1 block">
                        Reviewed by {searchResult.reviewedBy} on {new Date(searchResult.reviewedAt || '').toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Application Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No admission record matches the application number <strong>"{appNumber}"</strong>. Please verify the code or submit a fresh application.
              </p>
              <button
                onClick={onApplyNew}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
              >
                Apply Online Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
