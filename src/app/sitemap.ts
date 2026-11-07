import { MetadataRoute } from 'next';
import { getAllSchemeSlugs } from '@/data/schemes-info';
import { SchemeDefinitions } from '@/data/models/scheme-type';
import { getBaseUrl } from '@/core/config/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  const staticRoutes = [
    '',
    '/calculators',
    '/schemes',
    '/compare',
    '/interest-calculator',
    '/rates',
    '/about',
    '/privacy-policy',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const calculatorRoutes = Object.values(SchemeDefinitions).map((def) => ({
    url: `${baseUrl}/calculators/${def.calculatorSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const schemeRoutes = getAllSchemeSlugs().map((slug) => ({
    url: `${baseUrl}/schemes/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...calculatorRoutes, ...schemeRoutes];
}
