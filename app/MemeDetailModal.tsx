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
import { useAppTheme } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { THEMES } from '@/lib/themes';

export default function MemeDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { memes, editTags, deleteMeme, toggleFavorite } = useMemeLibrary();
  const { themeId } = useAppTheme();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? THEMES[themeId].dark : THEMES[themeId].light;
  const primaryColor = `hsl(${colors['--primary']})`;
  const destructiveColor = `hsl(${colors['--destructive']})`;
  const mutedForegroundColor = `hsl(${colors['--muted-foreground']})`;

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
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8 pt-4"
      >
        <MemeModalContent uri={meme.uri} tags={tags} onTagsChange={setTags}>
          <View className="mt-6 flex-row items-center justify-evenly">
            <Pressable
              onPress={handleShare}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-muted"
            >
              <IconSymbol name="square.and.arrow.up" size={24} color={primaryColor} />
              <Text className="text-xs text-muted-foreground">Share</Text>
            </Pressable>

            <Pressable
              onPress={handleFavorite}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-muted"
            >
              <IconSymbol
                name={meme.isFavorite ? 'heart.fill' : 'heart'}
                size={24}
                color={meme.isFavorite ? destructiveColor : mutedForegroundColor}
              />
              <Text className="text-xs text-muted-foreground">
                {meme.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-muted"
            >
              <IconSymbol name="trash.fill" size={24} color={destructiveColor} />
              <Text className="text-xs text-muted-foreground">Delete</Text>
            </Pressable>
          </View>
        </MemeModalContent>
      </ScrollView>
    </>
  );
}
