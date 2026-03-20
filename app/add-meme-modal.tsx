import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { TagInput } from '@/components/tag-input';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useMemeLibrary } from '@/context/meme-library';

export default function AddMemeModal() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const { addMeme } = useMemeLibrary();

  const [tags, setTags] = useState<string[]>([]);

  const handleCancel = () => {
    router.dismiss();
  };

  const handleSave = () => {
    if (uri) {
      addMeme(uri, tags);
      router.dismiss();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button variant="ghost" onPress={handleCancel}>
              <Text>Cancel</Text>
            </Button>
          ),
          headerRight: () => (
            <Button variant="ghost" onPress={handleSave}>
              <Text className="text-primary">Save</Text>
            </Button>
          ),
        }}
      />

      <ScrollView
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8 pt-4"
      >
        {uri && (
          <View className="overflow-hidden rounded-xl" style={{ height: 320 }}>
            <Image
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </View>
        )}

        <View className="mt-4">
          <TagInput tags={tags} onTagsChange={setTags} />
        </View>
      </ScrollView>
    </>
  );
}
