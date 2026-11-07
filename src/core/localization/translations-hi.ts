import { TranslationKey } from './translations-en';

/**
 * Hindi translation catalog for Dak Help Website.
 * Mirrors AppStrings.dart from the reference Android application.
 */
export const hiTranslations: Record<TranslationKey, string> = {
  // Brand & Header
  appName: 'डाक हेल्प',
  appFullName: 'डाक हेल्प: ब्याज कैलकुलेटर',
  appTagline: 'डाकघर बचत योजनाओं का विश्वसनीय साथी',
  appSubtitle: 'भारतीय डाकघर बचत योजनाओं के लिए स्वतंत्र कैलकुलेटर',

  // Language Selection
  language: 'भाषा',
  chooseLanguage: 'अपनी भाषा चुनें',
  englishOption: 'English',
  hindiOption: 'हिन्दी (Hindi)',
  englishOptionDesc: 'English इंटरफेस और रिपोर्ट के साथ जारी रखें',
  hindiOptionDesc: 'हिन्दी इंटरफेस और रिपोर्ट के साथ जारी रखें',

  // Navigation
  navHome: 'होम',
  navSchemes: 'योजनाएं',
  navCalculators: 'कैलकुलेटर',
  navCompare: 'योजना तुलना',
  navCustomCalc: 'कस्टम ब्याज',
  navRates: 'ब्याज दरें',
  navAbout: 'हमारे बारे में',
  navPrivacy: 'गोपनीयता नीति',
  navDisclaimer: 'अस्वीकरण',

  // Disclaimers
  nonOfficialDisclaimer:
    'डाक हेल्प एक स्वतंत्र शैक्षणिक और वित्तीय गणना साधन है जिसे डाकघर जमाकर्ताओं की सुविधा हेतु बनाया गया है। ' +
    'यह भारतीय डाक विभाग (India Post), संचार मंत्रालय अथवा भारत सरकार से संबद्ध नहीं है। गणनाएं अनुमानित हैं।',
  shortDisclaimer:
    'स्वतंत्र कैलकुलेटर। डाक विभाग या भारत सरकार से संबद्ध नहीं।',
  ratesSourceNote:
    'लघु बचत योजना ब्याज दरें भारत सरकार के वित्त मंत्रालय द्वारा त्रैमासिक रूप से अधिसूचित की जाती हैं। ' +
    'निवेश करने से पूर्व हमेशा अपनी स्थानीय डाकघर शाखा से विवरण सत्यापित करें।',

  // Home Page
  homeGreeting: 'डाक हेल्प में आपका स्वागत है',
  homeSubtitle: 'सटीक, विश्वसनीय और आधिकारिक डाकघर लघु बचत ब्याज कैलकुलेटर।',
  quickActionsTitle: 'त्वरित वित्तीय उपकरण',
  popularSchemesTitle: 'लोकप्रिय डाकघर योजनाएं',
  popularSchemesSubtitle: 'अक्सर उपयोग किए जाने वाले सरकारी बचत कैलकुलेटर',
  officialRatesTitle: 'सरकार द्वारा अधिसूचित दरें',
  officialRatesSubtitle: 'वित्त मंत्रालय द्वारा जारी और सत्यापित आधिकारिक ब्याज दरें',
  allCalculatorsTitle: 'सभी 9 डाकघर कैलकुलेटर',
  allCalculatorsSubtitle: 'आधिकारिक डाक नियमों पर आधारित संपूर्ण वित्तीय कैलकुलेटर',
  featuresTitle: 'डाक हेल्प की विशेषताएं',
  featuresSubtitle: 'सटीकता, पारदर्शिता और जमाकर्ता सशक्तिकरण हेतु निर्मित',

  // Quick Action Cards
  schemeComparisonCardTitle: 'योजनाओं की तुलना',
  schemeComparisonCardDesc: 'अपने बजट के आधार पर 2 या 3 डाकघर योजनाओं की एक साथ तुलना करें।',
  customCalculatorCardTitle: 'कस्टम ब्याज कैलकुलेटर',
  customCalculatorCardDesc: 'अपनी इच्छित दर और अवधि पर साधारण व चक्रवृद्धि ब्याज की विस्तृत गणना करें।',
  ratesCardTitle: 'नवीनतम ब्याज दरें',
  ratesCardDesc: 'लागू तिमाही दरें, ऐतिहासिक रिकॉर्ड और आधिकारिक सरकारी संदर्भ देखें।',

  // Common Actions
  calculate: 'गणना करें',
  reset: 'रीसेट',
  saveCalculation: 'गणना सहेजें',
  exportPdf: 'PDF निर्यात करें',
  share: 'शेयर करें',
  cancel: 'रद्द करें',
  close: 'बंद करें',
  confirm: 'पुष्टि करें',
  viewSchedule: 'विवरण अनुसूची देखें',
  quickPresetsLabel: 'त्वरित राशि:',
  enterValidAmountPrompt: 'प्रतिफल देखने के लिए वैध राशि दर्ज करें।',

  // Scheme Common Fields
  depositAmount: 'जमा राशि',
  monthlyDeposit: 'मासिक जमा राशि',
  annualDeposit: 'वार्षिक जमा राशि',
  lumpsumDeposit: 'एकमुश्त निवेश',
  interestRate: 'लागू ब्याज दर',
  tenure: 'अवधि',
  years: 'वर्ष',
  months: 'माह',
  maturityAmount: 'परिपक्वता राशि',
  totalInvested: 'कुल निवेश',
  interestEarned: 'कुल अर्जित ब्याज',
  monthlyIncome: 'मासिक आय',
  quarterlyPayout: 'त्रैमासिक आय',
  annualPayout: 'वार्षिक ब्याज भुगतान',
  taxDeduction80C: 'धारा 80C कर छूट उपलब्ध',
  taxExemptEEE: 'पूरी तरह कर-मुक्त (EEE)',
  taxableInterest: 'ब्याज कर योग्य (नियमानुसार)',
  openingDate: 'खाता खोलने की तिथि',
  maturityDate: 'परिपक्वता तिथि',

  // Scheme Categories
  categoryTaxSaving: 'कर बचत',
  categoryRetirement: 'सेवानिवृत्ति',
  categoryFixedReturn: 'निश्चित प्रतिफल',
  categoryRecurring: 'आवर्ती जमा',
  categoryRegularIncome: 'मासिक आय',
  categorySavings: 'तरल बचत',

  // Scheme Names
  schemeRdName: 'आवर्ती जमा खाता (RD)',
  schemeTdName: 'सावधि जमा खाता (TD)',
  schemeMisName: 'मासिक आय योजना (MIS)',
  schemeScssName: 'वरिष्ठ नागरिक बचत योजना (SCSS)',
  schemePpfName: 'लोक भविष्य निधि (PPF)',
  schemeSsaName: 'सुकन्या समृद्धि खाता (SSA)',
  schemeNscName: 'राष्ट्रीय बचत पत्र (NSC)',
  schemeKvpName: 'किसान विकास पत्र (KVP)',
  schemeSbName: 'डाकघर बचत खाता (SB)',

  // Scheme Comparison
  comparisonTitle: 'योजना तुलना साधन',
  comparisonSubtitle: 'अपने निवेश लक्ष्यों के आधार पर 2 या 3 योजनाओं की तुलना करें',
  selectSchemesTitle: 'तुलना के लिए 2 या 3 योजनाएं चुनें',
  selectUpToThree: 'न्यूनतम 2 और अधिकतम 3 योजनाएं',
  alreadySelected: 'यह योजना पहले से चुनी गई है',
  compareButtonLabel: 'तुलना शुरू करें',
  investmentBudget: 'निवेश बजट / राशि (₹)',
  comparisonTenure: 'तुलना अवधि',
  metricLabel: 'पैमाना / विवरण',
  depositPattern: 'जमा का प्रकार',
  payoutFrequency: 'भुगतान आवृत्ति',
  taxTreatment: 'कर लाभ (आयकर)',
  withdrawalRules: 'समयपूर्व निकासी नियम',
  guidanceTitle: 'तुलना मार्गदर्शन एवं वित्तीय लक्ष्य',
  visualComparison: 'दृश्य तुलना चार्ट',

  // Custom Interest Calculator
  customCalculatorTitle: 'कस्टम ब्याज कैलकुलेटर',
  customCalculatorSubtitle: 'साधारण एवं चक्रवृद्धि ब्याज की व्यापक गणना',
  customCalculatorDisclaimer:
    'यह एक सामान्य वित्तीय कैलकुलेटर है। परिणाम केवल दृष्टांत के लिए हैं और आधिकारिक डाकघर योजना के प्रतिफल नहीं हैं।',
  simpleInterest: 'साधारण ब्याज (SI)',
  compoundInterest: 'चक्रवृद्धि ब्याज (CI)',
  principalAmount: 'मूलधन राशि (Principal) (₹)',
  annualInterestRate: 'वार्षिक ब्याज दर (%)',
  compoundingFrequency: 'चक्रवृद्धि आवृत्ति',
  frequencyMonthly: 'मासिक',
  frequencyQuarterly: 'त्रैमासिक',
  frequencyHalfYearly: 'अर्धवार्षिक',
  frequencyAnnually: 'वार्षिक',
  enableRecurring: 'नियमित आवर्ती किस्त जोड़ें',
  recurringAmount: 'किस्त राशि (₹)',
  recurringFrequency: 'किस्त आवृत्ति',
  recurringTiming: 'किस्त जमा का समय',
  timingBeginning: 'अवधि के प्रारंभ में (Advance)',
  timingEnd: 'अवधि के अंत में (Arrears)',
  finalAmount: 'अंतिम राशि (Final Value)',
  principalInvested: 'आरंभिक मूलधन',
  totalContributions: 'कुल आवर्ती किस्तें',
  formulaAndBreakdown: 'सूत्र एवं गणना विवरण',
  progressionSchedule: 'अवधि-वार संचय अनुसूची',

  // Theme
  themeLight: 'लाइट',
  themeDark: 'डार्क',
  themeSystem: 'सिस्टम',

  // Footer & Credits
  footerTagline: 'भारतीय डाकघर जमाकर्ताओं को गणितीय रूप से सत्यापित वित्तीय गणनाओं से सशक्त बनाना।',
  footerCopyright: `© ${new Date().getFullYear()} डाक हेल्प। सर्वाधिकार सुरक्षित।`,
  footerGovtDisclaimer: 'डाक हेल्प एक स्वतंत्र साधन है और डाक विभाग या संचार मंत्रालय से संबद्ध नहीं है।',
};
