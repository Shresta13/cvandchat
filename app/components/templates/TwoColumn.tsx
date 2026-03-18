import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';
import type { ResumeData } from '../types/resume';

interface TwoColumnTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const formatDateShort = (date: string) => {
  if (!date) return '';
  return `${new Date(date).getUTCFullYear()}`;
};

const toSafeUrl = (value: string) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const toDisplayUrl = (value: string) => value.replace(/^https?:\/\//i, '');

const SectionTitle = ({ title }: { title: string }) => (
  <div style={{ marginBottom: '8px', marginTop: '2px' }}>
    <h2 style={{
      fontFamily: '"Lato", sans-serif',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: '#1a1a1a',
      borderBottom: '1.5px solid #1a1a1a',
      paddingBottom: '2px',
      display: 'block',
    }}>
      {title}
    </h2>
  </div>
);

export default function TwoColumnTemplate({ data }: TwoColumnTemplateProps) {
  const { personalInfo, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div
      className="bg-white w-full"
      style={{
        minHeight: '297mm',
        fontFamily: '"Libre Baskerville", Georgia, serif',
        fontSize: '10px',
        color: '#1a1a1a',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .two-col-template * { box-sizing: border-box; }
        .two-col-template [data-html] ul {
          list-style: disc;
          padding-left: 1rem;
          margin: 3px 0;
        }
        .two-col-template [data-html] ul li {
          margin: 2px 0;
          line-height: 1.5;
        }
        .two-col-template [data-html] ul li::before {
          display: none !important;
          content: none !important;
        }
      `}</style>

      <div className="two-col-template" style={{ display: 'flex', minHeight: '297mm' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{
          width: '36%',
          padding: '24px 16px 24px 20px',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>

          {/* Name block */}
          <div style={{ marginBottom: '14px' }}>
            <h1 style={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              lineHeight: '1.1',
              color: '#1a1a1a',
              marginBottom: '4px',
            }}>
              {personalInfo.fullName ? (
                personalInfo.fullName.split(' ').map((word, i) => (
                  <span key={i} style={{ display: 'block' }}>{word}</span>
                ))
              ) : (
                <span>Your Name</span>
              )}
            </h1>
            {personalInfo.title && (
              <p style={{
                fontFamily: '"Lato", sans-serif',
                fontSize: '8px',
                fontWeight: '300',
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
                color: '#666',
                marginTop: '4px',
              }}>
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '9px' }}>
                <Phone size={9} style={{ flexShrink: 0 }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '9px' }}>
                <Mail size={9} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '9px' }}>
                <MapPin size={9} style={{ flexShrink: 0 }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '9px' }}>
                <Linkedin size={9} style={{ flexShrink: 0 }} />
                <a href={toSafeUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#555', wordBreak: 'break-all' }}>
                  {toDisplayUrl(personalInfo.linkedin)}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '9px' }}>
                <Github size={9} style={{ flexShrink: 0 }} />
                <a href={toSafeUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#555', wordBreak: 'break-all' }}>
                  {toDisplayUrl(personalInfo.github)}
                </a>
              </div>
            )}
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Education" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p style={{ fontSize: '8px', color: '#888', fontFamily: '"Lato", sans-serif', letterSpacing: '0.04em' }}>
                      {formatDateShort(edu.startDate)}{edu.endDate || edu.current ? ` – ${edu.current ? 'Present' : formatDateShort(edu.endDate)}` : ''}
                    </p>
                    <p style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginTop: '2px', fontFamily: '"Lato", sans-serif', lineHeight: '1.3' }}>
                      {edu.institution}
                    </p>
                    {edu.degree && (
                      <p style={{ fontSize: '9px', color: '#555', marginTop: '1px' }}>
                        • {edu.degree}{edu.field ? ` of ${edu.field}` : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Skills" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {skills.map((skill) => (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#444' }}>
                    <span style={{ color: '#888', flexShrink: 0 }}>•</span>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Languages" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {languages.map((lang) => (
                  <div key={lang.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#444' }}>
                    <span style={{ color: '#888', flexShrink: 0 }}>•</span>
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Certifications" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {certificates.map((cert) => (
                  <div key={cert.id}>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.3' }}>{cert.name}</p>
                    <p style={{ fontSize: '8px', color: '#888' }}>{cert.issuer}{cert.date ? ` · ${formatDate(cert.date)}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{
          width: '64%',
          padding: '24px 20px 24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>

          {/* Profile / Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Profile" />
              <div
                data-html
                style={{ fontSize: '9px', lineHeight: '1.65', color: '#444' }}
                dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
              />
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Work Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: '#1a1a1a', display: 'inline-block', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '8px', color: '#888', fontFamily: '"Lato", sans-serif' }}>
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                        {exp.company ? `  ·  ${exp.company}${exp.location ? `, ${exp.location}` : ''}` : ''}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '10px', fontWeight: '700', color: '#1a1a1a',
                      marginLeft: '12px', marginBottom: '3px',
                      fontFamily: '"Lato", sans-serif', letterSpacing: '0.02em',
                    }}>
                      {exp.position}
                    </p>
                    {exp.description && (
                      <div
                        data-html
                        style={{ fontSize: '9px', lineHeight: '1.6', color: '#444', marginLeft: '12px' }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="Projects" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#1a1a1a', fontFamily: '"Lato", sans-serif' }}>
                        {proj.name}
                      </p>
                      {proj.githubUrl && (
                        <a href={toSafeUrl(proj.githubUrl)} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '8px', color: '#888', flexShrink: 0 }}>
                          {toDisplayUrl(proj.githubUrl)}
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <div
                        data-html
                        style={{ fontSize: '9px', lineHeight: '1.6', color: '#444' }}
                        dangerouslySetInnerHTML={{ __html: proj.description }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {data.references && data.references.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <SectionTitle title="References" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {data.references.map((ref) => (
                  <div key={ref.id}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#1a1a1a', fontFamily: '"Lato", sans-serif' }}>
                      {ref.name}
                    </p>
                    <p style={{ fontSize: '9px', color: '#555' }}>
                      {ref.position}{ref.company ? ` · ${ref.company}` : ''}
                    </p>
                    {ref.phone && <p style={{ fontSize: '8px', color: '#888' }}>Phone: {ref.phone}</p>}
                    {ref.email && <p style={{ fontSize: '8px', color: '#888' }}>Email: {ref.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}