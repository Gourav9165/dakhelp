import { describe, it, expect } from 'vitest';
import { kvpCalculationEngine } from '@/services/calculation-engine/kvp-engine';

describe('Kisan Vikas Patra (KVP) Engine Tests', () => {
  it('doubles investment in exactly 115 months (9 years 7 months) at 7.5%', () => {
    const result = kvpCalculationEngine.calculate({
      depositAmount: 50000,
      annualInterestRate: 7.5,
    });

    expect(result.doublingPeriodMonths).toBe(115);
    expect(result.maturityAmount).toBe(100000.0);
    expect(result.totalInterestEarned).toBe(50000.0);
    expect(result.doublingPeriodYearsAndMonths).toBe('9 Years 7 Months (115 Months)');
  });

  it('maturity date accurately adds 115 months across calendar years', () => {
    const opening = new Date(2024, 0, 15); // 15 Jan 2024
    const result = kvpCalculationEngine.calculate({
      depositAmount: 10000,
      openingDate: opening,
    });

    // 2024-01-15 + 115 months = August 2033 (2033-08-15)
    expect(result.maturityDate?.getFullYear()).toBe(2033);
    expect(result.maturityDate?.getMonth()).toBe(7); // August (0-based 7)
    expect(result.maturityDate?.getDate()).toBe(15);
  });

  it('accrual schedule generates 10 financial-year progression entries matching 2x maturity', () => {
    const result = kvpCalculationEngine.calculate({
      depositAmount: 50000,
      annualInterestRate: 7.5,
    });

    expect(result.accrualSchedule.length).toBe(10);

    // Year 1
    const yr1 = result.accrualSchedule[0];
    expect(yr1.yearNumber).toBe(1);
    expect(yr1.periodLabel).toBe('Year 1 (12 Months)');
    expect(yr1.openingBalance).toBe(50000.0);
    expect(yr1.interestAccruedInYear).toBe(3750.0);
    expect(yr1.closingBalance).toBe(53750.0);
    expect(yr1.cumulativeAccruedInterest).toBe(3750.0);

    // Final period: Year 10 (Months 109 to 115 = 7 months)
    const yr10 = result.accrualSchedule[9];
    expect(yr10.yearNumber).toBe(10);
    expect(yr10.periodLabel).toBe('Year 10 (7 Months to Maturity)');
    expect(yr10.closingBalance).toBe(100000.0);
    expect(yr10.cumulativeAccruedInterest).toBe(50000.0);
  });
});
