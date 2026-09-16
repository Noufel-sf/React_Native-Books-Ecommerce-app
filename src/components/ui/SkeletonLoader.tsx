import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Shadows } from '@/constants/theme';

interface SkeletonBoxProps {
  width: DimensionValue;
  height: number;
  style?: any;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({ width, height, style }) => {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.box,
        { width, height },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const BookSkeletonCard: React.FC<{ width?: DimensionValue }> = ({ width = 168 }) => {
  return (
    <View style={[styles.bookCard, { width }]}>
      <SkeletonBox width="100%" height={190} style={styles.coverSkeleton} />
      <SkeletonBox width="85%" height={16} style={{ marginTop: 10 }} />
      <SkeletonBox width="55%" height={12} style={{ marginTop: 6 }} />
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <SkeletonBox width={55} height={20} />
      </View>
    </View>
  );
};

export const HeroSkeletonBanner: React.FC = () => {
  return (
    <View style={styles.heroBanner}>
      <View style={{ flex: 1.1, paddingRight: 12 }}>
        <SkeletonBox width={80} height={22} style={{ marginBottom: 12 }} />
        <SkeletonBox width="90%" height={24} style={{ marginBottom: 6 }} />
        <SkeletonBox width="60%" height={16} style={{ marginBottom: 14 }} />
        <SkeletonBox width={95} height={28} />
      </View>
      <SkeletonBox width={95} height={135} style={{ borderRadius: 12 }} />
    </View>
  );
};

export const ContinueReadingSkeleton: React.FC = () => {
  return (
    <View style={styles.continueCard}>
      <SkeletonBox width={48} height={68} style={{ marginRight: 12, borderRadius: 6 }} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SkeletonBox width={50} height={14} style={{ marginBottom: 6, borderRadius: 4 }} />
        <SkeletonBox width="80%" height={16} style={{ marginBottom: 6, borderRadius: 4 }} />
        <SkeletonBox width="50%" height={12} style={{ marginBottom: 8, borderRadius: 4 }} />
        <SkeletonBox width="100%" height={5} style={{ borderRadius: 3 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  coverSkeleton: {
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  heroBanner: {
    backgroundColor: '#FBF7F0',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
});
