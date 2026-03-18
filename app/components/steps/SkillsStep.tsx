'use client';

import { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Skill } from '../types/resume';

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryRing: 'rgba(0,39,61,0.15)',
};

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

export default function SkillsStep() {
  const { resumeData, updateSkills } = useResume();
  const [skillsList, setSkillsList] = useState<Skill[]>(resumeData.skills);
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  const updateSkillsList = (newList: Skill[]) => {
    setSkillsList(newList);
    updateSkills(newList);
  };

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    updateSkillsList([
      ...skillsList,
      { id: Date.now().toString(), name: toTitleCase(trimmed) },
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (id: string) => {
    updateSkillsList(skillsList.filter((s) => s.id !== id));
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto px-2 sm:px-0"
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'white' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brand.primary }} />
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Skills</h3>
        </div>
        <p className="text-sm text-gray-400 ml-3">
          Type a skill and press Enter or click Add
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-2.5 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brand.primary }}>
            Add Skill
          </p>
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(toTitleCase(e.target.value))}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. JavaScript, Project Management"
              className="flex-1 px-3 py-2.5 h-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 placeholder:text-gray-400"
              style={{
                borderColor: focused ? brand.primary : '',
                boxShadow: focused
                  ? `0 0 0 3px ${brand.primaryRing}`
                  : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            />
            <button
              onClick={addSkill}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:shadow-md active:scale-95 sm:w-auto sm:shrink-0"
              style={{ backgroundColor: brand.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills Display Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-2.5 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brand.primary }}>
            Skills{' '}
            {skillsList.length > 0 && (
              <span className="normal-case font-normal text-gray-400">
                ({skillsList.length})
              </span>
            )}
          </p>
        </div>

        <div className="p-5">
          {skillsList.length === 0 ? (
            <div
              className="text-center py-10 border-2 border-dashed rounded-xl"
              style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
            >
              <Zap size={28} className="mx-auto mb-2" style={{ color: brand.primary }} />
              <p className="text-sm font-medium text-gray-600">No skills added yet</p>
              <p className="text-xs text-gray-400 mt-1">Type a skill above and press Enter</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                  style={{
                    backgroundColor: brand.primaryLight,
                    borderColor: '#B7CBD7',
                    color: brand.primaryDark,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: brand.primary }}
                  />
                  {skill.name}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}