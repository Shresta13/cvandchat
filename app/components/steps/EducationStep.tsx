'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, GraduationCap } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import type { Education } from '../types/resume'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
  primaryLight: '#EAF1F5',
  primaryRing: 'rgba(0,39,61,0.15)',
}

const labelClass = `block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5`
const inputBase = `
  w-full px-3 py-2.5 h-10 text-sm text-gray-800 bg-white
  border border-gray-200 rounded-lg outline-none
  transition-all duration-150 placeholder:text-gray-400
`

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase())

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const parseUTC = (val: string) => {
  if (!val) return null
  const d = new Date(val)
  return { month: d.getUTCMonth(), year: d.getUTCFullYear() }
}

const formatUTC = (val: string) => {
  if (!val) return null
  const d = new Date(val)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function StyledInput({
  value,
  onChange,
  placeholder,
  titleCase = false,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  titleCase?: boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      value={value}
      onChange={(e) => {
        const val = titleCase ? toTitleCase(e.target.value) : e.target.value
        onChange(val)
      }}
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
  )
}

function DatePickerField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string
  onChange: (date: string) => void
  placeholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  const parsed = parseUTC(value)
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? new Date().getMonth())
  const [viewYear, setViewYear] = useState(parsed?.year ?? new Date().getFullYear())

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

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

      <PopoverContent
        className="w-64 p-4 shadow-xl rounded-xl border border-gray-100"
        align="start"
      >
        {/* Month + Year selectors */}
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

        {/* Confirm */}
        <button
          onClick={() => {
            onChange(new Date(Date.UTC(viewYear, viewMonth, 1)).toISOString())
            setOpen(false)
          }}
          className="w-full py-2 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: brand.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
        >
          Select {MONTHS[viewMonth]} {viewYear}
        </button>

        {/* Clear */}
        {value && (
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear date
          </button>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default function EducationStep() {
  const { resumeData, updateEducation } = useResume()
  const [educationList, setEducationList] = useState<Education[]>(resumeData.education)

  const updateEducationList = (newList: Education[]) => {
    setEducationList(newList)
    updateEducation(newList)
  }

  const addEducation = () => {
    updateEducationList([
      ...educationList,
      {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
      },
    ])
  }

  const removeEducation = (id: string) => {
    updateEducationList(educationList.filter((e) => e.id !== id))
  }

  const updateField = (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => {
    updateEducationList(
      educationList.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  return (
    <div
      className="max-w-2xl mx-auto"
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: 'white' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: brand.primary }} />
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Education</h3>
          </div>
          <button
            onClick={addEducation}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Education
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3">Add your educational background</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {educationList.length === 0 ? (
          <div
            className="text-center py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
          >
            <GraduationCap size={32} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No education entries yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Education" to get started</p>
          </div>
        ) : (
          educationList.map((edu, i) => (
            <div
              key={edu.id}
              className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden"
            >
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
                    {edu.institution || 'Education Entry'}
                  </span>
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">

                {/* Institution */}
                <div>
                  <label className={labelClass}>
                    Institution <span className="text-red-400 normal-case">*</span>
                  </label>
                  <StyledInput
                    value={edu.institution}
                    onChange={(val) => updateField(edu.id, 'institution', val)}
                    placeholder="University / College Name"
                    titleCase
                  />
                </div>

                {/* Degree + Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Degree <span className="text-red-400 normal-case">*</span>
                    </label>
                    <StyledInput
                      value={edu.degree}
                      onChange={(val) => updateField(edu.id, 'degree', val)}
                      placeholder="Bachelor's, Master's…"
                      titleCase
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Field of Study <span className="text-red-400 normal-case">*</span>
                    </label>
                    <StyledInput
                      value={edu.field}
                      onChange={(val) => updateField(edu.id, 'field', val)}
                      placeholder="Computer Science…"
                      titleCase
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <DatePickerField
                      value={edu.startDate}
                      onChange={(val) => updateField(edu.id, 'startDate', val)}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <DatePickerField
                      value={edu.endDate}
                      onChange={(val) => updateField(edu.id, 'endDate', val)}
                      placeholder="Select end date"
                      disabled={edu.current}
                    />
                  </div>
                </div>

                {/* Currently studying */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onChange={(e) => updateField(edu.id, 'current', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#00273D]"
                  />
                  <label
                    htmlFor={`current-${edu.id}`}
                    className="text-sm font-medium text-gray-600 cursor-pointer"
                  >
                    Currently studying here
                  </label>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}