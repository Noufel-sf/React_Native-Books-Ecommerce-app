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
      <SkeletonBox width={95} height={135} style={{ borderWidth: 2, borderColor: '#000000' }} />
    </View>
  );
};

export const ContinueReadingSkeleton: React.FC = () => {
  return (
    <View style={styles.continueCard}>
      <SkeletonBox width={72} height={100} style={{ marginRight: 14 }} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SkeletonBox width={50} height={18} style={{ marginBottom: 8 }} />
        <SkeletonBox width="80%" height={16} style={{ marginBottom: 6 }} />
        <SkeletonBox width="50%" height={12} style={{ marginBottom: 10 }} />
        <SkeletonBox width="100%" height={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#EBE5D8',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 0,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 10,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  coverSkeleton: {
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#DCD4C4',
  },
  heroBanner: {
    backgroundColor: '#FAF5EE',
    borderRadius: 0,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
});
