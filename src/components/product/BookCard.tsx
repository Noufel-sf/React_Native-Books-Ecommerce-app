import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DimensionValue,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Star, Crown, BookOpen, Heart } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Book } from '@/types/book';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width, style }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleCardPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <Animated.View
      style={[
        styles.card,
        width !== undefined ? { width } : null,
        animatedStyle,
        style,
      ]}
    >
      {/* Cover with separate sibling touchable elements */}
      <View style={styles.coverWrapper}>
        <Pressable
          onPress={handleCardPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.coverPressable}
          accessibilityRole="button"
          accessibilityLabel={`View ${book.title}`}
        >
          {/* Realistic Physical Book Cover with Spine & Shadow */}
          <View style={styles.coverFrame}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />

            {/* Hardcover Spine Realistic Lighting */}
            <View style={styles.spineShadow} />
            <View style={styles.spineHighlight} />

            {/* Right Paper Edge */}
            <View style={styles.pageRim} />

            {/* Top-Right Crown / Bestseller Emblem */}
            {(book.hasCrown || book.badge === 'Popular' || book.badge === 'Bestseller') && (
              <View style={styles.crownBadge}>
                <Crown size={11} color="#D97706" fill="#FBBF24" />
              </View>
            )}
          </View>
        </Pressable>

        {/* Floating Glass Wishlist Button (Sibling, not nested) */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }
            toggleFavorite(book.id);
          }}
          hitSlop={8}
          style={styles.heartBtn}
          accessibilityRole="button"
          accessibilityLabel="Toggle favorite"
        >
          <Heart
            size={12}
            color={favorite ? '#E05345' : '#FFFFFF'}
            fill={favorite ? '#E05345' : 'rgba(0,0,0,0.3)'}
          />
        </Pressable>
      </View>

      {/* Title, Author & Price Info */}
      <Pressable
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.infoSection}
      >
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        {/* Meta Details: Rating, Price / Picked Tag */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Star size={10.5} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
          </View>

          {book.price ? (
            <Text style={styles.priceTag}>${book.price.toFixed(2)}</Text>
          ) : book.picked ? (
            <View style={styles.pickedBadge}>
              <BookOpen size={9} color="#6366F1" strokeWidth={2.2} />
              <Text style={styles.pickedText}>Picked</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 14,
  },
  clickableBody: {
    width: '100%',
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
  },
  coverPressable: {
    width: '100%',
  },
  coverFrame: {
    width: '100%',
    aspectRatio: 0.69,
    borderRadius: BorderRadius.md, // 12px
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
    borderWidth: 1.8,
    borderColor: '#18181B',
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
    width: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  spineHighlight: {
    position: 'absolute',
    left: 9,
    top: 0,
    bottom: 0,
    width: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  pageRim: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(240, 235, 225, 0.85)',
  },
  crownBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  heartBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  author: {
    fontSize: 11.5,
    fontFamily: Typography.sans.regular,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: Typography.sans.semiBold,
    color: '#D97706',
  },
  priceTag: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#111827',
  },
  pickedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  pickedText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.semiBold,
    color: '#6366F1',
  },
});
