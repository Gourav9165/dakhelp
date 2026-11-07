'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeDetailedInfo } from '@/data/schemes-info';
import { SchemeDefinitions } from '@/data/models/scheme-type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SchemeDetailClientProps {
  scheme: SchemeDetailedInfo;
}

export function SchemeDetailClient({ scheme }: SchemeDetailClientProps) {
  const { isHindi } = useLanguage();
  const def = SchemeDefinitions[scheme.id];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <Link href="/schemes" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'योजनाएं' : 'Schemes'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">{def.shortName}</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] p-6 sm:p-10 mb-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xs"
                style={{ backgroundColor: def.color }}
              >
                {def.shortName}
              </span>
              <div>
                <Badge variant="primary" size="md">
                  {isHindi ? def.category.displayNameHi : def.category.displayName}
                </Badge>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                  {isHindi ? 'भारत सरकार समर्थित लघु बचत योजना' : 'Govt of India Backed Sovereign Small Savings'}
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {isHindi ? scheme.titleHi : scheme.title}
            </h1>

            <p className="text-sm sm:text-base font-bold text-[var(--postal-red)]">
              {isHindi ? scheme.taglineHi : scheme.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
              {isHindi ? scheme.overviewHi : scheme.overview}
            </p>
          </div>

          {/* Quick Rate & Calculator CTA Card */}
          <div className="w-full md:w-72 shrink-0 p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] space-y-4">
            <div className="text-center">
              <span className="text-xs font-semibold text-[var(--text-secondary)] block">
                {isHindi ? 'वर्तमान आधिकारिक ब्याज दर' : 'Current Official Rate'}
              </span>
              <span className="text-3xl font-black text-[var(--postal-green)] block my-1">
                {scheme.interestDetails.rate}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {isHindi ? scheme.interestDetails.effectiveQuarterHi : scheme.interestDetails.effectiveQuarter}
              </span>
            </div>

            <Link href={`/calculators/${scheme.calculatorSlug}`} className="block">
              <Button variant="primary" size="md" fullWidth>
                <Calculator className="w-4 h-4 mr-2" />
                {isHindi ? 'कैलकुलेटर खोलें' : 'Open Calculator'}
              </Button>
            </Link>

            <div className="text-[11px] text-center text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--postal-green)]">
                {isHindi ? '100% सॉवरेन गारंटी' : '100% Sovereign Guarantee'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Core Rules, Eligibility, Tax */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Eligibility */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--postal-green)]" />
              <span>{isHindi ? 'पात्रता की शर्तें (Eligibility Criteria)' : 'Eligibility Criteria'}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)] pl-2">
              {(isHindi ? scheme.eligibilityHi : scheme.eligibility).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[var(--postal-red)] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Investment Limits */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>{isHindi ? 'जमा सीमा एवं नियम (Deposit Limits)' : 'Investment & Deposit Limits'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] font-medium block">
                  {isHindi ? 'न्यूनतम जमा:' : 'Minimum Deposit:'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] mt-1 block">
                  {isHindi ? scheme.investmentLimits.minHi : scheme.investmentLimits.min}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] font-medium block">
                  {isHindi ? 'अधिकतम सीमा:' : 'Maximum Limit:'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] mt-1 block">
                  {isHindi ? scheme.investmentLimits.maxHi : scheme.investmentLimits.max}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] font-medium block">
                  {isHindi ? 'जमा के गुणक:' : 'Deposit Multiples:'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] mt-1 block">
                  {isHindi ? scheme.investmentLimits.multiplesHi : scheme.investmentLimits.multiples}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Interest Details & Tenure */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--postal-red)]" />
              <span>{isHindi ? 'ब्याज गणना एवं परिपक्वता (Tenure & Interest)' : 'Interest Compounding & Maturity'}</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[var(--border-subtle)] gap-1">
                <span className="font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'चक्रवृद्धि विधि:' : 'Compounding Method:'}
                </span>
                <span>{isHindi ? scheme.interestDetails.compoundingHi : scheme.interestDetails.compounding}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[var(--border-subtle)] gap-1">
                <span className="font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'ब्याज भुगतान की व्यवस्था:' : 'Interest Payout:'}
                </span>
                <span>{isHindi ? scheme.interestDetails.payoutHi : scheme.interestDetails.payout}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                <span className="font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'अवधि एवं परिपक्वता:' : 'Tenure & Maturity:'}
                </span>
                <span className="text-right sm:max-w-md">
                  {isHindi ? scheme.tenureAndMaturityHi : scheme.tenureAndMaturity}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Tax Treatment */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{isHindi ? 'आयकर नियम (Tax Treatment)' : 'Tax Treatment & Exemptions'}</span>
              </h3>
              <Badge variant="success" size="sm">
                {isHindi ? scheme.taxTreatment.sectionHi : scheme.taxTreatment.section}
              </Badge>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)] pl-2">
              {(isHindi ? scheme.taxTreatment.detailsHi : scheme.taxTreatment.details).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[var(--postal-green)] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Premature Closure Rules */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>{isHindi ? 'समय पूर्व खाता बंद करने के नियम (Premature Closure)' : 'Premature Closure & Penalty Rules'}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)] pl-2">
              {(isHindi ? scheme.prematureClosureHi : scheme.prematureClosure).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Frequently Asked Questions (FAQs) */}
          {scheme.faqs && scheme.faqs.length > 0 && (
            <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[var(--postal-red)]" />
                <span>{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'Frequently Asked Questions (FAQs)'}</span>
              </h3>
              <div className="divide-y divide-[var(--border-subtle)]">
                {scheme.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[var(--text-primary)] hover:text-[var(--postal-red)] transition-colors cursor-pointer"
                      >
                        <span>{isHindi ? faq.questionHi : faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {isHindi ? faq.answerHi : faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Important conditions & Other Schemes Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Important Conditions Card */}
          <div className="p-6 rounded-3xl bg-[var(--disclaimer-bg)] border border-[var(--disclaimer-border)] space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-[var(--disclaimer-text)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'महत्वपूर्ण विनियामक शर्तें:' : 'Important Regulatory Conditions:'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-[var(--disclaimer-text)] leading-relaxed">
              {(isHindi ? scheme.importantConditionsHi : scheme.importantConditions).map((c, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Calculator CTA Box */}
          <div className="p-6 rounded-3xl bg-[var(--primary-container)] border border-[var(--postal-red)]/30 space-y-3 text-center">
            <h4 className="font-bold text-base text-[var(--postal-red)]">
              {isHindi ? `${def.shortName} ब्याज की गणना करें` : `Calculate Your ${def.shortName} Returns`}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {isHindi
                ? 'माह-वार व वर्ष-वार सटीक परिपक्वता अनुसूची और पीडीएफ रिपोर्ट तुरंत प्राप्त करें।'
                : 'Project exact maturity amount, interest accrual, and download official PDF reports.'}
            </p>
            <Link href={`/calculators/${scheme.calculatorSlug}`} className="block pt-1">
              <Button variant="primary" size="md" fullWidth>
                <Calculator className="w-4 h-4 mr-2" />
                {isHindi ? 'कैलकुलेटर प्रारंभ करें' : 'Launch Calculator'}
              </Button>
            </Link>
          </div>

          {/* Other Schemes Nav */}
          <div className="p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              {isHindi ? 'अन्य डाकघर योजनाएं' : 'Explore Other Schemes'}
            </h4>
            <div className="space-y-1.5">
              {Object.values(SchemeDefinitions)
                .filter((d) => d.id !== scheme.id)
                .slice(0, 5)
                .map((other) => (
                  <Link
                    key={other.id}
                    href={`/schemes/${other.slug}`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-container)] text-xs text-[var(--text-primary)] font-medium transition-colors"
                  >
                    <span>{other.shortName} - {other.fullName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
