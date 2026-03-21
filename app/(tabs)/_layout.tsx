import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/context/ThemeContext';
import { THEMES } from '@/lib/themes';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { themeId } = useAppTheme();

  const theme = THEMES[themeId];
  const colors = isDark ? theme.dark : theme.light;
  const primaryColor = `hsl(${colors['--primary']})`;

  return (
    <NativeTabs tintColor={primaryColor}>
      <NativeTabs.Trigger name="index" options={{ title: 'Meme Library' }}>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="home" />
        <Label>Library</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add" options={{ title: 'Add Meme' }}>
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} drawable="add_circle" />
        <Label>Add</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings" options={{ title: 'Settings' }}>
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} drawable="settings" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
