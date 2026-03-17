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
    .replace(/<\/li>/gi, '\n')           // end of li → newline first
    .replace(/<li[^>]*>/gi, '• ')        // ✅ any <li> tag (with or without attributes) → bullet
    .replace(/<\/ul>/gi, '\n')           // end of ul → newline
    .replace(/<\/ol>/gi, '\n')           // end of ol → newline
    .replace(/<br\s*\/?>/gi, '\n')       // line breaks
    .replace(/<\/p>/gi, '\n')            // end of paragraph
    .replace(/<\/div>/gi, '\n')          // end of div → newline
    .replace(/<[^>]+>/g, '')             // strip remaining tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ✅ Prevents "IIMS College in IIMS College" duplication
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

  // ── Contact line ──
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

      // Position
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...BLACK);
      doc.text(exp.position || '', mLeft, y);

      // Date — right aligned
      const dateStr = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.text(dateStr, pageW - mRight, y, { align: 'right' });
      y += 5.5;

      // Company
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, mLeft, y);
      y += 5.5;

      // Description
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

      // ✅ Fixed — no duplicate
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

  // ── Skills — name only ──
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

  // ── Languages — name only ──
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

  // ── Skills — name only ──
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

  // ── Languages — name only ──
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

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}


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

  // ── Skills — name only ──
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

  // ── Languages — name only ──
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

  const fileName = data.personalInfo.fullName
    ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  doc.save(fileName);
}