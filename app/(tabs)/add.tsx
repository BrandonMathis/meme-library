import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
  assetId,
  size,
  onPress,
}: {
  uri: string;
  assetId: string;
  size: number;
  onPress: (uri: string, assetId: string) => void;
}) {
  const handlePress = useCallback(() => onPress(uri, assetId), [uri, assetId, onPress]);
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

  // Keep ref in sync so onContentSizeChange has a stable identity
  photosLengthRef.current = photos.length;

  const contentContainerStyle = useMemo(() => ({ paddingBottom: bottom + 80 }), [bottom]);

  // Always fetch the latest photos and fully replace state so the list
  // is an exact mirror of the device library's most recent photos.
  const refreshPhotos = useCallback(async () => {
    const result = await fetchPhotos();
    setPhotos(result.assets.reverse());
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');

      if (status === 'granted') {
        await refreshPhotos();
      }
    })();
  }, [refreshPhotos]);

  // Real-time sync via MediaLibrary change listener (native only).
  // Fires when photos are added, deleted, or modified on the device.
  useEffect(() => {
    if (permissionStatus !== 'granted') return;
    if (Platform.OS === 'web') return;

    const subscription = MediaLibrary.addListener(() => {
      refreshPhotos();
    });

    return () => subscription.remove();
  }, [permissionStatus, refreshPhotos]);

  // Fallback: refresh on foreground (covers web where addListener is
  // unsupported, and catches any changes the native listener may miss).
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

  const handlePhotoPress = useCallback((uri: string, assetId: string) => {
    routerRef.current.push({ pathname: '/AddMemeModal', params: { uri, assetId } });
  }, []);

  const keyExtractor = useCallback((item: MediaLibrary.Asset) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaLibrary.Asset }) => (
      <PhotoItem uri={item.uri} assetId={item.id} size={imageSize} onPress={handlePhotoPress} />
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
      <View className="bg-primary px-4 pb-3 pt-14">
        <Text variant="h3" className="font-bold text-primary-foreground">
          Add Meme
        </Text>
        <Text variant="muted" className="mt-1 text-primary-foreground/70">
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
