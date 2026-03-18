'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Phone, Briefcase, Building2, User, Link as LinkIcon } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Reference } from '../types/resume';

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryRing: 'rgba(0,39,61,0.15)',
};

const labelClass = `block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5`;
const inputBase = `
  w-full px-3 py-2.5 h-10 text-sm text-gray-800 bg-white
  border border-gray-200 rounded-lg outline-none
  transition-all duration-150 placeholder:text-gray-400
`;

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

// ── Styled Input ───────────────────────────────────────────────────────────
function StyledInput({
  value,
  onChange,
  placeholder,
  titleCase = false,
  type = 'text',
  icon,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  titleCase?: boolean;
  type?: string;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(titleCase ? toTitleCase(e.target.value) : e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${inputBase} ${icon ? 'pl-10' : ''}`}
        style={{
          borderColor: focused ? brand.primary : '',
          boxShadow: focused
            ? `0 0 0 3px ${brand.primaryRing}`
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      />
    </div>
  );
}

// ── Main References Component ─────────────────────────────────────────────
export default function ReferencesStep() {
  const { resumeData, updateReferences } = useResume();
  const [references, setReferences] = useState<Reference[]>(resumeData.references);

  useEffect(() => {
    setReferences(resumeData.references);
  }, [resumeData.references]);

  const updateReferencesList = (newList: Reference[]) => {
    setReferences(newList);
    updateReferences(newList);
  };

  const addReference = () => {
    updateReferencesList([
      ...references,
      {
        id: Date.now().toString(),
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        relationship: '',
        linkedin: '',
      },
    ]);
  };

  const removeReference = (id: string) => {
    updateReferencesList(references.filter((ref) => ref.id !== id));
  };

  const updateField = (id: string, field: keyof Reference, value: string) => {
    updateReferencesList(
      references.map((ref) => (ref.id === id ? { ...ref, [field]: value } : ref))
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
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Professional References</h3>
          </div>
          <button
            onClick={addReference}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Reference
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3 mt-1">Add professional references who can vouch for your skills and experience</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {references.length === 0 ? (
          <div
            className="text-center py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
          >
            <User size={32} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No references added yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Reference" to get started</p>
          </div>
        ) : (
          references.map((reference, index) => (
            <div
              key={reference.id}
              className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="flex justify-between items-center px-5 py-3 border-b border-gray-50"
                style={{ backgroundColor: brand.primaryLight }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: brand.primary }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 truncate">
                    {reference.name || 'New Reference'}
                  </span>
                </div>
                <button
                  onClick={() => removeReference(reference.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className={labelClass}>
                    Full Name <span className="text-red-400 normal-case">*</span>
                  </label>
                  <StyledInput
                    value={reference.name}
                    onChange={(val) => updateField(reference.id, 'name', val)}
                    placeholder="e.g. Dr. Sarah Johnson"
                    titleCase
                    icon={<User size={16} />}
                  />
                </div>

                {/* Position & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Position</label>
                    <StyledInput
                      value={reference.position}
                      onChange={(val) => updateField(reference.id, 'position', val)}
                      placeholder="e.g. Senior Manager"
                      titleCase
                      icon={<Briefcase size={16} />}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <StyledInput
                      value={reference.company}
                      onChange={(val) => updateField(reference.id, 'company', val)}
                      placeholder="e.g. Tech Corp Inc."
                      titleCase
                      icon={<Building2 size={16} />}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <StyledInput
                      type="email"
                      value={reference.email}
                      onChange={(val) => updateField(reference.id, 'email', val)}
                      placeholder="sarah.johnson@company.com"
                      icon={<Mail size={16} />}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <StyledInput
                      type="tel"
                      value={reference.phone}
                      onChange={(val) => updateField(reference.id, 'phone', val)}
                      placeholder="+1 (555) 123-4567"
                      icon={<Phone size={16} />}
                    />
                  </div>
                </div>

                {/* Relationship & LinkedIn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <StyledInput
                      value={reference.relationship}
                      onChange={(val) => updateField(reference.id, 'relationship', val)}
                      placeholder="e.g. Former Supervisor"
                      titleCase
                    />
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn (Optional)</label>
                    <StyledInput
                      type="url"
                      value={reference.linkedin || ''}
                      onChange={(val) => updateField(reference.id, 'linkedin', val)}
                      placeholder="https://linkedin.com/in/username"
                      icon={<LinkIcon size={16} />}
                    />
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">💡 Tip:</span> Always ask permission before listing someone as a reference and inform them they might be contacted.
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}