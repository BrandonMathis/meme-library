import { vars } from 'nativewind';

import { useAppTheme } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEMES, type ThemeColors } from '@/lib/themes';

/**
 * Returns the current theme's color tokens, a helper to resolve any token
 * to an `hsl(...)` string, and a `themeVars` style object for NativeWind.
 *
 * Modal screens presented as formSheet on native don't inherit NativeWind CSS
 * vars from the root layout, so they must apply `themeVars` to their own root
 * container to ensure class-based tokens (bg-background, text-foreground, etc.)
 * resolve correctly.
 */
export function useThemeColors() {
  const { themeId } = useAppTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors: ThemeColors = isDark ? THEMES[themeId].dark : THEMES[themeId].light;

  /** Resolve a token key (e.g. `'--primary'`) to an `hsl(...)` CSS string. */
  const hsl = (token: keyof ThemeColors) => `hsl(${colors[token]})`;

  /** NativeWind vars style — apply to a root View so CSS-var-based classes work. */
  const themeVars = vars(colors as Record<string, string>);

  return { colors, hsl, themeVars };
}
