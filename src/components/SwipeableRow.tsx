import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHaptics } from '../hooks/useHaptics';

const SWIPE_THRESHOLD = 110;

interface Props {
  children: React.ReactNode;
  onRemove: () => void;
}

export default function SwipeableRow({ children, onRemove }: Props) {
  const translateX = useSharedValue(0);
  const height = useSharedValue<number | undefined>(undefined);
  const opacity = useSharedValue(1);
  const marginBottom = useSharedValue(12);

  const { onDelete } = useHaptics();

  const triggerHaptic = useCallback(() => {
    onDelete();
  }, [onDelete]);

  const performDelete = useCallback(() => {
    triggerHaptic();

    opacity.value = withTiming(0, { duration: 200 });
    marginBottom.value = withTiming(0, { duration: 250 });
    height.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onRemove)();
      }
    });
  }, [triggerHaptic, onRemove]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const toValue = e.translationX > 0 ? 500 : -500;
        translateX.value = withTiming(toValue, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(performDelete)();
          }
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    marginBottom: marginBottom.value,
    ...(height.value !== undefined ? { height: height.value } : {}),
  }));

  const leftIconStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
    transform: [{
      scale: interpolate(
        translateX.value,
        [0, 60, SWIPE_THRESHOLD],
        [0.6, 1, 1.2],
        Extrapolation.CLAMP
      ),
    }],
  }));

  const rightIconStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
    transform: [{
      scale: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, -60, 0],
        [1.2, 1, 0.6],
        Extrapolation.CLAMP
      ),
    }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.clipper}>

        <View style={styles.backdrop}>
          <Animated.View style={[styles.iconContainer, leftIconStyle]}>
            <MaterialCommunityIcons name="trash-can-outline" size={28} color={MD3Colors.onErrorContainer} />
          </Animated.View>

          <Animated.View style={[styles.iconContainer, rightIconStyle]}>
            <MaterialCommunityIcons name="trash-can-outline" size={28} color={MD3Colors.onErrorContainer} />
          </Animated.View>
        </View>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={rowStyle}
            onLayout={(e) => {
              if (height.value === undefined) {
                height.value = e.nativeEvent.layout.height;
              }
            }}
          >
            {children}
          </Animated.View>
        </GestureDetector>

      </View>
    </Animated.View>
  );
}

const MD3Colors = {
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
};

const styles = StyleSheet.create({
  clipper: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: MD3Colors.errorContainer,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});