import { GenericCalculationResult, CalculationValidationException } from './calculation-engine-base';

export type SsaDepositFrequency = 'monthly' | 'annually';

export interface SsaYearlyBreakdown {
  yearNumber: number;
  openingBalance: number;
  depositsAdded: number;
  interestEarned: number;
  closingBalance: number;
  isDepositPeriodActive: boolean;
}

export interface SsaCalculationResult {
  depositFrequency: SsaDepositFrequency;
  depositAmount: number;
  annualContribution: number;
  annualInterestRate: number;
  depositTenureYears: number;
  maturityTenureYears: number;
  totalPrincipalInvested: number;
  exactInterestEarned: number;
  roundedInterestEarned: number;
  exactMaturityAmount: number;
  roundedMaturityAmount: number;
  yearlyBreakdown: SsaYearlyBreakdown[];
  girlChildAgeAtOpening?: number;
  assumptions: string[];
  isCustomRate: boolean;
  toGenericResult(): GenericCalculationResult;
}

export class SsaCalculationEngine {
  public static readonly minAnnualDeposit = 250.0;
  public static readonly maxAnnualDeposit = 150000.0;
  public static readonly depositMultiple = 50.0;
  public static readonly depositYears = 15;
  public static readonly maturityYears = 21;
  public static readonly maxGirlAge = 10;

  public calculate(params: {
    depositAmount: number;
    depositFrequency?: SsaDepositFrequency;
    annualInterestRate: number;
    girlChildAgeAtOpening?: number;
    isDepositedBefore5th?: boolean;
    isCustomRate?: boolean;
  }): SsaCalculationResult {
    const {
      depositAmount,
      depositFrequency = 'annually',
      annualInterestRate,
      girlChildAgeAtOpening,
      isDepositedBefore5th = true,
      isCustomRate = false,
    } = params;

    if (depositAmount <= 0) {
      throw new CalculationValidationException('Deposit amount must be greater than zero.');
    }
    if (Math.abs(depositAmount % SsaCalculationEngine.depositMultiple) > 0.001) {
      throw new CalculationValidationException('Deposit amount must be in multiples of ₹50.');
    }

    const annualContribution =
      depositFrequency === 'monthly' ? depositAmount * 12.0 : depositAmount;

    if (annualContribution < SsaCalculationEngine.minAnnualDeposit) {
      throw new CalculationValidationException(
        'Minimum annual deposit for Sukanya Samriddhi Account is ₹250.'
      );
    }
    if (annualContribution > SsaCalculationEngine.maxAnnualDeposit) {
      throw new CalculationValidationException('Maximum annual deposit is ₹1,50,000 per financial year.');
    }
    if (
      girlChildAgeAtOpening !== undefined &&
      (girlChildAgeAtOpening < 0 || girlChildAgeAtOpening > SsaCalculationEngine.maxGirlAge)
    ) {
      throw new CalculationValidationException(
        'Account can only be opened for a girl child aged between 0 and 10 years.'
      );
    }
    if (annualInterestRate <= 0) {
      throw new CalculationValidationException('Annual interest rate must be greater than zero.');
    }

    const breakdowns: SsaYearlyBreakdown[] = [];
    let balance = 0.0;
    let totalDeposited = 0.0;
    let totalInterestAccrued = 0.0;

    for (let y = 1; y <= SsaCalculationEngine.maturityYears; y++) {
      const isDepositActive = y <= SsaCalculationEngine.depositYears;
      const opening = balance;
      let yearInterest = 0.0;
      let depositsInYear = 0.0;

      if (isDepositActive) {
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
      } else {
        // Years 16 to 21: No deposits made, compounding continues on accumulated balance
        depositsInYear = 0.0;
        yearInterest = (opening * annualInterestRate) / 100.0;
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
        isDepositPeriodActive: isDepositActive,
      });
    }

    const assumptions = [
      `Quarterly Rate Revision Disclosure: Long-term 21-year returns are financial projections assuming the currently notified rate of ${annualInterestRate}% p.a. remains unchanged. Interest rates for small savings schemes are reviewed and notified by the Government of India on a quarterly basis and are not guaranteed over the 21-year horizon.`,
      'Account can be opened for a girl child up to 10 years of age (max 2 accounts per family, exception for twins/triplets).',
      'Deposits are required for the first 15 years from account opening.',
      'The account continues to earn compound interest without additional deposits from year 16 until maturity at 21 years.',
      'Partial withdrawal up to 50% of the preceding financial year balance is allowed after the girl turns 18 for higher education.',
      'Exempt-Exempt-Exempt (EEE) status: Tax deduction under 80C, fully tax-free interest, and tax-free maturity proceeds.',
    ];

    return {
      depositFrequency,
      depositAmount,
      annualContribution,
      annualInterestRate,
      depositTenureYears: SsaCalculationEngine.depositYears,
      maturityTenureYears: SsaCalculationEngine.maturityYears,
      totalPrincipalInvested: totalDeposited,
      exactInterestEarned: totalInterestAccrued,
      roundedInterestEarned: Math.round(totalInterestAccrued),
      exactMaturityAmount: balance,
      roundedMaturityAmount: Math.round(balance),
      yearlyBreakdown: breakdowns,
      girlChildAgeAtOpening,
      assumptions,
      isCustomRate,
      toGenericResult(): GenericCalculationResult {
        return {
          schemeId: 'ssa',
          principalAmount: depositAmount,
          totalDeposit: totalDeposited,
          interestEarned: Math.round(totalInterestAccrued),
          maturityAmount: Math.round(balance),
          tenureInYears: SsaCalculationEngine.maturityYears,
          applicableInterestRate: annualInterestRate,
        };
      },
    };
  }
}

export const ssaCalculationEngine = new SsaCalculationEngine();
