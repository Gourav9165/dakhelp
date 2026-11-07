/**
 * English translation dictionary for Dak Help Website.
 * Mirrors AppStrings.dart from the Android application.
 */
export const enTranslations = {
  // Brand & Header
  appName: 'Dak Help',
  appFullName: 'Dak Help: PO Interest Calc',
  appTagline: 'Your Post Office Savings Companion',
  appSubtitle: 'Independent Indian Post Office Savings Schemes Calculator',

  // Language Selection
  language: 'Language',
  chooseLanguage: 'Choose Your Language',
  englishOption: 'English',
  hindiOption: 'हिन्दी (Hindi)',
  englishOptionDesc: 'Continue with English interface & reports',
  hindiOptionDesc: 'हिन्दी इंटरफेस और रिपोर्ट के साथ जारी रखें',

  // Navigation
  navHome: 'Home',
  navSchemes: 'Schemes',
  navCalculators: 'Calculators',
  navCompare: 'Compare',
  navCustomCalc: 'Custom Interest',
  navRates: 'Interest Rates',
  navAbout: 'About',
  navPrivacy: 'Privacy Policy',
  navDisclaimer: 'Disclaimer',

  // Disclaimers
  nonOfficialDisclaimer:
    'Dak Help is an independent educational and financial calculation tool developed ' +
    'to assist Indian Post Office depositors. It is NOT affiliated with, endorsed by, ' +
    'or officially connected with the Department of Posts (India Post), Ministry of Communications, ' +
    'or the Government of India. Calculations are for estimation purposes.',
  shortDisclaimer:
    'Independent calculator. Not affiliated with India Post or Govt of India.',
  ratesSourceNote:
    'Small Savings Scheme interest rates are declared quarterly by the Ministry of Finance, ' +
    'Government of India. Always verify maturity details at your local Post Office branch before investing.',

  // Home Page
  homeGreeting: 'Welcome to Dak Help',
  homeSubtitle: 'Accurate, trustworthy & sovereign-grade Indian Post Office savings calculators.',
  quickActionsTitle: 'Financial Intelligence Tools',
  popularSchemesTitle: 'Popular Post Office Schemes',
  popularSchemesSubtitle: 'Frequently calculated government-backed small savings schemes',
  officialRatesTitle: 'Government Notified Rates',
  officialRatesSubtitle: 'Active verified rates from official Ministry of Finance notifications',
  allCalculatorsTitle: 'All 9 Post Office Calculators',
  allCalculatorsSubtitle: 'Direct access to calculation engines replicating exact official rules',
  featuresTitle: 'Why Use Dak Help?',
  featuresSubtitle: 'Built for precision, transparency, and depositor empowerment',

  // Quick Action Cards
  schemeComparisonCardTitle: 'Scheme Comparison',
  schemeComparisonCardDesc: 'Side-by-side analysis of 2 or 3 postal savings schemes with normalized budgets.',
  customCalculatorCardTitle: 'Custom Interest Calc',
  customCalculatorCardDesc: 'Calculate Simple and Compound interest with custom compounding and recurring deposits.',
  ratesCardTitle: 'Current Interest Rates',
  ratesCardDesc: 'Review verified interest rates, effective quarters, and notification references.',

  // Common Actions
  calculate: 'Calculate',
  reset: 'Reset',
  saveCalculation: 'Save Calculation',
  exportPdf: 'Export PDF',
  share: 'Share',
  cancel: 'Cancel',
  close: 'Close',
  confirm: 'Confirm',
  viewSchedule: 'View Schedule',
  quickPresetsLabel: 'Quick amounts:',
  enterValidAmountPrompt: 'Enter a valid amount to see returns.',

  // Scheme Common Fields
  depositAmount: 'Deposit Amount',
  monthlyDeposit: 'Monthly Deposit Amount',
  annualDeposit: 'Annual Deposit',
  lumpsumDeposit: 'Lump-Sum Investment',
  interestRate: 'Applicable Interest Rate',
  tenure: 'Tenure',
  years: 'Years',
  months: 'Months',
  maturityAmount: 'Maturity Amount',
  totalInvested: 'Total Invested',
  interestEarned: 'Total Interest Earned',
  monthlyIncome: 'Monthly Payout',
  quarterlyPayout: 'Quarterly Payout',
  annualPayout: 'Annual Interest Payout',
  taxDeduction80C: 'Section 80C Tax Benefit Available',
  taxExemptEEE: 'Exempt-Exempt-Exempt (EEE)',
  taxableInterest: 'Interest is Taxable',
  openingDate: 'Account Opening Date',
  maturityDate: 'Maturity Date',

  // Scheme Categories
  categoryTaxSaving: 'Tax Saving',
  categoryRetirement: 'Retirement',
  categoryFixedReturn: 'Fixed Return',
  categoryRecurring: 'Recurring',
  categoryRegularIncome: 'Regular Income',
  categorySavings: 'Liquid Savings',

  // Scheme Names
  schemeRdName: '5-Year Recurring Deposit (RD)',
  schemeTdName: 'Time Deposit Account (TD)',
  schemeMisName: 'Monthly Income Scheme (MIS)',
  schemeScssName: 'Senior Citizen Savings Scheme (SCSS)',
  schemePpfName: 'Public Provident Fund (PPF)',
  schemeSsaName: 'Sukanya Samriddhi Account (SSA)',
  schemeNscName: 'National Savings Certificate (NSC)',
  schemeKvpName: 'Kisan Vikas Patra (KVP)',
  schemeSbName: 'Savings Account (SB)',

  // Scheme Comparison
  comparisonTitle: 'Scheme Comparison Tool',
  comparisonSubtitle: 'Compare 2 or 3 Post Office schemes based on your investment goals',
  selectSchemesTitle: 'Select 2 or 3 Schemes to Compare',
  selectUpToThree: 'Minimum 2 and maximum 3 schemes',
  alreadySelected: 'This scheme is already selected',
  compareButtonLabel: 'Compare Schemes',
  investmentBudget: 'Investment Budget / Amount (₹)',
  comparisonTenure: 'Comparison Tenure',
  metricLabel: 'Metric',
  depositPattern: 'Deposit Pattern',
  payoutFrequency: 'Payout Frequency',
  taxTreatment: 'Tax Treatment',
  withdrawalRules: 'Withdrawal Conditions',
  guidanceTitle: 'Intelligent Comparison Guidance',
  visualComparison: 'Visual Comparison',

  // Custom Interest Calculator
  customCalculatorTitle: 'Custom Interest Calculator',
  customCalculatorSubtitle: 'General-purpose Simple & Compound interest calculation',
  customCalculatorDisclaimer:
    'This is a general-purpose financial calculator. Results are illustrative and are not official Post Office scheme returns.',
  simpleInterest: 'Simple Interest (SI)',
  compoundInterest: 'Compound Interest (CI)',
  principalAmount: 'Principal Amount (₹)',
  annualInterestRate: 'Annual Interest Rate (%)',
  compoundingFrequency: 'Compounding Frequency',
  frequencyMonthly: 'Monthly',
  frequencyQuarterly: 'Quarterly',
  frequencyHalfYearly: 'Half-Yearly',
  frequencyAnnually: 'Annually',
  enableRecurring: 'Add Recurring Contributions',
  recurringAmount: 'Contribution Amount (₹)',
  recurringFrequency: 'Contribution Frequency',
  recurringTiming: 'Contribution Timing',
  timingBeginning: 'Beginning of Period (In Advance)',
  timingEnd: 'End of Period (In Arrears)',
  finalAmount: 'Final Maturity Value',
  principalInvested: 'Initial Principal',
  totalContributions: 'Total Contributions',
  formulaAndBreakdown: 'Formula & Mathematical Breakdown',
  progressionSchedule: 'Progression Schedule',

  // Theme
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',

  // Footer & Credits
  footerTagline: 'Empowering Indian depositors with mathematically verified financial calculations.',
  footerCopyright: `© ${new Date().getFullYear()} Dak Help. All rights reserved.`,
  footerGovtDisclaimer: 'Dak Help is an independent utility and is not affiliated with India Post or the Ministry of Communications.',
};

export type TranslationKey = keyof typeof enTranslations;
