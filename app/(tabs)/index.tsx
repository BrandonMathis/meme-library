import { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMemeLibrary, type MemeEntry } from '@/context/MemeLibrary';
import MemeDetailModal from '@/components/MemeDetailModal';

const NUM_COLUMNS = 2;
const GAP = 8;

export default function LibraryScreen() {
  const { memes } = useMemeLibrary();
  const [search, setSearch] = useState('');
  const [selectedMeme, setSelectedMeme] = useState<MemeEntry | null>(null);
  const { width } = useWindowDimensions();

  const itemSize = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  const filtered = useMemo(() => {
    if (!search.trim()) return memes;
    const q = search.toLowerCase().trim();
    return memes.filter((m) => m.tags.some((t) => t.toLowerCase().includes(q)));
  }, [memes, search]);

  const renderItem = useCallback(
    ({ item }: { item: MemeEntry }) => (
      <Pressable
        onPress={() => setSelectedMeme(item)}
        className="active:opacity-80"
        style={{ width: itemSize, margin: GAP / 2 }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: itemSize, height: itemSize, borderRadius: 12 }}
          contentFit="cover"
        />
        {item.tags.length > 0 && (
          <View className="mt-1 flex-row flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-1.5 py-0">
                <Text className="text-[10px]">{tag}</Text>
              </Badge>
            ))}
          </View>
        )}
      </Pressable>
    ),
    [itemSize],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-2 pt-14">
        <Text variant="h3" className="mb-3">
          Library
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="relative flex-1">
            <View className="absolute left-3 top-0 z-10 h-full justify-center">
              <IconSymbol name="magnifyingglass" size={16} color="#9ca3af" />
            </View>
            <Input
              placeholder="Search by tag..."
              value={search}
              onChangeText={setSearch}
              className="pl-9"
            />
          </View>
        </View>
      </View>

      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text variant="muted">
            {memes.length === 0
              ? 'Your meme collection will appear here.'
              : 'No memes match your search.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ paddingHorizontal: GAP / 2, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MemeDetailModal meme={selectedMeme} onClose={() => setSelectedMeme(null)} />
    </View>
  );
}
