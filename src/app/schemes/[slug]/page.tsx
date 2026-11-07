import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSchemeInfoBySlug, getAllSchemeSlugs } from '@/data/schemes-info';
import { SchemeDetailClient } from './scheme-detail-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSchemeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scheme = getSchemeInfoBySlug(slug);

  if (!scheme) {
    return {
      title: 'Scheme Not Found - Dak Help',
    };
  }

  return {
    title: `${scheme.title} Rules, Interest Rate & Guide - Dak Help`,
    description: scheme.overview,
    keywords: [
      scheme.title,
      'Post Office Savings',
      'Interest Rate',
      'Section 80C',
      'Dak Help',
      scheme.slug,
    ],
  };
}

export default async function SchemePage({ params }: PageProps) {
  const { slug } = await params;
  const scheme = getSchemeInfoBySlug(slug);

  if (!scheme) {
    notFound();
  }

  return <SchemeDetailClient scheme={scheme} />;
}
