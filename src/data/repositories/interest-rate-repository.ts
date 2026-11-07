import { SchemeId } from '../models/scheme-type';
import { InterestRateEntry } from '../models/interest-rate-entry';
import { AppConstants } from '@/core/constants/constants';

/**
 * Curated offline repository of verified official Post Office Small Savings Scheme rates.
 * Directly mirrors LocalInterestRateRepository.dart from the Android application.
 */
class LocalInterestRateRepository {
  private static readonly officialRef = AppConstants.officialSourceRef;
  private static readonly sourceName = AppConstants.officialPublisher;
  private static readonly sourceUrl = AppConstants.officialPortalUrl;
  private static readonly verificationDate = '2026-11-01';

  private static readonly entries: InterestRateEntry[] = [
    // 1. Post Office Savings Account (PO-SB)
    {
      schemeId: 'sb',
      annualRate: 4.0,
      effectiveStartDate: '2011-12-01',
      effectiveEndDate: null,
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Ongoing',
    },

    // 2. Post Office Time Deposit (PO-TD) - 1, 2, 3, 5 Years
    {
      schemeId: 'td',
      tenureYears: 1,
      annualRate: 6.9,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q4 FY 2023-24 to Present',
    },
    {
      schemeId: 'td',
      tenureYears: 1,
      annualRate: 6.9,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: '2023-12-31',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-04-01',
      quarterLabel: 'Q1-Q3 FY 2023-24',
    },
    {
      schemeId: 'td',
      tenureYears: 2,
      annualRate: 7.0,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q4 FY 2023-24 to Present',
    },
    {
      schemeId: 'td',
      tenureYears: 2,
      annualRate: 6.9,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: '2023-12-31',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-04-01',
      quarterLabel: 'Q1-Q3 FY 2023-24',
    },
    {
      schemeId: 'td',
      tenureYears: 3,
      annualRate: 7.1,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q4 FY 2023-24 to Present',
    },
    {
      schemeId: 'td',
      tenureYears: 3,
      annualRate: 7.0,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: '2023-12-31',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-04-01',
      quarterLabel: 'Q1-Q3 FY 2023-24',
    },
    {
      schemeId: 'td',
      tenureYears: 5,
      annualRate: 7.5,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q1 FY 2023-24 to Present',
    },

    // 3. Post Office 5-Year Recurring Deposit (PO-RD)
    {
      schemeId: 'rd',
      annualRate: 6.7,
      effectiveStartDate: '2023-10-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q3 FY 2023-24 to Present',
    },
    {
      schemeId: 'rd',
      annualRate: 6.5,
      effectiveStartDate: '2023-07-01',
      effectiveEndDate: '2023-09-30',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-07-01',
      quarterLabel: 'Q2 FY 2023-24',
    },
    {
      schemeId: 'rd',
      annualRate: 6.2,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: '2023-06-30',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-04-01',
      quarterLabel: 'Q1 FY 2023-24',
    },
    {
      schemeId: 'rd',
      annualRate: 5.8,
      effectiveStartDate: '2020-04-01',
      effectiveEndDate: '2023-03-31',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2020-04-01',
      quarterLabel: 'FY 2020-21 to FY 2022-23',
    },

    // 4. Monthly Income Scheme (PO-MIS)
    {
      schemeId: 'mis',
      annualRate: 7.4,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'monthly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q1 FY 2023-24 to Present',
    },
    {
      schemeId: 'mis',
      annualRate: 7.1,
      effectiveStartDate: '2023-01-01',
      effectiveEndDate: '2023-03-31',
      compoundingFrequency: 'monthly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-01-01',
      quarterLabel: 'Q4 FY 2022-23',
    },

    // 5. Senior Citizens Savings Scheme (SCSS)
    {
      schemeId: 'scss',
      annualRate: 8.2,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q1 FY 2023-24 to Present',
    },
    {
      schemeId: 'scss',
      annualRate: 8.0,
      effectiveStartDate: '2023-01-01',
      effectiveEndDate: '2023-03-31',
      compoundingFrequency: 'quarterly',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-01-01',
      quarterLabel: 'Q4 FY 2022-23',
    },

    // 6. Public Provident Fund (PPF)
    {
      schemeId: 'ppf',
      annualRate: 7.1,
      effectiveStartDate: '2020-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'FY 2020-21 to Present',
    },

    // 7. Sukanya Samriddhi Account (SSA / SSY)
    {
      schemeId: 'ssa',
      annualRate: 8.2,
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: null,
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q4 FY 2023-24 to Present',
    },
    {
      schemeId: 'ssa',
      annualRate: 8.0,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: '2023-12-31',
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-04-01',
      quarterLabel: 'Q1-Q3 FY 2023-24',
    },

    // 8. National Savings Certificate (NSC VIII Issue)
    {
      schemeId: 'nsc',
      annualRate: 7.7,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q1 FY 2023-24 to Present',
    },
    {
      schemeId: 'nsc',
      annualRate: 7.0,
      effectiveStartDate: '2023-01-01',
      effectiveEndDate: '2023-03-31',
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-01-01',
      quarterLabel: 'Q4 FY 2022-23',
    },

    // 9. Kisan Vikas Patra (KVP)
    {
      schemeId: 'kvp',
      annualRate: 7.5,
      effectiveStartDate: '2023-04-01',
      effectiveEndDate: null,
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: LocalInterestRateRepository.verificationDate,
      quarterLabel: 'Q1 FY 2023-24 to Present (Doubles in 115 months)',
    },
    {
      schemeId: 'kvp',
      annualRate: 7.2,
      effectiveStartDate: '2023-01-01',
      effectiveEndDate: '2023-03-31',
      compoundingFrequency: 'annually',
      officialSourceReference: LocalInterestRateRepository.officialRef,
      sourceName: LocalInterestRateRepository.sourceName,
      sourceUrl: LocalInterestRateRepository.sourceUrl,
      lastVerifiedDate: '2023-01-01',
      quarterLabel: 'Q4 FY 2022-23 (Doubles in 120 months)',
    },
  ];

  public getLatestRate(schemeId: SchemeId, tenureYears?: number): InterestRateEntry | null {
    const matches = LocalInterestRateRepository.entries.filter((e) => {
      if (e.schemeId !== schemeId) return false;
      if (tenureYears !== undefined && e.tenureYears !== undefined) {
        return e.tenureYears === tenureYears;
      }
      return true;
    });

    if (matches.length === 0) return null;
    matches.sort((a, b) => b.effectiveStartDate.localeCompare(a.effectiveStartDate));
    return matches[0];
  }

  public getRateHistory(schemeId: SchemeId, tenureYears?: number): InterestRateEntry[] {
    const matches = LocalInterestRateRepository.entries.filter((e) => {
      if (e.schemeId !== schemeId) return false;
      if (tenureYears !== undefined && e.tenureYears !== undefined) {
        return e.tenureYears === tenureYears;
      }
      return true;
    });
    matches.sort((a, b) => b.effectiveStartDate.localeCompare(a.effectiveStartDate));
    return matches;
  }

  public getRateForDate(
    schemeId: SchemeId,
    date: Date | string,
    tenureYears?: number
  ): InterestRateEntry | null {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

    const matches = LocalInterestRateRepository.entries.filter((e) => {
      if (e.schemeId !== schemeId) return false;
      if (tenureYears !== undefined && e.tenureYears !== undefined) {
        if (e.tenureYears !== tenureYears) return false;
      }
      if (dateStr < e.effectiveStartDate) return false;
      if (e.effectiveEndDate !== null && dateStr > e.effectiveEndDate) return false;
      return true;
    });

    if (matches.length === 0) return null;
    matches.sort((a, b) => b.effectiveStartDate.localeCompare(a.effectiveStartDate));
    return matches[0];
  }

  public getAllCurrentRates(): Array<{ schemeId: SchemeId; entry: InterestRateEntry }> {
    const schemeIds: SchemeId[] = ['sb', 'rd', 'td', 'mis', 'scss', 'ppf', 'ssa', 'nsc', 'kvp'];
    const results: Array<{ schemeId: SchemeId; entry: InterestRateEntry }> = [];

    for (const id of schemeIds) {
      if (id === 'td') {
        // Add TD 1, 2, 3, 5 years
        for (const t of [1, 2, 3, 5]) {
          const rate = this.getLatestRate('td', t);
          if (rate) results.push({ schemeId: id, entry: rate });
        }
      } else {
        const rate = this.getLatestRate(id);
        if (rate) results.push({ schemeId: id, entry: rate });
      }
    }

    return results;
  }
}

export const interestRateRepository = new LocalInterestRateRepository();

export class InterestRateRepository {
  public static getLatestRate(schemeId: SchemeId | 'td1' | 'td2' | 'td3' | 'td5'): number {
    if (schemeId === 'td1') {
      const e = interestRateRepository.getLatestRate('td', 1);
      return e ? e.annualRate : 6.9;
    }
    if (schemeId === 'td2') {
      const e = interestRateRepository.getLatestRate('td', 2);
      return e ? e.annualRate : 7.0;
    }
    if (schemeId === 'td3') {
      const e = interestRateRepository.getLatestRate('td', 3);
      return e ? e.annualRate : 7.1;
    }
    if (schemeId === 'td5') {
      const e = interestRateRepository.getLatestRate('td', 5);
      return e ? e.annualRate : 7.5;
    }
    const e = interestRateRepository.getLatestRate(schemeId as SchemeId);
    return e ? e.annualRate : 7.0;
  }

  public static getRateEntry(schemeId: SchemeId, tenureYears?: number): InterestRateEntry | null {
    return interestRateRepository.getLatestRate(schemeId, tenureYears);
  }

  public static getRateHistory(schemeId: SchemeId, tenureYears?: number): InterestRateEntry[] {
    return interestRateRepository.getRateHistory(schemeId, tenureYears);
  }

  public static getAllCurrentRates() {
    return interestRateRepository.getAllCurrentRates();
  }
}

