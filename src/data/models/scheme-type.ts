/**
 * Indian Post Office Small Savings Schemes enumeration and categories.
 * Directly mirrors SchemeType.dart from the Android reference project.
 */

export type SchemeCategoryId =
  | 'taxSaving'
  | 'retirement'
  | 'fixedReturn'
  | 'recurring'
  | 'regularIncome'
  | 'savings';

export interface SchemeCategory {
  id: SchemeCategoryId;
  displayName: string;
  displayNameHi: string;
}

export const SchemeCategories: Record<SchemeCategoryId, SchemeCategory> = {
  taxSaving: { id: 'taxSaving', displayName: 'Tax Saving', displayNameHi: 'कर बचत' },
  retirement: { id: 'retirement', displayName: 'Retirement', displayNameHi: 'सेवानिवृत्ति' },
  fixedReturn: { id: 'fixedReturn', displayName: 'Fixed Return', displayNameHi: 'निश्चित प्रतिफल' },
  recurring: { id: 'recurring', displayName: 'Recurring', displayNameHi: 'आवर्ती जमा' },
  regularIncome: { id: 'regularIncome', displayName: 'Monthly Income', displayNameHi: 'मासिक आय' },
  savings: { id: 'savings', displayName: 'Liquid Savings', displayNameHi: 'तरल बचत' },
};

export type SchemeId =
  | 'rd'
  | 'td'
  | 'mis'
  | 'scss'
  | 'ppf'
  | 'ssa'
  | 'nsc'
  | 'kvp'
  | 'sb';

export interface SchemeDefinition {
  id: SchemeId;
  shortName: string;
  fullName: string;
  fullNameHi: string;
  category: SchemeCategory;
  slug: string;
  calculatorSlug: string;
  color: string;
}

export const SchemeDefinitions: Record<SchemeId, SchemeDefinition> = {
  rd: {
    id: 'rd',
    shortName: 'RD',
    fullName: 'Post Office Recurring Deposit Account',
    fullNameHi: 'डाकघर 5-वर्षीय आवर्ती जमा खाता (RD)',
    category: SchemeCategories.recurring,
    slug: 'recurring-deposit',
    calculatorSlug: 'rd',
    color: '#D85B48',
  },
  td: {
    id: 'td',
    shortName: 'TD',
    fullName: 'Post Office Time Deposit Account',
    fullNameHi: 'डाकघर सावधि जमा खाता (TD)',
    category: SchemeCategories.fixedReturn,
    slug: 'time-deposit',
    calculatorSlug: 'td',
    color: '#245B50',
  },
  mis: {
    id: 'mis',
    shortName: 'MIS',
    fullName: 'Post Office Monthly Income Scheme',
    fullNameHi: 'डाकघर मासिक आय योजना खाता (MIS)',
    category: SchemeCategories.regularIncome,
    slug: 'monthly-income-scheme',
    calculatorSlug: 'mis',
    color: '#F3B83F',
  },
  scss: {
    id: 'scss',
    shortName: 'SCSS',
    fullName: 'Senior Citizen Savings Scheme',
    fullNameHi: 'वरिष्ठ नागरिक बचत योजना खाता (SCSS)',
    category: SchemeCategories.retirement,
    slug: 'senior-citizens-savings-scheme',
    calculatorSlug: 'scss',
    color: '#C44836',
  },
  ppf: {
    id: 'ppf',
    shortName: 'PPF',
    fullName: 'Public Provident Fund Account',
    fullNameHi: 'लोक भविष्य निधि खाता (PPF)',
    category: SchemeCategories.taxSaving,
    slug: 'public-provident-fund',
    calculatorSlug: 'ppf',
    color: '#245B50',
  },
  ssa: {
    id: 'ssa',
    shortName: 'SSA',
    fullName: 'Sukanya Samriddhi Account',
    fullNameHi: 'सुकन्या समृद्धि खाता (SSA)',
    category: SchemeCategories.taxSaving,
    slug: 'sukanya-samriddhi-account',
    calculatorSlug: 'ssa',
    color: '#D85B48',
  },
  nsc: {
    id: 'nsc',
    shortName: 'NSC',
    fullName: 'National Savings Certificate (VIII Issue)',
    fullNameHi: 'राष्ट्रीय बचत पत्र (VIII निर्गम) (NSC)',
    category: SchemeCategories.taxSaving,
    slug: 'national-savings-certificate',
    calculatorSlug: 'nsc',
    color: '#245B50',
  },
  kvp: {
    id: 'kvp',
    shortName: 'KVP',
    fullName: 'Kisan Vikas Patra',
    fullNameHi: 'किसान विकास पत्र (KVP)',
    category: SchemeCategories.fixedReturn,
    slug: 'kisan-vikas-patra',
    calculatorSlug: 'kvp',
    color: '#F3B83F',
  },
  sb: {
    id: 'sb',
    shortName: 'SB',
    fullName: 'Post Office Savings Account',
    fullNameHi: 'डाकघर बचत खाता (SB)',
    category: SchemeCategories.savings,
    slug: 'savings-account',
    calculatorSlug: 'sb',
    color: '#303B38',
  },
};
