import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text variant="h3">Settings</Text>
      <Text variant="muted">Configure your meme library preferences.</Text>
    </View>
  );
}
