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
import { ReturnBreakdownChart } from '@/components/calculators/return-breakdown-chart';
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRESETS = [
  { label: '₹2,00,000', value: 200000 },
  { label: '₹5,00,000', value: 500000 },
  { label: '₹10,00,000', value: 1000000 },
  { label: '₹15,00,000', value: 1500000 },
  { label: '₹30,00,000 (Max)', value: 3000000 },
];

export default function ScssCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('scss');

  const [depositAmount, setDepositAmount] = useState<number>(1500000);
  const [openingDateStr, setOpeningDateStr] = useState<string>('2024-04-01');
  const [error, setError] = useState<string | null>(null);

  const openingDate = useMemo(() => {
    try {
      const d = new Date(openingDateStr);
      return isNaN(d.getTime()) ? new Date('2024-04-01') : d;
    } catch {
      return new Date('2024-04-01');
    }
  }, [openingDateStr]);

  const calculationResult = useMemo(() => {
    if (depositAmount < 1000) {
      setError(
        isHindi
          ? 'न्यूनतम जमा राशि ₹1,000 है'
          : 'Minimum deposit amount is ₹1,000'
      );
      return null;
    }
    if (depositAmount % 1000 !== 0) {
      setError(
        isHindi
          ? 'जमा राशि ₹1,000 के गुणक में होनी चाहिए'
          : 'Deposit must be in multiples of ₹1,000'
      );
      return null;
    }
    if (depositAmount > 3000000) {
      setError(
        isHindi
          ? 'अधिकतम सीमा ₹30,00,000 है'
          : 'Maximum investment limit is ₹30,00,000'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateScss({
      depositAmount,
      accountOpenDate: openingDate,
    });
  }, [depositAmount, openingDate, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'scss',
      schemeFullName: isHindi
        ? 'वरिष्ठ नागरिक बचत योजना (SCSS)'
        : 'Senior Citizens Savings Scheme (SCSS)',
      depositAmount: calculationResult.depositAmount,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.totalRepaidAmount,
      interestEarned: calculationResult.totalInterestReceived,
      tenureYears: 5,
      openingDate: calculationResult.accountOpenDate,
      maturityDate: calculationResult.maturityDate,
      periodicPayoutText: `${AppFormatters.formatCurrency(calculationResult.quarterlyInterestPayout)} per quarter (20 quarters)`,
      parameters: {
        'Deposit Principal': AppFormatters.formatCurrency(calculationResult.depositAmount),
        'Quarterly Interest Payout': AppFormatters.formatCurrency(calculationResult.quarterlyInterestPayout),
        'First Quarter Payout (Pro-rata)': AppFormatters.formatCurrency(calculationResult.firstQuarterPayout),
        'Applicable Annual Rate': `${calculationResult.annualRate}% p.a.`,
        'Tenure': '5 Years (Extendable by 3 years)',
        'Section 80C Tax Benefit': 'Eligible (up to ₹1.5 Lakh)',
        'TDS Threshold (Sec 194A)': '₹1,00,000 / year (Budget 2025)',
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setDepositAmount(1500000);
    setOpeningDateStr('2024-04-01');
  };

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
        <span className="text-[var(--text-primary)] font-semibold">SCSS</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-base">
              SCSS
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'वरिष्ठ नागरिक बचत योजना (SCSS) कैलकुलेटर'
                  : 'Senior Citizens Savings Scheme (SCSS) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? 'वरिष्ठ नागरिकों हेतु 8.2% उच्चतम सुरक्षित ब्याज एवं त्रैमासिक पेंशन आय की गणना करें'
                  : 'Calculate quarterly payouts and 80C tax benefits under Senior Citizens Savings Scheme'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}%` : `Current Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/senior-citizens-savings-scheme">
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
                {isHindi ? 'वरिष्ठ नागरिक निवेश विवरण' : 'SCSS Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'जमा राशि एवं खाता खोलने की तिथि चुनें'
                  : 'Enter deposit amount (up to ₹30 Lakh) and opening date'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Deposit Amount */}
              <Input
                label={isHindi ? 'जमा राशि (मूलधन)' : 'Deposit Amount'}
                type="number"
                prefixText="₹"
                min={1000}
                max={3000000}
                step={1000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? 'न्यूनतम ₹1,000, अधिकतम ₹30 लाख (₹1,000 के गुणक में)'
                    : 'Min ₹1,000, Max ₹30 Lakh (in multiples of ₹1,000)'
                }
                presets={PRESETS}
                onPresetSelect={(val) => setDepositAmount(val)}
              />

              <Slider
                min={1000}
                max={3000000}
                step={5000}
                value={depositAmount}
                onChange={(val) => setDepositAmount(val)}
                label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                displayValue={AppFormatters.formatCurrency(depositAmount)}
              />

              {/* Opening Date */}
              <Input
                label={isHindi ? 'खाता खोलने की तिथि' : 'Account Opening Date'}
                type="date"
                value={openingDateStr}
                onChange={(e) => setOpeningDateStr(e.target.value)}
                helperText={
                  isHindi
                    ? 'त्रैमासिक चक्र (1 अप्रैल, 1 जुलाई, 1 अक्टूबर, 1 जनवरी) अनुसार प्रथम तिमाही का प्रो-राटा ब्याज तय होगा'
                    : 'Determines pro-rata interest for the opening partial quarter'
                }
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

          {/* Highlights Card */}
          <div className="p-4 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2 text-xs">
            <h5 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'वरिष्ठ नागरिक विशेष लाभ:' : 'Senior Citizen Benefits:'}</span>
            </h5>
            <ul className="space-y-1.5 text-[var(--text-secondary)]">
              <li>• {isHindi ? 'धारा 80C के तहत ₹1.5 लाख तक कर कटौती' : 'Section 80C deduction up to ₹1.5 Lakh'}</li>
              <li>• {isHindi ? 'बजट 2025: वरिष्ठ नागरिकों हेतु टीडीएस सीमा ₹1 लाख तक' : 'Budget 2025: TDS exemption threshold updated to ₹1 Lakh under Sec 194A'}</li>
              <li>• {isHindi ? '5 वर्ष पूर्ण होने के बाद 3 और वर्षों के लिए विस्तार की सुविधा' : '3-year extension available after 5-year maturity'}</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'त्रैमासिक ब्याज भुगतान' : 'Quarterly Payout'}
                  value={AppFormatters.formatCurrency(calculationResult.quarterlyInterestPayout)}
                  subtitle={isHindi ? 'हर 3 माह में खाते में' : 'Paid every 3 months'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'कुल ब्याज (5 वर्ष)' : 'Total Interest (5 Yrs)'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterestReceived)}`}
                  subtitle={isHindi ? '20 तिमाहियों में' : 'Across 20 quarters'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता पर वापसी' : 'Capital Returned'}
                  value={AppFormatters.formatCurrency(calculationResult.depositAmount)}
                  subtitle={isHindi ? '5 वर्ष पूर्ण होने पर' : 'At 5-year maturity'}
                  variant="primary"
                />
              </div>

              {/* First Quarter Pro-Rata Banner */}
              {calculationResult.firstQuarterPayout !== calculationResult.quarterlyInterestPayout && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                  <span className="font-bold">
                    {isHindi ? 'प्रथम तिमाही प्रो-राटा भुगतान: ' : 'First Quarter Pro-Rata Payout: '}
                  </span>
                  <span>
                    {AppFormatters.formatCurrency(calculationResult.firstQuarterPayout)} (
                    {isHindi
                      ? 'खाता खोलने की तिथि से आगामी तिमाही प्रारंभ तक के वास्तविक दिनों हेतु'
                      : 'Calculated strictly for actual days from opening date to next calendar quarter'}
                    )
                  </span>
                </div>
              )}

              {/* Timeline Card */}
              <div className="p-5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--postal-red)]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      {isHindi ? 'परिपक्वता तिथि:' : 'Maturity Date (5 Years):'}
                    </span>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">
                      {AppFormatters.formatDate(calculationResult.maturityDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-[var(--border-subtle)] sm:pl-6">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    {isHindi ? 'वार्षिक समकक्ष आय:' : 'Annual Pension Equivalent:'}
                  </span>
                  <p className="text-base font-extrabold text-[var(--postal-green)]">
                    {AppFormatters.formatCurrency(calculationResult.quarterlyInterestPayout * 4)} / yr
                  </p>
                </div>
              </div>

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.depositAmount}
                interest={calculationResult.totalInterestReceived}
                total={calculationResult.totalRepaidAmount}
                title={isHindi ? 'वरिष्ठ नागरिक बचत योजना विभाजन' : 'SCSS Cashflow Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'जमा राशि धारा 80C के तहत ₹1.5 लाख तक कर छूट हेतु पात्र है। त्रैमासिक ब्याज कर योग्य है। धारा 194A के तहत वरिष्ठ नागरिकों हेतु टीडीएस सीमा ₹1,00,000 (बजट 2025 संशोधन) है।'
                    : 'Deposit qualifies for Section 80C tax deduction up to ₹1.5 Lakh. Quarterly interest is taxable. TDS is deducted if total interest exceeds ₹1,00,000 per financial year under Section 194A (Budget 2025).'
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
