import { CalculationValidationException } from './calculation-engine-base';

export type CustomCalculationMode = 'simple' | 'compound';
export type CustomCompoundingFrequency = 'monthly' | 'quarterly' | 'halfYearly' | 'annually';
export type CustomContributionFrequency = 'monthly' | 'quarterly' | 'yearly';
export type CustomContributionTiming = 'beginningOfPeriod' | 'endOfPeriod';

export interface CustomInterestSchedulePeriod {
  periodIndex: number;
  periodLabel: string;
  openingBalance: number;
  depositAdded: number;
  interestEarned: number;
  closingBalance: number;
  totalInvestedToDate: number;
}

export interface CustomInterestResult {
  mode: CustomCalculationMode;
  principalAmount: number;
  annualRate: number;
  durationInYears: number;
  durationMonths: number;
  compoundingFrequency?: CustomCompoundingFrequency;
  hasRecurringContributions: boolean;
  recurringAmount: number;
  contributionFrequency?: CustomContributionFrequency;
  contributionTiming?: CustomContributionTiming;
  totalPrincipalInvested: number;
  totalContributionsInvested: number;
  totalInvested: number;
  totalInterestEarned: number;
  roundedInterestEarned: number;
  finalAmount: number;
  roundedFinalAmount: number;
  schedule: CustomInterestSchedulePeriod[];
  formulaDescription: string;
  assumptions: string[];
}

export class CustomInterestCalculatorEngine {
  public static getCompoundingPeriodsPerYear(freq: CustomCompoundingFrequency): number {
    switch (freq) {
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'halfYearly': return 2;
      case 'annually': return 1;
    }
  }

  public static getContributionPeriodsPerYear(freq: CustomContributionFrequency): number {
    switch (freq) {
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'yearly': return 1;
    }
  }

  public calculate(params: {
    mode: CustomCalculationMode;
    principal: number;
    annualRate: number;
    durationInYears: number;
    durationInMonths?: number;
    compoundingFrequency?: CustomCompoundingFrequency;
    enableRecurring?: boolean;
    recurringAmount?: number;
    contributionFrequency?: CustomContributionFrequency;
    contributionTiming?: CustomContributionTiming;
  }): CustomInterestResult {
    const {
      mode,
      principal,
      annualRate,
      durationInYears,
      durationInMonths,
      compoundingFrequency = 'annually',
      enableRecurring = false,
      recurringAmount = 0.0,
      contributionFrequency = 'monthly',
      contributionTiming = 'beginningOfPeriod',
    } = params;

    if (principal < 0) {
      throw new CalculationValidationException('Principal amount cannot be negative.');
    }
    if (enableRecurring && recurringAmount < 0) {
      throw new CalculationValidationException('Recurring contribution amount cannot be negative.');
    }
    if (principal === 0 && (!enableRecurring || recurringAmount === 0)) {
      throw new CalculationValidationException('Please enter a principal amount or recurring contribution.');
    }
    if (annualRate < 0 || annualRate > 100) {
      throw new CalculationValidationException('Annual interest rate must be between 0% and 100%.');
    }
    if (durationInYears <= 0) {
      throw new CalculationValidationException('Duration must be greater than zero.');
    }

    const totalMonths = durationInMonths ?? Math.round(durationInYears * 12);

    if (mode === 'simple') {
      return this.calculateSimpleInterest({
        principal,
        annualRate,
        durationInYears,
        totalMonths,
        enableRecurring,
        recurringAmount,
        contributionFrequency,
        contributionTiming,
      });
    } else {
      return this.calculateCompoundInterest({
        principal,
        annualRate,
        durationInYears,
        totalMonths,
        compoundingFrequency,
        enableRecurring,
        recurringAmount,
        contributionFrequency,
        contributionTiming,
      });
    }
  }

  private calculateSimpleInterest(params: {
    principal: number;
    annualRate: number;
    durationInYears: number;
    totalMonths: number;
    enableRecurring: boolean;
    recurringAmount: number;
    contributionFrequency: CustomContributionFrequency;
    contributionTiming: CustomContributionTiming;
  }): CustomInterestResult {
    const {
      principal,
      annualRate,
      durationInYears,
      totalMonths,
      enableRecurring,
      recurringAmount,
      contributionFrequency,
      contributionTiming,
    } = params;

    let totalContributions = 0.0;
    const interestOnPrincipal = (principal * annualRate * durationInYears) / 100.0;
    let interestOnContributions = 0.0;

    const schedule: CustomInterestSchedulePeriod[] = [];
    const assumptions: string[] = [
      'Simple Interest calculated using formula SI = (P × R × T) / 100.',
      'No interest is compounded or paid on accumulated interest.',
    ];

    if (!enableRecurring || recurringAmount <= 0) {
      const totalInvested = principal;
      const totalInterest = interestOnPrincipal;
      const finalAmount = totalInvested + totalInterest;

      const numYears = Math.ceil(durationInYears);
      let accumulatedInterest = 0.0;
      for (let y = 1; y <= numYears; y++) {
        const yearFraction =
          y === numYears && durationInYears % 1.0 !== 0
            ? durationInYears - (numYears - 1)
            : 1.0;
        const yearInterest = (principal * annualRate * yearFraction) / 100.0;
        accumulatedInterest += yearInterest;
        schedule.push({
          periodIndex: y,
          periodLabel: `Year ${y}`,
          openingBalance: principal + (accumulatedInterest - yearInterest),
          depositAdded: 0.0,
          interestEarned: yearInterest,
          closingBalance: principal + accumulatedInterest,
          totalInvestedToDate: principal,
        });
      }

      return {
        mode: 'simple',
        principalAmount: principal,
        annualRate,
        durationInYears,
        durationMonths: totalMonths,
        hasRecurringContributions: false,
        recurringAmount: 0,
        totalPrincipalInvested: principal,
        totalContributionsInvested: 0.0,
        totalInvested,
        totalInterestEarned: totalInterest,
        roundedInterestEarned: Math.round(totalInterest),
        finalAmount,
        roundedFinalAmount: Math.round(finalAmount),
        schedule,
        formulaDescription: 'SI = (P × R × T) / 100\nFinal Amount = P + SI',
        assumptions,
      };
    }

    // Simple interest with recurring contributions
    const m = CustomInterestCalculatorEngine.getContributionPeriodsPerYear(contributionFrequency);
    const totalInstallments = Math.round(durationInYears * m);
    totalContributions = totalInstallments * recurringAmount;

    for (let k = 1; k <= totalInstallments; k++) {
      const timeInvestedYears =
        contributionTiming === 'beginningOfPeriod'
          ? durationInYears - (k - 1) / m
          : durationInYears - k / m;
      if (timeInvestedYears > 0) {
        interestOnContributions += (recurringAmount * annualRate * timeInvestedYears) / 100.0;
      }
    }

    assumptions.push(
      `Recurring deposits of ₹${recurringAmount} occur ${contributionFrequency}, timing: ${
        contributionTiming === 'beginningOfPeriod'
          ? 'in advance (beginning of period)'
          : 'in arrears (end of period)'
      }.`
    );
    assumptions.push('Each recurring contribution earns linear simple interest for its active duration.');

    const totalInvested = principal + totalContributions;
    const totalInterest = interestOnPrincipal + interestOnContributions;
    const finalAmount = totalInvested + totalInterest;

    const numYears = Math.max(1, Math.ceil(durationInYears));
    const installmentsPerYear = m;
    let currentInvested = principal;
    let currentBalance = principal;

    for (let y = 1; y <= numYears; y++) {
      const installmentsThisYear =
        y === numYears ? totalInstallments - (y - 1) * installmentsPerYear : installmentsPerYear;
      const depositsThisYear = Math.max(0, installmentsThisYear) * recurringAmount;
      currentInvested += depositsThisYear;

      const yearFraction =
        y === numYears && durationInYears % 1.0 !== 0
          ? durationInYears - (numYears - 1)
          : 1.0;
      const principalYearInterest = (principal * annualRate * yearFraction) / 100.0;
      const contribYearInterest =
        totalInstallments > 0
          ? (interestOnContributions / totalInstallments) * installmentsThisYear
          : 0;
      const yearInterest = principalYearInterest + contribYearInterest;

      const opening = currentBalance;
      currentBalance = opening + depositsThisYear + yearInterest;

      schedule.push({
        periodIndex: y,
        periodLabel: `Year ${y}`,
        openingBalance: opening,
        depositAdded: depositsThisYear,
        interestEarned: yearInterest,
        closingBalance: currentBalance,
        totalInvestedToDate: currentInvested,
      });
    }

    return {
      mode: 'simple',
      principalAmount: principal,
      annualRate,
      durationInYears,
      durationMonths: totalMonths,
      hasRecurringContributions: true,
      recurringAmount,
      contributionFrequency,
      contributionTiming,
      totalPrincipalInvested: principal,
      totalContributionsInvested: totalContributions,
      totalInvested,
      totalInterestEarned: totalInterest,
      roundedInterestEarned: Math.round(totalInterest),
      finalAmount,
      roundedFinalAmount: Math.round(finalAmount),
      schedule,
      formulaDescription:
        'SI = SI(Principal) + Σ SI(Contributions)\nSI(P) = (P × R × T) / 100\nSI(C) = (C × R × t_remaining) / 100',
      assumptions,
    };
  }

  private calculateCompoundInterest(params: {
    principal: number;
    annualRate: number;
    durationInYears: number;
    totalMonths: number;
    compoundingFrequency: CustomCompoundingFrequency;
    enableRecurring: boolean;
    recurringAmount: number;
    contributionFrequency: CustomContributionFrequency;
    contributionTiming: CustomContributionTiming;
  }): CustomInterestResult {
    const {
      principal,
      annualRate,
      durationInYears,
      totalMonths,
      compoundingFrequency,
      enableRecurring,
      recurringAmount,
      contributionFrequency,
      contributionTiming,
    } = params;

    const n = CustomInterestCalculatorEngine.getCompoundingPeriodsPerYear(compoundingFrequency);
    const r = annualRate / 100.0;
    const ratePerPeriod = r / n;

    const assumptions: string[] = [
      `Compound Interest calculated with ${compoundingFrequency} compounding (n = ${n} periods/year).`,
      'Lump-sum formula: A = P × (1 + r/n)^(n × t).',
    ];

    const schedule: CustomInterestSchedulePeriod[] = [];

    if (!enableRecurring || recurringAmount <= 0) {
      const totalPeriods = n * durationInYears;
      const finalAmount =
        annualRate === 0 ? principal : principal * Math.pow(1 + ratePerPeriod, totalPeriods);
      const totalInterest = finalAmount - principal;

      const numYears = Math.max(1, Math.ceil(durationInYears));
      for (let y = 1; y <= numYears; y++) {
        const periodsSoFar = Math.min(totalPeriods, n * y);
        const periodsPrior = Math.min(totalPeriods, n * (y - 1));
        const closing =
          annualRate === 0 ? principal : principal * Math.pow(1 + ratePerPeriod, periodsSoFar);
        const opening =
          annualRate === 0 ? principal : principal * Math.pow(1 + ratePerPeriod, periodsPrior);
        const yearInterest = closing - opening;

        schedule.push({
          periodIndex: y,
          periodLabel: `Year ${y}`,
          openingBalance: opening,
          depositAdded: 0.0,
          interestEarned: yearInterest,
          closingBalance: closing,
          totalInvestedToDate: principal,
        });
      }

      return {
        mode: 'compound',
        principalAmount: principal,
        annualRate,
        durationInYears,
        durationMonths: totalMonths,
        compoundingFrequency,
        hasRecurringContributions: false,
        recurringAmount: 0,
        totalPrincipalInvested: principal,
        totalContributionsInvested: 0.0,
        totalInvested: principal,
        totalInterestEarned: totalInterest,
        roundedInterestEarned: Math.round(totalInterest),
        finalAmount,
        roundedFinalAmount: Math.round(finalAmount),
        schedule,
        formulaDescription: 'A = P × (1 + R / (100 × n))^(n × t)\nInterest = A - P',
        assumptions,
      };
    }

    // Compound Interest with recurring contributions
    const m = CustomInterestCalculatorEngine.getContributionPeriodsPerYear(contributionFrequency);
    const totalInstallments = Math.round(durationInYears * m);
    const totalContributions = totalInstallments * recurringAmount;

    assumptions.push(
      `Recurring contribution of ₹${recurringAmount} deposited ${contributionFrequency}, timing: ${
        contributionTiming === 'beginningOfPeriod'
          ? 'in advance (beginning of period)'
          : 'in arrears (end of period)'
      }.`
    );

    const fvPrincipal =
      annualRate === 0 ? principal : principal * Math.pow(1 + r / n, n * durationInYears);

    let fvContributions = 0.0;
    for (let k = 1; k <= totalInstallments; k++) {
      const tDeposit =
        contributionTiming === 'beginningOfPeriod' ? (k - 1) / m : k / m;
      const tRemaining = durationInYears - tDeposit;
      if (tRemaining > 0) {
        const fvDeposit =
          annualRate === 0 ? recurringAmount : recurringAmount * Math.pow(1 + r / n, n * tRemaining);
        fvContributions += fvDeposit;
      } else if (tRemaining === 0) {
        fvContributions += recurringAmount;
      }
    }

    const finalAmount = fvPrincipal + fvContributions;
    const totalInvested = principal + totalContributions;
    const totalInterest = finalAmount - totalInvested;

    const numYears = Math.max(1, Math.ceil(durationInYears));
    let runningInvested = principal;
    let priorClosing = principal;

    for (let y = 1; y <= numYears; y++) {
      const currentYearTime = Math.min(durationInYears, y);
      const currentYearPrincipalVal =
        annualRate === 0 ? principal : principal * Math.pow(1 + r / n, n * currentYearTime);

      let currentYearContribVal = 0.0;
      let depositsThisYear = 0.0;
      for (let k = 1; k <= totalInstallments; k++) {
        const tDeposit =
          contributionTiming === 'beginningOfPeriod' ? (k - 1) / m : k / m;
        if (tDeposit < currentYearTime) {
          const tRemaining = currentYearTime - tDeposit;
          currentYearContribVal +=
            annualRate === 0 ? recurringAmount : recurringAmount * Math.pow(1 + r / n, n * tRemaining);
          if (tDeposit >= y - 1) {
            depositsThisYear += recurringAmount;
          }
        }
      }

      runningInvested += depositsThisYear;
      const closing = currentYearPrincipalVal + currentYearContribVal;
      const interestThisYear = Math.max(0.0, closing - priorClosing - depositsThisYear);

      schedule.push({
        periodIndex: y,
        periodLabel: `Year ${y}`,
        openingBalance: priorClosing,
        depositAdded: depositsThisYear,
        interestEarned: interestThisYear,
        closingBalance: closing,
        totalInvestedToDate: runningInvested,
      });
      priorClosing = closing;
    }

    return {
      mode: 'compound',
      principalAmount: principal,
      annualRate,
      durationInYears,
      durationMonths: totalMonths,
      compoundingFrequency,
      hasRecurringContributions: true,
      recurringAmount,
      contributionFrequency,
      contributionTiming,
      totalPrincipalInvested: principal,
      totalContributionsInvested: totalContributions,
      totalInvested,
      totalInterestEarned: totalInterest,
      roundedInterestEarned: Math.round(totalInterest),
      finalAmount,
      roundedFinalAmount: Math.round(finalAmount),
      schedule,
      formulaDescription:
        'A = FV(Principal) + Σ FV(Contributions)\nFV(P) = P × (1 + r/n)^(n × t)\nFV(C) = C × (1 + r/n)^(n × t_remaining)',
      assumptions,
    };
  }
}

export const customInterestCalculatorEngine = new CustomInterestCalculatorEngine();
