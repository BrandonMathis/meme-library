import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const NUM_COLUMNS = 3;
const NUM_PHOTOS = 20;
const GAP = 2;

export default function AddScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const imageSize = (width - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

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
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText>Requesting photo access...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText type="subtitle">Photo Access Required</ThemedText>
          <ThemedText>Please grant photo library access in your device settings.</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Add Meme</ThemedText>
        <ThemedText>Tap a photo to add it to your library</ThemedText>
      </View>
      <FlatList
        data={photos}
        numColumns={NUM_COLUMNS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePhotoPress(item)} activeOpacity={0.7}>
            <Image source={{ uri: item.uri }} style={{ width: imageSize, height: imageSize }} />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    gap: 4,
  },
  grid: {
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
});
