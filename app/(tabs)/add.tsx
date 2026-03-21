import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { FlashList, FlashListRef } from '@shopify/flash-list';

import { Text } from '@/components/ui/Text';

const NUM_COLUMNS = 3;
const NUM_PHOTOS = 50;
const GAP = 2;

function fetchPhotos() {
  return MediaLibrary.getAssetsAsync({
    first: NUM_PHOTOS,
    mediaType: 'photo',
    sortBy: [MediaLibrary.SortBy.creationTime],
  });
}

// Only primitive props so React.memo shallow comparison is bulletproof
const PhotoItem = memo(function PhotoItem({
  uri,
  size,
  onPress,
}: {
  uri: string;
  size: number;
  onPress: (uri: string) => void;
}) {
  const handlePress = useCallback(() => onPress(uri), [uri, onPress]);
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri }} style={{ width: size, height: size, margin: GAP / 2 }} />
    </TouchableOpacity>
  );
});

export default function AddMemeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const imageSize = width / NUM_COLUMNS - GAP;

  const listRef = useRef<FlashListRef<MediaLibrary.Asset>>(null);
  const hasInitiallyScrolled = useRef(false);
  const photosLengthRef = useRef(0);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>(
    'undetermined',
  );

  // Keep ref in sync so callbacks can read it without re-creating
  photosLengthRef.current = photos.length;

  const contentContainerStyle = useMemo(() => ({ paddingBottom: bottom + 80 }), [bottom]);

  // Initial load — full replace, no animation
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');

      if (status === 'granted') {
        const result = await fetchPhotos();
        setPhotos(result.assets.reverse());
      }
    })();
  }, []);

  // Refresh on foreground — remove deleted photos and merge new ones
  const refreshPhotos = useCallback(async () => {
    const result = await MediaLibrary.getAssetsAsync({
      first: Math.max(NUM_PHOTOS, photosLengthRef.current + 20),
      mediaType: 'photo',
      sortBy: [MediaLibrary.SortBy.creationTime],
    });
    const latest = result.assets.reverse();
    const latestIds = new Set(latest.map((a) => a.id));

    setPhotos((prev) => {
      // Remove photos that no longer exist in the device library
      const surviving = prev.filter((p) => latestIds.has(p.id));
      // Add any new photos not already in our list
      const existingIds = new Set(surviving.map((p) => p.id));
      const newPhotos = latest.filter((a) => !existingIds.has(a.id));

      if (surviving.length === prev.length && newPhotos.length === 0) return prev;
      return [...surviving, ...newPhotos];
    });
  }, []);

  useEffect(() => {
    if (permissionStatus !== 'granted') return;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshPhotos();
      }
    });

    return () => subscription.remove();
  }, [permissionStatus, refreshPhotos]);

  // Stable ref for router so handlePhotoPress never changes identity
  const routerRef = useRef(router);
  routerRef.current = router;

  const handlePhotoPress = useCallback((uri: string) => {
    routerRef.current.push({ pathname: '/AddMemeModal', params: { uri } });
  }, []);

  const keyExtractor = useCallback((item: MediaLibrary.Asset) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaLibrary.Asset }) => (
      <PhotoItem uri={item.uri} size={imageSize} onPress={handlePhotoPress} />
    ),
    [imageSize, handlePhotoPress],
  );

  // Use ref for photos.length so this callback has a stable identity (empty deps)
  const onContentSizeChange = useCallback((_: number, contentHeight: number) => {
    if (photosLengthRef.current > 0 && !hasInitiallyScrolled.current) {
      hasInitiallyScrolled.current = true;
      listRef.current?.scrollToOffset({ offset: contentHeight, animated: false });
    }
  }, []);

  if (permissionStatus === 'undetermined') {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text variant="muted">Requesting photo access...</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-background p-4">
        <Text variant="h4">Photo Access Required</Text>
        <Text variant="muted" className="text-center">
          Please grant photo library access in your device settings.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-3 pt-14">
        <Text variant="h3">Add Meme</Text>
        <Text variant="muted" className="mt-1">
          Tap a photo to add it to your library
        </Text>
      </View>
      <FlashList
        ref={listRef}
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        onContentSizeChange={onContentSizeChange}
        renderItem={renderItem}
      />
    </View>
  );
}
