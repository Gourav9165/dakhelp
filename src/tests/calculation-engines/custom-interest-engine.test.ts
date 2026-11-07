import { describe, it, expect } from 'vitest';
import { customInterestCalculatorEngine } from '@/services/calculation-engine/custom-interest-engine';

describe('CustomInterestCalculatorEngine - Simple Interest Tests', () => {
  it('calculates simple interest for lump-sum accurately', () => {
    // P = ₹1,00,000, R = 7.5%, T = 3 years -> SI = 22,500, A = 1,22,500
    const result = customInterestCalculatorEngine.calculate({
      mode: 'simple',
      principal: 100000,
      annualRate: 7.5,
      durationInYears: 3,
    });

    expect(result.totalInvested).toBe(100000);
    expect(result.totalInterestEarned).toBe(22500);
    expect(result.finalAmount).toBe(122500);
    expect(result.schedule.length).toBe(3);
    expect(result.schedule[0].interestEarned).toBe(7500);
  });

  it('calculates simple interest for fractional duration (6 months)', () => {
    const result = customInterestCalculatorEngine.calculate({
      mode: 'simple',
      principal: 50000,
      annualRate: 8.0,
      durationInYears: 0.5,
      durationInMonths: 6,
    });

    expect(result.totalInterestEarned).toBe(2000);
    expect(result.finalAmount).toBe(52000);
  });

  it('calculates simple interest with monthly recurring contributions', () => {
    const result = customInterestCalculatorEngine.calculate({
      mode: 'simple',
      principal: 10000,
      annualRate: 12.0,
      durationInYears: 1,
      enableRecurring: true,
      recurringAmount: 1000,
      contributionFrequency: 'monthly',
      contributionTiming: 'beginningOfPeriod',
    });

    expect(result.totalPrincipalInvested).toBe(10000);
    expect(result.totalContributionsInvested).toBe(12000);
    expect(result.totalInvested).toBe(22000);
    expect(result.totalInterestEarned).toBeCloseTo(1980, 2);
    expect(result.finalAmount).toBeCloseTo(23980, 2);
  });
});

describe('CustomInterestCalculatorEngine - Compound Interest Tests', () => {
  it('calculates annual compounding accurately', () => {
    const result = customInterestCalculatorEngine.calculate({
      mode: 'compound',
      principal: 10000,
      annualRate: 10.0,
      durationInYears: 2,
      compoundingFrequency: 'annually',
    });

    expect(result.totalInvested).toBe(10000);
    expect(result.finalAmount).toBeCloseTo(12100, 2);
    expect(result.totalInterestEarned).toBeCloseTo(2100, 2);
    expect(result.schedule.length).toBe(2);
  });

  it('calculates quarterly compounding (standard PO convention)', () => {
    const result = customInterestCalculatorEngine.calculate({
      mode: 'compound',
      principal: 100000,
      annualRate: 7.1,
      durationInYears: 1,
      compoundingFrequency: 'quarterly',
    });

    expect(result.finalAmount).toBeCloseTo(107291.28, 1);
  });

  it('calculates monthly compounding', () => {
    const result = customInterestCalculatorEngine.calculate({
      mode: 'compound',
      principal: 50000,
      annualRate: 12.0,
      durationInYears: 1,
      compoundingFrequency: 'monthly',
    });

    expect(result.finalAmount).toBeCloseTo(56341.25, 1);
  });
});
