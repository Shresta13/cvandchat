'use client';

import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { useResume } from '../context/ResumeContext';
import { Bold, Italic, List, Type, User, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryBorder: '#B7CBD7',
  primaryRing: 'rgba(0,39,61,0.15)',
};

const FONTS = [
  { label: 'Default',         value: 'inherit' },
  { label: 'Georgia',         value: 'Georgia, serif' },
  { label: 'Courier New',     value: '"Courier New", monospace' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Verdana',         value: 'Verdana, sans-serif' },
];

const labelClass = `block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5`;
const inputBase = `
  w-full pl-9 pr-3 py-2.5 h-10 text-sm text-gray-800 bg-white
  border border-gray-200 rounded-lg outline-none
  transition-all duration-150 placeholder:text-gray-400
  shadow-[0_2px_8px_rgba(0,0,0,0.06)]
`;

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

function InputField({
  icon: Icon,
  label,
  required,
  titleCase = false,
  onChange,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  titleCase?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (titleCase) {
      e.target.value = toTitleCase(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div>
      <label className={labelClass}>
        {label}{required && <span className="text-red-400 normal-case ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: focused ? brand.primary : '#9ca3af' }}
        />
        <input
          {...props}
          onChange={handleChange}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={inputBase}
          style={{
            borderColor: focused ? brand.primary : '',
            boxShadow: focused
              ? `0 0 0 3px ${brand.primaryRing}`
              : '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
      </div>
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
  placeholder = 'Briefly describe your experience, strengths, and career goals...',
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
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1.5 mr-1">
            <Type size={13} className="text-gray-400" />
            <select
              value={selectedFont}
              onChange={(e) => {
                setSelectedFont(e.target.value);
                applyFormat('fontName', e.target.value);
              }}
              className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white text-gray-600 outline-none cursor-pointer"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-4 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => applyFormat('bold')} title="Bold">
            <Bold size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => applyFormat('italic')} title="Italic">
            <Italic size={13} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <ToolbarBtn onClick={() => applyFormat('insertUnorderedList')} title="Bullet List">
            <List size={13} />
          </ToolbarBtn>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-placeholder={placeholder}
          className="w-full min-h-32 px-4 py-3 text-sm text-gray-800 outline-none"
          style={{ lineHeight: '1.75' }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.4rem;
          margin: 4px 0;
        }
        [contenteditable] li { margin: 2px 0; }
      `}</style>
    </>
  );
}

export default function PersonalInfoStep() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const handleChange =
    (field: keyof typeof personalInfo) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      updatePersonalInfo({ [field]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'white' }}>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brand.primary }} />
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Personal Information</h3>
        </div>
        <p className="text-sm text-gray-400 ml-3">
          Enter your contact details and a short professional summary.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-5 py-2.5 border-b border-gray-100" style={{ backgroundColor: 'white' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brand.primary }}>
            Contact Details
          </p>
        </div>

        <div className="p-5 space-y-4">
          <InputField
            icon={User}
            label="Full Name"
            required
            titleCase
            type="text"
            value={personalInfo.fullName}
            onChange={handleChange('fullName')}
            placeholder="John Doe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              icon={Mail}
              label="Email"
              required
              type="email"
              value={personalInfo.email}
              onChange={handleChange('email')}
              placeholder="john@example.com"
            />
            <InputField
              icon={Phone}
              label="Phone"
              required
              type="tel"
              value={personalInfo.phone}
              onChange={handleChange('phone')}
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <InputField
            icon={MapPin}
            label="Location"
            required
            titleCase
            type="text"
            value={personalInfo.location}
            onChange={handleChange('location')}
            placeholder="Kathmandu, Nepal"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              icon={Linkedin}
              label="LinkedIn"
              type="url"
              value={personalInfo.linkedin}
              onChange={handleChange('linkedin')}
              placeholder="linkedin.com/in/username"
            />
            <InputField
              icon={Github}
              label="GitHub"
              type="url"
              value={personalInfo.github}
              onChange={handleChange('github')}
              placeholder="github.com/username"
            />
          </div>
        </div>

        <div className="px-5 py-2.5 border-t border-b border-gray-100" style={{ backgroundColor: 'white' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: brand.primary }}>
            Professional Summary
          </p>
        </div>

        <div className="p-5">
          <RichTextEditor
            value={personalInfo.summary}
            onChange={(val) => updatePersonalInfo({ summary: val })}
          />
        </div>

      </div>
    </div>
  );
}