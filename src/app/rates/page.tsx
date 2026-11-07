'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Calendar,
  ShieldCheck,
  Calculator,
  Info,
  ExternalLink,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeDefinitions, SchemeId } from '@/data/models/scheme-type';
import { SchemeMetadataRegistry } from '@/data/models/scheme-metadata';
import { InterestRateRepository } from '@/data/repositories/interest-rate-repository';
import { AppConstants } from '@/core/constants/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RateRowItem {
  id: SchemeId;
  name: string;
  nameHi: string;
  category: string;
  tenure: string;
  tenureHi: string;
  rate: string;
  compounding: string;
  compoundingHi: string;
  payout: string;
  payoutHi: string;
  minMax: string;
  minMaxHi: string;
  taxSection: string | null;
  taxSectionHi: string | null;
  calcSlug: string;
}

export default function RatesPage() {
  const { isHindi } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'tax' | 'income'>('all');

  const allRates: RateRowItem[] = [
    {
      id: 'sb',
      name: 'Post Office Savings Account (SB)',
      nameHi: 'डाकघर बचत खाता (SB)',
      category: 'Liquid Savings',
      tenure: 'Open-ended',
      tenureHi: 'खुली अवधि',
      rate: '4.0%',
      compounding: 'Simple Interest',
      compoundingHi: 'साधारण ब्याज',
      payout: 'Annual (March 31)',
      payoutHi: 'वार्षिक (31 मार्च)',
      minMax: 'Min ₹500, No Max',
      minMaxHi: 'न्यूनतम ₹500, कोई अधिकतम नहीं',
      taxSection: '80TTA (up to ₹10,000)',
      taxSectionHi: '80TTA (₹10,000 तक)',
      calcSlug: 'sb',
    },
    {
      id: 'td',
      name: '1-Year Time Deposit (TD)',
      nameHi: '1-वर्षीय सावधि जमा (TD)',
      category: 'Fixed Return',
      tenure: '1 Year',
      tenureHi: '1 वर्ष',
      rate: '6.9%',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Annual Payout',
      payoutHi: 'वार्षिक भुगतान',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'td',
    },
    {
      id: 'td',
      name: '2-Year Time Deposit (TD)',
      nameHi: '2-वर्षीय सावधि जमा (TD)',
      category: 'Fixed Return',
      tenure: '2 Years',
      tenureHi: '2 वर्ष',
      rate: '7.0%',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Annual Payout',
      payoutHi: 'वार्षिक भुगतान',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'td',
    },
    {
      id: 'td',
      name: '3-Year Time Deposit (TD)',
      nameHi: '3-वर्षीय सावधि जमा (TD)',
      category: 'Fixed Return',
      tenure: '3 Years',
      tenureHi: '3 वर्ष',
      rate: '7.1%',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Annual Payout',
      payoutHi: 'वार्षिक भुगतान',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'td',
    },
    {
      id: 'td',
      name: '5-Year Time Deposit (TD)',
      nameHi: '5-वर्षीय सावधि जमा (TD)',
      category: 'Tax Saving',
      tenure: '5 Years',
      tenureHi: '5 वर्ष',
      rate: '7.5%',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Annual Payout',
      payoutHi: 'वार्षिक भुगतान',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: 'Section 80C',
      taxSectionHi: 'धारा 80C',
      calcSlug: 'td',
    },
    {
      id: 'rd',
      name: '5-Year Recurring Deposit (RD)',
      nameHi: '5-वर्षीय आवर्ती जमा (RD)',
      category: 'Recurring Savings',
      tenure: '5 Years (60 Months)',
      tenureHi: '5 वर्ष (60 माह)',
      rate: '6.7%',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'At Maturity',
      payoutHi: 'परिपक्वता पर',
      minMax: 'Min ₹100/mo, No Max',
      minMaxHi: 'न्यूनतम ₹100/माह',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'rd',
    },
    {
      id: 'mis',
      name: 'Monthly Income Scheme (MIS)',
      nameHi: 'मासिक आय योजना (MIS)',
      category: 'Monthly Income',
      tenure: '5 Years',
      tenureHi: '5 वर्ष',
      rate: '7.4%',
      compounding: 'Monthly Simple',
      compoundingHi: 'मासिक साधारण',
      payout: 'Monthly Payout',
      payoutHi: 'मासिक भुगतान',
      minMax: 'Max ₹9L (Single) / ₹15L (Joint)',
      minMaxHi: 'अधिकतम ₹9 लाख / ₹15 लाख',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'mis',
    },
    {
      id: 'scss',
      name: 'Senior Citizens Savings Scheme (SCSS)',
      nameHi: 'वरिष्ठ नागरिक बचत योजना (SCSS)',
      category: 'Retirement & Senior',
      tenure: '5 Years',
      tenureHi: '5 वर्ष',
      rate: '8.2%',
      compounding: 'Quarterly Paid',
      compoundingHi: 'त्रैमासिक देय',
      payout: 'Quarterly Payout',
      payoutHi: 'त्रैमासिक भुगतान',
      minMax: 'Min ₹1,000, Max ₹30 Lakh',
      minMaxHi: 'न्यूनतम ₹1,000, अधिकतम ₹30 लाख',
      taxSection: 'Section 80C',
      taxSectionHi: 'धारा 80C',
      calcSlug: 'scss',
    },
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      nameHi: 'पब्लिक प्रोविडेंट फंड (PPF)',
      category: 'Tax Saving & Wealth',
      tenure: '15 Financial Years',
      tenureHi: '15 वित्तीय वर्ष',
      rate: '7.1%',
      compounding: 'Annually Compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'At Maturity (EEE)',
      payoutHi: 'परिपक्वता पर (EEE)',
      minMax: 'Min ₹500, Max ₹1.5L/year',
      minMaxHi: 'न्यूनतम ₹500, अधिकतम ₹1.5 लाख/वर्ष',
      taxSection: 'EEE (80C + 10(11))',
      taxSectionHi: 'EEE (80C + 10(11))',
      calcSlug: 'ppf',
    },
    {
      id: 'ssa',
      name: 'Sukanya Samriddhi Account (SSA)',
      nameHi: 'सुकन्या समृद्धि खाता (SSA)',
      category: 'Girl Child Welfare',
      tenure: '21 Years (15 Yrs Deposit)',
      tenureHi: '21 वर्ष (15 वर्ष जमा)',
      rate: '8.2%',
      compounding: 'Annually Compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'At Maturity (EEE)',
      payoutHi: 'परिपक्वता पर (EEE)',
      minMax: 'Min ₹250, Max ₹1.5L/year',
      minMaxHi: 'न्यूनतम ₹250, अधिकतम ₹1.5 लाख/वर्ष',
      taxSection: 'EEE (80C + 10(11A))',
      taxSectionHi: 'EEE (80C + 10(11A))',
      calcSlug: 'ssa',
    },
    {
      id: 'nsc',
      name: 'National Savings Certificate (NSC)',
      nameHi: 'राष्ट्रीय बचत पत्र (NSC)',
      category: 'Tax Saving',
      tenure: '5 Years',
      tenureHi: '5 वर्ष',
      rate: '7.7%',
      compounding: 'Annually Compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'At Maturity',
      payoutHi: 'परिपक्वता पर',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: 'Section 80C (Reinvestment)',
      taxSectionHi: 'धारा 80C (पुनर्निवेश)',
      calcSlug: 'nsc',
    },
    {
      id: 'kvp',
      name: 'Kisan Vikas Patra (KVP)',
      nameHi: 'किसान विकास पत्र (KVP)',
      category: 'Guaranteed Doubling',
      tenure: '115 Months (9 Yrs 7 Mos)',
      tenureHi: '115 माह (9 वर्ष 7 माह)',
      rate: '7.5%',
      compounding: 'Annually Compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'Exact 2x Doubling',
      payoutHi: 'शत-प्रतिशत दोगुना',
      minMax: 'Min ₹1,000, No Max',
      minMaxHi: 'न्यूनतम ₹1,000, कोई अधिकतम नहीं',
      taxSection: null,
      taxSectionHi: null,
      calcSlug: 'kvp',
    },
  ];

  const filtered = allRates.filter((r) => {
    if (filterType === 'tax') return r.taxSection !== null;
    if (filterType === 'income')
      return r.payout.toLowerCase().includes('monthly') || r.payout.toLowerCase().includes('quarterly') || r.payout.toLowerCase().includes('annual');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">
          {isHindi ? 'नवीनतम ब्याज दरें' : 'Latest Interest Rates'}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[var(--surface-container-high)] via-[var(--surface-container)] to-[var(--surface-container-low)] border border-[var(--border-subtle)] p-6 sm:p-10 mb-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">
              {AppConstants.currentQuarterLabel}
            </Badge>
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              {isHindi ? 'अधिसूचना: वित्त मंत्रालय, भारत सरकार' : 'Ref: Ministry of Finance, Govt of India'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {isHindi
              ? 'डाकघर लघु बचत योजना ब्याज दरें'
              : 'Official Post Office Small Savings Interest Rates'}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {isHindi
              ? 'वित्त मंत्रालय (आर्थिक कार्य विभाग) द्वारा प्रत्येक तिमाही अधिसूचित आधिकारिक ब्याज दरें। सभी योजनाएं भारत सरकार की संप्रभु गारंटी (Sovereign Guarantee) से 100% सुरक्षित हैं।'
              : 'Official statutory interest rates reviewed and notified quarterly by the Ministry of Finance (Department of Economic Affairs), Government of India.'}
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            filterType === 'all'
              ? 'bg-[var(--postal-red)] text-white shadow-xs'
              : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:bg-[var(--surface-container-high)] border border-[var(--border-subtle)]'
          }`}
        >
          {isHindi ? 'सभी योजनाएं (12 श्रेणियां)' : 'All Schemes (12 Categories)'}
        </button>
        <button
          type="button"
          onClick={() => setFilterType('tax')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            filterType === 'tax'
              ? 'bg-[var(--postal-red)] text-white shadow-xs'
              : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:bg-[var(--surface-container-high)] border border-[var(--border-subtle)]'
          }`}
        >
          {isHindi ? 'कर बचत योजनाएं (80C / EEE)' : 'Tax Saving Schemes (80C / EEE)'}
        </button>
        <button
          type="button"
          onClick={() => setFilterType('income')}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            filterType === 'income'
              ? 'bg-[var(--postal-red)] text-white shadow-xs'
              : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:bg-[var(--surface-container-high)] border border-[var(--border-subtle)]'
          }`}
        >
          {isHindi ? 'नियमित आय योजनाएं' : 'Regular Income Payouts'}
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] overflow-hidden shadow-xs mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--surface-container-high)] text-[var(--text-primary)] border-b border-[var(--border-subtle)] text-[11px] uppercase tracking-wider font-extrabold">
                <th className="py-4 px-5">{isHindi ? 'योजना का नाम' : 'Scheme Name'}</th>
                <th className="py-4 px-4 text-center">{isHindi ? 'वर्तमान दर' : 'Interest Rate'}</th>
                <th className="py-4 px-4">{isHindi ? 'अवधि / कार्यकाल' : 'Tenure'}</th>
                <th className="py-4 px-4">{isHindi ? 'चक्रवृद्धि विधि' : 'Compounding'}</th>
                <th className="py-4 px-4">{isHindi ? 'ब्याज भुगतान' : 'Payout Frequency'}</th>
                <th className="py-4 px-4">{isHindi ? 'कर लाभ' : 'Tax Status'}</th>
                <th className="py-4 px-4 text-right">{isHindi ? 'कैलकुलेटर' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/60 font-medium">
              {filtered.map((r, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[var(--surface-container)] transition-colors duration-150 odd:bg-transparent even:bg-[var(--surface-container-lowest)]/40"
                >
                  <td className="py-3.5 px-5 font-bold text-[var(--text-primary)]">
                    <div>
                      <span>{isHindi ? r.nameHi : r.name}</span>
                      <span className="block text-[11px] text-[var(--text-secondary)] font-normal">
                        {isHindi ? r.minMaxHi : r.minMax}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full font-black text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                      {r.rate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[var(--text-secondary)]">
                    {isHindi ? r.tenureHi : r.tenure}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                    {isHindi ? r.compoundingHi : r.compounding}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                    {isHindi ? r.payoutHi : r.payout}
                  </td>
                  <td className="py-3.5 px-4">
                    {r.taxSection ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] whitespace-nowrap">
                        {isHindi ? r.taxSectionHi : r.taxSection}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        {isHindi ? 'कर योग्य' : 'Taxable'}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link href={`/calculators/${r.calcSlug}`}>
                      <Button variant="primary" size="sm">
                        <Calculator className="w-3.5 h-3.5 mr-1" />
                        {isHindi ? 'गणना करें' : 'Calculate'}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[var(--surface-container)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-secondary)] gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
              {isHindi
                ? 'दरें सरकार द्वारा प्रति तिमाही संशोधित की जाती हैं।'
                : 'Rates are reviewed and updated every quarter by the Ministry of Finance.'}
            </span>
          </div>
          <span className="font-semibold text-[var(--postal-green)]">
            {isHindi ? 'संप्रभु गारंटी: 100% सुरक्षित' : 'Sovereign Guarantee: 100% Capital Protection'}
          </span>
        </div>
      </div>
    </div>
  );
}
