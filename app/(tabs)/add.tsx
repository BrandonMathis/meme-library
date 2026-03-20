import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/text';

const NUM_COLUMNS = 3;
const NUM_PHOTOS = 50;
const GAP = 2;

export default function AddScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const imageSize = (width - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const flatListRef = useRef<FlatList>(null);
  const hasScrolledRef = useRef(false);
  const layoutHeightRef = useRef(0);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>(
    'undetermined',
  );

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');

      if (status === 'granted') {
        const result = await MediaLibrary.getAssetsAsync({
          first: NUM_PHOTOS,
          mediaType: 'photo',
          sortBy: [MediaLibrary.SortBy.creationTime],
        });
        // Reverse so most recent is last (bottom-right in grid)
        setPhotos(result.assets.reverse());
      }
    })();
  }, []);

  const handlePhotoPress = (asset: MediaLibrary.Asset) => {
    router.push({ pathname: '/add-meme-modal', params: { uri: asset.uri } });
  };

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: GAP, paddingBottom: bottom + 80 }}
        columnWrapperStyle={{ gap: GAP }}
        onLayout={(e) => {
          layoutHeightRef.current = e.nativeEvent.layout.height;
        }}
        onContentSizeChange={(_w, contentHeight) => {
          if (photos.length > 0 && !hasScrolledRef.current && layoutHeightRef.current > 0) {
            const offset = contentHeight - layoutHeightRef.current;
            if (offset > 0) {
              hasScrolledRef.current = true;
              flatListRef.current?.scrollToOffset({ offset, animated: false });
            }
          }
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePhotoPress(item)} activeOpacity={0.7}>
            <Image source={{ uri: item.uri }} style={{ width: imageSize, height: imageSize }} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
