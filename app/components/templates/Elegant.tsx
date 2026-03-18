import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';
import type { ResumeData } from '../types/resume';

interface ElegantTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getUTCFullYear()}`;
};

const toSafeUrl = (value: string) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const toDisplayUrl = (value: string) => value.replace(/^https?:\/\//i, '');

const SectionTitle = ({ title }: { title: string }) => (
  <div style={{ marginBottom: '10px' }}>
    <h2 style={{
      fontFamily: '"Lato", sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#2a2a2a',
      paddingBottom: '4px',
      borderBottom: '1.5px solid #2a2a2a',
      display: 'block',
    }}>
      {title}
    </h2>
  </div>
);

export default function ElegantTemplate({ data }: ElegantTemplateProps) {
  const { personalInfo, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div
      className="bg-white w-full"
      style={{
        minHeight: '297mm',
        fontFamily: '"Libre Baskerville", Georgia, serif',
        fontSize: '10px',
        color: '#2a2a2a',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700;900&display=swap');

        .elegant-template [data-html] ul {
          list-style: disc;
          padding-left: 1.2rem;
          margin: 4px 0;
        }
        .elegant-template [data-html] ul li {
          margin: 3px 0;
          line-height: 1.6;
        }
        .elegant-template [data-html] ul li::before {
          display: none !important;
          content: none !important;
        }
        .elegant-template [data-html] p {
          margin: 3px 0;
          line-height: 1.7;
        }
      `}</style>

      <div className="elegant-template" style={{ padding: '36px 40px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <h1 style={{
            fontFamily: '"Lato", sans-serif',
            fontSize: '28px',
            fontWeight: '900',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#1a1a1a',
            marginBottom: '4px',
          }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '9px',
              fontWeight: '400',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: '12px',
            }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* ── Contact Bar ── */}
        {(personalInfo.phone || personalInfo.email || personalInfo.location || personalInfo.linkedin || personalInfo.github) && (
          <div style={{
            backgroundColor: '#f5f0eb',
            padding: '7px 16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}>
            {[
              personalInfo.phone,
              personalInfo.email,
              personalInfo.location,
              personalInfo.linkedin ? toDisplayUrl(personalInfo.linkedin) : null,
              personalInfo.github ? toDisplayUrl(personalInfo.github) : null,
            ].filter(Boolean).map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '9px',
                  color: '#555',
                  letterSpacing: '0.03em',
                }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ margin: '0 12px', color: '#aaa', fontSize: '11px' }}>|</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* ── Summary ── */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Professional Summary" />
            <div
              data-html
              style={{ fontSize: '10px', lineHeight: '1.75', color: '#444', textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
            />
          </div>
        )}

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Experience" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  {/* Company + Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                    <p style={{
                      fontFamily: '"Lato", sans-serif',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                    }}>
                      {exp.company}
                    </p>
                    <p style={{
                      fontFamily: '"Lato", sans-serif',
                      fontSize: '10px',
                      color: '#555',
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}>
                      {formatDate(exp.startDate)}{(exp.endDate || exp.current) ? `–${exp.current ? 'Present' : formatDate(exp.endDate)}` : ''}
                    </p>
                  </div>

                  {/* Position */}
                  <p style={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontSize: '10px',
                    fontStyle: 'italic',
                    color: '#666',
                    marginBottom: '5px',
                  }}>
                    {exp.position}{exp.location ? `, ${exp.location}` : ''}
                  </p>

                  {/* Description */}
                  {exp.description && (
                    <div
                      data-html
                      style={{ fontSize: '10px', lineHeight: '1.65', color: '#444' }}
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Education" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{
                      fontFamily: '"Lato", sans-serif',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                    }}>
                      {edu.institution}
                    </p>
                    <p style={{
                      fontFamily: '"Lato", sans-serif',
                      fontSize: '10px',
                      color: '#555',
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}>
                      {formatDate(edu.startDate)}{(edu.endDate || edu.current) ? `–${edu.current ? 'Present' : formatDate(edu.endDate)}` : ''}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontStyle: 'italic',
                    fontSize: '10px',
                    color: '#666',
                  }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Projects ── */}
        {projects && projects.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Projects" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{
                      fontFamily: '"Lato", sans-serif',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                    }}>
                      {proj.name}
                    </p>
                    {proj.githubUrl && (
                      <a
                        href={toSafeUrl(proj.githubUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '9px', color: '#888', marginLeft: '8px', flexShrink: 0 }}
                      >
                        {toDisplayUrl(proj.githubUrl)}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <div
                      data-html
                      style={{ fontSize: '10px', lineHeight: '1.65', color: '#444' }}
                      dangerouslySetInnerHTML={{ __html: proj.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Skills" />
            <p style={{ fontSize: '10px', color: '#444', lineHeight: '1.7' }}>
              {skills.map(s => s.name).join('  •  ')}
            </p>
          </div>
        )}

        {/* ── Languages ── */}
        {languages.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Languages" />
            <p style={{ fontSize: '10px', color: '#444', lineHeight: '1.7' }}>
              {languages.map(l => l.name).join('  •  ')}
            </p>
          </div>
        )}

        {/* ── Certifications ── */}
        {certificates.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="Certifications" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {certificates.map((cert) => (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '10px', fontFamily: '"Lato", sans-serif' }}>{cert.name}</span>
                    <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}> — {cert.issuer}</span>
                    {cert.credentialId && (
                      <span style={{ fontSize: '9px', color: '#999' }}> (ID: {cert.credentialId})</span>
                    )}
                  </div>
                  {cert.date && (
                    <span style={{ fontSize: '9px', color: '#888', marginLeft: '8px', flexShrink: 0 }}>
                      {cert.date ? new Date(cert.date).getUTCFullYear() : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── References ── */}
        {data.references && data.references.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <SectionTitle title="References" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <p style={{ fontWeight: '700', fontSize: '10px', fontFamily: '"Lato", sans-serif', color: '#1a1a1a' }}>
                    {ref.name}
                  </p>
                  <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#666' }}>
                    {ref.position}{ref.company ? ` · ${ref.company}` : ''}
                  </p>
                  {ref.phone && <p style={{ fontSize: '9px', color: '#888' }}>Phone: {ref.phone}</p>}
                  {ref.email && <p style={{ fontSize: '9px', color: '#888' }}>Email: {ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}