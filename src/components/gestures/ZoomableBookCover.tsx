import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BorderRadius, Shadows } from '@/constants/theme';

interface ZoomableBookCoverProps {
  uri: string;
  width?: number;
  height?: number;
}

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

export const ZoomableBookCover: React.FC<ZoomableBookCoverProps> = ({
  uri,
  width = 148,
  height = 220,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd(() => {
      runOnJS(triggerHaptic)();
      if (scale.value > 1.2) {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        savedScale.value = 1;
      } else {
        scale.value = withSpring(2.2, { damping: 14, stiffness: 220 });
        savedScale.value = 2.2;
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, 0.9), 3.5);
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        savedScale.value = 1;
      } else {
        savedScale.value = scale.value;
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.coverFrame, { width, height }]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri }}
            style={styles.bookCover}
            contentFit="cover"
            transition={200}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  coverFrame: {
    borderRadius: BorderRadius.lg, // 16px
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
});
