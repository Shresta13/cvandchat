import { Mail, Phone, MapPin, Linkedin, Github, Calendar } from "lucide-react";
import type { ResumeData } from "../types/resume";

interface ModernTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const toSafeUrl = (value: string) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const toDisplayUrl = (value: string) =>
  value.replace(/^https?:\/\//i, "");

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="bg-white shadow-lg w-full" style={{ minHeight: "297mm" }}>

      {/* Header */}
      <div className="bg-gray-900 text-white px-6 sm:px-8 py-6 sm:py-8">
        {/* ✅ Name — largest element on page */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
          {data.personalInfo.fullName || "Your Name"}
        </h1>

        {/* Contact info */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-300">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="break-all">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            
             <a href={toSafeUrl(data.personalInfo.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-80"
            >
              <Linkedin className="w-3.5 h-3.5 shrink-0" />
              <span className="break-all">{toDisplayUrl(data.personalInfo.linkedin)}</span>
            </a>
          )}
          {data.personalInfo.github && (
            <a
              href={toSafeUrl(data.personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-80"
            >
              <Github className="w-3.5 h-3.5 shrink-0" />
              <span className="break-all">{toDisplayUrl(data.personalInfo.github)}</span>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-8 py-6 sm:py-8">

        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-7">
            {/* ✅ Section heading — clearly bigger than paragraph */}
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Professional Summary
            </h2>
            {/* ✅ Paragraph — noticeably smaller */}
            <div
              className="text-gray-600 text-[11px] sm:text-base leading-relaxed mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Work Experience
            </h2>
            <div className="space-y-5 mt-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                    <div className="min-w-0">
                      {/* ✅ Job title — medium, bold */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {exp.position}
                      </h3>
                      {/* ✅ Company — slightly smaller, muted */}
                      <p className="text-sm text-gray-500 font-medium">
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(exp.startDate)} –{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                  {/* ✅ Description — smallest, body text */}
                  {exp.description && (
                    <div
                      className="text-gray-600 text-sm leading-relaxed mt-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4 mt-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-start gap-1">
                    <div className="min-w-0">
                      {/* ✅ Degree — medium bold */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                      </h3>
                      {/* ✅ Institution — smaller muted */}
                      <p className="text-sm text-gray-500">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(edu.startDate)} –{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm font-medium border border-gray-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.languages.map((lang) => (
                <span
                  key={lang.id}
                  className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium border"
                  style={{
                    backgroundColor: '#EAF1F5',
                    borderColor: '#B7CBD7',
                    color: '#00273D',
                  }}
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <section className="mb-7">
            <h2 className="text-xl sm:text-xl font-bold text-gray-900 mb-2 pb-1.5 border-b-2 border-gray-800 uppercase tracking-wide">
              Certifications
            </h2>
            <div className="space-y-3 mt-3">
              {data.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-wrap justify-between items-start gap-1"
                >
                  <div className="min-w-0">
                    {/* ✅ Cert name — medium bold */}
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{cert.name}</h4>
                    {/* ✅ Issuer — smaller muted */}
                    <p className="text-xs sm:text-sm text-gray-500">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>
                    )}
                  </div>
                  {cert.date && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}