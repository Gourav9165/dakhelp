import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface SbMonthlyBreakdown {
  monthIndex: number;
  monthName: string;
  eligibleBalance: number;
  interestAccrued: number;
  isEligibleForInterest: boolean;
}

export interface SbCalculationResult {
  openingBalance: number;
  annualInterestRate: number;
  financialYearLabel: string;
  monthlyBreakdowns: SbMonthlyBreakdown[];
  exactAnnualInterest: number;
  roundedAnnualInterest: number;
  closingBalance: number;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class SbCalculationEngine {
  public static readonly minBalance = 500.0;
  public static readonly financialYearMonths = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March',
  ];

  public calculate(params: {
    balance: number;
    annualInterestRate?: number;
    customMonthlyBalances?: number[];
    financialYearStartYear?: number;
    isCustomRate?: boolean;
  }): SbCalculationResult {
    const {
      balance,
      annualInterestRate = 4.0,
      customMonthlyBalances,
      financialYearStartYear,
      isCustomRate = false,
    } = params;

    if (balance < 0) {
      throw new CalculationValidationException('Account balance cannot be negative.');
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    const startYear = financialYearStartYear ?? 2024;
    const fyLabel = `FY ${startYear}-${(startYear + 1).toString().slice(2)}`;

    const breakdowns: SbMonthlyBreakdown[] = [];
    let totalExactInterest = 0.0;

    for (let i = 0; i < 12; i++) {
      const monthBalance =
        customMonthlyBalances && customMonthlyBalances.length === 12
          ? customMonthlyBalances[i]
          : balance;

      const isEligible = monthBalance >= SbCalculationEngine.minBalance;
      const monthlyInterest = isEligible
        ? (monthBalance * annualInterestRate) / 1200.0
        : 0.0;

      totalExactInterest += monthlyInterest;

      breakdowns.push({
        monthIndex: i + 1,
        monthName: SbCalculationEngine.financialYearMonths[i],
        eligibleBalance: monthBalance,
        interestAccrued: monthlyInterest,
        isEligibleForInterest: isEligible,
      });
    }

    const roundedInterest = Math.round(totalExactInterest);
    const closing = balance + roundedInterest;

    const assumptions = [
      'Interest is calculated on the minimum balance held between the 10th and the last day of each month.',
      `No interest is allowed for any calendar month where the balance drops below ₹${SbCalculationEngine.minBalance} at any point between the 10th and month-end.`,
      'Interest is credited to the account once a year at the end of the financial year (31 March).',
      'Interest earned up to ₹10,000 per financial year is tax-exempt under Section 80TTA (₹50,000 for senior citizens under Section 80TTB).',
    ];

    return {
      openingBalance: balance,
      annualInterestRate,
      financialYearLabel: fyLabel,
      monthlyBreakdowns: breakdowns,
      exactAnnualInterest: totalExactInterest,
      roundedAnnualInterest: roundedInterest,
      closingBalance: closing,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'sb',
          principalAmount: balance,
          totalDeposit: balance,
          interestEarned: roundedInterest,
          maturityAmount: closing,
          tenureInYears: 1.0,
          applicableInterestRate: annualInterestRate,
          annualPayout: roundedInterest,
        };
      },
    };
  }
}

export const sbCalculationEngine = new SbCalculationEngine();
