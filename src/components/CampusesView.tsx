import React from 'react';
import { ArrowLeft, GraduationCap, Wrench, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { InstitutionId } from '../types/database';

interface CampusesViewProps {
  onBack: () => void;
  onApply: (inst: InstitutionId) => void;
}

export const CampusesView: React.FC<CampusesViewProps> = ({
  onBack,
  onApply
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Our Campuses & Academic Institutions
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Learn about the independent programs, facilities, and accreditations of K9 Century School and K9 Century Vocational Institute in Sierra Leone.
        </p>
      </div>

      {/* Campus 1: K9 Century School */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 h-72 lg:h-auto relative">
            <img
              src="/src/assets/images/k9_school_campus_1792269351930.jpg"
              alt="K9 Century School Campus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  General Education Division
                </span>
                <span className="text-xs text-slate-400 font-mono">Founded 2012</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900">K9 Century School</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated to academic rigor, character cultivation, and preparatory excellence for the National Primary School Examination (NPSE), Basic Education Certificate Examination (BECE), and the West African Senior School Certificate Examination (WASSCE).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>14 Wilkinson Road, Freetown, Sierra Leone</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>+232 76 990 001</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Principal: Dr. Aminata Bangura (PhD, EdM)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>admissions@k9century.edu.sl</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Curriculum Tracks</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Junior Secondary (JSS 1-3)</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SSS Science Division</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SSS Commercial Division</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SSS Arts Division</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Chemistry & Physics Labs</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Computer Literacy Lab</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Term 1 Admissions Open</span>
              <button
                onClick={() => onApply('k9_school')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Apply to K9 Century School
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campus 2: K9 Century Vocational Institute */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 h-72 lg:h-auto relative">
            <img
              src="/src/assets/images/k9_vocational_workshop_1792269351436.jpg"
              alt="K9 Century Vocational Workshop"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  TVET National Qualifications Division
                </span>
                <span className="text-xs text-slate-400 font-mono">Founded 2018</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900">K9 Century Vocational Institute</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                State-of-the-art technical workshop facilities delivering hands-on apprenticeships and National Vocational Qualifications (NVQ Levels 1 to 3) in renewable energy, automotive diagnostics, digital computing, and industrial crafts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>88 Bai Bureh Road, Kissy, Freetown, Sierra Leone</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>+232 78 880 002</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>Director: Ing. Mohamed S. Kamara (MSc, PE)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>vocational@k9century.edu.sl</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Technical Certifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Solar PV Installation & Storage</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ECU Engine Mechatronics</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Fibre Optics & Networking</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Commercial Catering & Food</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Garment & Fashion Construction</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Building & Masonry Trades</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Day & Evening Schedules</span>
              <button
                onClick={() => onApply('k9_vocational')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Apply to Vocational Institute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
