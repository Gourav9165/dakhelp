'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Percent,
  Download,
  Info,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import {
  customInterestCalculatorEngine,
  CustomCalculationMode,
  CustomCompoundingFrequency,
  CustomInterestSchedulePeriod,
} from '@/services/calculation-engine/custom-interest-engine';
import { AppFormatters } from '@/core/formatters/currency-formatter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/calculators/metric-card';
import { ScheduleTable, ColumnDef } from '@/components/calculators/schedule-table';
import { ReturnBreakdownChart } from '@/components/calculators/return-breakdown-chart';
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRINCIPAL_PRESETS = [
  { label: '₹10,000', value: 10000 },
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹5,00,000', value: 500000 },
  { label: '₹10,00,000', value: 1000000 },
];

export default function CustomInterestCalculatorPage() {
  const { isHindi } = useLanguage();

  const [mode, setMode] = useState<CustomCalculationMode>('compound');
  const [principal, setPrincipal] = useState<number>(100000);
  const [annualRate, setAnnualRate] = useState<number>(7.5);
  const [years, setYears] = useState<number>(5);
  const [months, setMonths] = useState<number>(0);
  const [compoundingFreq, setCompoundingFreq] = useState<CustomCompoundingFrequency>('quarterly');
  const [enableRecurring, setEnableRecurring] = useState<boolean>(false);
  const [recurringAmount, setRecurringAmount] = useState<number>(5000);
  const [error, setError] = useState<string | null>(null);

  const calculationResult = useMemo(() => {
    try {
      const durationInYears = years + months / 12;
      if (durationInYears <= 0) {
        setError(isHindi ? 'अवधि शून्य से अधिक होनी चाहिए' : 'Duration must be greater than zero');
        return null;
      }
      if (principal <= 0 && (!enableRecurring || recurringAmount <= 0)) {
        setError(isHindi ? 'कृपया मूलधन या आवर्ती किस्त दर्ज करें' : 'Please enter a principal or recurring contribution');
        return null;
      }
      setError(null);

      return customInterestCalculatorEngine.calculate({
        mode,
        principal,
        annualRate,
        durationInYears,
        compoundingFrequency: compoundingFreq,
        enableRecurring,
        recurringAmount,
        contributionFrequency: 'monthly',
      });
    } catch (e: any) {
      setError(e.message || 'Calculation error');
      return null;
    }
  }, [mode, principal, annualRate, years, months, compoundingFreq, enableRecurring, recurringAmount, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateCustomInterestReport({
      calculationType: mode,
      principal: calculationResult.totalInvested,
      rate: annualRate,
      timeYears: years,
      timeMonths: months > 0 ? months : undefined,
      compoundingFrequency:
        mode === 'compound'
          ? compoundingFreq === 'monthly'
            ? 'Monthly (12x/yr)'
            : compoundingFreq === 'quarterly'
            ? 'Quarterly (4x/yr)'
            : compoundingFreq === 'halfYearly'
            ? 'Half-Yearly (2x/yr)'
            : 'Annually (1x/yr)'
          : undefined,
      totalInterest: calculationResult.totalInterestEarned,
      totalAmount: calculationResult.finalAmount,
      schedule: calculationResult.schedule.map((s) => ({
        period: s.periodIndex,
        openingBalance: s.openingBalance,
        interestEarned: s.interestEarned,
        closingBalance: s.closingBalance,
      })),
      isHindi,
    });
  };

  const resetForm = () => {
    setMode('compound');
    setPrincipal(100000);
    setAnnualRate(7.5);
    setYears(5);
    setMonths(0);
    setCompoundingFreq('quarterly');
    setEnableRecurring(false);
    setRecurringAmount(5000);
  };

  const scheduleColumns: ColumnDef<CustomInterestSchedulePeriod>[] = [
    { key: 'periodLabel', header: isHindi ? 'अवधि' : 'Period' },
    {
      key: 'openingBalance',
      header: isHindi ? 'प्रारंभिक शेष' : 'Opening Balance',
      align: 'right' as const,
      render: (r: CustomInterestSchedulePeriod) => AppFormatters.formatCurrency(r.openingBalance),
    },
    ...(enableRecurring
      ? [
          {
            key: 'depositAdded',
            header: isHindi ? 'नया जमा' : 'Contribution',
            align: 'right' as const,
            render: (r: CustomInterestSchedulePeriod) =>
              r.depositAdded > 0 ? (
                `+${AppFormatters.formatCurrency(r.depositAdded)}`
              ) : (
                <span className="text-[var(--text-secondary)]">—</span>
              ),
          },
        ]
      : []),
    {
      key: 'interestEarned',
      header: isHindi ? 'अर्जित ब्याज' : 'Interest Earned',
      align: 'right' as const,
      render: (r: CustomInterestSchedulePeriod) => (
        <span className="font-bold text-[var(--postal-green)]">
          +{AppFormatters.formatCurrency(r.interestEarned)}
        </span>
      ),
    },
    {
      key: 'closingBalance',
      header: isHindi ? 'अंतिम शेष' : 'Closing Balance',
      align: 'right' as const,
      render: (r: CustomInterestSchedulePeriod) => (
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
        <span className="text-[var(--text-primary)] font-semibold">
          {isHindi ? 'कस्टम ब्याज कैलकुलेटर' : 'Custom Interest Calculator'}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] flex items-center justify-center font-bold text-base">
              <Percent className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'कस्टम साधारण एवं चक्रवृद्धि ब्याज कैलकुलेटर'
                  : 'Universal Simple & Compound Interest Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? 'किसी भी ब्याज दर, अवधि (वर्ष, माह), एवं मासिक/त्रैमासिक चक्रवृद्धि पर सटीक वित्तीय गणना'
                  : 'Calculate simple or multi-frequency compound interest with amortization schedule'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleDownloadPdf}
            disabled={!calculationResult}
          >
            <Download className="w-4 h-4 mr-1.5" />
            {isHindi ? 'पीडीएफ रिपोर्ट' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="warm">
            <CardHeader>
              <CardTitle className="text-lg">
                {isHindi ? 'ब्याज गणना इनपुट' : 'Interest Calculation Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'साधारण या चक्रवृद्धि ब्याज का चयन करें एवं मूलधन दर्ज करें'
                  : 'Select interest type, enter principal, rate, and tenure'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mode Toggle: Simple vs Compound */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'गणना का प्रकार' : 'Interest Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('simple')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      mode === 'simple'
                        ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    {isHindi ? 'साधारण ब्याज (Simple)' : 'Simple Interest'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('compound')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      mode === 'compound'
                        ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    {isHindi ? 'चक्रवृद्धि ब्याज (Compound)' : 'Compound Interest'}
                  </button>
                </div>
              </div>

              {/* Compounding Frequency (if Compound mode) */}
              {mode === 'compound' && (
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    {isHindi ? 'चक्रवृद्धि की आवृत्ति (Frequency)' : 'Compounding Frequency'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'monthly' as const, label: isHindi ? 'मासिक' : 'Monthly' },
                      { id: 'quarterly' as const, label: isHindi ? 'त्रैमासिक' : 'Quarterly' },
                      { id: 'halfYearly' as const, label: isHindi ? 'छमाही' : 'Half-Yr' },
                      { id: 'annually' as const, label: isHindi ? 'वार्षिक' : 'Annually' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCompoundingFreq(f.id)}
                        className={`py-2 text-[11px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                          compoundingFreq === f.id
                            ? 'bg-[var(--postal-green)] text-white border-[var(--postal-green)]'
                            : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Principal Amount */}
              <Input
                label={isHindi ? 'मूलधन (Principal Amount)' : 'Principal Amount'}
                type="number"
                prefixText="₹"
                min={0}
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                error={error || undefined}
                presets={PRINCIPAL_PRESETS}
                onPresetSelect={(val) => setPrincipal(val)}
              />

              <Slider
                min={1000}
                max={2000000}
                step={5000}
                value={principal}
                onChange={(val) => setPrincipal(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(principal)}
              />

              {/* Annual Interest Rate */}
              <Input
                label={isHindi ? 'वार्षिक ब्याज दर (%)' : 'Annual Interest Rate (%)'}
                type="number"
                suffixText="% p.a."
                min={0}
                max={100}
                step={0.1}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
              />

              {/* Duration: Years & Months */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={isHindi ? 'अवधि (वर्ष)' : 'Tenure (Years)'}
                  type="number"
                  min={0}
                  max={50}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value) || 0)}
                />
                <Input
                  label={isHindi ? 'अतिरिक्त माह' : 'Extra Months'}
                  type="number"
                  min={0}
                  max={11}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value) || 0)}
                />
              </div>

              {/* Optional Recurring Contributions Toggle */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                    {isHindi ? 'मासिक आवर्ती जमा जोड़ें (Recurring SIP)' : 'Add Monthly Contribution'}
                  </label>
                  <input
                    type="checkbox"
                    checked={enableRecurring}
                    onChange={(e) => setEnableRecurring(e.target.checked)}
                    className="w-4 h-4 accent-[var(--postal-red)] rounded cursor-pointer"
                  />
                </div>

                {enableRecurring && (
                  <Input
                    label={isHindi ? 'प्रति माह जमा राशि' : 'Monthly Contribution Amount'}
                    type="number"
                    prefixText="₹"
                    min={100}
                    step={500}
                    value={recurringAmount}
                    onChange={(e) => setRecurringAmount(Number(e.target.value) || 0)}
                  />
                )}
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

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'कुल निवेशित पूंजी' : 'Total Capital Invested'}
                  value={AppFormatters.formatCurrency(calculationResult.totalInvested)}
                  subtitle={
                    enableRecurring
                      ? `${AppFormatters.formatCurrency(principal)} + ${AppFormatters.formatCurrency(calculationResult.totalContributionsInvested)}`
                      : `${years} yrs ${months > 0 ? `${months} mos` : ''}`
                  }
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest Earned'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterestEarned)}`}
                  subtitle={
                    mode === 'simple'
                      ? isHindi
                        ? 'साधारण ब्याज'
                        : 'Simple interest'
                      : isHindi
                      ? `${compoundingFreq} चक्रवृद्धि`
                      : `${compoundingFreq} compounded`
                  }
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'अंतिम परिपक्वता मूल्य' : 'Final Maturity Value'}
                  value={AppFormatters.formatCurrency(calculationResult.finalAmount)}
                  subtitle={isHindi ? 'मूलधन + ब्याज' : 'Principal + Total Interest'}
                  variant="primary"
                />
              </div>

              {/* Formula & Method Card */}
              <div className="p-4 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                <h5 className="font-bold text-[var(--text-primary)]">
                  {isHindi ? 'उपयोग किया गया गणितीय सूत्र:' : 'Mathematical Formula Used:'}
                </h5>
                <pre className="font-mono text-xs bg-[var(--surface-container)] p-3 rounded-xl overflow-x-auto text-[var(--postal-red)] font-bold">
                  {calculationResult.formulaDescription}
                </pre>
              </div>

              {/* Schedule Table */}
              <ScheduleTable
                title={isHindi ? 'अवधि-वार ब्याज एवं शेष अनुसूची' : 'Period Amortization & Accrual Schedule'}
                description={
                  isHindi
                    ? 'प्रत्येक समयावधि में अर्जित ब्याज एवं संचित शेष की तालिका'
                    : 'Period-by-period progression of capital, newly credited interest, and ending balance'
                }
                columns={scheduleColumns}
                data={calculationResult.schedule}
                footer={
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>
                      {isHindi ? 'अंतिम शेष: ' : 'Final Total Balance: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.finalAmount)}</strong>
                    </span>
                    <span>
                      {isHindi ? 'कुल ब्याज: ' : 'Total Interest: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.totalInterestEarned)}</strong>
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.totalInvested}
                interest={calculationResult.totalInterestEarned}
                total={calculationResult.finalAmount}
                title={isHindi ? 'निवेश प्रतिफल विभाजन' : 'Total Returns Breakdown'}
              />

              {/* Assumptions Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                disclaimer={
                  isHindi
                    ? 'यह कैलकुलेटर केवल सामान्य वित्तीय गणना और शैक्षिक उद्देश्यों के लिए है।'
                    : 'This universal interest calculator is provided for educational and analytical purposes.'
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
