import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface KvpYearlyAccrualBreakdown {
  yearNumber: number;
  periodLabel: string;
  openingBalance: number;
  interestAccruedInYear: number;
  closingBalance: number;
  cumulativeAccruedInterest: number;
}

export interface KvpCalculationResult {
  depositAmount: number;
  annualInterestRate: number;
  doublingPeriodMonths: number;
  doublingPeriodYearsAndMonths: string;
  maturityAmount: number;
  totalInterestEarned: number;
  openingDate?: Date;
  maturityDate?: Date;
  accrualSchedule: KvpYearlyAccrualBreakdown[];
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class KvpCalculationEngine {
  public static readonly minDeposit = 1000.0;
  public static readonly depositMultiple = 100.0;
  public static readonly currentDoublingMonths = 115; // 9 years 7 months

  public calculate(params: {
    depositAmount: number;
    annualInterestRate?: number;
    doublingMonths?: number;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): KvpCalculationResult {
    const {
      depositAmount,
      annualInterestRate = 7.5,
      doublingMonths = KvpCalculationEngine.currentDoublingMonths,
      openingDate,
      isCustomRate = false,
    } = params;

    if (depositAmount < KvpCalculationEngine.minDeposit) {
      throw new CalculationValidationException('Minimum investment for Kisan Vikas Patra is ₹1,000.');
    }
    if (Math.abs(depositAmount % KvpCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Investment amount must be in multiples of ₹100.');
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }
    if (doublingMonths <= 0) {
      throw new CalculationValidationException('Doubling period must be greater than zero.');
    }

    const maturityAmount = depositAmount * 2.0;
    const totalInterest = depositAmount;

    const years = Math.floor(doublingMonths / 12);
    const remainingMonths = doublingMonths % 12;
    const periodString = `${years} Years ${remainingMonths} Months (${doublingMonths} Months)`;

    let maturityDate: Date | undefined;
    if (openingDate) {
      const currentMonth1Based = openingDate.getMonth() + 1;
      const totalTargetMonth = currentMonth1Based + doublingMonths;
      const targetYear = openingDate.getFullYear() + Math.floor((totalTargetMonth - 1) / 12);
      const targetMonth1Based = ((totalTargetMonth - 1) % 12) + 1;

      const daysInTargetMonth = new Date(targetYear, targetMonth1Based, 0).getDate();
      const targetDay = Math.min(openingDate.getDate(), daysInTargetMonth);

      maturityDate = new Date(targetYear, targetMonth1Based - 1, targetDay);
    }

    // Build annual accrual progression schedule (for ITR tax reporting purposes)
    const accrualSchedule: KvpYearlyAccrualBreakdown[] = [];
    let balance = depositAmount;
    const r = annualInterestRate / 100.0;

    for (let y = 1; y <= years; y++) {
      const opening = balance;
      const interest = Math.round(opening * r * 100.0) / 100.0;
      const closing = opening + interest;
      balance = closing;

      accrualSchedule.push({
        yearNumber: y,
        periodLabel: `Year ${y} (12 Months)`,
        openingBalance: opening,
        interestAccruedInYear: interest,
        closingBalance: closing,
        cumulativeAccruedInterest: closing - depositAmount,
      });
    }

    if (remainingMonths > 0) {
      const opening = balance;
      const interest = maturityAmount - opening;
      const closing = maturityAmount;

      accrualSchedule.push({
        yearNumber: years + 1,
        periodLabel: `Year ${years + 1} (${remainingMonths} Months to Maturity)`,
        openingBalance: opening,
        interestAccruedInYear: interest,
        closingBalance: closing,
        cumulativeAccruedInterest: totalInterest,
      });
    }

    const assumptions = [
      `Invested amount doubles on completion of the notified maturity period (${doublingMonths} months / ${years} years ${remainingMonths} months).`,
      'Accrued Interest for ITR: Interest accrues annually on a compounding basis and can be declared annually for Income Tax (ITR), but total proceeds are paid exclusively at maturity or premature encashment.',
      'No upper limit on investment. Certificates issued in denominations of ₹1,000, ₹5,000, ₹10,000, and ₹50,000.',
      'Premature encashment is permitted after 2 years and 6 months (30 months) from the date of issue.',
      'Interest is fully taxable in the hands of the investor (no 80C deduction applies).',
      'Transferable from one post office to another and from one person to another with official approval.',
    ];

    return {
      depositAmount,
      annualInterestRate,
      doublingPeriodMonths: doublingMonths,
      doublingPeriodYearsAndMonths: periodString,
      maturityAmount,
      totalInterestEarned: totalInterest,
      openingDate,
      maturityDate,
      accrualSchedule,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'kvp',
          principalAmount: depositAmount,
          totalDeposit: depositAmount,
          interestEarned: totalInterest,
          maturityAmount,
          tenureInYears: doublingMonths / 12.0,
          applicableInterestRate: annualInterestRate,
        };
      },
    };
  }
}

export const kvpCalculationEngine = new KvpCalculationEngine();
