import { describe, it, expect } from 'vitest';
import { AppFormatters } from '../core/formatters/currency-formatter';
import { enTranslations } from '../core/localization/translations-en';
import { hiTranslations } from '../core/localization/translations-hi';
import { AppColors } from '../core/constants/colors';
import { AppConstants } from '../core/constants/constants';
import { getBaseUrl, getCanonicalUrl, PRODUCTION_DOMAIN, siteConfig } from '../core/config/site-config';
import sitemap from '../app/sitemap';
import robots from '../app/robots';

describe('Website Foundation Tests', () => {
  describe('Indian Currency & Date Formatters', () => {
    it('formats Indian rupee amounts with Indian comma grouping', () => {
      expect(AppFormatters.formatCurrency(1000)).toMatch(/₹\s*1,000/);
      expect(AppFormatters.formatCurrency(150000)).toMatch(/₹\s*1,50,000/);
      expect(AppFormatters.formatCurrency(3000000)).toMatch(/₹\s*30,00,000/);
    });

    it('formats currency with exact decimals when requested', () => {
      const formatted = AppFormatters.formatCurrency(71365.83, true);
      expect(formatted).toMatch(/₹\s*71,365\.83/);
    });

    it('handles zero, negative, and invalid values gracefully', () => {
      expect(AppFormatters.formatCurrency(0)).toMatch(/₹\s*0/);
      expect(AppFormatters.formatCurrency(NaN)).toBe('₹0');
    });

    it('formats dates in "dd MMM yyyy" format', () => {
      const date = new Date(2028, 9, 15); // Month is 0-indexed: 9 = October
      expect(AppFormatters.formatDate(date)).toBe('15 Oct 2028');
    });

    it('formats month and year in "MMM yyyy" format', () => {
      const date = new Date(2026, 10, 1); // 10 = November
      expect(AppFormatters.formatMonthYear(date)).toBe('Nov 2026');
    });

    it('parses formatted numeric strings cleanly', () => {
      expect(AppFormatters.parseCleanNumber('₹ 1,50,000')).toBe(150000);
      expect(AppFormatters.parseCleanNumber('₹71,365.83')).toBe(71365.83);
    });
  });

  describe('Localization Catalogs Parity', () => {
    it('has English and Hindi translations for all standard keys', () => {
      const enKeys = Object.keys(enTranslations) as Array<keyof typeof enTranslations>;
      for (const key of enKeys) {
        expect(enTranslations[key], `Missing English key: ${key}`).toBeDefined();
        expect(hiTranslations[key], `Missing Hindi translation for key: ${key}`).toBeDefined();
        expect(hiTranslations[key].length).toBeGreaterThan(0);
      }
    });

    it('contains all 9 scheme names in both languages', () => {
      expect(enTranslations.schemeRdName).toContain('Recurring Deposit');
      expect(hiTranslations.schemeRdName).toContain('आवर्ती जमा');

      expect(enTranslations.schemeTdName).toContain('Time Deposit');
      expect(hiTranslations.schemeTdName).toContain('सावधि जमा');

      expect(enTranslations.schemeMisName).toContain('Monthly Income Scheme');
      expect(hiTranslations.schemeMisName).toContain('मासिक आय योजना');

      expect(enTranslations.schemeScssName).toContain('Senior Citizen');
      expect(hiTranslations.schemeScssName).toContain('वरिष्ठ नागरिक');

      expect(enTranslations.schemePpfName).toContain('Public Provident Fund');
      expect(hiTranslations.schemePpfName).toContain('लोक भविष्य निधि');

      expect(enTranslations.schemeSsaName).toContain('Sukanya Samriddhi');
      expect(hiTranslations.schemeSsaName).toContain('सुकन्या समृद्धि');

      expect(enTranslations.schemeNscName).toContain('National Savings Certificate');
      expect(hiTranslations.schemeNscName).toContain('राष्ट्रीय बचत पत्र');

      expect(enTranslations.schemeKvpName).toContain('Kisan Vikas Patra');
      expect(hiTranslations.schemeKvpName).toContain('किसान विकास पत्र');

      expect(enTranslations.schemeSbName).toContain('Savings Account');
      expect(hiTranslations.schemeSbName).toContain('बचत खाता');
    });
  });

  describe('Design Tokens & Disclaimers', () => {
    it('matches brand colors exactly', () => {
      expect(AppColors.postalRed).toBe('#D85B48');
      expect(AppColors.postalAmber).toBe('#F3B83F');
      expect(AppColors.deepGreen).toBe('#245B50');
      expect(AppColors.warmIvory).toBe('#F7F1E8');
      expect(AppColors.charcoal).toBe('#303B38');
    });

    it('contains non-official disclaimers in both languages', () => {
      expect(AppConstants.nonOfficialDisclaimer).toContain('NOT affiliated with');
      expect(AppConstants.nonOfficialDisclaimerHi).toContain('संबद्ध नहीं');
    });
  });

  describe('Centralized SEO & Domain Configuration', () => {
    it('uses the verified Cloudflare Workers production domain by default', () => {
      expect(PRODUCTION_DOMAIN).toBe('https://dak-help-website.dakhelp.workers.dev');
      expect(getBaseUrl()).toBe('https://dak-help-website.dakhelp.workers.dev');
      expect(siteConfig.baseUrl).toBe('https://dak-help-website.dakhelp.workers.dev');
    });

    it('generates canonical URLs rooted in the verified Cloudflare production domain', () => {
      expect(getCanonicalUrl('/')).toBe('https://dak-help-website.dakhelp.workers.dev');
      expect(getCanonicalUrl('/calculators/rd')).toBe('https://dak-help-website.dakhelp.workers.dev/calculators/rd');
      expect(getCanonicalUrl('schemes/mis')).toBe('https://dak-help-website.dakhelp.workers.dev/schemes/mis');
    });

    it('generates sitemap with production domain and zero occurrences of dakhelp.com', () => {
      const entries = sitemap();
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.url.startsWith('https://dak-help-website.dakhelp.workers.dev')).toBe(true);
        expect(entry.url).not.toContain('dakhelp.com');
      }
    });

    it('generates robots.txt with production sitemap URL and zero occurrences of dakhelp.com', () => {
      const robotsConfig = robots();
      expect(robotsConfig.sitemap).toBe('https://dak-help-website.dakhelp.workers.dev/sitemap.xml');
      expect(String(robotsConfig.sitemap)).not.toContain('dakhelp.com');
    });
  });
});
