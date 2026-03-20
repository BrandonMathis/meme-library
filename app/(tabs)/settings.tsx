import { View, Pressable } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Card, CardContent } from '@/components/ui/Card';
import { useThemePreference, type ThemePreference } from '@/context/ThemeProvider';
import { cn } from '@/lib/utils';

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'system', label: 'System', description: 'Follow device setting' },
  { value: 'light', label: 'Light', description: 'Always light' },
  { value: 'dark', label: 'Dark', description: 'Always dark' },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useThemePreference();

  return (
    <View className="flex-1 bg-background px-4 pt-6">
      <Text variant="h3" className="mb-6">
        Settings
      </Text>

      <Text variant="large" className="mb-3">
        Appearance
      </Text>
      <Card>
        <CardContent className="gap-2 p-3">
          {THEME_OPTIONS.map((option) => {
            const isSelected = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                className={cn(
                  'flex-row items-center justify-between rounded-lg px-4 py-3',
                  isSelected ? 'bg-primary/10' : 'bg-secondary/30',
                )}
              >
                <View>
                  <Text className={cn('font-medium', isSelected && 'text-primary')}>
                    {option.label}
                  </Text>
                  <Text variant="muted" className="text-xs">
                    {option.description}
                  </Text>
                </View>
                <View
                  className={cn(
                    'h-5 w-5 items-center justify-center rounded-full border-2',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground',
                  )}
                >
                  {isSelected && <View className="h-2 w-2 rounded-full bg-primary-foreground" />}
                </View>
              </Pressable>
            );
          })}
        </CardContent>
      </Card>
    </View>
  );
}
