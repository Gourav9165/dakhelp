import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface RdQuarterlyBreakdown {
  quarterNumber: number;
  openingBalance: number;
  depositsAdded: number;
  interestEarned: number;
  closingBalance: number;
}

export interface RdCalculationResult {
  monthlyDeposit: number;
  totalPrincipalInvested: number;
  totalInstallments: number;
  tenureInYears: number;
  annualInterestRate: number;
  exactMaturityAmount: number;
  roundedMaturityAmount: number;
  exactInterestEarned: number;
  roundedInterestEarned: number;
  openingDate?: Date;
  maturityDate?: Date;
  quarterlyBreakdown: RdQuarterlyBreakdown[];
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class RdCalculationEngine {
  public static readonly standardTenureYears = 5;
  public static readonly totalMonths = 60;
  public static readonly totalQuarters = 20;
  public static readonly minimumDeposit = 100.0;
  public static readonly depositMultipleOf = 10;

  public static validateDepositAmount(amount: number): void {
    if (isNaN(amount) || !isFinite(amount)) {
      throw new CalculationValidationException('Please enter a valid numeric deposit amount.');
    }
    if (amount < RdCalculationEngine.minimumDeposit) {
      throw new CalculationValidationException('Minimum monthly deposit is ₹100 as per Post Office RD rules.');
    }
    const roundedInt = Math.round(amount);
    if (Math.abs(amount - roundedInt) > 0.0001 || roundedInt % RdCalculationEngine.depositMultipleOf !== 0) {
      throw new CalculationValidationException(
        'Monthly deposit must be in multiples of ₹10 (e.g., ₹100, ₹150, ₹1,000).'
      );
    }
  }

  public static validateInterestRate(rate: number): void {
    if (isNaN(rate) || !isFinite(rate) || rate <= 0) {
      throw new CalculationValidationException('Interest rate must be a positive percentage.');
    }
    if (rate > 25.0) {
      throw new CalculationValidationException('Interest rate exceeds plausible small savings limits.');
    }
  }

  public static daysInMonth(year: number, month1Based: number): number {
    if (month1Based === 2) {
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeap ? 29 : 28;
    }
    const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month1Based];
  }

  public static calculateMaturityDate(openingDate: Date): Date {
    const targetYear = openingDate.getFullYear() + RdCalculationEngine.standardTenureYears;
    const targetMonth = openingDate.getMonth(); // 0-based
    const maxDays = RdCalculationEngine.daysInMonth(targetYear, targetMonth + 1);
    const targetDay = Math.min(openingDate.getDate(), maxDays);
    return new Date(targetYear, targetMonth, targetDay);
  }

  public calculateRd(params: {
    monthlyDeposit: number;
    annualInterestRate: number;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): RdCalculationResult {
    const { monthlyDeposit, annualInterestRate, openingDate, isCustomRate = false } = params;

    RdCalculationEngine.validateDepositAmount(monthlyDeposit);
    RdCalculationEngine.validateInterestRate(annualInterestRate);

    const i = annualInterestRate / 400.0; // quarterly rate

    // Factor for IBA / Post Office formula:
    // M = P * ((1+i)^20 - 1) / (1 - (1+i)^(-1/3))
    const denominator = 1.0 - Math.pow(1.0 + i, -1.0 / 3.0);
    const exactMaturity = (monthlyDeposit * (Math.pow(1.0 + i, 20.0) - 1.0)) / denominator;

    const roundedMaturity = Math.round(exactMaturity);
    const totalPrincipal = monthlyDeposit * RdCalculationEngine.totalMonths;
    const roundedInterest = roundedMaturity - Math.round(totalPrincipal);
    const exactInterest = exactMaturity - totalPrincipal;

    // Calculate quarterly progression
    const breakdown: RdQuarterlyBreakdown[] = [];
    const qInstallmentsValue =
      monthlyDeposit *
      (Math.pow(1.0 + i, 1.0) + Math.pow(1.0 + i, 2.0 / 3.0) + Math.pow(1.0 + i, 1.0 / 3.0));

    let currentBalance = 0.0;
    const quarterlyDeposits = 3.0;

    for (let q = 1; q <= RdCalculationEngine.totalQuarters; q++) {
      const opening = currentBalance;
      const interestFromOpening = opening * i;
      const interestFromQuarterDeposits = qInstallmentsValue - quarterlyDeposits * monthlyDeposit;
      const qInterest = interestFromOpening + interestFromQuarterDeposits;

      currentBalance = opening + quarterlyDeposits * monthlyDeposit + qInterest;

      breakdown.push({
        quarterNumber: q,
        openingBalance: opening,
        depositsAdded: quarterlyDeposits * monthlyDeposit,
        interestEarned: qInterest,
        closingBalance: currentBalance,
      });
    }

    const maturityDate = openingDate ? RdCalculationEngine.calculateMaturityDate(openingDate) : undefined;

    const assumptions = [
      'Standard 5-year tenure with exactly 60 timely monthly deposits.',
      isCustomRate
        ? `Hypothetical / simulated rate of ${annualInterestRate.toFixed(2)}% p.a. (compounded quarterly).`
        : `Official notified rate of ${annualInterestRate.toFixed(2)}% p.a. locked for the entire 5-year (60-month) tenure from opening date.`,
      'Maturity amount rounded to the nearest integer rupee per National Savings Rules.',
      'Does not include advance deposit rebates, default penalties, premature closure, or loan facilities.',
    ];

    return {
      monthlyDeposit,
      totalPrincipalInvested: totalPrincipal,
      totalInstallments: RdCalculationEngine.totalMonths,
      tenureInYears: RdCalculationEngine.standardTenureYears,
      annualInterestRate,
      exactMaturityAmount: exactMaturity,
      roundedMaturityAmount: roundedMaturity,
      exactInterestEarned: exactInterest,
      roundedInterestEarned: roundedInterest,
      openingDate,
      maturityDate,
      quarterlyBreakdown: breakdown,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'rd',
          principalAmount: monthlyDeposit,
          totalDeposit: totalPrincipal,
          interestEarned: roundedInterest,
          maturityAmount: roundedMaturity,
          tenureInYears: RdCalculationEngine.standardTenureYears,
          applicableInterestRate: annualInterestRate,
        };
      },
    };
  }
}

export const rdCalculationEngine = new RdCalculationEngine();
