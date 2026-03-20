import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PortalHost } from '@rn-primitives/portal';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { MemeLibraryProvider } from '@/context/MemeLibrary';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeProvider';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { NAV_THEME } from '@/lib/constants';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <MemeLibraryProvider>
      <ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="AddMemeModal"
            options={{
              presentation: 'formSheet',
              title: 'Add Meme',
            }}
          />
          <Stack.Screen
            name="MemeDetailModal"
            options={{
              presentation: 'formSheet',
              title: 'Meme Details',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        <SuccessAnimation />
        <PortalHost />
      </ThemeProvider>
    </MemeLibraryProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
    </AppThemeProvider>
  );
}
