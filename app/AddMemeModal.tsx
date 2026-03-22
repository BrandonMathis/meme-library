import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { MemeModalContent } from '@/components/MemeModalContent';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useMemeLibrary } from '@/context/MemeLibrary';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function AddMemeModal() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const router = useRouter();
  const { addMeme } = useMemeLibrary();
  const { themeVars } = useThemeColors();

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
              <Text className="text-primary-foreground">Cancel</Text>
            </Button>
          ),
          headerRight: () => (
            <Button variant="ghost" onPress={handleSave} disabled={isSaving}>
              <Text
                className={
                  isSaving ? 'text-primary-foreground/50' : 'font-bold text-primary-foreground'
                }
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </Button>
          ),
        }}
      />

      <ScrollView
        className="flex-1 bg-background"
        style={themeVars}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8 pt-4"
      >
        {uri && <MemeModalContent uri={uri} tags={tags} onTagsChange={setTags} />}
      </ScrollView>
    </>
  );
}
