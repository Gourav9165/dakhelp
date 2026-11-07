import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export type PpfDepositFrequency = 'monthly' | 'annually';

export interface PpfYearlyBreakdown {
  yearNumber: number;
  openingBalance: number;
  depositsAdded: number;
  interestEarned: number;
  closingBalance: number;
}

export interface PpfCalculationResult {
  depositFrequency: PpfDepositFrequency;
  depositAmount: number;
  annualDepositTotal: number;
  annualInterestRate: number;
  tenureYears: number;
  totalPrincipalInvested: number;
  exactInterestEarned: number;
  roundedInterestEarned: number;
  exactMaturityAmount: number;
  roundedMaturityAmount: number;
  openingDate?: Date;
  maturityDate?: Date;
  yearlyBreakdown: PpfYearlyBreakdown[];
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class PpfCalculationEngine {
  public static readonly minAnnualDeposit = 500.0;
  public static readonly maxAnnualDeposit = 150000.0;
  public static readonly depositMultiple = 50.0;
  public static readonly standardTenureYears = 15;

  public static calculateMaturityDate(openingDate: Date, tenureYears: number): Date {
    const fyEndYear = openingDate.getMonth() < 3 ? openingDate.getFullYear() : openingDate.getFullYear() + 1;
    const maturityYear = fyEndYear + tenureYears;
    return new Date(maturityYear, 3, 1); // 1 April (Month index 3)
  }

  public calculate(params: {
    depositAmount: number;
    depositFrequency?: PpfDepositFrequency;
    annualInterestRate: number;
    tenureYears?: number;
    isDepositedBefore5th?: boolean;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): PpfCalculationResult {
    const {
      depositAmount,
      depositFrequency = 'annually',
      annualInterestRate,
      tenureYears = PpfCalculationEngine.standardTenureYears,
      isDepositedBefore5th = true,
      openingDate,
      isCustomRate = false,
    } = params;

    if (depositAmount <= 0) {
      throw new CalculationValidationException('Deposit amount must be greater than zero.');
    }
    if (Math.abs(depositAmount % PpfCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Deposit amount must be in multiples of ₹50.');
    }

    const annualDepositTotal =
      depositFrequency === 'monthly' ? depositAmount * 12.0 : depositAmount;

    if (annualDepositTotal < PpfCalculationEngine.minAnnualDeposit) {
      throw new CalculationValidationException('Minimum annual contribution for PPF is ₹500.');
    }
    if (annualDepositTotal > PpfCalculationEngine.maxAnnualDeposit) {
      throw new CalculationValidationException(
        'Maximum annual contribution for PPF is ₹1,50,000 per financial year.'
      );
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }
    if (tenureYears < 15 || tenureYears % 5 !== 0) {
      throw new CalculationValidationException(
        'PPF tenure must be 15 years, or extended in blocks of 5 years (20, 25, 30).'
      );
    }

    const breakdowns: PpfYearlyBreakdown[] = [];
    let balance = 0.0;
    let totalDeposited = 0.0;
    let totalInterestAccrued = 0.0;

    for (let y = 1; y <= tenureYears; y++) {
      const opening = balance;
      let yearInterest = 0.0;
      let depositsInYear = 0.0;

      if (depositFrequency === 'annually') {
        depositsInYear = depositAmount;
        totalDeposited += depositsInYear;
        const effectiveBalance = opening + depositsInYear;
        if (isDepositedBefore5th) {
          yearInterest = (effectiveBalance * annualInterestRate) / 100.0;
        } else {
          yearInterest =
            (opening * annualInterestRate) / 100.0 +
            (depositsInYear * annualInterestRate * 11.0) / 1200.0;
        }
      } else {
        depositsInYear = depositAmount * 12.0;
        totalDeposited += depositsInYear;
        let currentMonthBalance = opening;

        for (let m = 1; m <= 12; m++) {
          if (isDepositedBefore5th) {
            currentMonthBalance += depositAmount;
            yearInterest += (currentMonthBalance * annualInterestRate) / 1200.0;
          } else {
            yearInterest += (currentMonthBalance * annualInterestRate) / 1200.0;
            currentMonthBalance += depositAmount;
          }
        }
      }

      const roundedYearInterest = Math.round(yearInterest);
      const closing = opening + depositsInYear + roundedYearInterest;
      totalInterestAccrued += roundedYearInterest;
      balance = closing;

      breakdowns.push({
        yearNumber: y,
        openingBalance: opening,
        depositsAdded: depositsInYear,
        interestEarned: roundedYearInterest,
        closingBalance: closing,
      });
    }

    const maturityDate = openingDate
      ? PpfCalculationEngine.calculateMaturityDate(openingDate, tenureYears)
      : undefined;

    const assumptions = [
      `Quarterly Rate Revision Disclosure: Long-term maturity returns are financial projections assuming the currently notified rate of ${annualInterestRate}% p.a. remains unchanged. Interest rates for small savings schemes are reviewed and notified by the Government of India every quarter and are not guaranteed for future years.`,
      'Interest is calculated on the lowest balance between the close of the 5th day and the end of each month.',
      'Interest is officially credited to the account once a year at the end of each financial year (31 March).',
      `Official PPF Maturity Rule (Rule 9): The account matures on the expiry of ${tenureYears} full financial years from the end of the financial year in which the initial subscription was made.`,
      'Complete EEE (Exempt-Exempt-Exempt) Tax Status: Section 80C deduction on deposits, fully tax-free annual interest, and tax-free maturity proceeds.',
      'Can be extended in blocks of 5 years with or without continued contributions.',
    ];

    return {
      depositFrequency,
      depositAmount,
      annualDepositTotal,
      annualInterestRate,
      tenureYears,
      totalPrincipalInvested: totalDeposited,
      exactInterestEarned: totalInterestAccrued,
      roundedInterestEarned: Math.round(totalInterestAccrued),
      exactMaturityAmount: balance,
      roundedMaturityAmount: Math.round(balance),
      openingDate,
      maturityDate,
      yearlyBreakdown: breakdowns,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'ppf',
          principalAmount: depositAmount,
          totalDeposit: totalDeposited,
          interestEarned: Math.round(totalInterestAccrued),
          maturityAmount: Math.round(balance),
          tenureInYears: tenureYears,
          applicableInterestRate: annualInterestRate,
        };
      },
    };
  }
}

export const ppfCalculationEngine = new PpfCalculationEngine();
