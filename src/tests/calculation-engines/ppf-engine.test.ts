import { describe, it, expect } from 'vitest';
import { ppfCalculationEngine } from '@/services/calculation-engine/ppf-engine';

describe('Public Provident Fund (PPF) Engine Tests', () => {
  it('calculates 15-year progression for annual maximum deposit of ₹1,50,000 at 7.1%', () => {
    const result = ppfCalculationEngine.calculate({
      depositAmount: 150000,
      depositFrequency: 'annually',
      annualInterestRate: 7.1,
      isDepositedBefore5th: true,
    });

    expect(result.tenureYears).toBe(15);
    expect(result.totalPrincipalInvested).toBe(2250000.0);
    expect(result.yearlyBreakdown.length).toBe(15);

    // Year 1: 1,50,000 deposited before 5th April -> Interest 10,650 -> Closing 1,60,650
    expect(result.yearlyBreakdown[0].depositsAdded).toBe(150000.0);
    expect(result.yearlyBreakdown[0].interestEarned).toBe(10650.0);
    expect(result.yearlyBreakdown[0].closingBalance).toBe(160650.0);

    // Year 2: Opening 1,60,650 + 1,50,000 = 3,10,650 -> Interest 22,056 -> Closing 3,32,706
    expect(result.yearlyBreakdown[1].openingBalance).toBe(160650.0);
    expect(result.yearlyBreakdown[1].interestEarned).toBe(22056.0);
    expect(result.yearlyBreakdown[1].closingBalance).toBe(332706.0);

    // 15-Year maturity value is approx ₹40.68 Lakh
    expect(result.roundedMaturityAmount).toBeGreaterThanOrEqual(4068000);
    expect(result.roundedMaturityAmount).toBeLessThanOrEqual(4069000);
    expect(result.roundedInterestEarned).toBeGreaterThanOrEqual(1818000);
    expect(result.roundedInterestEarned).toBeLessThanOrEqual(1819000);
  });

  it('monthly contribution mode calculates 12 monthly instalments with 5th of month rule', () => {
    const result = ppfCalculationEngine.calculate({
      depositAmount: 10000,
      depositFrequency: 'monthly',
      annualInterestRate: 7.1,
      isDepositedBefore5th: true,
    });

    expect(result.totalPrincipalInvested).toBe(1800000.0);
    expect(result.yearlyBreakdown.length).toBe(15);
    expect(result.yearlyBreakdown[0].depositsAdded).toBe(120000.0);
    expect(result.roundedMaturityAmount).toBeGreaterThan(1800000);
  });

  it('maturity date calculates 15 years from end of financial year (Rule 9)', () => {
    // Account opened 15 May 2024 -> FY ends 31 Mar 2025 -> matures 1 April 2040
    const resultMay = ppfCalculationEngine.calculate({
      depositAmount: 150000,
      annualInterestRate: 7.1,
      openingDate: new Date(2024, 4, 15),
    });
    expect(resultMay.maturityDate).toEqual(new Date(2040, 3, 1));

    // Account opened 15 January 2025 -> FY ends 31 Mar 2025 -> matures 1 April 2040
    const resultJan = ppfCalculationEngine.calculate({
      depositAmount: 150000,
      annualInterestRate: 7.1,
      openingDate: new Date(2025, 0, 15),
    });
    expect(resultJan.maturityDate).toEqual(new Date(2040, 3, 1));
  });
});
