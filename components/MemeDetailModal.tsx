import { Modal, View, Pressable, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';

import { Text } from '@/components/ui/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMemeLibrary, type MemeEntry } from '@/context/MemeLibrary';

type Props = {
  meme: MemeEntry | null;
  onClose: () => void;
};

export default function MemeDetailModal({ meme, onClose }: Props) {
  const { deleteMeme, toggleFavorite } = useMemeLibrary();

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
      onClose();
      return;
    }
    Alert.alert('Delete Meme', 'Are you sure you want to delete this meme?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMeme(meme.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={!!meme} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black" onPress={onClose}>
        <View className="flex-1 items-center justify-center">
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full flex-1">
            <Image
              source={{ uri: meme.uri }}
              style={{ width: '100%', flex: 1 }}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center justify-evenly pb-10 pt-4">
            <Pressable
              onPress={handleShare}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-white/10"
            >
              <IconSymbol name="square.and.arrow.up" size={24} color="#3b82f6" />
              <Text className="text-xs text-white/70">Share</Text>
            </Pressable>

            <Pressable
              onPress={handleFavorite}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-white/10"
            >
              <IconSymbol
                name={meme.isFavorite ? 'heart.fill' : 'heart'}
                size={24}
                color={meme.isFavorite ? '#ef4444' : '#f97316'}
              />
              <Text className="text-xs text-white/70">
                {meme.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-white/10"
            >
              <IconSymbol name="trash.fill" size={24} color="#ef4444" />
              <Text className="text-xs text-white/70">Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
