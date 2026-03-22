'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import ResumePreview from './ResumePreview';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import SkillsStep from './steps/SkillsStep';
import ProjectsStep from './steps/Projects';
import ReferencesStep from './steps/Reference';
import LanguageStep from './steps/Language';
import CertificatesStep from './steps/CertificatesStep';
import { useResume } from './context/ResumeContext';
import { toast, Toaster } from 'sonner'; // ✅ import both

const brand = {
  primary: '#00273D',
  primaryDark: '#001D2E',
};

const steps = [
  { number: 1, title: 'Personal Info',  component: PersonalInfoStep  },
  { number: 2, title: 'Education',      component: EducationStep      },
  { number: 3, title: 'Experience',     component: ExperienceStep     },
  { number: 4, title: 'Skills',         component: SkillsStep         },
  { number: 5, title: 'Languages',      component: LanguageStep       },
  { number: 6, title: 'Certificates',   component: CertificatesStep   },
  { number: 7, title: 'Projects',       component: ProjectsStep       },
  { number: 8, title: 'References',     component: ReferencesStep     },
];

type View = 'form' | 'preview';

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isHydrated, setIsHydrated]   = useState(false);
  const [mobileView, setMobileView]   = useState<View>('form');
  const { resumeData } = useResume();

  useEffect(() => { setIsHydrated(true); }, []);

  const CurrentStepComponent = steps[currentStep - 1].component;
  const currentStepMeta      = steps[currentStep - 1];

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        resumeData.personalInfo.fullName &&
        resumeData.personalInfo.email &&
        resumeData.personalInfo.phone &&
        resumeData.personalInfo.location
      );
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields before proceeding.', {
        duration: 3000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ✅ complete handler with toast
  const handleComplete = () => {
    toast.success('Resume completed!', {
      description: 'You can now download your resume from the preview panel.',
      duration: 4000,
    });
  };

  if (!isHydrated) return null;

  return (
    <div
      className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ✅ Toaster must be inside the component tree */}
      <Toaster position="bottom-right" richColors />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Step {currentStep} / {steps.length}
          </p>
          <p className="truncate text-sm font-bold text-gray-900">
            {currentStepMeta.title}
          </p>
        </div>

        {/* Form / Preview toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button
            onClick={() => setMobileView('form')}
            className="rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
            style={
              mobileView === 'form'
                ? { backgroundColor: brand.primary, color: '#fff' }
                : { color: '#6b7280' }
            }
          >
            Form
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
            style={
              mobileView === 'preview'
                ? { backgroundColor: brand.primary, color: '#fff' }
                : { color: '#6b7280' }
            }
          >
            <Eye size={12} />
            Preview
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentStep={currentStep} steps={steps} />
        </div>

        {/* Form panel */}
        <div
          className={`flex flex-col ${
            mobileView === 'preview'
              ? 'hidden'
              : 'flex flex-1 lg:flex-1 lg:max-w-[50%]'
          }`}
        >
          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <CurrentStepComponent />
          </div>

          {/* Navigation footer */}
          <div className="border-t border-gray-100 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-3">

              {/* Previous */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {/* Step dots */}
              <div className="flex items-center gap-1">
                {steps.map((s) => (
                  <div
                    key={s.number}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        s.number === currentStep
                          ? brand.primary
                          : s.number < currentStep
                          ? '#4a7a9b'
                          : '#e5e7eb',
                      width: s.number === currentStep ? '20px' : '6px',
                    }}
                  />
                ))}
              </div>

              {/* Next / Complete */}
              {currentStep < steps.length ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md active:scale-95"
                  style={{ backgroundColor: brand.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                // ✅ FIXED complete button — no more export inside JSX
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md active:scale-95"
                  style={{ backgroundColor: brand.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.primaryDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.primary)}
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div
          className={`overflow-hidden border-l border-gray-200 ${
            mobileView === 'preview'
              ? 'flex flex-1'
              : 'hidden lg:flex lg:flex-1'
          }`}
        >
          <ResumePreview />
        </div>

      </div>
    </div>
  );
}