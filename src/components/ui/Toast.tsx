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
        return <AlertTriangle size={16} color="#18181B" strokeWidth={2.5} />;
      case 'info':
        return <Info size={16} color="#18181B" strokeWidth={2.5} />;
      case 'success':
      default:
        return <Check size={16} color="#18181B" strokeWidth={3} />;
    }
  };

  const getIconBgColor = () => {
    switch (currentToast.type) {
      case 'error':
        return '#FF6B4A'; // Tangerine / Red
      case 'info':
        return '#38BDF8'; // Cyan Blue
      case 'success':
      default:
        return '#FFD027'; // Cyber Yellow
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { top: Math.max(insets.top + 10, Platform.OS === 'web' ? 24 : 16) }]}
    >
      <Animated.View style={[styles.toastCard, animatedStyle]}>
        {/* Leading Icon with Pop Border */}
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
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
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
          <X size={15} color="#18181B" strokeWidth={2.2} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.popMd,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  message: {
    fontSize: 11.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 1,
  },
  actionBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.2,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
