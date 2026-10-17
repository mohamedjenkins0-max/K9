import React, { useState } from 'react';
import { BookOpen, Download, Plus, FileText, Lock, Globe, Search } from 'lucide-react';
import { InstitutionId, LearningMaterial, UserProfile } from '../../types/database';
import { K9DataStore } from '../../lib/supabase';

interface LearningMaterialsSectionProps {
  institutionId: InstitutionId;
  currentUser: UserProfile;
}

export const LearningMaterialsSection: React.FC<LearningMaterialsSectionProps> = ({
  institutionId,
  currentUser
}) => {
  const [materials, setMaterials] = useState<LearningMaterial[]>(() =>
    K9DataStore.getLearningMaterials(institutionId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Syllabus' | 'Lecture Note' | 'Timetable' | 'Assignment' | 'Workshop Manual'>('Lecture Note');
  const [newTargetClass, setNewTargetClass] = useState('All');
  const [isPrivate, setIsPrivate] = useState(true);

  const canUpload = ['super_admin', 'institution_admin', 'teacher'].includes(currentUser.role);

  const filtered = materials.filter(m => {
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.targetClassOrCourse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    K9DataStore.addLearningMaterial({
      institutionId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Official academic resource distributed for enrolled students.',
      category: newCategory,
      targetClassOrCourse: newTargetClass,
      fileUrl: '#download-' + Date.now(),
      fileSize: '3.4 MB',
      fileType: 'PDF Document',
      uploadedBy: currentUser.fullName,
      isPrivate
    });

    setMaterials(K9DataStore.getLearningMaterials(institutionId));
    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Learning Materials, Syllabi & Workshop Manuals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access-restricted study packets, past WAEC examination papers, and TVET technical manuals.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Publish New Resource
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by title or class..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 self-start sm:self-auto font-medium focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Lecture Note">Lecture Notes</option>
          <option value="Syllabus">Syllabus & Guides</option>
          <option value="Workshop Manual">Workshop Manuals</option>
          <option value="Timetable">Exam Timetables</option>
          <option value="Assignment">Assignments</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  {item.isPrivate ? <Lock className="w-3 h-3 text-amber-600" /> : <Globe className="w-3 h-3 text-emerald-600" />}
                  {item.fileSize}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{item.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>Target: <strong>{item.targetClassOrCourse}</strong></span>
              </div>

              <a
                href={item.fileUrl}
                download
                className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Publish Academic Material</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. SSS 2 Chemistry Organic Reactions Summary"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  <option value="Lecture Note">Lecture Note</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Workshop Manual">Workshop Manual</option>
                  <option value="Timetable">Timetable</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Class / Trade</label>
                <input
                  type="text"
                  value={newTargetClass}
                  onChange={(e) => setNewTargetClass(e.target.value)}
                  placeholder="e.g. SSS 2 Science or All"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of chapters covered..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
