'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResClick() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ get userId first
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.userId) setUserId(data.userId);
      })
      .catch(() => {});
  }, []);

  // ✅ read from localStorage using same key your context uses
  useEffect(() => {
    if (!userId) return;
    const key = `cvgenerator_resume_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setResumeData(JSON.parse(stored));
      } catch {}
    }
  }, [userId]);

  const handleOpen = () => {
    if (!resumeData) return;

    const dataToEncode = {
      fullName: resumeData.personalInfo?.fullName ?? '',
      email:    resumeData.personalInfo?.email    ?? '',
      phone:    resumeData.personalInfo?.phone    ?? '',
      location: resumeData.personalInfo?.location ?? '',
      title:    resumeData.personalInfo?.title    ?? '',
      linkedin: resumeData.personalInfo?.linkedin ?? '',
      github:   resumeData.personalInfo?.github   ?? '',
      summary:  resumeData.personalInfo?.summary  ?? '',
      skills:       resumeData.skills       ?? [],
      experience:   resumeData.experience   ?? [],
      education:    resumeData.education    ?? [],
      languages:    resumeData.languages    ?? [],
      certificates: resumeData.certificates ?? [],
      projects:     resumeData.projects     ?? [],
      references:   resumeData.references   ?? [],
    };

    const encoded = btoa(
      unescape(encodeURIComponent(JSON.stringify(dataToEncode)))
    );
    router.push(`/resume-filler?data=${encoded}`);
  };

  if (!resumeData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-800">Share Resume</h1>
        <p className="text-sm text-gray-500">
          {resumeData.personalInfo?.fullName
            ? `Sharing resume for: ${resumeData.personalInfo.fullName}`
            : 'No name found'}
        </p>
        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-md"
          style={{ backgroundColor: '#00273D' }}
        >
          Open in Resume Builder
        </button>
      </div>
    </div>
  );
}