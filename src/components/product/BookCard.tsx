import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Heart, Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/Badge';
import { BookCover3D } from '@/components/product/BookCover3D';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Colors, Typography } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  width?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width = 160 }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);

  // Micro-interaction bounce animation for heart
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleCardPress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.35,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(book.id);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${book.title}`}
    >
      {/* Top Row: Badge & Wishlist Heart */}
      <View style={styles.topRow}>
        <Badge label="READ NOW" variant="readNow" />
        <Pressable
          onPress={handleFavoritePress}
          hitSlop={10}
          style={styles.heartButton}
          accessibilityRole="button"
          accessibilityLabel="Toggle favorite"
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Heart
              size={18}
              color={favorite ? '#C94A3D' : '#A49B8F'}
              fill={favorite ? '#C94A3D' : 'transparent'}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* Rating Pill */}
      <View style={styles.ratingContainer}>
        <Badge label={book.rating.toFixed(1)} variant="rating" />
      </View>

      {/* 3D Book Cover */}
      <View style={styles.coverWrapper}>
        <BookCover3D imageUrl={book.coverImage} width={105} height={145} />
      </View>

      {/* Title with editorial bookmark/crown */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Bookmark size={12} color="#D48C2B" fill="#D48C2B" style={styles.crownIcon} />
      </View>

      {/* Author */}
      <Text style={styles.author} numberOfLines={1}>
        by {book.author}
      </Text>

      {/* Price tag */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>${book.price.toFixed(2)}</Text>
        {book.originalPrice && (
          <Text style={styles.originalPrice}>${book.originalPrice.toFixed(2)}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heartButton: {
    padding: 2,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  coverWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    letterSpacing: -0.2,
  },
  crownIcon: {
    marginLeft: 4,
  },
  author: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8C8276',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#B87826',
  },
  originalPrice: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#A49B8F',
    textDecorationLine: 'line-through',
  },
});
