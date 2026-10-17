import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Upload, AlertCircle, Copy, Check, FileText } from 'lucide-react';
import { InstitutionId, AdmissionApplication } from '../types/database';
import { K9DataStore } from '../lib/supabase';

interface AdmissionFormProps {
  initialInstitution?: InstitutionId;
  onBack: () => void;
  onTrackApplication: (appNumber: string) => void;
}

const SCHOOL_COURSES = [
  'JSS 1A (Junior Secondary)',
  'JSS 1B (Junior Secondary)',
  'JSS 2 (Junior Secondary)',
  'JSS 3 (Junior Secondary & BECE Exam Prep)',
  'SSS 1 Science Division',
  'SSS 1 Commercial Division',
  'SSS 1 Arts & Humanities',
  'SSS 2 Science Division (Physics, Chem, Bio)',
  'SSS 2 Commercial & Arts Division',
  'SSS 3 Science (WASSCE Examination Class)',
  'SSS 3 Commercial & Arts (WASSCE Examination Class)'
];

const VOCATIONAL_COURSES = [
  'NVQ Level 2 Electrical & Solar Engineering',
  'NVQ Level 2 Automotive Diagnostics & Mechatronics',
  'NVQ Level 1 Information Tech & Network Support',
  'NVQ Level 2 Catering & Hospitality Management',
  'NVQ Level 1 Fashion Design & Garment Construction',
  'NVQ Level 2 Civil & Building Construction'
];

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  initialInstitution = 'k9_school',
  onBack,
  onTrackApplication
}) => {
  const [institutionId, setInstitutionId] = useState<InstitutionId>(initialInstitution);
  
  // Form fields
  const [applicantFullName, setApplicantFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [parentGuardianName, setParentGuardianName] = useState('');
  const [parentGuardianPhone, setParentGuardianPhone] = useState('');
  const [address, setAddress] = useState('');
  const [appliedClassOrCourse, setAppliedClassOrCourse] = useState(
    initialInstitution === 'k9_school' ? SCHOOL_COURSES[0] : VOCATIONAL_COURSES[0]
  );
  const [previousSchool, setPreviousSchool] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Parent');

  // Supporting documents
  const [documents, setDocuments] = useState<{ id: string; name: string; type: string; url: string; verified: boolean }[]>([
    { id: 'doc-cert', name: 'NPSE_or_BECE_or_WASSCE_Result_Slip.pdf', type: 'application/pdf', url: '#', verified: false },
    { id: 'doc-birth', name: 'Birth_Certificate_or_National_ID.jpg', type: 'image/jpeg', url: '#', verified: false }
  ]);
  const [newDocName, setNewDocName] = useState('');

  // Honeypot field for bot spam detection
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<AdmissionApplication | null>(null);
  const [copied, setCopied] = useState(false);

  // When institution switches, update default course
  const handleInstitutionChange = (newInst: InstitutionId) => {
    setInstitutionId(newInst);
    setAppliedClassOrCourse(newInst === 'k9_school' ? SCHOOL_COURSES[0] : VOCATIONAL_COURSES[0]);
  };

  const handleAddCustomDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => [
        ...prev,
        {
          id: 'doc-' + Date.now(),
          name: file.name,
          type: file.type || 'application/octet-stream',
          url: URL.createObjectURL(file),
          verified: false
        }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Anti-spam honeypot verification
    if (honeypot.trim().length > 0) {
      console.warn('Spam submission detected and blocked by honeypot.');
      return;
    }

    // Validation
    if (!applicantFullName.trim() || !dateOfBirth || !parentGuardianName.trim() || !parentGuardianPhone.trim() || !address.trim()) {
      setError('Please fill in all mandatory fields (Name, Date of Birth, Guardian details, and Residential Address).');
      return;
    }

    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setError('Please provide an emergency contact name and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newApp = K9DataStore.submitAdmission({
        institutionId,
        applicantFullName: applicantFullName.trim(),
        dateOfBirth,
        gender,
        parentGuardianName: parentGuardianName.trim(),
        parentGuardianPhone: parentGuardianPhone.trim(),
        address: address.trim(),
        appliedClassOrCourse,
        previousSchool: previousSchool.trim() || undefined,
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        emergencyRelationship,
        documents
      });

      setSubmittedApplication(newApp);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submittedApplication) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Application Received</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Admission Registration Successful</h2>
            <p className="text-sm text-slate-600 mt-2">
              Your application has been received and queued in <strong>Pending Approval</strong> status for administrative review.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Application Reference Number:</span>
              <button
                onClick={() => copyToClipboard(submittedApplication.applicationNumber)}
                className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-mono font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Key'}
              </button>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono tracking-wide bg-white px-3 py-2 rounded-lg border border-slate-200 text-center">
              {submittedApplication.applicationNumber}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600 border-t border-slate-200">
              <div>
                <span className="text-slate-400">Applicant:</span> {submittedApplication.applicantFullName}
              </div>
              <div>
                <span className="text-slate-400">Institution:</span> {submittedApplication.institutionId === 'k9_school' ? 'K9 Century School' : 'K9 Vocational'}
              </div>
              <div>
                <span className="text-slate-400">Applied Class:</span> {submittedApplication.appliedClassOrCourse}
              </div>
              <div>
                <span className="text-slate-400">Guardian Phone:</span> {submittedApplication.parentGuardianPhone}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-left">
            <p className="font-semibold text-emerald-900 mb-1">What happens next?</p>
            <ol className="list-decimal list-inside space-y-1 text-emerald-800">
              <li>The Admissions Committee will examine your uploaded academic certificates.</li>
              <li>You can check your status at any time using your application number.</li>
              <li>Once approved, you will receive an official Student Number and enrolment package.</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onTrackApplication(submittedApplication.applicationNumber)}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              Track Status Now
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const courseList = institutionId === 'k9_school' ? SCHOOL_COURSES : VOCATIONAL_COURSES;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Admission & Registration Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Complete the official enrollment form for K9 Century School or K9 Century Vocational Institute in Sierra Leone.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Hidden Honeypot Field for anti-bot spam defense */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="website_url">Do not fill this field</label>
          <input
            id="website_url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <span className="font-semibold">Validation Issue: </span>
              {error}
            </div>
          </div>
        )}

        {/* SECTION 1: Target Institution Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Select Applying Institution <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleInstitutionChange('k9_school')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                institutionId === 'k9_school'
                  ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm">K9 Century School</div>
              <p className="text-xs text-slate-500 mt-1">
                Primary, Junior & Senior Secondary (JSS 1 - SSS 3) · Arts, Science, Commercial
              </p>
              <div className="text-xs text-emerald-800 font-semibold mt-2">14 Wilkinson Road, Freetown</div>
            </button>

            <button
              type="button"
              onClick={() => handleInstitutionChange('k9_vocational')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                institutionId === 'k9_vocational'
                  ? 'border-blue-700 bg-blue-50/50 ring-1 ring-blue-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm">K9 Century Vocational Institute</div>
              <p className="text-xs text-slate-500 mt-1">
                TVET National Vocational Qualifications (NVQ) · Solar, Automotive, IT, Trades
              </p>
              <div className="text-xs text-blue-800 font-semibold mt-2">88 Bai Bureh Road, Kissy</div>
            </button>
          </div>
        </div>

        {/* SECTION 2: Applicant Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. Applicant Personal Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Applicant's Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={applicantFullName}
                onChange={(e) => setApplicantFullName(e.target.value)}
                placeholder="e.g., Mariama Patricia Sesay"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Applied Class or Course <span className="text-red-500">*</span>
              </label>
              <select
                value={appliedClassOrCourse}
                onChange={(e) => setAppliedClassOrCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white font-medium"
              >
                {courseList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Previous School / Institution Attended (if applicable)
              </label>
              <input
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                placeholder="e.g., St. Edward's Secondary School, Freetown"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Parent / Guardian & Residence */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            3. Parent / Guardian & Residence Information
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Parent / Guardian Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={parentGuardianName}
                onChange={(e) => setParentGuardianName(e.target.value)}
                placeholder="e.g., Alhaji Mohamed Sesay"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Parent / Guardian Phone (+232 Sierra Leone) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={parentGuardianPhone}
                onChange={(e) => setParentGuardianPhone(e.target.value)}
                placeholder="+232 76 123 456"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Residential Street Address (Freetown / Western Area) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 24 Wilkinson Road, Lumley, Freetown"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Emergency Contact */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            4. Emergency Contact
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g., Haja Fatu Kamara"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+232 78 998 877"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                placeholder="e.g., Aunt / Father"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Supporting Documents */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Required Supporting Documents (Protected Storage)
            </label>
            <span className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</span>
          </div>

          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium">{doc.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Ready to upload</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Attach Additional Certificate
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleAddCustomDoc}
              />
            </label>
          </div>
        </div>

        {/* Submission CTA */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            By submitting, you certify that all entered particulars are accurate and authentic under Sierra Leone educational standards.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Registering Application...' : 'Submit Admission Application'}
          </button>
        </div>
      </form>
    </div>
  );
};
