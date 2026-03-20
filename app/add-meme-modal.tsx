import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemeLibrary } from '@/context/meme-library';

export default function AddMemeModal() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const { addMeme } = useMemeLibrary();

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (uri && tags.length > 0) {
      addMeme(uri, tags);
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 pb-2">
        <Button variant="ghost" onPress={() => router.back()}>
          <Text>Cancel</Text>
        </Button>
        <Text variant="large">Add Meme</Text>
        <Button variant="ghost" onPress={handleSave} disabled={tags.length === 0}>
          <Text className={tags.length === 0 ? 'text-muted-foreground' : 'text-primary'}>Save</Text>
        </Button>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8"
        bottomOffset={20}
      >
        {uri && (
          <Image
            source={{ uri }}
            style={{ width: '100%', height: 300, borderRadius: 12 }}
            contentFit="contain"
          />
        )}

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <Button size="icon" onPress={handleAddTag}>
            <Text className="text-lg font-bold text-primary-foreground">+</Text>
          </Button>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} onTouchEnd={() => handleRemoveTag(tag)}>
              <Text className="text-xs text-primary-foreground">{tag} ✕</Text>
            </Badge>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
