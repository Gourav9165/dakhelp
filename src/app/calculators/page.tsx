'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Search,
  ArrowRight,
  TrendingUp,
  Percent,
  Scale,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeDefinitions, SchemeCategories, SchemeId, SchemeCategoryId } from '@/data/models/scheme-type';
import { SchemeMetadataRegistry } from '@/data/models/scheme-metadata';
import { InterestRateRepository } from '@/data/repositories/interest-rate-repository';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CalculatorsHubPage() {
  const { isHindi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const schemesList = useMemo(() => {
    return Object.values(SchemeDefinitions).map((def) => {
      const meta = SchemeMetadataRegistry[def.id];
      const rate =
        def.id === 'td'
          ? `${InterestRateRepository.getLatestRate('td1')}% - ${InterestRateRepository.getLatestRate('td5')}%`
          : `${InterestRateRepository.getLatestRate(def.id as any)}%`;

      return {
        ...def,
        meta,
        rate,
      };
    });
  }, []);

  const filteredSchemes = useMemo(() => {
    return schemesList.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.category.id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.shortName.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.fullNameHi.toLowerCase().includes(q) ||
        s.category.displayName.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [schemesList, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          {isHindi ? 'होम' : 'Home'}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">
          {isHindi ? 'कैलकुलेटर' : 'Calculators'}
        </span>
      </nav>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--surface-container-high)] via-[var(--surface-container)] to-[var(--surface-container-low)] border border-[var(--border-subtle)] p-6 sm:p-10 mb-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <Badge variant="primary" size="md">
            {isHindi ? '9 आधिकारिक डाकघर कैलकुलेटर' : '9 Official Post Office Calculators'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {isHindi
              ? 'डाकघर बचत योजना कैलकुलेटर हब'
              : 'Post Office Savings & Interest Calculator Suite'}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {isHindi
              ? 'भारत सरकार के वित्त मंत्रालय एवं डाक विभाग के नवीनतम नियमों पर आधारित 100% सटीक वित्तीय कैलकुलेटर। परिपक्वता, ब्याज, त्रैमासिक एवं मासिक आय की तुरंत गणना करें।'
              : 'Official-grade calculation suite engineered with 100% mathematical parity to Indian Small Savings rules. Explore maturity projections, compounding schedules, and tax benefits.'}
          </p>

          {/* Quick Tools Jump */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/compare">
              <Button variant="secondary" size="sm">
                <Scale className="w-4 h-4 mr-1.5" />
                {isHindi ? 'योजना तुलना टूल' : 'Compare Schemes Tool'}
              </Button>
            </Link>
            <Link href="/interest-calculator">
              <Button variant="outline" size="sm">
                <Percent className="w-4 h-4 mr-1.5" />
                {isHindi ? 'कस्टम ब्याज कैलकुलेटर' : 'Custom Interest Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--postal-red)] text-white shadow-xs'
                  : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:bg-[var(--surface-container-high)] border border-[var(--border-subtle)]'
              }`}
            >
              {isHindi ? 'सभी योजनाएं (9)' : 'All Schemes (9)'}
            </button>
            {Object.values(SchemeCategories).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--postal-red)] text-white shadow-xs'
                    : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:bg-[var(--surface-container-high)] border border-[var(--border-subtle)]'
                }`}
              >
                {isHindi ? cat.displayNameHi : cat.displayName}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="text"
              placeholder={isHindi ? 'योजना खोजें...' : 'Search calculators...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-primary)] outline-none focus:border-[var(--postal-red)] focus:ring-1 focus:ring-[var(--postal-red)]"
            />
          </div>
        </div>
      </div>

      {/* Grid of 9 Calculators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] hover:border-[var(--postal-red)]/40 transition-all duration-200 p-6 flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              {/* Top Row: ShortName & Rate */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base text-white shadow-xs"
                  style={{ backgroundColor: scheme.color }}
                >
                  {scheme.shortName}
                </span>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)] block">
                    {isHindi ? 'वर्तमान दर' : 'Current Rate'}
                  </span>
                  <span className="text-lg font-black text-[var(--postal-green)]">
                    {scheme.rate}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors mb-1">
                {isHindi ? scheme.fullNameHi : scheme.fullName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                {isHindi ? scheme.category.displayNameHi : scheme.category.displayName} • {isHindi ? scheme.meta.tenureDescriptionHi : scheme.meta.tenureDescription}
              </p>

              {/* Features Pill */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)] mb-5">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Calendar className="w-3.5 h-3.5 text-[var(--postal-green)] shrink-0" />
                  <span className="truncate">
                    {isHindi ? scheme.meta.compoundingFrequencyHi : scheme.meta.compoundingFrequency}
                  </span>
                </div>
                {scheme.meta.taxBenefitSection && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--postal-amber)] shrink-0" />
                    <span className="font-medium text-[var(--text-primary)] truncate">
                      {isHindi ? scheme.meta.taxBenefitSectionHi : scheme.meta.taxBenefitSection}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Link href={`/calculators/${scheme.calculatorSlug}`} className="flex-1">
                <Button variant="primary" size="sm" fullWidth>
                  <Calculator className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'कैलकुलेटर खोलें' : 'Calculate'}
                </Button>
              </Link>
              <Link href={`/schemes/${scheme.slug}`}>
                <Button variant="outline" size="sm">
                  {isHindi ? 'नियम' : 'Guide'}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)]">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">
            {isHindi ? 'कोई कैलकुलेटर नहीं मिला।' : 'No calculators matched your search.'}
          </p>
        </div>
      )}
    </div>
  );
}
