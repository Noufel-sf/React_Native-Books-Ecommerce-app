import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Shadows, Typography } from '@/constants/theme';

interface SwipeToDeleteRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

const ACTION_WIDTH = 84;
const SWIPE_THRESHOLD = 50;

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }
};

export const SwipeToDeleteRow: React.FC<SwipeToDeleteRowProps> = ({
  children,
  onDelete,
  deleteLabel = 'DELETE',
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue<number | undefined>(undefined);
  const opacity = useSharedValue(1);
  const hasHapticFired = useSharedValue(false);

  const handleDelete = () => {
    triggerHaptic();
    translateX.value = withTiming(-Dimensions.get('window').width, { duration: 220 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDelete)();
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only permit swiping to the left
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -ACTION_WIDTH - 20);

        if (event.translationX < -SWIPE_THRESHOLD && !hasHapticFired.value) {
          hasHapticFired.value = true;
          runOnJS(triggerHaptic)();
        } else if (event.translationX >= -SWIPE_THRESHOLD) {
          hasHapticFired.value = false;
        }
      }
    })
    .onEnd((event) => {
      hasHapticFired.value = false;
      if (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -400) {
        translateX.value = withSpring(-ACTION_WIDTH, { damping: 18, stiffness: 220 });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const actionAnimatedStyle = useAnimatedStyle(() => {
    const scale = Math.min(1.15, Math.max(0.6, -translateX.value / ACTION_WIDTH));
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Red Neobrutalist Delete Action Button Behind */}
      <View style={styles.actionContainer}>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Delete item"
        >
          <Animated.View style={[styles.actionContent, actionAnimatedStyle]}>
            <Trash2 size={20} color="#000000" strokeWidth={2.5} />
            <Text style={styles.deleteText}>{deleteLabel}</Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Swipeable Foreground Item */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={rowAnimatedStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 2,
    overflow: 'hidden',
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 12,
    right: 0,
    width: ACTION_WIDTH - 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6B4A',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
});
