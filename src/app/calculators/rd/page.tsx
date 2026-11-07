'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Download,
  Info,
  RefreshCw,
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
import { ReturnBreakdownChart } from '@/components/calculators/return-breakdown-chart';
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRESETS = [
  { label: '₹1,000', value: 1000 },
  { label: '₹2,500', value: 2500 },
  { label: '₹5,000', value: 5000 },
  { label: '₹10,000', value: 10000 },
  { label: '₹25,000', value: 25000 },
];

export default function RdCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('rd');

  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [openingDateStr, setOpeningDateStr] = useState<string>('2024-04-01');
  const [advanceMonths, setAdvanceMonths] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const openingDate = useMemo(() => {
    try {
      const d = new Date(openingDateStr);
      return isNaN(d.getTime()) ? new Date('2024-04-01') : d;
    } catch {
      return new Date('2024-04-01');
    }
  }, [openingDateStr]);

  // Validation & Calculation
  const calculationResult = useMemo(() => {
    if (monthlyDeposit < 100) {
      setError(
        isHindi
          ? 'न्यूनतम मासिक जमा ₹100 है'
          : 'Minimum monthly deposit is ₹100'
      );
      return null;
    }
    if (monthlyDeposit % 10 !== 0) {
      setError(
        isHindi
          ? 'मासिक जमा ₹10 के गुणकों में होनी चाहिए'
          : 'Monthly deposit must be in multiples of ₹10'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateRd({
      monthlyDeposit,
      accountOpenDate: openingDate,
      advanceMonths,
    });
  }, [monthlyDeposit, openingDate, advanceMonths, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'rd',
      schemeFullName: isHindi
        ? 'डाकघर 5-वर्षीय आवर्ती जमा (RD)'
        : 'Post Office 5-Year Recurring Deposit (RD)',
      depositAmount: calculationResult.totalDeposit,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.maturityAmount,
      interestEarned: calculationResult.totalInterest,
      tenureYears: 5,
      openingDate: calculationResult.accountOpenDate,
      maturityDate: calculationResult.maturityDate,
      parameters: {
        'Monthly Deposit': AppFormatters.formatCurrency(monthlyDeposit),
        'Account Opening Date': AppFormatters.formatDate(calculationResult.accountOpenDate),
        'Maturity Date (60 Mos)': AppFormatters.formatDate(calculationResult.maturityDate),
        'Total Installments': '60 Monthly Deposits',
        'Annual Interest Rate': `${calculationResult.annualRate}% p.a. (Quarterly Compounded)`,
        'Advance Rebate Credited': calculationResult.advanceRebate
          ? AppFormatters.formatCurrency(calculationResult.advanceRebate)
          : 'None',
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setMonthlyDeposit(5000);
    setAdvanceMonths(0);
    setOpeningDateStr('2024-04-01');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <Link href="/calculators" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'कैलकुलेटर' : 'Calculators'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">RD</span>
      </nav>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-[var(--primary-container)] text-[var(--postal-red)] flex items-center justify-center font-bold text-base">
              RD
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'डाकघर आवर्ती जमा (RD) कैलकुलेटर'
                  : 'Post Office Recurring Deposit (RD) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '5-वर्षीय डाकघर आरडी पर सटीक त्रैमासिक चक्रवृद्धि परिपक्वता मूल्य जानें'
                  : 'Calculate quarterly compounded maturity value for 5-Year National Savings Recurring Deposit'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {isHindi ? `वर्तमान ब्याज दर: ${currentRate}%` : `Current Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/recurring-deposit">
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-1" />
              {isHindi ? 'योजना नियम' : 'Scheme Guide'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Calculator Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="warm">
            <CardHeader>
              <CardTitle className="text-lg">
                {isHindi ? 'निवेश विवरण दर्ज करें' : 'Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'मासिक जमा एवं खाता खोलने की तिथि चुनें'
                  : 'Select your monthly deposit amount and opening date'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Monthly Deposit Input */}
              <Input
                label={isHindi ? 'मासिक जमा राशि' : 'Monthly Deposit Amount'}
                type="number"
                prefixText="₹"
                min={100}
                step={10}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? 'न्यूनतम ₹100, ₹10 के गुणक में, कोई अधिकतम सीमा नहीं'
                    : 'Min ₹100, multiples of ₹10, no upper limit'
                }
                presets={PRESETS}
                onPresetSelect={(val) => setMonthlyDeposit(val)}
              />

              {/* Deposit Slider */}
              <Slider
                min={100}
                max={50000}
                step={100}
                value={monthlyDeposit}
                onChange={(val) => setMonthlyDeposit(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(monthlyDeposit)}
              />

              {/* Account Opening Date */}
              <Input
                label={isHindi ? 'खाता खोलने की तिथि' : 'Account Opening Date'}
                type="date"
                value={openingDateStr}
                onChange={(e) => setOpeningDateStr(e.target.value)}
                helperText={
                  isHindi
                    ? 'ब्याज दर खाता खोलने की तिथि पर 60 महीनों के लिए लॉक हो जाती है'
                    : 'Rate is locked for 60 months as of this opening date'
                }
              />

              {/* Advance Rebate Months Selector */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>{isHindi ? 'अग्रिम जमा छूट (Rebate)' : 'Advance Deposit Rebate'}</span>
                  {advanceMonths > 0 && (
                    <span className="text-xs text-[var(--postal-green)] font-bold">
                      {advanceMonths} {isHindi ? 'माह अग्रिम' : 'months advance'}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 6, 12, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAdvanceMonths(m)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        advanceMonths === m
                          ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)]'
                          : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                      }`}
                    >
                      {m === 0 ? (isHindi ? 'कोई नहीं' : 'None') : `${m} M`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {isHindi
                    ? 'कम से कम 6 माह की अग्रिम जमा पर डाकघर नियम 6 के तहत रिबेट दी जाती है'
                    : 'Post office grants rebate on advance deposits of 6 months or more'}
                </p>
              </div>

              {/* Reset & Calculate */}
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

          {/* Quick Key Scheme Facts */}
          <div className="p-4 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2.5 text-xs">
            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--postal-green)]" />
              <span>{isHindi ? 'आरडी योजना की मुख्य बातें:' : 'Key RD Scheme Facts:'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)]">
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'कार्यकाल:' : 'Tenure:'}
                </span>
                <span>{isHindi ? '5 वर्ष (60 माह)' : '5 Years (60 Months)'}</span>
              </div>
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'चक्रवृद्धि:' : 'Compounding:'}
                </span>
                <span>{isHindi ? 'त्रैमासिक चक्रवृद्धि' : 'Quarterly Compounded'}</span>
              </div>
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'ऋण सुविधा:' : 'Loan Facility:'}
                </span>
                <span>{isHindi ? '1 वर्ष बाद 50% तक' : 'Up to 50% after 1 Yr'}</span>
              </div>
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'विस्तार:' : 'Extension:'}
                </span>
                <span>{isHindi ? '5 और वर्षों के लिए' : 'Further 5 Years'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Projections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'कुल जमा (मूलधन)' : 'Total Invested'}
                  value={AppFormatters.formatCurrency(calculationResult.totalDeposit)}
                  subtitle={isHindi ? '60 मासिक किस्तों में' : 'Across 60 monthly deposits'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterest)}`}
                  subtitle={isHindi ? 'त्रैमासिक चक्रवृद्धि ब्याज' : 'Quarterly compounded'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता मूल्य' : 'Maturity Value'}
                  value={AppFormatters.formatCurrency(calculationResult.maturityAmount)}
                  subtitle={isHindi ? '5 वर्ष पूर्ण होने पर' : 'After full 5 years'}
                  variant="primary"
                />
              </div>

              {/* Advance Rebate Alert if granted */}
              {calculationResult.advanceRebate > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-semibold">
                    {isHindi
                      ? `अग्रिम जमा छूट (Rebate): ₹${calculationResult.advanceRebate} की बचत!`
                      : `Advance Rebate Earned: Save ₹${calculationResult.advanceRebate} on advance installments!`}
                  </span>
                  <span className="font-bold">
                    Net Paid: {AppFormatters.formatCurrency(calculationResult.netDepositPaid)}
                  </span>
                </div>
              )}

              {/* Dates & Timeline Summary Card */}
              <div className="p-5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--postal-red)]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      {isHindi ? 'परिपक्वता तिथि:' : 'Exact Maturity Date:'}
                    </span>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">
                      {AppFormatters.formatDate(calculationResult.maturityDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-[var(--border-subtle)] sm:pl-6">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    {isHindi ? 'लागू स्थिर ब्याज दर:' : 'Locked Annual Rate:'}
                  </span>
                  <p className="text-base font-extrabold text-[var(--postal-green)]">
                    {calculationResult.annualRate}% p.a.
                  </p>
                </div>
              </div>

              {/* Investment Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.totalDeposit}
                interest={calculationResult.totalInterest}
                total={calculationResult.maturityAmount}
                title={isHindi ? 'आरडी प्रतिफल विभाजन' : 'RD Return Breakdown'}
              />

              {/* Official Rules & Assumptions Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'आरडी ब्याज पर निवेशक के आयकर स्लैब अनुसार कर लगता है। 1 वर्ष बाद जमा शेष का 50% तक ऋण डाकघर से लिया जा सकता है।'
                    : 'Interest is taxable under "Income from Other Sources". Up to 50% loan available after 1 year. Premature closure permitted after 3 years at PO Savings Account interest rate.'
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
