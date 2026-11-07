import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface MisCalculationResult {
  depositAmount: number;
  isJointAccount: boolean;
  annualInterestRate: number;
  tenureYears: number;
  totalMonths: number;
  monthlyInterestPayout: number;
  roundedMonthlyPayout: number;
  annualInterestPayout: number;
  totalInterestEarned: number;
  roundedTotalInterest: number;
  maturityPrincipalRefund: number;
  totalOverallReturns: number;
  openingDate?: Date;
  maturityDate?: Date;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class MisCalculationEngine {
  public static readonly minDeposit = 1000.0;
  public static readonly depositMultiple = 1000.0;
  public static readonly singleMaxDeposit = 900000.0;
  public static readonly jointMaxDeposit = 1500000.0;
  public static readonly tenureYears = 5;
  public static readonly totalMonths = 60;

  public calculate(params: {
    depositAmount: number;
    isJointAccount?: boolean;
    annualInterestRate: number;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): MisCalculationResult {
    const {
      depositAmount,
      isJointAccount = false,
      annualInterestRate,
      openingDate,
      isCustomRate = false,
    } = params;

    if (depositAmount < MisCalculationEngine.minDeposit) {
      throw new CalculationValidationException('Minimum deposit for Monthly Income Scheme is ₹1,000.');
    }
    if (Math.abs(depositAmount % MisCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Deposit amount must be in multiples of ₹1,000.');
    }

    const maxLimit = isJointAccount
      ? MisCalculationEngine.jointMaxDeposit
      : MisCalculationEngine.singleMaxDeposit;

    if (depositAmount > maxLimit) {
      const limitLabel = isJointAccount ? '₹15 Lakh for Joint Account' : '₹9 Lakh for Single Account';
      throw new CalculationValidationException(`Maximum deposit limit is ${limitLabel}.`);
    }

    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    // Monthly interest: (Deposit * Rate) / 1200 with 2 decimal precision
    const rawMonthly = (depositAmount * annualInterestRate) / 1200.0;
    const monthlyPayout = Math.round(rawMonthly * 100.0) / 100.0;
    const roundedMonthly = Math.round(monthlyPayout);
    const annualPayout = Math.round(monthlyPayout * 12.0 * 100.0) / 100.0;
    const totalInterest = Math.round(monthlyPayout * MisCalculationEngine.totalMonths * 100.0) / 100.0;
    const roundedTotalInterest = roundedMonthly * MisCalculationEngine.totalMonths;

    // Maturity date after 5 years
    let maturityDate: Date | undefined;
    if (openingDate) {
      const targetYear = openingDate.getFullYear() + MisCalculationEngine.tenureYears;
      const isLeapTarget = (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
      if (openingDate.getMonth() === 1 && openingDate.getDate() === 29 && !isLeapTarget) {
        maturityDate = new Date(targetYear, 1, 28);
      } else {
        maturityDate = new Date(targetYear, openingDate.getMonth(), openingDate.getDate());
      }
    }

    const assumptions = [
      'Interest is paid on completion of a month from the date of opening, credited automatically to your Post Office Savings Account.',
      'If the monthly interest is not claimed or withdrawn, it does not earn any additional interest.',
      'Deposit limits: Up to ₹9,00,000 in a single account and up to ₹15,00,000 in a joint account.',
      'Full initial principal is refunded upon maturity after 5 years (60 months).',
      'Interest is taxable in the hands of the depositor; no Section 80C deduction applies to the deposit.',
    ];

    return {
      depositAmount,
      isJointAccount,
      annualInterestRate,
      tenureYears: MisCalculationEngine.tenureYears,
      totalMonths: MisCalculationEngine.totalMonths,
      monthlyInterestPayout: monthlyPayout,
      roundedMonthlyPayout: roundedMonthly,
      annualInterestPayout: annualPayout,
      totalInterestEarned: totalInterest,
      roundedTotalInterest,
      maturityPrincipalRefund: depositAmount,
      totalOverallReturns: depositAmount + totalInterest,
      openingDate,
      maturityDate,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'mis',
          principalAmount: depositAmount,
          totalDeposit: depositAmount,
          interestEarned: roundedTotalInterest,
          maturityAmount: depositAmount,
          tenureInYears: MisCalculationEngine.tenureYears,
          applicableInterestRate: annualInterestRate,
          monthlyPayout: roundedMonthly,
        };
      },
    };
  }
}

export const misCalculationEngine = new MisCalculationEngine();
