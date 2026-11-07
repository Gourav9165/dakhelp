import { describe, it, expect } from 'vitest';
import { scssCalculationEngine } from '@/services/calculation-engine/scss-engine';

describe('Senior Citizens Savings Scheme (SCSS) Engine Tests', () => {
  it('calculates quarterly payout for maximum ₹30,00,000 at 8.2% p.a.', () => {
    const result = scssCalculationEngine.calculate({
      depositAmount: 3000000,
      annualInterestRate: 8.2,
    });

    // (30,00,000 * 8.2) / 400 = ₹61,500 / quarter
    expect(result.quarterlyInterestPayout).toBe(61500.0);
    expect(result.roundedQuarterlyPayout).toBe(61500);
    expect(result.annualInterestPayout).toBe(246000.0);
    expect(result.totalInterestEarned).toBe(1230000.0);
    expect(result.totalQuarters).toBe(20);
    expect(result.isTdsApplicable).toBe(true); // Annual interest ₹2,46,000 > ₹1,00,000
    expect(result.maturityPrincipalRefund).toBe(3000000.0);
    expect(result.totalOverallReturns).toBe(4230000.0);
  });

  it('calculates pro-rata first payout for mid-quarter opening date', () => {
    // 15 February 2024 (Leap year, 366 days in 2024)
    // Days from 15 Feb to 31 Mar: 29 - 15 + 1 = 15 days in Feb + 31 days in Mar = 46 days
    const opening = new Date(2024, 1, 15);
    const result = scssCalculationEngine.calculate({
      depositAmount: 1000000, // ₹10 Lakh
      annualInterestRate: 8.2,
      openingDate: opening,
    });

    expect(result.isFirstQuarterProRata).toBe(true);
    expect(result.firstQuarterDays).toBe(46);
    expect(result.firstQuarterEndDate).toEqual(new Date(2024, 2, 31));

    // Pro-rata first payout: (10,00,000 * 8.2 / 100) * (46 / 366) = 82000 * 0.125683 = 10306.01
    expect(result.firstQuarterInterestPayout).toBe(10306.01);
    expect(result.quarterlyInterestPayout).toBe(20500.0);

    // Total interest: 10306.01 + (20500.0 * 19) = 10306.01 + 389500.0 = 399806.01
    expect(result.totalInterestEarned).toBe(399806.01);
  });

  it('first payout is full quarter when opened on quarter start date (1 April)', () => {
    const opening = new Date(2024, 3, 1);
    const result = scssCalculationEngine.calculate({
      depositAmount: 1000000,
      annualInterestRate: 8.2,
      openingDate: opening,
    });

    expect(result.isFirstQuarterProRata).toBe(false);
    expect(result.firstQuarterInterestPayout).toBe(20500.0);
    expect(result.totalInterestEarned).toBe(20500.0 * 20); // 4,10,000.0
  });

  it('TDS threshold verifies ₹1,00,000 senior citizen limit (Finance Act 2025)', () => {
    // ₹10 Lakh at 8.2% -> Annual interest = ₹82,000 -> No TDS
    const result10L = scssCalculationEngine.calculate({
      depositAmount: 1000000,
      annualInterestRate: 8.2,
    });
    expect(result10L.annualInterestPayout).toBe(82000.0);
    expect(result10L.isTdsApplicable).toBe(false);

    // ₹15 Lakh at 8.2% -> Annual interest = ₹1,23,000 -> TDS applies
    const result15L = scssCalculationEngine.calculate({
      depositAmount: 1500000,
      annualInterestRate: 8.2,
    });
    expect(result15L.annualInterestPayout).toBe(123000.0);
    expect(result15L.isTdsApplicable).toBe(true);
  });

  it('extended 8-year tenure calculates 32 quarters of payout', () => {
    const result = scssCalculationEngine.calculate({
      depositAmount: 100000,
      annualInterestRate: 8.2,
      isExtendedTenure: true,
    });

    expect(result.quarterlyInterestPayout).toBe(2050.0);
    expect(result.totalQuarters).toBe(32);
    expect(result.totalInterestEarned).toBe(65600.0); // 2050 * 32
    expect(result.isTdsApplicable).toBe(false);
  });
});
