/**
 * Application-wide constants, labels, and disclaimers.
 * Replicated with exact fidelity from Android AppConstants.dart.
 */
export const AppConstants = {
  appName: 'Dak Help: PO Interest Calc',
  shortAppName: 'Dak Help',
  appVersion: '1.0.0',
  tagline: 'Your Post Office Savings Companion',

  // Prominent non-official disclaimers
  nonOfficialDisclaimer:
    'Dak Help is an independent educational and financial calculation tool developed ' +
    'to assist Indian Post Office depositors. It is NOT affiliated with, endorsed by, ' +
    'or officially connected with the Department of Posts (India Post), Ministry of Communications, ' +
    'or the Government of India. Calculations are for estimation purposes.',

  nonOfficialDisclaimerHi:
    'डाक हेल्प एक स्वतंत्र शैक्षणिक और वित्तीय गणना साधन है जिसे डाकघर जमाकर्ताओं की सुविधा हेतु बनाया गया है। ' +
    'यह भारतीय डाक विभाग (India Post), संचार मंत्रालय अथवा भारत सरकार से संबद्ध नहीं है। गणनाएं अनुमानित हैं।',

  shortDisclaimer:
    'Independent calculator. Not affiliated with India Post or Govt of India.',

  shortDisclaimerHi:
    'स्वतंत्र कैलकुलेटर। डाक विभाग या भारत सरकार से संबद्ध नहीं।',

  ratesSourceNote:
    'Small Savings Scheme interest rates are declared quarterly by the Ministry of Finance, ' +
    'Government of India. Always verify maturity details at your local Post Office branch before investing.',

  ratesSourceNoteHi:
    'लघु बचत योजना ब्याज दरें भारत सरकार के वित्त मंत्रालय द्वारा त्रैमासिक रूप से अधिसूचित की जाती हैं। ' +
    'निवेश करने से पूर्व हमेशा अपनी स्थानीय डाकघर शाखा से विवरण सत्यापित करें।',

  officialSourceRef: 'Ministry of Finance Notification F.No. 1/4/2019-NS',
  officialPublisher: 'Department of Posts & Ministry of Finance',
  officialPortalUrl: 'https://www.indiapost.gov.in/banking-services/savings',
  lastVerifiedDateString: '01 Nov 2026',
  currentQuarterLabel: 'Q4 FY 2024-25 (Current Rates)',
  currentQuarterLabelHi: 'Q4 FY 2024-25 (वर्तमान प्रभावी दरें)',
} as const;
