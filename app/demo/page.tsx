'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Zap, Download, Edit3, ChevronRight, User, Briefcase, GraduationCap, Code } from 'lucide-react';

const sampleData = {
  personalInfo: {
    fullName: "Ram Hari Shrestha",
    email: "ram@gmail.com",
    phone: "+977-9841234567",
    location: "Kathmandu, Nepal",
    title: "Full Stack Developer",
    linkedin: "https://linkedin.com/in/ramhari",
    github: "https://github.com/ramhari",
    summary: "<p>Experienced software developer with over 5 years of expertise in full-stack development. Proficient in React, Node.js, and cloud technologies.</p>"
  },
  education: [
    {
      id: "edu_001",
      institution: "Tribhuvan University",
      degree: "Bachelor",
      field: "Computer Science",
      startDate: "2016-01-01T00:00:00.000Z",
      endDate: "2020-01-01T00:00:00.000Z",
      current: false
    },
    {
      id: "edu_002",
      institution: "Kathmandu Model College",
      degree: "Higher Secondary",
      field: "Science",
      startDate: "2014-01-01T00:00:00.000Z",
      endDate: "2016-01-01T00:00:00.000Z",
      current: false
    }
  ],
  experience: [
    {
      id: "exp_001",
      company: "Tech Solutions Pvt. Ltd.",
      position: "Senior Software Engineer",
      location: "Kathmandu, Nepal",
      startDate: "2022-03-01T00:00:00.000Z",
      endDate: "",
      current: true,
      description: "<ul><li>Led development of microservices architecture serving 100k+ users</li><li>Reduced API response time by 40% through caching and query optimization</li><li>Mentored a team of 4 junior developers</li></ul>"
    },
    {
      id: "exp_002",
      company: "Digital Agency Nepal",
      position: "Frontend Developer",
      location: "Lalitpur, Nepal",
      startDate: "2020-06-01T00:00:00.000Z",
      endDate: "2022-02-01T00:00:00.000Z",
      current: false,
      description: "<ul><li>Built responsive web applications using React and TypeScript</li><li>Improved website performance score from 62 to 94 on Lighthouse</li></ul>"
    }
  ],
  skills: [
    { id: "sk_001", name: "React.js" },
    { id: "sk_002", name: "Next.js" },
    { id: "sk_003", name: "TypeScript" },
    { id: "sk_004", name: "Node.js" },
    { id: "sk_005", name: "PostgreSQL" },
    { id: "sk_006", name: "MongoDB" },
    { id: "sk_007", name: "Docker" },
    { id: "sk_008", name: "AWS" }
  ],
  languages: [
    { id: "lang_001", name: "Nepali (Native)" },
    { id: "lang_002", name: "English (Fluent)" },
    { id: "lang_003", name: "Hindi (Conversational)" }
  ],
  certificates: [
    {
      id: "cert_001",
      name: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
      date: "2023-05-01T00:00:00.000Z",
      credentialId: "AWS-DEV-2023-001"
    },
    {
      id: "cert_002",
      name: "Meta React Developer Certificate",
      issuer: "Meta / Coursera",
      date: "2022-08-01T00:00:00.000Z",
      credentialId: "META-REACT-2022"
    }
  ],
  projects: [
    {
      id: "proj_001",
      name: "KaamHub Resume Builder",
      description: "<ul><li>Built a full-stack resume builder with Next.js 15 and Convex DB</li><li>Implemented 7 professional PDF templates using jsPDF</li></ul>",
      githubUrl: "https://github.com/ramhari/kaamhub-resume"
    },
    {
      id: "proj_002",
      name: "E-Commerce Platform",
      description: "<ul><li>Developed a multi-vendor e-commerce platform with React and Node.js</li><li>Integrated Stripe payment gateway and order management system</li></ul>",
      githubUrl: "https://github.com/ramhari/ecommerce"
    }
  ],
  references: [
    {
      id: "ref_001",
      name: "Sanjay Maharjan",
      position: "Engineering Manager",
      company: "Tech Solutions Pvt. Ltd.",
      email: "sanjay@techsolutions.com.np",
      phone: "+977-9851234567",
      relationship: "Direct Manager",
      linkedin: "https://linkedin.com/in/sanjaymaharjan"
    }
  ],
  selectedTemplate: "classic"
};

export default function DemoPage() {
  const router = useRouter();
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [prefillUrl, setPrefillUrl] = useState(''); // ✅ fix hydration — start empty

  // ✅ Fix hydration — only generate URL on client
  useEffect(() => {
    const encoded = encodeURIComponent(JSON.stringify(sampleData));
    setPrefillUrl(`${window.location.origin}/dashboard?data=${encoded}`);
  }, []);

  const handleOpenInBuilder = () => {
    setLoading(true);
    const encoded = encodeURIComponent(JSON.stringify(sampleData));
    // ✅ Push to dashboard with prefill data in URL
    router.push(`/dashboard?data=${encoded}`);
  };

  const handleCopyUrl = () => {
    if (!prefillUrl) return;
    navigator.clipboard.writeText(prefillUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div style={{ backgroundColor: '#00273D' }} className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <FileText size={16} color="white" />
          </div>
          <span className="text-white font-bold text-lg">Resume Preview</span>
        </div>
        <button
          onClick={handleOpenInBuilder}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-60"
          style={{ backgroundColor: '#ffffff20', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <Edit3 size={14} />
          {loading ? 'Opening...' : 'Edit in Builder'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#EAF1F5', color: '#00273D' }}
          >
            <Zap size={12} />
            Pre-filled Resume Ready
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {sampleData.personalInfo.fullName}
          </h1>
          <p className="text-gray-500 text-sm mb-2">{sampleData.personalInfo.title}</p>
          <p className="text-gray-400 text-xs">
            {sampleData.personalInfo.email} · {sampleData.personalInfo.phone} · {sampleData.personalInfo.location}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={handleOpenInBuilder}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: '#00273D' }}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <Edit3 size={15} />
            )}
            {loading ? 'Opening Builder...' : 'Open & Edit in Builder'}
            {!loading && <ChevronRight size={15} />}
          </button>

          <button
            onClick={handleCopyUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 transition-all hover:shadow-md active:scale-95"
            style={{
              borderColor: '#00273D',
              color: '#00273D',
              backgroundColor: copied ? '#EAF1F5' : 'white',
            }}
          >
            {copied ? '✅ Copied!' : '🔗 Copy Prefill URL'}
          </button>
        </div>

        {/* Resume Data Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF1F5' }}>
                <User size={14} style={{ color: '#00273D' }} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Personal Info</h3>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Name',     value: sampleData.personalInfo.fullName   },
                { label: 'Title',    value: sampleData.personalInfo.title      },
                { label: 'Email',    value: sampleData.personalInfo.email      },
                { label: 'Phone',    value: sampleData.personalInfo.phone      },
                { label: 'Location', value: sampleData.personalInfo.location   },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-16 shrink-0">{label}</span>
                  <span className="text-gray-700 font-medium truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF1F5' }}>
                <Briefcase size={14} style={{ color: '#00273D' }} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Experience ({sampleData.experience.length})
              </h3>
            </div>
            <div className="space-y-3">
              {sampleData.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="text-xs font-semibold text-gray-800">{exp.position}</p>
                  <p className="text-xs text-gray-500">{exp.company} · {exp.location}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(exp.startDate).getFullYear()} – {exp.current ? 'Present' : new Date(exp.endDate || '').getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF1F5' }}>
                <GraduationCap size={14} style={{ color: '#00273D' }} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Education ({sampleData.education.length})
              </h3>
            </div>
            <div className="space-y-3">
              {sampleData.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-xs font-semibold text-gray-800">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.degree} in {edu.field}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(edu.startDate).getFullYear()} – {new Date(edu.endDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills + Projects */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF1F5' }}>
                <Code size={14} style={{ color: '#00273D' }} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Skills & Projects</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sampleData.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#EAF1F5', color: '#00273D' }}
                >
                  {s.name}
                </span>
              ))}
            </div>
            <div className="space-y-1">
              {sampleData.projects.map((p) => (
                <p key={p.id} className="text-xs text-gray-600">
                  📁 {p.name}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
          <h3 className="text-sm font-bold text-gray-800 mb-4">How it works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Click "Open & Edit"', desc: 'All resume data is encoded in the URL and loaded into the builder automatically.' },
              { step: '2', title: 'Edit any section',    desc: 'Change personal info, experience, skills — all sections are fully editable.' },
              { step: '3', title: 'Download PDF',        desc: 'Choose a template, preview your resume, and download as a professional PDF.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: '#00273D' }}
                >
                  {step}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ URL Preview — only show after client hydration */}
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2 font-mono">Generated prefill URL:</p>
          <p className="text-xs text-green-400 font-mono break-all">
            {prefillUrl
              ? `${prefillUrl.slice(0, 100)}...`
              : 'Loading URL...'}
          </p>
        </div>

      </div>
    </div>
  );
}