import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { vars } from 'nativewind';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { PortalHost } from '@rn-primitives/portal';
import { ShareIntentProvider } from 'expo-share-intent';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { MemeLibraryProvider } from '@/context/MemeLibrary';
import { SettingsProvider } from '@/context/SettingsContext';
import { AppThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { useShareIntentHandler } from '@/hooks/use-share-intent-handler';
import { THEMES, buildNavColors } from '@/lib/themes';

export const unstable_settings = {
  anchor: '(tabs)',
};

function InnerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { themeId } = useAppTheme();
  useShareIntentHandler();

  const theme = THEMES[themeId];
  const colors = isDark ? theme.dark : theme.light;
  const navColors = buildNavColors(colors);

  const navTheme: Theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: navColors,
  };

  const themeVars = vars(colors as Record<string, string>);

  const modalHeaderStyle = {
    backgroundColor: `hsl(${colors['--primary']})`,
  };
  const modalHeaderTintColor = `hsl(${colors['--primary-foreground']})`;

  return (
    <View style={[{ flex: 1 }, themeVars]}>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="AddMemeModal"
            options={{
              presentation: 'formSheet',
              title: 'Add Meme',
              headerStyle: modalHeaderStyle,
              headerTintColor: modalHeaderTintColor,
              headerTitleStyle: { color: modalHeaderTintColor },
            }}
          />
          <Stack.Screen
            name="MemeDetailModal"
            options={{
              presentation: 'formSheet',
              title: 'Meme Details',
              headerStyle: modalHeaderStyle,
              headerTintColor: modalHeaderTintColor,
              headerTitleStyle: { color: modalHeaderTintColor },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        <SuccessAnimation />
        <PortalHost />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <SettingsProvider>
        <MemeLibraryProvider>
          <AppThemeProvider>
            <InnerLayout />
          </AppThemeProvider>
        </MemeLibraryProvider>
      </SettingsProvider>
    </ShareIntentProvider>
  );
}
