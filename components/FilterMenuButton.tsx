import { useState, useCallback } from 'react';
import { View, Pressable, useColorScheme, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Separator } from '@/components/ui/Separator';
import { cn } from '@/lib/utils';

export type FilterOption = {
  key: string;
  label: string;
  icon?: Parameters<typeof IconSymbol>[0]['name'];
};

type FilterMenuButtonProps = {
  options: FilterOption[];
  activeFilter: string;
  onSelect: (key: string) => void;
};

export function FilterMenuButton({ options, activeFilter, onSelect }: FilterMenuButtonProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isFilterActive = activeFilter !== options[0]?.key;
  const activeLabel = options.find((o) => o.key === activeFilter)?.label;

  const toggleMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (key: string) => {
      onSelect(key);
      setMenuVisible(false);
    },
    [onSelect],
  );

  return (
    <View>
      <Pressable
        onPress={toggleMenu}
        testID="filter-button"
        accessibilityLabel="Filter memes"
        className={cn(
          'flex-row items-center rounded-full active:opacity-70',
          isFilterActive ? 'bg-primary px-3 py-1.5' : 'p-1.5',
        )}
      >
        <IconSymbol
          name={
            isFilterActive
              ? 'line.3.horizontal.decrease.circle.fill'
              : 'line.3.horizontal.decrease.circle'
          }
          size={isFilterActive ? 16 : 22}
          color={isFilterActive ? (isDark ? '#000' : '#fff') : '#9ca3af'}
        />
        {isFilterActive && activeLabel && (
          <Text className="ml-1.5 text-xs font-semibold text-primary-foreground">
            {activeLabel}
          </Text>
        )}
      </Pressable>

      {menuVisible && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuVisible(false)}
            testID="filter-backdrop"
            className="fixed inset-0 z-40"
          />
          <View
            testID="filter-menu"
            className={cn(
              'absolute right-0 top-full z-50 mt-1 rounded-xl border border-border shadow-lg',
              isDark ? 'bg-card' : 'bg-card',
            )}
            style={{ minWidth: 180 }}
          >
            {options.map((option, index) => (
              <View key={option.key}>
                {index > 0 && <Separator />}
                <Pressable
                  onPress={() => handleSelect(option.key)}
                  testID={`filter-option-${option.key}`}
                  className={cn(
                    'flex-row items-center justify-between px-4 py-3 active:opacity-70',
                    index === 0 && 'rounded-t-xl',
                    index === options.length - 1 && 'rounded-b-xl',
                    activeFilter === option.key && (isDark ? 'bg-accent/60' : 'bg-accent'),
                  )}
                >
                  <View className="flex-row items-center gap-2.5">
                    {option.icon && (
                      <IconSymbol
                        name={option.icon}
                        size={18}
                        color={activeFilter === option.key ? '#007AFF' : '#9ca3af'}
                      />
                    )}
                    <Text
                      className={cn(
                        'text-sm',
                        activeFilter === option.key
                          ? 'font-semibold text-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {activeFilter === option.key && (
                    <IconSymbol name="checkmark.circle.fill" size={18} color="#007AFF" />
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
