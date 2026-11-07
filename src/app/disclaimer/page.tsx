'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ShieldAlert, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DisclaimerPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Badge variant="amber" size="md" className="mb-2">
          {isHindi ? 'कानूनी अस्वीकरण' : 'Regulatory Disclaimer'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
          {isHindi ? 'डाक हेल्प कानूनी अस्वीकरण' : 'Dak Help Independent Legal Disclaimer'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          {isHindi ? 'कृपया वेबसाइट उपयोग से पूर्व इसे ध्यानपूर्वक पढ़ें' : 'Please read this disclaimer carefully before using the utility'}
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        {/* Banner Alert */}
        <div className="p-6 rounded-3xl bg-[var(--disclaimer-bg)] border border-[var(--disclaimer-border)] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <h2 className="font-bold text-sm sm:text-base text-[var(--disclaimer-text)]">
              {isHindi
                ? 'गैर-सरकारी स्वतंत्र शैक्षिक उपयोगिता (Non-Official Disclosure)'
                : 'Independent Educational Platform Notice'}
            </h2>
          </div>
          <p className="text-[var(--disclaimer-text)] leading-relaxed">
            {isHindi
              ? 'डाक हेल्प (Dak Help: PO Interest Calc) एक स्वतंत्र शैक्षिक और वित्तीय गणना मंच है। यह भारतीय डाक विभाग (India Post), डाक परिमंडल, संचार मंत्रालय या भारत सरकार का आधिकारिक अनुप्रयोग या वेबसाइट नहीं है।'
              : 'Dak Help: PO Interest Calc is an independent educational and financial calculation utility. It is NOT an official website, service, or application of the Department of Posts (India Post), the Ministry of Communications, or the Government of India.'}
          </p>
        </div>

        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {isHindi ? '1. शैक्षिक एवं सूचनात्मक उद्देश्य' : '1. Informational & Educational Intent'}
          </h3>
          <p>
            {isHindi
              ? 'इस वेबसाइट पर उपलब्ध सभी कैलकुलेटर, रिपोर्ट, ब्याज दरें एवं तुलनात्मक विवरण केवल वित्तीय साक्षरता, योजना समझ एवं शैक्षिक अनुमान हेतु प्रदान किए गए हैं। इन्हें आधिकारिक वित्तीय, कानूनी या कर सलाह (Tax Advice) न माना जाए।'
              : 'All calculation projections, interest tables, schedules, and comparison metrics are provided solely for financial literacy and educational simulation. They do not constitute certified financial, tax, or legal advice.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {isHindi ? '2. ब्याज दरों में आधिकारिक परिवर्तन' : '2. Statutory Rate Updates'}
          </h3>
          <p>
            {isHindi
              ? 'भारत सरकार का वित्त मंत्रालय प्रत्येक तिमाही में डाकघर लघु बचत योजनाओं की ब्याज दरों की समीक्षा करता है। यद्यपि हम दरों को तुरंत अद्यतन रखने का पूर्ण प्रयास करते हैं, किसी भी बाध्यकारी निवेश से पूर्व अपने नजदीकी डाकघर या आधिकारिक पोर्टल (indiapost.gov.in) पर दरों का सत्यापन करें।'
              : 'Small savings rates are notified quarterly by the Ministry of Finance. While we update our repository immediately following official Gazette releases, users must verify rates with their nearest post office before committing funds.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {isHindi ? '3. दायित्व की सीमा (Limitation of Liability)' : '3. Limitation of Liability'}
          </h3>
          <p>
            {isHindi
              ? 'डाक हेल्प डेवलपर्स या इसके सहयोगी इस मंच पर उपलब्ध गणनाओं के आधार पर किए गए किसी भी वित्तीय निर्णय, प्रत्यक्ष या अप्रत्यक्ष लाभ अथवा हानि के लिए उत्तरदायी नहीं होंगे।'
              : 'The creators of Dak Help shall not be held liable for any financial decisions, losses, or claims arising from reliance on calculations or information presented on this platform.'}
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <Link href="/">
          <Button variant="primary" size="md">
            {isHindi ? 'होम पेज पर लौटें' : 'Back to Home'}
          </Button>
        </Link>
        <a
          href="https://www.indiapost.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
        >
          <span>{isHindi ? 'आधिकारिक इंडिया पोस्ट पोर्टल' : 'Official India Post Portal'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
