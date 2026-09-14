import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bookmark, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/Badge';
import { BookCover3D } from '@/components/product/BookCover3D';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Typography } from '@/constants/theme';

interface ContinueReadingCardProps {
  book: Book;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({ book }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);

  const handlePress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.contentPressable,
          { opacity: pressed ? 0.94 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Continue reading ${book.title}`}
      >
        {/* Left: Thumbnail Cover */}
        <View style={styles.coverContainer}>
          <BookCover3D imageUrl={book.coverImage} width={75} height={105} />
        </View>

        {/* Right Details */}
        <View style={styles.detailsContainer}>
          {/* Top: READ NOW & Rating */}
          <View style={styles.topRow}>
            <Badge label="READ NOW" variant="readNow" />
            <Badge label={book.rating.toFixed(1)} variant="rating" />
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {book.title}
            </Text>
            <Bookmark size={13} color="#D48C2B" fill="#D48C2B" style={styles.crownIcon} />
          </View>

          {/* Author / Subtitle */}
          <Text style={styles.author} numberOfLines={1}>
            Novel by {book.author}
          </Text>

          {/* Progress Bar & Page meta */}
          {book.readingProgress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBarFill, { width: `${book.readingProgress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {book.readingProgress}% • Page {book.currentPage ?? 120} of {book.pages}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* Sibling Heart Overlay button */}
      <Pressable
        onPress={() => toggleFavorite(book.id)}
        hitSlop={8}
        style={styles.heartOverlay}
        accessibilityRole="button"
        accessibilityLabel="Toggle favorite"
      >
        <Heart
          size={14}
          color={favorite ? '#C94A3D' : '#FFFFFF'}
          fill={favorite ? '#C94A3D' : 'rgba(0,0,0,0.35)'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECE5D8',
    position: 'relative',
  },
  contentPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coverContainer: {
    position: 'relative',
    marginRight: 14,
  },
  heartOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 9999,
    padding: 4,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    flex: 1,
    letterSpacing: -0.2,
  },
  crownIcon: {
    marginLeft: 4,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#8C8276',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#EFEBE2',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D48C2B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#9E9488',
    marginTop: 4,
  },
});
