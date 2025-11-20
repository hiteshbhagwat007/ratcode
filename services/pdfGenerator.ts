import jsPDF from 'jspdf';
import { AuditData } from '../types';

export const generatePDF = (audit: AuditData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Background
  doc.setFillColor(27, 62, 152); // #1b3e98
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Instagram Audit Report", 14, 25);

  // Subheader
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated for @${audit.username}`, 14, 34);

  // Score Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Score: ${audit.score}/100`, 14, 60);

  // Visual Score Bar
  doc.setFillColor(230, 230, 230);
  doc.rect(14, 65, 100, 10, 'F'); // Background bar
  
  // Foreground bar (Green if high, yellow med, red low)
  if (audit.score >= 80) doc.setFillColor(34, 197, 94);
  else if (audit.score >= 50) doc.setFillColor(234, 179, 8);
  else doc.setFillColor(239, 68, 68);
  
  doc.rect(14, 65, audit.score, 10, 'F');

  // Details
  let yPos = 90;
  doc.setFontSize(12);
  doc.text(`Audit Date: ${new Date().toLocaleDateString()}`, 14, yPos);
  yPos += 10;
  doc.text(`Bio Length: ${audit.bio.length} chars`, 14, yPos);
  yPos += 10;
  doc.text(`Posts Per Week: ${audit.postsPerWeek}`, 14, yPos);
  yPos += 10;
  doc.text(`Reel Ratio: ${(audit.reelRatio * 100).toFixed(0)}%`, 14, yPos);
  yPos += 10;
  doc.text(`Profile Picture: ${audit.hasProfilePic ? "Detected" : "Missing"}`, 14, yPos);

  // Suggestions
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Strategic Suggestions:", 14, yPos);
  
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  if (audit.suggestions.length === 0) {
    doc.text("• Perfect profile! Keep up the amazing work.", 14, yPos);
  } else {
    audit.suggestions.forEach((suggestion) => {
      // Simple wrapping
      const splitText = doc.splitTextToSize(`• ${suggestion}`, pageWidth - 28);
      doc.text(splitText, 14, yPos);
      yPos += (splitText.length * 7);
    });
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("InstaAudit Pro - Automated Analysis Tool", 14, 280);

  doc.save(`${audit.username}_audit_report.pdf`);
};