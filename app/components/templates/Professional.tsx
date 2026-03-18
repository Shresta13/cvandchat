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
  fontSize: '16px',
  fontWeight: 700,
  marginBottom: '10px',
  marginTop: '8px',
};

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const { personalInfo, experience, education, skills, languages, certificates, projects } = data;

  return (
    <div
      className="bg-white w-full"
      style={{
        minHeight: '297mm',
        fontFamily: '"Source Serif 4", Georgia, serif',
        fontSize: '12px',
        lineHeight: '1.6', // ✅ readability
        color: '#1a1a1a',
        padding: '20px',
      }}
    >

      {/* HEADER */}
      <div style={{
        backgroundColor: '#2a2a2a',
        color: 'white',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: '16px', color: '#ccc', marginTop: '4px' }}>
            {personalInfo.title}
          </p>
        </div>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

  {personalInfo.phone && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Phone size={14} />
      <span>{personalInfo.phone}</span>
    </div>
  )}

  {personalInfo.email && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Mail size={14} />
      <span>{personalInfo.email}</span>
    </div>
  )}

  {personalInfo.location && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <MapPin size={14} />
      <span>{personalInfo.location}</span>
    </div>
  )}

  {personalInfo.linkedin && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Linkedin size={14} />
      <a
        href={toSafeUrl(personalInfo.linkedin)}
        target="_blank"
        style={{ color: '#ddd', textDecoration: 'none' }}
      >
        {toDisplayUrl(personalInfo.linkedin)}
      </a>
    </div>
  )}

  {personalInfo.github && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Github size={14} />
      <a
        href={toSafeUrl(personalInfo.github)}
        target="_blank"
        style={{ color: '#ddd', textDecoration: 'none' }}
      >
        {toDisplayUrl(personalInfo.github)}
      </a>
    </div>
  )}

</div>
      </div>

      {/* SUMMARY */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={sectionTitle}>Summary</h2>
          <div dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
        </div>
      )}

      {/* TWO COLUMN */}
      <div style={{ display: 'flex', gap: '30px' }}> {/* ✅ column gap */}

        {/* LEFT */}
        <div style={{ width: '35%' }}>

          {/* EDUCATION */}
          {education.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '16px' }}>{edu.institution}</strong>
                  <p>{edu.degree}</p>
                  <p>{formatYear(edu.startDate)} - {formatYear(edu.endDate)}</p>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Skills</h2>
              <ul style={{ paddingLeft: '16px' }}>
                {skills.map((s) => (
                  <li key={s.id} style={{ marginBottom: '6px' }}>{s.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Languages</h2>
              <ul style={{ paddingLeft: '16px' }}>
                {languages.map((l) => (
                  <li key={l.id} style={{ marginBottom: '6px' }}>{l.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CERTIFICATES */}
          {certificates?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Certificates</h2>
              {certificates.map((c) => (
                <p key={c.id} style={{ marginBottom: '6px' }}>
                  <strong>{c.name}</strong> - {c.issuer}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ width: '65%' }}>

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '16px' }}>{exp.position}</strong>
                  <p style={{ marginBottom: '4px' }}>
                    {exp.company} | {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {projects?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={sectionTitle}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '16px' }}>{p.name}</strong>
                  <div dangerouslySetInnerHTML={{ __html: p.description }} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}