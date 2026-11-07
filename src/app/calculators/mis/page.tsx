'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download,
  Info,
  RefreshCw,
  Users,
  User,
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
import { ReturnBreakdownChart } from '@/components/calculators/return-breakdown-chart';
import { AssumptionsBox } from '@/components/calculators/assumptions-box';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

export default function MisCalculatorPage() {
  const { isHindi } = useLanguage();
  const currentRate = InterestRateRepository.getLatestRate('mis');

  const [depositAmount, setDepositAmount] = useState<number>(450000);
  const [accountType, setAccountType] = useState<'single' | 'joint'>('single');
  const [error, setError] = useState<string | null>(null);

  const maxLimit = accountType === 'single' ? 900000 : 1500000;

  const presets = useMemo(() => {
    if (accountType === 'single') {
      return [
        { label: '₹1,00,000', value: 100000 },
        { label: '₹2,50,000', value: 250000 },
        { label: '₹4,50,000', value: 450000 },
        { label: '₹7,00,000', value: 700000 },
        { label: '₹9,00,000 (Max)', value: 900000 },
      ];
    }
    return [
      { label: '₹2,00,000', value: 200000 },
      { label: '₹5,00,000', value: 500000 },
      { label: '₹9,00,000', value: 900000 },
      { label: '₹12,00,000', value: 1200000 },
      { label: '₹15,00,000 (Max)', value: 1500000 },
    ];
  }, [accountType]);

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
    if (depositAmount > maxLimit) {
      setError(
        isHindi
          ? `${accountType === 'single' ? 'एकल' : 'संयुक्त'} खाते की अधिकतम सीमा ${AppFormatters.formatCurrency(maxLimit)} है`
          : `Maximum deposit limit for ${accountType} account is ${AppFormatters.formatCurrency(maxLimit)}`
      );
      return null;
    }
    setError(null);

    return CalculatorFacade.calculateMis({
      depositAmount,
      accountType,
    });
  }, [depositAmount, accountType, maxLimit, isHindi]);

  const handleDownloadPdf = async () => {
    if (!calculationResult) return;

    await PdfGeneratorService.generateSchemeReport({
      schemeType: 'mis',
      schemeFullName: isHindi
        ? 'डाकघर मासिक आय योजना (MIS)'
        : 'Post Office Monthly Income Scheme (MIS)',
      depositAmount: calculationResult.depositAmount,
      annualRate: calculationResult.annualRate,
      maturityAmount: calculationResult.totalRepaidAmount,
      interestEarned: calculationResult.totalInterestReceived,
      tenureYears: 5,
      periodicPayoutText: `${AppFormatters.formatCurrency(calculationResult.monthlyIncome)} per month (60 months)`,
      parameters: {
        'Account Holding Type': accountType === 'single' ? 'Single Account (Max ₹9 Lakh)' : 'Joint Account (Max ₹15 Lakh)',
        'Deposit Principal': AppFormatters.formatCurrency(calculationResult.depositAmount),
        'Monthly Payout': AppFormatters.formatCurrency(calculationResult.monthlyIncome),
        'Total Monthly Installments': '60 Monthly Credits',
        'Annual Interest Rate': `${calculationResult.annualRate}% p.a.`,
        'Maturity Return of Principal': AppFormatters.formatCurrency(calculationResult.depositAmount),
      },
      assumptions: calculationResult.assumptions,
      isHindi,
    });
  };

  const resetForm = () => {
    setDepositAmount(450000);
    setAccountType('single');
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
        <span className="text-[var(--text-primary)] font-semibold">MIS</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-base">
              MIS
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'डाकघर मासिक आय योजना (MIS) कैलकुलेटर'
                  : 'Post Office Monthly Income Scheme (MIS) Calculator'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? 'एकमुश्त जमा पर हर महीने मिलने वाली नियमित ब्याज आय की गणना करें'
                  : 'Calculate monthly regular income payouts and total returns for National Savings MIS'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="amber" size="md">
            {isHindi ? `वर्तमान दर: ${currentRate}%` : `Current Rate: ${currentRate}% p.a.`}
          </Badge>
          <Link href="/schemes/monthly-income-scheme">
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
                {isHindi ? 'मासिक आय निवेश विवरण' : 'MIS Investment Inputs'}
              </CardTitle>
              <CardDescription>
                {isHindi
                  ? 'खाते का प्रकार (एकल / संयुक्त) एवं जमा राशि चुनें'
                  : 'Select account type (Single/Joint) and lump-sum deposit'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Account Type Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  {isHindi ? 'खाता प्रकार (Holding Type)' : 'Account Holding Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('single');
                      if (depositAmount > 900000) setDepositAmount(900000);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
                      accountType === 'single'
                        ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{isHindi ? 'एकल (Single - Max ₹9L)' : 'Single (Max ₹9L)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('joint')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-all ${
                      accountType === 'joint'
                        ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)] shadow-sm'
                        : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{isHindi ? 'संयुक्त (Joint - Max ₹15L)' : 'Joint (Max ₹15L)'}</span>
                  </button>
                </div>
              </div>

              {/* Deposit Amount */}
              <Input
                label={isHindi ? 'एकमुश्त जमा राशि' : 'Lump-sum Deposit'}
                type="number"
                prefixText="₹"
                min={1000}
                max={maxLimit}
                step={1000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                error={error || undefined}
                helperText={
                  isHindi
                    ? `न्यूनतम ₹1,000, अधिकतम ₹${(maxLimit / 100000).toFixed(0)} लाख`
                    : `Min ₹1,000, Max ₹${(maxLimit / 100000).toFixed(0)} Lakh`
                }
                presets={presets}
                onPresetSelect={(val) => setDepositAmount(val)}
              />

              <Slider
                min={1000}
                max={maxLimit}
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
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {calculationResult ? (
            <>
              {/* Highlight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label={isHindi ? 'प्रति माह मिलने वाली आय' : 'Monthly Income'}
                  value={AppFormatters.formatCurrency(calculationResult.monthlyIncome)}
                  subtitle={isHindi ? 'हर महीने बैंक/बचत खाते में' : 'Credited every month'}
                  variant="secondary"
                />
                <MetricCard
                  label={isHindi ? 'कुल ब्याज (5 वर्ष)' : 'Total Interest (5 Yrs)'}
                  value={`+${AppFormatters.formatCurrency(calculationResult.totalInterestReceived)}`}
                  subtitle={isHindi ? '60 मासिक किस्तों में' : 'Across 60 monthly credits'}
                  variant="neutral"
                />
                <MetricCard
                  label={isHindi ? 'परिपक्वता पर वापसी' : 'Principal Returned'}
                  value={AppFormatters.formatCurrency(calculationResult.depositAmount)}
                  subtitle={isHindi ? '5 वर्ष पूर्ण होने पर शत-प्रतिशत' : '100% capital returned'}
                  variant="primary"
                />
              </div>

              {/* Payout Summary Card */}
              <div className="p-5 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {isHindi ? 'वार्षिक आय समकक्ष:' : 'Annual Income Equivalent:'}
                  </span>
                  <span className="text-base font-extrabold text-[var(--postal-green)]">
                    {AppFormatters.formatCurrency(calculationResult.monthlyIncome * 12)} / year
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {isHindi ? 'कुल प्राप्त राशि (मूलधन + कुल ब्याज):' : 'Total Cashflow (Capital + All Interest):'}
                  </span>
                  <span className="text-base font-extrabold text-[var(--postal-red)]">
                    {AppFormatters.formatCurrency(calculationResult.totalRepaidAmount)}
                  </span>
                </div>
              </div>

              {/* Breakdown Chart */}
              <ReturnBreakdownChart
                principal={calculationResult.depositAmount}
                interest={calculationResult.totalInterestReceived}
                total={calculationResult.totalRepaidAmount}
                title={isHindi ? 'एमआईएस कुल प्रवाह विभाजन' : 'MIS Total Cashflow Breakdown'}
              />

              {/* Assumptions & Tax Box */}
              <AssumptionsBox
                assumptions={calculationResult.assumptions}
                taxSection={
                  isHindi
                    ? 'एमआईएस का मासिक ब्याज निवेशक के आयकर स्लैब अनुसार कर योग्य है। डाकघर स्रोत पर कोई टीडीएस नहीं काटता, लेकिन निवेशक को आईटीआर में "अन्य स्रोतों से आय" के तहत दिखाना अनिवार्य है।'
                    : 'Monthly interest is taxable as per your income tax slab. No TDS is deducted by Post Office, but must be reported under "Income from Other Sources" in your Income Tax Return.'
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
