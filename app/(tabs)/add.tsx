import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  FlatList,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NUM_COLUMNS = 3;
const NUM_PHOTOS = 50;
const GAP = 2;

const columnWrapperStyle = { gap: GAP };

function fetchPhotos() {
  return MediaLibrary.getAssetsAsync({
    first: NUM_PHOTOS,
    mediaType: 'photo',
    sortBy: [MediaLibrary.SortBy.creationTime],
  });
}

const PhotoItem = memo(function PhotoItem({
  asset,
  size,
  onPress,
}: {
  asset: MediaLibrary.Asset;
  size: number;
  onPress: (asset: MediaLibrary.Asset) => void;
}) {
  const handlePress = useCallback(() => onPress(asset), [asset, onPress]);
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: asset.uri }} style={{ width: size, height: size }} />
    </TouchableOpacity>
  );
});

export default function AddMemeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const imageSize = (width - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const flatListRef = useRef<FlatList>(null);
  const hasInitiallyScrolled = useRef(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>(
    'undetermined',
  );

  const contentContainerStyle = useMemo(() => ({ gap: GAP, paddingBottom: bottom + 80 }), [bottom]);

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

  // Refresh on foreground — merge only new photos with animation
  const refreshPhotos = useCallback(async () => {
    const result = await fetchPhotos();
    const latest = result.assets.reverse();

    setPhotos((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newPhotos = latest.filter((a) => !existingIds.has(a.id));
      if (newPhotos.length === 0) return prev;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      // New photos (most recent) go at the end so they appear at the bottom
      return [...prev, ...newPhotos].slice(-NUM_PHOTOS);
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

  const handlePhotoPress = useCallback(
    (asset: MediaLibrary.Asset) => {
      router.push({ pathname: '/AddMemeModal', params: { uri: asset.uri } });
    },
    [router],
  );

  const keyExtractor = useCallback((item: MediaLibrary.Asset) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaLibrary.Asset }) => (
      <PhotoItem asset={item} size={imageSize} onPress={handlePhotoPress} />
    ),
    [imageSize, handlePhotoPress],
  );

  const onContentSizeChange = useCallback(
    (_: number, contentHeight: number) => {
      if (photos.length > 0 && !hasInitiallyScrolled.current) {
        hasInitiallyScrolled.current = true;
        flatListRef.current?.scrollToOffset({ offset: contentHeight, animated: false });
      }
    },
    [photos.length],
  );

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
      <View className="gap-1 px-4 pb-3 pt-16">
        <Text variant="h3" className="text-left">
          Add Meme
        </Text>
        <Text variant="muted">Tap a photo to add it to your library</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        columnWrapperStyle={columnWrapperStyle}
        onContentSizeChange={onContentSizeChange}
        renderItem={renderItem}
      />
    </View>
  );
}
