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

/** Default (shadcn neutral) — already defined in global.css, kept here for completeness */
const defaultTheme: ThemeDefinition = {
  label: 'Default',
  description: 'Clean neutral theme',
  light: {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 3.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '0 0% 3.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 3.9%',
    '--primary': '0 0% 9%',
    '--primary-foreground': '0 0% 98%',
    '--secondary': '0 0% 96.1%',
    '--secondary-foreground': '0 0% 9%',
    '--muted': '0 0% 96.1%',
    '--muted-foreground': '0 0% 45.1%',
    '--accent': '0 0% 96.1%',
    '--accent-foreground': '0 0% 9%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '0 0% 89.8%',
    '--input': '0 0% 89.8%',
    '--ring': '0 0% 63%',
  },
  dark: {
    '--background': '0 0% 3.9%',
    '--foreground': '0 0% 98%',
    '--card': '0 0% 3.9%',
    '--card-foreground': '0 0% 98%',
    '--popover': '0 0% 3.9%',
    '--popover-foreground': '0 0% 98%',
    '--primary': '0 0% 98%',
    '--primary-foreground': '0 0% 9%',
    '--secondary': '0 0% 14.9%',
    '--secondary-foreground': '0 0% 98%',
    '--muted': '0 0% 14.9%',
    '--muted-foreground': '0 0% 63.9%',
    '--accent': '0 0% 14.9%',
    '--accent-foreground': '0 0% 98%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '0 0% 14.9%',
    '--input': '0 0% 14.9%',
    '--ring': '300 0% 45%',
  },
};

/** Dank Mode — deep purple/violet dark aesthetic */
const dankTheme: ThemeDefinition = {
  label: 'Dank Mode',
  description: 'Deep purple with neon accents',
  light: {
    '--background': '270 30% 98%',
    '--foreground': '270 50% 10%',
    '--card': '270 30% 100%',
    '--card-foreground': '270 50% 10%',
    '--popover': '270 30% 100%',
    '--popover-foreground': '270 50% 10%',
    '--primary': '270 70% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '270 25% 93%',
    '--secondary-foreground': '270 50% 15%',
    '--muted': '270 20% 94%',
    '--muted-foreground': '270 15% 45%',
    '--accent': '280 60% 92%',
    '--accent-foreground': '270 50% 15%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '270 20% 88%',
    '--input': '270 20% 88%',
    '--ring': '270 70% 50%',
  },
  dark: {
    '--background': '270 40% 6%',
    '--foreground': '270 20% 95%',
    '--card': '270 35% 9%',
    '--card-foreground': '270 20% 95%',
    '--popover': '270 35% 9%',
    '--popover-foreground': '270 20% 95%',
    '--primary': '270 80% 65%',
    '--primary-foreground': '270 40% 6%',
    '--secondary': '270 30% 15%',
    '--secondary-foreground': '270 20% 90%',
    '--muted': '270 25% 14%',
    '--muted-foreground': '270 15% 55%',
    '--accent': '280 50% 20%',
    '--accent-foreground': '270 20% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '270 25% 16%',
    '--input': '270 25% 16%',
    '--ring': '270 80% 65%',
  },
};

/** Retro Wave — hot pink & cyan synthwave */
const retrowaveTheme: ThemeDefinition = {
  label: 'Retro Wave',
  description: 'Synthwave pink & cyan neon',
  light: {
    '--background': '320 30% 98%',
    '--foreground': '320 40% 10%',
    '--card': '320 25% 100%',
    '--card-foreground': '320 40% 10%',
    '--popover': '320 25% 100%',
    '--popover-foreground': '320 40% 10%',
    '--primary': '330 85% 55%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '190 40% 92%',
    '--secondary-foreground': '190 60% 20%',
    '--muted': '320 20% 94%',
    '--muted-foreground': '320 15% 45%',
    '--accent': '190 70% 88%',
    '--accent-foreground': '190 60% 15%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '320 20% 88%',
    '--input': '320 20% 88%',
    '--ring': '330 85% 55%',
  },
  dark: {
    '--background': '280 50% 5%',
    '--foreground': '320 20% 95%',
    '--card': '280 45% 8%',
    '--card-foreground': '320 20% 95%',
    '--popover': '280 45% 8%',
    '--popover-foreground': '320 20% 95%',
    '--primary': '330 90% 60%',
    '--primary-foreground': '280 50% 5%',
    '--secondary': '190 60% 15%',
    '--secondary-foreground': '190 40% 90%',
    '--muted': '280 35% 13%',
    '--muted-foreground': '320 15% 55%',
    '--accent': '190 80% 18%',
    '--accent-foreground': '190 40% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '280 35% 15%',
    '--input': '280 35% 15%',
    '--ring': '330 90% 60%',
  },
};

/** Pepe Green — classic meme green tones */
const pepeTheme: ThemeDefinition = {
  label: 'Pepe Green',
  description: 'Classic meme green aesthetic',
  light: {
    '--background': '120 25% 97%',
    '--foreground': '140 40% 8%',
    '--card': '120 20% 100%',
    '--card-foreground': '140 40% 8%',
    '--popover': '120 20% 100%',
    '--popover-foreground': '140 40% 8%',
    '--primary': '140 60% 35%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '120 25% 92%',
    '--secondary-foreground': '140 40% 12%',
    '--muted': '120 18% 94%',
    '--muted-foreground': '140 15% 42%',
    '--accent': '100 40% 88%',
    '--accent-foreground': '140 40% 12%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '120 18% 87%',
    '--input': '120 18% 87%',
    '--ring': '140 60% 35%',
  },
  dark: {
    '--background': '140 35% 5%',
    '--foreground': '120 20% 95%',
    '--card': '140 30% 8%',
    '--card-foreground': '120 20% 95%',
    '--popover': '140 30% 8%',
    '--popover-foreground': '120 20% 95%',
    '--primary': '140 65% 45%',
    '--primary-foreground': '140 35% 5%',
    '--secondary': '140 25% 14%',
    '--secondary-foreground': '120 20% 90%',
    '--muted': '140 20% 12%',
    '--muted-foreground': '120 12% 52%',
    '--accent': '100 35% 18%',
    '--accent-foreground': '120 20% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '140 22% 15%',
    '--input': '140 22% 15%',
    '--ring': '140 65% 45%',
  },
};

/** Deep Fried — warm amber/orange tones */
const deepfriedTheme: ThemeDefinition = {
  label: 'Deep Fried',
  description: 'Warm crunchy amber tones',
  light: {
    '--background': '40 40% 97%',
    '--foreground': '25 50% 10%',
    '--card': '40 35% 100%',
    '--card-foreground': '25 50% 10%',
    '--popover': '40 35% 100%',
    '--popover-foreground': '25 50% 10%',
    '--primary': '25 90% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '40 35% 92%',
    '--secondary-foreground': '25 50% 15%',
    '--muted': '40 25% 93%',
    '--muted-foreground': '25 20% 45%',
    '--accent': '35 55% 88%',
    '--accent-foreground': '25 50% 12%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '40 25% 86%',
    '--input': '40 25% 86%',
    '--ring': '25 90% 50%',
  },
  dark: {
    '--background': '20 40% 5%',
    '--foreground': '40 25% 95%',
    '--card': '20 35% 8%',
    '--card-foreground': '40 25% 95%',
    '--popover': '20 35% 8%',
    '--popover-foreground': '40 25% 95%',
    '--primary': '30 95% 55%',
    '--primary-foreground': '20 40% 5%',
    '--secondary': '25 30% 14%',
    '--secondary-foreground': '40 25% 90%',
    '--muted': '25 25% 12%',
    '--muted-foreground': '40 15% 52%',
    '--accent': '35 40% 18%',
    '--accent-foreground': '40 25% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '25 25% 15%',
    '--input': '25 25% 15%',
    '--ring': '30 95% 55%',
  },
};

/** Ocean Breeze — cool blue/teal calming palette */
const oceanTheme: ThemeDefinition = {
  label: 'Ocean Breeze',
  description: 'Cool blue & teal vibes',
  light: {
    '--background': '200 30% 98%',
    '--foreground': '210 40% 8%',
    '--card': '200 25% 100%',
    '--card-foreground': '210 40% 8%',
    '--popover': '200 25% 100%',
    '--popover-foreground': '210 40% 8%',
    '--primary': '200 80% 45%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '190 30% 92%',
    '--secondary-foreground': '210 40% 12%',
    '--muted': '200 20% 94%',
    '--muted-foreground': '210 15% 42%',
    '--accent': '180 40% 88%',
    '--accent-foreground': '210 40% 12%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '200 20% 87%',
    '--input': '200 20% 87%',
    '--ring': '200 80% 45%',
  },
  dark: {
    '--background': '210 45% 5%',
    '--foreground': '200 20% 95%',
    '--card': '210 40% 8%',
    '--card-foreground': '200 20% 95%',
    '--popover': '210 40% 8%',
    '--popover-foreground': '200 20% 95%',
    '--primary': '200 85% 55%',
    '--primary-foreground': '210 45% 5%',
    '--secondary': '200 30% 14%',
    '--secondary-foreground': '200 20% 90%',
    '--muted': '210 25% 12%',
    '--muted-foreground': '200 12% 52%',
    '--accent': '180 35% 18%',
    '--accent-foreground': '200 20% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '210 25% 15%',
    '--input': '210 25% 15%',
    '--ring': '200 85% 55%',
  },
};

/** Liquid Glass — Apple-inspired translucent blue/purple/mint aero */
const liquidglassTheme: ThemeDefinition = {
  label: 'Liquid Glass',
  description: 'Translucent blue-purple-mint aero',
  light: {
    '--background': '220 35% 97%',
    '--foreground': '230 30% 12%',
    '--card': '225 40% 98%',
    '--card-foreground': '230 30% 12%',
    '--popover': '225 40% 98%',
    '--popover-foreground': '230 30% 12%',
    '--primary': '245 58% 56%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '170 30% 93%',
    '--secondary-foreground': '230 30% 15%',
    '--muted': '220 25% 94%',
    '--muted-foreground': '230 15% 45%',
    '--accent': '170 45% 88%',
    '--accent-foreground': '230 30% 12%',
    '--destructive': '0 84.2% 60.2%',
    '--border': '225 25% 88%',
    '--input': '225 25% 88%',
    '--ring': '245 58% 56%',
  },
  dark: {
    '--background': '230 35% 7%',
    '--foreground': '220 25% 95%',
    '--card': '230 30% 10%',
    '--card-foreground': '220 25% 95%',
    '--popover': '230 30% 10%',
    '--popover-foreground': '220 25% 95%',
    '--primary': '245 65% 68%',
    '--primary-foreground': '230 35% 7%',
    '--secondary': '170 25% 15%',
    '--secondary-foreground': '170 20% 90%',
    '--muted': '230 25% 13%',
    '--muted-foreground': '220 15% 55%',
    '--accent': '170 35% 18%',
    '--accent-foreground': '170 20% 95%',
    '--destructive': '0 70.9% 59.4%',
    '--border': '230 25% 16%',
    '--input': '230 25% 16%',
    '--ring': '245 65% 68%',
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
