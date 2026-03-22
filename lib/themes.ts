/**
 * App theme definitions. Each theme provides a full set of CSS custom property
 * values (HSL without the `hsl()` wrapper) for both light and dark modes.
 *
 * The keys match the tokens defined in global.css / tailwind.config.js.
 */

export type ThemeColors = {
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
};

export type ThemeDefinition = {
  label: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
};

export const THEME_IDS = [
  'default',
  'dank',
  'retrowave',
  'pepe',
  'deepfried',
  'ocean',
  'liquidglass',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

/** Default — bold violet primary with clean neutral surfaces */
const defaultTheme: ThemeDefinition = {
  label: 'Default',
  description: 'Bold violet with clean neutrals',
  light: {
    '--background': '0 0% 98%',
    '--foreground': '240 10% 6%',
    '--card': '0 0% 100%',
    '--card-foreground': '240 10% 6%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '240 10% 6%',
    '--primary': '262 83% 58%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '240 5% 90%',
    '--secondary-foreground': '240 6% 10%',
    '--muted': '240 5% 94%',
    '--muted-foreground': '240 4% 46%',
    '--accent': '262 50% 93%',
    '--accent-foreground': '240 6% 10%',
    '--destructive': '0 84% 60%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '240 6% 90%',
    '--input': '240 6% 90%',
    '--ring': '262 83% 58%',
  },
  dark: {
    '--background': '240 10% 4%',
    '--foreground': '0 0% 98%',
    '--card': '240 10% 7%',
    '--card-foreground': '0 0% 98%',
    '--popover': '240 10% 7%',
    '--popover-foreground': '0 0% 98%',
    '--primary': '262 83% 65%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '240 4% 16%',
    '--secondary-foreground': '0 0% 98%',
    '--muted': '240 4% 16%',
    '--muted-foreground': '240 5% 55%',
    '--accent': '262 40% 18%',
    '--accent-foreground': '0 0% 98%',
    '--destructive': '0 72% 51%',
    '--destructive-foreground': '0 0% 98%',
    '--border': '240 4% 16%',
    '--input': '240 4% 16%',
    '--ring': '262 83% 65%',
  },
};

/**
 * Dank Mode — deep purple/violet with vivid neon magenta accents.
 * Saturated purple bg, neon magenta primary, glowing violet cards.
 */
const dankTheme: ThemeDefinition = {
  label: 'Dank Mode',
  description: 'Deep purple with neon accents',
  light: {
    '--background': '272 60% 78%',
    '--foreground': '270 80% 8%',
    '--card': '275 55% 88%',
    '--card-foreground': '270 80% 8%',
    '--popover': '275 55% 88%',
    '--popover-foreground': '270 80% 8%',
    '--primary': '290 100% 45%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '265 55% 68%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '270 45% 72%',
    '--muted-foreground': '270 50% 28%',
    '--accent': '290 50% 88%',
    '--accent-foreground': '280 80% 10%',
    '--destructive': '0 90% 50%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '270 50% 65%',
    '--input': '270 50% 68%',
    '--ring': '290 100% 45%',
  },
  dark: {
    '--background': '272 70% 6%',
    '--foreground': '280 40% 92%',
    '--card': '275 60% 14%',
    '--card-foreground': '280 40% 92%',
    '--popover': '275 60% 14%',
    '--popover-foreground': '280 40% 92%',
    '--primary': '290 100% 62%',
    '--primary-foreground': '272 70% 4%',
    '--secondary': '270 60% 25%',
    '--secondary-foreground': '280 40% 90%',
    '--muted': '272 50% 18%',
    '--muted-foreground': '275 30% 52%',
    '--accent': '290 45% 20%',
    '--accent-foreground': '280 40% 92%',
    '--destructive': '0 80% 55%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '272 50% 24%',
    '--input': '272 50% 20%',
    '--ring': '290 100% 62%',
  },
};

/**
 * Retro Wave — hot pink & cyan synthwave.
 * Deep magenta bg, screaming neon pink primary, electric cyan secondary.
 */
const retrowaveTheme: ThemeDefinition = {
  label: 'Retro Wave',
  description: 'Synthwave pink & cyan neon',
  light: {
    '--background': '325 55% 78%',
    '--foreground': '280 70% 8%',
    '--card': '330 50% 88%',
    '--card-foreground': '280 70% 8%',
    '--popover': '330 50% 88%',
    '--popover-foreground': '280 70% 8%',
    '--primary': '335 100% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '185 80% 55%',
    '--secondary-foreground': '200 90% 10%',
    '--muted': '320 45% 72%',
    '--muted-foreground': '300 40% 25%',
    '--accent': '335 60% 90%',
    '--accent-foreground': '280 70% 8%',
    '--destructive': '0 90% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '325 50% 65%',
    '--input': '325 45% 68%',
    '--ring': '335 100% 50%',
  },
  dark: {
    '--background': '280 75% 5%',
    '--foreground': '330 30% 92%',
    '--card': '285 60% 13%',
    '--card-foreground': '330 30% 92%',
    '--popover': '285 60% 13%',
    '--popover-foreground': '330 30% 92%',
    '--primary': '335 100% 58%',
    '--primary-foreground': '280 75% 4%',
    '--secondary': '185 85% 28%',
    '--secondary-foreground': '185 60% 88%',
    '--muted': '280 55% 16%',
    '--muted-foreground': '325 25% 52%',
    '--accent': '335 50% 18%',
    '--accent-foreground': '330 30% 92%',
    '--destructive': '0 80% 52%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '280 55% 22%',
    '--input': '280 55% 18%',
    '--ring': '335 100% 58%',
  },
};

/**
 * Pepe Green — bold meme-culture greens.
 * Rich green bg, vivid emerald primary, lime secondary, forest accents.
 */
const pepeTheme: ThemeDefinition = {
  label: 'Pepe Green',
  description: 'Classic meme green aesthetic',
  light: {
    '--background': '135 50% 75%',
    '--foreground': '150 70% 6%',
    '--card': '130 45% 86%',
    '--card-foreground': '150 70% 6%',
    '--popover': '130 45% 86%',
    '--popover-foreground': '150 70% 6%',
    '--primary': '150 80% 28%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '95 55% 60%',
    '--secondary-foreground': '150 80% 8%',
    '--muted': '135 40% 68%',
    '--muted-foreground': '150 50% 22%',
    '--accent': '150 40% 88%',
    '--accent-foreground': '150 70% 6%',
    '--destructive': '0 90% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '140 45% 58%',
    '--input': '140 40% 62%',
    '--ring': '150 80% 28%',
  },
  dark: {
    '--background': '150 65% 4%',
    '--foreground': '130 30% 90%',
    '--card': '148 55% 11%',
    '--card-foreground': '130 30% 90%',
    '--popover': '148 55% 11%',
    '--popover-foreground': '130 30% 90%',
    '--primary': '140 85% 40%',
    '--primary-foreground': '150 65% 3%',
    '--secondary': '135 50% 20%',
    '--secondary-foreground': '130 30% 88%',
    '--muted': '148 45% 15%',
    '--muted-foreground': '135 25% 48%',
    '--accent': '140 40% 14%',
    '--accent-foreground': '130 30% 90%',
    '--destructive': '0 80% 52%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '148 45% 22%',
    '--input': '148 45% 18%',
    '--ring': '140 85% 40%',
  },
};

/**
 * Deep Fried — scorching amber/orange with crunchy red accents.
 * Golden-orange bg, blazing orange-red primary, warm yellow secondary.
 */
const deepfriedTheme: ThemeDefinition = {
  label: 'Deep Fried',
  description: 'Warm crunchy amber tones',
  light: {
    '--background': '35 65% 75%',
    '--foreground': '15 70% 8%',
    '--card': '38 60% 86%',
    '--card-foreground': '15 70% 8%',
    '--popover': '38 60% 86%',
    '--popover-foreground': '15 70% 8%',
    '--primary': '15 100% 45%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '45 80% 58%',
    '--secondary-foreground': '15 80% 10%',
    '--muted': '35 50% 68%',
    '--muted-foreground': '20 55% 24%',
    '--accent': '20 60% 90%',
    '--accent-foreground': '15 70% 8%',
    '--destructive': '0 95% 42%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '30 55% 58%',
    '--input': '30 50% 62%',
    '--ring': '15 100% 45%',
  },
  dark: {
    '--background': '15 60% 5%',
    '--foreground': '40 35% 90%',
    '--card': '18 50% 12%',
    '--card-foreground': '40 35% 90%',
    '--popover': '18 50% 12%',
    '--popover-foreground': '40 35% 90%',
    '--primary': '20 100% 50%',
    '--primary-foreground': '15 60% 3%',
    '--secondary': '30 55% 22%',
    '--secondary-foreground': '40 35% 88%',
    '--muted': '18 45% 15%',
    '--muted-foreground': '35 25% 48%',
    '--accent': '20 45% 16%',
    '--accent-foreground': '40 35% 90%',
    '--destructive': '0 85% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '18 45% 22%',
    '--input': '18 45% 18%',
    '--ring': '20 100% 50%',
  },
};

/**
 * Ocean Breeze — bold blue/teal with coral accents.
 * Deep ocean-blue bg, bright cerulean primary, teal secondary.
 */
const oceanTheme: ThemeDefinition = {
  label: 'Ocean Breeze',
  description: 'Cool blue & teal vibes',
  light: {
    '--background': '205 60% 75%',
    '--foreground': '215 70% 6%',
    '--card': '200 55% 86%',
    '--card-foreground': '215 70% 6%',
    '--popover': '200 55% 86%',
    '--popover-foreground': '215 70% 6%',
    '--primary': '210 95% 38%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '175 65% 55%',
    '--secondary-foreground': '210 80% 8%',
    '--muted': '205 45% 68%',
    '--muted-foreground': '215 50% 22%',
    '--accent': '210 50% 90%',
    '--accent-foreground': '215 70% 6%',
    '--destructive': '0 90% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '205 50% 58%',
    '--input': '205 45% 62%',
    '--ring': '210 95% 38%',
  },
  dark: {
    '--background': '218 70% 5%',
    '--foreground': '200 30% 90%',
    '--card': '215 58% 12%',
    '--card-foreground': '200 30% 90%',
    '--popover': '215 58% 12%',
    '--popover-foreground': '200 30% 90%',
    '--primary': '200 95% 48%',
    '--primary-foreground': '218 70% 4%',
    '--secondary': '185 55% 22%',
    '--secondary-foreground': '190 30% 88%',
    '--muted': '215 45% 15%',
    '--muted-foreground': '200 22% 48%',
    '--accent': '210 40% 16%',
    '--accent-foreground': '200 30% 90%',
    '--destructive': '0 80% 52%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '215 48% 22%',
    '--input': '215 48% 18%',
    '--ring': '200 95% 48%',
  },
};

/**
 * Liquid Glass — Apple-inspired indigo/purple with mint-teal highlights.
 * Steel-blue bg, vivid indigo primary, bright mint secondary.
 */
const liquidglassTheme: ThemeDefinition = {
  label: 'Liquid Glass',
  description: 'Translucent blue-purple-mint aero',
  light: {
    '--background': '228 45% 78%',
    '--foreground': '235 60% 8%',
    '--card': '225 42% 88%',
    '--card-foreground': '235 60% 8%',
    '--popover': '225 42% 88%',
    '--popover-foreground': '235 60% 8%',
    '--primary': '255 80% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '168 55% 60%',
    '--secondary-foreground': '235 70% 8%',
    '--muted': '228 35% 70%',
    '--muted-foreground': '235 40% 25%',
    '--accent': '255 40% 91%',
    '--accent-foreground': '235 60% 8%',
    '--destructive': '0 90% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '228 40% 62%',
    '--input': '228 38% 65%',
    '--ring': '255 80% 50%',
  },
  dark: {
    '--background': '235 55% 6%',
    '--foreground': '228 28% 90%',
    '--card': '232 48% 13%',
    '--card-foreground': '228 28% 90%',
    '--popover': '232 48% 13%',
    '--popover-foreground': '228 28% 90%',
    '--primary': '255 85% 62%',
    '--primary-foreground': '235 55% 4%',
    '--secondary': '168 50% 22%',
    '--secondary-foreground': '168 30% 88%',
    '--muted': '232 40% 16%',
    '--muted-foreground': '228 22% 50%',
    '--accent': '255 35% 18%',
    '--accent-foreground': '228 28% 90%',
    '--destructive': '0 80% 52%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '232 42% 22%',
    '--input': '232 42% 18%',
    '--ring': '255 85% 62%',
  },
};

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  default: defaultTheme,
  dank: dankTheme,
  retrowave: retrowaveTheme,
  pepe: pepeTheme,
  deepfried: deepfriedTheme,
  ocean: oceanTheme,
  liquidglass: liquidglassTheme,
};

/**
 * Build a NAV_THEME-compatible color object from a ThemeColors set.
 * Converts our HSL token strings into `hsl(...)` format for React Navigation.
 */
export function buildNavColors(colors: ThemeColors) {
  return {
    background: `hsl(${colors['--background']})`,
    border: `hsl(${colors['--border']})`,
    card: `hsl(${colors['--card']})`,
    notification: `hsl(${colors['--destructive']})`,
    primary: `hsl(${colors['--primary']})`,
    text: `hsl(${colors['--foreground']})`,
  };
}
