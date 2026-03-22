import { useAppTheme } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEMES, type ThemeColors } from '@/lib/themes';

/**
 * Returns the current theme's color tokens and a helper to resolve any token
 * to an `hsl(...)` string (useful for inline style props like icon `color`).
 */
export function useThemeColors() {
  const { themeId } = useAppTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors: ThemeColors = isDark ? THEMES[themeId].dark : THEMES[themeId].light;

  /** Resolve a token key (e.g. `'--primary'`) to an `hsl(...)` CSS string. */
  const hsl = (token: keyof ThemeColors) => `hsl(${colors[token]})`;

  return { colors, hsl };
}
