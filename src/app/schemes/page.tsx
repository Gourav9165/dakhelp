'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { SchemeDefinitions, SchemeCategories, SchemeId } from '@/data/models/scheme-type';
import { schemesDetailedInfo } from '@/data/schemes-info';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SchemesDirectoryPage() {
  const { isHindi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const schemesList = useMemo(() => {
    return Object.values(schemesDetailedInfo).map((info) => {
      const def = SchemeDefinitions[info.id];
      return {
        ...info,
        def,
      };
    });
  }, []);

  const filteredSchemes = useMemo(() => {
    return schemesList.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.def.category.id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.def.shortName.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.titleHi.toLowerCase().includes(q) ||
        s.def.category.displayName.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q);

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
          {isHindi ? 'योजनाएं' : 'Schemes'}
        </span>
      </nav>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--surface-container-high)] via-[var(--surface-container)] to-[var(--surface-container-low)] border border-[var(--border-subtle)] p-6 sm:p-10 mb-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <Badge variant="primary" size="md">
            {isHindi ? 'आधिकारिक डाकघर बचत योजनाएं' : 'Official Post Office Savings Schemes'}
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            {isHindi
              ? 'डाकघर बचत योजना विवरण एवं आधिकारिक नियम'
              : 'Post Office Small Savings Schemes Guide & Rules'}
          </h1>

          <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {isHindi
              ? 'पात्रता, न्यूनतम एवं अधिकतम जमा सीमा, ब्याज दरें, परिपक्वता अवधि, समय पूर्व निकासी नियम एवं आयकर छूट की प्रमाणित जानकारी।'
              : 'Comprehensive guides, statutory eligibility criteria, deposit limits, tax deductions, and withdrawal rules across all 9 Indian Post Office savings schemes.'}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="text"
              placeholder={isHindi ? 'योजना खोजें...' : 'Search scheme guides...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-primary)] outline-none focus:border-[var(--postal-red)] focus:ring-1 focus:ring-[var(--postal-red)]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] hover:border-[var(--postal-red)]/40 transition-all duration-200 p-6 flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white shadow-xs"
                  style={{ backgroundColor: scheme.def.color }}
                >
                  {scheme.def.shortName}
                </span>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  {scheme.interestDetails.rate}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--postal-red)] transition-colors mb-1">
                {isHindi ? scheme.titleHi : scheme.title}
              </h3>
              <p className="text-xs font-medium text-[var(--postal-red)] mb-3">
                {isHindi ? scheme.taglineHi : scheme.tagline}
              </p>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-5 leading-relaxed">
                {isHindi ? scheme.overviewHi : scheme.overview}
              </p>

              {/* Quick specs */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-[var(--surface-container)] border border-[var(--border-subtle)] text-xs mb-5">
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>{isHindi ? 'जमा सीमा:' : 'Deposit Range:'}</span>
                  <span className="font-semibold text-[var(--text-primary)] truncate max-w-[160px]">
                    {isHindi ? scheme.investmentLimits.minHi : scheme.investmentLimits.min}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>{isHindi ? 'कर लाभ:' : 'Tax Status:'}</span>
                  <span className="font-semibold text-[var(--postal-green)] truncate max-w-[160px]">
                    {isHindi ? scheme.taxTreatment.sectionHi : scheme.taxTreatment.section}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 pt-2">
              <Link href={`/schemes/${scheme.slug}`} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  {isHindi ? 'संपूर्ण नियम' : 'Read Guide'}
                </Button>
              </Link>
              <Link href={`/calculators/${scheme.calculatorSlug}`} className="flex-1">
                <Button variant="primary" size="sm" fullWidth>
                  <Calculator className="w-3.5 h-3.5 mr-1.5" />
                  {isHindi ? 'कैलकुलेटर' : 'Calculate'}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
