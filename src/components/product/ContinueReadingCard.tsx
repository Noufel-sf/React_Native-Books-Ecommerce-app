import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bookmark, Heart, Star } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/Badge';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Shadows, Typography } from '@/constants/theme';

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
          {
            transform: [
              { translateX: pressed ? 1.5 : 0 },
              { translateY: pressed ? 1.5 : 0 },
            ],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Continue reading ${book.title}`}
      >
        {/* Left: Thumbnail Cover */}
        <View style={styles.coverFrame}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Right Details */}
        <View style={styles.detailsContainer}>
          {/* Top: READ NOW & Rating */}
          <View style={styles.topRow}>
            <Badge label="IN PROGRESS" variant="readNow" />
            <View style={styles.ratingBadge}>
              <Star size={10} color="#000000" fill="#FFDE59" />
              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>

          {/* Author */}
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
                {book.readingProgress}% DONE • Page {book.currentPage ?? 120} of {book.pages}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* Sibling Heart Overlay button */}
      <Pressable
        onPress={() => toggleFavorite(book.id)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.heartOverlay,
          favorite && styles.heartOverlayActive,
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
          size={13}
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
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    position: 'relative',
    ...Shadows.card,
  },
  contentPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coverFrame: {
    width: 72,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    marginRight: 14,
    ...Shadows.sm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
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
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  title: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F0EBE0',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2EEC96',
  },
  progressText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    marginTop: 4,
  },
  heartOverlay: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Shadows.sm,
  },
  heartOverlayActive: {
    backgroundColor: '#FFA6D5',
  },
});
