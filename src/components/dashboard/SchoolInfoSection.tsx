import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail, Award, Clock, Coins, Globe, Shield } from 'lucide-react';
import { InstitutionId, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface SchoolInfoSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const SchoolInfoSection: React.FC<SchoolInfoSectionProps> = ({
  institutionId
}) => {
  const institutions = K9DataStore.getInstitutions();
  const currentInst = institutions.find(i => i.id === institutionId) || institutions[0];
  const [showKrioGlossary, setShowKrioGlossary] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Institutional Governance & Campus Profile
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Official statutory details, administrative contacts, academic calendar, and localization settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {currentInst.type === 'general_education' ? 'General Academic School' : 'Technical Vocational Institute'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{currentInst.name}</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
            "{currentInst.tagline}"
          </p>

          <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">Campus Location</span>
                <span>{currentInst.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">Telephone Line</span>
                <span className="font-mono">{currentInst.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">Official Inquiries</span>
                <span className="font-mono">{currentInst.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">Principal / Director</span>
                <span>{currentInst.principal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Localization Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Academic Calendar & Localization Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5" /> Timezone
              </div>
              <div className="font-bold text-slate-900 font-mono">Africa/Freetown (GMT)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Coins className="w-3.5 h-3.5" /> Currency Standard
              </div>
              <div className="font-bold text-emerald-800 font-mono">Sierra Leonean Leone (SLE)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Globe className="w-3.5 h-3.5" /> Primary Language
              </div>
              <div className="font-bold text-slate-900">English (Official)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Award className="w-3.5 h-3.5" /> Current Academic Session
              </div>
              <div className="font-bold text-slate-900 font-mono">{currentInst.academicYear} · {currentInst.term}</div>
            </div>
          </div>

          {/* Krio Language Integration Preview */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Future Krio Localization Readiness</span>
              <button
                onClick={() => setShowKrioGlossary(!showKrioGlossary)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
              >
                {showKrioGlossary ? 'Hide Glossary' : 'Inspect Krio Terminology'}
              </button>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              K9 Century Phase 1 includes native language token placeholders for upcoming multilingual parent communication:
            </p>

            {showKrioGlossary && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200 font-mono">
                <div><span className="text-emerald-900 font-bold">Kusheh</span>: Welcome / Greeting</div>
                <div><span className="text-emerald-900 font-bold">Edmasita</span>: School Principal</div>
                <div><span className="text-emerald-900 font-bold">Pikin dem</span>: Enrolled Pupils</div>
                <div><span className="text-emerald-900 font-bold">Skul fee</span>: Tuition Payment</div>
                <div><span className="text-emerald-900 font-bold">Skul report</span>: Term Report Card</div>
                <div><span className="text-emerald-900 font-bold">Wokshop</span>: Vocational Workshop</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
