import { useThemePreference } from '@/context/ThemeProvider';

export function useColorScheme() {
  const { colorScheme } = useThemePreference();
  return colorScheme;
}
