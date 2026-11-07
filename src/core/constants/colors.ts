/**
 * Dak Help Design Tokens & Brand Colors
 * Modeled directly from the reference Android application (AppColors.dart).
 */
export const AppColors = {
  // Brand Identity Core
  postalRed: '#D85B48',
  postalAmber: '#F3B83F',
  deepGreen: '#245B50',
  postalGreen: '#245B50',
  warmIvory: '#F7F1E8',
  charcoal: '#303B38',

  // Light Theme Palette
  light: {
    primary: '#C44836',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FCEBE8',
    onPrimaryContainer: '#4A150E',

    secondary: '#245B50',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D7ECE7',
    onSecondaryContainer: '#0E2C26',

    tertiary: '#9E6C0C',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FDF2DC',
    onTertiaryContainer: '#3E2B00',

    surface: '#FDFBF8',
    surfaceDim: '#F3EDE3',
    surfaceBright: '#FFFFFF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FAF5EE',
    surfaceContainer: '#F4EDE3', // Warm Ivory tonal card base
    surfaceContainerHigh: '#EFE7DB',
    surfaceContainerHighest: '#E8DFD1',

    onSurface: '#202927',
    onSurfaceVariant: '#4F5C58',
    outline: '#8C9B97',
    outlineVariant: '#D0DCD8',

    disclaimerBg: '#FFF7EB',
    disclaimerBorder: '#F4D09A',
    disclaimerText: '#6B4500',
  },

  // Dark Theme Palette
  dark: {
    primary: '#E88070',
    onPrimary: '#44140D',
    primaryContainer: '#68281F',
    onPrimaryContainer: '#FFDAD4',

    secondary: '#72BCAD',
    onSecondary: '#08322B',
    secondaryContainer: '#174A40',
    onSecondaryContainer: '#A4E0D1',

    tertiary: '#F3B83F',
    onTertiary: '#412D00',
    tertiaryContainer: '#5D4200',
    onTertiaryContainer: '#FFE09E',

    surface: '#181F1D', // Deep Charcoal
    surfaceDim: '#141918',
    surfaceBright: '#2E3835',
    surfaceContainerLowest: '#111514',
    surfaceContainerLow: '#1D2422',
    surfaceContainer: '#232B29', // Elevated dark tonal card
    surfaceContainerHigh: '#2C3532',
    surfaceContainerHighest: '#37423E',

    onSurface: '#F7F1E8', // Warm Ivory typography
    onSurfaceVariant: '#BAC5C2',
    outline: '#85938F',
    outlineVariant: '#44504D',

    disclaimerBg: '#2C2213',
    disclaimerBorder: '#64481C',
    disclaimerText: '#FFE2B3',
  },
} as const;
