'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calculator,
  Scale,
  Percent,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeDefinitions, SchemeCategories } from '@/data/models/scheme-type';
import { AppConstants } from '@/core/constants/constants';
import { InterestRateRepository } from '@/data/repositories/interest-rate-repository';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { isHindi } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredSchemes = [
    {
      id: 'scss',
      slug: 'senior-citizens-savings-scheme',
      calcSlug: 'scss',
      rate: '8.2%',
      tag: isHindi ? 'वरिष्ठ नागरिक' : 'Senior Citizens',
      badgeColor: '#D85B48',
    },
    {
      id: 'ssa',
      slug: 'sukanya-samriddhi-account',
      calcSlug: 'ssa',
      rate: '8.2%',
      tag: isHindi ? 'बालिका समृद्धि (EEE)' : 'Girl Child (EEE)',
      badgeColor: '#E88070',
    },
    {
      id: 'ppf',
      slug: 'public-provident-fund',
      calcSlug: 'ppf',
      rate: '7.1%',
      tag: isHindi ? '100% कर-मुक्त' : '100% Tax Free (EEE)',
      badgeColor: '#245B50',
    },
    {
      id: 'mis',
      slug: 'monthly-income-scheme',
      calcSlug: 'mis',
      rate: '7.4%',
      tag: isHindi ? 'मासिक पेंशन आय' : 'Monthly Income',
      badgeColor: '#F3B83F',
    },
    {
      id: 'kvp',
      slug: 'kisan-vikas-patra',
      calcSlug: 'kvp',
      rate: '7.5%',
      tag: isHindi ? '115 माह में दोगुना' : 'Doubles in 115 Mos',
      badgeColor: '#9E6C0C',
    },
    {
      id: 'nsc',
      slug: 'national-savings-certificate',
      calcSlug: 'nsc',
      rate: '7.7%',
      tag: isHindi ? 'धारा 80C पुनर्निवेश' : 'Sec 80C Reinvest',
      badgeColor: '#245B50',
    },
  ];

  const allSchemes = Object.values(SchemeDefinitions);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 border-b border-[var(--border-subtle)] bg-gradient-to-b from-[var(--surface-container-low)]/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-container)] text-[var(--postal-red)] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{AppConstants.currentQuarterLabel} • 100% Official Mathematical Parity</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.12]">
                {isHindi ? (
                  <>
                    डाकघर बचत एवं ब्याज <br />
                    <span className="text-[var(--postal-red)]">सटीक कैलकुलेटर</span>
                  </>
                ) : (
                  <>
                    Your Trusted <br />
                    <span className="text-[var(--postal-red)]">Post Office Savings</span> & <br />
                    Interest Companion
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi
                  ? 'भारत के 9 आधिकारिक डाकघर लघु बचत खातों के परिपक्वता मूल्य, त्रैमासिक चक्रवृद्धि, मासिक आय एवं आयकर छूट (80C / EEE) की 100% प्रमाणित गणना करें।'
                  : 'Engineered for absolute calculation parity with Ministry of Finance rules. Project maturity returns, quarterly compounding, regular monthly payouts, and Section 80C tax benefits.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/calculators">
                  <Button variant="primary" size="lg" className="shadow-md">
                    <Calculator className="w-5 h-5 mr-2" />
                    {isHindi ? 'सभी 9 कैलकुलेटर देखें' : 'Explore All 9 Calculators'}
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" size="lg">
                    <Scale className="w-5 h-5 mr-2" />
                    {isHindi ? 'योजनाओं की तुलना करें' : 'Compare Schemes'}
                  </Button>
                </Link>
                <Link href="/rates">
                  <Button variant="ghost" size="lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {isHindi ? 'नवीनतम दरें' : 'Latest Rates'}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[var(--border-subtle)]/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[var(--postal-green)]">100%</span>
                  <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">
                    {isHindi ? 'सॉवरेन सुरक्षा' : 'Sovereign Guarantee'}
                  </span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[var(--postal-red)]">9 Schemes</span>
                  <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">
                    {isHindi ? 'पूर्ण नियम कवरेज' : 'Full Regulatory Logic'}
                  </span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-amber-600">Bilingual</span>
                  <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">
                    {isHindi ? 'हिंदी एवं अंग्रेजी' : 'Hindi & English'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Calculation Highlight */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-6 sm:p-8 bg-[var(--surface-container)] border border-[var(--border-subtle)] shadow-xl overflow-hidden space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0">
                      <Image
                        src="/branding/dak_help_logo.png"
                        alt="Dak Help Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[var(--text-primary)]">
                        {isHindi ? 'त्वरित योजना दरें' : 'Current Statutory Rates'}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {AppConstants.currentQuarterLabel}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {isHindi ? 'प्रभावी' : 'Active'}
                  </Badge>
                </div>

                {/* 4 Mini Cards in 2x2 grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/calculators/scss"
                    className="p-3.5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] hover:border-[var(--postal-red)]/50 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[var(--postal-red)] block">SCSS</span>
                    <span className="text-xl font-black text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors">
                      8.2%
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                      {isHindi ? 'वरिष्ठ नागरिक' : 'Senior Citizens'}
                    </span>
                  </Link>

                  <Link
                    href="/calculators/ssa"
                    className="p-3.5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] hover:border-[var(--postal-red)]/50 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[var(--postal-red)] block">SSA</span>
                    <span className="text-xl font-black text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors">
                      8.2%
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                      {isHindi ? 'सुकन्या समृद्धि' : 'Girl Child (EEE)'}
                    </span>
                  </Link>

                  <Link
                    href="/calculators/nsc"
                    className="p-3.5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] hover:border-[var(--postal-red)]/50 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[var(--postal-red)] block">NSC</span>
                    <span className="text-xl font-black text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors">
                      7.7%
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                      {isHindi ? '5-वर्षीय प्रमाण पत्र' : '5-Yr Certificate'}
                    </span>
                  </Link>

                  <Link
                    href="/calculators/ppf"
                    className="p-3.5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] hover:border-[var(--postal-red)]/50 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[var(--postal-red)] block">PPF</span>
                    <span className="text-xl font-black text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors">
                      7.1%
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                      {isHindi ? '15 वर्ष ईईई' : '15-Yr EEE Tax Free'}
                    </span>
                  </Link>
                </div>

                <Link href="/calculators">
                  <Button variant="primary" size="md" fullWidth>
                    {isHindi ? 'कैलकुलेटर प्रारंभ करें' : 'Open Any Calculator'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ALL 9 SCHEME CALCULATORS HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary" size="md" className="mb-2">
              {isHindi ? 'सभी 9 आधिकारिक योजनाएं' : 'All 9 Official Calculators'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {isHindi
                ? 'अपनी बचत योजना का चयन करें'
                : 'Select Your Post Office Scheme'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              {isHindi
                ? 'नियम, चक्रवृद्धि, समय-सीमा एवं कर-मुक्त परिपक्वता की सटीक गणना करें'
                : 'Click any calculator for authentic mathematical projections and downloadable PDF reports'}
            </p>
          </div>
          <Link href="/calculators">
            <Button variant="outline" size="sm">
              {isHindi ? 'सभी देखें' : 'View All (9)'}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] hover:border-[var(--postal-red)]/40 transition-all p-6 flex flex-col justify-between group shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-xs"
                    style={{ backgroundColor: scheme.color }}
                  >
                    {scheme.shortName}
                  </span>
                  <span className="text-sm font-extrabold text-[var(--postal-green)] bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                    {scheme.id === 'td'
                      ? '6.9% - 7.5%'
                      : `${InterestRateRepository.getLatestRate(scheme.id as any)}%`}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors mb-1">
                  {isHindi ? scheme.fullNameHi : scheme.fullName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-6">
                  {scheme.category.displayName}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Link href={`/calculators/${scheme.calculatorSlug}`} className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>
                    <Calculator className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'कैलकुलेटर' : 'Calculate'}
                  </Button>
                </Link>
                <Link href={`/schemes/${scheme.slug}`}>
                  <Button variant="outline" size="sm">
                    {isHindi ? 'नियम' : 'Rules'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMPARISON & CUSTOM INTEREST TOOLS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compare Tool Card */}
          <div className="rounded-3xl p-8 bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-container)] text-[var(--postal-red)] flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {isHindi ? 'योजना तुलना टूल (Side-by-Side)' : 'Scheme Comparison Engine'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'किसी भी 2 या 3 योजनाओं के कुल प्रतिफल, मासिक नकदी प्रवाह और 80C कर लाभ की निष्पक्ष तुलना करें। एकमुश्त एवं आवर्ती योजनाओं में कोई अनुचित अनुमान नहीं।'
                  : 'Compare 2 or 3 Post Office schemes side-by-side with visual comparison charts, payout timelines, and tax treatment differences.'}
              </p>
            </div>
            <Link href="/compare">
              <Button variant="primary" size="md">
                <Scale className="w-4 h-4 mr-2" />
                {isHindi ? 'तुलना प्रारंभ करें' : 'Launch Comparison Tool'}
              </Button>
            </Link>
          </div>

          {/* Custom Interest Calculator Card */}
          <div className="rounded-3xl p-8 bg-[var(--surface-container)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] flex items-center justify-center">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {isHindi ? 'कस्टम साधारण एवं चक्रवृद्धि कैलकुलेटर' : 'Universal Interest Calculator'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'अपनी पसंदीदा दर, अवधि (वर्ष व माह), और मासिक, त्रैमासिक या वार्षिक चक्रवृद्धि पर सटीक ब्याज और परिशोधन अनुसूची (Amortization Schedule) निकालें।'
                  : 'Flexible engine for simple and multi-frequency compound interest (monthly, quarterly, half-yearly, annually) with optional recurring SIP deposits.'}
              </p>
            </div>
            <Link href="/interest-calculator">
              <Button variant="secondary" size="md">
                <Percent className="w-4 h-4 mr-2" />
                {isHindi ? 'कस्टम कैलकुलेटर खोलें' : 'Open Custom Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary" size="md">
              {isHindi ? 'डाक हेल्प की विशेषताएं' : 'Why Dak Help?'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {isHindi
                ? 'सटीक, सुरक्षित और प्रमाणित वित्तीय अनुभव'
                : 'Built for Absolute Accuracy & Trust'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--postal-green)]" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {isHindi ? 'शून्य अनुमान नीति' : 'Zero Approximation'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'कोई अस्पष्ट या अनुमानित सूत्र नहीं। प्रत्येक गणना डाकघर नियमों और आधिकारिक गजट अनुसार है।'
                  : 'Every formula strictly mirrors the official Gazette of India and Ministry of Finance statutes.'}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <Download className="w-6 h-6 text-[var(--postal-red)]" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {isHindi ? 'ऑफलाइन पीडीएफ रिपोर्ट' : 'Bilingual PDF Reports'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'अपनी गणना की संपूर्ण विवरणी हिंदी या अंग्रेजी में प्रिंट या डाउनलोड करें।'
                  : 'Export branded, detailed calculation schedules with complete regulatory disclosures.'}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {isHindi ? 'सॉवरेन गारंटी' : 'Sovereign Guarantee'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'डाकघर लघु बचत योजनाओं में आपका मूलधन और ब्याज भारत सरकार द्वारा 100% सुरक्षित है।'
                  : 'Small savings schemes carry 100% sovereign government backing with zero credit risk.'}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)]">
              <Clock className="w-6 h-6 text-teal-600" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {isHindi ? 'तिमाही दर नवीनीकरण' : 'Quarterly Updates'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'जैसे ही वित्त मंत्रालय नई दरों की घोषणा करता है, प्रणाली तुरंत स्वतः अपडेट हो जाती है।'
                  : 'Continuously monitored and updated every financial quarter with latest government notifications.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
