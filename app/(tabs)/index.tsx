import { useState, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useMemeLibrary, type MemeEntry } from '@/context/MemeLibrary';
import { cn } from '@/lib/utils';

const NUM_COLUMNS = 2;
const GAP = 8;

type FilterOption = 'all' | 'favorites';

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All Memes' },
  { key: 'favorites', label: 'Favorites' },
];

export default function MemeLibraryScreen() {
  const { memes } = useMemeLibrary();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 49;
  const itemSize = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  const isFilterActive = activeFilter !== 'all';

  const filtered = useMemo(() => {
    let result = memes;

    if (activeFilter === 'favorites') {
      result = result.filter((m) => m.isFavorite);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((m) => m.tags.some((t) => t.toLowerCase().includes(q)));
    }

    return result;
  }, [memes, search, activeFilter]);

  const renderItem = useCallback(
    ({ item }: { item: MemeEntry }) => (
      <Pressable
        onPress={() => router.push({ pathname: '/MemeDetailModal', params: { id: item.id } })}
        className="active:opacity-80"
        style={{ width: itemSize, margin: GAP / 2 }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: itemSize, height: itemSize, borderRadius: 12 }}
          contentFit="cover"
          cachePolicy="memory-disk"
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
    [itemSize, router],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-3 pt-14">
        <View className="flex-row items-center justify-between">
          <Text variant="h3">Meme Library</Text>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setShowFilters((prev) => !prev)}
            accessibilityLabel="Filter memes"
            testID="filter-button"
          >
            <IconSymbol
              name={
                isFilterActive
                  ? 'line.3.horizontal.decrease.circle.fill'
                  : 'line.3.horizontal.decrease.circle'
              }
              size={22}
              color={isFilterActive ? '#007AFF' : '#9ca3af'}
            />
          </Button>
        </View>
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
        {showFilters && (
          <View className="mt-2 flex-row gap-2" testID="filter-bar">
            {FILTER_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => setActiveFilter(option.key)}
                testID={`filter-option-${option.key}`}
              >
                <Badge
                  variant={activeFilter === option.key ? 'default' : 'outline'}
                  className={cn('px-3 py-1', activeFilter === option.key && 'bg-primary')}
                >
                  <Text
                    className={cn(
                      'text-xs font-medium',
                      activeFilter === option.key
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {option.label}
                  </Text>
                </Badge>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{
          paddingHorizontal: GAP / 2,
          paddingBottom: TAB_BAR_HEIGHT + bottom,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2 pt-40">
            <Text variant="muted">
              {memes.length === 0
                ? 'Your meme collection will appear here.'
                : activeFilter === 'favorites' && !search.trim()
                  ? 'No favorite memes yet.'
                  : 'No memes match your search.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
