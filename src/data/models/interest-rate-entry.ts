import { SchemeId } from './scheme-type';

export type CompoundingFrequency = 'monthly' | 'quarterly' | 'halfYearly' | 'annually';

export interface InterestRateEntry {
  schemeId: SchemeId;
  annualRate: number;
  effectiveStartDate: string; // ISO date 'YYYY-MM-DD'
  effectiveEndDate: string | null;
  compoundingFrequency: CompoundingFrequency;
  officialSourceReference: string;
  sourceName: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  quarterLabel: string;
  tenureYears?: number;
}
