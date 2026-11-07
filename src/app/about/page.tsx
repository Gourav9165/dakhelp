'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Award, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto mb-2">
          <Image
            src="/branding/dak_help_logo.png"
            alt="Dak Help Logo"
            fill
            className="object-contain"
          />
        </div>
        <Badge variant="primary" size="md">
          {isHindi ? 'हमारे बारे में' : 'About Dak Help'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
          {isHindi
            ? 'डाक हेल्प : आपका विश्वसनीय डाकघर बचत साथी'
            : 'Dak Help : Your Post Office Savings Companion'}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          {isHindi
            ? 'डाक हेल्प एक स्वतंत्र वित्तीय शैक्षिक उपयोगिता (Financial Utility) है, जिसे भारत के लाखों डाकघर बचत निवेशकों को सटीक, पारदर्शी और समझने योग्य गणनाएं प्रदान करने हेतु निर्मित किया गया है।'
            : 'Dak Help is an independent, specialized financial calculation utility built to provide accurate, transparent, and regulatory-aligned calculations for Indian Post Office small savings schemes.'}
        </p>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
          {isHindi ? 'हमारे मार्गदर्शक सिद्धांत' : 'Our Guiding Principles'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2">
            <CheckCircle2 className="w-6 h-6 text-[var(--postal-green)]" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              {isHindi ? 'गणितीय शुद्धता (Mathematical Parity)' : 'Absolute Mathematical Parity'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isHindi
                ? 'हम वित्तीय परिणामों में कभी भी अनुमान नहीं लगाते। हमारी गणनाएं डाक विभाग और वित्त मंत्रालय के नियमों पर 100% आधारित हैं।'
                : 'We never approximate. Every calculation engine implements exact official compounding intervals, rounding rules, and statutory formulas.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[var(--postal-red)]" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              {isHindi ? 'पूर्ण गोपनीयता (Privacy First)' : 'Complete User Privacy'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isHindi
                ? 'डाक हेल्प कोई व्यक्तिगत वित्तीय डेटा, बैंक खाता विवरण या व्यक्तिगत जानकारी संग्रहीत नहीं करता। सभी गणनाएं आपके ब्राउज़र में निष्पादित होती हैं।'
                : 'Dak Help operates entirely client-side. We do not store or transmit your financial inputs, balances, or private calculations.'}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="p-6 rounded-3xl bg-[var(--disclaimer-bg)] border border-[var(--disclaimer-border)] space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-sm text-[var(--disclaimer-text)]">
            {isHindi ? 'स्वतंत्र शैक्षिक उपकरण (Non-Government Disclaimer)' : 'Independent Platform Notice'}
          </h3>
        </div>
        <p className="text-xs text-[var(--disclaimer-text)] leading-relaxed">
          {isHindi
            ? 'डाक हेल्प एक स्वतंत्र शैक्षणिक मंच है। यह भारतीय डाक विभाग (India Post), संचार मंत्रालय या भारत सरकार से संबद्ध, अधिकृत या प्रायोजित नहीं है। आधिकारिक लेन-देन या औपचारिक निवेश के लिए हमेशा निकटतम डाकघर से संपर्क करें।'
            : 'Dak Help is an independent educational platform. It is not affiliated with, endorsed by, or authorized by the Department of Posts (India Post), the Ministry of Communications, or the Government of India. For binding financial advice or account opening, please consult your local Post Office branch.'}
        </p>
      </div>

      {/* Navigation Jumps */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
        <Link href="/calculators">
          <Button variant="primary" size="md">
            {isHindi ? 'कैलकुलेटर प्रारंभ करें' : 'Explore Calculators'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link href="/disclaimer">
          <Button variant="outline" size="md">
            {isHindi ? 'अस्वीकरण पढ़ें' : 'View Full Disclaimer'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
