import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Heart, Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/Badge';
import { BookCover3D } from '@/components/product/BookCover3D';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Colors } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  width?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width = 160 }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);

  const handleCardPress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  const handleFavoritePress = () => {
    toggleFavorite(book.id);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.card,
        { width },
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${book.title}`}
    >
      {/* Top Row: Badge & Wishlist Heart */}
      <View style={styles.topRow}>
        <Badge label="READ NOW" variant="readNow" />
        <Pressable
          onPress={handleFavoritePress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.heartButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Toggle favorite"
        >
          <Heart
            size={18}
            color={favorite ? '#C94A3D' : '#A49B8F'}
            fill={favorite ? '#C94A3D' : 'transparent'}
          />
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
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1816',
    letterSpacing: -0.2,
  },
  crownIcon: {
    marginLeft: 4,
  },
  author: {
    fontSize: 11,
    color: '#8C8276',
    marginTop: 2,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B87826',
  },
  originalPrice: {
    fontSize: 11,
    color: '#A49B8F',
    textDecorationLine: 'line-through',
  },
});
