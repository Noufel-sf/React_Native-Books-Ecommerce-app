import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Shadows, Typography } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  width?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width = 156 }) => {
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
    <View style={[styles.card, { width }]}>
      {/* Clickable Card Body */}
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [
          styles.clickableBody,
          {
            transform: [
              { translateX: pressed ? 2 : 0 },
              { translateY: pressed ? 2 : 0 },
            ],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View ${book.title}`}
      >
        {/* Book Cover Frame */}
        <View style={styles.coverFrame}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
          {/* Rating tag in bottom left of cover */}
          <View style={styles.ratingTag}>
            <Star size={10} color="#000000" fill="#FFDE59" />
            <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Title & Author */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          {/* Price Tag Pill */}
          <View style={styles.priceRow}>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>${book.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Sibling Wishlist Heart Sticker Button */}
      <Pressable
        onPress={handleFavoritePress}
        hitSlop={8}
        style={({ pressed }) => [
          styles.heartBtn,
          favorite && styles.heartBtnActive,
          {
            transform: [
              { translateX: pressed ? 1.5 : 0 },
              { translateY: pressed ? 1.5 : 0 },
            ],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle favorite"
      >
        <Heart
          size={14}
          color="#000000"
          fill={favorite ? '#FF6B4A' : '#FFFFFF'}
          strokeWidth={2.5}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 10,
    marginRight: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    position: 'relative',
    ...Shadows.card,
  },
  clickableBody: {
    flex: 1,
  },
  coverFrame: {
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000',
    position: 'relative',
    backgroundColor: '#FAF5EE',
  },
  coverImage: {
    width: '100%',
    height: 180,
  },
  ratingTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  heartBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Shadows.sm,
  },
  heartBtnActive: {
    backgroundColor: '#FFA6D5',
  },
  infoSection: {
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    marginTop: 2,
  },
  priceRow: {
    marginTop: 8,
    flexDirection: 'row',
  },
  pricePill: {
    backgroundColor: '#2EEC96',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priceText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
});
