'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  Calculator,
  Scale,
  Percent,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { useTheme } from '@/core/theme/theme-context';

export function Header() {
  const { t, language, setLanguage, isHindi } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/schemes', label: t('navSchemes'), icon: BookOpen },
    { href: '/calculators', label: t('navCalculators'), icon: Calculator },
    { href: '/compare', label: t('navCompare'), icon: Scale },
    { href: '/interest-calculator', label: t('navCustomCalc'), icon: Percent },
    { href: '/rates', label: t('navRates'), icon: TrendingUp },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md transition-colors border-b"
      style={{
        backgroundColor: isDark ? 'rgba(27, 35, 33, 0.85)' : 'rgba(253, 251, 248, 0.9)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/branding/dak_help_logo.png"
                alt="Dak Help Logo"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-extrabold text-xl sm:text-2xl tracking-tight"
                  style={{ color: 'var(--postal-red)' }}
                >
                  {isHindi ? 'डाक हेल्प' : 'Dak Help'}
                </span>
                <span
                  className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full text-white tracking-wide uppercase"
                  style={{ backgroundColor: 'var(--postal-green)' }}
                >
                  PO Calc
                </span>
              </div>
              <p
                className="text-[11px] sm:text-xs font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {isHindi ? 'डाकघर ब्याज कैलकुलेटर' : 'PO Interest Calculator'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-white shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--postal-red)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-primary)',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls: Language & Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Pill */}
            <button
              onClick={toggleLanguage}
              aria-label={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all hover:scale-105"
              style={{
                borderColor: 'var(--border-strong)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
              title={isHindi ? 'Switch to English' : 'Switch to Hindi'}
            >
              <Languages className="w-3.5 h-3.5" style={{ color: 'var(--postal-red)' }} />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={
                theme === 'light'
                  ? 'Switch to dark theme'
                  : theme === 'dark'
                  ? 'Switch to system theme'
                  : 'Switch to light theme'
              }
              className="p-2 rounded-lg border transition-all hover:scale-105"
              style={{
                borderColor: 'var(--border-strong)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
              title={`Theme: ${theme.toUpperCase()}`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" style={{ color: 'var(--charcoal)' }} />
              )}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border-strong)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: active ? 'var(--postal-red)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
