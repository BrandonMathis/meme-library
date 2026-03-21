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

/**
 * Dank Mode — deep purple/violet with vivid neon magenta accents.
 * Light: lavender-tinted background, bold purple cards, magenta buttons.
 * Dark: deep indigo-violet bg, glowing purple cards, neon magenta primary.
 */
const dankTheme: ThemeDefinition = {
  label: 'Dank Mode',
  description: 'Deep purple with neon accents',
  light: {
    '--background': '270 40% 92%',
    '--foreground': '270 60% 10%',
    '--card': '272 50% 98%',
    '--card-foreground': '270 60% 10%',
    '--popover': '272 50% 98%',
    '--popover-foreground': '270 60% 10%',
    '--primary': '280 75% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '270 45% 82%',
    '--secondary-foreground': '270 60% 15%',
    '--muted': '270 30% 86%',
    '--muted-foreground': '270 30% 38%',
    '--accent': '300 60% 85%',
    '--accent-foreground': '280 60% 15%',
    '--destructive': '0 85% 55%',
    '--border': '270 35% 78%',
    '--input': '270 35% 80%',
    '--ring': '280 75% 50%',
  },
  dark: {
    '--background': '270 55% 8%',
    '--foreground': '275 30% 92%',
    '--card': '272 45% 14%',
    '--card-foreground': '275 30% 92%',
    '--popover': '272 45% 14%',
    '--popover-foreground': '275 30% 92%',
    '--primary': '285 85% 65%',
    '--primary-foreground': '270 55% 5%',
    '--secondary': '270 45% 22%',
    '--secondary-foreground': '275 30% 88%',
    '--muted': '270 40% 18%',
    '--muted-foreground': '275 20% 55%',
    '--accent': '300 55% 28%',
    '--accent-foreground': '275 30% 92%',
    '--destructive': '0 75% 55%',
    '--border': '270 40% 22%',
    '--input': '270 40% 20%',
    '--ring': '285 85% 65%',
  },
};

/**
 * Retro Wave — hot pink & cyan synthwave.
 * Light: warm pink-tinted bg, cyan secondary highlights, vivid pink buttons.
 * Dark: deep midnight purple bg, neon pink primary, glowing cyan accents.
 */
const retrowaveTheme: ThemeDefinition = {
  label: 'Retro Wave',
  description: 'Synthwave pink & cyan neon',
  light: {
    '--background': '330 40% 92%',
    '--foreground': '290 50% 10%',
    '--card': '330 35% 97%',
    '--card-foreground': '290 50% 10%',
    '--popover': '330 35% 97%',
    '--popover-foreground': '290 50% 10%',
    '--primary': '330 90% 52%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '190 55% 82%',
    '--secondary-foreground': '200 70% 18%',
    '--muted': '320 30% 86%',
    '--muted-foreground': '320 25% 38%',
    '--accent': '190 65% 78%',
    '--accent-foreground': '200 70% 15%',
    '--destructive': '0 85% 55%',
    '--border': '325 35% 78%',
    '--input': '325 30% 80%',
    '--ring': '330 90% 52%',
  },
  dark: {
    '--background': '280 60% 6%',
    '--foreground': '325 25% 92%',
    '--card': '280 50% 12%',
    '--card-foreground': '325 25% 92%',
    '--popover': '280 50% 12%',
    '--popover-foreground': '325 25% 92%',
    '--primary': '330 100% 60%',
    '--primary-foreground': '280 60% 5%',
    '--secondary': '190 70% 22%',
    '--secondary-foreground': '185 50% 85%',
    '--muted': '280 45% 16%',
    '--muted-foreground': '325 20% 52%',
    '--accent': '190 80% 25%',
    '--accent-foreground': '185 50% 90%',
    '--destructive': '0 75% 55%',
    '--border': '280 45% 20%',
    '--input': '280 45% 18%',
    '--ring': '330 100% 60%',
  },
};

/**
 * Pepe Green — bold meme-culture greens.
 * Light: distinctly green-tinted bg, bright emerald buttons, olive muted tones.
 * Dark: deep forest bg, vivid lime-green primary, rich olive cards.
 */
const pepeTheme: ThemeDefinition = {
  label: 'Pepe Green',
  description: 'Classic meme green aesthetic',
  light: {
    '--background': '130 35% 90%',
    '--foreground': '140 55% 8%',
    '--card': '125 30% 96%',
    '--card-foreground': '140 55% 8%',
    '--popover': '125 30% 96%',
    '--popover-foreground': '140 55% 8%',
    '--primary': '145 70% 32%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '120 40% 80%',
    '--secondary-foreground': '145 55% 12%',
    '--muted': '130 25% 84%',
    '--muted-foreground': '140 25% 35%',
    '--accent': '100 50% 75%',
    '--accent-foreground': '140 55% 10%',
    '--destructive': '0 85% 55%',
    '--border': '130 30% 74%',
    '--input': '130 30% 76%',
    '--ring': '145 70% 32%',
  },
  dark: {
    '--background': '145 50% 6%',
    '--foreground': '125 25% 90%',
    '--card': '142 42% 12%',
    '--card-foreground': '125 25% 90%',
    '--popover': '142 42% 12%',
    '--popover-foreground': '125 25% 90%',
    '--primary': '140 75% 42%',
    '--primary-foreground': '145 50% 4%',
    '--secondary': '135 40% 20%',
    '--secondary-foreground': '125 25% 85%',
    '--muted': '140 35% 16%',
    '--muted-foreground': '130 18% 48%',
    '--accent': '100 45% 24%',
    '--accent-foreground': '125 25% 90%',
    '--destructive': '0 75% 55%',
    '--border': '140 35% 20%',
    '--input': '140 35% 18%',
    '--ring': '140 75% 42%',
  },
};

/**
 * Deep Fried — warm amber/orange with crunchy red-orange accents.
 * Light: warm golden bg, bold orange buttons, toasty brown tones.
 * Dark: rich burnt sienna bg, blazing orange primary, warm mocha cards.
 */
const deepfriedTheme: ThemeDefinition = {
  label: 'Deep Fried',
  description: 'Warm crunchy amber tones',
  light: {
    '--background': '38 50% 90%',
    '--foreground': '20 60% 10%',
    '--card': '40 45% 96%',
    '--card-foreground': '20 60% 10%',
    '--popover': '40 45% 96%',
    '--popover-foreground': '20 60% 10%',
    '--primary': '22 95% 48%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '38 50% 78%',
    '--secondary-foreground': '20 60% 14%',
    '--muted': '35 35% 82%',
    '--muted-foreground': '25 30% 38%',
    '--accent': '45 65% 72%',
    '--accent-foreground': '20 60% 12%',
    '--destructive': '0 85% 50%',
    '--border': '35 40% 72%',
    '--input': '35 40% 75%',
    '--ring': '22 95% 48%',
  },
  dark: {
    '--background': '18 50% 6%',
    '--foreground': '38 30% 90%',
    '--card': '20 42% 12%',
    '--card-foreground': '38 30% 90%',
    '--popover': '20 42% 12%',
    '--popover-foreground': '38 30% 90%',
    '--primary': '25 100% 52%',
    '--primary-foreground': '18 50% 4%',
    '--secondary': '25 40% 20%',
    '--secondary-foreground': '38 30% 85%',
    '--muted': '22 35% 16%',
    '--muted-foreground': '35 20% 48%',
    '--accent': '40 50% 24%',
    '--accent-foreground': '38 30% 90%',
    '--destructive': '0 75% 50%',
    '--border': '22 35% 20%',
    '--input': '22 35% 18%',
    '--ring': '25 100% 52%',
  },
};

/**
 * Ocean Breeze — bold blue/teal with coral accents.
 * Light: sky-blue tinted bg, vivid ocean-blue buttons, teal highlights.
 * Dark: deep navy bg, bright cerulean primary, teal-accented cards.
 */
const oceanTheme: ThemeDefinition = {
  label: 'Ocean Breeze',
  description: 'Cool blue & teal vibes',
  light: {
    '--background': '200 45% 90%',
    '--foreground': '210 55% 8%',
    '--card': '200 40% 96%',
    '--card-foreground': '210 55% 8%',
    '--popover': '200 40% 96%',
    '--popover-foreground': '210 55% 8%',
    '--primary': '205 85% 42%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '185 45% 78%',
    '--secondary-foreground': '210 55% 14%',
    '--muted': '200 30% 84%',
    '--muted-foreground': '210 25% 38%',
    '--accent': '175 50% 72%',
    '--accent-foreground': '210 55% 10%',
    '--destructive': '0 85% 55%',
    '--border': '200 35% 74%',
    '--input': '200 35% 76%',
    '--ring': '205 85% 42%',
  },
  dark: {
    '--background': '215 55% 7%',
    '--foreground': '200 25% 90%',
    '--card': '212 48% 13%',
    '--card-foreground': '200 25% 90%',
    '--popover': '212 48% 13%',
    '--popover-foreground': '200 25% 90%',
    '--primary': '200 90% 50%',
    '--primary-foreground': '215 55% 5%',
    '--secondary': '195 40% 20%',
    '--secondary-foreground': '195 25% 85%',
    '--muted': '210 35% 16%',
    '--muted-foreground': '200 18% 48%',
    '--accent': '175 45% 22%',
    '--accent-foreground': '195 25% 90%',
    '--destructive': '0 75% 55%',
    '--border': '210 38% 20%',
    '--input': '210 38% 18%',
    '--ring': '200 90% 50%',
  },
};

/**
 * Liquid Glass — Apple-inspired indigo/purple with mint-teal highlights.
 * Light: blue-gray tinted bg, rich indigo buttons, minty secondary touches.
 * Dark: deep blue-charcoal bg, bright indigo primary, teal-mint accents.
 */
const liquidglassTheme: ThemeDefinition = {
  label: 'Liquid Glass',
  description: 'Translucent blue-purple-mint aero',
  light: {
    '--background': '225 35% 91%',
    '--foreground': '230 45% 10%',
    '--card': '225 35% 97%',
    '--card-foreground': '230 45% 10%',
    '--popover': '225 35% 97%',
    '--popover-foreground': '230 45% 10%',
    '--primary': '250 65% 52%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '170 40% 80%',
    '--secondary-foreground': '230 45% 14%',
    '--muted': '225 25% 84%',
    '--muted-foreground': '230 20% 38%',
    '--accent': '170 50% 75%',
    '--accent-foreground': '230 45% 10%',
    '--destructive': '0 85% 55%',
    '--border': '225 30% 76%',
    '--input': '225 30% 78%',
    '--ring': '250 65% 52%',
  },
  dark: {
    '--background': '232 42% 8%',
    '--foreground': '225 25% 90%',
    '--card': '230 38% 14%',
    '--card-foreground': '225 25% 90%',
    '--popover': '230 38% 14%',
    '--popover-foreground': '225 25% 90%',
    '--primary': '250 72% 65%',
    '--primary-foreground': '232 42% 5%',
    '--secondary': '170 35% 20%',
    '--secondary-foreground': '170 25% 85%',
    '--muted': '230 30% 17%',
    '--muted-foreground': '225 18% 50%',
    '--accent': '170 42% 24%',
    '--accent-foreground': '170 25% 90%',
    '--destructive': '0 75% 55%',
    '--border': '230 32% 22%',
    '--input': '230 32% 20%',
    '--ring': '250 72% 65%',
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
