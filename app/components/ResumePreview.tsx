'use client';

import { useState, useEffect } from 'react';
import { useResume } from './context/ResumeContext';
import ClassicTemplate from './templates/Classic';
import ModernTemplate from './templates/Modern';
import LatexTemplate from './templates/Latex';
import { generateClassicPDF, generateModernPDF, generateLatexPDF} from './pdfgenerator'

const templates = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: '2',       name: 'Modern',  component: ModernTemplate  },
  { id: 'latex',   name: 'LaTeX',   component: LatexTemplate   },
];

export default function ResumePreview() {
  const { resumeData, updateTemplate } = useResume();
  const [downloading, setDownloading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const selectedId = resumeData.selectedTemplate || 'classic';
  const currentTemplate = templates.find((t) => t.id === selectedId) || templates[0];
  const TemplateComponent = currentTemplate.component;

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      if (selectedId === 'classic')    generateClassicPDF(resumeData);
      else if (selectedId === '2')     generateModernPDF(resumeData);
      else if (selectedId === 'latex') generateLatexPDF(resumeData);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Top bar */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Preview</h2>
            <div className="flex gap-2 flex-wrap">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => updateTemplate(template.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedId === template.id
                      ? 'text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  style={
                    selectedId === template.id
                      ? { backgroundColor: '#00273D' }
                      : {}
                  }
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{ backgroundColor: '#00273D' }}
            onMouseEnter={(e) => {
              if (!downloading) e.currentTarget.style.backgroundColor = '#001D2E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00273D';
            }}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Resume preview */}
        <div className="shadow-xl">
          {isHydrated && <TemplateComponent data={resumeData} />}
        </div>

      </div>
    </div>
  );
}