import { describe, it, expect } from 'vitest';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';
import { AppFormatters } from '@/core/formatters/currency-formatter';

describe('PDF Generation and Currency Symbol Formatting', () => {
  it('generates KVP English PDF with complete title, headers, parameters, and Unicode ₹', async () => {
    const deposit = 2000000;
    const interest = 2000000;
    const maturity = 4000000;

    const doc = await PdfGeneratorService.buildSchemeReportDoc({
      schemeType: 'kvp',
      schemeFullName: 'Kisan Vikas Patra (KVP)',
      depositAmount: deposit,
      annualRate: 7.5,
      maturityAmount: maturity,
      interestEarned: interest,
      tenureMonths: 115,
      parameters: {
        'Deposit Principal': AppFormatters.formatCurrency(deposit),
        'Doubling Period': '115 Months (9 Years 7 Months)',
        'Applicable Annual Rate': '7.5% p.a.',
        'Maturity Guarantee': 'Exactly 2x of Deposit Principal',
        'Premature Encashment': 'Allowed after 2 years 6 months (30 months)',
        'Tax Deducted at Source': 'No TDS at maturity by Post Office',
      },
      schedule: {
        headers: ['Period', 'Surrender / Accrual Value', 'Incremental Interest', 'Closing Balance'],
        rows: [
          ['Year 1 (12 Months)', AppFormatters.formatCurrency(2150000), AppFormatters.formatCurrency(150000), AppFormatters.formatCurrency(2150000)],
          ['Year 2 (24 Months)', AppFormatters.formatCurrency(2311250), AppFormatters.formatCurrency(161250), AppFormatters.formatCurrency(2311250)],
          ['Maturity (115 Months)', AppFormatters.formatCurrency(4000000), AppFormatters.formatCurrency(2000000), AppFormatters.formatCurrency(4000000)],
        ],
      },
      assumptions: [
        'KVP investment doubles in exactly 115 months at 7.5% p.a. compounded annually.',
        'Premature encashment is permitted after 2 years and 6 months.',
      ],
      isHindi: false,
    });

    const rawPdf = doc.output();
    expect(rawPdf).toBeDefined();
    expect(rawPdf.length).toBeGreaterThan(10000);

    // Verify true Unicode font is embedded
    expect(rawPdf).toContain('/ToUnicode');
    expect(rawPdf).toContain('NotoSans');

    // Verify character 185 (Latin-1 superscript 1: '¹') was NOT output
    expect(rawPdf).not.toContain('( ¹');
    expect(rawPdf).not.toContain('(¹');
    // Verify CMap correctly maps to Unicode Rupee symbol 20b9
    expect(rawPdf).toContain('<20b9>');
    // Verify CMap maps Latin characters D (0044) and K (004b) for 'DAK HELP'
    expect(rawPdf).toContain('<0044>');
    expect(rawPdf).toContain('<004b>');
  });

  it('generates RD English PDF with complete schedule and currency symbols', async () => {
    const monthlyDeposit = 10000;
    const totalDeposit = 600000;
    const totalInterest = 113659;
    const maturity = 713659;

    const doc = await PdfGeneratorService.buildSchemeReportDoc({
      schemeType: 'rd',
      schemeFullName: 'National Savings Recurring Deposit (RD)',
      depositAmount: totalDeposit,
      annualRate: 6.7,
      maturityAmount: maturity,
      interestEarned: totalInterest,
      tenureYears: 5,
      tenureMonths: 60,
      parameters: {
        'Monthly Deposit': AppFormatters.formatCurrency(monthlyDeposit),
        'Total Tenure': '5 Years (60 Monthly Deposits)',
        'Applicable Annual Rate': '6.7% p.a. (Quarterly Compounding)',
        'Total Deposit': AppFormatters.formatCurrency(totalDeposit),
        'Total Interest': AppFormatters.formatCurrency(totalInterest),
      },
      schedule: {
        headers: ['Year', 'Annual Deposit', 'Interest Earned', 'Closing Balance'],
        rows: [
          ['Year 1', AppFormatters.formatCurrency(120000), AppFormatters.formatCurrency(4422), AppFormatters.formatCurrency(124422)],
          ['Year 2', AppFormatters.formatCurrency(120000), AppFormatters.formatCurrency(13123), AppFormatters.formatCurrency(257545)],
          ['Year 5 (Maturity)', AppFormatters.formatCurrency(120000), AppFormatters.formatCurrency(45831), AppFormatters.formatCurrency(713659)],
        ],
      },
      assumptions: ['Quarterly compounding applied according to Post Office RD tables.'],
      isHindi: false,
    });

    const rawPdf = doc.output();
    expect(rawPdf).toContain('/ToUnicode');
    expect(rawPdf).toContain('NotoSans');
    expect(rawPdf).not.toContain('( ¹');
    expect(rawPdf).not.toContain('(¹');
    expect(rawPdf).toContain('<20b9>');
  });

  it('generates PPF English PDF with 15-year schedule and zero superscript 1 artefacts', async () => {
    const yearlyDeposit = 150000;
    const totalDeposit = 2250000;
    const totalInterest = 1818209;
    const maturity = 4068209;

    const doc = await PdfGeneratorService.buildSchemeReportDoc({
      schemeType: 'ppf',
      schemeFullName: 'Public Provident Fund (PPF)',
      depositAmount: totalDeposit,
      annualRate: 7.1,
      maturityAmount: maturity,
      interestEarned: totalInterest,
      tenureYears: 15,
      parameters: {
        'Annual Deposit': AppFormatters.formatCurrency(yearlyDeposit),
        'Tenure': '15 Years',
        'Applicable Annual Rate': '7.1% p.a.',
        'Total Deposit': AppFormatters.formatCurrency(totalDeposit),
      },
      schedule: {
        headers: ['Year', 'Opening Balance', 'Deposit', 'Interest', 'Closing Balance'],
        rows: [
          ['Year 1', AppFormatters.formatCurrency(0), AppFormatters.formatCurrency(150000), AppFormatters.formatCurrency(10650), AppFormatters.formatCurrency(160650)],
          ['Year 15 (Maturity)', AppFormatters.formatCurrency(3658458), AppFormatters.formatCurrency(150000), AppFormatters.formatCurrency(259751), AppFormatters.formatCurrency(4068209)],
        ],
      },
      assumptions: ['PPF interest calculated on the minimum balance between 5th and end of each month.'],
      isHindi: false,
    });

    const rawPdf = doc.output();
    expect(rawPdf).toContain('/ToUnicode');
    expect(rawPdf).toContain('NotoSans');
    expect(rawPdf).not.toContain('( ¹');
    expect(rawPdf).not.toContain('(¹');
    expect(rawPdf).toContain('<20b9>');
  });

  it('generates KVP Hindi PDF with authentic Devanagari text and Rupee symbol', async () => {
    const doc = await PdfGeneratorService.buildSchemeReportDoc({
      schemeType: 'kvp',
      schemeFullName: 'किसान विकास पत्र (KVP)',
      depositAmount: 100000,
      annualRate: 7.5,
      maturityAmount: 200000,
      interestEarned: 100000,
      tenureMonths: 115,
      parameters: {
        'जमा मूलधन': AppFormatters.formatCurrency(100000),
        'परिपक्वता अवधि': '115 माह (9 वर्ष 7 माह)',
      },
      assumptions: ['केवीपी में निवेश 115 माह में शत-प्रतिशत दोगुना होता है।'],
      isHindi: true,
    });

    const rawPdf = doc.output();
    expect(rawPdf).toContain('/ToUnicode');
    expect(rawPdf).toContain('NotoSans');
    expect(rawPdf).not.toContain('( ¹');
    expect(rawPdf).toContain('<20b9>');
    // Verify Devanagari 'ka' (0915) is embedded
    expect(rawPdf).toContain('<0915>');
  });

  it('generates RD Hindi PDF with authentic Devanagari headers and table', async () => {
    const doc = await PdfGeneratorService.buildSchemeReportDoc({
      schemeType: 'rd',
      schemeFullName: 'राष्ट्रीय बचत आवर्ती जमा (RD)',
      depositAmount: 600000,
      annualRate: 6.7,
      maturityAmount: 713659,
      interestEarned: 113659,
      tenureYears: 5,
      tenureMonths: 60,
      parameters: {
        'मासिक जमा राशि': AppFormatters.formatCurrency(10000),
        'कुल अवधि': '5 वर्ष (60 मासिक किस्तें)',
      },
      schedule: {
        headers: ['वर्ष', 'वार्षिक जमा', 'अर्जित ब्याज', 'अंतिम शेष'],
        rows: [
          ['वर्ष 1', AppFormatters.formatCurrency(120000), AppFormatters.formatCurrency(4422), AppFormatters.formatCurrency(124422)],
        ],
      },
      assumptions: ['त्रैमासिक चक्रवृद्धि लागू होती है।'],
      isHindi: true,
    });

    const rawPdf = doc.output();
    expect(rawPdf).toContain('/ToUnicode');
    expect(rawPdf).toContain('NotoSans');
    expect(rawPdf).not.toContain('( ¹');
    expect(rawPdf).toContain('<20b9>');
  });
});
