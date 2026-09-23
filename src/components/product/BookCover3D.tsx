import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Shadows } from '@/constants/theme';

interface BookCover3DProps {
  imageUrl: string;
  width?: number;
  height?: number;
  style?: ViewStyle;
  variant?: 'flat' | 'angled' | 'hero' | 'shelf';
  borderRadius?: number;
}

export const BookCover3D: React.FC<BookCover3DProps> = ({
  imageUrl,
  width = 110,
  height = 150,
  style,
  variant = 'shelf',
  borderRadius = 10,
}) => {
  const getShadow = () => {
    switch (variant) {
      case 'hero':
        return Shadows.heroCover;
      case 'shelf':
        return Shadows.bookShelf;
      case 'flat':
        return Shadows.card;
      case 'angled':
      default:
        return Shadows.bookCover;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius },
        getShadow(),
        style,
      ]}
    >
      <View style={[styles.bookWrapper, { width, height, borderRadius }]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={300}
        />

        {/* Realistic Book Spine Shadow Gradient Effect */}
        <View style={styles.spineShadow} />
        <View style={styles.spineHighlight} />

        {/* Top-Right Ambient Specular Sheen */}
        <View style={styles.topSheen} />

        {/* Right Edge Layered Paper Rim */}
        <View style={styles.pageRim} />
        <View style={styles.pageRimInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  bookWrapper: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  spineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  spineHighlight: {
    position: 'absolute',
    left: 11,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  topSheen: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pageRim: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2.5,
    backgroundColor: 'rgba(245, 240, 230, 0.85)',
  },
  pageRimInner: {
    position: 'absolute',
    right: 2.5,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
