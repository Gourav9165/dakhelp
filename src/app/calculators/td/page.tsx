'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Download,
  Info,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
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
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹2,00,000', value: 200000 },
  { label: '₹5,00,000', value: 500000 },
  { label: '₹10,00,000', value: 1000000 },
];

export default function TdCalculatorPage() {
  const { isHindi } = useLanguage();

  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [tenureYears, setTenureYears] = useState<1 | 2 | 3 | 5>(5);
  const [error, setError] = useState<string | null>(null);

  const currentRate = useMemo(() => {
    switch (tenureYears) {
      case 1:
        return InterestRateRepository.getLatestRate('td1');
      case 2:
        return InterestRateRepository.getLatestRate('td2');
      case 3:
        return InterestRateRepository.getLatestRate('td3');
      case 5:
        return InterestRateRepository.getLatestRate('td5');
    }
  }, [tenureYears]);

  // Validation & Calculation
  const calculationResult = useMemo(() => {
    if (depositAmount < 1000) {
      setError(
        isHindi
          ? 'न्यूनतम सावधि जमा राशि ₹1,000 है'
          : 'Minimum time deposit amount is ₹1,000'
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

    return CalculatorFacade.calculateTd({
      depositAmount,
      tenureYears,
    });
  }, [depositAmount, tenureYears, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'td',
      schemeFullName: isHindi
        ? `डाकघर ${tenureYears}-वर्षीय सावधि जमा (TD)`
        : `Post Office ${tenureYears}-Year Time Deposit (TD)`,
      depositAmount: calculationResult.depositAmount,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.totalRepaidAmount,
      interestEarned: calculationResult.totalAnnualInterest,
      tenureYears,
      periodicPayoutText: `${AppFormatters.formatCurrency(calculationResult.annualInterestPayout)} per year`,
      parameters: {
        'Initial Deposit Amount': AppFormatters.formatCurrency(calculationResult.depositAmount),
        'Selected Tenure': `${tenureYears} Years`,
        'Applicable Interest Rate': `${calculationResult.annualRate}% p.a.`,
        'Compounding Method': 'Quarterly compounding compounded annually',
        'Annual Payout (Rule 7)': AppFormatters.formatCurrency(calculationResult.annualInterestPayout),
        'Section 80C Tax Benefit': tenureYears === 5 ? 'Eligible (up to ₹1.5 Lakh)' : 'Not Eligible (1, 2, 3 Yr)',
      },
      schedule: {
        headers: ['Year', 'Principal', 'Annual Interest Payout', 'Principal Repaid at Maturity'],
        rows: calculationResult.schedule.map((s) => [
          `Year ${s.year}`,
          AppFormatters.formatCurrency(s.principal),
          AppFormatters.formatCurrency(s.annualInterest),
          AppFormatters.formatCurrency(s.closingPrincipal),
        ]),
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setDepositAmount(100000);
    setTenureYears(5);
  };

  const scheduleColumns = [
    { key: 'year', header: isHindi ? 'वर्ष' : 'Year', render: (r: { year: number }) => `Year ${r.year}` },
    {
      key: 'principal',
      header: isHindi ? 'मूलधन शेष' : 'Principal',
      align: 'right' as const,
      render: (r: { principal: number }) => AppFormatters.formatCurrency(r.principal),
    },
    {
      key: 'annualInterest',
      header: isHindi ? 'वार्षिक ब्याज भुगतान (नियम 7)' : 'Annual Interest Payout',
      align: 'right' as const,
      render: (r: { annualInterest: number }) => (
        <span className="font-bold text-[var(--postal-green)]">
          +{AppFormatters.formatCurrency(r.annualInterest)}
        </span>
      ),
    },
    {
      key: 'closingPrincipal',
      header: isHindi ? 'वापसी (परिपक्वता)' : 'Capital Return',
      align: 'right' as const,
      render: (r: { closingPrincipal: number; year: number }) =>
        r.year === tenureYears ? (
          <span className="font-extrabold text-[var(--postal-red)]">
            {AppFormatters.formatCurrency(r.closingPrincipal)}
          </span>
        ) : (
          <span className="text-[var(--text-secondary)]">—</span>
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
        <span className="text-[var(--text-primary)] font-semibold">TD</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-[var(--secondary-container)] text-[var(--postal-green)] flex items-center justify-center font-bold text-base">
              TD
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'डाकघर सावधि जमा (TD) कैलकुलेटर'
                  : 'Post Office Time Deposit (TD) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '1, 2, 3 और 5-वर्षीय सावधि जमा पर त्रैमासिक चक्रवृद्धि एवं वार्षिक ब्याज भुगतान'
                  : 'Calculate quarterly compounded, annually paid interest for 1, 2, 3 & 5 Year Post Office Time Deposits'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" size="md">
            {isHindi ? `${tenureYears} वर्ष दर: ${currentRate}%` : `${tenureYears}-Yr Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/time-deposit">
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
                {isHindi ? 'सावधि निवेश विवरण' : 'Time Deposit Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'जमा राशि एवं अवधि (कार्यकाल) का चयन करें'
                  : 'Choose your deposit principal and deposit tenure'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Tenure Selection */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'जमा अवधि (कार्यकाल)' : 'Deposit Tenure'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 2, 3, 5] as const).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTenureYears(yr)}
                      className={`py-2.5 px-2 text-center rounded-xl border transition-all cursor-pointer font-bold text-xs ${
                        tenureYears === yr
                          ? 'bg-[var(--postal-green)] text-white border-[var(--postal-green)] shadow-sm'
                          : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                      }`}
                    >
                      <span>{yr} {isHindi ? 'वर्ष' : 'Year'}</span>
                      <span className="block text-[10px] font-normal opacity-90">
                        {InterestRateRepository.getLatestRate(
                          yr === 1 ? 'td1' : yr === 2 ? 'td2' : yr === 3 ? 'td3' : 'td5'
                        )}%
                      </span>
                    </button>
                  ))}
                </div>
                {tenureYears === 5 && (
                  <p className="text-[11px] text-[var(--postal-green)] font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isHindi ? '5-वर्षीय टीडी धारा 80C कर छूट हेतु पात्र है' : '5-Year TD is eligible for Section 80C tax deduction'}</span>
                  </p>
                )}
              </div>

              {/* Deposit Amount */}
              <Input
                label={isHindi ? 'जमा राशि (मूलधन)' : 'Deposit Amount'}
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

              {/* Action Buttons */}
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

          {/* Rule 7 Note Callout */}
          <div className="p-4 rounded-2xl bg-[var(--disclaimer-bg)] border border-[var(--disclaimer-border)] text-xs text-[var(--disclaimer-text)] space-y-1.5">
            <h5 className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'डाकघर टीडी नियम 7 (वार्षिक ब्याज भुगतान):' : 'Important Rule 7 (Annual Payout Mandate):'}</span>
            </h5>
            <p className="leading-relaxed">
              {isHindi
                ? 'डाकघर नियमों के तहत ब्याज की गणना त्रैमासिक चक्रवृद्धि आधार पर होती है, परंतु इसका भुगतान निवेशक को प्रतिवर्ष वार्षिक रूप से किया जाता है। यदि खाताधारक वार्षिक ब्याज नहीं निकालता, तो नियम 7(3) के अनुसार उस पर कोई अतिरिक्त ब्याज देय नहीं होता।'
                : 'National Savings Time Deposit interest is compounded quarterly but paid out annually to the investor. Under Rule 7(3), undrawn annual interest does not earn any further interest.'}
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
                  label={isHindi ? 'जमा मूलधन' : 'Principal Deposited'}
                  value={AppFormatters.formatCurrency(calculationResult.depositAmount)}
                  subtitle={`${tenureYears} ${isHindi ? 'वर्षों हेतु' : 'Year lock-in'}`}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'वार्षिक ब्याज भुगतान' : 'Annual Payout'}
                  value={AppFormatters.formatCurrency(calculationResult.annualInterestPayout)}
                  subtitle={isHindi ? 'प्रत्येक वर्ष देय (Rule 7)' : 'Paid every year'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'कुल प्रतिफल (मूलधन + ब्याज)' : 'Total Received'}
                  value={AppFormatters.formatCurrency(calculationResult.totalRepaidAmount)}
                  subtitle={`${AppFormatters.formatCurrency(calculationResult.totalAnnualInterest)} ${isHindi ? 'कुल ब्याज' : 'total interest'}`}
                  variant="primary"
                />
              </div>

              {/* Annual Schedule Table */}
              <ScheduleTable
                title={isHindi ? 'वार्षिक ब्याज भुगतान एवं मूलधन अनुसूची' : 'Annual Payout Schedule (Rule 7 Mandate)'}
                description={
                  isHindi
                    ? 'प्रत्येक पूर्ण वर्ष के अंत में मिलने वाले ब्याज का आधिकारिक विवरण'
                    : 'Year-by-year distribution of annual payouts and capital return at maturity'
                }
                columns={scheduleColumns}
                data={calculationResult.schedule}
                footer={
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span>
                      {isHindi ? 'कुल वार्षिक ब्याज भुगतान: ' : 'Total Annual Payout: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.totalAnnualInterest)}</strong>
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {isHindi
                        ? 'परिपक्वता पर मूलधन वापस: '
                        : 'Maturity Capital Return: '}
                      <strong>{AppFormatters.formatCurrency(calculationResult.depositAmount)}</strong>
                    </span>
                  </div>
                }
              />

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.depositAmount}
                interest={calculationResult.totalAnnualInterest}
                total={calculationResult.totalRepaidAmount}
                title={isHindi ? 'सावधि जमा प्रतिफल विभाजन' : 'Time Deposit Return Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  tenureYears === 5
                    ? isHindi
                      ? '5-वर्षीय टीडी धारा 80C के तहत ₹1.5 लाख तक कर छूट हेतु पात्र है। ब्याज निवेशक के आयकर स्लैब अनुसार कर योग्य है। टीडीएस नियम लागू हैं।'
                      : '5-Year TD qualifies for Section 80C deduction up to ₹1.5 Lakh. Interest is taxable under "Income from Other Sources". TDS applies if interest exceeds threshold.'
                    : isHindi
                      ? '1, 2, 3-वर्षीय टीडी पर धारा 80C कर छूट उपलब्ध नहीं है। ब्याज कर योग्य है।'
                      : '1, 2, and 3-Year TDs do NOT qualify for Section 80C deductions. Interest is taxable as per your income tax slab.'
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
