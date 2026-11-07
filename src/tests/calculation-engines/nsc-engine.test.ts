import { describe, it, expect } from 'vitest';
import { nscCalculationEngine } from '@/services/calculation-engine/nsc-engine';

describe('National Savings Certificate (NSC VIII Issue) Engine Tests', () => {
  it('matches official published maturity table: ₹1,000 becomes ₹1,449.03 at 7.7%', () => {
    const result = nscCalculationEngine.calculate({
      depositAmount: 1000,
      annualInterestRate: 7.7,
    });

    // Official table: ₹1,449.03 per ₹1,000
    expect(result.exactMaturityAmount).toBeCloseTo(1449.03, 2);
    expect(result.roundedMaturityAmount).toBe(1449);
    expect(result.exactInterestEarned).toBeCloseTo(449.03, 2);
    expect(result.roundedInterestEarned).toBe(449);
    expect(result.tenureYears).toBe(5);

    // Verify year-by-year compounding and deemed reinvestment flag
    expect(result.yearlyBreakdown.length).toBe(5);
    expect(result.yearlyBreakdown[0].closingBalance).toBeCloseTo(1077.0, 1);
    expect(result.yearlyBreakdown[1].closingBalance).toBeCloseTo(1159.93, 1);
    expect(result.yearlyBreakdown[2].closingBalance).toBeCloseTo(1249.25, 1);
    expect(result.yearlyBreakdown[3].closingBalance).toBeCloseTo(1345.44, 1);
    expect(result.yearlyBreakdown[4].closingBalance).toBeCloseTo(1449.03, 1);

    // Years 1-4 deemed reinvested for Section 80C; Year 5 is taxable
    expect(result.yearlyBreakdown[0].isDeemedReinvested).toBe(true);
    expect(result.yearlyBreakdown[1].isDeemedReinvested).toBe(true);
    expect(result.yearlyBreakdown[2].isDeemedReinvested).toBe(true);
    expect(result.yearlyBreakdown[3].isDeemedReinvested).toBe(true);
    expect(result.yearlyBreakdown[4].isDeemedReinvested).toBe(false);
  });
});
