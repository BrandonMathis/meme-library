import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

export default function LibraryScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text variant="h3">Library</Text>
      <Text variant="muted">Your meme collection will appear here.</Text>
    </View>
  );
}
