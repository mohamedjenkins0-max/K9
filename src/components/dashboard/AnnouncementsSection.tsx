import React, { useState } from 'react';
import { Bell, Plus, Pin, AlertCircle, Calendar } from 'lucide-react';
import { InstitutionId, SchoolAnnouncement, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface AnnouncementsSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() =>
    K9DataStore.getAnnouncements(institutionId)
  );

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [targetAudience, setTargetAudience] = useState<'all' | 'staff' | 'parents' | 'students'>('all');
  const [isPinned, setIsPinned] = useState(false);

  const canPublish = ['super_admin', 'institution_admin'].includes(currentUser.role);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    K9DataStore.addAnnouncement({
      institutionId,
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      publishedBy: currentUser.fullName,
      isPinned
    });

    setAnnouncements(K9DataStore.getAnnouncements(institutionId));
    setShowModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Notices & Community Bulletins
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official broadcasts for staff, parents, candidates, and apprentices.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Post Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((anc) => (
          <div key={anc.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 hover:shadow-2xs transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {anc.isPinned && (
                    <span className="text-xs text-emerald-800 font-semibold inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  {anc.priority === 'urgent' && (
                    <span className="text-xs text-red-800 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Urgent Notice
                    </span>
                  )}
                  {anc.priority === 'important' && (
                    <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Important
                    </span>
                  )}
                  <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Audience: <strong className="text-slate-600 capitalize">{anc.targetAudience}</strong></span>
                  <span>·</span>
                  <span>Published: <strong className="text-slate-600 font-mono">{anc.publishDate}</strong></span>
                  <span>·</span>
                  <span>By: <strong className="text-slate-600">{anc.publishedBy}</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {anc.content}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Broadcast Official Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Parent-Teacher Consultation Day"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="all">Entire Community (All)</option>
                    <option value="parents">Parents & Guardians Only</option>
                    <option value="students">Enrolled Students Only</option>
                    <option value="staff">Faculty & Staff Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Announcement Text</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Official notice details..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <label htmlFor="pinNotice" className="text-xs text-slate-700">Pin announcement to top of portal</label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
