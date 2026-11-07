import { describe, it, expect } from 'vitest';
import { misCalculationEngine } from '@/services/calculation-engine/mis-engine';

describe('Post Office Monthly Income Scheme (PO-MIS) Engine Tests', () => {
  it('calculates monthly payout for Single Account maximum (₹9,00,000) at 7.4%', () => {
    const result = misCalculationEngine.calculate({
      depositAmount: 900000,
      isJointAccount: false,
      annualInterestRate: 7.4,
    });

    // (9,00,000 * 7.4) / 1200 = ₹5,550 / month
    expect(result.monthlyInterestPayout).toBe(5550.0);
    expect(result.roundedMonthlyPayout).toBe(5550);
    expect(result.totalInterestEarned).toBe(333000.0);
    expect(result.maturityPrincipalRefund).toBe(900000.0);
    expect(result.totalOverallReturns).toBe(1233000.0);
  });

  it('calculates monthly payout for Joint Account maximum (₹15,00,000) at 7.4%', () => {
    const result = misCalculationEngine.calculate({
      depositAmount: 1500000,
      isJointAccount: true,
      annualInterestRate: 7.4,
    });

    // (15,00,000 * 7.4) / 1200 = ₹9,250 / month
    expect(result.monthlyInterestPayout).toBe(9250.0);
    expect(result.roundedMonthlyPayout).toBe(9250);
    expect(result.totalInterestEarned).toBe(555000.0);
    expect(result.maturityPrincipalRefund).toBe(1500000.0);
    expect(result.totalOverallReturns).toBe(2055000.0);
  });

  it('validates deposit limits and multiple requirements', () => {
    // Rejects below ₹1,000
    expect(() =>
      misCalculationEngine.calculate({ depositAmount: 500, annualInterestRate: 7.4 })
    ).toThrow();

    // Rejects non-multiples of ₹1,000
    expect(() =>
      misCalculationEngine.calculate({ depositAmount: 1500, annualInterestRate: 7.4 })
    ).toThrow();

    // Rejects above ₹9 Lakh for single account
    expect(() =>
      misCalculationEngine.calculate({ depositAmount: 1000000, isJointAccount: false, annualInterestRate: 7.4 })
    ).toThrow();

    // Rejects above ₹15 Lakh for joint account
    expect(() =>
      misCalculationEngine.calculate({ depositAmount: 1600000, isJointAccount: true, annualInterestRate: 7.4 })
    ).toThrow();
  });

  it('maturity date is exactly 5 years from opening date', () => {
    const opening = new Date(2024, 4, 10); // 10 May 2024
    const result = misCalculationEngine.calculate({
      depositAmount: 100000,
      annualInterestRate: 7.4,
      openingDate: opening,
    });

    expect(result.maturityDate?.getFullYear()).toBe(2029);
    expect(result.maturityDate?.getMonth()).toBe(4);
    expect(result.maturityDate?.getDate()).toBe(10);
  });
});
