'use client';

import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';
import { AppConstants } from '@/core/constants/constants';

export function DisclaimerBanner() {
  const { isHindi } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Independent Disclaimer"
      className="relative z-50 border-b text-xs transition-colors"
      style={{
        backgroundColor: 'var(--disclaimer-bg)',
        borderColor: 'var(--disclaimer-border)',
        color: 'var(--disclaimer-text)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <p className="font-medium leading-normal">
            <span className="font-bold underline decoration-current mr-1">
              {isHindi ? 'स्वतंत्र साधन:' : 'Independent Utility:'}
            </span>
            {isHindi ? AppConstants.shortDisclaimerHi : AppConstants.shortDisclaimer}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label={isHindi ? 'अस्वीकरण सूचना बंद करें' : 'Dismiss disclaimer banner'}
          className="p-1 rounded hover:opacity-75 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
