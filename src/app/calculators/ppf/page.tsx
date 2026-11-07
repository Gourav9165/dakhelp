'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
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

export default function PpfCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('ppf');

  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [depositTiming, setDepositTiming] = useState<'on_or_before_5th' | 'after_5th'>('on_or_before_5th');
  const [startYear, setStartYear] = useState<number>(2024);
  const [error, setError] = useState<string | null>(null);

  const calculationResult = useMemo(() => {
    if (annualDeposit < 500) {
      setError(
        isHindi
          ? 'न्यूनतम वार्षिक जमा ₹500 है'
          : 'Minimum annual deposit is ₹500'
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
          ? 'प्रति वित्तीय वर्ष अधिकतम जमा सीमा ₹1,50,000 है'
          : 'Maximum limit is ₹1,50,000 per financial year'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculatePpf({
      annualDeposit,
      depositTiming,
      startFinancialYear: startYear,
    });
  }, [annualDeposit, depositTiming, startYear, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'ppf',
      schemeFullName: isHindi
        ? 'पब्लिक प्रोविडेंट फंड (PPF)'
        : 'Public Provident Fund (PPF)',
      depositAmount: calculationResult.totalDeposit,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.maturityAmount,
      interestEarned: calculationResult.totalInterest,
      tenureYears: 15,
      parameters: {
        'Annual Deposit': AppFormatters.formatCurrency(calculationResult.annualDeposit),
        'Deposit Timing': depositTiming === 'on_or_before_5th' ? 'On or before 5th of month (Max interest)' : 'After 5th of month',
        'Start Financial Year': `FY ${startYear}-${(startYear + 1).toString().slice(-2)}`,
        'Maturity Financial Year': `FY ${calculationResult.maturityYear - 1}-${calculationResult.maturityYear.toString().slice(-2)}`,
        'Tenure (Rule 9)': '15 Full Financial Years',
        'Tax Status': 'EEE (100% Tax-Free Investment, Interest & Maturity)',
      },
      schedule: {
        headers: ['FY Year', 'Opening Balance', 'Annual Deposit', 'Interest Credited', 'Closing Balance'],
        rows: calculationResult.schedule.map((s) => [
          s.financialYear,
          AppFormatters.formatCurrency(s.openingBalance),
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
    setAnnualDeposit(150000);
    setDepositTiming('on_or_before_5th');
    setStartYear(2024);
  };

  const scheduleColumns = [
    { key: 'financialYear', header: isHindi ? 'वित्तीय वर्ष' : 'Financial Year' },
    {
      key: 'openingBalance',
      header: isHindi ? 'प्रारंभिक शेष' : 'Opening Balance',
      align: 'right' as const,
      render: (r: { openingBalance: number }) => AppFormatters.formatCurrency(r.openingBalance),
    },
    {
      key: 'deposit',
      header: isHindi ? 'वार्षिक जमा' : 'Annual Deposit',
      align: 'right' as const,
      render: (r: { deposit: number }) => AppFormatters.formatCurrency(r.deposit),
    },
    {
      key: 'interestEarned',
      header: isHindi ? 'अर्जित ब्याज' : 'Interest Credited',
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
        <span className="text-[var(--text-primary)] font-semibold">PPF</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
              PPF
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'पब्लिक प्रोविडेंट फंड (PPF) कैलकुलेटर'
                  : 'Public Provident Fund (PPF) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '15-वर्षीय ईईई (EEE) कर-मुक्त परिपक्वता एवं 5वीं तारीख नियम अनुसार ब्याज'
                  : '15-Year EEE Tax-Free maturity projection with exact 5th-of-the-month deposit timing rules'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}% (कर-मुक्त)` : `Current Rate: ${currentRate}% p.a. (Tax Free)`}
          </Badge>
          <Link href="/schemes/public-provident-fund">
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
                {isHindi ? 'पीपीएफ निवेश विवरण' : 'PPF Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'प्रतिवर्ष जमा राशि एवं 5वीं तारीख जमा विकल्प चुनें'
                  : 'Enter annual contribution and deposit timing preference'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Annual Deposit */}
              <Input
                label={isHindi ? 'वार्षिक जमा राशि' : 'Annual Deposit Amount'}
                type="number"
                prefixText="₹"
                min={500}
                max={150000}
                step={50}
                value={annualDeposit}
                onChange={(e) => setAnnualDeposit(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? 'न्यूनतम ₹500, अधिकतम ₹1,50,000 प्रति वित्तीय वर्ष'
                    : 'Min ₹500, Max ₹1,50,000 per financial year'
                }
                presets={PRESETS}
                onPresetSelect={(val) => setAnnualDeposit(val)}
              />

              <Slider
                min={500}
                max={150000}
                step={500}
                value={annualDeposit}
                onChange={(val) => setAnnualDeposit(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(annualDeposit)}
              />

              {/* Deposit Timing */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'जमा का समय (5वीं तारीख नियम)' : 'Deposit Timing (5th of Month Rule)'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositTiming('on_or_before_5th')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      depositTiming === 'on_or_before_5th'
                        ? 'bg-[var(--postal-green)] text-white border-[var(--postal-green)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    <span className="block text-xs font-bold">
                      {isHindi ? '5 तारीख तक' : 'On/Before 5th'}
                    </span>
                    <span className="text-[10px] opacity-90">
                      {isHindi ? 'पूर्ण 12 माह ब्याज' : 'Earns full year interest'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositTiming('after_5th')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      depositTiming === 'after_5th'
                        ? 'bg-[var(--postal-green)] text-white border-[var(--postal-green)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    <span className="block text-xs font-bold">
                      {isHindi ? '5 तारीख के बाद' : 'After 5th'}
                    </span>
                    <span className="text-[10px] opacity-90">
                      {isHindi ? '11 माह ब्याज' : 'Earns 11 mos interest'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Start Year */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'खाता खोलने का वित्तीय वर्ष' : 'Opening Financial Year'}
                </label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] border border-[var(--border-subtle)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--postal-red)]/20"
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>
                      FY {y}-{(y + 1).toString().slice(-2)}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {isHindi
                    ? 'पीपीएफ नियम 9: परिपक्वता खाता खोलने के वित्तीय वर्ष के अंत से 15 पूर्ण वर्ष होती है'
                    : 'PPF Rule 9: Matures 15 full financial years from the end of the opening FY'}
                </p>
              </div>

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
                  variant="secondary"
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

          {/* EEE Status Badge Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
            <h5 className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'ईईई (EEE) कर-मुक्त स्थिति:' : 'Exempt-Exempt-Exempt (EEE) Status:'}</span>
            </h5>
            <p className="leading-relaxed text-[11px]">
              {isHindi
                ? 'जमा पर धारा 80C छूट, अर्जित ब्याज पूर्णतः कर-मुक्त (धारा 10(11)), एवं 15 वर्ष बाद संपूर्ण परिपक्वता राशि शून्य कर योग्य!'
                : '1. Deposit: Section 80C deduction. 2. Interest: 100% Tax-Free under Sec 10(11). 3. Maturity: Completely tax-free.'}
            </p>
          </div>
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
                  subtitle={isHindi ? '15 वित्तीय वर्षों में' : '15 annual contributions'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterest)}`}
                  subtitle={isHindi ? '100% कर-मुक्त चक्रवृद्धि' : '100% tax-free compounded'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता मूल्य' : 'Maturity Amount'}
                  value={AppFormatters.formatCurrency(calculationResult.maturityAmount)}
                  subtitle={isHindi ? '15 वित्तीय वर्ष पूर्ण होने पर' : 'After 15 full financial years'}
                  variant="primary"
                />
              </div>

              {/* 15-Year Schedule Table */}
              <ScheduleTable
                title={isHindi ? '15-वर्षीय पीपीएफ बैलेंस एवं ब्याज अनुसूची' : '15-Year PPF Balance & Accrual Schedule'}
                description={
                  isHindi
                    ? 'प्रत्येक वित्तीय वर्ष के अंत में 31 मार्च को जुड़ने वाले ब्याज का आधिकारिक विवरण'
                    : 'Year-by-year balance growth with annual March 31 interest credit'
                }
                columns={scheduleColumns}
                data={calculationResult.schedule}
                footer={
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>
                      {isHindi ? 'कुल 15 वर्ष जमा: ' : 'Total 15-Yr Deposit: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.totalDeposit)}</strong>
                    </span>
                    <span>
                      {isHindi ? 'परिपक्वता वर्ष: ' : 'Maturity Year: '}
                      <strong>FY {calculationResult.maturityYear - 1}-{calculationResult.maturityYear.toString().slice(-2)} (1 April {calculationResult.maturityYear})</strong>
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.totalDeposit}
                interest={calculationResult.totalInterest}
                total={calculationResult.maturityAmount}
                title={isHindi ? 'पीपीएफ प्रतिफल विभाजन' : 'PPF Investment Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'पीपीएफ पूरी तरह से ईईई (EEE) श्रेणी में आता है। जमा राशि धारा 80C के तहत ₹1.5 लाख तक कर-मुक्त है। ब्याज एवं परिपक्वता राशि आयकर अधिनियम की धारा 10(11) के तहत शत-प्रतिशत कर-मुक्त है।'
                    : 'PPF enjoys triple tax exemption (EEE). Deposits qualify under Section 80C up to ₹1.5 Lakh. All accrued interest and final maturity proceeds are 100% exempt from income tax under Section 10(11).'
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
