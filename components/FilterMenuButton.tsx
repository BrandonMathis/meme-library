import { useState, useCallback } from 'react';
import { View, Pressable, useColorScheme, Platform } from 'react-native';
import { GlassView } from 'expo-glass-effect';

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

/**
 * Wrapper that renders a GlassView on iOS and a translucent fallback elsewhere.
 * GlassView falls back to a plain View on non-iOS, so we add our own
 * translucent background for web/Android to approximate the glass look.
 */
function GlassPanel({
  children,
  className,
  style,
  testID,
}: {
  children: React.ReactNode;
  className?: string;
  style?: object;
  testID?: string;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={isDark ? 'dark' : 'light'}
        className={className}
        style={style}
        testID={testID}
      >
        {children}
      </GlassView>
    );
  }

  // Web/Android: translucent background with backdrop blur
  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
          ...Platform.select({
            web: {
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            } as object,
          }),
        },
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}

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
      {/* Trigger button — morphs from icon to glass pill when filter is active */}
      <Pressable onPress={toggleMenu} testID="filter-button" accessibilityLabel="Filter memes">
        {isFilterActive ? (
          <GlassPanel
            className="flex-row items-center overflow-hidden rounded-full px-3 py-1.5"
            testID="filter-pill"
          >
            <IconSymbol name="line.3.horizontal.decrease.circle.fill" size={16} color="#007AFF" />
            <Text className="ml-1.5 text-xs font-semibold" style={{ color: '#007AFF' }}>
              {activeLabel}
            </Text>
          </GlassPanel>
        ) : (
          <View className="rounded-full p-1.5 active:opacity-70">
            <IconSymbol name="line.3.horizontal.decrease.circle" size={22} color="#9ca3af" />
          </View>
        )}
      </Pressable>

      {/* Popup menu — liquid glass panel */}
      {menuVisible && (
        <>
          <Pressable
            onPress={() => setMenuVisible(false)}
            testID="filter-backdrop"
            className="fixed inset-0 z-40"
            style={{
              position: 'absolute',
              top: -500,
              left: -500,
              right: -500,
              bottom: -500,
            }}
          />
          <GlassPanel
            className="absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl"
            style={{
              minWidth: 200,
              ...Platform.select({
                ios: {},
                default: {
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                },
              }),
              // Shadow
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 12,
            }}
            testID="filter-menu"
          >
            {options.map((option, index) => {
              const isSelected = activeFilter === option.key;
              return (
                <View key={option.key}>
                  {index > 0 && <Separator />}
                  <Pressable
                    onPress={() => handleSelect(option.key)}
                    testID={`filter-option-${option.key}`}
                    className={cn(
                      'flex-row items-center justify-between px-4 py-3 active:opacity-70',
                      isSelected && (isDark ? 'bg-white/10' : 'bg-black/5'),
                    )}
                  >
                    <View className="flex-row items-center gap-2.5">
                      {option.icon && (
                        <IconSymbol
                          name={option.icon}
                          size={18}
                          color={isSelected ? '#007AFF' : '#9ca3af'}
                        />
                      )}
                      <Text
                        className={cn('text-sm', isSelected ? 'font-semibold' : 'font-normal')}
                        style={{ color: isDark ? '#fff' : '#000' }}
                      >
                        {option.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <IconSymbol name="checkmark.circle.fill" size={18} color="#007AFF" />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </GlassPanel>
        </>
      )}
    </View>
  );
}
