'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { ResumeData } from '../types/resume';

const getStorageKey = (userId: string) => `cvgenerator_resume_${userId}`;

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    title: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
  references: [],
  selectedTemplate: 'classic',
};

// ✅ CHANGE 1 — hardcoded sample data
const SAMPLE_RESUME_DATA: Partial<ResumeData> = {
  personalInfo: {
    fullName: "Ram Hari Shrestha",
    email: "ram@gmail.com",
    phone: "+977-9841234567",
    location: "Kathmandu, Nepal",
    title: "Full Stack Developer",
    linkedin: "https://linkedin.com/in/ramhari",
    github: "https://github.com/ramhari",
    summary: "<p>Experienced software developer with over 5 years of expertise in full-stack development. Proficient in React, Node.js, and cloud technologies. Passionate about building scalable applications and solving complex problems.</p>",
  },
  education: [
    {
      id: "edu_001",
      institution: "Tribhuvan University",
      degree: "Bachelor",
      field: "Computer Science",
      startDate: "2016-01-01T00:00:00.000Z",
      endDate: "2020-01-01T00:00:00.000Z",
      current: false,
    },
    {
      id: "edu_002",
      institution: "Kathmandu Model College",
      degree: "Higher Secondary",
      field: "Science",
      startDate: "2014-01-01T00:00:00.000Z",
      endDate: "2016-01-01T00:00:00.000Z",
      current: false,
    },
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
      description: "<ul><li>Led development of microservices architecture serving 100k+ users</li><li>Reduced API response time by 40% through caching and query optimization</li><li>Mentored a team of 4 junior developers</li></ul>",
    },
    {
      id: "exp_002",
      company: "Digital Agency Nepal",
      position: "Frontend Developer",
      location: "Lalitpur, Nepal",
      startDate: "2020-06-01T00:00:00.000Z",
      endDate: "2022-02-01T00:00:00.000Z",
      current: false,
      description: "<ul><li>Built responsive web applications using React and TypeScript</li><li>Improved website performance score from 62 to 94 on Lighthouse</li></ul>",
    },
  ],
  skills: [
    { id: "sk_001", name: "React.js" },
    { id: "sk_002", name: "Next.js" },
    { id: "sk_003", name: "TypeScript" },
    { id: "sk_004", name: "Node.js" },
    { id: "sk_005", name: "PostgreSQL" },
    { id: "sk_006", name: "MongoDB" },
    { id: "sk_007", name: "Docker" },
    { id: "sk_008", name: "AWS" },
  ],
  languages: [
    { id: "lang_001", name: "Nepali (Native)" },
    { id: "lang_002", name: "English (Fluent)" },
    { id: "lang_003", name: "Hindi (Conversational)" },
  ],
  certificates: [
    {
      id: "cert_001",
      name: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
      date: "2023-05-01T00:00:00.000Z",
      credentialId: "AWS-DEV-2023-001",
    },
    {
      id: "cert_002",
      name: "Meta React Developer Certificate",
      issuer: "Meta / Coursera",
      date: "2022-08-01T00:00:00.000Z",
      credentialId: "META-REACT-2022",
    },
  ],
  projects: [
    {
      id: "proj_001",
      name: "KaamHub Resume Builder",
      description: "<ul><li>Built a full-stack resume builder with Next.js 15 and Convex DB</li><li>Implemented 7 professional PDF templates using jsPDF</li></ul>",
      githubUrl: "https://github.com/ramhari/kaamhub-resume",
    },
    {
      id: "proj_002",
      name: "E-Commerce Platform",
      description: "<ul><li>Developed a multi-vendor e-commerce platform with React and Node.js</li><li>Integrated Stripe payment gateway and order management system</li></ul>",
      githubUrl: "https://github.com/ramhari/ecommerce",
    },
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
      linkedin: "https://linkedin.com/in/sanjaymaharjan",
    },
  ],
  selectedTemplate: "classic",
};

function mergePrefill(prefill: Partial<ResumeData>): ResumeData {
  return {
    ...initialResumeData,
    ...prefill,
    personalInfo: {
      ...initialResumeData.personalInfo,
      ...(prefill.personalInfo ?? {}),
    },
  };
}

// ✅ CHANGE 2 — return hardcoded data when ?data= param exists
function getPrefillFromUrl(): Partial<ResumeData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('data')) {
      console.log('[ResumeContext] ?data= param found — loading sample data ✅');
      return SAMPLE_RESUME_DATA;
    }
    return null;
  } catch {
    return null;
  }
}

interface ResumeContextType {
  resumeData: ResumeData;
  isSyncing: boolean;
  lastSaved: Date | null;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateExperience: (experience: ResumeData['experience']) => void;
  updateEducation: (education: ResumeData['education']) => void;
  updateSkills: (skills: ResumeData['skills']) => void;
  updateLanguages: (languages: ResumeData['languages']) => void;
  updateCertificates: (certificates: ResumeData['certificates']) => void;
  updateProjects: (projects: ResumeData['projects']) => void;
  updateReferences: (references: ResumeData['references']) => void;
  updateTemplate: (template: string) => void;
  clearResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);
ResumeContext.displayName = 'ResumeContext';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const isInitialised  = useRef(false);
  const prefillApplied = useRef(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { if (data.userId) setUserId(data.userId); })
      .catch(() => setUserId(null));
  }, []);

  const savedResume          = useQuery(api.resumes.getResume, userId ? { userId } : 'skip');
  const saveResumeMutation   = useMutation(api.resumes.saveResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isSyncing, setIsSyncing]   = useState(false);
  const [lastSaved, setLastSaved]   = useState<Date | null>(null);

  // ✅ 1. FIRST — check URL for prefill on mount
  useEffect(() => {
    const prefill = getPrefillFromUrl();
    if (prefill) {
      setResumeData(mergePrefill(prefill));
      prefillApplied.current = true;
      console.log('[ResumeContext] Prefill applied from URL ✅');
    }
  }, []);

  // ✅ 2. Load from localStorage — skip if prefill applied
  useEffect(() => {
    if (!userId) return;
    if (prefillApplied.current) return;
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      if (saved) setResumeData(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [userId]);

  // ✅ 3. Save to localStorage on every change
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(resumeData));
    } catch { /* ignore */ }
  }, [resumeData, userId]);

  // ✅ 4. Hydrate from Convex — skip if prefill applied
  useEffect(() => {
    if (!userId) return;
    if (savedResume === undefined) return;
    if (isInitialised.current) return;
    isInitialised.current = true;

    if (prefillApplied.current) {
      console.log('[ResumeContext] Prefill active — skipping Convex hydration ✅');
      return;
    }

    if (!savedResume) {
      setResumeData(initialResumeData);
      return;
    }

    setResumeData({
      personalInfo: {
        fullName: savedResume.fullName  ?? '',
        email:    savedResume.email     ?? '',
        phone:    savedResume.phone     ?? '',
        location: savedResume.location  ?? '',
        linkedin: savedResume.linkedin  ?? '',
        github:   savedResume.github    ?? '',
        summary:  savedResume.summary   ?? '',
        // title:    savedResume.jobTitle  ?? '',
      },
      education:        JSON.parse(savedResume.education    || '[]'),
      experience:       JSON.parse(savedResume.experience   || '[]'),
      skills:           JSON.parse(savedResume.skills       || '[]'),
      languages:        JSON.parse(savedResume.languages    || '[]'),
      certificates:     JSON.parse(savedResume.certificates || '[]'),
      projects:         JSON.parse(savedResume.projects     || '[]'),
      references:       JSON.parse(savedResume.references   || '[]'),
      selectedTemplate: savedResume.selectedTemplate ?? 'classic',
    });
  }, [savedResume, userId]);

  // ✅ 5. Auto-save to Convex with 1s debounce
  useEffect(() => {
    if (!isInitialised.current || !userId) return;
    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const p = resumeData.personalInfo;
        await saveResumeMutation({
          userId,
          fullName:         p.fullName,
          email:            p.email,
          phone:            p.phone,
          location:         p.location,
          linkedin:         p.linkedin,
          github:           p.github,
          summary:          p.summary,
          // jobTitle:         p.title ?? '',
          education:        JSON.stringify(resumeData.education),
          experience:       JSON.stringify(resumeData.experience),
          skills:           JSON.stringify(resumeData.skills),
          languages:        JSON.stringify(resumeData.languages),
          certificates:     JSON.stringify(resumeData.certificates),
          projects:         JSON.stringify(resumeData.projects   ?? []),
          references:       JSON.stringify(resumeData.references ?? []),
          selectedTemplate: resumeData.selectedTemplate,
        });
        setLastSaved(new Date());
      } catch (err) {
        console.error('[ResumeContext] Convex save failed:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeData, userId, saveResumeMutation]);

  const updatePersonalInfo = useCallback(
    (info: Partial<ResumeData['personalInfo']>) =>
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      })),
    []
  );
  const updateExperience   = useCallback((experience: ResumeData['experience'])     => setResumeData((prev) => ({ ...prev, experience })),   []);
  const updateEducation    = useCallback((education: ResumeData['education'])       => setResumeData((prev) => ({ ...prev, education })),    []);
  const updateSkills       = useCallback((skills: ResumeData['skills'])             => setResumeData((prev) => ({ ...prev, skills })),       []);
  const updateLanguages    = useCallback((languages: ResumeData['languages'])       => setResumeData((prev) => ({ ...prev, languages })),    []);
  const updateCertificates = useCallback((certificates: ResumeData['certificates']) => setResumeData((prev) => ({ ...prev, certificates })), []);
  const updateProjects     = useCallback((projects: ResumeData['projects'])         => setResumeData((prev) => ({ ...prev, projects })),     []);
  const updateReferences   = useCallback((references: ResumeData['references'])     => setResumeData((prev) => ({ ...prev, references })),   []);
  const updateTemplate     = useCallback((selectedTemplate: string)                 => setResumeData((prev) => ({ ...prev, selectedTemplate })), []);

  const clearResume = useCallback(async () => {
    if (userId) {
      try {
        await deleteResumeMutation({ userId });
        localStorage.removeItem(getStorageKey(userId));
      } catch (err) {
        console.error('[ResumeContext] Convex delete failed:', err);
      }
    }
    setResumeData(initialResumeData);
  }, [userId, deleteResumeMutation]);

  const value = useMemo<ResumeContextType>(
    () => ({
      resumeData,
      isSyncing,
      lastSaved,
      updatePersonalInfo,
      updateExperience,
      updateEducation,
      updateSkills,
      updateLanguages,
      updateCertificates,
      updateProjects,
      updateReferences,
      updateTemplate,
      clearResume,
    }),
    [
      resumeData,
      isSyncing,
      lastSaved,
      updatePersonalInfo,
      updateExperience,
      updateEducation,
      updateSkills,
      updateLanguages,
      updateCertificates,
      updateProjects,
      updateReferences,
      updateTemplate,
      clearResume,
    ]
  );

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
}

export const usePersonalInfo     = () => useResume().resumeData.personalInfo;
export const useEducation        = () => useResume().resumeData.education;
export const useExperience       = () => useResume().resumeData.experience;
export const useSkills           = () => useResume().resumeData.skills;
export const useLanguages        = () => useResume().resumeData.languages;
export const useCertificates     = () => useResume().resumeData.certificates;
export const useProjects         = () => useResume().resumeData.projects;
export const useReferences       = () => useResume().resumeData.references;
export const useSelectedTemplate = () => useResume().resumeData.selectedTemplate;