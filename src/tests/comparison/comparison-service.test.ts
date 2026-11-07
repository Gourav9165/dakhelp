import { describe, it, expect } from 'vitest';
import { schemeComparisonService } from '@/services/comparison/scheme-comparison-service';

describe('SchemeComparisonService Unit Tests', () => {
  it('throws error when fewer than 2 schemes are provided', () => {
    expect(() =>
      schemeComparisonService.compare({
        selectedSchemes: ['rd'],
        budget: 100000,
      })
    ).toThrow();
  });

  it('throws error when more than 3 schemes are provided', () => {
    expect(() =>
      schemeComparisonService.compare({
        selectedSchemes: ['rd', 'td', 'mis', 'nsc'],
        budget: 100000,
      })
    ).toThrow();
  });

  it('compares 2 schemes side-by-side (RD vs TD)', () => {
    const result = schemeComparisonService.compare({
      selectedSchemes: ['rd', 'td'],
      budget: 60000,
      comparisonTenureYears: 5,
    });

    expect(result.schemes.length).toBe(2);
    const rdCard = result.schemes[0];
    const tdCard = result.schemes[1];

    expect(rdCard.schemeId).toBe('rd');
    expect(tdCard.schemeId).toBe('td');

    expect(rdCard.depositPattern).toContain('Monthly instalment');
    expect(tdCard.depositPattern).toContain('Lump-sum single deposit');
    expect(result.guidanceNotes.length).toBeGreaterThan(0);
  });

  it('compares 3 schemes side-by-side (PPF, NSC, MIS)', () => {
    const result = schemeComparisonService.compare({
      selectedSchemes: ['ppf', 'nsc', 'mis'],
      budget: 150000,
    });

    expect(result.schemes.length).toBe(3);
    expect(result.schemes[0].schemeId).toBe('ppf');
    expect(result.schemes[1].schemeId).toBe('nsc');
    expect(result.schemes[2].schemeId).toBe('mis');

    expect(result.schemes[0].is80cEligible).toBe(true);
    expect(result.schemes[2].is80cEligible).toBe(false);

    const hasTaxNote = result.guidanceNotes.some((n) => n.includes('Tax Optimization'));
    expect(hasTaxNote).toBe(true);

    const hasCashFlowNote = result.guidanceNotes.some((n) => n.includes('Cash Flow vs Growth'));
    expect(hasCashFlowNote).toBe(true);
  });
});
