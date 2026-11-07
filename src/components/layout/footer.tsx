'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ExternalLink, Calculator, BookOpen, Heart } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { AppConstants } from '@/core/constants/constants';

export function Footer() {
  const { t, isHindi } = useLanguage();

  const schemes = [
    { name: t('schemeRdName'), href: '/calculators/rd' },
    { name: t('schemeTdName'), href: '/calculators/td' },
    { name: t('schemeMisName'), href: '/calculators/mis' },
    { name: t('schemeScssName'), href: '/calculators/scss' },
    { name: t('schemePpfName'), href: '/calculators/ppf' },
    { name: t('schemeSsaName'), href: '/calculators/ssa' },
    { name: t('schemeNscName'), href: '/calculators/nsc' },
    { name: t('schemeKvpName'), href: '/calculators/kvp' },
    { name: t('schemeSbName'), href: '/calculators/sb' },
  ];

  const tools = [
    { name: t('navCompare'), href: '/compare' },
    { name: t('navCustomCalc'), href: '/interest-calculator' },
    { name: t('navRates'), href: '/rates' },
    { name: t('navSchemes'), href: '/schemes' },
  ];

  const legal = [
    { name: t('navAbout'), href: '/about' },
    { name: t('navPrivacy'), href: '/privacy-policy' },
    { name: t('navDisclaimer'), href: '/disclaimer' },
  ];

  return (
    <footer
      className="border-t transition-colors mt-auto text-sm"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info & Postbox Icon */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/branding/dak_help_logo.png"
                  alt="Dak Help Emblem"
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{ color: 'var(--postal-red)' }}
              >
                {isHindi ? 'डाक हेल्प' : 'Dak Help'}
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed max-w-md">
              {t('footerTagline')}
            </p>

            {/* Sovereign Independence Callout Box */}
            <div
              className="p-3.5 rounded-lg border text-xs space-y-1.5 max-w-md"
              style={{
                backgroundColor: 'var(--disclaimer-bg)',
                borderColor: 'var(--disclaimer-border)',
                color: 'var(--disclaimer-text)',
              }}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'सार्वजनिक सेवा एवं स्वतंत्रता अस्वीकरण' : 'Independent Service Disclaimer'}</span>
              </div>
              <p className="leading-normal">
                {isHindi ? AppConstants.nonOfficialDisclaimerHi : AppConstants.nonOfficialDisclaimer}
              </p>
            </div>
          </div>

          {/* Scheme Calculators Column */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <Calculator className="w-3.5 h-3.5" style={{ color: 'var(--postal-red)' }} />
              {t('allCalculatorsTitle')}
            </h3>
            <ul className="space-y-2 text-xs">
              {schemes.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="hover:underline transition-colors block py-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Guides Column */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--postal-green)' }} />
              {isHindi ? 'उपकरण एवं योजनाएं' : 'Tools & Guides'}
            </h3>
            <ul className="space-y-2 text-xs">
              {tools.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:underline transition-colors block py-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={AppConstants.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  style={{ color: 'var(--postal-red)' }}
                >
                  <span>{isHindi ? 'डाक विभाग पोर्टल' : 'India Post Portal'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Governance Column */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              {isHindi ? 'जानकारी एवं नीतियां' : 'Information & Legal'}
            </h3>
            <ul className="space-y-2 text-xs">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:underline transition-colors block py-0.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-3 text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                {isHindi ? 'दर संदर्भ:' : 'Rate Source Reference:'}
                <br />
                <span className="font-mono text-[10px]">{AppConstants.officialSourceRef}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div
          className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p>{t('footerCopyright')}</p>
          <p className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for Indian small savings depositors</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
