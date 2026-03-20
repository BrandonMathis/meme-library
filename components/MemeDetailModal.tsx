import { useEffect, useState } from 'react';
import { Modal, View, Pressable, Alert, Platform, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';

import { Text } from '@/components/ui/Text';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TagInput } from '@/components/TagInput';
import { useMemeLibrary, type MemeEntry } from '@/context/MemeLibrary';

type Props = {
  meme: MemeEntry | null;
  onClose: () => void;
};

const DISMISS_THRESHOLD = 150;

export default function MemeDetailsModal({ meme, onClose }: Props) {
  const { deleteMeme, toggleFavorite, editTags } = useMemeLibrary();
  const { height: screenHeight } = useWindowDimensions();
  const [isEditingTags, setIsEditingTags] = useState(false);

  const translateY = useSharedValue(screenHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (meme) {
      translateY.value = screenHeight;
      backdropOpacity.value = 0;
      // Slide up
      translateY.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [meme, screenHeight, translateY, backdropOpacity]);

  const dismiss = () => {
    setIsEditingTags(false);
    translateY.value = withTiming(screenHeight, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: 250 });
  };

  const handleTagsChange = async (newTags: string[]) => {
    if (meme) {
      await editTags(meme.id, newTags);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only allow dragging down
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        backdropOpacity.value = 1 - e.translationY / screenHeight;
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD) {
        translateY.value = withTiming(screenHeight, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
        backdropOpacity.value = withTiming(0, { duration: 200 });
      } else {
        translateY.value = withTiming(0, { duration: 200 });
        backdropOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

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
    <Modal visible={!!meme} transparent animationType="none" onRequestClose={dismiss}>
      {/* Backdrop */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 top-0 bg-black"
        style={backdropStyle}
      />

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View className="flex-1" style={sheetStyle}>
          <View className="flex-1 bg-black">
            {/* Close button */}
            <View className="absolute right-4 top-14 z-10">
              <Pressable
                onPress={dismiss}
                className="items-center justify-center rounded-full bg-white/20 p-2 active:bg-white/30"
              >
                <IconSymbol name="xmark" size={20} color="#ffffff" />
              </Pressable>
            </View>

            {/* Swipe indicator */}
            <View className="items-center pt-3">
              <View className="h-1 w-10 rounded-full bg-white/40" />
            </View>

            {/* Image */}
            <View className="flex-1 items-center justify-center">
              <Image
                source={{ uri: meme.uri }}
                style={{ width: '100%', flex: 1 }}
                contentFit="contain"
              />
            </View>

            {/* Tags section */}
            <View className="px-4 pt-2">
              {isEditingTags ? (
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-white/70">Edit Tags</Text>
                    <Pressable onPress={() => setIsEditingTags(false)}>
                      <Text className="text-sm text-blue-400">Done</Text>
                    </Pressable>
                  </View>
                  <TagInput tags={meme.tags} onTagsChange={handleTagsChange} />
                </View>
              ) : (
                <Pressable
                  onPress={() => setIsEditingTags(true)}
                  className="flex-row flex-wrap items-center gap-1.5"
                >
                  {meme.tags.length > 0 ? (
                    meme.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0.5">
                        <Text className="text-xs">{tag}</Text>
                      </Badge>
                    ))
                  ) : (
                    <Text className="text-sm text-white/40">No tags</Text>
                  )}
                  <IconSymbol name="pencil" size={14} color="rgba(255,255,255,0.4)" />
                </Pressable>
              )}
            </View>

            {/* Action buttons */}
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
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}
