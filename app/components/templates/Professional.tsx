import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';
import type { ResumeData } from '../types/resume';

interface ProfessionalTemplateProps {
  data: ResumeData;
}

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const formatYear = (date: string) => {
  if (!date) return '';
  return `${new Date(date).getUTCFullYear()}`;
};

const toSafeUrl = (value: string) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const toDisplayUrl = (value: string) => value.replace(/^https?:\/\//i, '');

const sectionTitle = {
  fontSize: '11px',
  fontWeight: 700,
  marginBottom: '8px',
  marginTop: '8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#2a2a2a',
  borderBottom: '1.5px solid #2a2a2a',
  paddingBottom: '3px',
};

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const { personalInfo, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div
      className="bg-white w-full"
      style={{
        minHeight: '297mm',
        fontFamily: '"Source Serif 4", Georgia, serif',
        fontSize: '10px',
        lineHeight: '1.6',
        color: '#1a1a1a',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        .prof-template [data-html] ul {
          list-style: disc;
          padding-left: 1.2rem;
          margin: 3px 0;
        }
        .prof-template [data-html] ul li {
          margin: 2px 0;
          line-height: 1.55;
        }
        .prof-template [data-html] ul li::before {
          display: none !important;
          content: none !important;
        }
        .prof-template [data-html] p {
          margin: 2px 0;
          line-height: 1.6;
        }
      `}</style>

      <div className="prof-template">

        {/* ── HEADER ── */}
        <div style={{
          backgroundColor: '#2a2a2a',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Source Sans 3", sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '3px',
              lineHeight: '1.2',
            }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p style={{ fontSize: '10px', color: '#ccc', letterSpacing: '0.05em' }}>
                {personalInfo.title}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#ddd' }}>
                <Phone size={10} /><span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#ddd' }}>
                <Mail size={10} /><span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#ddd' }}>
                <MapPin size={10} /><span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#ddd' }}>
                <Linkedin size={10} />
                <a href={toSafeUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#ddd', textDecoration: 'none' }}>
                  {toDisplayUrl(personalInfo.linkedin)}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#ddd' }}>
                <Github size={10} />
                <a href={toSafeUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#ddd', textDecoration: 'none' }}>
                  {toDisplayUrl(personalInfo.github)}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '16px 24px' }}>

          {/* SUMMARY */}
          {personalInfo.summary && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={sectionTitle}>Summary</h2>
              <div
                data-html
                style={{ fontSize: '10px', lineHeight: '1.7', color: '#444' }}
                dangerouslySetInnerHTML={{ __html: personalInfo.summary }}
              />
            </div>
          )}

          {/* TWO COLUMN */}
          <div style={{ display: 'flex', gap: '24px' }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ width: '35%' }}>

              {/* Education */}
              {education.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Education</h2>
                  {education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: '10px' }}>
                      <p style={{ fontWeight: 600, fontSize: '10px', color: '#1a1a1a', lineHeight: '1.3' }}>
                        {edu.institution}
                      </p>
                      <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: '2px 0' }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </p>
                      <p style={{ fontSize: '9px', color: '#888' }}>
                        {formatYear(edu.startDate)}{(edu.endDate || edu.current) ? ` – ${edu.current ? 'Present' : formatYear(edu.endDate)}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Skills</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {skills.map((s) => (
                      <li key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '9px', color: '#444', marginBottom: '3px' }}>
                        <span style={{ color: '#888', marginTop: '1px', flexShrink: 0 }}>•</span>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Languages</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {languages.map((l) => (
                      <li key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#444', marginBottom: '3px' }}>
                        <span style={{ color: '#888', flexShrink: 0 }}>•</span>
                        {l.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certificates */}
              {certificates?.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Certifications</h2>
                  {certificates.map((c) => (
                    <div key={c.id} style={{ marginBottom: '6px' }}>
                      <p style={{ fontWeight: 600, fontSize: '9px', color: '#1a1a1a', lineHeight: '1.3' }}>{c.name}</p>
                      <p style={{ fontSize: '8px', color: '#666', fontStyle: 'italic' }}>{c.issuer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ References — left column */}
              {data.references && data.references.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>References</h2>
                  {data.references.map((ref) => (
                    <div key={ref.id} style={{ marginBottom: '10px' }}>
                      <p style={{ fontWeight: 600, fontSize: '10px', color: '#1a1a1a', lineHeight: '1.3' }}>
                        {ref.name}
                      </p>
                      <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: '1px 0' }}>
                        {ref.position}{ref.company ? ` · ${ref.company}` : ''}
                      </p>
                      {ref.phone && (
                        <p style={{ fontSize: '8px', color: '#888' }}>Phone: {ref.phone}</p>
                      )}
                      {ref.email && (
                        <p style={{ fontSize: '8px', color: '#888' }}>Email: {ref.email}</p>
                      )}
                      {ref.relationship && (
                        <p style={{ fontSize: '8px', color: '#aaa' }}>({ref.relationship})</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ width: '65%' }}>

              {/* Experience */}
              {experience.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                        <p style={{ fontWeight: 700, fontSize: '10px', color: '#1a1a1a', fontFamily: '"Source Sans 3", sans-serif' }}>
                          {exp.position}
                        </p>
                        <p style={{ fontSize: '8px', color: '#888', flexShrink: 0, marginLeft: '6px' }}>
                          {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#666', marginBottom: '4px' }}>
                        {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                      </p>
                      {exp.description && (
                        <div
                          data-html
                          style={{ fontSize: '9px', lineHeight: '1.6', color: '#444' }}
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects?.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <h2 style={sectionTitle}>Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <p style={{ fontWeight: 700, fontSize: '10px', color: '#1a1a1a', fontFamily: '"Source Sans 3", sans-serif' }}>
                          {proj.name}
                        </p>
                        {proj.githubUrl && (
                          <a
                            href={toSafeUrl(proj.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '8px', color: '#888', marginLeft: '6px', flexShrink: 0 }}
                          >
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
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}