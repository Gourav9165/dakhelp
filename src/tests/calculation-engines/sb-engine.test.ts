import { describe, it, expect } from 'vitest';
import { sbCalculationEngine } from '@/services/calculation-engine/sb-engine';

describe('Post Office Savings Account (PO-SB) Engine Parity Tests', () => {
  it('calculates annual interest at 4.0% p.a. on eligible balance', () => {
    // Balance ₹10,000 for 12 months at 4.0%: 10000 * 0.04 = ₹400
    const result = sbCalculationEngine.calculate({
      balance: 10000,
      annualInterestRate: 4.0,
    });

    expect(result.openingBalance).toBe(10000.0);
    expect(result.roundedAnnualInterest).toBe(400);
    expect(result.closingBalance).toBe(10400.0);
    expect(result.monthlyBreakdowns.length).toBe(12);
    expect(result.monthlyBreakdowns.every((m) => m.isEligibleForInterest)).toBe(true);
  });

  it('zero interest credited when balance falls below ₹500 minimum requirement', () => {
    const result = sbCalculationEngine.calculate({
      balance: 400,
      annualInterestRate: 4.0,
    });

    expect(result.roundedAnnualInterest).toBe(0);
    expect(result.closingBalance).toBe(400.0);
    expect(result.monthlyBreakdowns.every((m) => !m.isEligibleForInterest)).toBe(true);
  });

  it('custom monthly balances handle fluctuating balances across 12 months', () => {
    // 6 months at ₹10,000, 6 months below ₹500 (₹200)
    const monthly = [
      10000.0, 10000.0, 10000.0, 10000.0, 10000.0, 10000.0, // 6 months eligible: 6 * (10000 * 0.04 / 12) = 200
      200.0, 200.0, 200.0, 200.0, 200.0, 200.0, // 6 months ineligible: 0
    ];

    const result = sbCalculationEngine.calculate({
      balance: 10000,
      customMonthlyBalances: monthly,
      annualInterestRate: 4.0,
    });

    expect(result.roundedAnnualInterest).toBe(200);
    expect(result.monthlyBreakdowns[0].isEligibleForInterest).toBe(true);
    expect(result.monthlyBreakdowns[6].isEligibleForInterest).toBe(false);
  });

  it('throws validation exception on negative balance', () => {
    expect(() => sbCalculationEngine.calculate({ balance: -100, annualInterestRate: 4.0 })).toThrow();
  });
});
