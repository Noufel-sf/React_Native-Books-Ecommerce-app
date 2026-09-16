import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { Star, Crown, BookOpen, Heart } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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

  const handleCardPress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <View style={[styles.card, width !== undefined ? { width } : null, style]}>
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [
          styles.clickableBody,
          { opacity: pressed ? 0.92 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View ${book.title}`}
      >
        {/* Book Cover Frame with Soft Drop Shadow & Crown */}
        <View style={styles.coverFrame}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />

          {/* Top-Right Crown Emblem */}
          {(book.hasCrown || book.badge === 'Popular' || book.badge === 'Bestseller') && (
            <View style={styles.crownBadge}>
              <Crown size={12} color="#D97706" fill="#FBBF24" />
            </View>
          )}

          {/* Floating Subtle Wishlist Toggle */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              toggleFavorite(book.id);
            }}
            hitSlop={8}
            style={styles.heartBtn}
            accessibilityRole="button"
            accessibilityLabel="Toggle favorite"
          >
            <Heart
              size={12}
              color={favorite ? '#EF4444' : '#FFFFFF'}
              fill={favorite ? '#EF4444' : 'rgba(0,0,0,0.2)'}
            />
          </Pressable>
        </View>

        {/* Title & Author Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          {/* Rating & Picked Pill Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Star size={11} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
            </View>

            {book.picked && (
              <View style={styles.pickedBadge}>
                <BookOpen size={9} color="#6366F1" strokeWidth={2.2} />
                <Text style={styles.pickedText}>Picked</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </View>
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
  coverFrame: {
    width: '100%',
    aspectRatio: 0.69,
    borderRadius: BorderRadius.md, // 12px
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
    ...Shadows.bookCover,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  crownBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 13.5,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: 11.5,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
    marginTop: 2,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  pickedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    gap: 3,
  },
  pickedText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.semiBold,
    color: '#6366F1',
  },
});
