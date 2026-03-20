import { Mail, Phone, MapPin, Linkedin, Github, Link as LinkIcon } from 'lucide-react';
import type { ResumeData } from '../types/resume';

interface ClassicTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const toSafeUrl = (value: string) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const toDisplayUrl = (value: string) => value.replace(/^https?:\/\//i, '');

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  return (
    <div
      className="bg-white p-6 sm:p-8 shadow-lg w-full"
      style={{ minHeight: '297mm', fontFamily: 'Georgia, serif' }}
    >
      {/* Header */}
      <div className="text-center mb-3 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 text-xs text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail size={12} />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone size={12} />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <a
              href={toSafeUrl(data.personalInfo.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-900"
            >
              <Linkedin size={12} />
              <span>{toDisplayUrl(data.personalInfo.linkedin)}</span>
            </a>
          )}
          {data.personalInfo.github && (
            <a 
              href={toSafeUrl(data.personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-900"
            >
              <Github size={12} />
              <span>{toDisplayUrl(data.personalInfo.github)}</span>
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Summary
          </h2>
          <div
            className="text-xs text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic mb-1">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </p>
                {exp.description && (
                  <div
                    className="text-xs text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Skills
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            {data.skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}

{/* ✅ Languages — ADD HERE */}
{data.languages?.length > 0 && (
  <div className="mb-3">
    <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
      Languages
    </h2>
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
      {data.languages.map((lang) => (
        <li key={lang.id} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {lang.name}
        </li>
      ))}
    </ul>
  </div>
)}

{/* ✅ Certificates — ADD HERE */}
{data.certificates?.length > 0 && (
  <div className="mb-3">
    <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
      Certifications
    </h2>
    <div className="space-y-2">
      {data.certificates.map((cert) => (
        <div key={cert.id} className="flex flex-wrap justify-between items-start gap-1">
          <div>
            <p className="text-xs font-bold text-gray-900">{cert.name}</p>
            <p className="text-xs text-gray-500 italic">
              {cert.issuer}
              {cert.credentialId && (
                <span className="text-gray-400"> · ID: {cert.credentialId}</span>
              )}
            </p>
          </div>
          {cert.date && (
            <span className="text-xs text-gray-400 shrink-0">
              {formatDate(cert.date)}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)}


      {/* Projects */}
      {data.projects?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                  {project.githubUrl && (
                    <a
                      href={toSafeUrl(project.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
                    >
                      <LinkIcon size={11} />
                      {toDisplayUrl(project.githubUrl)}
                    </a>
                  )}
                </div>
                {project.description && (
                  <div
                    className="text-xs text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.references.map((ref) => (
              <div key={ref.id}>
                <p className="font-bold text-gray-900 text-sm">{ref.name}</p>
                {ref.position && (
                  <p className="text-xs text-gray-500 italic">
                    {ref.position}{ref.company ? `, ${ref.company}` : ''}
                  </p>
                )}
                {ref.relationship && (
                  <p className="text-xs text-gray-400">{ref.relationship}</p>
                )}
                <div className="mt-1 space-y-0.5">
                  {ref.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Mail size={11} />
                      <a href={`mailto:${ref.email}`} className="hover:text-gray-900">{ref.email}</a>
                    </div>
                  )}
                  {ref.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone size={11} />
                      <span>{ref.phone}</span>
                    </div>
                  )}
                  {ref.linkedin && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Linkedin size={11} />
                      <a
                        href={toSafeUrl(ref.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-900"
                      >
                        {toDisplayUrl(ref.linkedin)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}