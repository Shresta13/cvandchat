'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, Briefcase, Bold, Italic, List, Type } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Experience } from '../types/resume';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';

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

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

const parseUTC = (val: string) => {
  if (!val) return null;
  const d = new Date(val);
  return { month: d.getUTCMonth(), year: d.getUTCFullYear() };
};

const formatUTC = (val: string) => {
  if (!val) return null;
  const d = new Date(val);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const FONTS = [
  { label: 'Default',         value: 'inherit' },
  { label: 'Georgia',         value: 'Georgia, serif' },
  { label: 'Courier New',     value: '"Courier New", monospace' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Verdana',         value: 'Verdana, sans-serif' },
];

function StyledInput({
  value,
  onChange,
  placeholder,
  titleCase = false,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  titleCase?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(titleCase ? toTitleCase(e.target.value) : e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputBase}
      style={{
        borderColor: focused ? brand.primary : '',
        boxShadow: focused
          ? `0 0 0 3px ${brand.primaryRing}`
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    />
  );
}

function DatePickerField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseUTC(value);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(parsed?.year ?? new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Popover open={open && !disabled} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className="w-full flex items-center justify-between px-3 h-10 text-sm rounded-lg border border-gray-200 bg-white outline-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {value ? formatUTC(value) : placeholder}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 shadow-xl rounded-xl border border-gray-100" align="start">
        <div className="flex gap-2 mb-4">
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-gray-200 outline-none cursor-pointer"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-gray-200 outline-none cursor-pointer"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button
          onClick={() => { onChange(new Date(Date.UTC(viewYear, viewMonth, 1)).toISOString()); setOpen(false); }}
          className="w-full py-2 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: brand.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
        >
          Select {MONTHS[viewMonth]} {viewYear}
        </button>
        {value && (
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear date
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function RichTextEditor({
  value,
  onChange,
  placeholder = 'Describe your responsibilities and achievements...',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFont, setSelectedFont] = useState('inherit');

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFormat = (command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const ToolbarBtn = ({ onClick, title, children }: {
    onClick: () => void; title: string; children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="p-1.5 rounded-md text-gray-500 hover:text-[#00273D] hover:bg-[#EAF1F5] transition-colors"
    >
      {children}
    </button>
  );

  return (
    <>
      <div
        className="rounded-lg border overflow-hidden transition-all duration-150"
        style={{
          borderColor: isFocused ? brand.primary : '#e5e7eb',
          boxShadow: isFocused
            ? `0 0 0 3px ${brand.primaryRing}`
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1.5 mr-1">
            <Type size={13} className="text-gray-400" />
            <select
              value={selectedFont}
              onChange={(e) => { setSelectedFont(e.target.value); applyFormat('fontName', e.target.value); }}
              className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white text-gray-600 outline-none cursor-pointer"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => applyFormat('bold')} title="Bold"><Bold size={13} /></ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('italic')} title="Italic"><Italic size={13} /></ToolbarBtn>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => applyFormat('insertUnorderedList')} title="Bullet List"><List size={13} /></ToolbarBtn>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          className="w-full min-h-28 px-4 py-3 text-sm text-gray-800 outline-none"
          style={{ lineHeight: '1.75' }}
        />
      </div>
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] ul { list-style-type: disc; padding-left: 1.4rem; margin: 4px 0; }
        [contenteditable] li { margin: 2px 0; }
      `}</style>
    </>
  );
}

export default function ExperienceStep() {
  const { resumeData, updateExperience } = useResume();
  const [experienceList, setExperienceList] = useState<Experience[]>(resumeData.experience);

  const updateExperienceList = (newList: Experience[]) => {
    setExperienceList(newList);
    updateExperience(newList);
  };

  const addExperience = () => {
    updateExperienceList([
      ...experienceList,
      { id: Date.now().toString(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' },
    ]);
  };

  const removeExperience = (id: string) => {
    updateExperienceList(experienceList.filter((e) => e.id !== id));
  };

  const updateField = (id: string, field: keyof Experience, value: string | boolean) => {
    updateExperienceList(experienceList.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'white' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brand.primary }} />
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Work Experience</h3>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Experience
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3">Add your professional experience</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {experienceList.length === 0 ? (
          <div
            className="text-center py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
          >
            <Briefcase size={32} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No experience entries yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Experience" to get started</p>
          </div>
        ) : (
          experienceList.map((exp, i) => (
            <div key={exp.id} className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">

              {/* Card Header */}
              <div
                className="flex justify-between items-center px-5 py-3 border-b border-gray-50"
                style={{ backgroundColor: brand.primaryLight }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: brand.primary }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {exp.company || 'Experience Entry'}
                  </span>
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">

                {/* Company + Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company <span className="text-red-400 normal-case">*</span></label>
                    <StyledInput
                      value={exp.company}
                      onChange={(val) => updateField(exp.id, 'company', val)}
                      placeholder="Company Name"
                      titleCase
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Position <span className="text-red-400 normal-case">*</span></label>
                    <StyledInput
                      value={exp.position}
                      onChange={(val) => updateField(exp.id, 'position', val)}
                      placeholder="Job Title"
                      titleCase
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className={labelClass}>Location</label>
                  <StyledInput
                    value={exp.location}
                    onChange={(val) => updateField(exp.id, 'location', val)}
                    placeholder="City, Country"
                    titleCase
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <DatePickerField
                      value={exp.startDate}
                      onChange={(val) => updateField(exp.id, 'startDate', val)}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <DatePickerField
                      value={exp.endDate}
                      onChange={(val) => updateField(exp.id, 'endDate', val)}
                      placeholder="Select end date"
                      disabled={exp.current}
                    />
                  </div>
                </div>

                {/* Currently working */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateField(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#00273D]"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-gray-600 cursor-pointer">
                    Currently working here
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description</label>
                  <RichTextEditor
                    value={exp.description}
                    onChange={(val) => updateField(exp.id, 'description', val)}
                  />
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}