'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface PersonData {
  fullName?:    string;
  email?:       string;
  phone?:       string;
  location?:    string;
  title?:       string;
  linkedin?:    string;
  github?:      string;
  summary?:     string;
  skills?:      { name: string }[];
  experience?:  any[];
  education?:   any[];
  languages?:   any[];
  certificates?: any[];
  projects?:    any[];
  references?:  any[];
}

function ResumeFillerInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [data, setData]   = useState<PersonData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const encoded = searchParams.get('data');
    if (!encoded) {
      setError('No data found in URL.');
      return;
    }
    try {
      const decoded = JSON.parse(
        decodeURIComponent(escape(atob(encoded)))
      );
      setData(decoded);
    } catch {
      setError('Failed to decode data from URL.');
    }
  }, [searchParams]);

  const handleOpenInBuilder = () => {
    if (!data) return;

    const resumeData = {
      personalInfo: {
        fullName: data.fullName ?? '',
        email:    data.email    ?? '',
        phone:    data.phone    ?? '',
        location: data.location ?? '',
        title:    data.title    ?? '',
        linkedin: data.linkedin ?? '',
        github:   data.github   ?? '',
        summary:  data.summary  ?? '',
      },
      skills:       data.skills       ?? [],
      experience:   data.experience   ?? [],
      education:    data.education    ?? [],
      languages:    data.languages    ?? [],
      certificates: data.certificates ?? [],
      projects:     data.projects     ?? [],
      references:   data.references   ?? [],
      selectedTemplate: 'classic',
    };

    // save to localStorage for builder to pick up
    localStorage.setItem('resume_prefill_pending', JSON.stringify(resumeData));
    router.push('/cv-builder');
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500">{error}</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm"
      >
        Go Back
      </button>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Resume Data</h1>
        <p className="text-sm text-gray-500 mb-6">
          Data decoded from URL. Review before opening in builder.
        </p>

        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-4 space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Personal Info
          </h2>

          {[
            { label: 'Full Name', value: data.fullName },
            { label: 'Email',     value: data.email    },
            { label: 'Phone',     value: data.phone    },
            { label: 'Location',  value: data.location },
            { label: 'Title',     value: data.title    },
            { label: 'LinkedIn',  value: data.linkedin },
            { label: 'GitHub',    value: data.github   },
          ].map(({ label, value }) =>
            value ? (
              <div key={label} className="flex gap-3 text-sm">
                <span className="text-gray-400 w-20 shrink-0">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ) : null
          )}

          {data.summary && (
            <div className="pt-3 border-t text-sm">
              <span className="text-gray-400 block mb-1">Summary</span>
              <p className="text-gray-800">{data.summary}</p>
            </div>
          )}
        </div>

        {/* Section Counts Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Sections
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Skills',       count: data.skills?.length       ?? 0 },
              { label: 'Experience',   count: data.experience?.length   ?? 0 },
              { label: 'Education',    count: data.education?.length    ?? 0 },
              { label: 'Languages',    count: data.languages?.length    ?? 0 },
              { label: 'Certs',        count: data.certificates?.length ?? 0 },
              { label: 'Projects',     count: data.projects?.length     ?? 0 },
            ].map(({ label, count }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills list if any */}
        {data.skills && data.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleOpenInBuilder}
            className="flex-1 py-2.5 text-white rounded-lg text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: '#00273D' }}
          >
            Open in Resume Builder
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ResumeFillerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ResumeFillerInner />
    </Suspense>
  );
}