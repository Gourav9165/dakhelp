'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';

interface AssumptionsBoxProps {
  assumptions: string[];
  disclaimer?: string;
  taxSection?: string;
  defaultExpanded?: boolean;
}

export function AssumptionsBox({
  assumptions,
  disclaimer,
  taxSection,
  defaultExpanded = true,
}: AssumptionsBoxProps) {
  const { isHindi } = useLanguage();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {isHindi
                ? 'आधिकारिक गणना नियम एवं विनियामक शर्तें'
                : 'Official Rules, Assumptions & Disclosures'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {isHindi
                ? 'डाक विभाग एवं वित्त मंत्रालय के आधिकारिक नियमों पर आधारित'
                : 'Based on official Department of Posts & Ministry of Finance rules'}
            </p>
          </div>
        </div>
        <div className="text-[var(--text-secondary)]">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Assumptions Bullet Points */}
          <div className="space-y-2">
            <h5 className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--postal-green)]" />
              <span>{isHindi ? 'योजना के प्रमुख नियम:' : 'Key Scheme Rules & Assumptions:'}</span>
            </h5>
            <ul className="space-y-1.5 pl-2">
              {assumptions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[var(--text-secondary)] leading-relaxed"
                >
                  <span className="text-[var(--postal-red)] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {taxSection && (
            <div className="p-3 rounded-xl bg-[var(--secondary-container)]/40 border border-[var(--postal-green)]/20 text-[var(--on-secondary-container)] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--postal-green)] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider">
                  {isHindi ? 'आयकर नियम (Tax Treatment)' : 'Tax Treatment'}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed">{taxSection}</p>
              </div>
            </div>
          )}

          {/* Independent Disclaimer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-start gap-2 text-xs text-[var(--text-secondary)]">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {disclaimer ||
                (isHindi
                  ? 'अस्वीकरण: डाक हेल्प एक स्वतंत्र वित्तीय शैक्षिक उपकरण है। यह डाक विभाग (इंडिया पोस्ट) या भारत सरकार का आधिकारिक ऐप नहीं है। सटीक वित्तीय सलाह एवं नियम सत्यापन के लिए कृपया अपने नजदीकी डाकघर से संपर्क करें।'
                  : 'Disclaimer: Dak Help is an independent educational financial utility and is not affiliated with the Department of Posts (India Post) or the Government of India. For binding financial advice and verification, please visit your nearest post office.')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
