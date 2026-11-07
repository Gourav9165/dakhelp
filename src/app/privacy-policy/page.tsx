'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPolicyPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Badge variant="primary" size="md" className="mb-2">
          {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
          {isHindi ? 'डाक हेल्प गोपनीयता नीति' : 'Dak Help Privacy Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          {isHindi ? 'अंतिम अद्यतन: 1 नवंबर 2026' : 'Last Updated: 1 November 2026'}
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--postal-green)]" />
            <span>{isHindi ? '1. स्थानीय एवं क्लाइंट-साइड गणना' : '1. Local & Client-Side Execution'}</span>
          </h2>
          <p>
            {isHindi
              ? 'डाक हेल्प में आपके द्वारा दर्ज किए गए सभी वित्तीय आंकड़े (जैसे जमा राशि, ब्याज दरें, तिथियां) केवल आपके स्थानीय वेब ब्राउज़र में प्रोसेस होते हैं। यह डेटा कभी भी किसी बाहरी सर्वर पर अपलोड या संग्रहीत नहीं किया जाता है।'
              : 'All calculation inputs entered into Dak Help (such as deposit amounts, interest rates, and dates) are executed solely in your local web browser. This financial data is never sent to, collected by, or stored on any external server.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[var(--postal-red)]" />
            <span>{isHindi ? '2. कोई व्यक्तिगत वित्तीय डेटा संग्रह नहीं' : '2. No Personal Financial Data Collection'}</span>
          </h2>
          <p>
            {isHindi
              ? 'हम आपका नाम, फ़ोन नंबर, आधार संख्या, पैन संख्या या बैंक/डाकघर खाता विवरण कभी नहीं मांगते और न ही इसे एकत्रित करते हैं।'
              : 'We do not ask for, collect, or store any personally identifiable information, Aadhaar numbers, PAN cards, or Post Office bank account numbers.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>{isHindi ? '3. स्थानीय प्राथमिकताएं (कुकीज एवं लोकल स्टोरेज)' : '3. Local Storage Preferences'}</span>
          </h2>
          <p>
            {isHindi
              ? 'वेबसाइट केवल आपकी भाषा पसंद (हिंदी/अंग्रेजी) और डार्क/लाइट थीम को याद रखने के लिए आपके ब्राउज़र के लोकल स्टोरेज (localStorage) का उपयोग करती है।'
              : 'The website uses browser local storage exclusively to persist your display preferences: UI theme mode (light/dark/system) and language choice (English/Hindi).'}
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <p>
          {isHindi
            ? 'गोपनीयता नीति संबंधी किसी भी प्रश्न के लिए कृपया हमारे अस्वीकरण पृष्ठ को पढ़ें।'
            : 'For inquiries regarding this privacy policy, please review our Disclaimer and About pages.'}
        </p>
      </div>
    </div>
  );
}
