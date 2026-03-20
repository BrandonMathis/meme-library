import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { TagInput } from '@/components/TagInput';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useMemeLibrary } from '@/context/MemeLibrary';

export default function AddMemeModal() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const { addMeme } = useMemeLibrary();

  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    router.dismiss();
  };

  const handleSave = async () => {
    if (uri && !isSaving) {
      setIsSaving(true);
      try {
        await addMeme(uri, tags);
        router.dismiss();
      } finally {
        setIsSaving(false);
      }
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
            <Button variant="ghost" onPress={handleSave} disabled={isSaving}>
              <Text className={isSaving ? 'text-muted-foreground' : 'text-primary'}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
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
          <View className="relative overflow-hidden rounded-xl" style={{ height: 320 }}>
            <Image
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
            {tags.length > 0 && (
              <View
                className="absolute bottom-0 left-0 right-0 flex-row flex-wrap-reverse items-end gap-1.5 p-2"
                style={{ zIndex: 1 }}
                pointerEvents="box-none"
              >
                {tags.map((tag) => (
                  <Badge key={tag} onTouchEnd={() => setTags(tags.filter((t) => t !== tag))}>
                    <Text className="text-xs text-primary-foreground">{tag} ✕</Text>
                  </Badge>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="mt-4">
          <TagInput tags={tags} onTagsChange={setTags} showTags={false} />
        </View>
      </ScrollView>
    </>
  );
}
