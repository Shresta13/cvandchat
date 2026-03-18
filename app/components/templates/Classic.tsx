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
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
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
        <div className="mb-5">
          {/* ✅ Heading — text-sm (bigger) */}
          <h2 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-widest border-b border-gray-300 pb-1">
            Summary
          </h2>
          {/* ✅ Paragraph — text-xs (smaller) */}
          <div
            className="text-gray-600 text-xs leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-5">
          {/* ✅ Heading — text-sm */}
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  {/* ✅ Job title — text-xs bold */}
                  <h3 className="font-bold text-gray-900 text-xs">{exp.position}</h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {/* ✅ Company — text-xs italic */}
                <p className="text-xs text-gray-500 italic mb-1">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </p>
                {/* ✅ Description — text-xs */}
                {exp.description && (
                  <div
                    className="text-gray-600 text-xs leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-5">
          {/* ✅ Heading — text-sm */}
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  {/* ✅ Degree — text-xs bold */}
                  <h3 className="font-bold text-gray-900 text-xs">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                {/* ✅ Institution — text-xs italic */}
                <p className="text-xs text-gray-500 italic">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-5">
          {/* ✅ Heading — text-sm */}
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Skills
          </h2>
          {/* ✅ Items — text-xs */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            {data.skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-5">
          {/* ✅ Heading — text-sm */}
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Languages
          </h2>
          {/* ✅ Items — text-xs */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
            {data.languages.map((lang) => (
              <li key={lang.id} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                {lang.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certificates */}
      {data.certificates.length > 0 && (
        <div className="mb-5">
          {/* ✅ Heading — text-sm */}
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certificates.map((cert) => (
              <div key={cert.id} className="text-xs">
                <div className="flex flex-wrap justify-between items-start gap-1">
                  {/* ✅ Cert name — text-xs bold */}
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  {cert.date && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-gray-500">
                  <span>{cert.issuer}</span>
                  {cert.credentialId && (
                    <span className="text-gray-400">· ID: {cert.credentialId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex flex-wrap justify-between items-start gap-1 mb-0.5">
                  <h3 className="font-bold text-gray-900 text-xs">{project.name}</h3>
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
                    className="text-gray-600 text-xs leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-widest border-b border-gray-300 pb-1">
            References
          </h2>
          <div className="space-y-2">
            {data.references.map((reference) => (
              <div key={reference.id} className="text-xs text-gray-600">
                <p className="font-semibold text-gray-900">{reference.name}</p>
                <p>
                  {reference.position}
                  {reference.company ? `, ${reference.company}` : ''}
                </p>
                <p>
                  {[reference.email, reference.phone].filter(Boolean).join(' | ')}
                  {reference.relationship ? ` | ${reference.relationship}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}