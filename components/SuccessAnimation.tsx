import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Text } from '@/components/ui/Text';
import { useMemeLibrary } from '@/context/MemeLibrary';

export function SuccessAnimation() {
  const { lastAddedId, clearLastAdded } = useMemeLibrary();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (!lastAddedId) return;

    opacity.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
      withDelay(
        1000,
        withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) }, () => {
          runOnJS(clearLastAdded)();
        }),
      ),
    );

    scale.value = withSequence(
      withTiming(1.1, { duration: 200, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) }),
      withDelay(1000, withTiming(0.8, { duration: 400, easing: Easing.in(Easing.ease) })),
    );
  }, [lastAddedId, opacity, scale, clearLastAdded]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!lastAddedId) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={animatedStyle}
        className="items-center rounded-3xl bg-black/70 px-10 py-8"
      >
        <IconSymbol name="checkmark.circle.fill" size={56} color="white" />
        <Text className="mt-3 text-lg font-semibold text-white">Meme Saved!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});
