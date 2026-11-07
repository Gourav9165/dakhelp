/**
 * Professional PDF Generation Service for Dak Help.
 * Generates branded, styled, printable calculation reports matching the Android Flutter implementation.
 * Supports Unicode Indian Rupee symbol (₹) and bilingual English/Hindi output via embedded NotoSansDevanagari font.
 */

import { jsPDF } from 'jspdf';
import { AppFormatters } from '@/core/formatters/currency-formatter';
import { SchemeId } from '@/data/models/scheme-type';

export interface SchemePdfOptions {
  schemeType: SchemeId;
  schemeFullName: string;
  depositAmount: number;
  annualRate: number;
  maturityAmount: number;
  interestEarned: number;
  tenureYears?: number;
  tenureMonths?: number;
  periodicPayoutText?: string;
  openingDate?: Date;
  maturityDate?: Date;
  parameters: Record<string, string>;
  assumptions: string[];
  schedule?: {
    headers: string[];
    rows: (string | number)[][];
  };
  isHindi?: boolean;
}

export interface ComparisonPdfOptions {
  title: string;
  columns: {
    schemeName: string;
    schemeType: string;
    rate: string;
    totalDeposit: string;
    totalInterest: string;
    maturityAmount: string;
    periodicPayout?: string;
    taxStatus: string;
    riskProfile: string;
  }[];
  assumptions: string[];
  isHindi?: boolean;
}

export interface CustomInterestPdfOptions {
  calculationType: 'simple' | 'compound';
  principal: number;
  rate: number;
  timeYears: number;
  timeMonths?: number;
  timeDays?: number;
  compoundingFrequency?: string;
  totalInterest: number;
  totalAmount: number;
  schedule?: {
    period: number;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
  }[];
  isHindi?: boolean;
}

let regularFontBase64Cache: string | null = null;
let boldFontBase64Cache: string | null = null;

async function loadFontAsBase64(filename: string): Promise<string> {
  const response = await fetch(`/fonts/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch font /fonts/${filename}: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
}

async function ensureFonts(doc: jsPDF): Promise<string> {
  try {
    if (!regularFontBase64Cache) {
      regularFontBase64Cache = await loadFontAsBase64('NotoSans-Regular.ttf');
    }
    if (!boldFontBase64Cache) {
      boldFontBase64Cache = await loadFontAsBase64('NotoSans-Bold.ttf');
    }

    doc.addFileToVFS('NotoSans-Regular.ttf', regularFontBase64Cache);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');

    doc.addFileToVFS('NotoSans-Bold.ttf', boldFontBase64Cache);
    doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');

    return 'NotoSans';
  } catch (err) {
    console.warn('Could not load custom NotoSans font for PDF, using fallback:', err);
    return 'helvetica';
  }
}

export class PdfGeneratorService {
  /**
   * Builds an official Post Office Scheme jsPDF document instance.
   */
  static async buildSchemeReportDoc(options: SchemePdfOptions): Promise<jsPDF> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const font = await ensureFonts(doc);
    const isHi = !!options.isHindi;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Header Branding
    doc.setFillColor(216, 91, 72); // Postal Red
    doc.rect(margin, y, 4, 18, 'F');

    doc.setFont(font, 'bold');
    doc.setFontSize(15);
    doc.setTextColor(216, 91, 72);
    doc.text('DAK HELP : POST OFFICE INTEREST CALCULATOR', margin + 7, y + 6);

    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 100, 95);
    const reportSub = isHi
      ? 'आधिकारिक योजना वित्तीय अनुमान एवं नियामक अनुसूची'
      : 'Official Scheme Financial Projection & Regulatory Schedule';
    doc.text(reportSub, margin + 7, y + 12);
    doc.text(`Generated: ${AppFormatters.formatDateTime(new Date())}`, margin + 7, y + 17);

    y += 24;

    // Scheme Title Banner
    doc.setFillColor(247, 241, 232); // Warm Ivory
    doc.setDrawColor(216, 91, 72);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(216, 91, 72);
    doc.text(options.schemeFullName, margin + 4, y + 7);

    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(48, 59, 56);
    doc.text(
      `Scheme Category: ${options.schemeType} | Applicable Annual Rate: ${options.annualRate}% p.a.`,
      margin + 4,
      y + 13
    );

    y += 21;

    // Key Highlights (3 boxes side by side)
    const cardWidth = (contentWidth - 6) / 3;
    const cardHeight = 22;

    // 1. Total Deposit
    doc.setFillColor(245, 247, 246);
    doc.setDrawColor(220, 225, 222);
    doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 100, 95);
    doc.text(isHi ? 'कुल जमा / मूलधन' : 'TOTAL DEPOSIT / PRINCIPAL', margin + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(48, 59, 56);
    doc.text(AppFormatters.formatCurrency(options.depositAmount), margin + 3, y + 16);

    // 2. Total Interest
    const col2X = margin + cardWidth + 3;
    doc.setFillColor(235, 245, 242); // Mint tint
    doc.setDrawColor(36, 91, 80);
    doc.roundedRect(col2X, y, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(36, 91, 80);
    doc.text(isHi ? 'कुल अर्जित ब्याज' : 'TOTAL INTEREST EARNED', col2X + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(36, 91, 80);
    doc.text(`+ ${AppFormatters.formatCurrency(options.interestEarned)}`, col2X + 3, y + 16);

    // 3. Maturity Value
    const col3X = margin + (cardWidth + 3) * 2;
    doc.setFillColor(254, 243, 241); // Light Red tint
    doc.setDrawColor(216, 91, 72);
    doc.roundedRect(col3X, y, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(216, 91, 72);
    doc.text(isHi ? 'परिपक्वता / कुल मूल्य' : 'MATURITY / TOTAL VALUE', col3X + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(216, 91, 72);
    doc.text(AppFormatters.formatCurrency(options.maturityAmount), col3X + 3, y + 16);

    y += cardHeight + 4;

    // Periodic Payout Banner if applicable (MIS / SCSS / TD)
    if (options.periodicPayoutText) {
      doc.setFillColor(255, 247, 235);
      doc.setDrawColor(243, 184, 63);
      doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'FD');
      doc.setFont(font, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(110, 75, 10);
      doc.text(
        isHi
          ? `नियमित आय भुगतान: ${options.periodicPayoutText}`
          : `Periodic Regular Income Payout: ${options.periodicPayoutText}`,
        margin + 4,
        y + 6.5
      );
      y += 14;
    }

    // Parameters Table
    doc.setFont(font, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(48, 59, 56);
    doc.text(isHi ? 'गणना पैरामीटर एवं समय-सीमा' : 'CALCULATION PARAMETERS & TIMELINE', margin, y + 4);
    y += 7;

    const paramEntries = Object.entries(options.parameters);
    doc.setFontSize(8.5);
    const rowHeight = 6.5;

    paramEntries.forEach(([key, val], idx) => {
      const isOdd = idx % 2 === 1;
      if (isOdd) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, rowHeight, 'F');
      }
      doc.setFont(font, 'bold');
      doc.setTextColor(80, 85, 83);
      doc.text(key, margin + 3, y + 4.5);

      doc.setFont(font, 'normal');
      doc.setTextColor(30, 35, 33);
      doc.text(val, margin + contentWidth / 2, y + 4.5);

      y += rowHeight;
    });

    y += 4;

    // Optional Schedule Table (e.g. PPF, SSA, KVP, TD)
    if (options.schedule && options.schedule.rows.length > 0) {
      if (y > 220) {
        doc.addPage();
        y = 16;
      }

      doc.setFont(font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(48, 59, 56);
      doc.text(isHi ? 'वर्ष-दर-वर्ष उपार्जन एवं शेष अनुसूची' : 'YEAR-BY-YEAR ACCRUAL & BALANCE SCHEDULE', margin, y + 4);
      y += 7;

      // Table Header
      const colW = contentWidth / options.schedule.headers.length;
      doc.setFillColor(36, 91, 80);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont(font, 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);

      options.schedule.headers.forEach((h, i) => {
        const alignRight = i > 0;
        const textX = alignRight ? margin + colW * (i + 1) - 3 : margin + colW * i + 3;
        doc.text(h, textX, y + 4.8, { align: alignRight ? 'right' : 'left' });
      });

      y += 7;

      // Table Rows
      options.schedule.rows.forEach((row, rIdx) => {
        if (y > 270) {
          doc.addPage();
          y = 16;
        }

        const isEven = rIdx % 2 === 0;
        if (!isEven) {
          doc.setFillColor(247, 247, 245);
          doc.rect(margin, y, contentWidth, 6, 'F');
        }

        doc.setFont(font, 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(40, 45, 43);

        row.forEach((cell, cIdx) => {
          const alignRight = cIdx > 0;
          const textX = alignRight ? margin + colW * (cIdx + 1) - 3 : margin + colW * cIdx + 3;
          doc.text(String(cell), textX, y + 4.2, { align: alignRight ? 'right' : 'left' });
        });

        y += 6;
      });

      y += 5;
    }

    // Assumptions & Disclosures
    if (options.assumptions.length > 0) {
      if (y > 230) {
        doc.addPage();
        y = 16;
      }

      doc.setFont(font, 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(48, 59, 56);
      doc.text(isHi ? 'आधिकारिक नियामक नियम एवं प्रकटीकरण' : 'OFFICIAL REGULATORY RULES & DISCLOSURES', margin, y + 4);
      y += 7;

      doc.setFont(font, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 85, 83);

      options.assumptions.forEach((item) => {
        if (y > 275) {
          doc.addPage();
          y = 16;
        }
        const bulletText = `* ${item}`;
        const lines = doc.splitTextToSize(bulletText, contentWidth - 4);
        doc.text(lines, margin + 2, y + 3);
        y += lines.length * 4;
      });

      y += 4;
    }

    // Footer Disclaimer on All Pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(220, 225, 222);
      doc.line(margin, 283, margin + contentWidth, 283);

      doc.setFont(font, 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(115, 125, 120);
      doc.text(
        isHi
          ? 'डाक हेल्प एक स्वतंत्र शैक्षिक उपकरण है, जो इंडिया पोस्ट या भारत सरकार से संबद्ध नहीं है।'
          : 'Dak Help is an independent educational tool, not affiliated with India Post or the Govt. of India. Subject to official PO Small Savings rules.',
        margin,
        287
      );
      doc.text(isHi ? `पृष्ठ ${p} / ${totalPages}` : `Page ${p} of ${totalPages}`, margin + contentWidth, 287, { align: 'right' });
    }

    return doc;
  }

  /**
   * Generates and triggers download for an official Post Office Scheme report.
   */
  static async generateSchemeReport(options: SchemePdfOptions): Promise<void> {
    const doc = await this.buildSchemeReportDoc(options);
    const filename = `DakHelp_${options.schemeType}_Calculation_${Date.now()}.pdf`;
    doc.save(filename);
  }

  /**
   * Builds a comparison report jsPDF document instance.
   */
  static async buildComparisonReportDoc(options: ComparisonPdfOptions): Promise<jsPDF> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const font = await ensureFonts(doc);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Header Branding
    doc.setFillColor(216, 91, 72);
    doc.rect(margin, y, 4, 16, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(15);
    doc.setTextColor(216, 91, 72);
    doc.text('DAK HELP : POST OFFICE SCHEMES COMPARISON REPORT', margin + 7, y + 6);

    doc.setFont(font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 100, 95);
    doc.text(
      `Independent side-by-side financial comparison | Generated: ${AppFormatters.formatDateTime(new Date())}`,
      margin + 7,
      y + 12
    );

    y += 22;

    // Comparison Table
    const colCount = options.columns.length + 1; // 1 for labels + N for schemes
    const colWidth = contentWidth / colCount;

    const rowConfigs = [
      { label: 'Scheme Name', getVal: (c: (typeof options.columns)[0]) => c.schemeName, bold: true },
      { label: 'Scheme Code', getVal: (c: (typeof options.columns)[0]) => c.schemeType },
      { label: 'Current Interest Rate', getVal: (c: (typeof options.columns)[0]) => c.rate, highlight: true },
      { label: 'Total Invested Deposit', getVal: (c: (typeof options.columns)[0]) => c.totalDeposit },
      { label: 'Total Interest Earned', getVal: (c: (typeof options.columns)[0]) => c.totalInterest, success: true },
      { label: 'Maturity / Total Value', getVal: (c: (typeof options.columns)[0]) => c.maturityAmount, bold: true, primary: true },
      { label: 'Periodic Payout', getVal: (c: (typeof options.columns)[0]) => c.periodicPayout || 'At Maturity' },
      { label: 'Income Tax Treatment', getVal: (c: (typeof options.columns)[0]) => c.taxStatus },
      { label: 'Risk / Guarantee Profile', getVal: (c: (typeof options.columns)[0]) => c.riskProfile },
    ];

    // Header
    doc.setFillColor(36, 91, 80); // Postal Green
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('COMPARISON ATTRIBUTE', margin + 3, y + 6);

    options.columns.forEach((col, idx) => {
      doc.text(col.schemeType, margin + colWidth * (idx + 1) + 3, y + 6);
    });

    y += 9;

    // Body
    rowConfigs.forEach((rowConf, rIdx) => {
      const isEven = rIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 249, isEven ? 255 : 248);
      doc.rect(margin, y, contentWidth, 8, 'F');

      doc.setFont(font, rowConf.bold ? 'bold' : 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 65, 63);
      doc.text(rowConf.label, margin + 3, y + 5.5);

      options.columns.forEach((col, cIdx) => {
        const val = rowConf.getVal(col);
        if (rowConf.primary) {
          doc.setTextColor(216, 91, 72);
          doc.setFont(font, 'bold');
        } else if (rowConf.success) {
          doc.setTextColor(36, 91, 80);
          doc.setFont(font, 'bold');
        } else {
          doc.setTextColor(30, 35, 33);
          doc.setFont(font, rowConf.bold ? 'bold' : 'normal');
        }

        doc.text(val, margin + colWidth * (cIdx + 1) + 3, y + 5.5);
      });

      y += 8;
    });

    y += 6;

    // Assumptions
    if (options.assumptions.length > 0) {
      doc.setFont(font, 'bold');
      doc.setFontSize(9);
      doc.setTextColor(48, 59, 56);
      doc.text('Important Comparison Assumptions & Guidance:', margin, y + 4);
      y += 6;

      doc.setFont(font, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(90, 95, 93);

      options.assumptions.forEach((note) => {
        const lines = doc.splitTextToSize(`* ${note}`, contentWidth - 4);
        doc.text(lines, margin + 2, y + 3);
        y += lines.length * 3.8;
      });
    }

    // Footer
    doc.setDrawColor(220, 225, 222);
    doc.line(margin, 195, margin + contentWidth, 195);
    doc.setFont(font, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(115, 125, 120);
    doc.text(
      'Dak Help comparison tool is designed for educational evaluation. Lump-sum vs recurring cash flows carry inherently different investment timelines.',
      margin,
      200
    );

    return doc;
  }

  /**
   * Generates comparison PDF.
   */
  static async generateComparisonReport(options: ComparisonPdfOptions): Promise<void> {
    const doc = await this.buildComparisonReportDoc(options);
    doc.save(`DakHelp_Scheme_Comparison_${Date.now()}.pdf`);
  }

  /**
   * Builds custom interest report jsPDF document instance.
   */
  static async buildCustomInterestReportDoc(options: CustomInterestPdfOptions): Promise<jsPDF> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const font = await ensureFonts(doc);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 16;

    // Header
    doc.setFillColor(216, 91, 72);
    doc.rect(margin, y, 4, 16, 'F');
    doc.setFont(font, 'bold');
    doc.setFontSize(15);
    doc.setTextColor(216, 91, 72);
    doc.text('DAK HELP : CUSTOM INTEREST CALCULATION REPORT', margin + 7, y + 6);

    doc.setFont(font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 100, 95);
    doc.text(
      `${options.calculationType.toUpperCase()} INTEREST CALCULATION | Generated: ${AppFormatters.formatDateTime(new Date())}`,
      margin + 7,
      y + 12
    );

    y += 22;

    // Highlights
    const cardWidth = (contentWidth - 6) / 3;
    const cardHeight = 22;

    // Principal
    doc.setFillColor(245, 247, 246);
    doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 100, 95);
    doc.text('PRINCIPAL AMOUNT', margin + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(48, 59, 56);
    doc.text(AppFormatters.formatCurrency(options.principal), margin + 3, y + 16);

    // Interest
    const col2X = margin + cardWidth + 3;
    doc.setFillColor(235, 245, 242);
    doc.roundedRect(col2X, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(36, 91, 80);
    doc.text('CALCULATED INTEREST', col2X + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(36, 91, 80);
    doc.text(`+ ${AppFormatters.formatCurrency(options.totalInterest)}`, col2X + 3, y + 16);

    // Total Amount
    const col3X = margin + (cardWidth + 3) * 2;
    doc.setFillColor(254, 243, 241);
    doc.roundedRect(col3X, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(216, 91, 72);
    doc.text('TOTAL MATURITY VALUE', col3X + 3, y + 6);
    doc.setFont(font, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(216, 91, 72);
    doc.text(AppFormatters.formatCurrency(options.totalAmount), col3X + 3, y + 16);

    y += cardHeight + 6;

    // Parameters
    doc.setFont(font, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(48, 59, 56);
    doc.text('CALCULATION DETAILS', margin, y + 4);
    y += 8;

    const details: [string, string][] = [
      ['Calculation Mode', options.calculationType === 'simple' ? 'Simple Interest' : 'Compound Interest'],
      ['Annual Interest Rate', `${options.rate}% p.a.`],
      ['Investment Tenure', `${options.timeYears} Years ${options.timeMonths ? `${options.timeMonths} Months` : ''}`],
      ['Compounding Frequency', options.compoundingFrequency || 'N/A (Simple Interest)'],
    ];

    details.forEach(([k, v], idx) => {
      const isOdd = idx % 2 === 1;
      if (isOdd) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, 6.5, 'F');
      }
      doc.setFont(font, 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(80, 85, 83);
      doc.text(k, margin + 3, y + 4.5);

      doc.setFont(font, 'normal');
      doc.setTextColor(30, 35, 33);
      doc.text(v, margin + contentWidth / 2, y + 4.5);

      y += 6.5;
    });

    y += 6;

    // Schedule Table if available
    if (options.schedule && options.schedule.length > 0) {
      doc.setFont(font, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(48, 59, 56);
      doc.text('PERIODIC ACCRUAL SCHEDULE', margin, y + 4);
      y += 7;

      const colW = contentWidth / 4;
      doc.setFillColor(36, 91, 80);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont(font, 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Period', margin + 3, y + 4.8);
      doc.text('Opening Balance', margin + colW * 2 - 3, y + 4.8, { align: 'right' });
      doc.text('Interest', margin + colW * 3 - 3, y + 4.8, { align: 'right' });
      doc.text('Closing Balance', margin + colW * 4 - 3, y + 4.8, { align: 'right' });
      y += 7;

      options.schedule.forEach((row, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 16;
        }

        if (idx % 2 === 1) {
          doc.setFillColor(247, 247, 245);
          doc.rect(margin, y, contentWidth, 6, 'F');
        }

        doc.setFont(font, 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(40, 45, 43);
        doc.text(String(row.period), margin + 3, y + 4.2);
        doc.text(AppFormatters.formatCurrency(row.openingBalance), margin + colW * 2 - 3, y + 4.2, { align: 'right' });
        doc.text(`+${AppFormatters.formatCurrency(row.interestEarned)}`, margin + colW * 3 - 3, y + 4.2, { align: 'right' });
        doc.text(AppFormatters.formatCurrency(row.closingBalance), margin + colW * 4 - 3, y + 4.2, { align: 'right' });
        y += 6;
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(220, 225, 222);
      doc.line(margin, 283, margin + contentWidth, 283);
      doc.setFont(font, 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(115, 125, 120);
      doc.text(
        'Dak Help is an independent educational tool. Formulas: Simple Interest I = (P*R*T)/100; Compound Interest A = P*(1+r/n)^(n*t).',
        margin,
        287
      );
      doc.text(`Page ${p} of ${totalPages}`, margin + contentWidth, 287, { align: 'right' });
    }

    return doc;
  }

  /**
   * Generates custom interest PDF.
   */
  static async generateCustomInterestReport(options: CustomInterestPdfOptions): Promise<void> {
    const doc = await this.buildCustomInterestReportDoc(options);
    doc.save(`DakHelp_Custom_Interest_${Date.now()}.pdf`);
  }
}
