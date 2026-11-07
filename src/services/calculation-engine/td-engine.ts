import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface TdQuarterlyBreakdown {
  quarterIndex: number;
  yearIndex: number;
  quarterInYear: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
  cumulativeReinvestedBalance: number;
}

export interface TdCalculationResult {
  depositAmount: number;
  tenureYears: number;
  annualInterestRate: number;
  annualInterestPayout: number;
  roundedAnnualInterestPayout: number;
  totalPayoutInterest: number;
  roundedTotalPayoutInterest: number;
  principalRepayment: number;
  officialTotalCashReturn: number;
  roundedOfficialTotalCashReturn: number;
  hypotheticalCumulativeMaturity: number;
  roundedHypotheticalCumulativeMaturity: number;
  hypotheticalCumulativeInterest: number;
  roundedHypotheticalCumulativeInterest: number;
  openingDate?: Date;
  maturityDate?: Date;
  earliestPrematureClosureDate?: Date;
  quarterlyBreakdown: TdQuarterlyBreakdown[];
  is80cEligible: boolean;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class TdCalculationEngine {
  public static readonly minDeposit = 1000.0;
  public static readonly depositMultiple = 100.0;
  public static readonly validTenures = [1, 2, 3, 5];

  public static calculateEarliestPrematureClosureDate(openingDate: Date): Date {
    let year = openingDate.getFullYear();
    let month = openingDate.getMonth() + 6;
    if (month > 11) {
      year += Math.floor(month / 12);
      month = month % 12;
    }
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const day = Math.min(openingDate.getDate(), lastDayOfMonth);
    return new Date(year, month, day);
  }

  public calculate(params: {
    depositAmount: number;
    tenureYears: number;
    annualInterestRate: number;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): TdCalculationResult {
    const { depositAmount, tenureYears, annualInterestRate, openingDate, isCustomRate = false } = params;

    if (depositAmount < TdCalculationEngine.minDeposit) {
      throw new CalculationValidationException('Minimum deposit amount for Time Deposit is ₹1,000.');
    }
    if (Math.abs(depositAmount % TdCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Deposit amount must be in multiples of ₹100.');
    }
    if (!TdCalculationEngine.validTenures.includes(tenureYears)) {
      throw new CalculationValidationException('Time Deposit tenure must be 1, 2, 3, or 5 years.');
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    const totalQuarters = tenureYears * 4;
    const quarterlyRate = annualInterestRate / 400.0;

    // 1. Official Annual Payout calculation (Rule 7: Compounded quarterly, payable annually)
    // One full year interest = P * ((1 + r/400)^4 - 1)
    const oneYearInterest = depositAmount * (Math.pow(1 + quarterlyRate, 4) - 1.0);
    const roundedOneYearInterest = Math.round(oneYearInterest);
    const totalPayoutInterest = oneYearInterest * tenureYears;
    const roundedTotalPayoutInterest = Math.round(totalPayoutInterest);

    // Official Total Cash Return (Principal repaid + All annual interest payouts)
    const officialTotalCash = depositAmount + totalPayoutInterest;
    const roundedOfficialTotalCash = Math.round(depositAmount) + roundedTotalPayoutInterest;

    // 2. Hypothetical Continuous Reinvestment Progression (M = P * (1 + r/400)^(4T))
    const breakdown: TdQuarterlyBreakdown[] = [];
    let reinvestedBalance = depositAmount;

    for (let q = 1; q <= totalQuarters; q++) {
      const yearIndex = Math.floor((q - 1) / 4) + 1;
      const quarterInYear = ((q - 1) % 4) + 1;

      // Official progression within the year (resets each year to depositAmount)
      const qInYearPow = quarterInYear - 1;
      const officialQuarterOpening = depositAmount * Math.pow(1 + quarterlyRate, qInYearPow);
      const officialInterestEarned = officialQuarterOpening * quarterlyRate;
      const officialQuarterClosing = officialQuarterOpening + officialInterestEarned;

      // Hypothetical cumulative reinvestment
      const reinvestedOpening = reinvestedBalance;
      const reinvestedInterest = reinvestedOpening * quarterlyRate;
      reinvestedBalance = reinvestedOpening + reinvestedInterest;

      breakdown.push({
        quarterIndex: q,
        yearIndex,
        quarterInYear,
        openingBalance: officialQuarterOpening,
        interestEarned: officialInterestEarned,
        closingBalance: officialQuarterClosing,
        cumulativeReinvestedBalance: reinvestedBalance,
      });
    }

    const exactCumulativeMaturity = reinvestedBalance;
    const exactCumulativeInterest = exactCumulativeMaturity - depositAmount;

    // Calculate maturity date and premature closure eligibility
    let maturityDate: Date | undefined;
    let earliestPrematureClosureDate: Date | undefined;
    if (openingDate) {
      earliestPrematureClosureDate = TdCalculationEngine.calculateEarliestPrematureClosureDate(openingDate);
      const targetYear = openingDate.getFullYear() + tenureYears;
      const isLeapTarget = (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
      if (openingDate.getMonth() === 1 && openingDate.getDate() === 29 && !isLeapTarget) {
        maturityDate = new Date(targetYear, 1, 28);
      } else {
        maturityDate = new Date(targetYear, openingDate.getMonth(), openingDate.getDate());
      }
    }

    const assumptions = [
      'Official Scheme Rule (Rule 7): Interest is compounded quarterly at (r/400) and is officially payable annually to the account holder.',
      'No Interest on Unwithdrawn Interest (Rule 7(3)): Where interest has become due but remains undrawn, it does not carry additional interest in the Post Office TD account.',
      'Premature Closure (Rule 8): Earliest premature closure allowed after 6 months from deposit date. Between 6 and 12 months, Post Office Savings Account (PO-SB) interest rate applies (no quarterly compounding). After 1 year, interest is calculated at 2% less than the rate applicable to completed tenure.',
      `Principal Repayment: The full principal deposit of ₹${Math.round(depositAmount)} is refunded at maturity after ${tenureYears} year${tenureYears > 1 ? 's' : ''}.`,
      `Official Total Cash Return: Principal (₹${Math.round(depositAmount)}) + Total Annual Payouts (₹${roundedTotalPayoutInterest}) = ₹${roundedOfficialTotalCash}.`,
      `Hypothetical Reinvestment Note: Continuous cumulative compounding to ₹${Math.round(exactCumulativeMaturity)} is a simulated scenario assuming annual payouts are manually reinvested at the same rate outside the scheme.`,
      ...(tenureYears === 5
        ? ['5-Year Time Deposit investment qualifies for tax deduction under Section 80C of the Income Tax Act.']
        : []),
      'Multiples of ₹100 with no maximum investment limit.',
    ];

    return {
      depositAmount,
      tenureYears,
      annualInterestRate,
      annualInterestPayout: oneYearInterest,
      roundedAnnualInterestPayout: roundedOneYearInterest,
      totalPayoutInterest,
      roundedTotalPayoutInterest,
      principalRepayment: depositAmount,
      officialTotalCashReturn: officialTotalCash,
      roundedOfficialTotalCashReturn: roundedOfficialTotalCash,
      hypotheticalCumulativeMaturity: exactCumulativeMaturity,
      roundedHypotheticalCumulativeMaturity: Math.round(exactCumulativeMaturity),
      hypotheticalCumulativeInterest: exactCumulativeInterest,
      roundedHypotheticalCumulativeInterest: Math.round(exactCumulativeInterest),
      openingDate,
      maturityDate,
      earliestPrematureClosureDate,
      quarterlyBreakdown: breakdown,
      is80cEligible: tenureYears === 5,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'td',
          principalAmount: depositAmount,
          totalDeposit: depositAmount,
          interestEarned: roundedTotalPayoutInterest,
          maturityAmount: roundedOfficialTotalCash,
          tenureInYears: tenureYears,
          applicableInterestRate: annualInterestRate,
          annualPayout: roundedOneYearInterest,
        };
      },
    };
  }
}

export const tdCalculationEngine = new TdCalculationEngine();
