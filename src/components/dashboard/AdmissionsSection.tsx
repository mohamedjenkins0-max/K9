import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, FileText, Printer, AlertCircle, ShieldCheck } from 'lucide-react';
import { InstitutionId, AdmissionApplication, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface AdmissionsSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => 
    K9DataStore.getAdmissions(institutionId)
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showLetterModal, setShowLetterModal] = useState(false);

  const reloadData = () => {
    setAdmissions(K9DataStore.getAdmissions(institutionId));
  };

  const filtered = admissions.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.applicantFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appliedClassOrCourse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const canReview = ['super_admin', 'institution_admin'].includes(currentUser.role);

  const handleDecision = (decision: 'approved' | 'rejected') => {
    if (!selectedApplication) return;
    setActionError(null);
    setActionSuccess(null);

    if (decision === 'rejected' && !reviewNotes.trim()) {
      setActionError('A valid justification/reason is required to decline an admission application.');
      return;
    }

    try {
      const result = K9DataStore.reviewAdmission(
        selectedApplication.id,
        decision,
        currentUser.fullName,
        currentUser.role,
        reviewNotes.trim() || (decision === 'approved' ? 'Application meets institutional entrance standards and documentation requirements.' : 'Application declined.')
      );

      setSelectedApplication(result.application);
      reloadData();
      setActionSuccess(
        decision === 'approved' 
          ? `Application approved. Student enrolled with Student Number: ${result.application.assignedStudentNumber}`
          : 'Application declined and reason recorded in audit log.'
      );
      setReviewNotes('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to complete review decision.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Admissions Governance & Enrolment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review online applications, inspect verified certificates, and issue official student enrolment numbers.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({admissions.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-semibold text-amber-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({admissions.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'approved' ? 'bg-white text-slate-900 shadow-2xs font-semibold text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({admissions.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'rejected' ? 'bg-white text-slate-900 shadow-2xs font-semibold text-red-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({admissions.filter(a => a.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by applicant name, application number, or applied class..."
          className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
        />
      </div>

      {/* High-density Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">Applicant Full Name</th>
                <th className="py-3 px-4">Applied Class / Trade</th>
                <th className="py-3 px-4">Guardian & Phone</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No admission applications match your current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {app.applicantFullName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.appliedClassOrCourse}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{app.parentGuardianName}</div>
                      <span className="font-mono text-slate-400">{app.parentGuardianPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      {app.status === 'pending' && (
                        <span className="text-xs text-amber-700 font-medium inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="text-xs text-red-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setActionError(null);
                          setActionSuccess(null);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 hover:border-emerald-300 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Admission Review Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedApplication.applicantFullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium p-1 cursor-pointer"
              >
                Close
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Application Data Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Application Code</span>
                <span className="font-mono font-bold text-slate-800">{selectedApplication.applicationNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-semibold capitalize text-slate-900">{selectedApplication.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Applying For</span>
                <span className="font-semibold text-slate-800">{selectedApplication.appliedClassOrCourse}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date of Birth / Gender</span>
                <span className="font-mono text-slate-800">{selectedApplication.dateOfBirth} ({selectedApplication.gender})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Parent / Guardian</span>
                <span className="text-slate-800 font-medium">{selectedApplication.parentGuardianName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-mono text-slate-800">{selectedApplication.parentGuardianPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Residential Address</span>
                <span className="text-slate-700">{selectedApplication.address}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Emergency Contact</span>
                <span className="text-slate-700">
                  {selectedApplication.emergencyContactName} ({selectedApplication.emergencyRelationship}) · {selectedApplication.emergencyContactPhone}
                </span>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Supporting Certificates & Proofs
              </span>
              <div className="space-y-1.5">
                {selectedApplication.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="font-medium text-slate-800">{doc.name}</span>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Document
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Student Number (if approved) */}
            {selectedApplication.status === 'approved' && selectedApplication.assignedStudentNumber && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Official Enrolment Number
                  </span>
                  <div className="text-lg font-extrabold text-emerald-900 font-mono mt-0.5">
                    {selectedApplication.assignedStudentNumber}
                  </div>
                </div>
                <button
                  onClick={() => setShowLetterModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Admission Letter
                </button>
              </div>
            )}

            {/* Decision Controls (Admins only) */}
            {canReview && selectedApplication.status === 'pending' && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Board Review Determination & Decision Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record justification, entrance exam score, or reason for decision..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleDecision('rejected')}
                    className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Decline Application
                  </button>
                  <button
                    onClick={() => handleDecision('approved')}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Approve & Issue Student Number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admission Letter Print Modal */}
      {showLetterModal && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 print:border-none print:shadow-none">
            <div className="text-center space-y-2 border-b border-slate-200 pb-6">
              <img
                src="/src/assets/images/k9_century_crest_1792269350846.jpg"
                alt="K9 Century Crest"
                className="w-16 h-16 mx-auto rounded object-cover"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                {selectedApplication.institutionId === 'k9_school' ? 'K9 Century School' : 'K9 Century Vocational Institute'}
              </h2>
              <p className="text-xs text-slate-500">
                Ministry of Basic & Senior Secondary Education / TVET Sierra Leone · Freetown
              </p>
              <div className="text-xs font-mono font-bold text-emerald-800 pt-1">
                OFFICIAL LETTER OF PROVISIONAL ADMISSION
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
                <span>Ref: {selectedApplication.applicationNumber}</span>
              </div>

              <p>
                Dear <strong>{selectedApplication.applicantFullName}</strong>,
              </p>

              <p>
                Following the review of your credentials and entrance documentation by the Admissions Committee, 
                we are pleased to offer you provisional admission into <strong>{selectedApplication.appliedClassOrCourse}</strong> for 
                the <strong>2025/2026 Academic Session</strong>.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                <div><strong>Assigned Student ID:</strong> {selectedApplication.assignedStudentNumber}</div>
                <div><strong>Enrolled Program:</strong> {selectedApplication.appliedClassOrCourse}</div>
                <div><strong>Parent/Guardian:</strong> {selectedApplication.parentGuardianName}</div>
                <div><strong>Campus:</strong> {selectedApplication.institutionId === 'k9_school' ? '14 Wilkinson Road, Freetown' : '88 Bai Bureh Road, Kissy'}</div>
              </div>

              <p>
                Please report to the Bursar's Office with this slip to finalize your registration and collect your student identification badge and syllabus schedule.
              </p>

              <div className="pt-6 flex justify-between items-end">
                <div>
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span className="text-xs font-bold text-slate-800 block">Registrar of Admissions</span>
                  <span className="text-xs text-slate-400">K9 Century Education System</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-800 font-bold block">OFFICIALLY ENROLLED</span>
                  <span className="text-xs text-slate-400">Freetown, Sierra Leone</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={() => setShowLetterModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Admission Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
