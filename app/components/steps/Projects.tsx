'use client';

import { useRef, useEffect, useState } from 'react';
import { Plus, Trash2, FolderOpen, List, Github } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import type { Project } from '../types/resume';

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

// ── Rich Text Editor (Simplified for bullets only) ─────────────────────────
function BulletEditor({
  value,
  onChange,
  placeholder = '• Add your project achievements and features...',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const insertBullet = () => {
    editorRef.current?.focus();
    document.execCommand('insertUnorderedList', false);
    onChange(editorRef.current?.innerHTML ?? '');
  };

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
          <button
            type="button"
            title="Insert Bullet Point"
            onMouseDown={(e) => { e.preventDefault(); insertBullet(); }}
            className="p-1.5 rounded-md text-gray-500 hover:text-[#00273D] hover:bg-[#EAF1F5] transition-colors"
          >
            <List size={16} />
          </button>
          <span className="text-xs text-gray-400 ml-1">Press Enter for new bullet points</span>
        </div>
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
        [contenteditable] li { 
          margin: 2px 0; 
        }
      `}</style>
    </>
  );
}

// ── Styled Input ───────────────────────────────────────────────────────────
function StyledInput({
  value,
  onChange,
  placeholder,
  titleCase = false,
  type = 'text',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  titleCase?: boolean;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function ProjectsStep() {
  const { resumeData, updateProjects } = useResume();
  const [projects, setProjects] = useState<Project[]>(resumeData.projects);

  useEffect(() => {
    setProjects(resumeData.projects);
  }, [resumeData.projects]);

  const updateProjectsList = (newList: Project[]) => {
    setProjects(newList);
    updateProjects(newList);
  };

  const addProject = () => {
    updateProjectsList([
      ...projects,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        githubUrl: '',
      },
    ]);
  };

  const removeProject = (id: string) => {
    updateProjectsList(projects.filter((p) => p.id !== id));
  };

  const updateField = (id: string, field: keyof Project, value: string) => {
    updateProjectsList(
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
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
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Projects</h3>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-md active:scale-95"
            style={{ backgroundColor: brand.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Project
          </button>
        </div>
        <p className="text-sm text-gray-400 ml-3 mt-1">Add your GitHub projects with bullet points</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div
            className="text-center py-14 border-2 border-dashed rounded-xl"
            style={{ borderColor: '#B7CBD7', backgroundColor: brand.primaryLight }}
          >
            <FolderOpen size={32} className="mx-auto mb-3" style={{ color: brand.primary }} />
            <p className="text-sm font-medium text-gray-600">No projects added yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Project" to get started</p>
          </div>
        ) : (
          projects.map((project, i) => (
            <div
              key={project.id}
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
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 truncate">
                    {project.name || 'New Project'}
                  </span>
                </div>
                <button
                  onClick={() => removeProject(project.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Project Name */}
                <div>
                  <label className={labelClass}>
                    Project Name <span className="text-red-400 normal-case">*</span>
                  </label>
                  <StyledInput
                    value={project.name}
                    onChange={(val) => updateField(project.id, 'name', val)}
                    placeholder="e.g. E-Commerce Platform"
                    titleCase
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className={labelClass}>
                    <Github size={14} className="inline mr-1" />
                    GitHub URL <span className="text-red-400 normal-case">*</span>
                  </label>
                  <StyledInput
                    type="url"
                    value={project.githubUrl}
                    onChange={(val) => updateField(project.id, 'githubUrl', val)}
                    placeholder="https://github.com/username/repository"
                  />
                </div>

                {/* Description in Bullets */}
                <div>
                  <label className={labelClass}>
                    Key Features & Achievements <span className="text-red-400 normal-case">*</span>
                  </label>
                  <BulletEditor
                    value={project.description}
                    onChange={(val) => updateField(project.id, 'description', val)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Use bullet points to highlight key features, technologies used, and your contributions
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