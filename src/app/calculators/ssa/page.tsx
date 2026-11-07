'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
  Heart,
  Calendar,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { CalculatorFacade } from '@/services/calculation-engine/calculator-facade';
import { InterestRateRepository } from '@/data/repositories/interest-rate-repository';
import { AppFormatters } from '@/core/formatters/currency-formatter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/calculators/metric-card';
import { ScheduleTable } from '@/components/calculators/schedule-table';
import { ReturnBreakdownChart } from '@/components/calculators/return-breakdown-chart';
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRESETS = [
  { label: '₹10,000', value: 10000 },
  { label: '₹25,000', value: 25000 },
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹1,50,000 (Max)', value: 150000 },
];

export default function SsaCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('ssa');

  const [annualDeposit, setAnnualDeposit] = useState<number>(100000);
  const [childAge, setChildAge] = useState<number>(1);
  const [startYear, setStartYear] = useState<number>(2024);
  const [error, setError] = useState<string | null>(null);

  const calculationResult = useMemo(() => {
    if (annualDeposit < 250) {
      setError(
        isHindi
          ? 'न्यूनतम वार्षिक जमा राशि ₹250 है'
          : 'Minimum annual deposit is ₹250'
      );
      return null;
    }
    if (annualDeposit % 50 !== 0) {
      setError(
        isHindi
          ? 'जमा राशि ₹50 के गुणक में होनी चाहिए'
          : 'Deposit must be in multiples of ₹50'
      );
      return null;
    }
    if (annualDeposit > 150000) {
      setError(
        isHindi
          ? 'अधिकतम वार्षिक सीमा ₹1,50,000 है'
          : 'Maximum annual limit is ₹1,50,000'
      );
      return null;
    }
    if (childAge < 0 || childAge > 10) {
      setError(
        isHindi
          ? 'बालिका की आयु 0 से 10 वर्ष के बीच होनी चाहिए'
          : 'Girl child age must be between 0 and 10 years'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateSsa({
      annualDeposit,
      childCurrentAge: childAge,
      openingYear: startYear,
    });
  }, [annualDeposit, childAge, startYear, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'ssa',
      schemeFullName: isHindi
        ? 'सुकन्या समृद्धि खाता (SSA)'
        : 'Sukanya Samriddhi Account (SSA)',
      depositAmount: calculationResult.totalDeposit,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.maturityAmount,
      interestEarned: calculationResult.totalInterest,
      tenureYears: 21,
      parameters: {
        'Girl Child Age at Opening': `${childAge} Years Old`,
        'Annual Contribution': AppFormatters.formatCurrency(calculationResult.annualDeposit),
        'Deposit Payment Window': '15 Years',
        'Total Maturity Tenure': '21 Years from Opening',
        'Maturity Calendar Year': `${calculationResult.maturityYear}`,
        'Girl Child Age at Maturity': `${calculationResult.girlChildAgeAtMaturity} Years Old`,
        'Tax Exemption Status': 'EEE (100% Tax Free Under Sec 10(11A))',
      },
      schedule: {
        headers: ['Year', 'Girl Age', 'Annual Deposit', 'Interest Credited', 'Closing Balance'],
        rows: calculationResult.schedule.map((s) => [
          `Year ${s.year}`,
          `${s.childAge} Yrs`,
          AppFormatters.formatCurrency(s.deposit),
          AppFormatters.formatCurrency(s.interestEarned),
          AppFormatters.formatCurrency(s.closingBalance),
        ]),
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setAnnualDeposit(100000);
    setChildAge(1);
    setStartYear(2024);
  };

  const scheduleColumns = [
    { key: 'year', header: isHindi ? 'वर्ष' : 'Year', render: (r: { year: number }) => `Yr ${r.year}` },
    {
      key: 'childAge',
      header: isHindi ? 'बालिका आयु' : 'Child Age',
      render: (r: { childAge: number }) => `${r.childAge} Yrs`,
    },
    {
      key: 'deposit',
      header: isHindi ? 'जमा (15 वर्ष)' : 'Deposit',
      align: 'right' as const,
      render: (r: { deposit: number }) =>
        r.deposit > 0 ? (
          AppFormatters.formatCurrency(r.deposit)
        ) : (
          <span className="text-[10px] text-amber-600 font-semibold">
            {isHindi ? 'जमा समाप्त' : 'No Deposit'}
          </span>
        ),
    },
    {
      key: 'interestEarned',
      header: isHindi ? 'अर्जित ब्याज' : 'Interest',
      align: 'right' as const,
      render: (r: { interestEarned: number }) => (
        <span className="font-bold text-[var(--postal-green)]">
          +{AppFormatters.formatCurrency(r.interestEarned)}
        </span>
      ),
    },
    {
      key: 'closingBalance',
      header: isHindi ? 'अंतिम शेष' : 'Closing Balance',
      align: 'right' as const,
      render: (r: { closingBalance: number }) => (
        <span className="font-bold text-[var(--text-primary)]">
          {AppFormatters.formatCurrency(r.closingBalance)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <Link href="/calculators" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'कैलकुलेटर' : 'Calculators'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">SSA</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center font-bold text-base">
              SSA
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'सुकन्या समृद्धि खाता (SSA) कैलकुलेटर'
                  : 'Sukanya Samriddhi Account (SSA) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? 'बेटियों के उज्ज्वल भविष्य हेतु 8.2% उच्चतम ब्याज एवं 21-वर्षीय पूर्ण कर-मुक्त परिपक्वता'
                  : 'Calculate 21-Year 100% Tax-Free maturity wealth under "Beti Bachao Beti Padhao"'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}% (कर-मुक्त)` : `Current Rate: ${currentRate}% p.a. (Tax Free)`}
          </Badge>
          <Link href="/schemes/sukanya-samriddhi-account">
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-1" />
              {isHindi ? 'योजना नियम' : 'Scheme Guide'}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="warm">
            <CardHeader>
              <CardTitle className="text-lg">
                {isHindi ? 'सुकन्या निवेश विवरण' : 'SSA Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'वार्षिक जमा राशि एवं बालिका की वर्तमान आयु चुनें'
                  : 'Enter annual contribution and girl child age (0-10 years)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Annual Deposit */}
              <Input
                label={isHindi ? 'वार्षिक जमा राशि' : 'Annual Deposit Amount'}
                type="number"
                prefixText="₹"
                min={250}
                max={150000}
                step={50}
                value={annualDeposit}
                onChange={(e) => setAnnualDeposit(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? 'न्यूनतम ₹250, अधिकतम ₹1,50,000 (15 वर्षों तक देय)'
                    : 'Min ₹250, Max ₹1,50,000 (payable for 15 years)'
                }
                presets={PRESETS}
                onPresetSelect={(val) => setAnnualDeposit(val)}
              />

              <Slider
                min={250}
                max={150000}
                step={500}
                value={annualDeposit}
                onChange={(val) => setAnnualDeposit(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(annualDeposit)}
              />

              {/* Girl Child Age */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>{isHindi ? 'बालिका की वर्तमान आयु' : 'Girl Child Age at Opening'}</span>
                  <span className="font-bold text-[var(--postal-red)]">{childAge} {isHindi ? 'वर्ष' : 'Years'}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setChildAge(age)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        childAge === age
                          ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)]'
                          : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {isHindi
                    ? 'खाता केवल 10 वर्ष से कम आयु की बालिकाओं के नाम पर खोला जा सकता है'
                    : 'Account can only be opened for girl children up to 10 years of age'}
                </p>
              </div>

              {/* Opening Year */}
              <Input
                label={isHindi ? 'खाता खोलने का वर्ष' : 'Opening Calendar Year'}
                type="number"
                min={2015}
                max={2030}
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value) || 2024)}
              />

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={resetForm}
                  className="w-1/3"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'रीसेट' : 'Reset'}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadPdf}
                  className="w-2/3"
                  disabled={!calculationResult}
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'पीडीएफ रिपोर्ट' : 'Export PDF'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results & Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'कुल जमा (15 वर्ष)' : 'Total Invested'}
                  value={AppFormatters.formatCurrency(calculationResult.totalDeposit)}
                  subtitle={isHindi ? '15 वार्षिक किस्तों में' : 'Across 15 deposit years'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterest)}`}
                  subtitle={isHindi ? '8.2% वार्षिक चक्रवृद्धि' : '8.2% tax-free compound'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता निधि (21 वर्ष)' : 'Maturity Corpus'}
                  value={AppFormatters.formatCurrency(calculationResult.maturityAmount)}
                  subtitle={`${isHindi ? 'बालिका आयु:' : 'Child age:'} ${calculationResult.girlChildAgeAtMaturity} yrs (${calculationResult.maturityYear})`}
                  variant="primary"
                />
              </div>

              {/* Deposit Window vs Compounding Window Notice */}
              <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-xs text-pink-950 dark:text-pink-200 flex items-center justify-between">
                <div>
                  <span className="font-bold">
                    {isHindi ? '15 वर्ष जमा + 6 वर्ष केवल चक्रवृद्धि:' : '15 Years Deposit + 6 Years Compounding:'}
                  </span>
                  <p className="mt-0.5 opacity-90 text-[11px]">
                    {isHindi
                      ? '15 वर्ष बाद कोई जमा नहीं करनी होती, परंतु शेष राशि पर 21 वर्ष तक पूर्ण ब्याज मिलता रहता है।'
                      : 'Deposits cease after 15 years, but the corpus continues earning compounding interest until 21-year maturity.'}
                  </p>
                </div>
              </div>

              {/* 21-Year Schedule Table */}
              <ScheduleTable
                title={isHindi ? '21-वर्षीय सुकन्या खाता वृद्धि अनुसूची' : '21-Year SSA Wealth Accrual Schedule'}
                description={
                  isHindi
                    ? '15 वर्ष जमा अवधि एवं आगामी 6 वर्ष चक्रवृद्धि अवधि का वर्ष-दर-वर्ष विवरण'
                    : 'Complete projection of 15 deposit years and 6 compounding years until maturity'
                }
                columns={scheduleColumns}
                data={calculationResult.schedule}
                footer={
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>
                      {isHindi ? 'कुल निवेश: ' : 'Total Deposit: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.totalDeposit)}</strong>
                    </span>
                    <span>
                      {isHindi ? 'परिपक्वता वर्ष: ' : 'Maturity Year: '}
                      <strong>{calculationResult.maturityYear} (Age {calculationResult.girlChildAgeAtMaturity})</strong>
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.totalDeposit}
                interest={calculationResult.totalInterest}
                total={calculationResult.maturityAmount}
                title={isHindi ? 'सुकन्या समृद्धि प्रतिफल विभाजन' : 'SSA Corpus Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'सुकन्या समृद्धि खाता ईईई (EEE) दर्जे का है। धारा 80C के तहत ₹1.5 लाख तक कर छूट, अर्जित ब्याज धारा 10(11A) के तहत कर-मुक्त, और परिपक्वता पर मिलने वाली पूरी राशि शत-प्रतिशत कर-मुक्त है।'
                    : 'SSA carries triple tax-exemption (EEE). Investment deductible under Section 80C up to ₹1.5 Lakh. Interest exempt under Section 10(11A). Entire maturity corpus is 100% tax-free.'
                }
              />
            </>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] text-center text-red-500 font-semibold">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
