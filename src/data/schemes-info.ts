import { SchemeId } from './models/scheme-type';

export interface SchemeInfoFaq {
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
}

export interface SchemeDetailedInfo {
  id: SchemeId;
  slug: string;
  calculatorSlug: string;
  title: string;
  titleHi: string;
  tagline: string;
  taglineHi: string;
  overview: string;
  overviewHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  investmentLimits: {
    min: string;
    minHi: string;
    max: string;
    maxHi: string;
    multiples: string;
    multiplesHi: string;
  };
  interestDetails: {
    rate: string;
    effectiveQuarter: string;
    effectiveQuarterHi: string;
    compounding: string;
    compoundingHi: string;
    payout: string;
    payoutHi: string;
  };
  tenureAndMaturity: string;
  tenureAndMaturityHi: string;
  prematureClosure: string[];
  prematureClosureHi: string[];
  taxTreatment: {
    section: string;
    sectionHi: string;
    details: string[];
    detailsHi: string[];
  };
  importantConditions: string[];
  importantConditionsHi: string[];
  faqs: SchemeInfoFaq[];
}

export const schemesDetailedInfo: Record<SchemeId, SchemeDetailedInfo> = {
  rd: {
    id: 'rd',
    slug: 'recurring-deposit',
    calculatorSlug: 'rd',
    title: '5-Year Post Office Recurring Deposit (PO-RD)',
    titleHi: '5-वर्षीय डाकघर आवर्ती जमा खाता (PO-RD)',
    tagline: 'Systematic monthly savings with guaranteed quarterly compounding',
    taglineHi: 'त्रैमासिक चक्रवृद्धि ब्याज के साथ नियमित मासिक बचत योजना',
    overview:
      'The Post Office Recurring Deposit Account is a 5-year systematic savings scheme designed for individuals wishing to invest a fixed monthly amount from regular income. Deposits earn sovereign government interest compounded quarterly, with interest rates locked on account opening date for the entire 60-month duration.',
    overviewHi:
      'डाकघर आवर्ती जमा खाता 5 वर्ष की एक नियमित बचत योजना है, जिसमें प्रति माह एक निश्चित राशि जमा की जाती है। इस खाते पर सरकार द्वारा निर्धारित ब्याज दर त्रैमासिक चक्रवृद्धि आधार पर मिलती है, जो खाता खोलने की तिथि से पूरे 60 महीनों के लिए स्थिर (लॉक) रहती है।',
    eligibility: [
      'A single resident adult (Indian citizen).',
      'Joint account with up to 3 adults (Joint A or Joint B).',
      'A guardian on behalf of a minor or a person of unsound mind.',
      'A minor above 10 years of age in their own name.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 3 वयस्कों द्वारा संयुक्त खाता (Joint A अथवा Joint B)।',
      'नाबालिग अथवा मानसिक रूप से अस्वस्थ व्यक्ति की ओर से अभिभावक।',
      '10 वर्ष से अधिक आयु का नाबालिग अपने स्वयं के नाम से।',
    ],
    investmentLimits: {
      min: '₹100 per month',
      minHi: '₹100 प्रति माह',
      max: 'No upper limit',
      maxHi: 'कोई अधिकतम सीमा नहीं',
      multiples: 'Multiples of ₹10',
      multiplesHi: '₹10 के गुणकों में',
    },
    interestDetails: {
      rate: '6.7% p.a.',
      effectiveQuarter: 'Q3 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 3 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Quarterly Compounding',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Paid at maturity along with principal',
      payoutHi: 'परिपक्वता पर मूलधन सहित एकमुश्त देय',
    },
    tenureAndMaturity:
      '5 Years (60 monthly deposits) from account opening. The account matures upon completion of 60 months.',
    tenureAndMaturityHi:
      'खाता खोलने की तिथि से 5 वर्ष (60 मासिक किस्तें)। खाता ठीक 60 माह पूरे होने पर परिपक्व होता है।',
    prematureClosure: [
      'Allowed after 3 years from the date of account opening.',
      'If closed prematurely, Post Office Savings Account (PO-SB) interest rate is paid instead of RD rate.',
      'No premature closure permitted before completion of 3 years.',
    ],
    prematureClosureHi: [
      'खाता खोलने की तिथि से 3 वर्ष पूरे होने के बाद ही समयपूर्व बंदी अनुमत है।',
      'समयपूर्व बंदी पर आरडी दर के स्थान पर केवल डाकघर बचत खाता (PO-SB) दर से ब्याज दिया जाता है।',
      '3 वर्ष से पहले किसी भी स्थिति में समयपूर्व बंदी अनुमत नहीं है।',
    ],
    taxTreatment: {
      section: 'Taxable under Income from Other Sources',
      sectionHi: 'अन्य स्रोतों से आय के अंतर्गत कर योग्य',
      details: [
        'No Section 80C tax deduction applies to RD deposits.',
        'Interest earned is fully taxable according to your applicable income tax slab.',
        'TDS is applicable as per prevailing Income Tax laws.',
      ],
      detailsHi: [
        'आरडी जमा पर धारा 80C के तहत कोई कर छूट उपलब्ध नहीं है।',
        'अर्जित ब्याज जमाकर्ता के आयकर स्लैब के अनुसार पूर्णतः कर योग्य है।',
        'प्रचलित आयकर नियमों के अनुसार टीडीएस (TDS) कटौती लागू हो सकती है।',
      ],
    },
    importantConditions: [
      'Subsequent deposits must be paid by the 15th of the month (if opened between 1st and 15th) or by the last working day (if opened after 15th).',
      'Advance deposit rebate (Rule 8): ₹10 rebate per ₹100 denomination for 6 months in advance; ₹40 rebate per ₹100 for 12 months in advance.',
      'Loan facility up to 50% of the deposit balance is available after 1 year of continuous operation.',
    ],
    importantConditionsHi: [
      'मासिक किस्त 15 तारीख तक (यदि खाता 1-15 के बीच खुला) अथवा माह के अंतिम दिन तक जमा करना अनिवार्य है।',
      'अग्रिम जमा छूट (नियम 8): 6 माह अग्रिम पर ₹10 प्रति ₹100; 12 माह अग्रिम पर ₹40 प्रति ₹100 की छूट देय होती है।',
      '1 वर्ष तक निरंतर खाता चलने पर जमा राशि का 50% तक ऋण सुविधा उपलब्ध है।',
    ],
    faqs: [
      {
        question: 'What happens if I miss a monthly deposit?',
        questionHi: 'यदि मेरी कोई मासिक किस्त छूट जाए तो क्या होगा?',
        answer:
          'A default fee of ₹1 for every ₹100 denomination is charged per missed month. If there are more than 4 consecutive defaults, the account is discontinued and must be revived within 2 months.',
        answerHi:
          'प्रति ₹100 की किस्त पर ₹1 प्रति माह का विलंब शुल्क (डिफ़ॉल्ट जुर्माना) लगता है। लगातार 4 किस्तों के विलंब पर खाता बंद मान लिया जाता है, जिसे 2 माह के भीतर पुनर्जीवित कराया जा सकता है।',
      },
      {
        question: 'Can I extend my RD account after 5 years?',
        questionHi: 'क्या 5 वर्ष बाद आरडी खाते को आगे बढ़ाया जा सकता है?',
        answer:
          'Yes, the account can be extended for an additional 5 years with or without continued monthly deposits at the original opening rate.',
        answerHi:
          'हां, परिपक्वता के बाद खाते को आगामी 5 वर्षों के लिए मासिक जमा के साथ अथवा बिना जमा के उसी मूल दर पर आगे बढ़ाया जा सकता है।',
      },
    ],
  },

  td: {
    id: 'td',
    slug: 'time-deposit',
    calculatorSlug: 'td',
    title: 'Post Office Time Deposit Account (PO-TD)',
    titleHi: 'डाकघर सावधि जमा खाता (PO-TD)',
    tagline: 'Guaranteed fixed returns for 1, 2, 3, or 5 years with annual payouts',
    taglineHi: 'वार्षिक ब्याज भुगतान के साथ 1, 2, 3 या 5 वर्ष हेतु गारंटीकृत सावधि जमा',
    overview:
      'The Post Office Time Deposit is a term deposit scheme offering guaranteed returns for fixed tenures of 1, 2, 3, or 5 years. Under official scheme rules (Rule 7), interest is compounded quarterly at the notified rate and paid out annually to the depositor’s savings account.',
    overviewHi:
      'डाकघर सावधि जमा (TD) एक निश्चित अवधि की बचत योजना है जो 1, 2, 3 अथवा 5 वर्षों की तय अवधि हेतु सुरक्षित रिटर्न प्रदान करती है। आधिकारिक नियम (Rule 7) अनुसार ब्याज की गणना त्रैमासिक चक्रवृद्धि से होती है और इसका भुगतान प्रतिवर्ष जमाकर्ता को किया जाता है।',
    eligibility: [
      'Single resident Indian adult.',
      'Joint account with up to 3 adults.',
      'Guardian on behalf of a minor or person of unsound mind.',
      'Minor aged above 10 years in their own name.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 3 वयस्कों द्वारा संयुक्त खाता।',
      'नाबालिग अथवा मानसिक रूप से अस्वस्थ व्यक्ति हेतु अभिभावक।',
      '10 वर्ष से अधिक आयु का नाबालिग अपने स्वयं के नाम से।',
    ],
    investmentLimits: {
      min: '₹1,000',
      minHi: '₹1,000',
      max: 'No upper limit',
      maxHi: 'कोई अधिकतम सीमा नहीं',
      multiples: 'Multiples of ₹100',
      multiplesHi: '₹100 के गुणकों में',
    },
    interestDetails: {
      rate: '1-Yr: 6.9% • 2-Yr: 7.0% • 3-Yr: 7.1% • 5-Yr: 7.5%',
      effectiveQuarter: 'Q4 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 4 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Quarterly Compounded',
      compoundingHi: 'त्रैमासिक चक्रवृद्धि',
      payout: 'Payable annually to Savings Account',
      payoutHi: 'बचत खाते में वार्षिक भुगतान देय',
    },
    tenureAndMaturity: '1, 2, 3, or 5 Years from date of deposit.',
    tenureAndMaturityHi: 'जमा की तारीख से 1, 2, 3 या 5 वर्ष।',
    prematureClosure: [
      'No premature closure allowed before 6 months from deposit date.',
      'Between 6 months and 1 year: PO Savings Account rate (4.0%) applies without quarterly compounding.',
      'After 1 year: Interest calculated at 2% less than the rate applicable for completed tenure.',
    ],
    prematureClosureHi: [
      'जमा की तारीख से 6 माह से पहले समयपूर्व बंदी की अनुमति नहीं है।',
      '6 माह से 1 वर्ष के बीच: बिना चक्रवृद्धि के डाकघर बचत खाता दर (4.0%) से ब्याज देय।',
      '1 वर्ष उपरांत: पूर्ण की गई अवधि पर लागू दर से 2% कम दर पर ब्याज काटा जाता है।',
    ],
    taxTreatment: {
      section: 'Section 80C (5-Year TD only)',
      sectionHi: 'धारा 80C (केवल 5-वर्षीय टीडी पर)',
      details: [
        '5-Year Time Deposit investment qualifies for tax deduction under Section 80C up to ₹1.5 Lakh.',
        '1, 2, and 3-Year Time Deposits do NOT qualify for Section 80C.',
        'Annual interest payout is fully taxable as income.',
      ],
      detailsHi: [
        '5-वर्षीय सावधि जमा में निवेश पर धारा 80C के तहत ₹1.5 लाख तक की कर कटौती मिलती है।',
        '1, 2 और 3 वर्ष की सावधि जमाओं पर 80C का लाभ नहीं मिलता।',
        'वार्षिक ब्याज भुगतान जमाकर्ता की कुल आय में जुड़कर कर योग्य होता है।',
      ],
    },
    importantConditions: [
      'Under Rule 7(3), if annual interest is left undrawn in the account, it earns no additional interest.',
      'Accounts can be pledged as security to banks and financial institutions.',
    ],
    importantConditionsHi: [
      'नियम 7(3) के अनुसार यदि देय वार्षिक ब्याज नहीं निकाला जाता, तो उस पर कोई अतिरिक्त ब्याज नहीं मिलता।',
      'बैंकों और वित्तीय संस्थानों में प्रतिभूति (सिक्योरिटी) के रूप में गिरवी रखा जा सकता है।',
    ],
    faqs: [
      {
        question: 'Why does PO-TD pay interest annually if it is compounded quarterly?',
        questionHi: 'त्रैमासिक चक्रवृद्धि होने के बावजूद डाकघर टीडी का ब्याज वार्षिक क्यों मिलता है?',
        answer:
          'Under Rule 7 of the National Savings Time Deposit Rules, quarterly compounding increases the annual effective yield, and this accumulated interest is officially disbursed once every year.',
        answerHi:
          'राष्ट्रीय बचत सावधि जमा नियम (Rule 7) के तहत त्रैमासिक चक्रवृद्धि से वार्षिक प्रभावी प्रतिफल बढ़ता है, और यह संचित ब्याज प्रतिवर्ष जमाकर्ता को वितरित किया जाता है।',
      },
    ],
  },

  mis: {
    id: 'mis',
    slug: 'monthly-income-scheme',
    calculatorSlug: 'mis',
    title: 'Post Office Monthly Income Scheme (PO-MIS)',
    titleHi: 'डाकघर मासिक आय योजना (PO-MIS)',
    tagline: 'Guaranteed monthly pension-style cash flow with 100% principal protection',
    taglineHi: 'मूलधन की 100% सुरक्षा के साथ मासिक निश्चित पेंशन जैसी नियमित आय',
    overview:
      'The Monthly Income Scheme provides steady, predictable monthly cash returns directly credited to your Savings Account. It is one of the most reliable regular income instruments in India, particularly favoured by retirees and conservative savers seeking liquidity.',
    overviewHi:
      'मासिक आय योजना (MIS) जमाकर्ताओं को मासिक निश्चित आय प्रदान करती है जो सीधे आपके बचत खाते में जमा होती है। यह सेवानिवृत्त व्यक्तियों और नियमित आय चाहने वाले निवेशकों के लिए भारत की सर्वाधिक विश्वसनीय योजनाओं में से एक है।',
    eligibility: [
      'A single resident Indian adult.',
      'Joint account with up to 3 adults (all share equal rights).',
      'Guardian on behalf of a minor.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 3 वयस्कों द्वारा संयुक्त खाता (समान भागीदारी)।',
      'नाबालिग की ओर से अभिभावक।',
    ],
    investmentLimits: {
      min: '₹1,000',
      minHi: '₹1,000',
      max: 'Single: ₹9,00,000 • Joint: ₹15,00,000',
      maxHi: 'एकल: ₹9,00,000 • संयुक्त: ₹15,00,000',
      multiples: 'Multiples of ₹1,000',
      multiplesHi: '₹1,000 के गुणकों में',
    },
    interestDetails: {
      rate: '7.4% p.a.',
      effectiveQuarter: 'Q1 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 1 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Simple monthly payout (P × R / 1200)',
      compoundingHi: 'साधारण मासिक भुगतान (P × R / 1200)',
      payout: 'Credited automatically on the monthly anniversary date',
      payoutHi: 'प्रति माह खाता खुलने की तारीख पर सीधे बचत खाते में जमा',
    },
    tenureAndMaturity: '5 Years (60 monthly payments). Principal refunded in full at maturity.',
    tenureAndMaturityHi: '5 वर्ष (60 मासिक भुगतान)। परिपक्वता पर पूरा मूलधन वापस।',
    prematureClosure: [
      'No premature withdrawal permitted within the first 1 year.',
      'Between 1 and 3 years: 2% deducted from principal as penalty.',
      'Between 3 and 5 years: 1% deducted from principal as penalty.',
    ],
    prematureClosureHi: [
      'प्रथम 1 वर्ष के भीतर किसी भी समयपूर्व निकासी की अनुमति नहीं है।',
      '1 से 3 वर्ष के बीच बंदी पर मूलधन में से 2% की कटौती की जाती है।',
      '3 से 5 वर्ष के बीच बंदी पर मूलधन में से 1% की कटौती की जाती है।',
    ],
    taxTreatment: {
      section: 'Taxable under Income from Other Sources',
      sectionHi: 'अन्य स्रोतों से आय के अंतर्गत कर योग्य',
      details: [
        'No Section 80C tax deduction applies to MIS investments.',
        'Monthly interest is taxable according to your income tax slab.',
        'No TDS is deducted at source by Post Office on MIS interest.',
      ],
      detailsHi: [
        'एमआईएस निवेश पर धारा 80C के तहत कोई कर कटौती नहीं मिलती।',
        'मासिक ब्याज आय आपके व्यक्तिगत टैक्स स्लैब के अनुसार कर योग्य है।',
        'डाकघर द्वारा एमआईएस ब्याज पर स्रोत पर कोई टीडीएस नहीं काटा जाता।',
      ],
    },
    importantConditions: [
      'If monthly interest is not withdrawn, it does not earn any extra interest in the MIS account.',
      'Auto-credit directly into linked Post Office Savings Account is mandatory.',
    ],
    importantConditionsHi: [
      'यदि मासिक ब्याज नहीं निकाला जाता, तो उस पर कोई अतिरिक्त ब्याज नहीं मिलता।',
      'लिंक किए गए डाकघर बचत खाते में स्वतः जमा (ऑटो-क्रेडिट) की व्यवस्था अनिवार्य है।',
    ],
    faqs: [
      {
        question: 'What is the maximum monthly income I can get from MIS?',
        questionHi: 'एमआईएस से मुझे अधिकतम कितनी मासिक आय प्राप्त हो सकती है?',
        answer:
          'For a single account with ₹9 Lakh deposited at 7.4%, you receive ₹5,550/month. For a joint account with ₹15 Lakh deposited, you receive ₹9,250/month.',
        answerHi:
          'एकल खाते में ₹9 लाख पर 7.4% की दर से ₹5,550 प्रति माह मिलता है। संयुक्त खाते में ₹15 लाख जमा करने पर ₹9,250 प्रति माह प्राप्त होता है।',
      },
    ],
  },

  scss: {
    id: 'scss',
    slug: 'senior-citizens-savings-scheme',
    calculatorSlug: 'scss',
    title: 'Senior Citizens Savings Scheme (SCSS)',
    titleHi: 'वरिष्ठ नागरिक बचत योजना (SCSS)',
    tagline: 'Sovereign quarterly pension-style returns for individuals aged 60 and above',
    taglineHi: '60 वर्ष व उससे अधिक आयु के वरिष्ठ नागरिकों हेतु उच्च त्रैमासिक पेंशन आय',
    overview:
      'The Senior Citizens Savings Scheme is the premier government retirement savings avenue in India. It offers a premier sovereign interest rate with quarterly interest credited on the first working day of April, July, October, and January.',
    overviewHi:
      'वरिष्ठ नागरिक बचत योजना भारत सरकार की सर्वोच्च सेवानिवृत्ति योजना है। यह वरिष्ठ नागरिकों को सुरक्षित और आकर्षक ब्याज दर प्रदान करती है, जिसका भुगतान प्रत्येक वर्ष 1 अप्रैल, 1 जुलाई, 1 अक्टूबर और 1 जनवरी को किया जाता है।',
    eligibility: [
      'Individuals aged 60 years or above.',
      'Retired civilian employees aged 55 to 60 (invested within 1 month of retirement benefits receipt).',
      'Retired defense personnel aged 50 or above.',
    ],
    eligibilityHi: [
      '60 वर्ष या उससे अधिक आयु के भारतीय नागरिक।',
      '55 से 60 वर्ष के सेवानिवृत्त कर्मचारी (सेवानिवृत्ति लाभ मिलने के 1 माह के भीतर निवेश)।',
      '50 वर्ष या उससे अधिक आयु के सेवानिवृत्त रक्षा कर्मी।',
    ],
    investmentLimits: {
      min: '₹1,000',
      minHi: '₹1,000',
      max: '₹30,00,000 per individual',
      maxHi: '₹30,00,000 प्रति व्यक्ति',
      multiples: 'Multiples of ₹1,000',
      multiplesHi: '₹1,000 के गुणकों में',
    },
    interestDetails: {
      rate: '8.2% p.a.',
      effectiveQuarter: 'Q1 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 1 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Quarterly Simple Interest ((P × R) / 400)',
      compoundingHi: 'त्रैमासिक साधारण ब्याज ((P × R) / 400)',
      payout: 'Paid on 1st of April, July, Oct, and Jan',
      payoutHi: '1 अप्रैल, 1 जुलाई, 1 अक्टूबर और 1 जनवरी को देय',
    },
    tenureAndMaturity: '5 Years, extendable once by an additional 3 years.',
    tenureAndMaturityHi: '5 वर्ष, जिसे 3 और वर्षों के लिए एक बार बढ़ाया जा सकता है।',
    prematureClosure: [
      'Within 1 year: No interest payable; any paid interest is recovered from principal.',
      'Between 1 and 2 years: 1.5% deducted from principal.',
      'After 2 years: 1.0% deducted from principal.',
    ],
    prematureClosureHi: [
      '1 वर्ष के भीतर: कोई ब्याज देय नहीं; यदि ब्याज दिया गया है तो वह मूलधन से काट लिया जाएगा।',
      '1 से 2 वर्ष के बीच: मूलधन में से 1.5% की कटौती।',
      '2 वर्ष उपरांत: मूलधन में से 1.0% की कटौती।',
    ],
    taxTreatment: {
      section: 'Section 80C & Section 80TTB',
      sectionHi: 'धारा 80C एवं धारा 80TTB',
      details: [
        'Deposit qualifies for Section 80C deduction up to ₹1.5 Lakh.',
        'Senior citizens can claim deduction up to ₹50,000 on interest income under Section 80TTB.',
        'TDS threshold is ₹1,00,000 under Section 194A (Finance Act 2025). Form 15H can be submitted if total income is below taxable limits.',
      ],
      detailsHi: [
        'जमा राशि पर धारा 80C के तहत ₹1.5 लाख तक की कर छूट मिलती है।',
        'वरिष्ठ नागरिक धारा 80TTB के तहत ₹50,000 तक के ब्याज पर कर कटौती का दावा कर सकते हैं।',
        'धारा 194A के तहत टीडीएस सीमा ₹1,00,000 है (वित्त अधिनियम 2025)। कर सीमा से कम आय होने पर फॉर्म 15H जमा कर सकते हैं।',
      ],
    },
    importantConditions: [
      'Maximum deposit limit of ₹30 Lakh applies across all SCSS accounts held by an individual.',
      'Accounts can be held jointly only with a spouse.',
    ],
    importantConditionsHi: [
      'प्रति व्यक्ति सभी एससीएसएस खातों को मिलाकर अधिकतम निवेश सीमा ₹30 लाख है।',
      'संयुक्त खाता केवल पति/पत्नी के साथ ही खोला जा सकता है।',
    ],
    faqs: [
      {
        question: 'What is the quarterly interest on ₹30 Lakh in SCSS?',
        questionHi: 'एससीएसएस में ₹30 लाख पर कितना त्रैमासिक ब्याज मिलता है?',
        answer:
          'At the current 8.2% rate, an investment of ₹30 Lakh yields exactly ₹61,500 every quarter (₹2,46,000 per year).',
        answerHi:
          'वर्तमान 8.2% ब्याज दर पर ₹30 लाख के निवेश पर ठीक ₹61,500 प्रति तिमाही (₹2,46,000 प्रति वर्ष) मिलता है।',
      },
    ],
  },

  ppf: {
    id: 'ppf',
    slug: 'public-provident-fund',
    calculatorSlug: 'ppf',
    title: 'Public Provident Fund (PPF)',
    titleHi: 'लोक भविष्य निधि खाता (PPF)',
    tagline: '15-Year sovereign wealth creator with complete triple tax-exempt (EEE) status',
    taglineHi: '15-वर्षीय सुरक्षित संपत्ति निर्माण और शत-प्रतिशत कर-मुक्त (EEE) लाभ',
    overview:
      'The Public Provident Fund is India’s flagship long-term tax-sheltered investment scheme. Backed by a sovereign guarantee, PPF offers complete EEE (Exempt-Exempt-Exempt) tax benefits: your contribution is deductible, the interest accrued is completely tax-free, and the maturity amount is 100% tax-free.',
    overviewHi:
      'पब्लिक प्रॉविडेंट फंड (PPF) भारत की प्रमुख दीर्घकालिक कर-मुक्त निवेश योजना है। संप्रभु गारंटी से सुरक्षित पीपीएफ खाता EEE (Exempt-Exempt-Exempt) कर लाभ प्रदान करता है: जमा पर धारा 80C छूट, अर्जित ब्याज पूरी तरह कर-मुक्त और परिपक्वता राशि भी 100% कर-मुक्त।',
    eligibility: [
      'Any resident Indian individual in their own name.',
      'Guardian on behalf of a minor.',
      'Non-Resident Indians (NRIs) and Hindu Undivided Families (HUFs) cannot open new accounts.',
    ],
    eligibilityHi: [
      'कोई भी निवासी भारतीय नागरिक अपने स्वयं के नाम से।',
      'नाबालिग की ओर से अभिभावक।',
      'अनिवासी भारतीय (NRI) एवं हिंदू अविभाजित परिवार (HUF) नया खाता नहीं खोल सकते।',
    ],
    investmentLimits: {
      min: '₹500 per financial year',
      minHi: '₹500 प्रति वित्तीय वर्ष',
      max: '₹1,50,000 per financial year',
      maxHi: '₹1,50,000 प्रति वित्तीय वर्ष',
      multiples: 'Multiples of ₹50',
      multiplesHi: '₹50 के गुणकों में',
    },
    interestDetails: {
      rate: '7.1% p.a.',
      effectiveQuarter: 'FY 2020-21 to Present',
      effectiveQuarterHi: 'वित्त वर्ष 2020-21 से वर्तमान',
      compounding: 'Compounded annually, credited March 31',
      compoundingHi: 'वार्षिक चक्रवृद्धि, 31 मार्च को खाते में जमा',
      payout: 'Accumulated and paid at maturity',
      payoutHi: 'संचित होकर परिपक्वता पर देय',
    },
    tenureAndMaturity:
      '15 full Financial Years from the end of the opening financial year (Rule 9). Extendable in 5-year blocks.',
    tenureAndMaturityHi:
      'खाता खोलने वाले वित्तीय वर्ष की समाप्ति से 15 पूर्ण वित्तीय वर्ष (नियम 9)। 5-5 वर्ष के ब्लॉकों में विस्तारणीय।',
    prematureClosure: [
      'Allowed after 5 financial years under specific grounds (serious life-threatening illness or higher education).',
      'Interest penalty of 1% is deducted for the entire operating period upon premature closure.',
    ],
    prematureClosureHi: [
      '5 वित्तीय वर्ष पूर्ण होने के बाद केवल विशेष परिस्थितियों (गंभीर बीमारी अथवा उच्च शिक्षा) में अनुमत।',
      'समयपूर्व बंदी पर पूरे कार्यकाल हेतु ब्याज दर में 1% की कटौती की जाती है।',
    ],
    taxTreatment: {
      section: 'Triple Tax-Exempt Status (EEE)',
      sectionHi: 'शत-प्रतिशत कर-मुक्त स्थिति (EEE)',
      details: [
        'Investment qualifies for Section 80C tax deduction up to ₹1.5 Lakh.',
        'Annual accrued interest is completely exempt from income tax.',
        'Maturity proceeds and partial withdrawals are 100% tax-free under Section 10(11).',
      ],
      detailsHi: [
        'जमा राशि पर धारा 80C के तहत ₹1.5 लाख तक की कर कटौती।',
        'वार्षिक संचित ब्याज पूरी तरह आयकर से मुक्त है।',
        'धारा 10(11) के तहत परिपक्वता राशि और आंशिक निकासी 100% कर-मुक्त।',
      ],
    },
    importantConditions: [
      '5th of the Month Rule: Deposits made on or before the 5th day of each month earn interest for that entire month.',
      'Loan facility available from 3rd financial year up to 6th financial year.',
      'Partial withdrawal permitted from 7th financial year onwards.',
    ],
    importantConditionsHi: [
      '5 तारीख का नियम: माह की 5 तारीख या उससे पहले जमा की गई राशि पर ही उस माह का ब्याज मिलता है।',
      'तीसरे वित्तीय वर्ष से छठे वित्तीय वर्ष तक ऋण सुविधा उपलब्ध।',
      'सातवें वित्तीय वर्ष से आंशिक निकासी की सुविधा।',
    ],
    faqs: [
      {
        question: 'Why should I deposit in PPF before 5th of April each year?',
        questionHi: 'मुझे प्रतिवर्ष 5 अप्रैल से पहले पीपीएफ में पैसा क्यों जमा करना चाहिए?',
        answer:
          'Depositing on or before 5th April ensures your entire contribution earns interest for all 12 calendar months of that financial year, maximizing compounding returns.',
        answerHi:
          '5 अप्रैल या उससे पहले जमा करने से आपकी पूरी राशि पर पूरे 12 महीनों का ब्याज मिलता है, जिससे चक्रवृद्धि लाभ अधिकतम होता है।',
      },
    ],
  },

  ssa: {
    id: 'ssa',
    slug: 'sukanya-samriddhi-account',
    calculatorSlug: 'ssa',
    title: 'Sukanya Samriddhi Account (SSA / SSY)',
    titleHi: 'सुकन्या समृद्धि खाता (SSA / SSY)',
    tagline: 'Highest government small savings interest rate dedicated to girl child empowerment',
    taglineHi: 'बालिकाओं के उज्ज्वल भविष्य हेतु सरकार की सर्वाधिक ब्याज दर वाली EEE योजना',
    overview:
      'Sukanya Samriddhi Account is a government-backed savings scheme launched under the "Beti Bachao, Beti Padhao" campaign. It carries the highest small savings rate among all Post Office schemes, with complete EEE tax exemption, designed to fund a girl child’s higher education and marriage.',
    overviewHi:
      'सुकन्या समृद्धि खाता "बेटी बचाओ, बेटी पढ़ाओ" अभियान के अंतर्गत प्रारंभ की गई एक विशेष बचत योजना है। यह डाकघर की सभी योजनाओं में सर्वाधिक ब्याज दर प्रदान करती है और बालिका की उच्च शिक्षा व विवाह हेतु पूरी तरह कर-मुक्त (EEE) संपत्ति तैयार करती है।',
    eligibility: [
      'Girl child from birth up to 10 years of age.',
      'Account opened and operated by a parent or legal guardian.',
      'Maximum 2 accounts per family (exception for twins or triplets born in first or second delivery).',
    ],
    eligibilityHi: [
      'जन्म से लेकर 10 वर्ष तक की आयु की बालिका।',
      'माता-पिता अथवा कानूनी अभिभावक द्वारा संचालित।',
      'प्रति परिवार अधिकतम 2 खाते (जुड़वां या तीन बच्चियां होने पर छूट)।',
    ],
    investmentLimits: {
      min: '₹250 per financial year',
      minHi: '₹250 प्रति वित्तीय वर्ष',
      max: '₹1,50,00,000 per financial year',
      maxHi: '₹1,50,000 प्रति वित्तीय वर्ष',
      multiples: 'Multiples of ₹50',
      multiplesHi: '₹50 के गुणकों में',
    },
    interestDetails: {
      rate: '8.2% p.a.',
      effectiveQuarter: 'Q4 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 4 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Compounded annually, credited March 31',
      compoundingHi: 'वार्षिक चक्रवृद्धि, 31 मार्च को खाते में जमा',
      payout: 'Paid at maturity after 21 years',
      payoutHi: '21 वर्ष बाद परिपक्वता पर एकमुश्त भुगतान',
    },
    tenureAndMaturity:
      'Matures after 21 years from account opening. Deposits required only for the first 15 years.',
    tenureAndMaturityHi:
      'खाता खोलने की तिथि से 21 वर्ष बाद परिपक्वता। जमा केवल पहले 15 वर्षों तक अनिवार्य है।',
    prematureClosure: [
      'Permitted upon marriage of the girl child after she attains 18 years of age.',
      'Allowed in extreme compassionate grounds (death of girl child or medical treatment of life-threatening disease).',
    ],
    prematureClosureHi: [
      'बालिका की आयु 18 वर्ष पूर्ण होने के बाद विवाह के समय समयपूर्व बंदी अनुमत।',
      'अत्यंत गंभीर परिस्थितियों (बच्ची की मृत्यु अथवा जानलेवा बीमारी के उपचार) में अनुमत।',
    ],
    taxTreatment: {
      section: 'Exempt-Exempt-Exempt (EEE)',
      sectionHi: 'शत-प्रतिशत कर-मुक्त स्थिति (EEE)',
      details: [
        'Qualifies for Section 80C tax deduction up to ₹1.5 Lakh.',
        'Annual compound interest is completely tax-free.',
        'Maturity payout is 100% tax-free under Section 10(10D).',
      ],
      detailsHi: [
        'धारा 80C के तहत ₹1.5 लाख तक की वार्षिक कर छूट।',
        'वार्षिक चक्रवृद्धि ब्याज पूरी तरह कर-मुक्त।',
        'धारा 10(10D) के तहत परिपक्वता भुगतान शत-प्रतिशत कर-मुक्त।',
      ],
    },
    importantConditions: [
      'Deposits required only for first 15 years; account continues earning 8.2% compound interest during years 16 to 21 without further deposits.',
      'Partial withdrawal up to 50% of the previous financial year balance allowed after the girl turns 18 for higher education.',
    ],
    importantConditionsHi: [
      'जमा केवल प्रथम 15 वर्षों तक करना होता है; वर्ष 16 से 21 तक बिना किसी जमा के 8.2% की दर से चक्रवृद्धि ब्याज मिलता रहता है।',
      'बालिका के 18 वर्ष पूर्ण होने पर उच्च शिक्षा हेतु पिछले वर्ष के शेष का 50% तक आंशिक निकासी अनुमत।',
    ],
    faqs: [
      {
        question: 'Do I have to deposit money for all 21 years in Sukanya Samriddhi?',
        questionHi: 'क्या सुकन्या समृद्धि खाते में पूरे 21 साल तक पैसे जमा करने पड़ते हैं?',
        answer:
          'No! Deposits are required only for the first 15 years. From Year 16 to Year 21, you do not deposit any money, but the account continues to compound interest.',
        answerHi:
          'नहीं! जमा केवल प्रथम 15 वर्षों तक ही करना होता है। वर्ष 16 से 21 तक आपको कोई पैसा जमा नहीं करना होता, फिर भी ब्याज लगातार जुड़ता रहता है।',
      },
    ],
  },

  nsc: {
    id: 'nsc',
    slug: 'national-savings-certificate',
    calculatorSlug: 'nsc',
    title: 'National Savings Certificate (NSC VIII Issue)',
    titleHi: 'राष्ट्रीय बचत पत्र (VIII निर्गम) (NSC)',
    tagline: '5-Year cumulative savings certificate with Section 80C tax deduction on deemed reinvestment',
    taglineHi: '5-वर्षीय संचयी बचत पत्र, पुनर्निवेशित ब्याज पर भी धारा 80C कर छूट',
    overview:
      'National Savings Certificate (VIII Issue) is a popular government-backed fixed income certificate with a 5-year lock-in period. Compounded annually, interest accrued during the first 4 years is deemed reinvested, entitling the investor to Section 80C tax deductions each year.',
    overviewHi:
      'राष्ट्रीय बचत पत्र (VIII निर्गम) 5 वर्ष की लॉक-इन अवधि वाला एक लोकप्रिय निश्चित आय प्रमाणपत्र है। इसमें ब्याज वार्षिक चक्रवृद्धि से जुड़ता है। प्रथम 4 वर्षों में अर्जित ब्याज पुनर्निवेशित माना जाता है, जिससे प्रतिवर्ष धारा 80C के तहत अतिरिक्त कर छूट का लाभ मिलता है।',
    eligibility: [
      'Single resident Indian adult.',
      'Joint account with up to 3 adults.',
      'Guardian on behalf of a minor.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 3 वयस्कों द्वारा संयुक्त खाता।',
      'नाबालिग की ओर से अभिभावक।',
    ],
    investmentLimits: {
      min: '₹1,000',
      minHi: '₹1,000',
      max: 'No upper limit',
      maxHi: 'कोई अधिकतम सीमा नहीं',
      multiples: 'Multiples of ₹100',
      multiplesHi: '₹100 के गुणकों में',
    },
    interestDetails: {
      rate: '7.7% p.a.',
      effectiveQuarter: 'Q1 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 1 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Annually compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'Paid at maturity after 5 years',
      payoutHi: '5 वर्ष पूर्ण होने पर परिपक्वता पर एकमुश्त देय',
    },
    tenureAndMaturity: '5 Years from the date of purchase.',
    tenureAndMaturityHi: 'खरीद की तारीख से ठीक 5 वर्ष।',
    prematureClosure: [
      'Not permitted before 5 years except on death of the holder, forfeiture by pledgee, or court order.',
    ],
    prematureClosureHi: [
      'खाताधारक की मृत्यु, गिरवीदार द्वारा जब्ती अथवा न्यायालय के आदेश के अतिरिक्त 5 वर्ष से पूर्व निकासी अनुमत नहीं है।',
    ],
    taxTreatment: {
      section: 'Section 80C (Principal & Deemed Reinvestment)',
      sectionHi: 'धारा 80C (मूलधन एवं पुनर्निवेशित ब्याज)',
      details: [
        'Initial investment qualifies for Section 80C deduction up to ₹1.5 Lakh.',
        'Interest accrued in Years 1 to 4 is deemed reinvested and also qualifies for Section 80C deduction in respective financial years.',
        'Interest earned in the 5th (final) year cannot be reinvested and is taxable as income.',
      ],
      detailsHi: [
        'आरंभिक निवेश पर धारा 80C के तहत ₹1.5 लाख तक की कर छूट मिलती है।',
        'वर्ष 1 से 4 में संचित ब्याज पुनर्निवेशित मानकर संबंधित वित्तीय वर्ष में 80C छूट हेतु पात्र है।',
        '5वें (अंतिम) वर्ष का ब्याज पुनर्निवेशित नहीं माना जाता और वह कर योग्य होता है।',
      ],
    },
    importantConditions: [
      'Can be pledged as collateral security to banks and government institutions.',
      'Transferable once from one person to another with official Postmaster approval.',
    ],
    importantConditionsHi: [
      'बैंकों और सरकारी संस्थानों में ऋण हेतु प्रतिभूति (कोलैटरल) के रूप में गिरवी रखा जा सकता है।',
      'डाकपाल की स्वीकृति से एक व्यक्ति से दूसरे व्यक्ति को एक बार हस्तांतरणीय।',
    ],
    faqs: [
      {
        question: 'How does deemed reinvestment work in NSC for tax saving?',
        questionHi: 'एनएससी में कर बचत हेतु पुनर्निवेशित ब्याज का क्या नियम है?',
        answer:
          'Because you do not withdraw interest annually, the Income Tax Act treats the interest accrued in Years 1–4 as fresh investments in NSC, allowing you to claim Section 80C deductions on that interest.',
        answerHi:
          'क्योंकि आप वार्षिक ब्याज नहीं निकालते, आयकर अधिनियम प्रथम 4 वर्षों के संचित ब्याज को एनएससी में नया निवेश मानता है, जिससे उस ब्याज पर भी धारा 80C की छूट मिलती है।',
      },
    ],
  },

  kvp: {
    id: 'kvp',
    slug: 'kisan-vikas-patra',
    calculatorSlug: 'kvp',
    title: 'Kisan Vikas Patra (KVP)',
    titleHi: 'किसान विकास पत्र (KVP)',
    tagline: 'Guaranteed 2x doubling of investment in 115 months with sovereign security',
    taglineHi: 'संप्रभु सुरक्षा के साथ 115 माह में निवेश की 100% गारंटीकृत दोगुनी राशि',
    overview:
      'Kisan Vikas Patra is a trusted government-guaranteed doubling scheme. The deposited amount doubles on completion of the officially notified period (currently 115 months / 9 years 7 months) at 7.5% p.a., with liquidity available through premature encashment after 2.5 years.',
    overviewHi:
      'किसान विकास पत्र भारत सरकार की एक अत्यधिक लोकप्रिय और भरोसेमंद बचत योजना है। इसमें जमा की गई राशि अधिसूचित अवधि (वर्तमान में 115 माह / 9 वर्ष 7 माह) पूर्ण होने पर ठीक दोगुनी हो जाती है। 2.5 वर्ष बाद समयपूर्व भुनाने की सुविधा भी उपलब्ध है।',
    eligibility: [
      'Single resident Indian adult.',
      'Joint account with up to 3 adults.',
      'Guardian on behalf of a minor or person of unsound mind.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 3 वयस्कों द्वारा संयुक्त खाता।',
      'नाबालिग अथवा मानसिक रूप से अस्वस्थ व्यक्ति हेतु अभिभावक।',
    ],
    investmentLimits: {
      min: '₹1,000',
      minHi: '₹1,000',
      max: 'No upper limit',
      maxHi: 'कोई अधिकतम सीमा नहीं',
      multiples: 'Denominations of ₹1,000, ₹5,000, ₹10,000, ₹50,000',
      multiplesHi: '₹1,000, ₹5,000, ₹10,000, ₹50,000 के प्रमाणपत्रों में',
    },
    interestDetails: {
      rate: '7.5% p.a. (Doubles in 115 Months)',
      effectiveQuarter: 'Q1 FY 2023-24 to Present',
      effectiveQuarterHi: 'तिमाही 1 वित्त वर्ष 2023-24 से वर्तमान',
      compounding: 'Annually compounded',
      compoundingHi: 'वार्षिक चक्रवृद्धि',
      payout: 'Paid at maturity (Doubles principal)',
      payoutHi: 'परिपक्वता पर एकमुश्त देय (मूलधन का दोगुना)',
    },
    tenureAndMaturity: '115 Months (9 Years 7 Months) to double the investment.',
    tenureAndMaturityHi: 'निवेश को दोगुना करने हेतु 115 माह (9 वर्ष 7 माह)।',
    prematureClosure: [
      'Premature encashment is permitted after a lock-in period of 2 years and 6 months (30 months).',
      'Pre-fixed slab values notified by India Post are payable upon premature encashment.',
    ],
    prematureClosureHi: [
      '2 वर्ष 6 माह (30 माह) की लॉक-इन अवधि के बाद समयपूर्व भुनाना पूरी तरह अनुमत है।',
      'समयपूर्व भुनाने पर डाक विभाग द्वारा अधिसूचित पूर्व-निर्धारित स्लैब मूल्य का भुगतान किया जाता है।',
    ],
    taxTreatment: {
      section: 'Taxable under Income from Other Sources',
      sectionHi: 'अन्य स्रोतों से आय के अंतर्गत कर योग्य',
      details: [
        'KVP does not qualify for Section 80C tax deduction.',
        'Interest is taxable in the hands of the depositor.',
        'Interest can be declared annually in ITR on accrual basis or in full upon maturity on receipt basis.',
      ],
      detailsHi: [
        'केवीपी पर धारा 80C के तहत कोई कर छूट नहीं मिलती।',
        'अर्जित ब्याज जमाकर्ता की आय में शामिल होकर कर योग्य होता है।',
        'आयकर विवरण (ITR) में ब्याज को संचित आधार (वार्षिक) अथवा परिपक्वता पर प्राप्ति आधार पर दर्शाया जा सकता है।',
      ],
    },
    importantConditions: [
      'No maximum deposit limit.',
      'Freely transferable across post offices and between eligible individuals.',
      'Can be pledged as security to banks for loan facilities.',
    ],
    importantConditionsHi: [
      'निवेश की कोई अधिकतम सीमा नहीं है।',
      'डाकघरों के बीच और पात्र व्यक्तियों के बीच हस्तांतरणीय।',
      'ऋण प्राप्ति हेतु बैंकों में प्रतिभूति के रूप में गिरवी रखा जा सकता है।',
    ],
    faqs: [
      {
        question: 'How long does KVP take to double my money right now?',
        questionHi: 'वर्तमान में केवीपी में मेरा पैसा कितने समय में दोगुना होता है?',
        answer:
          'Under the current notified notification at 7.5% p.a., your investment doubles in exactly 115 months (9 years and 7 months).',
        answerHi:
          'वर्तमान 7.5% वार्षिक दर के अनुसार आपका पैसा ठीक 115 माह (9 वर्ष 7 माह) में दोगुना हो जाता है।',
      },
    ],
  },

  sb: {
    id: 'sb',
    slug: 'savings-account',
    calculatorSlug: 'sb',
    title: 'Post Office Savings Account (PO-SB)',
    titleHi: 'डाकघर बचत खाता (PO-SB)',
    tagline: 'Completely liquid sovereign savings account with Section 80TTA/80TTB tax benefits',
    taglineHi: 'धारा 80TTA/80TTB कर छूट के साथ पूर्णतः सुरक्षित व तरल डाकघर बचत खाता',
    overview:
      'The Post Office Savings Account is a secure liquid deposit facility provided across all 1.5+ Lakh post offices in India. It offers guaranteed 4.0% interest per annum calculated monthly on the minimum balance between the 10th and the last day of each month and credited annually on March 31.',
    overviewHi:
      'डाकघर बचत खाता भारत के सभी 1.5 लाख से अधिक डाकघरों में उपलब्ध एक सुरक्षित और तरल बचत खाता है। इसमें माह की 10 तारीख और अंतिम दिन के बीच के न्यूनतम शेष पर 4.0% की दर से ब्याज की गणना होती है, जो प्रतिवर्ष 31 मार्च को खाते में जमा की जाती है।',
    eligibility: [
      'Single resident Indian adult.',
      'Joint account with up to 2 adults.',
      'Guardian on behalf of a minor.',
      'Minor aged above 10 years in their own name.',
    ],
    eligibilityHi: [
      'एकल वयस्क भारतीय नागरिक।',
      'अधिकतम 2 वयस्कों द्वारा संयुक्त खाता।',
      'नाबालिग की ओर से अभिभावक।',
      '10 वर्ष से अधिक आयु का नाबालिग अपने स्वयं के नाम से।',
    ],
    investmentLimits: {
      min: '₹500 opening balance',
      minHi: '₹500 न्यूनतम खाता शेष',
      max: 'No upper limit',
      maxHi: 'कोई अधिकतम सीमा नहीं',
      multiples: 'Any amount',
      multiplesHi: 'कोई भी राशि',
    },
    interestDetails: {
      rate: '4.0% p.a.',
      effectiveQuarter: 'Ongoing',
      effectiveQuarterHi: 'निरंतर प्रभावी',
      compounding: 'Simple Interest calculated monthly, credited March 31',
      compoundingHi: 'साधारण ब्याज, मासिक गणना, 31 मार्च को वार्षिक देय',
      payout: 'Credited directly to account on March 31',
      payoutHi: '31 मार्च को सीधे खाते में जमा',
    },
    tenureAndMaturity: 'Open-ended. Complete liquidity with any-time deposit and withdrawal.',
    tenureAndMaturityHi: 'खुली अवधि। किसी भी समय जमा और निकासी की पूर्ण स्वतंत्रता।',
    prematureClosure: ['Can be closed at any time without penalty.'],
    prematureClosureHi: ['किसी भी समय बिना किसी जुर्माने के खाता बंद किया जा सकता है।'],
    taxTreatment: {
      section: 'Section 80TTA & Section 80TTB',
      sectionHi: 'धारा 80TTA एवं धारा 80TTB',
      details: [
        'Interest earned up to ₹10,000 per financial year is completely tax-exempt under Section 80TTA.',
        'Senior citizens (aged 60+) can claim tax exemption up to ₹50,000 on interest income under Section 80TTB.',
      ],
      detailsHi: [
        'धारा 80TTA के तहत प्रति वित्तीय वर्ष ₹10,000 तक का ब्याज पूरी तरह कर-मुक्त है।',
        'वरिष्ठ नागरिक धारा 80TTB के तहत ₹50,000 तक के ब्याज पर कर छूट प्राप्त कर सकते हैं।',
      ],
    },
    importantConditions: [
      'Minimum balance of ₹500 must be maintained. If balance drops below ₹500, a maintenance fee is deducted and no interest is allowed for that month.',
      'Account becomes silent/dormant if no transaction takes place for 3 continuous financial years.',
    ],
    importantConditionsHi: [
      'न्यूनतम ₹500 का शेष बनाए रखना अनिवार्य है। ₹500 से कम होने पर रखरखाव शुल्क कटता है और उस माह का ब्याज नहीं मिलता।',
      'लगातार 3 वित्तीय वर्षों तक कोई लेन-देन न होने पर खाता निष्क्रिय (साइलेंट) हो जाता है।',
    ],
    faqs: [
      {
        question: 'Why did I not receive interest for a specific month in PO-SB?',
        questionHi: 'मुझे किसी खास महीने में डाकघर बचत खाते का ब्याज क्यों नहीं मिला?',
        answer:
          'Under official Post Office rules, if your account balance drops below ₹500 at any point between the 10th and the last day of that calendar month, zero interest is credited for that month.',
        answerHi:
          'डाकघर के नियमों के अनुसार यदि माह की 10वीं तारीख और अंतिम दिन के बीच आपका खाता शेष किसी भी समय ₹500 से नीचे जाता है, तो उस महीने कोई ब्याज नहीं दिया जाता।',
      },
    ],
  },
};

export function getSchemeInfoBySlug(slug: string): SchemeDetailedInfo | undefined {
  return Object.values(schemesDetailedInfo).find((s) => s.slug === slug);
}

export function getAllSchemeSlugs(): string[] {
  return Object.values(schemesDetailedInfo).map((s) => s.slug);
}

