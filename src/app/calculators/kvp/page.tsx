'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
  Coins,
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
  { label: '₹2,50,000', value: 250000 },
  { label: '₹5,00,000', value: 500000 },
];

export default function KvpCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('kvp');

  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [error, setError] = useState<string | null>(null);

  const calculationResult = useMemo(() => {
    if (depositAmount < 1000) {
      setError(
        isHindi
          ? 'न्यूनतम केवीपी जमा राशि ₹1,000 है'
          : 'Minimum KVP deposit is ₹1,000'
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

    return CalculatorFacade.calculateKvp({
      depositAmount,
    });
  }, [depositAmount, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'kvp',
      schemeFullName: isHindi
        ? 'किसान विकास पत्र (KVP)'
        : 'Kisan Vikas Patra (KVP)',
      depositAmount: calculationResult.depositAmount,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.maturityAmount,
      interestEarned: calculationResult.totalInterest,
      tenureMonths: calculationResult.doublingMonths,
      parameters: {
        'Deposit Principal': AppFormatters.formatCurrency(calculationResult.depositAmount),
        'Doubling Period': `${calculationResult.doublingMonths} Months (9 Years 7 Months)`,
        'Applicable Annual Rate': `${calculationResult.annualRate}% p.a.`,
        'Maturity Guarantee': 'Exactly 2x of Deposit Principal',
        'Premature Encashment': 'Allowed after 2 years 6 months (30 months)',
        'Tax Deducted at Source': 'No TDS at maturity by Post Office',
      },
      schedule: {
        headers: ['Period', 'Surrender / Accrual Value', 'Incremental Interest', 'Closing Balance'],
        rows: calculationResult.accrualSchedule.map((s) => [
          s.periodLabel,
          AppFormatters.formatCurrency(s.accruedAmount),
          AppFormatters.formatCurrency(s.interestForPeriod),
          AppFormatters.formatCurrency(s.accruedAmount),
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
    { key: 'periodLabel', header: isHindi ? 'अवधि' : 'Period' },
    {
      key: 'interestForPeriod',
      header: isHindi ? 'अवधि ब्याज' : 'Period Interest',
      align: 'right' as const,
      render: (r: { interestForPeriod: number }) => (
        <span className="font-bold text-[var(--postal-green)]">
          +{AppFormatters.formatCurrency(r.interestForPeriod)}
        </span>
      ),
    },
    {
      key: 'accruedAmount',
      header: isHindi ? 'संचित मूल्य (Encashment Value)' : 'Surrender / Accrued Value',
      align: 'right' as const,
      render: (r: { accruedAmount: number }) => (
        <span className="font-bold text-[var(--text-primary)]">
          {AppFormatters.formatCurrency(r.accruedAmount)}
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
        <span className="text-[var(--text-primary)] font-semibold">KVP</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-base">
              KVP
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'किसान विकास पत्र (KVP) कैलकुलेटर'
                  : 'Kisan Vikas Patra (KVP) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '115 महीनों (9 वर्ष 7 माह) में निवेश दोगुना होने की आधिकारिक गणना एवं उपार्जन अनुसूची'
                  : 'Calculate guaranteed money doubling in 115 months (9 yrs 7 mos) with tax accrual schedule'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="amber" size="md">
            {isHindi ? `दोगुना: 115 माह (${currentRate}%)` : `Doubles in 115 Mos (${currentRate}% p.a.)`}
          </Badge>
          <Link href="/schemes/kisan-vikas-patra">
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
                {isHindi ? 'केवीपी निवेश विवरण' : 'KVP Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'एकमुश्त निवेश राशि दर्ज करें जो 115 माह में दोगुनी होगी'
                  : 'Enter deposit amount to double in 115 months'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Deposit Amount */}
              <Input
                label={isHindi ? 'जमा राशि (मूलधन)' : 'Investment Amount'}
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
                max={2000000}
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

          {/* Premature Surrender Note */}
          <div className="p-4 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2 text-xs">
            <h5 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'समय पूर्व भुनाई (Premature Encashment):' : 'Premature Encashment Facility:'}</span>
            </h5>
            <p className="leading-relaxed text-[var(--text-secondary)]">
              {isHindi
                ? 'केवीपी प्रमाण पत्र को खाता खोलने के 2 वर्ष 6 माह (30 माह) के बाद डाकघर के आधिकारिक समर्पण मूल्य (Surrender Value) पर समय से पूर्व भुनाया जा सकता है।'
                : 'KVP can be encashed prematurely after 2 years and 6 months (30 months) from the date of issue at predetermined surrender values.'}
            </p>
          </div>
        </div>

        {/* Right Column: Results & Accrual Schedule */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'जमा राशि (मूलधन)' : 'Deposit Amount'}
                  value={AppFormatters.formatCurrency(calculationResult.depositAmount)}
                  subtitle={isHindi ? '115 माह की अवधि' : '115 months lock-in'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterest)}`}
                  subtitle={isHindi ? 'मूलधन के शत-प्रतिशत बराबर' : 'Exactly equal to principal'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'दोगुनी परिपक्वता राशि' : 'Doubled Maturity Value'}
                  value={AppFormatters.formatCurrency(calculationResult.maturityAmount)}
                  subtitle={isHindi ? '115 माह पूर्ण होने पर (2x)' : 'Exact 2x guaranteed return'}
                  variant="primary"
                />
              </div>

              {/* Accrual Schedule Table for ITR */}
              <ScheduleTable
                title={isHindi ? 'केवीपी उपार्जन एवं समर्पण मूल्य अनुसूची' : 'KVP Accrual & Surrender Schedule'}
                description={
                  isHindi
                    ? 'वार्षिक उपार्जित ब्याज (आईटीआर दाखिल करने हेतु) एवं समय पूर्व भुनाई मूल्य'
                    : 'Annual interest accrual schedule for Income Tax filing and premature encashment values'
                }
                columns={scheduleColumns}
                data={calculationResult.accrualSchedule}
                footer={
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>
                      {isHindi ? 'परिपक्वता अवधि: 115 माह (9 वर्ष 7 माह)' : 'Maturity: 115 Months (9 Yrs 7 Mos)'}
                    </span>
                    <span>
                      {isHindi ? 'दोगुनी गारंटी: ₹' + (calculationResult.depositAmount * 2).toLocaleString('en-IN') : 'Double Return: ₹' + (calculationResult.depositAmount * 2).toLocaleString('en-IN')}
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.depositAmount}
                interest={calculationResult.totalInterest}
                total={calculationResult.maturityAmount}
                title={isHindi ? 'केवीपी प्रतिफल विभाजन (50% मूलधन + 50% ब्याज)' : 'KVP Return Breakdown (50% Deposit + 50% Interest)'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'केवीपी पर धारा 80C कर छूट उपलब्ध नहीं है। ब्याज निवेशक के आयकर स्लैब अनुसार कर योग्य है। डाकघर स्रोत पर कोई टीडीएस नहीं काटता। निवेशक प्रतिवर्ष उपार्जन आधार (Accrual basis) या परिपक्वता पर कर का भुगतान कर सकता है।'
                    : 'KVP does not qualify for Section 80C deduction. Interest is fully taxable as per your income tax slab. No TDS is deducted by Post Office. Investors can declare interest yearly on an accrual basis or in the year of maturity.'
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
