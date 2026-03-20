import { useThemePreference } from '@/context/ThemeProvider';

export function useColorScheme() {
  const { colorScheme, isLoaded } = useThemePreference();

  if (isLoaded) {
    return colorScheme;
  }

  return 'light';
}
