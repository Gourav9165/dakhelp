'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
  Wallet,
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
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRESETS = [
  { label: '₹10,000', value: 10000 },
  { label: '₹25,000', value: 25000 },
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹2,50,000', value: 250000 },
];

const MONTH_NAMES = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

export default function SbCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('sb');

  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [quickBalance, setQuickBalance] = useState<number>(50000);
  const [monthlyBalances, setMonthlyBalances] = useState<number[]>(
    Array(12).fill(50000)
  );
  const [error, setError] = useState<string | null>(null);

  const activeBalances = useMemo(() => {
    if (mode === 'quick') {
      return Array(12).fill(quickBalance);
    }
    return monthlyBalances;
  }, [mode, quickBalance, monthlyBalances]);

  const calculationResult = useMemo(() => {
    const hasInvalid = activeBalances.some((b) => b < 0);
    if (hasInvalid) {
      setError(
        isHindi
          ? 'शेष राशि शून्य या अधिक होनी चाहिए'
          : 'Balance must be non-negative'
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateSb({
      monthlyBalances: activeBalances,
    });
  }, [activeBalances, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'sb',
      schemeFullName: isHindi
        ? 'डाकघर बचत खाता (PO Savings Account)'
        : 'Post Office Savings Account (SB)',
      depositAmount: calculationResult.averageMonthlyBalance,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.closingBalanceAtMarch31,
      interestEarned: calculationResult.annualInterestCredited,
      parameters: {
        'Average Monthly Eligible Balance': AppFormatters.formatCurrency(calculationResult.averageMonthlyBalance),
        'Applicable Annual Rate': `${calculationResult.annualRate}% p.a.`,
        'Interest Crediting Date': 'Annually on March 31',
        'Section 80TTA Exemption': 'Up to ₹10,000 Tax-Free (General Citizens)',
        'Section 80TTB Exemption': 'Up to ₹50,000 Tax-Free (Senior Citizens)',
        '10th-to-End Rule': 'Applied strictly across all 12 financial year months',
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const updateMonthBalance = (idx: number, val: number) => {
    const updated = [...monthlyBalances];
    updated[idx] = val;
    setMonthlyBalances(updated);
  };

  const resetForm = () => {
    setQuickBalance(50000);
    setMonthlyBalances(Array(12).fill(50000));
    setMode('quick');
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
        <span className="text-[var(--text-primary)] font-semibold">SB</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-base">
              SB
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'डाकघर बचत खाता (SB) कैलकुलेटर'
                  : 'Post Office Savings Account (SB) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? '10वीं तारीख से माह के अंत तक न्यूनतम शेष एवं 31 मार्च वार्षिक ब्याज की सटीक गणना'
                  : 'Calculate annual March 31 interest using official 10th-to-month-end minimum balance rule'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}%` : `Current Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/savings-bank-account">
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
                {isHindi ? 'बचत खाता शेष विवरण' : 'Savings Account Balance'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'औसत मासिक शेष या प्रत्येक माह का न्यूनतम शेष चुनें'
                  : 'Calculate by uniform average balance or month-by-month balances'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('quick')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    mode === 'quick'
                      ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)]'
                      : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                  }`}
                >
                  {isHindi ? 'त्वरित औसत शेष' : 'Quick Average'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('detailed')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    mode === 'detailed'
                      ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)]'
                      : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                  }`}
                >
                  {isHindi ? 'माह-वार न्यूनतम शेष' : 'Month-by-Month'}
                </button>
              </div>

              {mode === 'quick' ? (
                <>
                  <Input
                    label={isHindi ? 'औसत न्यूनतम मासिक शेष' : 'Average Monthly Minimum Balance'}
                    type="number"
                    prefixText="₹"
                    min={500}
                    step={100}
                    value={quickBalance}
                    onChange={(e) => setQuickBalance(Number(e.target.value) || 0)}
                    error={error || undefined}
                    helperText={
                      isHindi
                        ? '10वीं से माह के अंत के बीच औसत शेष (न्यूनतम ₹500)'
                        : 'Lowest balance between 10th and month-end (Min ₹500)'
                    }
                    presets={PRESETS}
                    onPresetSelect={(val) => setQuickBalance(val)}
                  />

                  <Slider
                    min={500}
                    max={500000}
                    step={500}
                    value={quickBalance}
                    onChange={(val) => setQuickBalance(val)}
                    label={isHindi ? 'राशि स्लाइडर' : 'Quick Adjust'}
                    displayValue={AppFormatters.formatCurrency(quickBalance)}
                  />
                </>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <p className="text-xs text-[var(--text-secondary)]">
                    {isHindi
                      ? 'प्रत्येक माह की 10वीं तारीख से अंतिम दिन के बीच का न्यूनतम शेष दर्ज करें:'
                      : 'Enter lowest balance between 10th and month-end for each month:'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {MONTH_NAMES.map((m, idx) => (
                      <div key={m} className="space-y-1">
                        <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                          {m}
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={monthlyBalances[idx]}
                          onChange={(e) => updateMonthBalance(idx, Number(e.target.value) || 0)}
                          className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-container-lowest)] text-[var(--text-primary)] outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

          {/* Section 80TTA Benefit */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 text-xs text-teal-950 dark:text-teal-200">
            <h5 className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{isHindi ? 'धारा 80TTA एवं 80TTB कर लाभ:' : 'Section 80TTA / 80TTB Tax Exemption:'}</span>
            </h5>
            <ul className="space-y-1 text-[11px] leading-relaxed">
              <li>• {isHindi ? 'सामान्य नागरिक: धारा 80TTA के तहत ₹10,000 तक बचत ब्याज पूर्णतः कर-मुक्त' : 'General Citizens: Up to ₹10,000 savings interest is tax-free under Section 80TTA'}</li>
              <li>• {isHindi ? 'वरिष्ठ नागरिक: धारा 80TTB के तहत ₹50,000 तक जमा ब्याज कर-मुक्त' : 'Senior Citizens: Up to ₹50,000 interest is tax-free under Section 80TTB'}</li>
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
                  label={isHindi ? 'औसत पात्र शेष' : 'Average Balance'}
                  value={AppFormatters.formatCurrency(calculationResult.averageMonthlyBalance)}
                  subtitle={isHindi ? '10वीं से माह-अंत न्यूनतम' : '10th to month-end rule'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? '31 मार्च को वार्षिक ब्याज' : 'Annual Interest Credit'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.annualInterestCredited)}`}
                  subtitle={isHindi ? '4.0% प्रतिवर्ष साधारण ब्याज' : '4.0% p.a. credited annually'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? '31 मार्च को अंतिम शेष' : 'Year-End Balance'}
                  value={AppFormatters.formatCurrency(calculationResult.closingBalanceAtMarch31)}
                  subtitle={isHindi ? 'मूलधन + वार्षिक ब्याज' : 'Principal + Interest added'}
                  variant="primary"
                />
              </div>

              {/* 10th to End Rule Note */}
              <div className="p-4 rounded-xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <h5 className="font-bold text-[var(--text-primary)]">
                  {isHindi ? '10वीं तारीख से माह के अंत तक नियम (10th-to-End Rule):' : 'The Official 10th-to-Month-End Rule Explained:'}
                </h5>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {isHindi
                    ? 'डाकघर बचत बैंक नियमों के अनुसार, ब्याज की गणना किसी भी माह में केवल उस न्यूनतम शेष पर की जाती है जो माह की 10वीं तारीख से अंतिम दिन के बीच खाते में लगातार बना रहता है। यदि किसी माह में शेष ₹500 से कम हो जाता है, तो उस पूरे माह का ब्याज शून्य हो जाता है।'
                    : 'Under PO Savings Bank rules, interest for any month is calculated solely on the lowest balance maintained between the close of the 10th day and the end of the month. If the balance falls below ₹500 at any point during this window, no interest is credited for that entire month.'}
                </p>
              </div>

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'बचत खाते का ब्याज आयकर अधिनियम की धारा 80TTA के तहत ₹10,000 प्रति वर्ष तक कर-मुक्त है (वरिष्ठ नागरिकों हेतु धारा 80TTB के तहत ₹50,000)। सीमा से अधिक ब्याज कर योग्य है। कोई टीडीएस नहीं काटा जाता।'
                    : 'Savings interest is tax-exempt up to ₹10,000 per financial year under Section 80TTA (up to ₹50,000 for Senior Citizens under Section 80TTB). Any interest beyond this threshold is taxable. No TDS is deducted by Post Office.'
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
