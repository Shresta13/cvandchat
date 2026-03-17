'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, Award } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Certificate } from '../types/resume';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryBorder: '#B7CBD7',
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

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

function DatePickerField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (d: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseUTC(value);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(parsed?.year ?? new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center justify-between px-3 h-10 text-sm rounded-lg border border-gray-200 bg-white outline-none transition-all duration-150"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {value ? formatUTC(value) : placeholder}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-4 shadow-xl rounded-xl border border-gray-100"
        align="start"
      >
        <div className="flex gap-2 mb-4">
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-gray-200 outline-none cursor-pointer"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-gray-200 outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            onChange(new Date(Date.UTC(viewYear, viewMonth, 1)).toISOString());
            setOpen(false);
          }}
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

export default function CertificatesStep() {
  const { resumeData, updateCertificates } = useResume();
  const [certificatesList, setCertificatesList] = useState<Certificate[]>(
    resumeData.certificates
  );

  const updateCertificatesList = (newList: Certificate[]) => {
    setCertificatesList(newList);
    updateCertificates(newList);
  };

  const addCertificate = () => {
    updateCertificatesList([
      ...certificatesList,
      { id: Date.now().toString(), name: '', issuer: '', credentialId: '', date: '' },
    ]);
  };

  const removeCertificate = (id: string) => {
    updateCertificatesList(certificatesList.filter((c) => c.id !== id));
  };

  const updateField = (id: string, field: keyof Certificate, value: string) => {
    updateCertificatesList(
      certificatesList.map((c) => (c.id === id ? { ...c, [field]: value } : c))
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
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Certificates</h3>
          </div>
          <button
            onClick={addCertificate}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Certificate
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3 mt-1">Add your professional certifications</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {certificatesList.length === 0 ? (
          <div
            className="text-center py-12 sm:py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: brand.primaryBorder, backgroundColor: brand.primaryLight }}
          >
            <Award size={28} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No certificates yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Certificate" to get started</p>
          </div>
        ) : (
          certificatesList.map((cert, i) => (
            <div
              key={cert.id}
              className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="flex justify-between items-center px-4 sm:px-5 py-3 border-b border-gray-50"
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
                    {cert.name || 'Certificate Entry'}
                  </span>
                </div>
                <button
                  onClick={() => removeCertificate(cert.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-4">

                {/* Certificate Name — full width */}
                <div>
                  <label className={labelClass}>
                    Certificate Name <span className="text-red-400 normal-case">*</span>
                  </label>
                  <StyledInput
                    value={cert.name}
                    onChange={(val) => updateField(cert.id, 'name', val)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    titleCase
                  />
                </div>

                {/* Issuer + ID — stack on mobile, 2 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Issuing Organization <span className="text-red-400 normal-case">*</span>
                    </label>
                    <StyledInput
                      value={cert.issuer}
                      onChange={(val) => updateField(cert.id, 'issuer', val)}
                      placeholder="e.g. Amazon Web Services"
                      titleCase
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Certificate ID</label>
                    <StyledInput
                      value={cert.credentialId ?? ''}
                      onChange={(val) => updateField(cert.id, 'credentialId', val)}
                      placeholder="e.g. ABC-12345"
                    />
                  </div>
                </div>

                {/* Issue Date — full width on mobile, half on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Issue Date</label>
                    <DatePickerField
                      value={cert.date}
                      onChange={(v) => updateField(cert.id, 'date', v)}
                      placeholder="Select date"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}