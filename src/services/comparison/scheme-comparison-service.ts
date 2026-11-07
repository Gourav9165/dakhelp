import { SchemeId, SchemeDefinitions } from '@/data/models/scheme-type';
import { interestRateRepository } from '@/data/repositories/interest-rate-repository';
import { rdCalculationEngine } from '../calculation-engine/rd-engine';
import { tdCalculationEngine } from '../calculation-engine/td-engine';
import { misCalculationEngine } from '../calculation-engine/mis-engine';
import { scssCalculationEngine } from '../calculation-engine/scss-engine';
import { ppfCalculationEngine } from '../calculation-engine/ppf-engine';
import { ssaCalculationEngine } from '../calculation-engine/ssa-engine';
import { nscCalculationEngine } from '../calculation-engine/nsc-engine';
import { kvpCalculationEngine } from '../calculation-engine/kvp-engine';
import { sbCalculationEngine } from '../calculation-engine/sb-engine';

export interface SchemeComparisonCardData {
  schemeId: SchemeId;
  schemeName: string;
  schemeNameHi: string;
  applicableRate: number;
  depositPattern: string;
  tenureLabel: string;
  tenureYears: number;
  totalInvested: number;
  totalInterestEarned: number;
  maturityAmount: number;
  maturityDate?: Date;
  payoutFrequency: string;
  periodicPayoutAmount?: number;
  taxTreatment: string;
  withdrawalConditions: string;
  is80cEligible: boolean;
  assumptions: string[];
}

export interface SchemeComparisonResult {
  schemes: SchemeComparisonCardData[];
  budgetAmount: number;
  startDate: Date;
  comparisonTenureYears: number;
  guidanceNotes: string[];
}

export class SchemeComparisonService {
  public compare(params: {
    selectedSchemes: SchemeId[];
    budget: number;
    startDate?: Date;
    comparisonTenureYears?: number;
  }): SchemeComparisonResult {
    const { selectedSchemes, budget, startDate, comparisonTenureYears = 5 } = params;

    if (selectedSchemes.length < 2 || selectedSchemes.length > 3) {
      throw new Error('Comparison requires between 2 and 3 schemes.');
    }

    const openingDate = startDate ?? new Date('2024-04-01');
    const cards: SchemeComparisonCardData[] = [];

    for (const scheme of selectedSchemes) {
      cards.push(this.calculateSchemeData(scheme, budget, openingDate, comparisonTenureYears));
    }

    const guidance = this.generateIntelligentGuidance(selectedSchemes, cards);

    return {
      schemes: cards,
      budgetAmount: budget,
      startDate: openingDate,
      comparisonTenureYears,
      guidanceNotes: guidance,
    };
  }

  private calculateSchemeData(
    schemeId: SchemeId,
    budget: number,
    openingDate: Date,
    comparisonTenureYears: number
  ): SchemeComparisonCardData {
    const def = SchemeDefinitions[schemeId];
    const rateEntry = interestRateRepository.getLatestRate(schemeId);
    const rate = rateEntry?.annualRate ?? 7.0;

    switch (schemeId) {
      case 'rd': {
        const rawMonthly = budget / 60.0;
        const monthlyDeposit = Math.max(100.0, Math.round(rawMonthly / 10.0) * 10.0);
        const rdResult = rdCalculationEngine.calculateRd({
          monthlyDeposit,
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Monthly instalment: ₹${monthlyDeposit.toFixed(0)} / mo (60 instalments, actual invested: ₹${rdResult.totalPrincipalInvested.toFixed(0)})`,
          tenureLabel: '5 Years',
          tenureYears: 5.0,
          totalInvested: rdResult.totalPrincipalInvested,
          totalInterestEarned: rdResult.roundedInterestEarned,
          maturityAmount: rdResult.roundedMaturityAmount,
          maturityDate: rdResult.maturityDate,
          payoutFrequency: 'At Maturity (Quarterly Compounding)',
          taxTreatment: 'No Section 80C benefit. Interest is taxable as income under other sources.',
          withdrawalConditions: 'Premature closure allowed after 3 years from opening date at PO-SB interest rate.',
          is80cEligible: false,
          assumptions: rdResult.assumptions,
        };
      }

      case 'td': {
        const validTenures = [1, 2, 3, 5];
        const tenureYears = validTenures.includes(comparisonTenureYears) ? comparisonTenureYears : 5;
        const tdRateEntry = interestRateRepository.getLatestRate('td', tenureYears);
        const tdRate = tdRateEntry?.annualRate ?? rate;
        const tdResult = tdCalculationEngine.calculate({
          depositAmount: budget,
          tenureYears,
          annualInterestRate: tdRate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: `${tenureYears}-Year Time Deposit`,
          schemeNameHi: `${tenureYears}-वर्षीय सावधि जमा (TD)`,
          applicableRate: tdRate,
          depositPattern: `Lump-sum single deposit: ₹${budget.toFixed(0)}`,
          tenureLabel: `${tenureYears} ${tenureYears === 1 ? 'Year' : 'Years'}`,
          tenureYears,
          totalInvested: tdResult.depositAmount,
          totalInterestEarned: tdResult.roundedTotalPayoutInterest,
          maturityAmount: tdResult.roundedOfficialTotalCashReturn,
          maturityDate: tdResult.maturityDate,
          payoutFrequency: `Annual Payout: ₹${tdResult.roundedAnnualInterestPayout} / yr (Quarterly Compounded)`,
          periodicPayoutAmount: tdResult.roundedAnnualInterestPayout,
          taxTreatment:
            tenureYears === 5
              ? 'Eligible for Section 80C deduction up to ₹1.5 Lakh. Annual interest is taxable.'
              : 'No Section 80C deduction. Annual interest is fully taxable.',
          withdrawalConditions:
            'No premature closure before 6 months. From 6 to 12 months, PO-SB rate applies without compounding.',
          is80cEligible: tenureYears === 5,
          assumptions: tdResult.assumptions,
        };
      }

      case 'mis': {
        const misResult = misCalculationEngine.calculate({
          depositAmount: Math.min(budget, 900000.0),
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Lump-sum single deposit: ₹${misResult.depositAmount.toFixed(0)}`,
          tenureLabel: '5 Years',
          tenureYears: 5.0,
          totalInvested: misResult.depositAmount,
          totalInterestEarned: misResult.roundedTotalInterest,
          maturityAmount: misResult.totalOverallReturns,
          maturityDate: misResult.maturityDate,
          payoutFrequency: `Monthly Payout: ₹${misResult.roundedMonthlyPayout} / month`,
          periodicPayoutAmount: misResult.roundedMonthlyPayout,
          taxTreatment: "No Section 80C deduction. Monthly interest is taxable in the depositor's hands.",
          withdrawalConditions:
            'No withdrawal before 1 year. Between 1-3 years: 2% deduction from principal. After 3 years: 1% deduction.',
          is80cEligible: false,
          assumptions: misResult.assumptions,
        };
      }

      case 'scss': {
        const scssResult = scssCalculationEngine.calculate({
          depositAmount: Math.min(budget, 3000000.0),
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Lump-sum single deposit: ₹${scssResult.depositAmount.toFixed(0)} (Age 60+)`,
          tenureLabel: '5 Years',
          tenureYears: 5.0,
          totalInvested: scssResult.depositAmount,
          totalInterestEarned: scssResult.roundedTotalInterest,
          maturityAmount: scssResult.totalOverallReturns,
          maturityDate: scssResult.maturityDate,
          payoutFrequency: `Quarterly Payout: ₹${scssResult.roundedQuarterlyPayout} / quarter`,
          periodicPayoutAmount: scssResult.roundedQuarterlyPayout,
          taxTreatment:
            'Eligible for Section 80C deduction up to ₹1.5 Lakh. TDS applies if interest exceeds ₹1,00,000/yr for seniors.',
          withdrawalConditions:
            'Premature closure: 1.5% deduction from principal within 1-2 years; 1% deduction after 2 years.',
          is80cEligible: true,
          assumptions: scssResult.assumptions,
        };
      }

      case 'ppf': {
        const annualDeposit = Math.min(budget / 15.0, 150000.0);
        const safeDeposit = Math.max(500.0, annualDeposit);
        const ppfResult = ppfCalculationEngine.calculate({
          depositAmount: safeDeposit,
          depositFrequency: 'annually',
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Annual contribution: ₹${safeDeposit.toFixed(0)} / yr (15 years)`,
          tenureLabel: '15 Years',
          tenureYears: 15.0,
          totalInvested: ppfResult.totalPrincipalInvested,
          totalInterestEarned: ppfResult.roundedInterestEarned,
          maturityAmount: ppfResult.roundedMaturityAmount,
          maturityDate: ppfResult.maturityDate,
          payoutFrequency: 'At Maturity (Annual Compounding)',
          taxTreatment: 'Triple Tax Exempt (EEE). Section 80C deduction + Tax-free interest + Tax-free maturity.',
          withdrawalConditions:
            'Strict lock-in. Partial loan after 3rd year. Partial withdrawal permitted after 5th financial year.',
          is80cEligible: true,
          assumptions: ppfResult.assumptions,
        };
      }

      case 'ssa': {
        const annualDeposit = Math.min(budget / 15.0, 150000.0);
        const safeDeposit = Math.max(250.0, annualDeposit);
        const ssaResult = ssaCalculationEngine.calculate({
          depositAmount: safeDeposit,
          depositFrequency: 'annually',
          annualInterestRate: rate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Annual deposit: ₹${safeDeposit.toFixed(0)} / yr (15 deposit years, 21-yr maturity)`,
          tenureLabel: '21 Years (Girl Child)',
          tenureYears: 21.0,
          totalInvested: ssaResult.totalPrincipalInvested,
          totalInterestEarned: ssaResult.roundedInterestEarned,
          maturityAmount: ssaResult.roundedMaturityAmount,
          maturityDate: new Date(openingDate.getFullYear() + 21, openingDate.getMonth(), openingDate.getDate()),
          payoutFrequency: 'At Maturity (21 Years)',
          taxTreatment: 'Triple Tax Exempt (EEE). Section 80C deduction + 100% Tax-free maturity under Sec 10(10D).',
          withdrawalConditions:
            'Up to 50% withdrawal after age 18 for higher education. Account matures after 21 years or on marriage after 18.',
          is80cEligible: true,
          assumptions: ssaResult.assumptions,
        };
      }

      case 'nsc': {
        const nscResult = nscCalculationEngine.calculate({
          depositAmount: budget,
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Lump-sum single deposit: ₹${budget.toFixed(0)}`,
          tenureLabel: '5 Years',
          tenureYears: 5.0,
          totalInvested: nscResult.principalAmount,
          totalInterestEarned: nscResult.roundedInterestEarned,
          maturityAmount: nscResult.roundedMaturityAmount,
          maturityDate: nscResult.maturityDate,
          payoutFrequency: 'At Maturity (Annual Compounding)',
          taxTreatment:
            'Section 80C eligible. Accrued annual interest is deemed reinvested and eligible for 80C (except year 5).',
          withdrawalConditions:
            'No premature encashment except in exceptional circumstances (death of holder or court forfeiture).',
          is80cEligible: true,
          assumptions: nscResult.assumptions,
        };
      }

      case 'kvp': {
        const kvpResult = kvpCalculationEngine.calculate({
          depositAmount: budget,
          annualInterestRate: rate,
          openingDate,
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: rate,
          depositPattern: `Lump-sum single deposit: ₹${budget.toFixed(0)} (Guaranteed 2x Doubling)`,
          tenureLabel: '115 Months (9.58 Yrs)',
          tenureYears: 115.0 / 12.0,
          totalInvested: kvpResult.depositAmount,
          totalInterestEarned: kvpResult.totalInterestEarned,
          maturityAmount: kvpResult.maturityAmount,
          maturityDate: kvpResult.maturityDate,
          payoutFrequency: 'At Maturity (Doubles Principal)',
          taxTreatment: 'No Section 80C tax deduction. Accrued interest is taxable on accrual or receipt basis.',
          withdrawalConditions:
            'Premature encashment allowed after lock-in period of 2 years and 6 months (30 months).',
          is80cEligible: false,
          assumptions: kvpResult.assumptions,
        };
      }

      case 'sb': {
        const sbResult = sbCalculationEngine.calculate({
          balance: budget,
          annualInterestRate: 4.0,
          financialYearStartYear: openingDate.getFullYear(),
        });
        return {
          schemeId,
          schemeName: def.fullName,
          schemeNameHi: def.fullNameHi,
          applicableRate: 4.0,
          depositPattern: `Liquid savings balance: ₹${budget.toFixed(0)}`,
          tenureLabel: '1 Year (Liquid)',
          tenureYears: 1.0,
          totalInvested: budget,
          totalInterestEarned: sbResult.roundedAnnualInterest,
          maturityAmount: budget + sbResult.roundedAnnualInterest,
          payoutFrequency: 'Annual Crediting to Account (Monthly Accrual)',
          taxTreatment: 'Interest up to ₹10,000/yr exempt under Section 80TTA (₹50,000 for seniors under 80TTB).',
          withdrawalConditions: '100% Liquid. Any-time deposit and withdrawal without restriction.',
          is80cEligible: false,
          assumptions: sbResult.assumptions,
        };
      }
    }
  }

  private generateIntelligentGuidance(
    schemes: SchemeId[],
    cards: SchemeComparisonCardData[]
  ): string[] {
    const notes: string[] = [];

    const has80c = cards.filter((c) => c.is80cEligible).map((c) => SchemeDefinitions[c.schemeId].shortName);
    const non80c = cards.filter((c) => !c.is80cEligible).map((c) => SchemeDefinitions[c.schemeId].shortName);

    // 1. Tax Benefit Guidance
    if (has80c.length > 0 && non80c.length > 0) {
      notes.push(
        `Tax Optimization: ${has80c.join(', ')} qualify for Section 80C tax deduction (up to ₹1.5 Lakh/yr), whereas ${non80c.join(
          ', '
        )} do not offer 80C deductions.`
      );
    }

    // 2. Liquidity & Cash Flow Guidance
    const payoutSchemes = cards.filter((c) => c.periodicPayoutAmount !== undefined);
    const cumulativeSchemes = cards.filter((c) => c.periodicPayoutAmount === undefined);

    if (payoutSchemes.length > 0 && cumulativeSchemes.length > 0) {
      notes.push(
        `Cash Flow vs Growth: ${payoutSchemes
          .map((c) => SchemeDefinitions[c.schemeId].shortName)
          .join(', ')} provide regular ongoing cash income (${payoutSchemes[0].payoutFrequency}), whereas ${cumulativeSchemes
          .map((c) => SchemeDefinitions[c.schemeId].shortName)
          .join(', ')} compound interest for maximum capital appreciation at maturity.`
      );
    }

    // 3. Deposit Schedule
    const recurringSchemes: SchemeId[] = ['rd', 'ppf', 'ssa'];
    const hasRecurring = schemes.some((s) => recurringSchemes.includes(s));
    const hasLumpSum = schemes.some((s) => !recurringSchemes.includes(s));

    if (hasRecurring && hasLumpSum) {
      notes.push(
        'Investment Schedule: Recurring schemes (such as RD, PPF, SSA) are designed for salaried individuals investing periodically from regular income, while Time Deposit, MIS, SCSS, and NSC require a single lump-sum upfront commitment.'
      );
    }

    // 4. Tenures & Horizon
    const longTerm = cards
      .filter((c) => c.tenureYears >= 15)
      .map((c) => SchemeDefinitions[c.schemeId].shortName);
    if (longTerm.length > 0) {
      notes.push(
        `Long-Term Horizon: ${longTerm.join(
          ', '
        )} has a 15-to-21 year statutory horizon best suited for long-range retirement or a child's future, whereas 5-year schemes provide medium-term capital certainty.`
      );
    }

    // 5. RD Instalment Rounding Disclosure
    if (schemes.includes('rd')) {
      const rdCard = cards.find((c) => c.schemeId === 'rd');
      if (rdCard) {
        notes.push(
          `RD Instalment Rounding: Post Office RD requires instalments in multiples of ₹10 (minimum ₹100). The actual total investment of ₹${Math.round(
            rdCard.totalInvested
          )} reflects the monthly instalment of ₹${Math.round(rdCard.totalInvested / 60)} × 60 months.`
        );
      }
    }

    if (notes.length === 0) {
      notes.push('Both selected schemes offer sovereign government security backed by the Government of India.');
    }

    return notes;
  }
}

export const schemeComparisonService = new SchemeComparisonService();
