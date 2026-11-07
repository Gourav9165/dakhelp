import { describe, it, expect } from 'vitest';
import { tdCalculationEngine, TdCalculationEngine } from '@/services/calculation-engine/td-engine';

describe('Post Office Time Deposit (PO-TD) Engine Tests', () => {
  it('1-Year TD at 6.9% p.a. quarterly compounded with Rule 7 annual payout', () => {
    const result = tdCalculationEngine.calculate({
      depositAmount: 10000,
      tenureYears: 1,
      annualInterestRate: 6.9,
    });

    // (1 + 0.069/4)^4 = 1.0708008 -> ₹708.01 annual payout
    expect(result.roundedAnnualInterestPayout).toBe(708);
    expect(result.roundedTotalPayoutInterest).toBe(708);
    expect(result.principalRepayment).toBe(10000.0);
    expect(result.roundedOfficialTotalCashReturn).toBe(10708);

    expect(result.roundedHypotheticalCumulativeMaturity).toBe(10708);
    expect(result.roundedHypotheticalCumulativeInterest).toBe(708);
    expect(result.quarterlyBreakdown.length).toBe(4);
    expect(result.is80cEligible).toBe(false);
  });

  it('2-Year TD at 7.0% p.a. verifies annual payout and separates hypothetical compounding', () => {
    const result = tdCalculationEngine.calculate({
      depositAmount: 10000,
      tenureYears: 2,
      annualInterestRate: 7.0,
    });

    expect(result.roundedAnnualInterestPayout).toBe(719);
    expect(result.roundedTotalPayoutInterest).toBe(1437);
    expect(result.principalRepayment).toBe(10000.0);
    expect(result.roundedOfficialTotalCashReturn).toBe(11437);

    // Hypothetical cumulative compounding: 10000 * (1.0175)^8 = ₹11,488.82 -> 11489
    expect(result.roundedHypotheticalCumulativeMaturity).toBe(11489);
    expect(result.roundedHypotheticalCumulativeInterest).toBe(1489);
    expect(result.quarterlyBreakdown.length).toBe(8);
    expect(result.is80cEligible).toBe(false);
  });

  it('3-Year TD at 7.1% p.a. verifies annual payout and separates hypothetical compounding', () => {
    const result = tdCalculationEngine.calculate({
      depositAmount: 10000,
      tenureYears: 3,
      annualInterestRate: 7.1,
    });

    expect(result.roundedAnnualInterestPayout).toBe(729);
    expect(result.roundedTotalPayoutInterest).toBe(2187);
    expect(result.principalRepayment).toBe(10000.0);
    expect(result.roundedOfficialTotalCashReturn).toBe(12187);

    // Hypothetical cumulative compounding: 10000 * (1.01775)^12 = ₹12,350.75 -> 12351
    expect(result.roundedHypotheticalCumulativeMaturity).toBe(12351);
    expect(result.roundedHypotheticalCumulativeInterest).toBe(2351);
    expect(result.quarterlyBreakdown.length).toBe(12);
    expect(result.is80cEligible).toBe(false);
  });

  it('5-Year TD at 7.5% p.a. with Rule 7 annual payout, 80C eligibility, and reinvestment', () => {
    const result = tdCalculationEngine.calculate({
      depositAmount: 10000,
      tenureYears: 5,
      annualInterestRate: 7.5,
    });

    expect(result.roundedAnnualInterestPayout).toBe(771);
    expect(result.roundedTotalPayoutInterest).toBe(3857);
    expect(result.principalRepayment).toBe(10000.0);
    expect(result.roundedOfficialTotalCashReturn).toBe(13857);

    // Hypothetical cumulative reinvestment: ₹14,499
    expect(result.roundedHypotheticalCumulativeMaturity).toBe(14499);
    expect(result.roundedHypotheticalCumulativeInterest).toBe(4499);
    expect(result.quarterlyBreakdown.length).toBe(20);
    expect(result.is80cEligible).toBe(true);
  });

  it('validates deposit amount constraints and valid tenures', () => {
    expect(() =>
      tdCalculationEngine.calculate({ depositAmount: 900, tenureYears: 1, annualInterestRate: 6.9 })
    ).toThrow();
    expect(() =>
      tdCalculationEngine.calculate({ depositAmount: 1050, tenureYears: 1, annualInterestRate: 6.9 })
    ).toThrow();
    expect(() =>
      tdCalculationEngine.calculate({ depositAmount: 1000, tenureYears: 4, annualInterestRate: 7.0 })
    ).toThrow();
  });

  it('calculateEarliestPrematureClosureDate enforces minimum 6-month lock-in under Rule 8', () => {
    const d1 = new Date(2024, 0, 15); // 15 Jan 2024
    const earliest1 = TdCalculationEngine.calculateEarliestPrematureClosureDate(d1);
    expect(earliest1.getFullYear()).toBe(2024);
    expect(earliest1.getMonth()).toBe(6); // July
    expect(earliest1.getDate()).toBe(15);

    // Month boundary: 31 August in non-leap year (e.g. 2024 -> Feb 2025 has 28 days)
    const d2 = new Date(2024, 7, 31); // 31 Aug 2024
    const earliest2 = TdCalculationEngine.calculateEarliestPrematureClosureDate(d2);
    expect(earliest2.getFullYear()).toBe(2025);
    expect(earliest2.getMonth()).toBe(1); // Feb
    expect(earliest2.getDate()).toBe(28);
  });
});
