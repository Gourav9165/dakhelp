import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export interface NscYearlyBreakdown {
  yearNumber: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
  isDeemedReinvested: boolean;
}

export interface NscCalculationResult {
  principalAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  exactMaturityAmount: number;
  roundedMaturityAmount: number;
  exactInterestEarned: number;
  roundedInterestEarned: number;
  yearlyBreakdown: NscYearlyBreakdown[];
  openingDate?: Date;
  maturityDate?: Date;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class NscCalculationEngine {
  public static readonly minDeposit = 1000.0;
  public static readonly depositMultiple = 100.0;
  public static readonly tenureYears = 5;

  public calculate(params: {
    depositAmount: number;
    annualInterestRate: number;
    openingDate?: Date;
    isCustomRate?: boolean;
  }): NscCalculationResult {
    const { depositAmount, annualInterestRate, openingDate, isCustomRate = false } = params;

    if (depositAmount < NscCalculationEngine.minDeposit) {
      throw new CalculationValidationException('Minimum investment for NSC is ₹1,000.');
    }
    if (Math.abs(depositAmount % NscCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Investment amount must be in multiples of ₹100.');
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    const rateFactor = 1.0 + annualInterestRate / 100.0;
    const breakdowns: NscYearlyBreakdown[] = [];
    let balance = depositAmount;

    for (let y = 1; y <= NscCalculationEngine.tenureYears; y++) {
      const opening = balance;
      const closing = opening * rateFactor;
      const interest = closing - opening;
      const isDeemedReinvested = y < NscCalculationEngine.tenureYears;

      breakdowns.push({
        yearNumber: y,
        openingBalance: opening,
        interestEarned: interest,
        closingBalance: closing,
        isDeemedReinvested,
      });
      balance = closing;
    }

    const exactMaturity = depositAmount * Math.pow(rateFactor, NscCalculationEngine.tenureYears);
    const exactInterest = exactMaturity - depositAmount;

    let maturityDate: Date | undefined;
    if (openingDate) {
      const targetYear = openingDate.getFullYear() + NscCalculationEngine.tenureYears;
      const isLeapTarget = (targetYear % 4 === 0 && targetYear % 100 !== 0) || targetYear % 400 === 0;
      if (openingDate.getMonth() === 1 && openingDate.getDate() === 29 && !isLeapTarget) {
        maturityDate = new Date(targetYear, 1, 28);
      } else {
        maturityDate = new Date(targetYear, openingDate.getMonth(), openingDate.getDate());
      }
    }

    const assumptions = [
      'Interest is compounded annually but is payable only on maturity at the end of 5 years.',
      'Initial deposit qualifies for tax deduction under Section 80C of the Income Tax Act.',
      'Interest accrued in Years 1 to 4 is deemed reinvested and also qualifies for Section 80C deduction.',
      'Interest earned in the 5th (final) year cannot be reinvested and is added to taxable income.',
      'No upper limit on investment amount.',
    ];

    return {
      principalAmount: depositAmount,
      annualInterestRate,
      tenureYears: NscCalculationEngine.tenureYears,
      exactMaturityAmount: exactMaturity,
      roundedMaturityAmount: Math.round(exactMaturity),
      exactInterestEarned: exactInterest,
      roundedInterestEarned: Math.round(exactInterest),
      yearlyBreakdown: breakdowns,
      openingDate,
      maturityDate,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'nsc',
          principalAmount: depositAmount,
          totalDeposit: depositAmount,
          interestEarned: Math.round(exactInterest),
          maturityAmount: Math.round(exactMaturity),
          tenureInYears: NscCalculationEngine.tenureYears,
          applicableInterestRate: annualInterestRate,
        };
      },
    };
  }
}

export const nscCalculationEngine = new NscCalculationEngine();
