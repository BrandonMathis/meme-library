import { Modal, View, Pressable, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';

import { Text } from '@/components/ui/text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMemeLibrary, type MemeEntry } from '@/context/meme-library';

type Props = {
  meme: MemeEntry | null;
  onClose: () => void;
};

export default function MemeDetailModal({ meme, onClose }: Props) {
  const { deleteMeme, toggleFavorite } = useMemeLibrary();

  if (!meme) return null;

  const handleShare = async () => {
    const available = await Sharing.isAvailableAsync();
    if (available) {
      await Sharing.shareAsync(meme.uri);
    } else {
      Alert.alert('Sharing is not available on this device');
    }
  };

  const handleFavorite = () => {
    toggleFavorite(meme.id);
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      deleteMeme(meme.id);
      onClose();
      return;
    }
    Alert.alert('Delete Meme', 'Are you sure you want to delete this meme?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMeme(meme.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={!!meme} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/60" onPress={onClose}>
        <Pressable
          className="w-[85%] max-w-sm overflow-hidden rounded-2xl bg-card p-4"
          onPress={(e) => e.stopPropagation()}
        >
          <Image
            source={{ uri: meme.uri }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }}
            contentFit="cover"
          />

          <View className="mt-4 flex-row items-center justify-evenly">
            <Pressable
              onPress={handleShare}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-accent"
            >
              <IconSymbol name="square.and.arrow.up" size={24} color="#3b82f6" />
              <Text className="text-xs text-muted-foreground">Share</Text>
            </Pressable>

            <Pressable
              onPress={handleFavorite}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-accent"
            >
              <IconSymbol
                name={meme.isFavorite ? 'heart.fill' : 'heart'}
                size={24}
                color={meme.isFavorite ? '#ef4444' : '#f97316'}
              />
              <Text className="text-xs text-muted-foreground">
                {meme.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              className="items-center gap-1 rounded-xl px-5 py-3 active:bg-accent"
            >
              <IconSymbol name="trash.fill" size={24} color="#ef4444" />
              <Text className="text-xs text-muted-foreground">Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
