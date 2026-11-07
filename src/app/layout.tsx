import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getBaseUrl } from '@/core/config/site-config';
import { ThemeProvider } from '@/core/theme/theme-context';
import { LanguageProvider } from '@/core/localization/language-context';
import { DisclaimerBanner } from '@/components/layout/disclaimer-banner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Dak Help: PO Interest Calc — Post Office Savings & Interest Calculator',
    template: '%s | Dak Help: PO Interest Calc',
  },
  description:
    'Official website for Dak Help. Accurate, sovereign-grade financial calculator for Indian Post Office small savings schemes: RD, TD, MIS, SCSS, PPF, SSA, NSC, KVP, and SB with English and Hindi reports.',
  keywords: [
    'Post Office Interest Calculator',
    'Dak Help',
    'Post Office RD Calculator',
    'Post Office Time Deposit Calculator',
    'MIS Calculator Post Office',
    'SCSS Calculator',
    'PPF Calculator India Post',
    'Sukanya Samriddhi Calculator',
    'NSC Calculator',
    'KVP Doubling Calculator',
    'Post Office Scheme Comparison',
  ],
  authors: [{ name: 'Dak Help Team' }],
  creator: 'Dak Help',
  icons: {
    icon: '/branding/dak_help_postbox_icon.png',
    apple: '/branding/dak_help_postbox_icon.png',
  },
  openGraph: {
    title: 'Dak Help: PO Interest Calc — Post Office Savings Companion',
    description:
      'Fast, accurate, and independent calculations for all 9 Indian Post Office Small Savings Schemes. Free PDF reports in English and Hindi.',
    siteName: 'Dak Help',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#D85B48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/branding/dak_help_postbox_icon.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <DisclaimerBanner />
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
