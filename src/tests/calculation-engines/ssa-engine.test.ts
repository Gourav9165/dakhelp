import { describe, it, expect } from 'vitest';
import { ssaCalculationEngine } from '@/services/calculation-engine/ssa-engine';

describe('Sukanya Samriddhi Account (SSA / SSY) Engine Tests', () => {
  it('calculates 21-year schedule with 15 deposit years and 6 interest-only years at 8.2%', () => {
    const result = ssaCalculationEngine.calculate({
      depositAmount: 150000,
      depositFrequency: 'annually',
      annualInterestRate: 8.2,
      girlChildAgeAtOpening: 5,
      isDepositedBefore5th: true,
    });

    expect(result.depositTenureYears).toBe(15);
    expect(result.maturityTenureYears).toBe(21);
    expect(result.totalPrincipalInvested).toBe(2250000.0);
    expect(result.yearlyBreakdown.length).toBe(21);

    // Verify Years 1-15 have active deposits
    for (let i = 0; i < 15; i++) {
      expect(result.yearlyBreakdown[i].isDepositPeriodActive).toBe(true);
      expect(result.yearlyBreakdown[i].depositsAdded).toBe(150000.0);
    }

    // Verify Years 16-21 have ₹0 deposits and compounding continues
    for (let i = 15; i < 21; i++) {
      expect(result.yearlyBreakdown[i].isDepositPeriodActive).toBe(false);
      expect(result.yearlyBreakdown[i].depositsAdded).toBe(0.0);
      expect(result.yearlyBreakdown[i].interestEarned).toBeGreaterThan(0);
    }

    expect(result.roundedMaturityAmount).toBeGreaterThan(6500000);
    expect(result.roundedInterestEarned).toBeGreaterThan(result.totalPrincipalInvested);
  });

  it('validates girl child age eligibility (0 to 10 years)', () => {
    expect(() =>
      ssaCalculationEngine.calculate({ depositAmount: 1000, annualInterestRate: 8.2, girlChildAgeAtOpening: 10 })
    ).not.toThrow();
    expect(() =>
      ssaCalculationEngine.calculate({ depositAmount: 1000, annualInterestRate: 8.2, girlChildAgeAtOpening: 11 })
    ).toThrow();
    expect(() =>
      ssaCalculationEngine.calculate({ depositAmount: 1000, annualInterestRate: 8.2, girlChildAgeAtOpening: -1 })
    ).toThrow();
  });
});
