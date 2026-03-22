import { Check, AlertCircle } from "lucide-react";
import { useResume } from "./context/ResumeContext";

interface Step {
  number: number;
  title: string;
}

interface SidebarProps {
  currentStep: number;
  steps: Step[];
}

export default function Sidebar({ currentStep, steps }: SidebarProps) {
  const { resumeData } = useResume();

  const isStepFilled = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(
          resumeData.personalInfo.fullName &&
          resumeData.personalInfo.email &&
          resumeData.personalInfo.phone &&
          resumeData.personalInfo.location
        );
      case 2:
        return (
          resumeData.education.length > 0 &&
          resumeData.education.every((e) => e.institution && e.degree)
        );
      case 3:
        return (
          resumeData.experience.length > 0 &&
          resumeData.experience.every((e) => e.company && e.position)
        );
      case 4:
        return resumeData.skills.length > 0;
      case 5:
        return resumeData.languages.length > 0;
      case 6:
        return (
          resumeData.certificates.length > 0 &&
          resumeData.certificates.every((c) => c.name && c.issuer)
        );
      // ✅ ADDED — was missing, causing orange circle
      case 7:
        return resumeData.projects.length > 0;
      // ✅ ADDED — was missing, causing orange circle
      case 8:
        return resumeData.references.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="hidden w-56 shrink-0 flex-col justify-between border-r border-gray-100 bg-white p-5 shadow-sm lg:flex">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-7 tracking-tight">
          Resume Builder
        </h2>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const passed      = currentStep > step.number;
            const filled      = isStepFilled(step.number);
            const isCompleted = passed && filled;
            const isSkipped   = passed && !filled;
            const isCurrent   = currentStep === step.number;

            return (
              <div key={step.number} className="relative group">
                <div className="flex items-center">

                  {/* Circle */}
                  <div
                    className={`
                      relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
                      transition-all duration-300 shrink-0
                      ${isCompleted ? "bg-green-700 text-white shadow-sm shadow-green-200" : ""}
                      ${isSkipped   ? "bg-orange-100 text-orange-500 border border-orange-300" : ""}
                      ${isCurrent   ? "text-white shadow-sm scale-105" : ""}
                      ${!isCompleted && !isSkipped && !isCurrent ? "bg-gray-200 text-gray-600 group-hover:bg-gray-300" : ""}
                    `}
                    style={isCurrent ? { backgroundColor: '#00273D' } : {}}
                  >
                    {isCompleted ? (
                      <Check size={14} />
                    ) : isSkipped ? (
                      <AlertCircle size={14} />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Title */}
                  <span
                    className={`
                      ml-3 text-sm font-medium transition-colors duration-200 truncate
                      ${isCompleted ? "text-gray-800" : ""}
                      ${isSkipped   ? "text-orange-500" : ""}
                      ${!isCompleted && !isSkipped && !isCurrent ? "text-gray-500" : ""}
                    `}
                    style={isCurrent ? { color: '#00273D' } : {}}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      absolute left-[17px] top-10 w-[2px] h-8 transition-colors duration-300
                      ${isCompleted ? "bg-green-600" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}