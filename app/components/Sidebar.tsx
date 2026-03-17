import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface SidebarProps {
  currentStep: number;
  steps: Step[];
}

export default function Sidebar({ currentStep, steps }: SidebarProps) {
  return (
    <div className="hidden w-56 shrink-0 flex-col justify-between border-r border-gray-100 bg-white p-5 shadow-sm lg:flex">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-7 tracking-tight">
          Resume Builder
        </h2>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="relative group">
                <div className="flex items-center">
                  {/* Circle */}
                  <div
                    className={`
                      relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
                      transition-all duration-300 shrink-0
                      ${isCompleted ? "bg-[#00273D] text-white shadow-sm shadow-[#B7CBD7]" : ""}
                      ${isCurrent ? "bg-[#00273D] text-white shadow-sm scale-105" : ""}
                      ${!isCompleted && !isCurrent ? "bg-gray-200 text-gray-600 group-hover:bg-gray-300" : ""}
                    `}
                  >
                    {isCompleted ? <Check size={14} /> : step.number}
                  </div>

                  {/* Title */}
                  <span
                    className={`
                      ml-3 text-sm font-medium transition-colors duration-200 truncate
                      ${isCompleted ? "text-gray-800" : ""}
                      ${!isCompleted && !isCurrent ? "text-gray-500" : ""}
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
                      ${isCompleted ? "bg-[#00273D]" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro Tip */}
      <div
        className="mt-6 p-3 rounded-xl border"
        style={{ backgroundColor: '#EAF1F5', borderColor: '#B7CBD7' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#00273D' }}>
          Pro Tip
        </p>
        <p className="text-xs text-gray-700 leading-relaxed">
          Keep your resume to one page. Recruiters spend only 6–8 seconds reviewing it.
        </p>
      </div>
    </div>
  );
}