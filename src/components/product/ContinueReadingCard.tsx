import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Star, Bookmark } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { useReadingProgressStore } from '@/store/readingProgressStore';
import { BookReaderModal } from '@/components/product/BookReaderModal';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface ContinueReadingCardProps {
  book: Book;
  fullWidth?: boolean;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({ book, fullWidth = false }) => {
  const router = useRouter();
  const [readerVisible, setReaderVisible] = useState(false);

  const liveProgress = useReadingProgressStore((s) => s.progressMap[book.id]);
  const progressPercent =
    liveProgress !== undefined
      ? liveProgress.progressPercent
      : (book.readingProgress ?? 40);

  const handlePress = () => {
    setReaderVisible(true);
  };

  return (
    <View style={[styles.container, fullWidth && styles.containerFullWidth]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          fullWidth && styles.cardFullWidth,
          { opacity: pressed ? 0.95 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Continue reading ${book.title}`}
      >
        {/* Left: Thumbnail Cover */}
        <View style={styles.thumbnailFrame}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.thumbnailImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Right: Book Details & Slim Progress */}
        <View style={styles.detailsContainer}>
          {/* Rating & Bookmark Row */}
          <View style={styles.topMetaRow}>
            <View style={styles.ratingBox}>
              <Star size={10} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.bookmarkTag}>
              <Bookmark size={10} color="#6366F1" fill="#6366F1" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>

          {/* Author */}
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          {/* Sleek Minimal Progress Track */}
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      </Pressable>

      {/* Reader Modal */}
      <BookReaderModal
        visible={readerVisible}
        onClose={() => setReaderVisible(false)}
        bookId={book.id}
        title={book.title}
        author={book.author}
        coverImage={book.coverImage}
        onBuyPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 14,
  },
  containerFullWidth: {
    marginRight: 0,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg, // 16px
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 240,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  cardFullWidth: {
    width: '100%',
  },
  thumbnailFrame: {
    width: 48,
    height: 68,
    borderRadius: BorderRadius.xs, // 6px
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    ...Shadows.sm,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 10.5,
    fontFamily: Typography.sans.semiBold,
    color: '#D97706',
  },
  bookmarkTag: {
    padding: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    marginTop: 1,
    marginBottom: 6,
  },
  progressTrack: {
    height: 3.5,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary, // Golden amber #D97706
    borderRadius: 2,
  },
});
