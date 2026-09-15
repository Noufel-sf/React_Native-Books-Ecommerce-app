import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X, ShoppingBag, Info, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Typography, Shadows } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

export const ToastContainer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentToast, hideToast } = useToastStore();

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (currentToast) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      translateY.value = withSpring(0, { damping: 14, stiffness: 220 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      translateY.value = withTiming(-120, { duration: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [currentToast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!currentToast) return null;

  const getIcon = () => {
    switch (currentToast.type) {
      case 'error':
        return <AlertTriangle size={18} color="#000000" strokeWidth={2.5} />;
      case 'info':
        return <Info size={18} color="#000000" strokeWidth={2.5} />;
      case 'success':
      default:
        return <ShoppingBag size={18} color="#000000" strokeWidth={2.5} />;
    }
  };

  const getBgColor = () => {
    switch (currentToast.type) {
      case 'error':
        return '#FF6B4A';
      case 'info':
        return '#2EEC96';
      case 'success':
      default:
        return '#FFDE59';
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { top: Math.max(insets.top + 8, 16) }]}
    >
      <Animated.View
        style={[
          styles.toastCard,
          { backgroundColor: getBgColor() },
          animatedStyle,
        ]}
      >
        <View style={styles.iconBox}>{getIcon()}</View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentToast.title}
          </Text>
          {currentToast.message && (
            <Text style={styles.message} numberOfLines={2}>
              {currentToast.message}
            </Text>
          )}
        </View>

        {currentToast.actionLabel && currentToast.onAction && (
          <Pressable
            onPress={() => {
              currentToast.onAction?.();
              hideToast();
            }}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                transform: [
                  { translateX: pressed ? 1.5 : 0 },
                  { translateY: pressed ? 1.5 : 0 },
                ],
              },
            ]}
          >
            <Text style={styles.actionBtnText}>{currentToast.actionLabel}</Text>
          </Pressable>
        )}

        <Pressable
          onPress={hideToast}
          style={styles.closeBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <X size={14} color="#000000" strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Shadows.card,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  message: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#333333',
    marginTop: 1,
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Shadows.sm,
  },
  actionBtnText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
});
