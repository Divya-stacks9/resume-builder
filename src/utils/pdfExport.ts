import { jsPDF } from 'jspdf';
import { AnalysisReport } from '@/utils/analyzer';

export function exportAnalysisToPdf(report: AnalysisReport, filename: string, targetRole: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 20;

  // Helpers
  const addHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39); // Gray 900
    doc.text(title, margin, y);
    y += 4;
    // Draw underline
    doc.setDrawColor(229, 231, 235); // Gray 200
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = 20; // reset y on new page
    }
  };

  // --- PAGE 1: TITLE & EXECUTIVE SUMMARY ---
  
  // App Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue 600
  doc.text('AI Resume Analyzer', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Target Role: ${targetRole}`, margin, y);
  y += 12;

  // ATS Score Hero Block
  doc.setFillColor(243, 244, 246); // Gray 100 background
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 28, 3, 3, 'F');
  
  // Score text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  if (report.score >= 80) doc.setTextColor(22, 163, 74); // Green 600
  else if (report.score >= 50) doc.setTextColor(217, 119, 6); // Amber 600
  else doc.setTextColor(220, 38, 38); // Red 600
  doc.text(`${report.score}`, margin + 8, y + 18);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39); // Gray 900
  doc.text('/ 100', margin + 30, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text('Overall ATS Match Score', margin + 30, y + 18);

  // Status Badge
  const getScoreStatus = (s: number) => {
    if (s >= 80) return 'EXCELLENT';
    if (s >= 65) return 'GOOD';
    if (s >= 50) return 'NEEDS IMPROVEMENT';
    return 'CRITICAL REVISION NEEDED';
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Status: ${getScoreStatus(report.score)}`, pageWidth - margin - 60, y + 16);
  y += 38;

  // Breakdown Table/Section
  addHeader('Scoring Category Breakdown');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const breakdownData = [
    { label: 'Contact Info Validity', score: report.breakdown.contactInfo },
    { label: 'Skills Section Optimization', score: report.breakdown.skills },
    { label: 'Work Experience Analysis', score: report.breakdown.experience },
    { label: 'Education Verification', score: report.breakdown.education },
    { label: 'Role Keyword Match', score: report.breakdown.keywordMatch },
    { label: 'Formatting & Length', score: report.breakdown.formatting },
    { label: 'Action Verbs & Metrics', score: report.breakdown.actionVerbs },
  ];

  breakdownData.forEach(item => {
    doc.setTextColor(55, 65, 81); // Gray 700
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, margin + 4, y);
    
    // Draw simple progress bar
    const barWidth = 60;
    const barX = pageWidth - margin - barWidth - 20;
    doc.setFillColor(229, 231, 235); // Gray 200 (track)
    doc.rect(barX, y - 3, barWidth, 3, 'F');
    
    // Fill color based on score
    if (item.score >= 80) doc.setFillColor(34, 197, 94); // Green 500
    else if (item.score >= 50) doc.setFillColor(245, 158, 11); // Amber 500
    else doc.setFillColor(239, 68, 68); // Red 500
    doc.rect(barX, y - 3, (barWidth * item.score) / 100, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(`${item.score}%`, pageWidth - margin - 12, y);
    y += 8;
  });
  y += 6;

  // Professional Summary
  checkPageOverflow(50);
  addHeader('Tailored Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81); // Gray 700
  
  const summaryLines = doc.splitTextToSize(report.professionalSummary, pageWidth - (margin * 2));
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 5) + 12;

  // --- PAGE 2: SKILLS & KEYWORDS ---
  doc.addPage();
  y = 20;

  addHeader('Detected Skills Inventory');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const skillCategories = [
    { title: 'Languages', list: report.detectedSkills.languages },
    { title: 'Frameworks', list: report.detectedSkills.frameworks },
    { title: 'Databases & Cloud', list: report.detectedSkills.databasesCloud },
    { title: 'Tools & DevOps', list: report.detectedSkills.tools },
    { title: 'Soft Skills', list: report.detectedSkills.softSkills },
  ];

  skillCategories.forEach(cat => {
    if (cat.list && cat.list.length > 0) {
      checkPageOverflow(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235); // Blue
      doc.text(cat.title, margin, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      const skillText = cat.list.join(', ');
      const skillLines = doc.splitTextToSize(skillText, pageWidth - (margin * 2));
      doc.text(skillLines, margin, y);
      y += (skillLines.length * 5) + 6;
    }
  });
  y += 6;

  // Keywords Analysis
  checkPageOverflow(40);
  addHeader('Job Matching Keywords');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74); // Green
  doc.text('Matched Keywords', margin, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const matchedText = report.matchedKeywords.length > 0 ? report.matchedKeywords.join(', ') : 'None identified';
  const matchedLines = doc.splitTextToSize(matchedText, pageWidth - (margin * 2));
  doc.text(matchedLines, margin, y);
  y += (matchedLines.length * 5) + 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red
  doc.text('Missing Critical Keywords', margin, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  const missingText = report.missingKeywords.length > 0 ? report.missingKeywords.join(', ') : 'None missing';
  const missingLines = doc.splitTextToSize(missingText, pageWidth - (margin * 2));
  doc.text(missingLines, margin, y);
  y += (missingLines.length * 5) + 12;

  // --- PAGE 3: IMPROVEMENT TIPS ---
  if (report.improvementTips && report.improvementTips.length > 0) {
    doc.addPage();
    y = 20;
    
    addHeader('Actionable Improvement Tips');
    
    report.improvementTips.forEach((tip, idx) => {
      checkPageOverflow(25);
      
      // Icon or category tag
      doc.setFillColor(243, 244, 246); // Gray background
      doc.roundedRect(margin, y - 4, pageWidth - (margin * 2), 20, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(`[${tip.category.toUpperCase()}] ${tip.tip}`, margin + 4, y + 2);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      const actionText = `Recommendation: ${tip.action}`;
      const actionLines = doc.splitTextToSize(actionText, pageWidth - (margin * 2) - 8);
      doc.text(actionLines, margin + 4, y + 8);
      
      y += 24;
    });
  }

  // Save the PDF
  doc.save(filename);
}
