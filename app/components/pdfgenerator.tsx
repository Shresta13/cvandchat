import jsPDF from 'jspdf';
import type { ResumeData } from './types/resume';

const BLACK  = [0, 0, 0] as const;
const DARK   = [30, 30, 30] as const;
const GRAY   = [90, 90, 90] as const;
const LGRAY  = [200, 200, 200] as const;

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const stripHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const formatDegree = (degree: string, field: string) => {
  if (!degree && !field) return '';
  if (!field || degree === field) return degree || field;
  if (!degree) return field;
  return `${degree} in ${field}`;
};

// ─────────────────────────────────────────────
// CLASSIC PDF
// ─────────────────────────────────────────────
export function generateClassicPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const mLeft    = 18;
  const mRight   = 18;
  const contentW = pageW - mLeft - mRight;
  let y = 22;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 18) { doc.addPage(); y = 22; }
  };

  const section = (title: string) => {
    checkPage(14);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), mLeft, y);
    y += 2.5;
    doc.setDrawColor(...LGRAY);
    doc.setLineWidth(0.4);
    doc.line(mLeft, y, pageW - mRight, y);
    y += 5;
  };

  // ── Name ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...BLACK);
  doc.text(data.personalInfo.fullName || 'Your Name', pageW / 2, y, { align: 'center' });
  y += 8;

  // ── Contact ──
  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github,
  ].filter(Boolean).join('  |  ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  const cLines = doc.splitTextToSize(contacts, contentW);
  cLines.forEach((line: string) => {
    doc.text(line, pageW / 2, y, { align: 'center' });
    y += 5;
  });
  y += 1;

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.6);
  doc.line(mLeft, y, pageW - mRight, y);
  y += 7;

  // ── Summary ──
  if (data.personalInfo.summary) {
    section('Summary');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 3;
  }

  // ── Experience ──
  if (data.experience.length > 0) {
    section('Professional Experience');
    data.experience.forEach((exp) => {
      checkPage(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', mLeft, y);
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, mLeft, y);
      y += 5.5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Education ──
  if (data.education.length > 0) {
    section('Education');
    data.education.forEach((edu) => {
      checkPage(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(formatDegree(edu.degree, edu.field), mLeft, y);
      const dateStr = `${formatDate(edu.startDate)} – ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(edu.institution || '', mLeft, y);
      y += 8;
    });
  }

  // ── Projects ──
  if (data.projects && data.projects.length > 0) {
    section('Projects');
    data.projects.forEach((proj) => {
      checkPage(18);

      // Project name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', mLeft, y);

      // GitHub URL — right aligned
      if (proj.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(proj.githubUrl, pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;

      // Description
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Skills ──
  if (data.skills.length > 0) {
    section('Skills');
    const skillText = data.skills.map(s => s.name).join('   •   ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(skillText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Languages ──
  if (data.languages.length > 0) {
    section('Languages');
    const langText = data.languages.map(l => l.name).join('   •   ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(langText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Certifications ──
  if (data.certificates.length > 0) {
    section('Certifications');
    data.certificates.forEach((cert) => {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(cert.name || '', mLeft, y);
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(formatDate(cert.date), pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      const issuerLine = `${cert.issuer || ''}${cert.credentialId ? `   •   ID: ${cert.credentialId}` : ''}`;
      doc.text(issuerLine, mLeft, y);
      y += 7;
    });
  }

  // ── References ──
  if (data.references && data.references.length > 0) {
    section('References');
    data.references.forEach((ref) => {
      checkPage(20);

      // Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', mLeft, y);
      y += 5.5;

      // Position at Company
      if (ref.position || ref.company) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text(`${ref.position || ''}${ref.company ? ` at ${ref.company}` : ''}`, mLeft, y);
        y += 5;
      }

      // Contact details
      const refContacts = [
        ref.email,
        ref.phone,
        ref.linkedin,
      ].filter(Boolean).join('   •   ');

      if (refContacts) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lines = doc.splitTextToSize(refContacts, contentW);
        doc.text(lines, mLeft, y);
        y += lines.length * 5;
      }

      // Relationship
      if (ref.relationship) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(`Relationship: ${ref.relationship}`, mLeft, y);
        y += 5;
      }

      y += 3;
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


// ─────────────────────────────────────────────
// MODERN PDF
// ─────────────────────────────────────────────
export function generateModernPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const mLeft    = 18;
  const mRight   = 18;
  const contentW = pageW - mLeft - mRight;
  let y = 0;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 18) { doc.addPage(); y = 22; }
  };

  const section = (title: string) => {
    checkPage(14);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...BLACK);
    doc.text(title, mLeft, y);
    y += 3;
    doc.setDrawColor(...LGRAY);
    doc.setLineWidth(0.4);
    doc.line(mLeft, y, pageW - mRight, y);
    y += 6;
  };

  // ── Dark header ──
  doc.setFillColor(31, 41, 55);
  doc.rect(0, 0, pageW, 50, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(data.personalInfo.fullName || 'Your Name', mLeft, 18);

  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github,
  ].filter(Boolean).join('   |   ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  const cLines = doc.splitTextToSize(contacts, contentW);
  cLines.forEach((line: string, i: number) => {
    doc.text(line, mLeft, 30 + i * 5);
  });

  y = cLines.length > 1 ? 58 : 60;

  // ── Summary ──
  if (data.personalInfo.summary) {
    section('Professional Summary');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 3;
  }

  // ── Experience ──
  if (data.experience.length > 0) {
    section('Work Experience');
    data.experience.forEach((exp) => {
      checkPage(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', mLeft, y);
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, mLeft, y);
      y += 5.5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Education ──
  if (data.education.length > 0) {
    section('Education');
    data.education.forEach((edu) => {
      checkPage(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(formatDegree(edu.degree, edu.field), mLeft, y);
      const dateStr = `${formatDate(edu.startDate)} – ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(edu.institution || '', mLeft, y);
      y += 8;
    });
  }

  // ── Projects ──
  if (data.projects && data.projects.length > 0) {
    section('Projects');
    data.projects.forEach((proj) => {
      checkPage(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', mLeft, y);
      if (proj.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(proj.githubUrl, pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Skills ──
  if (data.skills.length > 0) {
    section('Skills');
    const skillText = data.skills.map(s => s.name).join('   •   ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(skillText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Languages ──
  if (data.languages.length > 0) {
    section('Languages');
    const langText = data.languages.map(l => l.name).join('   •   ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(langText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Certifications ──
  if (data.certificates.length > 0) {
    section('Certifications');
    data.certificates.forEach((cert) => {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(cert.name || '', mLeft, y);
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(formatDate(cert.date), pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      const issuerLine = `${cert.issuer || ''}${cert.credentialId ? `   •   ID: ${cert.credentialId}` : ''}`;
      doc.text(issuerLine, mLeft, y);
      y += 7;
    });
  }

  // ── References ──
  if (data.references && data.references.length > 0) {
    section('References');
    data.references.forEach((ref) => {
      checkPage(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', mLeft, y);
      y += 5.5;
      if (ref.position || ref.company) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text(`${ref.position || ''}${ref.company ? ` at ${ref.company}` : ''}`, mLeft, y);
        y += 5;
      }
      const refContacts = [ref.email, ref.phone, ref.linkedin].filter(Boolean).join('   •   ');
      if (refContacts) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        const lines = doc.splitTextToSize(refContacts, contentW);
        doc.text(lines, mLeft, y);
        y += lines.length * 5;
      }
      if (ref.relationship) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(`Relationship: ${ref.relationship}`, mLeft, y);
        y += 5;
      }
      y += 3;
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


// ─────────────────────────────────────────────
// LATEX PDF
// ─────────────────────────────────────────────
export function generateLatexPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const mLeft    = 22;
  const mRight   = 22;
  const contentW = pageW - mLeft - mRight;
  let y = 22;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 18) { doc.addPage(); y = 22; }
  };

  const section = (title: string) => {
    checkPage(14);
    y += 5;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), mLeft, y);
    y += 2.5;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.5);
    doc.line(mLeft, y, pageW - mRight, y);
    y += 5.5;
  };

  // ── Name ──
  doc.setFont('times', 'normal');
  doc.setFontSize(22);
  doc.setTextColor(...BLACK);
  doc.text(data.personalInfo.fullName || 'Your Name', pageW / 2, y, { align: 'center' });
  y += 8;

  // ── Contact ──
  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github,
  ].filter(Boolean).join('  |  ');

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  const cLines = doc.splitTextToSize(contacts, contentW);
  cLines.forEach((line: string) => {
    doc.text(line, pageW / 2, y, { align: 'center' });
    y += 5;
  });
  y += 2;

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.6);
  doc.line(mLeft, y, pageW - mRight, y);
  y += 7;

  // ── Summary ──
  if (data.personalInfo.summary) {
    section('Summary');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 3;
  }

  // ── Experience ──
  if (data.experience.length > 0) {
    section('Experience');
    data.experience.forEach((exp) => {
      checkPage(22);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', mLeft, y);
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, mLeft, y);
      y += 5.5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Education ──
  if (data.education.length > 0) {
    section('Education');
    data.education.forEach((edu) => {
      checkPage(16);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(formatDegree(edu.degree, edu.field), mLeft, y);
      const dateStr = `${formatDate(edu.startDate)} – ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(edu.institution || '', mLeft, y);
      y += 8;
    });
  }

  // ── Projects ──
  if (data.projects && data.projects.length > 0) {
    section('Projects');
    data.projects.forEach((proj) => {
      checkPage(18);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', mLeft, y);
      if (proj.githubUrl) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        doc.text(proj.githubUrl, pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 5;
    });
  }

  // ── Skills ──
  if (data.skills.length > 0) {
    section('Skills');
    const skillText = data.skills.map(s => s.name).join(',   ');
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(skillText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Languages ──
  if (data.languages.length > 0) {
    section('Languages');
    const langText = data.languages.map(l => l.name).join(',   ');
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(langText, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 5;
  }

  // ── Certifications ──
  if (data.certificates.length > 0) {
    section('Certifications');
    data.certificates.forEach((cert) => {
      checkPage(14);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(cert.name || '', mLeft, y);
      if (cert.date) {
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text(formatDate(cert.date), pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      const issuerLine = `— ${cert.issuer || ''}${cert.credentialId ? `   (ID: ${cert.credentialId})` : ''}`;
      doc.text(issuerLine, mLeft, y);
      y += 7;
    });
  }

  // ── References ──
  if (data.references && data.references.length > 0) {
    section('References');
    data.references.forEach((ref) => {
      checkPage(20);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', mLeft, y);
      y += 5.5;
      if (ref.position || ref.company) {
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text(`${ref.position || ''}${ref.company ? ` at ${ref.company}` : ''}`, mLeft, y);
        y += 5;
      }
      const refContacts = [ref.email, ref.phone, ref.linkedin].filter(Boolean).join('   •   ');
      if (refContacts) {
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        const lines = doc.splitTextToSize(refContacts, contentW);
        doc.text(lines, mLeft, y);
        y += lines.length * 5;
      }
      if (ref.relationship) {
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text(`Relationship: ${ref.relationship}`, mLeft, y);
        y += 5;
      }
      y += 3;
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}

// ─────────────────────────────────────────────
// TWO COLUMN PDF
// ─────────────────────────────────────────────
export function generateTwoColumnPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const leftW  = pageW * 0.38;
  const rightW = pageW * 0.62;
  const mPad   = 8;
  let leftY    = 20;
  let rightY   = 20;

  const checkLeftPage  = (n: number) => { if (leftY  + n > pageH - 15) { doc.addPage(); leftY  = 20; rightY = 20; } };
  const checkRightPage = (n: number) => { if (rightY + n > pageH - 15) { doc.addPage(); leftY  = 20; rightY = 20; } };

  const leftSection = (title: string) => {
    checkLeftPage(12);
    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), mPad, leftY);
    leftY += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.line(mPad, leftY, leftW - mPad, leftY);
    leftY += 4;
  };

  const rightSection = (title: string) => {
    checkRightPage(12);
    rightY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), leftW + mPad, rightY);
    rightY += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.line(leftW + mPad, rightY, pageW - mPad, rightY);
    rightY += 4;
  };

  // ── Name (left column) ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...BLACK);
  const nameParts = (data.personalInfo.fullName || 'Your Name').split(' ');
  nameParts.forEach((word) => {
    doc.text(word.toUpperCase(), mPad, leftY);
    leftY += 7;
  });

  if (data.personalInfo.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(data.personalInfo.title.toUpperCase(), mPad, leftY);
    leftY += 6;
  }

  // Divider line
  doc.setDrawColor(...LGRAY);
  doc.setLineWidth(0.3);
  doc.line(mPad, leftY, leftW - mPad, leftY);
  leftY += 5;

  // ── Contact (left) ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  if (data.personalInfo.phone)    { doc.text(data.personalInfo.phone, mPad, leftY);    leftY += 4.5; }
  if (data.personalInfo.email)    { doc.text(data.personalInfo.email, mPad, leftY);    leftY += 4.5; }
  if (data.personalInfo.location) { doc.text(data.personalInfo.location, mPad, leftY); leftY += 4.5; }
  if (data.personalInfo.linkedin) { doc.text(data.personalInfo.linkedin.replace(/^https?:\/\//i,''), mPad, leftY); leftY += 4.5; }
  if (data.personalInfo.github)   { doc.text(data.personalInfo.github.replace(/^https?:\/\//i,''), mPad, leftY);   leftY += 4.5; }
  leftY += 3;

  // ── Education (left) ──
  if (data.education.length > 0) {
    leftSection('Education');
    data.education.forEach((edu) => {
      checkLeftPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...BLACK);
      const eduLines = doc.splitTextToSize(edu.institution || '', leftW - mPad * 2);
      doc.text(eduLines, mPad, leftY);
      leftY += eduLines.length * 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      if (edu.degree) doc.text(`• ${edu.degree}${edu.field ? ` of ${edu.field}` : ''}`, mPad, leftY);
      leftY += 4.5;
      const dateStr = `${formatDate(edu.startDate)}${edu.current ? ' – Present' : edu.endDate ? ` – ${formatDate(edu.endDate)}` : ''}`;
      if (dateStr.trim() !== '–') doc.text(dateStr, mPad, leftY);
      leftY += 5;
    });
  }

  // ── Skills (left) ──
  if (data.skills.length > 0) {
    leftSection('Skills');
    data.skills.forEach((s) => {
      checkLeftPage(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...DARK);
      doc.text(`• ${s.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // ── Languages (left) ──
  if (data.languages.length > 0) {
    leftSection('Languages');
    data.languages.forEach((l) => {
      checkLeftPage(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...DARK);
      doc.text(`• ${l.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // ── Certifications (left) ──
  if (data.certificates.length > 0) {
    leftSection('Certifications');
    data.certificates.forEach((cert) => {
      checkLeftPage(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...BLACK);
      const certLines = doc.splitTextToSize(cert.name || '', leftW - mPad * 2);
      doc.text(certLines, mPad, leftY);
      leftY += certLines.length * 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text(cert.issuer || '', mPad, leftY);
      leftY += 5;
    });
  }

  // ── RIGHT COLUMN ──

  // ── Summary (right) ──
  if (data.personalInfo.summary) {
    rightSection('Profile');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, rightW - mPad * 2);
    checkRightPage(lines.length * 5);
    doc.text(lines, leftW + mPad, rightY);
    rightY += lines.length * 5 + 4;
  }

  // ── Experience (right) ──
  if (data.experience.length > 0) {
    rightSection('Work Experience');
    data.experience.forEach((exp) => {
      checkRightPage(20);
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(`${dateStr}  ·  ${exp.company}${exp.location ? `, ${exp.location}` : ''}`, leftW + mPad, rightY);
      rightY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', leftW + mPad, rightY);
      rightY += 5.5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, rightW - mPad * 2);
        checkRightPage(lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  // ── Projects (right) ──
  if (data.projects && data.projects.length > 0) {
    rightSection('Projects');
    data.projects.forEach((proj) => {
      checkRightPage(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', leftW + mPad, rightY);
      if (proj.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(proj.githubUrl.replace(/^https?:\/\//i,''), pageW - mPad, rightY, { align: 'right' });
      }
      rightY += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, rightW - mPad * 2);
        checkRightPage(lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  // ── References (right) ──
  if (data.references && data.references.length > 0) {
    rightSection('References');
    data.references.forEach((ref) => {
      checkRightPage(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', leftW + mPad, rightY);
      rightY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`${ref.position || ''}${ref.company ? ` · ${ref.company}` : ''}`, leftW + mPad, rightY);
      rightY += 4.5;
      const refContacts = [ref.phone, ref.email].filter(Boolean).join('   •   ');
      if (refContacts) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(refContacts, leftW + mPad, rightY);
        rightY += 5;
      }
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


// ─────────────────────────────────────────────
// ELEGANT PDF
// ─────────────────────────────────────────────
export function generateElegantPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const mLeft    = 20;
  const mRight   = 20;
  const contentW = pageW - mLeft - mRight;
  let y = 22;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 18) { doc.addPage(); y = 22; }
  };

  const section = (title: string) => {
    checkPage(12);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), mLeft, y);
    y += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.5);
    doc.line(mLeft, y, pageW - mRight, y);
    y += 5;
  };

  // ── Name ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...BLACK);
  doc.text((data.personalInfo.fullName || 'Your Name').toUpperCase(), pageW / 2, y, { align: 'center' });
  y += 7;

  if (data.personalInfo.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(data.personalInfo.title.toUpperCase(), pageW / 2, y, { align: 'center' });
    y += 5;
  }

  // ── Contact bar ──
  const contacts = [
    data.personalInfo.phone,
    data.personalInfo.email,
    data.personalInfo.location,
    data.personalInfo.linkedin?.replace(/^https?:\/\//i,''),
    data.personalInfo.github?.replace(/^https?:\/\//i,''),
  ].filter(Boolean).join('  |  ');

  doc.setFillColor(245, 240, 235);
  doc.rect(mLeft, y, contentW, 8, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(contacts, pageW / 2, y + 5, { align: 'center' });
  y += 13;

  // ── Summary ──
  if (data.personalInfo.summary) {
    section('Professional Summary');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5.5);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 3;
  }

  // ── Experience ──
  if (data.experience.length > 0) {
    section('Experience');
    data.experience.forEach((exp) => {
      checkPage(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(exp.company || '', mLeft, y);
      const dateStr = `${new Date(exp.startDate).getUTCFullYear()}${exp.current ? '–Present' : exp.endDate ? `–${new Date(exp.endDate).getUTCFullYear()}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.position}${exp.location ? `, ${exp.location}` : ''}`, mLeft, y);
      y += 5.5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 4;
    });
  }

  // ── Education ──
  if (data.education.length > 0) {
    section('Education');
    data.education.forEach((edu) => {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(edu.institution || '', mLeft, y);
      const dateStr = `${new Date(edu.startDate).getUTCFullYear()}${edu.current ? '–Present' : edu.endDate ? `–${new Date(edu.endDate).getUTCFullYear()}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, mLeft, y);
      y += 7;
    });
  }

  // ── Projects ──
  if (data.projects && data.projects.length > 0) {
    section('Projects');
    data.projects.forEach((proj) => {
      checkPage(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', mLeft, y);
      if (proj.githubUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(proj.githubUrl.replace(/^https?:\/\//i,''), pageW - mRight, y, { align: 'right' });
      }
      y += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, contentW);
        checkPage(lines.length * 5.5);
        doc.text(lines, mLeft, y);
        y += lines.length * 5.5;
      }
      y += 4;
    });
  }

  // ── Skills ──
  if (data.skills.length > 0) {
    section('Skills');
    const skillText = data.skills.map(s => s.name).join('  •  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(skillText, contentW);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 4;
  }

  // ── Languages ──
  if (data.languages.length > 0) {
    section('Languages');
    const langText = data.languages.map(l => l.name).join('  •  ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(langText, contentW);
    doc.text(lines, mLeft, y);
    y += lines.length * 5.5 + 4;
  }

  // ── Certifications ──
  if (data.certificates.length > 0) {
    section('Certifications');
    data.certificates.forEach((cert) => {
      checkPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(cert.name || '', mLeft, y);
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(`${new Date(cert.date).getUTCFullYear()}`, pageW - mRight, y, { align: 'right' });
      }
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`— ${cert.issuer || ''}`, mLeft, y);
      y += 6;
    });
  }

  // ── References ──
  if (data.references && data.references.length > 0) {
    section('References');
    data.references.forEach((ref) => {
      checkPage(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', mLeft, y);
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`${ref.position || ''}${ref.company ? ` · ${ref.company}` : ''}`, mLeft, y);
      y += 4.5;
      if (ref.phone) { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text(`Phone: ${ref.phone}`, mLeft, y); y += 4.5; }
      if (ref.email) { doc.text(`Email: ${ref.email}`, mLeft, y); y += 5; }
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


// ─────────────────────────────────────────────
// PROFESSIONAL PDF (two-column with dark header)
// ─────────────────────────────────────────────
export function generateProfessionalPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const leftW  = pageW * 0.38;
  const mPad   = 8;
  let leftY    = 52;
  let rightY   = 52;

  const checkPage = (side: 'left' | 'right', n: number) => {
    const y = side === 'left' ? leftY : rightY;
    if (y + n > pageH - 15) { doc.addPage(); leftY = 20; rightY = 20; }
  };

  const leftSection = (title: string) => {
    checkPage('left', 12);
    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), mPad, leftY);
    leftY += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.line(mPad, leftY, leftW - mPad, leftY);
    leftY += 5;
  };

  const rightSection = (title: string) => {
    checkPage('right', 12);
    rightY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text(title.toUpperCase(), leftW + mPad, rightY);
    rightY += 2;
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.line(leftW + mPad, rightY, pageW - mPad, rightY);
    rightY += 5;
  };

  // ── Dark header ──
  doc.setFillColor(42, 42, 42);
  doc.rect(0, 0, pageW, 42, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(data.personalInfo.fullName || 'Your Name', mPad, 16);
  if (data.personalInfo.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(data.personalInfo.title, mPad, 24);
  }

  // Contact right side of header
  const contactItems = [
    data.personalInfo.phone,
    data.personalInfo.email,
    data.personalInfo.location,
  ].filter(Boolean);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  contactItems.forEach((item, i) => {
    doc.text(item!, pageW - mPad, 14 + i * 8, { align: 'right' });
  });

  // ── Left column ──

  // Education
  if (data.education.length > 0) {
    leftSection('Education');
    data.education.forEach((edu) => {
      checkPage('left', 14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(edu.institution || '', leftW - mPad * 2);
      doc.text(lines, mPad, leftY);
      leftY += lines.length * 4.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(...GRAY);
      doc.text(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, mPad, leftY);
      leftY += 4.5;
      const yr = `${new Date(edu.startDate).getUTCFullYear()}${edu.current ? '–Present' : edu.endDate ? `–${new Date(edu.endDate).getUTCFullYear()}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(yr, mPad, leftY);
      leftY += 6;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    leftSection('Skills');
    data.skills.forEach((s) => {
      checkPage('left', 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`• ${s.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // Languages
  if (data.languages.length > 0) {
    leftSection('Languages');
    data.languages.forEach((l) => {
      checkPage('left', 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(`• ${l.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // Certifications
  if (data.certificates.length > 0) {
    leftSection('Certifications');
    data.certificates.forEach((c) => {
      checkPage('left', 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(c.name || '', leftW - mPad * 2);
      doc.text(lines, mPad, leftY);
      leftY += lines.length * 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(c.issuer || '', mPad, leftY);
      leftY += 5;
    });
  }

  // ── Right column ──

  // Summary
  if (data.personalInfo.summary) {
    rightSection('Summary');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, pageW - leftW - mPad * 2);
    checkPage('right', lines.length * 5);
    doc.text(lines, leftW + mPad, rightY);
    rightY += lines.length * 5 + 4;
  }

  // Experience
  if (data.experience.length > 0) {
    rightSection('Professional Experience');
    data.experience.forEach((exp) => {
      checkPage('right', 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', leftW + mPad, rightY);
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mPad, rightY, { align: 'right' });
      rightY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.company}${exp.location ? ` | ${exp.location}` : ''}`, leftW + mPad, rightY);
      rightY += 5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, pageW - leftW - mPad * 2);
        checkPage('right', lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    rightSection('Projects');
    data.projects.forEach((proj) => {
      checkPage('right', 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(proj.name || '', leftW + mPad, rightY);
      rightY += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, pageW - leftW - mPad * 2);
        checkPage('right', lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  // References
  if (data.references && data.references.length > 0) {
    rightSection('References');
    data.references.forEach((ref) => {
      checkPage('right', 18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(ref.name || '', leftW + mPad, rightY);
      rightY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`${ref.position || ''}${ref.company ? ` · ${ref.company}` : ''}`, leftW + mPad, rightY);
      rightY += 4.5;
      if (ref.phone) { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text(`Phone: ${ref.phone}`, leftW + mPad, rightY); rightY += 4.5; }
      if (ref.email) { doc.text(`Email: ${ref.email}`, leftW + mPad, rightY); rightY += 5; }
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


// ─────────────────────────────────────────────
// DARK SIDEBAR PDF
// ─────────────────────────────────────────────
export function generateDarkSidebarPDF(data: ResumeData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const leftW  = pageW * 0.35;
  const mPad   = 8;
  let leftY    = 20;
  let rightY   = 20;

  const checkPage = (side: 'left' | 'right', n: number) => {
    const y = side === 'left' ? leftY : rightY;
    if (y + n > pageH - 15) { doc.addPage(); leftY = 20; rightY = 20; }
  };

  const leftSection = (title: string) => {
    checkPage('left', 12);
    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), mPad, leftY);
    leftY += 2;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(mPad, leftY, leftW - mPad, leftY);
    leftY += 5;
  };

  const rightSection = (title: string) => {
    checkPage('right', 12);
    rightY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 41, 64);
    doc.text(title.toUpperCase(), leftW + mPad, rightY);
    rightY += 2;
    doc.setDrawColor(26, 41, 64);
    doc.setLineWidth(0.4);
    doc.line(leftW + mPad, rightY, pageW - mPad, rightY);
    rightY += 5;
  };

  // ── Dark sidebar background ──
  doc.setFillColor(26, 41, 64);
  doc.rect(0, 0, leftW, pageH * 3, 'F'); // tall enough for multi-page

  // ── Name (right column header) ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(26, 41, 64);
  doc.text((data.personalInfo.fullName || 'Your Name').toUpperCase(), leftW + mPad, rightY);
  rightY += 7;
  if (data.personalInfo.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(data.personalInfo.title.toUpperCase(), leftW + mPad, rightY);
    rightY += 6;
  }
  doc.setDrawColor(...LGRAY);
  doc.setLineWidth(0.3);
  doc.line(leftW + mPad, rightY, pageW - mPad, rightY);
  rightY += 6;

  // ── Contact (left sidebar) ──
  leftSection('Contact');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 220);
  if (data.personalInfo.phone)    { doc.text(data.personalInfo.phone, mPad, leftY);    leftY += 5; }
  if (data.personalInfo.email)    { const el = doc.splitTextToSize(data.personalInfo.email, leftW - mPad * 2); doc.text(el, mPad, leftY); leftY += el.length * 4.5; }
  if (data.personalInfo.location) { doc.text(data.personalInfo.location, mPad, leftY); leftY += 5; }
  if (data.personalInfo.linkedin) { const ll = doc.splitTextToSize(data.personalInfo.linkedin.replace(/^https?:\/\//i,''), leftW - mPad * 2); doc.text(ll, mPad, leftY); leftY += ll.length * 4.5; }
  if (data.personalInfo.github)   { const gl = doc.splitTextToSize(data.personalInfo.github.replace(/^https?:\/\//i,''), leftW - mPad * 2); doc.text(gl, mPad, leftY); leftY += gl.length * 4.5; }
  leftY += 3;

  // ── Skills (left) ──
  if (data.skills.length > 0) {
    leftSection('Skills');
    data.skills.forEach((s) => {
      checkPage('left', 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`• ${s.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // ── Languages (left) ──
  if (data.languages.length > 0) {
    leftSection('Languages');
    data.languages.forEach((l) => {
      checkPage('left', 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`• ${l.name}`, mPad, leftY);
      leftY += 4.5;
    });
    leftY += 3;
  }

  // ── Certifications (left) ──
  if (data.certificates.length > 0) {
    leftSection('Certifications');
    data.certificates.forEach((c) => {
      checkPage('left', 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(220, 220, 220);
      const lines = doc.splitTextToSize(c.name || '', leftW - mPad * 2);
      doc.text(lines, mPad, leftY);
      leftY += lines.length * 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text(c.issuer || '', mPad, leftY);
      leftY += 5;
    });
  }

  // ── References (left) ──
  if (data.references && data.references.length > 0) {
    leftSection('References');
    data.references.forEach((ref) => {
      checkPage('left', 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(220, 220, 220);
      doc.text(ref.name || '', mPad, leftY);
      leftY += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text(`${ref.position || ''}${ref.company ? ` / ${ref.company}` : ''}`, mPad, leftY);
      leftY += 4.5;
      if (ref.phone) { doc.text(ref.phone, mPad, leftY); leftY += 4.5; }
      if (ref.email) { const el = doc.splitTextToSize(ref.email, leftW - mPad * 2); doc.text(el, mPad, leftY); leftY += el.length * 4.5; }
      leftY += 3;
    });
  }

  // ── Profile (right) ──
  if (data.personalInfo.summary) {
    rightSection('Profile');
    const text = stripHtml(data.personalInfo.summary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(text, pageW - leftW - mPad * 2);
    checkPage('right', lines.length * 5);
    doc.text(lines, leftW + mPad, rightY);
    rightY += lines.length * 5 + 4;
  }

  // ── Experience (right) ──
  if (data.experience.length > 0) {
    rightSection('Work Experience');
    data.experience.forEach((exp) => {
      checkPage('right', 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 41, 64);
      doc.text(exp.company || '', leftW + mPad, rightY);
      const dateStr = `${new Date(exp.startDate).getUTCFullYear()}${exp.current ? ' – PRESENT' : exp.endDate ? ` – ${new Date(exp.endDate).getUTCFullYear()}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mPad, rightY, { align: 'right' });
      rightY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.position}${exp.location ? ` | ${exp.location}` : ''}`, leftW + mPad, rightY);
      rightY += 5;
      if (exp.description) {
        const desc = stripHtml(exp.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, pageW - leftW - mPad * 2);
        checkPage('right', lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  // ── Education (right) ──
  if (data.education.length > 0) {
    rightSection('Education');
    data.education.forEach((edu) => {
      checkPage('right', 14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 41, 64);
      doc.text(`${edu.degree}${edu.field ? ` of ${edu.field}` : ''}`, leftW + mPad, rightY);
      const yr = `${new Date(edu.startDate).getUTCFullYear()}${edu.current ? ' – Present' : edu.endDate ? ` – ${new Date(edu.endDate).getUTCFullYear()}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(yr, pageW - mPad, rightY, { align: 'right' });
      rightY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(edu.institution || '', leftW + mPad, rightY);
      rightY += 7;
    });
  }

  // ── Projects (right) ──
  if (data.projects && data.projects.length > 0) {
    rightSection('Projects');
    data.projects.forEach((proj) => {
      checkPage('right', 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 41, 64);
      doc.text(proj.name || '', leftW + mPad, rightY);
      rightY += 5.5;
      if (proj.description) {
        const desc = stripHtml(proj.description);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(desc, pageW - leftW - mPad * 2);
        checkPage('right', lines.length * 5);
        doc.text(lines, leftW + mPad, rightY);
        rightY += lines.length * 5;
      }
      rightY += 4;
    });
  }

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}