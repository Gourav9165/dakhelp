import { InterestRateRepository } from '@/data/repositories/interest-rate-repository';
import { rdCalculationEngine, RdCalculationEngine, RdCalculationResult } from './rd-engine';
import { tdCalculationEngine, TdCalculationEngine, TdCalculationResult } from './td-engine';
import { misCalculationEngine, MisCalculationEngine, MisCalculationResult } from './mis-engine';
import { scssCalculationEngine, ScssCalculationEngine, ScssCalculationResult } from './scss-engine';
import { ppfCalculationEngine, PpfCalculationEngine, PpfCalculationResult } from './ppf-engine';
import { ssaCalculationEngine, SsaCalculationEngine, SsaCalculationResult } from './ssa-engine';
import { nscCalculationEngine, NscCalculationEngine, NscCalculationResult } from './nsc-engine';
import { kvpCalculationEngine, KvpCalculationEngine, KvpCalculationResult } from './kvp-engine';
import { sbCalculationEngine, SbCalculationEngine, SbCalculationResult } from './sb-engine';

export class CalculatorFacade {
  // 1. RD
  static calculateRd(params: {
    monthlyDeposit: number;
    accountOpenDate?: Date;
    advanceMonths?: number;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('rd');
    const result = rdCalculationEngine.calculateRd({
      monthlyDeposit: params.monthlyDeposit,
      annualInterestRate: rate,
      openingDate: params.accountOpenDate,
    });

    let advanceRebate = 0;
    if (params.advanceMonths && params.advanceMonths >= 6) {
      // Post office rebate: 6 months advance gives ₹10 for ₹100 denomination, 12 months gives ₹40
      const units = params.monthlyDeposit / 100;
      if (params.advanceMonths >= 12) {
        advanceRebate = 40 * units;
      } else {
        advanceRebate = 10 * units;
      }
    }

    return {
      monthlyDeposit: result.monthlyDeposit,
      totalDeposit: result.totalPrincipalInvested,
      annualRate: result.annualInterestRate,
      maturityAmount: result.roundedMaturityAmount,
      totalInterest: result.roundedInterestEarned,
      accountOpenDate: result.openingDate ?? new Date('2024-04-01'),
      maturityDate: result.maturityDate ?? new Date('2029-04-01'),
      quarterlyBreakdown: result.quarterlyBreakdown,
      advanceRebate,
      netDepositPaid: result.totalPrincipalInvested - advanceRebate,
      assumptions: result.assumptions,
    };
  }

  // 2. TD
  static calculateTd(params: {
    depositAmount: number;
    tenureYears: 1 | 2 | 3 | 5;
    customRate?: number;
    openingDate?: Date;
  }) {
    const rateKey = `td${params.tenureYears}` as 'td1' | 'td2' | 'td3' | 'td5';
    const rate = params.customRate ?? InterestRateRepository.getLatestRate(rateKey);

    const result = tdCalculationEngine.calculate({
      depositAmount: params.depositAmount,
      tenureYears: params.tenureYears,
      annualInterestRate: rate,
      openingDate: params.openingDate,
    });

    return {
      depositAmount: result.depositAmount,
      annualRate: result.annualInterestRate,
      tenureYears: result.tenureYears,
      annualInterestPayout: result.roundedAnnualInterestPayout,
      totalAnnualInterest: result.roundedTotalPayoutInterest,
      totalRepaidAmount: result.roundedOfficialTotalCashReturn,
      schedule: result.quarterlyBreakdown
        .filter((_, idx) => (idx + 1) % 4 === 0)
        .map((q, idx) => ({
          year: idx + 1,
          principal: result.depositAmount,
          annualInterest: result.roundedAnnualInterestPayout,
          closingPrincipal: result.depositAmount,
        })),
      assumptions: result.assumptions,
    };
  }

  // 3. MIS
  static calculateMis(params: {
    depositAmount: number;
    accountType: 'single' | 'joint';
    customRate?: number;
    openingDate?: Date;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('mis');
    const result = misCalculationEngine.calculate({
      depositAmount: params.depositAmount,
      isJointAccount: params.accountType === 'joint',
      annualInterestRate: rate,
      openingDate: params.openingDate,
    });

    return {
      depositAmount: result.depositAmount,
      annualRate: result.annualInterestRate,
      monthlyIncome: result.roundedMonthlyPayout,
      annualIncome: result.annualInterestPayout,
      totalInterestReceived: result.roundedTotalInterest,
      totalRepaidAmount: result.totalOverallReturns,
      assumptions: result.assumptions,
    };
  }

  // 4. SCSS
  static calculateScss(params: {
    depositAmount: number;
    accountOpenDate?: Date;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('scss');
    const result = scssCalculationEngine.calculate({
      depositAmount: params.depositAmount,
      annualInterestRate: rate,
      openingDate: params.accountOpenDate,
    });

    return {
      depositAmount: result.depositAmount,
      annualRate: result.annualInterestRate,
      quarterlyInterestPayout: result.roundedQuarterlyPayout,
      firstQuarterPayout: result.roundedFirstQuarterPayout,
      totalInterestReceived: result.roundedTotalInterest,
      totalRepaidAmount: result.totalOverallReturns,
      accountOpenDate: result.openingDate ?? new Date('2024-04-01'),
      maturityDate: result.maturityDate ?? new Date('2029-04-01'),
      assumptions: result.assumptions,
    };
  }

  // 5. PPF
  static calculatePpf(params: {
    annualDeposit: number;
    depositTiming: 'on_or_before_5th' | 'after_5th';
    startFinancialYear?: number;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('ppf');
    const result = ppfCalculationEngine.calculate({
      depositAmount: params.annualDeposit,
      annualInterestRate: rate,
      isDepositedBefore5th: params.depositTiming === 'on_or_before_5th',
    });

    const startYear = params.startFinancialYear ?? 2024;
    const maturityYear = startYear + 16; // 15 full financial years after end of opening FY

    return {
      annualDeposit: result.annualDepositTotal,
      totalDeposit: result.totalPrincipalInvested,
      annualRate: result.annualInterestRate,
      totalInterest: result.roundedInterestEarned,
      maturityAmount: result.roundedMaturityAmount,
      maturityYear,
      schedule: result.yearlyBreakdown.map((b) => ({
        financialYear: `FY ${startYear + b.yearNumber - 1}-${(startYear + b.yearNumber).toString().slice(-2)}`,
        openingBalance: b.openingBalance,
        deposit: b.depositsAdded,
        interestEarned: b.interestEarned,
        closingBalance: b.closingBalance,
      })),
      assumptions: result.assumptions,
    };
  }

  // 6. SSA
  static calculateSsa(params: {
    annualDeposit: number;
    childCurrentAge: number;
    openingYear?: number;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('ssa');
    const result = ssaCalculationEngine.calculate({
      depositAmount: params.annualDeposit,
      annualInterestRate: rate,
      girlChildAgeAtOpening: params.childCurrentAge,
    });

    const startYear = params.openingYear ?? 2024;
    const maturityYear = startYear + 21;
    const maturityAge = params.childCurrentAge + 21;

    return {
      annualDeposit: result.annualContribution,
      totalDeposit: result.totalPrincipalInvested,
      annualRate: result.annualInterestRate,
      totalInterest: result.roundedInterestEarned,
      maturityAmount: result.roundedMaturityAmount,
      maturityYear,
      girlChildAgeAtMaturity: maturityAge,
      schedule: result.yearlyBreakdown.map((b) => ({
        year: b.yearNumber,
        childAge: params.childCurrentAge + b.yearNumber - 1,
        deposit: b.depositsAdded,
        interestEarned: b.interestEarned,
        closingBalance: b.closingBalance,
      })),
      assumptions: result.assumptions,
    };
  }

  // 7. NSC
  static calculateNsc(params: {
    depositAmount: number;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('nsc');
    const result = nscCalculationEngine.calculate({
      depositAmount: params.depositAmount,
      annualInterestRate: rate,
    });

    return {
      depositAmount: result.principalAmount,
      annualRate: result.annualInterestRate,
      totalInterest: result.roundedInterestEarned,
      maturityAmount: result.roundedMaturityAmount,
      schedule: result.yearlyBreakdown.map((b) => ({
        year: b.yearNumber,
        openingBalance: b.openingBalance,
        interestAccrued: b.interestEarned,
        qualifiesFor80C: b.isDeemedReinvested,
        closingBalance: b.closingBalance,
      })),
      assumptions: result.assumptions,
    };
  }

  // 8. KVP
  static calculateKvp(params: {
    depositAmount: number;
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('kvp');
    const result = kvpCalculationEngine.calculate({
      depositAmount: params.depositAmount,
      annualInterestRate: rate,
    });

    return {
      depositAmount: result.depositAmount,
      annualRate: result.annualInterestRate,
      doublingMonths: result.doublingPeriodMonths,
      totalInterest: result.totalInterestEarned,
      maturityAmount: result.maturityAmount,
      accrualSchedule: result.accrualSchedule.map((b) => ({
        periodLabel: b.periodLabel,
        accruedAmount: b.closingBalance,
        interestForPeriod: b.interestAccruedInYear,
      })),
      assumptions: result.assumptions,
    };
  }

  // 9. SB
  static calculateSb(params: {
    monthlyBalances: number[];
    customRate?: number;
  }) {
    const rate = params.customRate ?? InterestRateRepository.getLatestRate('sb');
    const avg =
      params.monthlyBalances.reduce((a, b) => a + b, 0) / (params.monthlyBalances.length || 1);

    const result = sbCalculationEngine.calculate({
      balance: avg,
      annualInterestRate: rate,
      customMonthlyBalances: params.monthlyBalances,
    });

    return {
      averageMonthlyBalance: avg,
      annualRate: result.annualInterestRate,
      annualInterestCredited: result.roundedAnnualInterest,
      closingBalanceAtMarch31: result.closingBalance,
      assumptions: result.assumptions,
    };
  }
}
