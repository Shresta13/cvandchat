'use client';

import { useRouter } from 'next/navigation';
import personData from '../resume-filler/person.json';

export default function ResClick() {
  const router = useRouter();
  const p = personData.personalInfo;

  const handleBuildResume = () => {
    const resumePayload = {
      personalInfo: {
        fullName: p.fullName  || '',
        email:    p.email     || '',
        phone:    p.phone     || '',
        location: p.location  || '',
        title:    p.title     || '',
        linkedin: p.linkedin  || '',
        github:   p.github    || '',
        summary:  p.summary   || '',
      },
      experience: personData.experience.map((e: any, i: number) => ({
        id:          e.id          || `exp_${String(i + 1).padStart(3, '0')}`,
        position:    e.position    || '',
        company:     e.company     || '',
        location:    e.location    || '',
        startDate:   e.startDate   || '',
        endDate:     e.current ? '' : (e.endDate || ''),
        current:     e.current     || false,
        description: e.description || '',
      })),
      education: personData.education.map((e: any, i: number) => ({
        id:          e.id          || `edu_${String(i + 1).padStart(3, '0')}`,
        degree:      e.degree      || '',
        field:       e.field       || '',
        institution: e.institution || '',
        location:    e.location    || '',
        startDate:   e.startDate   || '',
        endDate:     e.endDate     || '',
        current:     e.current     || false,
      })),
      skills:       personData.skills.map((s: any, i: number)       => ({ id: s.id || `sk_${String(i + 1).padStart(3, '0')}`, name: s.name || '' })),
      languages:    personData.languages.map((l: any, i: number)    => ({ id: l.id || `lang_${String(i + 1).padStart(3, '0')}`, name: l.name || '' })),
      certificates: personData.certificates.map((c: any, i: number) => ({
        id:           c.id           || `cert_${String(i + 1).padStart(3, '0')}`,
        name:         c.name         || '',
        issuer:       c.issuer       || '',
        date:         c.date         || '',
        credentialId: c.credentialId || '',
      })),
      projects: personData.projects.map((proj: any, i: number) => ({
        id:          proj.id          || `proj_${String(i + 1).padStart(3, '0')}`,
        name:        proj.name        || '',
        description: proj.description || '',
        githubUrl:   proj.githubUrl   || '',
      })),
      references: personData.references.map((r: any, i: number) => ({
        id:           r.id           || `ref_${String(i + 1).padStart(3, '0')}`,
        name:         r.name         || '',
        position:     r.position     || '',
        company:      r.company      || '',
        email:        r.email        || '',
        phone:        r.phone        || '',
        linkedin:     r.linkedin     || '',
        relationship: r.relationship || '',
      })),
      selectedTemplate: personData.selectedTemplate || 'classic',
    };

    const jsonString = JSON.stringify(resumePayload);
    const prefillUrl = `/dashboard?prefill=${encodeURIComponent(jsonString)}`;

    // Save the latest generated prefill URL for reuse/debugging.
    try {
      localStorage.setItem('last_prefill_resume_url', prefillUrl);
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }

    router.push(prefillUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
          <p className="text-sm text-gray-500 mt-1">
            Click to auto-fill your resume with this data
          </p>
        </div>

        {/* person preview card */}
        {/* <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
              style={{ backgroundColor: '#00273D' }}
            >
              {p.fullName?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-800">{p.fullName}</p>
              <p className="text-sm text-gray-500">{p.title}</p>
            </div>
          </div>

          {[
            { label: 'Email',    value: p.email    },
            { label: 'Phone',    value: p.phone    },
            { label: 'Location', value: p.location },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3 text-sm">
              <span className="text-gray-400 w-20 shrink-0">{label}</span>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          ))}

          <div className="pt-3 border-t grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Skills',     count: personData.skills.length       },
              { label: 'Experience', count: personData.experience.length   },
              { label: 'Education',  count: personData.education.length    },
              { label: 'Projects',   count: personData.projects.length     },
              { label: 'Certs',      count: personData.certificates.length },
              { label: 'Languages',  count: personData.languages.length    },
            ].map(({ label, count }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2">
                <p className="text-lg font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div> */}

        <button
          onClick={handleBuildResume}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 active:scale-95 transition"
          style={{ backgroundColor: '#00273D' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Build Resume
        </button>

      </div>
    </div>
  );
}