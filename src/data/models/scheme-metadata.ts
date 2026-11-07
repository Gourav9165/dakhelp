import { SchemeId } from './scheme-type';

export interface SchemeMetadata {
  id: SchemeId;
  tenureDescription: string;
  tenureDescriptionHi: string;
  compoundingFrequency: string;
  compoundingFrequencyHi: string;
  minimumDeposit: number;
  maximumDeposit: number | null;
  depositMultipleOf: number;
  taxBenefitSection: string | null;
  taxBenefitSectionHi: string | null;
  highlights: string[];
  highlightsHi: string[];
}

export const SchemeMetadataRegistry: Record<SchemeId, SchemeMetadata> = {
  sb: {
    id: 'sb',
    tenureDescription: 'Open-ended (Liquid)',
    tenureDescriptionHi: 'खुली अवधि (पूर्णतः तरल)',
    compoundingFrequency: 'Simple interest credited annually on March 31',
    compoundingFrequencyHi: 'साधारण ब्याज, 31 मार्च को वार्षिक देय',
    minimumDeposit: 500,
    maximumDeposit: null,
    depositMultipleOf: 10,
    taxBenefitSection: '80TTA (up to ₹10,000) / 80TTB (up to ₹50,000 for seniors)',
    taxBenefitSectionHi: 'धारा 80TTA (₹10,000 तक) / 80TTB (वरिष्ठों हेतु ₹50,000 तक)',
    highlights: [
      'Interest calculated on minimum balance between 10th and month-end',
      'No interest allowed for months where balance dips below ₹500',
      'ATM, cheque book, and online banking facilities available',
    ],
    highlightsHi: [
      'ब्याज की गणना माह की 10वीं तारीख और अंतिम दिन के बीच न्यूनतम शेष पर की जाती है',
      'यदि किसी माह में शेष ₹500 से नीचे जाता है, तो उस माह का कोई ब्याज नहीं मिलता',
      'एटीएम, चेक बुक और नेट बैंकिंग सुविधाएं उपलब्ध',
    ],
  },
  td: {
    id: 'td',
    tenureDescription: '1, 2, 3, or 5 Years',
    tenureDescriptionHi: '1, 2, 3 या 5 वर्ष',
    compoundingFrequency: 'Quarterly compounding, payable annually',
    compoundingFrequencyHi: 'त्रैमासिक चक्रवृद्धि, वार्षिक ब्याज भुगतान',
    minimumDeposit: 1000,
    maximumDeposit: null,
    depositMultipleOf: 100,
    taxBenefitSection: '80C (5-Year TD only)',
    taxBenefitSectionHi: 'धारा 80C (केवल 5-वर्षीय टीडी पर)',
    highlights: [
      'Quarterly compounding with annual interest payout',
      'Multiples of ₹100 with no upper deposit limit',
      '5-Year tenure qualifies for Section 80C tax deduction',
    ],
    highlightsHi: [
      'त्रैमासिक चक्रवृद्धि ब्याज और वार्षिक ब्याज भुगतान',
      '₹100 के गुणकों में जमा, कोई अधिकतम सीमा नहीं',
      '5-वर्षीय सावधि जमा धारा 80C आयकर छूट हेतु पात्र',
    ],
  },
  rd: {
    id: 'rd',
    tenureDescription: '5 Years (60 monthly deposits)',
    tenureDescriptionHi: '5 वर्ष (60 मासिक किस्तें)',
    compoundingFrequency: 'Quarterly compounding',
    compoundingFrequencyHi: 'त्रैमासिक चक्रवृद्धि',
    minimumDeposit: 100,
    maximumDeposit: null,
    depositMultipleOf: 10,
    taxBenefitSection: null,
    taxBenefitSectionHi: null,
    highlights: [
      '60 monthly instalments with quarterly compounding',
      'Minimum ₹100 per month and multiples of ₹10',
      'Interest rate locked on account opening date for full 5 years',
    ],
    highlightsHi: [
      'त्रैमासिक चक्रवृद्धि के साथ 60 मासिक किस्तें',
      'न्यूनतम ₹100 प्रति माह एवं ₹10 के गुणकों में',
      'खाता खोलने की तिथि पर ब्याज दर पूरे 5 वर्षों के लिए सुरक्षित/लॉक',
    ],
  },
  mis: {
    id: 'mis',
    tenureDescription: '5 Years',
    tenureDescriptionHi: '5 वर्ष',
    compoundingFrequency: 'Monthly interest payout',
    compoundingFrequencyHi: 'मासिक ब्याज भुगतान',
    minimumDeposit: 1000,
    maximumDeposit: 900000,
    depositMultipleOf: 1000,
    taxBenefitSection: null,
    taxBenefitSectionHi: null,
    highlights: [
      'Monthly interest credited directly to Savings Account',
      'Maximum ₹9 Lakh for single, ₹15 Lakh for joint accounts',
      'Full principal refunded upon completion of 5-year tenure',
    ],
    highlightsHi: [
      'मासिक ब्याज सीधे डाकघर बचत खाते में जमा होता है',
      'एकल खाते हेतु अधिकतम ₹9 लाख, संयुक्त खाते हेतु ₹15 लाख',
      '5 वर्ष की अवधि पूर्ण होने पर मूलधन शत-प्रतिशत वापस',
    ],
  },
  scss: {
    id: 'scss',
    tenureDescription: '5 Years (extendable by 3 years)',
    tenureDescriptionHi: '5 वर्ष (3 वर्षों के लिए विस्तारणीय)',
    compoundingFrequency: 'Quarterly interest payout',
    compoundingFrequencyHi: 'त्रैमासिक ब्याज भुगतान',
    minimumDeposit: 1000,
    maximumDeposit: 3000000,
    depositMultipleOf: 1000,
    taxBenefitSection: '80C (deposit) & 80TTB (interest up to ₹50,000)',
    taxBenefitSectionHi: 'धारा 80C (मूलधन) एवं 80TTB (ब्याज ₹50,000 तक)',
    highlights: [
      'Available for individuals aged 60+ (55+ for VRS retirees)',
      'Quarterly interest paid on 1st of April, July, Oct, and Jan',
      'Upper limit ₹30 Lakh per individual',
    ],
    highlightsHi: [
      '60 वर्ष से अधिक आयु (वीआरएस हेतु 55 वर्ष) के नागरिकों के लिए',
      'अप्रैल, जुलाई, अक्टूबर और जनवरी की 1 तारीख को ब्याज भुगतान',
      'प्रति व्यक्ति अधिकतम जमा सीमा ₹30 लाख',
    ],
  },
  ppf: {
    id: 'ppf',
    tenureDescription: '15 Financial Years (extendable in 5-year blocks)',
    tenureDescriptionHi: '15 वित्तीय वर्ष (5-वर्षीय ब्लॉकों में विस्तारणीय)',
    compoundingFrequency: 'Annually compounded (credited March 31)',
    compoundingFrequencyHi: 'वार्षिक चक्रवृद्धि (31 मार्च को जमा)',
    minimumDeposit: 500,
    maximumDeposit: 150000,
    depositMultipleOf: 50,
    taxBenefitSection: 'EEE (80C, tax-free interest, tax-free maturity)',
    taxBenefitSectionHi: 'EEE (धारा 80C, कर-मुक्त ब्याज, कर-मुक्त परिपक्वता)',
    highlights: [
      'Interest calculated on lowest balance between 5th and month-end',
      'Minimum ₹500, maximum ₹1.5 Lakh per financial year',
      'Completely tax-free returns under EEE status',
    ],
    highlightsHi: [
      'माह की 5वीं तारीख और अंतिम दिन के बीच न्यूनतम शेष पर ब्याज',
      'न्यूनतम ₹500 एवं अधिकतम ₹1.5 लाख प्रति वित्तीय वर्ष',
      'EEE स्थिति के अंतर्गत संपूर्ण रिटर्न पूरी तरह कर-मुक्त',
    ],
  },
  ssa: {
    id: 'ssa',
    tenureDescription: '21 Years (deposits for 15 years)',
    tenureDescriptionHi: '21 वर्ष (प्रथम 15 वर्षों तक जमा)',
    compoundingFrequency: 'Annually compounded (credited March 31)',
    compoundingFrequencyHi: 'वार्षिक चक्रवृद्धि (31 मार्च को जमा)',
    minimumDeposit: 250,
    maximumDeposit: 150000,
    depositMultipleOf: 50,
    taxBenefitSection: 'EEE (80C, tax-free interest, tax-free maturity)',
    taxBenefitSectionHi: 'EEE (धारा 80C, कर-मुक्त ब्याज, कर-मुक्त परिपक्वता)',
    highlights: [
      'For girl child up to age 10; deposits for first 15 years',
      'Account earns interest without deposit from year 16 to 21',
      'Matures after 21 years or upon marriage after age 18',
    ],
    highlightsHi: [
      '10 वर्ष तक की बालिकाओं हेतु; केवल प्रथम 15 वर्षों तक जमा',
      'वर्ष 16 से 21 तक बिना किसी जमा के चक्रवृद्धि ब्याज जारी',
      '21 वर्ष पूर्ण होने पर अथवा 18 वर्ष उपरांत विवाह पर परिपक्वता',
    ],
  },
  nsc: {
    id: 'nsc',
    tenureDescription: '5 Years',
    tenureDescriptionHi: '5 वर्ष',
    compoundingFrequency: 'Annually compounded, paid at maturity',
    compoundingFrequencyHi: 'वार्षिक चक्रवृद्धि, परिपक्वता पर देय',
    minimumDeposit: 1000,
    maximumDeposit: null,
    depositMultipleOf: 100,
    taxBenefitSection: '80C (initial deposit & deemed reinvested interest)',
    taxBenefitSectionHi: 'धारा 80C (मूलधन एवं वर्ष 1-4 का पुनर्निवेशित ब्याज)',
    highlights: [
      'Guaranteed return payable at maturity after 5 years',
      'Interest deemed reinvested for first 4 years qualifies for 80C',
      'Multiples of ₹100 with no maximum limit',
    ],
    highlightsHi: [
      '5 वर्ष बाद परिपक्वता पर गारंटीकृत एकमुश्त प्रतिफल',
      'प्रथम 4 वर्षों का संचित ब्याज पुनर्निवेशित मानकर 80C पात्र',
      '₹100 के गुणकों में जारी, कोई अधिकतम सीमा नहीं',
    ],
  },
  kvp: {
    id: 'kvp',
    tenureDescription: '115 Months (9 Years 7 Months)',
    tenureDescriptionHi: '115 माह (9 वर्ष 7 माह)',
    compoundingFrequency: 'Annually compounded',
    compoundingFrequencyHi: 'वार्षिक चक्रवृद्धि',
    minimumDeposit: 1000,
    maximumDeposit: null,
    depositMultipleOf: 100,
    taxBenefitSection: null,
    taxBenefitSectionHi: null,
    highlights: [
      'Guaranteed doubling of investment upon completion of 115 months',
      'Issued in denominations of ₹1,000, ₹5,000, ₹10,000, ₹50,000',
      'No maximum investment limit; transferable across post offices',
    ],
    highlightsHi: [
      '115 माह (9 वर्ष 7 माह) पूर्ण होने पर निवेश की गारंटीकृत दोगुनी राशि',
      '₹1,000, ₹5,000, ₹10,000, ₹50,000 के प्रमाणपत्रों में उपलब्ध',
      'कोई अधिकतम सीमा नहीं; डाकघरों के बीच आसानी से हस्तांतरणीय',
    ],
  },
};
