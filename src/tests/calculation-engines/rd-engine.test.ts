import { describe, it, expect } from 'vitest';
import { rdCalculationEngine, RdCalculationEngine } from '@/services/calculation-engine/rd-engine';

describe('RD Scheme Rule & Input Validation Tests', () => {
  it('accepts valid minimum deposit of ₹100', () => {
    expect(() => RdCalculationEngine.validateDepositAmount(100)).not.toThrow();
  });

  it('accepts valid deposits in multiples of ₹10', () => {
    expect(() => RdCalculationEngine.validateDepositAmount(110)).not.toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(150)).not.toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(1000)).not.toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(5000)).not.toThrow();
  });

  it('rejects deposits below ₹100', () => {
    expect(() => RdCalculationEngine.validateDepositAmount(90)).toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(0)).toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(-100)).toThrow();
  });

  it('rejects deposits not in multiples of ₹10', () => {
    expect(() => RdCalculationEngine.validateDepositAmount(105)).toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(123)).toThrow();
    expect(() => RdCalculationEngine.validateDepositAmount(505)).toThrow();
  });

  it('validates interest rate bounds', () => {
    expect(() => RdCalculationEngine.validateInterestRate(6.7)).not.toThrow();
    expect(() => RdCalculationEngine.validateInterestRate(0)).toThrow();
    expect(() => RdCalculationEngine.validateInterestRate(-5)).toThrow();
    expect(() => RdCalculationEngine.validateInterestRate(30)).toThrow();
  });
});

describe('Official Published Maturity Table Verifications at 6.7% p.a.', () => {
  const rate = 6.7;

  it('₹100 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 100, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(6000.0);
    expect(res.roundedMaturityAmount).toBe(7137);
    expect(res.roundedInterestEarned).toBe(1137);
    expect(res.exactMaturityAmount).toBeCloseTo(7136.58, 2);
    expect(res.exactInterestEarned).toBeCloseTo(1136.58, 2);
  });

  it('₹500 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 500, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(30000.0);
    expect(res.roundedMaturityAmount).toBe(35683);
    expect(res.roundedInterestEarned).toBe(5683);
    expect(res.exactMaturityAmount).toBeCloseTo(35682.91, 2);
  });

  it('₹1,000 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 1000, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(60000.0);
    expect(res.roundedMaturityAmount).toBe(71366);
    expect(res.roundedInterestEarned).toBe(11366);
    expect(res.exactMaturityAmount).toBeCloseTo(71365.83, 2);
  });

  it('₹2,000 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 2000, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(120000.0);
    expect(res.roundedMaturityAmount).toBe(142732);
    expect(res.roundedInterestEarned).toBe(22732);
    expect(res.exactMaturityAmount).toBeCloseTo(142731.66, 2);
  });

  it('₹5,000 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 5000, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(300000.0);
    expect(res.roundedMaturityAmount).toBe(356829);
    expect(res.roundedInterestEarned).toBe(56829);
    expect(res.exactMaturityAmount).toBeCloseTo(356829.14, 2);
  });

  it('₹10,000 monthly deposit matches official published table', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 10000, annualInterestRate: rate });
    expect(res.totalPrincipalInvested).toBe(600000.0);
    expect(res.roundedMaturityAmount).toBe(713658);
    expect(res.roundedInterestEarned).toBe(113658);
    expect(res.exactMaturityAmount).toBeCloseTo(713658.29, 2);
  });
});

describe('Quarterly Compounding Schedule Integrity Tests', () => {
  it('contains exactly 20 quarters with seamless balance continuity', () => {
    const res = rdCalculationEngine.calculateRd({ monthlyDeposit: 500, annualInterestRate: 6.7 });
    expect(res.quarterlyBreakdown.length).toBe(20);

    let sumInterest = 0;
    let sumDeposits = 0;

    for (let i = 0; i < res.quarterlyBreakdown.length; i++) {
      const q = res.quarterlyBreakdown[i];
      expect(q.quarterNumber).toBe(i + 1);
      expect(q.depositsAdded).toBe(1500.0); // 3 * 500

      sumInterest += q.interestEarned;
      sumDeposits += q.depositsAdded;

      if (i === 0) {
        expect(q.openingBalance).toBe(0.0);
      } else {
        const prev = res.quarterlyBreakdown[i - 1];
        expect(q.openingBalance).toBeCloseTo(prev.closingBalance, 4);
      }

      expect(q.closingBalance).toBeCloseTo(q.openingBalance + q.depositsAdded + q.interestEarned, 4);
    }

    expect(sumDeposits).toBe(res.totalPrincipalInvested);
    expect(sumInterest).toBeCloseTo(res.exactInterestEarned, 3);
    expect(res.quarterlyBreakdown[19].closingBalance).toBeCloseTo(res.exactMaturityAmount, 3);
  });
});

describe('Maturity Date & Calendar Edge Case Tests', () => {
  it('standard dates mature on identical calendar day 5 years later', () => {
    const standard = new Date(2023, 9, 15); // 15 Oct 2023
    const mat = RdCalculationEngine.calculateMaturityDate(standard);
    expect(mat.getFullYear()).toBe(2028);
    expect(mat.getMonth()).toBe(9);
    expect(mat.getDate()).toBe(15);
  });

  it('leap-year opening date (29 Feb) safely matures on 28 Feb in non-leap year', () => {
    const leapDay = new Date(2024, 1, 29); // 29 Feb 2024
    const maturity = RdCalculationEngine.calculateMaturityDate(leapDay);
    expect(maturity.getFullYear()).toBe(2029);
    expect(maturity.getMonth()).toBe(1);
    expect(maturity.getDate()).toBe(28);
  });
});
