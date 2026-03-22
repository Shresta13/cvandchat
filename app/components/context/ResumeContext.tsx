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

function decodeBase64JsonParam(encoded: string): unknown {
  try {
    return JSON.parse(encoded);
  } catch (e) {
    // Support legacy base64 and URL-safe base64 values in query params.
    const normalized = encoded
      .replace(/ /g, '+')
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }
}

function encodeBase64JsonParam(value: unknown): string {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

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

  // 1. refs first
  const isInitialised = useRef(false);

  // 2. state declarations — must be before any useEffect that uses them
  const [userId, setUserId]         = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isSyncing, setIsSyncing]   = useState(false);
  const [lastSaved, setLastSaved]   = useState<Date | null>(null);

  // 3. get logged in user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { if (data.userId) setUserId(data.userId); })
      .catch(() => setUserId(null));
  }, []);

  // 4. PREFILL — reads ?prefill= from URL on mount and fills all forms
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params  = new URLSearchParams(window.location.search);
    const encoded = params.get('prefill');
    if (!encoded) return;

    console.log('[ResumeContext] prefill param found, decoding...');

    try {
      const decoded = decodeBase64JsonParam(encoded) as Partial<ResumeData>;

      console.log('[ResumeContext] decoded successfully:', decoded.personalInfo?.fullName);

      setResumeData({
        personalInfo: {
          fullName: decoded.personalInfo?.fullName ?? '',
          email:    decoded.personalInfo?.email    ?? '',
          phone:    decoded.personalInfo?.phone    ?? '',
          location: decoded.personalInfo?.location ?? '',
          title:    decoded.personalInfo?.title    ?? '',
          linkedin: decoded.personalInfo?.linkedin ?? '',
          github:   decoded.personalInfo?.github   ?? '',
          summary:  decoded.personalInfo?.summary  ?? '',
        },
        experience:       decoded.experience   ?? [],
        education:        decoded.education    ?? [],
        skills:           decoded.skills       ?? [],
        languages:        decoded.languages    ?? [],
        certificates:     decoded.certificates ?? [],
        projects:         decoded.projects     ?? [],
        references:       decoded.references   ?? [],
        selectedTemplate: decoded.selectedTemplate ?? 'classic',
      });

      // prevent Convex and localStorage from overwriting prefilled data
      isInitialised.current = true;

      console.log('[ResumeContext] prefill applied successfully');

    } catch (err) {
      console.error('[ResumeContext] prefill failed:', err);
    }
  }, []); // runs once on mount only

  // 5. Convex queries
  const savedResume          = useQuery(api.resumes.getResume, userId ? { userId } : 'skip');
  const saveResumeMutation   = useMutation(api.resumes.saveResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  // 6. load from localStorage
  useEffect(() => {
    if (!userId) return;
    if (isInitialised.current) return; // skip if prefill was applied
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      if (saved) setResumeData(JSON.parse(saved));
    } catch {}
  }, [userId]);

  // 7. save to localStorage on every change
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(resumeData));
    } catch {}
  }, [resumeData, userId]);

  // 7b. keep dashboard URL in sync with the currently loaded resume JSON
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isInitialised.current) return;

    const timer = setTimeout(() => {
      try {
        const encoded = encodeBase64JsonParam(resumeData);
        const url = new URL(window.location.href);

        if (url.searchParams.get('prefill') === encoded) return;

        url.searchParams.set('prefill', encoded);
        window.history.replaceState({}, '', url.toString());

        try {
          localStorage.setItem('last_prefill_resume_url', `${url.pathname}${url.search}`);
        } catch {}
      } catch (err) {
        console.error('[ResumeContext] URL prefill sync failed:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [resumeData]);

  // 8. hydrate from Convex once — skipped if prefill was applied
  useEffect(() => {
    if (!userId) return;
    if (savedResume === undefined) return;
    if (isInitialised.current) return; // skips if prefill already ran
    isInitialised.current = true;

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
        title:    (savedResume as { title?: string }).title ?? '',
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

  // 9. auto-save to Convex with 1s debounce
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
          education:        JSON.stringify(resumeData.education),
          experience:       JSON.stringify(resumeData.experience),
          skills:           JSON.stringify(resumeData.skills),
          languages:        JSON.stringify(resumeData.languages),
          certificates:     JSON.stringify(resumeData.certificates),
          projects:         JSON.stringify(resumeData.projects),
          references:       JSON.stringify(resumeData.references),
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

  // 10. all update callbacks
  const updatePersonalInfo = useCallback(
    (info: Partial<ResumeData['personalInfo']>) =>
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      })), []
  );
  const updateExperience   = useCallback((experience: ResumeData['experience'])    => setResumeData((prev) => ({ ...prev, experience })),   []);
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
      resumeData, isSyncing, lastSaved,
      updatePersonalInfo, updateExperience, updateEducation,
      updateSkills, updateLanguages, updateCertificates,
      updateProjects, updateReferences, updateTemplate, clearResume,
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