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
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

export const ToastContainer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentToast, hideToast } = useToastStore();

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (currentToast) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          currentToast.type === 'error'
            ? Haptics.NotificationFeedbackType.Error
            : Haptics.NotificationFeedbackType.Success
        ).catch(() => {});
      }
      translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
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
        return <AlertTriangle size={17} color="#EF4444" strokeWidth={2} />;
      case 'info':
        return <Info size={17} color="#3B82F6" strokeWidth={2} />;
      case 'success':
      default:
        return <ShoppingBag size={17} color="#D97706" strokeWidth={2} />;
    }
  };

  const getIconBgColor = () => {
    switch (currentToast.type) {
      case 'error':
        return '#FEE2E2';
      case 'info':
        return '#EFF6FF';
      case 'success':
      default:
        return '#FEF3C7';
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { top: Math.max(insets.top + 8, 16) }]}
    >
      <Animated.View style={[styles.toastCard, animatedStyle]}>
        {/* Leading Icon */}
        <View style={[styles.iconBox, { backgroundColor: getIconBgColor() }]}>
          {getIcon()}
        </View>

        {/* Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentToast.title}
          </Text>
          {currentToast.message ? (
            <Text style={styles.message} numberOfLines={2}>
              {currentToast.message}
            </Text>
          ) : null}
        </View>

        {/* Optional Action Button */}
        {currentToast.actionLabel && currentToast.onAction ? (
          <Pressable
            onPress={() => {
              currentToast.onAction?.();
              hideToast();
            }}
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.actionBtnText}>{currentToast.actionLabel}</Text>
          </Pressable>
        ) : null}

        {/* Dismiss Button */}
        <Pressable
          onPress={hideToast}
          hitSlop={8}
          style={styles.closeBtn}
          accessibilityLabel="Dismiss notification"
        >
          <X size={15} color="#9CA3AF" strokeWidth={2} />
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
    borderRadius: BorderRadius.xl, // 20px
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.floating,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
  },
  message: {
    fontSize: 11.5,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  actionBtn: {
    backgroundColor: '#D97706',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontFamily: Typography.sans.semiBold,
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 4,
  },
});
