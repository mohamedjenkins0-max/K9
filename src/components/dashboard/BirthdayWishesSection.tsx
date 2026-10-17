import React, { useState } from 'react';
import { Cake, Calendar, Printer, Sparkles, Heart, Shield, Check } from 'lucide-react';
import { InstitutionId, Student, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface BirthdayWishesSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const BirthdayWishesSection: React.FC<BirthdayWishesSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const students = K9DataStore.getStudents(institutionId);
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [cardTheme, setCardTheme] = useState<'emerald' | 'cobalt' | 'gold'>('emerald');
  const [customWish, setCustomWish] = useState(
    'On behalf of the Management Board, teachers, and your fellow students, we celebrate your birthday! May your pursuit of academic distinction and integrity continue to inspire our institution.'
  );

  // Month-Day formatter without revealing birth year
  const formatBirthDay = (dobString: string): string => {
    try {
      const parts = dobString.split('-');
      if (parts.length === 3) {
        const monthNum = parseInt(parts[1], 10) - 1;
        const dayNum = parseInt(parts[2], 10);
        const dateObj = new Date(2000, monthNum, dayNum);
        return dateObj.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });
      }
      return 'Date on record';
    } catch {
      return 'Upcoming Birthday';
    }
  };

  const isStaffOrAdmin = ['super_admin', 'institution_admin', 'teacher'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Birthday Calendar & Celebratory Greetings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepare official commemorative cards for upcoming student birthdays while protecting privacy under school policy.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Student Birth Year Masked for Privacy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Birthdays List & Card Customizer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cake className="w-4 h-4 text-emerald-700" /> Upcoming Birthdays
            </h3>
            <p className="text-xs text-slate-500">
              Select a student to generate their official institutional birthday card:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {students.map((stu) => {
                const isSelected = selectedStudent?.id === stu.id;
                return (
                  <button
                    key={stu.id}
                    onClick={() => setSelectedStudent(stu)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{stu.fullName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{stu.currentClassOrCourse}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-800 font-mono">
                        {formatBirthDay(stu.dateOfBirth)}
                      </span>
                      <span className="text-slate-400 block text-xs">Annual Birthday</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Greeting Customizer (Staff only) */}
          {isStaffOrAdmin && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Card Styling & Message</h3>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Theme Palette</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCardTheme('emerald')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      cardTheme === 'emerald' ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Emerald & Gold
                  </button>
                  <button
                    onClick={() => setCardTheme('cobalt')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      cardTheme === 'cobalt' ? 'bg-blue-800 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Royal Blue
                  </button>
                  <button
                    onClick={() => setCardTheme('gold')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      cardTheme === 'gold' ? 'bg-amber-600 text-white border-amber-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Festive Gold
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Birthday Wish Text</label>
                <textarea
                  rows={3}
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print / Share Birthday Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Printable Card Preview */}
        <div className="lg:col-span-7">
          <div className="bg-slate-100 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Institutional Greeting Card
              </span>
              <span className="text-xs text-slate-400 font-mono">300 DPI Ready</span>
            </div>

            {/* Birthday Card Container */}
            <div 
              className={`rounded-2xl p-8 sm:p-10 shadow-lg text-center relative overflow-hidden transition-all ${
                cardTheme === 'emerald'
                  ? 'bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white'
                  : cardTheme === 'cobalt'
                  ? 'bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white'
                  : 'bg-linear-to-br from-amber-800 via-amber-700 to-yellow-800 text-white'
              }`}
            >
              {/* Decorative Subtle Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 space-y-5">
                <div className="w-20 h-20 mx-auto rounded-xl bg-white p-1.5 shadow-md">
                  <img
                    src="/src/assets/images/k9_century_crest_1792269350846.jpg"
                    alt="K9 Century Crest"
                    className="w-full h-full object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">
                    {institutionId === 'k9_school' ? 'K9 Century School' : 'K9 Century Vocational Institute'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                    Happy Birthday!
                  </h2>
                </div>

                <div className="py-2">
                  <div className="inline-block px-5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <span className="text-xl sm:text-2xl font-bold tracking-wide text-white block">
                      {selectedStudent?.fullName}
                    </span>
                    <span className="text-xs text-emerald-100 font-mono mt-0.5 block">
                      {selectedStudent?.currentClassOrCourse} · Celebrated on {formatBirthDay(selectedStudent?.dateOfBirth || '')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-100 max-w-md mx-auto leading-relaxed italic opacity-95">
                  "{customWish}"
                </p>

                <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                  <div className="text-left">
                    <span className="font-semibold block">Office of the Principal</span>
                    <span className="opacity-75">Freetown, Sierra Leone</span>
                  </div>
                  <div className="text-right font-mono text-emerald-200 font-bold">
                    K9 CENTURY PRIDE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
