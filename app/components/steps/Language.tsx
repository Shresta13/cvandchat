'use client';

import { useState } from 'react';
import { Plus, Trash2, Languages } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Language } from '../types/resume';

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryRing: 'rgba(0,39,61,0.15)',
};

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

export default function LanguageStep() {
  const { resumeData, updateLanguages } = useResume();
  const [languageList, setLanguageList] = useState<Language[]>(resumeData.languages);

  const updateLanguageList = (newList: Language[]) => {
    setLanguageList(newList);
    updateLanguages(newList);
  };

  const addLanguage = () => {
    updateLanguageList([
      ...languageList,
      { id: Date.now().toString(), name: '', level: 'conversational' },
    ]);
  };

  const removeLanguage = (id: string) => {
    updateLanguageList(languageList.filter((l) => l.id !== id));
  };

  const updateName = (id: string, value: string) => {
    updateLanguageList(
      languageList.map((l) => (l.id === id ? { ...l, name: value } : l))
    );
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto px-2 sm:px-0"
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'white' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brand.primary }} />
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Languages</h3>
          </div>
          <button
            onClick={addLanguage}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Language
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3 mt-1">Add languages you speak</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {languageList.length === 0 ? (
          <div
            className="text-center py-12 sm:py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
          >
            <Languages size={28} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No languages added yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Language" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languageList.map((lang, i) => (
              <div
                key={lang.id}
                className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="flex justify-between items-center px-4 py-2.5 border-b border-gray-50"
                  style={{ backgroundColor: brand.primaryLight }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: brand.primary }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {lang.name || 'Language Entry'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Card Body — name only */}
                <div className="p-4">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Language <span className="text-red-400 normal-case">*</span>
                  </label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateName(lang.id, toTitleCase(e.target.value))}
                    placeholder="e.g. English, Nepali, French"
                    className="w-full px-3 py-2.5 h-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 placeholder:text-gray-400"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = brand.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${brand.primaryRing}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    }}
                  />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}