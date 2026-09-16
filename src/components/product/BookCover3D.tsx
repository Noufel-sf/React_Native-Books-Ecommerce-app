import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Shadows } from '@/constants/theme';

interface BookCover3DProps {
  imageUrl: string;
  width?: number;
  height?: number;
  style?: ViewStyle;
  variant?: 'flat' | 'angled' | 'hero';
}

export const BookCover3D: React.FC<BookCover3DProps> = ({
  imageUrl,
  width = 110,
  height = 150,
  style,
  variant = 'angled',
}) => {
  return (
    <View
      style={[
        styles.container,
        { width, height },
        variant === 'hero' ? Shadows.heroCover : Shadows.bookCover,
        style,
      ]}
    >
      {/* 3D Book Spine & Cover */}
      <View style={[styles.bookWrapper, { width, height }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />

        {/* Realistic Hardcover Spine Overlay */}
        <View style={styles.spineOverlay} />

        {/* Book spine crease line */}
        <View style={styles.spineCrease} />

        {/* Subtle page rim edge on the right */}
        <View style={styles.pageRim} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  bookWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  spineOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  spineCrease: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  pageRim: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2.5,
    backgroundColor: 'rgba(240, 235, 225, 0.7)',
  },
});
