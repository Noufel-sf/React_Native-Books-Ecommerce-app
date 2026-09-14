import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Typography } from '@/constants/theme';

interface BookCardProps {
  book: Book;
  width?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width = 148 }) => {
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
    <View style={[styles.cardContainer, { width }]}>
      {/* Clickable Book Cover */}
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [
          styles.coverPressable,
          { opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View ${book.title}`}
      >
        <Image
          source={{ uri: book.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
          transition={200}
        />
      </Pressable>

      {/* Sibling Wishlist Heart Overlay */}
      <Pressable
        onPress={handleFavoritePress}
        hitSlop={8}
        style={({ pressed }) => [
          styles.heartBtn,
          { opacity: pressed ? 0.75 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle favorite"
      >
        <Heart
          size={16}
          color={favorite ? '#EA8616' : 'rgba(255, 255, 255, 0.9)'}
          fill={favorite ? '#EA8616' : 'rgba(0, 0, 0, 0.25)'}
        />
      </Pressable>

      {/* Book Title & Author directly underneath cover */}
      <Pressable
        onPress={handleCardPress}
        style={styles.infoPressable}
        accessibilityRole="button"
      >
        <Text style={styles.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 16,
    position: 'relative',
  },
  coverPressable: {
    borderRadius: 18,
    backgroundColor: '#FAF5EE',
    shadowColor: '#1A1816',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  coverImage: {
    width: '100%',
    height: 215,
    borderRadius: 18,
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoPressable: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginTop: 3,
  },
});
