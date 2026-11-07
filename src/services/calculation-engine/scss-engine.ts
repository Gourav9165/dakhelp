import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface ScssCalculationResult {
  depositAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  totalQuarters: number;
  isExtendedTenure: boolean;
  firstQuarterInterestPayout: number;
  roundedFirstQuarterPayout: number;
  isFirstQuarterProRata: boolean;
  firstQuarterDays?: number;
  firstQuarterEndDate?: Date;
  quarterlyInterestPayout: number;
  roundedQuarterlyPayout: number;
  annualInterestPayout: number;
  totalInterestEarned: number;
  roundedTotalInterest: number;
  maturityPrincipalRefund: number;
  totalOverallReturns: number;
  isTdsApplicable: boolean;
  tdsThreshold: number;
  openingDate?: Date;
  maturityDate?: Date;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class ScssCalculationEngine {
  public static readonly minDeposit = 1000.0;
  public static readonly depositMultiple = 1000.0;
  public static readonly maxDeposit = 3000000.0; // ₹30 Lakh
  public static readonly standardTenureYears = 5;
  public static readonly extendedTenureYears = 8;
  public static readonly seniorCitizenTdsThreshold = 100000.0; // ₹1,00,000 (Finance Act 2025)

  public static getQuarterEndDate(date: Date): Date {
    const year = date.getFullYear();
    const m = date.getMonth() + 1; // 1-based
    if (m <= 3) {
      return new Date(year, 2, 31); // 31 March
    } else if (m <= 6) {
      return new Date(year, 5, 30); // 30 June
    } else if (m <= 9) {
      return new Date(year, 8, 30); // 30 Sept
    } else {
      return new Date(year, 11, 31); // 31 Dec
    }
  }

  public calculate(params: {
    depositAmount: number;
    annualInterestRate: number;
    isExtendedTenure?: boolean;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): ScssCalculationResult {
    const {
      depositAmount,
      annualInterestRate,
      isExtendedTenure = false,
      openingDate,
      isCustomRate = false,
    } = params;

    if (depositAmount < ScssCalculationEngine.minDeposit) {
      throw new CalculationValidationException('Minimum deposit for SCSS is ₹1,000.');
    }
    if (Math.abs(depositAmount % ScssCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Deposit amount must be in multiples of ₹1,000.');
    }
    if (depositAmount > ScssCalculationEngine.maxDeposit) {
      throw new CalculationValidationException('Maximum deposit limit for SCSS is ₹30 Lakh (₹30,00,000).');
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    const tenureYears = isExtendedTenure
      ? ScssCalculationEngine.extendedTenureYears
      : ScssCalculationEngine.standardTenureYears;
    const totalQuarters = tenureYears * 4;

    // Standard quarterly payout: (Deposit * Rate) / 400
    const rawQuarterly = (depositAmount * annualInterestRate) / 400.0;
    const standardQuarterlyPayout = Math.round(rawQuarterly * 100.0) / 100.0;
    const roundedStandardQuarterly = Math.round(standardQuarterlyPayout);
    const annualPayout = Math.round(standardQuarterlyPayout * 4.0 * 100.0) / 100.0;

    // First Quarter Payout: pro-rata if opened mid-quarter
    const effectiveOpening = openingDate ?? new Date('2024-04-01');
    const quarterEnd = ScssCalculationEngine.getQuarterEndDate(effectiveOpening);
    const m = effectiveOpening.getMonth() + 1;
    const d = effectiveOpening.getDate();
    const isQuarterStart = (m === 1 && d === 1) || (m === 4 && d === 1) || (m === 7 && d === 1) || (m === 10 && d === 1);

    const isProRata = openingDate !== undefined && !isQuarterStart;
    let firstQuarterPayout = standardQuarterlyPayout;
    let firstQuarterDays: number | undefined;

    if (isProRata) {
      const msDiff =
        new Date(quarterEnd.getFullYear(), quarterEnd.getMonth(), quarterEnd.getDate()).getTime() -
        new Date(effectiveOpening.getFullYear(), effectiveOpening.getMonth(), effectiveOpening.getDate()).getTime();
      const days = Math.round(msDiff / (1000 * 60 * 60 * 24)) + 1;
      const y = effectiveOpening.getFullYear();
      const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      const daysInYear = isLeapYear ? 366 : 365;
      const rawFirst = ((depositAmount * annualInterestRate) / 100.0) * (days / daysInYear);
      firstQuarterPayout = Math.round(rawFirst * 100.0) / 100.0;
      firstQuarterDays = days;
    }

    const roundedFirstQuarterPayout = Math.round(firstQuarterPayout);

    let totalInterest: number;
    let roundedTotalInterest: number;

    if (isProRata) {
      totalInterest =
        Math.round((firstQuarterPayout + standardQuarterlyPayout * (totalQuarters - 1)) * 100.0) / 100.0;
      roundedTotalInterest = roundedFirstQuarterPayout + roundedStandardQuarterly * (totalQuarters - 1);
    } else {
      totalInterest = Math.round(standardQuarterlyPayout * totalQuarters * 100.0) / 100.0;
      roundedTotalInterest = roundedStandardQuarterly * totalQuarters;
    }

    const isTds = annualPayout > ScssCalculationEngine.seniorCitizenTdsThreshold;

    let maturityDate: Date | undefined;
    if (openingDate) {
      const targetYear = openingDate.getFullYear() + tenureYears;
      const isLeapTarget = (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
      if (openingDate.getMonth() === 1 && openingDate.getDate() === 29 && !isLeapTarget) {
        maturityDate = new Date(targetYear, 1, 28);
      } else {
        maturityDate = new Date(targetYear, openingDate.getMonth(), openingDate.getDate());
      }
    }

    const assumptions = [
      'Quarterly Payout Schedule: Interest is payable on the first working day of April, July, October, and January.',
      ...(isProRata
        ? [
            `First Quarter Pro-Rata Rule: For mid-quarter opening on ${effectiveOpening.getDate()}/${effectiveOpening.getMonth() + 1}/${effectiveOpening.getFullYear()}, the first payout is calculated pro-rata for ${firstQuarterDays} days to ${quarterEnd.getDate()}/${quarterEnd.getMonth() + 1}/${quarterEnd.getFullYear()} (₹${firstQuarterPayout.toFixed(2)}). Subsequent quarters receive the standard ₹${standardQuarterlyPayout.toFixed(2)}.`,
          ]
        : []),
      'Senior Citizen TDS Threshold (₹1,00,000): Tax is deducted at source under Section 194A if total interest paid to a senior citizen exceeds ₹1,00,000 in a financial year (effective 1 April 2025; Finance Act 2025).',
      'TDS vs Tax Liability: Exemption from TDS does NOT make interest tax-free. SCSS interest is fully taxable under your income tax slab. Senior citizens can claim up to ₹50,000 deduction on interest under Section 80TTB when filing ITR.',
      'Form 15H: Eligible senior citizens whose total estimated annual income is below taxable limits can submit Form 15H to prevent TDS deduction.',
      'Deposit qualifies for deduction under Section 80C of the Income Tax Act up to ₹1,50,000.',
      'Account can be extended once for a period of 3 years within 1 year of standard 5-year maturity.',
      'Maximum deposit limit is ₹30 Lakh per individual across all SCSS accounts.',
    ];

    return {
      depositAmount,
      annualInterestRate,
      tenureYears,
      totalQuarters,
      isExtendedTenure,
      firstQuarterInterestPayout: firstQuarterPayout,
      roundedFirstQuarterPayout,
      isFirstQuarterProRata: isProRata,
      firstQuarterDays,
      firstQuarterEndDate: quarterEnd,
      quarterlyInterestPayout: standardQuarterlyPayout,
      roundedQuarterlyPayout: roundedStandardQuarterly,
      annualInterestPayout: annualPayout,
      totalInterestEarned: totalInterest,
      roundedTotalInterest,
      maturityPrincipalRefund: depositAmount,
      totalOverallReturns: depositAmount + totalInterest,
      isTdsApplicable: isTds,
      tdsThreshold: ScssCalculationEngine.seniorCitizenTdsThreshold,
      openingDate,
      maturityDate,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'scss',
          principalAmount: depositAmount,
          totalDeposit: depositAmount,
          interestEarned: roundedTotalInterest,
          maturityAmount: depositAmount,
          tenureInYears: tenureYears,
          applicableInterestRate: annualInterestRate,
          quarterlyPayout: roundedStandardQuarterly,
          annualPayout,
        };
      },
    };
  }
}

export const scssCalculationEngine = new ScssCalculationEngine();
