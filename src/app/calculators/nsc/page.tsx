'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
  Award,
  ShieldCheck,
  Calendar,
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
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹1,50,000 (80C Max)', value: 150000 },
  { label: '₹5,00,000', value: 500000 },
];

export default function NscCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('nsc');

  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [error, setError] = useState<string | null>(null);

  const calculationResult = useMemo(() => {
    if (depositAmount < 1000) {
      setError(
        isHindi
          ? 'न्यूनतम एनएससी जमा राशि ₹1,000 है'
          : 'Minimum NSC deposit is ₹1,000'
      );
      return null;
    }
    if (depositAmount % 100 !== 0) {
      setError(
        isHindi
          ? 'जमा राशि ₹100 के गुणक में होनी चाहिए'
          : 'Deposit must be in multiples of ₹100'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateNsc({
      depositAmount,
    });
  }, [depositAmount, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'nsc',
      schemeFullName: isHindi
        ? 'राष्ट्रीय बचत पत्र (NSC VIII Issue)'
        : 'National Savings Certificate (NSC VIII Issue)',
      depositAmount: calculationResult.depositAmount,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.maturityAmount,
      interestEarned: calculationResult.totalInterest,
      tenureYears: 5,
      parameters: {
        'Initial Deposit Amount': AppFormatters.formatCurrency(calculationResult.depositAmount),
        'Applicable Annual Rate': `${calculationResult.annualRate}% p.a. (Compounded Annually)`,
        'Lock-in Tenure': '5 Years',
        'Section 80C Benefit': 'Eligible on deposit + Deemed reinvested interest for Years 1-4',
        'TDS Deduction': 'No TDS at maturity by Post Office',
      },
      schedule: {
        headers: ['Year', 'Opening Balance', 'Annual Accrued Interest', '80C Deemed Reinvestment', 'Closing Balance'],
        rows: calculationResult.schedule.map((s) => [
          `Year ${s.year}`,
          AppFormatters.formatCurrency(s.openingBalance),
          AppFormatters.formatCurrency(s.interestAccrued),
          s.qualifiesFor80C ? 'Yes (80C Eligible)' : 'No (Maturity Year)',
          AppFormatters.formatCurrency(s.closingBalance),
        ]),
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setDepositAmount(100000);
  };

  const scheduleColumns = [
    { key: 'year', header: isHindi ? 'वर्ष' : 'Year', render: (r: { year: number }) => `Year ${r.year}` },
    {
      key: 'openingBalance',
      header: isHindi ? 'प्रारंभिक शेष' : 'Opening Balance',
      align: 'right' as const,
      render: (r: { openingBalance: number }) => AppFormatters.formatCurrency(r.openingBalance),
    },
    {
      key: 'interestAccrued',
      header: isHindi ? 'अर्जित ब्याज' : 'Interest Accrued',
      align: 'right' as const,
      render: (r: { interestAccrued: number }) => (
        <span className="font-bold text-[var(--postal-green)]">
          +{AppFormatters.formatCurrency(r.interestAccrued)}
        </span>
      ),
    },
    {
      key: 'qualifiesFor80C',
      header: isHindi ? 'धारा 80C पुनर्निवेश' : 'Deemed 80C Reinvestment',
      align: 'center' as const,
      render: (r: { qualifiesFor80C: boolean }) =>
        r.qualifiesFor80C ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {isHindi ? '80C पात्र' : '80C Eligible'}
          </span>
        ) : (
          <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
            {isHindi ? 'अंतिम वर्ष (अपात्र)' : 'Final Year (No 80C)'}
          </span>
        ),
    },
    {
      key: 'closingBalance',
      header: isHindi ? 'अंतिम संचित राशि' : 'Closing Value',
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
        <span className="text-[var(--text-primary)] font-semibold">NSC</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-base">
              NSC
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'राष्ट्रीय बचत पत्र (NSC) कैलकुलेटर'
                  : 'National Savings Certificate (NSC) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '5-वर्षीय एनएससी पर 7.7% वार्षिक चक्रवृद्धि एवं धारा 80C पुनर्निवेश लाभ जानें'
                  : 'Calculate 5-Year guaranteed maturity returns with Section 80C deemed reinvestment schedule'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}%` : `Current Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/national-savings-certificate">
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
                {isHindi ? 'एनएससी निवेश विवरण' : 'NSC Certificate Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'एकमुश्त जमा राशि दर्ज करें (5 वर्ष लॉक-इन)'
                  : 'Enter lump-sum investment (5-year sovereign lock-in)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Deposit Amount */}
              <Input
                label={isHindi ? 'जमा राशि (प्रमाणपत्र मूल्य)' : 'Investment Amount'}
                type="number"
                prefixText="₹"
                min={1000}
                step={100}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? 'न्यूनतम ₹1,000, ₹100 के गुणक में, कोई अधिकतम सीमा नहीं'
                    : 'Min ₹1,000, multiples of ₹100, no upper limit'
                }
                presets={PRESETS}
                onPresetSelect={(val) => setDepositAmount(val)}
              />

              <Slider
                min={1000}
                max={1000000}
                step={1000}
                value={depositAmount}
                onChange={(val) => setDepositAmount(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(depositAmount)}
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

          {/* Section 80C Reinvestment Callout */}
          <div className="p-4 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2 text-xs">
            <h5 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'धारा 80C मानी गई पुनर्निवेश छूट (Deemed Reinvestment):' : 'Section 80C Deemed Reinvestment Rule:'}</span>
            </h5>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              {isHindi
                ? 'एनएससी में प्रथम 4 वर्षों का अर्जित वार्षिक ब्याज स्वचालित रूप से "पुनर्निवेशित" माना जाता है और प्रत्येक वर्ष धारा 80C के तहत कर छूट हेतु पात्र होता है। केवल 5वें वर्ष का ब्याज परिपक्वता पर कर योग्य आय में जुड़ता है।'
                : 'Under Indian Income Tax rules, interest accrued in Years 1 to 4 is deemed reinvested and is eligible for Section 80C deduction in each respective financial year! Only the 5th year interest is not reinvested.'}
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
                  label={isHindi ? 'कुल निवेश' : 'Principal Invested'}
                  value={AppFormatters.formatCurrency(calculationResult.depositAmount)}
                  subtitle={isHindi ? '5 वर्ष की लॉक-इन अवधि' : '5-Year lock-in period'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल संचित ब्याज' : 'Total Interest'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterest)}`}
                  subtitle={isHindi ? '7.7% वार्षिक चक्रवृद्धि' : '7.7% compounded annually'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता राशि' : 'Maturity Value'}
                  value={AppFormatters.formatCurrency(calculationResult.maturityAmount)}
                  subtitle={isHindi ? '5 वर्ष पूर्ण होने पर' : 'Returned after 5 years'}
                  variant="primary"
                />
              </div>

              {/* Schedule Table */}
              <ScheduleTable
                title={isHindi ? '5-वर्षीय एनएससी वार्षिक ब्याज एवं 80C अनुसूची' : '5-Year NSC Accrual & 80C Schedule'}
                description={
                  isHindi
                    ? 'प्रत्येक वर्ष का अर्जित ब्याज एवं आयकर धारा 80C पुनर्निवेश पात्रता'
                    : 'Year-by-year compounding schedule and tax filing breakdown'
                }
                columns={scheduleColumns}
                data={calculationResult.schedule}
                footer={
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>
                      {isHindi ? 'परिपक्वता मूल्य: ' : 'Maturity Value: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.maturityAmount)}</strong>
                    </span>
                    <span>
                      {isHindi ? 'टीडीएस: कोई कटौती नहीं' : 'TDS: No TDS deducted by Post Office'}
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.depositAmount}
                interest={calculationResult.totalInterest}
                total={calculationResult.maturityAmount}
                title={isHindi ? 'एनएससी प्रतिफल विभाजन' : 'NSC Return Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'एनएससी में जमा राशि धारा 80C के तहत ₹1.5 लाख तक कर छूट हेतु पात्र है। प्रथम 4 वर्षों का अर्जित ब्याज धारा 80C के तहत पुनर्निवेशित माना जाता है। 5वें वर्ष का ब्याज पूर्णतः कर योग्य है। कोई टीडीएस नहीं कटता।'
                    : 'Principal deposit is eligible for Section 80C tax deduction up to ₹1.5 Lakh. Accrued interest for Years 1-4 qualifies as deemed reinvestment under 80C. Year 5 interest is taxable. No TDS is deducted at maturity.'
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
