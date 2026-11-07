'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  Download,
  Info,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeId, SchemeDefinitions } from '@/data/models/scheme-type';
import { schemeComparisonService, SchemeComparisonCardData } from '@/services/comparison/scheme-comparison-service';
import { AppFormatters } from '@/core/formatters/currency-formatter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/calculators/metric-card';
import { ScheduleTable } from '@/components/calculators/schedule-table';
import { PdfGeneratorService } from '@/services/pdf/pdf-generator';

const PRESETS = [
  { label: '₹1,00,000', value: 100000 },
  { label: '₹2,50,000', value: 250000 },
  { label: '₹5,00,000', value: 500000 },
  { label: '₹10,00,000', value: 1000000 },
  { label: '₹15,00,000', value: 1500000 },
];

export default function SchemeComparisonPage() {
  const { isHindi } = useLanguage();

  const [selectedSchemes, setSelectedSchemes] = useState<SchemeId[]>(['mis', 'td', 'scss']);
  const [budget, setBudget] = useState<number>(500000);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const toggleScheme = (id: SchemeId) => {
    if (selectedSchemes.includes(id)) {
      if (selectedSchemes.length > 2) {
        setSelectedSchemes(selectedSchemes.filter((s) => s !== id));
      }
    } else {
      if (selectedSchemes.length < 3) {
        setSelectedSchemes([...selectedSchemes, id]);
      } else {
        // Replace the last one
        setSelectedSchemes([selectedSchemes[0], selectedSchemes[1], id]);
      }
    }
  };

  const comparisonResult = useMemo(() => {
    try {
      return schemeComparisonService.compare({
        selectedSchemes,
        budget,
        comparisonTenureYears: tenureYears,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [selectedSchemes, budget, tenureYears]);

  const handleDownloadPdf = async () => {
    if (!comparisonResult) return;

    await PdfGeneratorService.generateComparisonReport({
      title: 'Post Office Schemes Side-by-Side Comparison',
      columns: comparisonResult.schemes.map((c) => ({
        schemeName: c.schemeName,
        schemeType: SchemeDefinitions[c.schemeId].shortName,
        rate: `${c.applicableRate}% p.a.`,
        totalDeposit: AppFormatters.formatCurrency(c.totalInvested),
        totalInterest: AppFormatters.formatCurrency(c.totalInterestEarned),
        maturityAmount: AppFormatters.formatCurrency(c.maturityAmount),
        periodicPayout: c.periodicPayoutAmount
          ? `${AppFormatters.formatCurrency(c.periodicPayoutAmount)} (${c.payoutFrequency})`
          : undefined,
        taxStatus: c.taxTreatment,
        riskProfile: 'Sovereign Guarantee (Govt of India)',
      })),
      assumptions: comparisonResult.guidanceNotes,
      isHindi,
    });
  };

  // Chart data
  const chartData = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.schemes.map((c) => ({
      name: SchemeDefinitions[c.schemeId].shortName,
      principal: c.totalInvested,
      interest: c.totalInterestEarned,
      total: c.maturityAmount,
    }));
  }, [comparisonResult]);

  const tableColumns = [
    {
      key: 'attribute',
      header: isHindi ? 'योजना विशेषता' : 'Comparison Attribute',
      className: 'font-bold text-[var(--text-primary)] w-48',
    },
    ...selectedSchemes.map((id) => {
      const def = SchemeDefinitions[id];
      return {
        key: id,
        header: `${def.shortName} (${def.category.displayName})`,
        align: 'right' as const,
        className: 'font-semibold',
      };
    }),
  ];

  const tableRows = useMemo(() => {
    if (!comparisonResult) return [];

    const getVal = (fn: (c: SchemeComparisonCardData) => React.ReactNode) => {
      const row: Record<string, React.ReactNode> = {};
      comparisonResult.schemes.forEach((c) => {
        row[c.schemeId] = fn(c);
      });
      return row;
    };

    return [
      {
        attribute: isHindi ? 'लागू ब्याज दर' : 'Interest Rate',
        ...getVal((c) => (
          <span className="font-extrabold text-[var(--postal-green)]">
            {c.applicableRate}% p.a.
          </span>
        )),
      },
      {
        attribute: isHindi ? 'निवेश का प्रारूप' : 'Deposit Pattern',
        ...getVal((c) => c.depositPattern),
      },
      {
        attribute: isHindi ? 'तुलना कार्यकाल' : 'Tenure Horizon',
        ...getVal((c) => c.tenureLabel),
      },
      {
        attribute: isHindi ? 'कुल निवेशित पूंजी' : 'Total Capital Invested',
        ...getVal((c) => AppFormatters.formatCurrency(c.totalInvested)),
      },
      {
        attribute: isHindi ? 'कुल अर्जित ब्याज' : 'Total Interest Earned',
        ...getVal((c) => (
          <span className="font-bold text-[var(--postal-green)]">
            +{AppFormatters.formatCurrency(c.totalInterestEarned)}
          </span>
        )),
      },
      {
        attribute: isHindi ? 'परिपक्वता / कुल प्रतिफल' : 'Maturity / Total Value',
        ...getVal((c) => (
          <span className="font-extrabold text-[var(--postal-red)]">
            {AppFormatters.formatCurrency(c.maturityAmount)}
          </span>
        )),
      },
      {
        attribute: isHindi ? 'ब्याज भुगतान की आवृत्ति' : 'Payout Frequency',
        ...getVal((c) => (
          <div>
            <span className="block font-semibold">{c.payoutFrequency}</span>
            {c.periodicPayoutAmount ? (
              <span className="text-xs text-[var(--postal-green)] font-bold">
                {AppFormatters.formatCurrency(c.periodicPayoutAmount)}
              </span>
            ) : null}
          </div>
        )),
      },
      {
        attribute: isHindi ? 'आयकर छूट (80C)' : 'Tax Status (Sec 80C)',
        ...getVal((c) => (
          <span className={c.is80cEligible ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-[var(--text-secondary)]'}>
            {c.is80cEligible ? 'Eligible' : 'Not Eligible'}
          </span>
        )),
      },
      {
        attribute: isHindi ? 'निकासी एवं समय पूर्व शर्तें' : 'Withdrawal Conditions',
        ...getVal((c) => (
          <span className="text-xs text-[var(--text-secondary)] block max-w-xs text-right ml-auto">
            {c.withdrawalConditions}
          </span>
        )),
      },
    ];
  }, [comparisonResult, isHindi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">
          {isHindi ? 'योजना तुलना' : 'Scheme Comparison'}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-10 h-10 rounded-xl bg-[var(--primary-container)] text-[var(--postal-red)] flex items-center justify-center font-bold text-base">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                {isHindi
                  ? 'डाकघर बचत योजना तुलना टूल'
                  : 'Post Office Schemes Comparison Tool'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {isHindi
                  ? 'किसी भी 2 या 3 योजनाओं के ब्याज, प्रतिफल, नकदी प्रवाह और नियमों की निष्पक्ष तुलना करें'
                  : 'Fair side-by-side comparison of 2 or 3 Post Office schemes on returns, cash flows, and tax treatment'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleDownloadPdf}
            disabled={!comparisonResult}
          >
            <Download className="w-4 h-4 mr-1.5" />
            {isHindi ? 'तुलना रिपोर्ट डाउनलोड करें' : 'Export Comparison PDF'}
          </Button>
        </div>
      </div>

      {/* Scheme Selector Chips */}
      <div className="mb-8 p-6 rounded-3xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {isHindi ? 'तुलना के लिए 2 या 3 योजनाएं चुनें:' : 'Select 2 or 3 Schemes to Compare:'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {isHindi ? `वर्तमान में चयनित: ${selectedSchemes.length} योजनाएं` : `Currently comparing ${selectedSchemes.length} schemes`}
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--postal-red)]">
            {selectedSchemes.length === 3 ? (isHindi ? 'अधिकतम 3 चयनित' : 'Max 3 selected') : (isHindi ? '1 और चुन सकते हैं' : 'Select 1 more')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {Object.values(SchemeDefinitions).map((def) => {
            const isSelected = selectedSchemes.includes(def.id);
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => toggleScheme(def.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[var(--postal-red)] text-white border-[var(--postal-red)] shadow-sm'
                    : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="font-black text-sm">{def.shortName}</span>
                <span className="text-[10px] leading-tight truncate max-w-[90px] opacity-90">
                  {def.category.displayName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Investment Budget & Tenure Inputs */}
        <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <Input
              label={isHindi ? 'तुलना निवेश बजट' : 'Comparison Investment Budget'}
              type="number"
              prefixText="₹"
              min={1000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              presets={PRESETS}
              onPresetSelect={(val) => setBudget(val)}
              helperText={
                isHindi
                  ? 'यह बजट एकमुश्त योजनाओं में कुल जमा और आरडी में 60 किस्तों में विभाजित माना जाएगा'
                  : 'Modeled as lump-sum for fixed schemes, or divided into 60 installments for RD'
              }
            />
          </div>
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              {isHindi ? 'तुलना अवधि' : 'Comparison Horizon'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 5, 15].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    tenureYears === yr
                      ? 'bg-[var(--postal-green)] text-white border-[var(--postal-green)]'
                      : 'bg-[var(--surface-container)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)]'
                  }`}
                >
                  {yr} {isHindi ? 'वर्ष' : 'Yrs'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {comparisonResult && (
        <div className="space-y-10">
          {/* Side-by-Side Highlight Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-${selectedSchemes.length} gap-6`}>
            {comparisonResult.schemes.map((card) => {
              const def = SchemeDefinitions[card.schemeId];
              return (
                <div
                  key={card.schemeId}
                  className="rounded-3xl p-6 border border-[var(--border-subtle)] bg-[var(--surface-container-low)] flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-xs"
                        style={{ backgroundColor: def.color }}
                      >
                        {def.shortName}
                      </span>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">
                          {isHindi ? 'लागू दर' : 'Applicable Rate'}
                        </span>
                        <span className="text-xl font-black text-[var(--postal-green)]">
                          {card.applicableRate}% p.a.
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      {isHindi ? card.schemeNameHi : card.schemeName}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-6">
                      {card.depositPattern} • {card.tenureLabel}
                    </p>

                    {/* Metrics Stack */}
                    <div className="space-y-3 p-4 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)] font-medium">
                          {isHindi ? 'कुल जमा (मूलधन):' : 'Total Deposited:'}
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {AppFormatters.formatCurrency(card.totalInvested)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)] font-medium">
                          {isHindi ? 'कुल अर्जित ब्याज:' : 'Interest Earned:'}
                        </span>
                        <span className="font-extrabold text-[var(--postal-green)]">
                          +{AppFormatters.formatCurrency(card.totalInterestEarned)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
                        <span className="text-[var(--text-secondary)] font-bold">
                          {isHindi ? 'कुल प्रतिफल / परिपक्वता:' : 'Total Maturity Value:'}
                        </span>
                        <span className="text-base font-black text-[var(--postal-red)]">
                          {AppFormatters.formatCurrency(card.maturityAmount)}
                        </span>
                      </div>
                      {card.periodicPayoutAmount ? (
                        <div className="flex items-center justify-between text-[11px] pt-1 text-amber-700 dark:text-amber-400 font-semibold">
                          <span>{isHindi ? 'नियमित भुगतान:' : 'Regular Payout:'}</span>
                          <span>{AppFormatters.formatCurrency(card.periodicPayoutAmount)} ({card.payoutFrequency})</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <Link href={`/calculators/${def.calculatorSlug}`}>
                    <Button variant="outline" size="sm" fullWidth>
                      {isHindi ? `${def.shortName} कैलकुलेटर खोलें` : `Open ${def.shortName} Calculator`}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Comparative Bar Chart */}
          <div className="rounded-3xl p-6 border border-[var(--border-subtle)] bg-[var(--surface-container-low)]">
            <h4 className="text-base font-bold text-[var(--text-primary)] mb-2">
              {isHindi ? 'प्रतिफल तुलना चार्ट (मूलधन बनाम अर्जित ब्याज)' : 'Comparative Returns Chart (Principal vs Interest)'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              {isHindi
                ? 'समान बजट के आधार पर योजनाओं के कुल प्रतिफल एवं ब्याज का दृश्य तुलनात्मक अध्ययन'
                : 'Visual comparison of capital return and total interest earned across selected schemes'}
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis
                    stroke="var(--text-secondary)"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: unknown) => [AppFormatters.formatCurrency(Number(val) || 0), '']}
                    contentStyle={{
                      backgroundColor: 'var(--surface-container-highest)',
                      borderColor: 'var(--border-subtle)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="principal"
                    name={isHindi ? 'मूलधन (जमा)' : 'Principal Invested'}
                    fill="#245B50"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="interest"
                    name={isHindi ? 'कुल ब्याज' : 'Total Interest'}
                    fill="#D85B48"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comprehensive Side-by-Side Comparison Table */}
          <ScheduleTable
            title={isHindi ? 'विस्तृत साइड-बाय-साइड तुलना तालिका' : 'Comprehensive Side-by-Side Comparison Table'}
            description={
              isHindi
                ? 'नियम, भुगतान, कर-छूट एवं समय पूर्व निकासी शर्तों का संपूर्ण विवरण'
                : 'Detailed attribute breakdown including payout mechanics, Section 80C, and lock-in terms'
            }
            columns={tableColumns}
            data={tableRows}
          />

          {/* Important Comparison Guidance Notes */}
          <div className="p-6 rounded-3xl bg-[var(--disclaimer-bg)] border border-[var(--disclaimer-border)] space-y-3">
            <h4 className="font-bold text-sm text-[var(--disclaimer-text)] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>{isHindi ? 'महत्वपूर्ण तुलना मार्गदर्शन एवं नियम:' : 'Essential Comparison Guidance & Methodology Notes:'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-[var(--disclaimer-text)] leading-relaxed">
              {comparisonResult.guidanceNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
