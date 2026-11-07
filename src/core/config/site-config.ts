/**
 * Centralized Site and Domain Configuration for Dak Help.
 * Allows easy switching between development, Cloudflare temporary workers.dev/pages.dev domains,
 * and custom domains.
 *
 * Current production deployment domain:
 * https://dak-help-website.dakhelp.workers.dev
 */

export const PRODUCTION_DOMAIN = 'https://dak-help-website.dakhelp.workers.dev';

export function getBaseUrl(): string {
  // 1. Explicit production custom domain or environment override
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }

  // 2. Cloudflare deployment URL (provided by Cloudflare runtime/pages if available)
  if (process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL.replace(/\/+$/, '');
  }

  // 3. Fallback production domain
  return PRODUCTION_DOMAIN;
}

export function getCanonicalUrl(path: string = ''): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath === '/' ? '' : cleanPath}`;
}

export const siteConfig = {
  name: 'Dak Help',
  fullName: 'Dak Help: PO Interest Calc',
  tagline: 'Your Post Office Savings Companion',
  defaultLocale: 'en_IN',
  baseUrl: getBaseUrl(),
  getCanonicalUrl,

  // Future Google AdSense Configuration
  // Keep disabled until publisher ID is configured and verified in production
  adSense: {
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null,
  },
};
