import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { PortalHost } from '@rn-primitives/portal';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { MemeLibraryProvider } from '@/context/meme-library';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <KeyboardProvider>
      <MemeLibraryProvider>
        <ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen
              name="add-meme-modal"
              options={{
                presentation: 'formSheet',
                title: 'Add Meme',
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
          <PortalHost />
        </ThemeProvider>
      </MemeLibraryProvider>
    </KeyboardProvider>
  );
}
