// app/resume-filler/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ── match your existing ResumeData type ──
interface PersonalInfo {
  fullName:  string;
  email:     string;
  phone:     string;
  location:  string;
  linkedin:  string;
  github:    string;
  summary:   string;
  title:     string;
}

interface ResumeData {
  personalInfo:     PersonalInfo;
  experience:       any[];
  education:        any[];
  skills:           any[];
  languages:        any[];
  certificates:     any[];
  projects:         any[];
  references:       any[];
  selectedTemplate: string;
}

const defaultData: ResumeData = {
  personalInfo: {
    fullName: '', email: '', phone: '',
    location: '', linkedin: '', github: '',
    summary: '', title: '',
  },
  experience:       [],
  education:        [],
  skills:           [],
  languages:        [],
  certificates:     [],
  projects:         [],
  references:       [],
  selectedTemplate: 'classic',
};

// ── inner component that uses useSearchParams ──
function ResumeFiller() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [data, setData] = useState<ResumeData>(defaultData);
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    const key = searchParams.get('key');
    if (!key) {
      setError('No data key found in URL.');
      setLoaded(true);
      return;
    }

    const stored = localStorage.getItem(key);
    if (!stored) {
      setError('Data expired or not found. Please go back and try again.');
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ResumeData;
      setData(parsed);
      // Clean up localStorage after reading
      localStorage.removeItem(key);
    } catch {
      setError('Failed to parse resume data.');
    }

    setLoaded(true);
  }, [searchParams]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleGoToBuilder = () => {
    // Store final data for your resume builder to pick up
    localStorage.setItem('resumeData', JSON.stringify(data));
    router.push('/resume-builder'); // ← your existing resume builder route
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Review Your Information
        </h1>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">

          {/* Personal Info Fields */}
          {(
            [
              { label: 'Full Name',    field: 'fullName'  },
              { label: 'Email',        field: 'email'     },
              { label: 'Phone',        field: 'phone'     },
              { label: 'Location',     field: 'location'  },
              { label: 'Job Title',    field: 'title'     },
              { label: 'LinkedIn',     field: 'linkedin'  },
              { label: 'GitHub',       field: 'github'    },
            ] as { label: string; field: keyof PersonalInfo }[]
          ).map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={data.personalInfo[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              rows={4}
              value={data.personalInfo.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Show counts for arrays */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: 'Experience entries', count: data.experience.length },
              { label: 'Education entries',  count: data.education.length  },
              { label: 'Skills',             count: data.skills.length     },
              { label: 'Projects',           count: data.projects.length   },
            ].map(({ label, count }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleGoToBuilder}
            className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            Open in Resume Builder
          </button>
        </div>

      </div>
    </div>
  );
}

// ── wrap in Suspense because useSearchParams needs it ──
export default function ResumeFillerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ResumeFiller />
    </Suspense>
  );
}