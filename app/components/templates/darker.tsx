import { User } from 'lucide-react';
import type { ResumeData } from '../types/resume';
import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';

interface DarkSidebarTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return '';
  return `${new Date(date).getUTCFullYear()}`;
};

const toDisplayUrl = (value: string) =>
  value.replace(/^https?:\/\//i, '');

const cleanHTML = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};

const SectionTitle = ({ title, light = false }: { title: string; light?: boolean }) => (
  <h2
    style={{
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'uppercase',
      color: light ? '#fff' : '#1a2940',
      borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.3)' : '#ccc'}`,
      paddingBottom: '6px',
      marginBottom: '12px',
      marginTop: '20px',
    }}
  >
    {title}
  </h2>
);

export default function DarkSidebarTemplate({ data }: DarkSidebarTemplateProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    languages,
    references,
  } = data;

  return (
    <div
      className="darker-template-root"
      style={{
        minHeight: '297mm',
        fontFamily: '"Open Sans", sans-serif',
        fontSize: '12px',
        lineHeight: '1.6',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .darker-template-layout {
            flex-direction: column !important;
          }
          .darker-template-left {
            width: 100% !important;
            padding: 20px 16px !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
          }
          .darker-template-left > div {
            flex: 1 1 140px;
          }
          .darker-template-right {
            width: 100% !important;
            padding: 20px 16px !important;
          }
          .darker-template-avatar {
            width: 70px !important;
            height: 70px !important;
          }
          .darker-template-name {
            font-size: 22px !important;
          }
          .darker-template-footer {
            padding: 12px 16px !important;
          }
        }
      `}</style>

      {/* MAIN LAYOUT */}
      <div className="darker-template-layout" style={{ display: 'flex', width: '100%', flex: 1 }}>

        {/* LEFT SIDEBAR */}
        <div
          className="darker-template-left"
          style={{
            width: '35%',
            backgroundColor: '#1a2940',
            padding: '30px 20px',
            color: '#fff',
            boxSizing: 'border-box',
          }}
        >
          {/* Avatar */}
          <div
            className="darker-template-avatar"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              flexShrink: 0,
            }}
          >
            <User size={40} color="rgba(255,255,255,0.6)" />
          </div>

          {/* CONTACT */}
          <SectionTitle title="Contact" light />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Phone size={14} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Mail size={14} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <MapPin size={14} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Linkedin size={14} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{toDisplayUrl(personalInfo.linkedin)}</span>
              </div>
            )}
            {personalInfo.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Github size={14} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{toDisplayUrl(personalInfo.github)}</span>
              </div>
            )}
          </div>

          {/* SKILLS */}
          {skills?.length > 0 && (
            <div>
              <SectionTitle title="Skills" light />
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {skills.map((skill, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          {languages?.length > 0 && (
            <div>
              <SectionTitle title="Languages" light />
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {languages.map((lang, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{lang.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* REFERENCES */}
          {references?.length > 0 && (
            <div>
              <SectionTitle title="References" light />
              {references.map((ref) => (
                <div key={ref.id} style={{ marginBottom: '12px' }}>
                  <p style={{ fontWeight: 600, margin: '0 0 2px' }}>{ref.name}</p>
                  <p style={{ margin: '0 0 2px' }}>{ref.position}{ref.company ? `, ${ref.company}` : ''}</p>
                  <p style={{ margin: '0 0 2px', wordBreak: 'break-all' }}>{ref.phone}</p>
                  <p style={{ margin: 0, wordBreak: 'break-all' }}>{ref.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div
          className="darker-template-right"
          style={{
            width: '65%',
            padding: '30px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* NAME */}
          <h1
            className="darker-template-name"
            style={{ fontSize: '30px', fontWeight: 800, marginBottom: '4px', marginTop: 0 }}
          >
            {personalInfo.fullName}
          </h1>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px', marginTop: 0 }}>
            {personalInfo.title}
          </p>

          {/* SUMMARY */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1a2940', marginTop: 0 }}>
                Summary
              </p>
              <div
                style={{ fontSize: '12px', lineHeight: '1.7', color: '#444' }}
                dangerouslySetInnerHTML={{ __html: cleanHTML(personalInfo.summary) }}
              />
            </div>
          )}

          {/* EXPERIENCE */}
          {experience?.length > 0 && (
            <div>
              <SectionTitle title="Work Experience" />
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                    {exp.position}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 500, margin: '0 0 2px' }}>
                    {exp.company}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px', marginTop: 0 }}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <div
                      style={{ fontSize: '12px', lineHeight: '1.7', color: '#444' }}
                      className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-1 [&_li]:mt-0.5 [&_strong]:font-bold [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: cleanHTML(exp.description) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {education?.length > 0 && (
            <div>
              <SectionTitle title="Education" />
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: '12px', margin: '0 0 2px' }}>{edu.institution}</p>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* FOOTER — inside right column, pushes to bottom */}
          <div
            className="darker-template-footer"
            style={{
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
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
      </div>
    </div>
  );
}