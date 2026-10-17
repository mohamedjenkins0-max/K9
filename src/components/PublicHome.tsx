import React from 'react';
import { ArrowRight, GraduationCap, Wrench, ShieldCheck, CheckCircle2, MapPin, Phone, Mail, Award, Users, BookOpen } from 'lucide-react';
import { InstitutionId } from '../types/database';

interface PublicHomeProps {
  onApply: (inst?: InstitutionId) => void;
  onTrack: () => void;
  onLogin: () => void;
  onExploreCampus: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onApply,
  onTrack,
  onLogin,
  onExploreCampus
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Editorial Announcement Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2.5 px-4 text-center border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="font-semibold text-white">2025/2026 Academic Admissions Now Open</span>
          <span aria-hidden="true" className="opacity-50">·</span>
          <span>K9 Century School & K9 Century Vocational Institute</span>
          <span aria-hidden="true" className="opacity-50">·</span>
          <button 
            onClick={() => onApply()} 
            className="text-white underline hover:text-emerald-200 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            Submit Application Online <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-linear-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <span>Sierra Leone Ministry of Education Accredited</span>
                <span aria-hidden="true">·</span>
                <span>Freetown Campus</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
                Cultivating Academic Distinction & Practical Industrial Mastery
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                The K9 Century Education Management System delivers integrated governance for both 
                <strong className="text-slate-900 font-semibold"> K9 Century School</strong> and the 
                <strong className="text-slate-900 font-semibold"> K9 Century Vocational Institute</strong>. 
                From rigorous WASSCE secondary curricula to certified national vocational trades, we empower Sierra Leone's future leaders.
              </p>

              {/* Unboxed Metadata row */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 flex-wrap">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-700" /> Freetown (Wilkinson Rd & Kissy)</span>
                <span aria-hidden="true">·</span>
                <span>Currency: Leone (SLE)</span>
                <span aria-hidden="true">·</span>
                <span>Timezone: GMT (Africa/Freetown)</span>
                <span aria-hidden="true">·</span>
                <span>Term 1 in Session</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={() => onApply()}
                  className="px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  Apply for Admission <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onTrack}
                  className="px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors text-center cursor-pointer"
                >
                  Track Existing Application
                </button>
                <button
                  onClick={onLogin}
                  className="px-5 py-3 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors text-center cursor-pointer"
                >
                  Portal Sign In
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                <img
                  src="/src/assets/images/k9_school_campus_1792269351930.jpg"
                  alt="Students at K9 Century School Campus"
                  className="w-full h-72 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-white border-t border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Two Distinct Institutions, One Standard</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Encrypted database separation protecting student records, grades, and admissions.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Phase 1 Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Institutions Presentation */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Two Dedicated Institutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Each institution maintains independent student registries, teachers, grading policies, and admissions criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: K9 Century School */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">General Education Stream</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">K9 Century School</h3>
                <p className="text-xs text-slate-500 mt-1">14 Wilkinson Road, Freetown · Principal: Dr. Aminata Bangura</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Comprehensive primary and secondary education delivering the West African curriculum (NPSE, BECE, and WASSCE). 
                Offering specialized academic streams in Sciences, Commercial & Arts.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Available Levels & Tracks</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Junior Secondary School (JSS 1, 2, 3)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Senior Secondary Science Stream (Physics, Chemistry, Biology)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Senior Secondary Commercial Stream (Accounting, Economics)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Continuous Assessment & National Examination Preparation</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onApply('k9_school')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Apply to School <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500">Intake: Sept / Jan</span>
            </div>
          </div>

          {/* Card 2: K9 Century Vocational Institute */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Technical & Vocational Division</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">K9 Century Vocational Institute</h3>
                <p className="text-xs text-slate-500 mt-1">88 Bai Bureh Road, Kissy, Freetown · Director: Ing. Mohamed S. Kamara</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hands-on technical and vocational training (TVET) accredited for National Vocational Qualifications (NVQ Levels 1–3). 
                Equipping youth and technicians with high-demand trade skills and commercial apprenticeships.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Trade Certifications</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Solar PV Systems & Domestic / Industrial Electrical Wiring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Automotive Diagnostics, Engine Management & Mechatronics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Computer Hardware, Fibre Optics & Network Infrastructure</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Catering, Fashion Construction & Civil Carpentry</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onApply('k9_vocational')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Apply to Vocational <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500">Day & Evening Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vocational Lab Spotlight */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <img
                src="/src/assets/images/k9_vocational_workshop_1792269351436.jpg"
                alt="Vocational Workshop at K9 Century Institute"
                className="w-full h-72 sm:h-80 object-cover rounded-xl shadow-md border border-slate-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Industrial Training Facilities</span>
              <h3 className="text-2xl font-bold text-slate-900">Practical Workshops Fitted for National Development</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our workshops in Kissy are equipped with industry-standard test rigs, photovoltaic panels, 
                diagnostic computers, and mechanical tooling. Students graduate with real project hours, verified safety certifications, 
                and direct employment pipelines into Sierra Leone's energy and infrastructure sectors.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">94%</div>
                  <div className="text-xs text-slate-500">Internship Placement</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">100%</div>
                  <div className="text-xs text-slate-500">Practical Assessment</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">NVQ 1-3</div>
                  <div className="text-xs text-slate-500">Accredited Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & System Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Enterprise Cloud Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built with strict PostgreSQL Row-Level Security (RLS) and institutional isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Database-Level Tenant Isolation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              K9 Century School and K9 Century Vocational Institute data are partitioned at the database schema level. 
              Users cannot access cross-institution records even if authorized in one.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Private Continuous Grading</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teachers enter Continuous Assessment (30%) and Final Exam (70%) marks with automatic grading formulas. 
              Draft marks remain private until officially published by the administration.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Anti-Spam Online Admissions</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Public applicant portal generates tamper-resistant tracking codes. 
              Admins review supporting documents and generate unique student numbers with full audit logging.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/k9_century_crest_1792269350846.jpg"
                  alt="K9 Century Crest"
                  className="w-8 h-8 rounded object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-base font-bold text-white">K9 Century Education Management System</span>
              </div>
              <p className="max-w-md text-slate-400">
                Official unified portal for K9 Century School and K9 Century Vocational Institute in Freetown, Sierra Leone.
                Designed for high security, accessibility, and academic governance.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold text-white uppercase tracking-wider text-xs">K9 Century School</h5>
              <p className="text-slate-400">14 Wilkinson Road, Freetown</p>
              <p className="text-slate-400">+232 76 990 001</p>
              <p className="text-slate-400">info.school@k9century.edu.sl</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold text-white uppercase tracking-wider text-xs">K9 Vocational Institute</h5>
              <p className="text-slate-400">88 Bai Bureh Road, Kissy, Freetown</p>
              <p className="text-slate-400">+232 78 880 002</p>
              <p className="text-slate-400">vocational@k9century.edu.sl</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} K9 Century Education Management System. Republic of Sierra Leone.</p>
            <div className="flex items-center gap-4">
              <span>Timezone: Africa/Freetown</span>
              <span>·</span>
              <span>Currency: SLE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
