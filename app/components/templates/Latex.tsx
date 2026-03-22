import type { ResumeData } from "../types/resume";

interface LatexTemplateProps {
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

const toDisplayUrl = (value: string) => value.replace(/^https?:\/\//i, "");

// ✅ Section heading — bigger, bolder
const SectionHeader = ({ title }: { title: string }) => (
  <div
    style={{
      fontSize: "18px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      borderBottom: "1px solid #000",
      paddingBottom: "2px",
      marginBottom: "12px",
    }}
  >
    {title}
  </div>
);

export default function LatexTemplate({ data }: LatexTemplateProps) {
  return (
    <div
      className="bg-white w-full px-6 sm:px-10 md:px-16 py-8 sm:py-10 md:py-12"
      style={{
        minHeight: "297mm",
        fontFamily: '"Computer Modern", "Latin Modern", Georgia, serif',
        fontSize: "12px", // ✅ base body text smaller
        color: "#000",
      }}
    >
      {/* Name */}
      <div className="text-center mb-2">
        <h1
          className="text-3xl font-normal tracking-wide mb-2"
          style={{ letterSpacing: "0.05em" }}
        >
          {data.personalInfo.fullName || "Your Name"}
        </h1>

        {/* Contact row */}
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-1" style={{ fontSize: "12px" }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.location && (
            <>
              <span className="text-gray-400">|</span>
              <span>{data.personalInfo.location}</span>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span className="text-gray-400">|</span>
              <a
                href={toSafeUrl(data.personalInfo.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00008B", textDecoration: "underline" }}
              >
                {toDisplayUrl(data.personalInfo.linkedin)}
              </a>
            </>
          )}
          {data.personalInfo.github && (
            <>
              <span className="text-gray-400">|</span>
              <a
                href={toSafeUrl(data.personalInfo.github)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00008B", textDecoration: "underline" }}
              >
                {toDisplayUrl(data.personalInfo.github)}
              </a>
            </>
          )}
        </div>
      </div>

      <hr style={{ borderTop: "1px solid #000", margin: "8px 0 10px 0" }} />

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-3">
          <SectionHeader title="Summary" />
          {/* ✅ Body text — 9px */}
          <div
            className="leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
            style={{ fontSize: "12px", textAlign: "justify", color: "#222" }}
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="Experience" />
          <div className="flex flex-col gap-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-baseline gap-1">
                  {/* ✅ Job title — 11px bold */}
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {exp.position}
                  </span>
                  {/* ✅ Date — 9px */}
                  <span style={{ fontSize: "12px", fontStyle: "italic", color: "#444" }} className="shrink-0">
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                {/* ✅ Company — 9px italic */}
                <div style={{ fontStyle: "italic", fontSize: "12px", color: "#555" }}>
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {/* ✅ Description — 9px */}
                {exp.description && (
                  <div
                    className="mt-1 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                    style={{ fontSize: "12px", color: "#222" }}
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
        <div className="mb-3">
          <SectionHeader title="Education" />
          <div className="flex flex-col gap-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-wrap justify-between items-baseline gap-1">
                  {/* ✅ Degree — 11px bold */}
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </span>
                  {/* ✅ Date — 9px */}
                  <span style={{ fontSize: "12px", fontStyle: "italic", color: "#444" }} className="shrink-0">
                    {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                {/* ✅ Institution — 9px italic */}
                <div style={{ fontStyle: "italic", fontSize: "12px", color: "#555" }}>
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="Skills" />
          {/* ✅ Skills — 9px */}
          <div className="flex flex-wrap gap-x-1 gap-y-1" style={{ fontSize: "12px" }}>
            {data.skills.map((skill, index) => (
              <span key={skill.id}>
                <span style={{ fontWeight: "bold" }}>{skill.name}</span>
                {index < data.skills.length - 1 && (
                  <span style={{ color: "#999" }}>,</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="Languages" />
          {/* ✅ Languages — 9px */}
          <div className="flex flex-wrap gap-x-1 gap-y-1" style={{ fontSize: "12px" }}>
            {data.languages.map((lang, index) => (
              <span key={lang.id}>
                <span style={{ fontWeight: "bold" }}>{lang.name}</span>
                {index < data.languages.length - 1 && (
                  <span style={{ color: "#999" }}>,</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certificates.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="Certifications" />
          <div className="flex flex-col gap-2">
            {data.certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-wrap justify-between items-baseline gap-1"
                style={{ fontSize: "12px" }}
              >
                <div>
                  {/* ✅ Cert name — bold */}
                  <span style={{ fontWeight: "bold" }}>{cert.name}</span>
                  <span style={{ fontStyle: "italic", color: "#444" }}>
                    {" "}— {cert.issuer}
                  </span>
                  {cert.credentialId && (
                    <span style={{ color: "#666" }}> (ID: {cert.credentialId})</span>
                  )}
                </div>
                {cert.date && (
                  <span style={{ fontStyle: "italic" }} className="shrink-0">
                    {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-3">
          <SectionHeader title="Projects" />
          <div className="flex flex-col gap-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex flex-wrap justify-between items-baseline gap-1">
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {project.name}
                  </span>
                  {project.githubUrl && (
                    <a
                      href={toSafeUrl(project.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#00008B', textDecoration: 'underline' }}
                      className="shrink-0"
                    >
                      {toDisplayUrl(project.githubUrl)}
                    </a>
                  )}
                </div>
                {project.description && (
                  <div
                    className="mt-1 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                    style={{ fontSize: '12px', color: '#222' }}
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
        <div className="mb-3">
          <SectionHeader title="References" />
          <div className="flex flex-col gap-2">
            {data.references.map((reference) => (
              <div key={reference.id} style={{ fontSize: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{reference.name}</div>
                <div style={{ fontStyle: 'italic', color: '#444' }}>
                  {reference.position}
                  {reference.company ? `, ${reference.company}` : ''}
                </div>
                <div style={{ color: '#666' }}>
                  {[reference.email, reference.phone].filter(Boolean).join(' | ')}
                  {reference.relationship ? ` | ${reference.relationship}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

<div
            className="two-col-footer"
            style={{
              marginTop: 'auto',
              padding: '10px',
              borderTop: '1px solid #e0e0e0',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
              Generated by{' '}
              <a
                href="https://kaamhubs.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#aaa', textDecoration: 'underline' }}
              >
                kaamhubs.com
              </a>
            </p>
          </div>
    </div>
  );
}