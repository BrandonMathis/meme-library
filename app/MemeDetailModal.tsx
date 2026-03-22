import { useState, useEffect } from 'react';
import { ScrollView, View, Pressable, Alert, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';

import { MemeModalContent } from '@/components/MemeModalContent';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMemeLibrary } from '@/context/MemeLibrary';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function MemeDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memes, editTags, deleteMeme, toggleFavorite } = useMemeLibrary();

  const { hsl, themeVars } = useThemeColors();
  const meme = memes.find((m) => m.id === id);
  const [tags, setTags] = useState<string[]>(meme?.tags ?? []);

  useEffect(() => {
    if (meme) {
      setTags(meme.tags);
    }
  }, [meme]);

  useEffect(() => {
    if (meme && tags !== meme.tags) {
      editTags(meme.id, tags);
    }
    // Only sync when tags change from user input, not from meme update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  const handleClose = () => {
    router.dismiss();
  };

  if (!meme) return null;

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(meme.uri);
        const blob = await response.blob();
        const file = new window.File([blob], 'meme.jpg', { type: blob.type });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
        } else {
          const a = document.createElement('a');
          a.href = meme.uri;
          a.download = 'meme.jpg';
          a.click();
        }
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing is not available on this device');
        return;
      }

      if (meme.uri.startsWith('file://') || meme.uri.startsWith('content://')) {
        await Sharing.shareAsync(meme.uri, { mimeType: 'image/jpeg' });
      } else {
        const downloaded = await File.downloadFileAsync(
          meme.uri,
          new File(Paths.cache, `meme_share_${Date.now()}.jpg`),
        );
        await Sharing.shareAsync(downloaded.uri, { mimeType: 'image/jpeg' });
      }
    } catch {
      Alert.alert('Sharing is not available on this device');
    }
  };

  const handleFavorite = async () => {
    await toggleFavorite(meme.id);
  };

  const handleDelete = async () => {
    if (Platform.OS === 'web') {
      await deleteMeme(meme.id);
      router.dismiss();
      return;
    }
    Alert.alert('Delete Meme', 'Are you sure you want to delete this meme?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMeme(meme.id);
          router.dismiss();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button variant="ghost" onPress={handleClose}>
              <Text className="text-primary-foreground">Close</Text>
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
        <MemeModalContent uri={meme.uri} tags={tags} onTagsChange={setTags}>
          <View className="mt-6 flex-row items-center justify-evenly gap-3">
            <Pressable
              onPress={handleShare}
              className="flex-1 items-center gap-1.5 rounded-2xl bg-primary px-4 py-3 active:opacity-80"
            >
              <IconSymbol
                name="square.and.arrow.up"
                size={22}
                color={hsl('--primary-foreground')}
              />
              <Text className="text-xs font-medium text-primary-foreground">Share</Text>
            </Pressable>

            <Pressable
              onPress={handleFavorite}
              className="flex-1 items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 active:opacity-80"
            >
              <IconSymbol
                name={meme.isFavorite ? 'heart.fill' : 'heart'}
                size={22}
                color={hsl('--secondary-foreground')}
              />
              <Text className="text-xs font-medium text-secondary-foreground">
                {meme.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="flex-1 items-center gap-1.5 rounded-2xl bg-destructive px-4 py-3 active:opacity-80"
            >
              <IconSymbol name="trash.fill" size={22} color={hsl('--destructive-foreground')} />
              <Text className="text-xs font-medium text-destructive-foreground">Delete</Text>
            </Pressable>
          </View>
        </MemeModalContent>
      </ScrollView>
    </>
  );
}
