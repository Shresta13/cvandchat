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

const STORAGE_KEY = 'cvgenerator_resume_data';

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
  selectedTemplate: 'classic',
};

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
  updateTemplate: (template: string) => void;
  clearResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);
ResumeContext.displayName = 'ResumeContext';

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const isInitialised = useRef(false);

  // ✅ Get real user ID from auth cookie via API
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.userId) setUserId(data.userId);
      })
      .catch(() => setUserId(null));
  }, []);

  const savedResume        = useQuery(api.resumes.getResume, userId ? { userId } : 'skip');
  const saveResumeMutation = useMutation(api.resumes.saveResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window === 'undefined') return initialResumeData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialResumeData;
    } catch {
      return initialResumeData;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ✅ Mirror every change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch {}
  }, [resumeData]);

  // ✅ Hydrate from Convex once when query resolves
  useEffect(() => {
    if (!userId) return;
    if (savedResume === undefined) return;
    if (isInitialised.current) return;
    isInitialised.current = true;

    if (!savedResume) return;

    setResumeData({
      personalInfo: {
        fullName: savedResume.fullName  ?? '',
        email:    savedResume.email     ?? '',
        phone:    savedResume.phone     ?? '',
        location: savedResume.location  ?? '',
        linkedin: savedResume.linkedin  ?? '',
        github:   savedResume.github    ?? '',
        summary:  savedResume.summary   ?? '',
        title:    savedResume.jobTitle  ?? '',
      },
      education:        JSON.parse(savedResume.education    || '[]'),
      experience:       JSON.parse(savedResume.experience   || '[]'),
      skills:           JSON.parse(savedResume.skills       || '[]'),
      languages:        JSON.parse(savedResume.languages    || '[]'),
      certificates:     JSON.parse(savedResume.certificates || '[]'),
      selectedTemplate: savedResume.selectedTemplate ?? 'classic',
    });
  }, [savedResume, userId]);

  // ✅ Auto-save to Convex with 1s debounce
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
          jobTitle:         p.title ?? '',
          education:        JSON.stringify(resumeData.education),
          experience:       JSON.stringify(resumeData.experience),
          skills:           JSON.stringify(resumeData.skills),
          languages:        JSON.stringify(resumeData.languages),
          certificates:     JSON.stringify(resumeData.certificates),
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

  const updateExperience = useCallback(
    (experience: ResumeData['experience']) =>
      setResumeData((prev) => ({ ...prev, experience })),
    []
  );

  const updateEducation = useCallback(
    (education: ResumeData['education']) =>
      setResumeData((prev) => ({ ...prev, education })),
    []
  );

  const updateSkills = useCallback(
    (skills: ResumeData['skills']) =>
      setResumeData((prev) => ({ ...prev, skills })),
    []
  );

  const updateLanguages = useCallback(
    (languages: ResumeData['languages']) =>
      setResumeData((prev) => ({ ...prev, languages })),
    []
  );

  const updateCertificates = useCallback(
    (certificates: ResumeData['certificates']) =>
      setResumeData((prev) => ({ ...prev, certificates })),
    []
  );

  const updateTemplate = useCallback(
    (selectedTemplate: string) =>
      setResumeData((prev) => ({ ...prev, selectedTemplate })),
    []
  );

  const clearResume = useCallback(async () => {
    if (userId) {
      try {
        await deleteResumeMutation({ userId });
      } catch (err) {
        console.error('[ResumeContext] Convex delete failed:', err);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
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
export const useSelectedTemplate = () => useResume().resumeData.selectedTemplate;