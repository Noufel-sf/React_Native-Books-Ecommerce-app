import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Book } from '@/types/book';
import { useReadingProgressStore } from '@/store/readingProgressStore';
import { BookReaderModal } from '@/components/product/BookReaderModal';
import { Typography, BorderRadius } from '@/constants/theme';

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
      : (book.readingProgress ?? 65);

  const handleCardPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    setReaderVisible(true);
  };

  const handleArrowPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    router.push('/(tabs)/reading');
  };

  return (
    <View style={styles.outerContainer}>
      {/* Outer White Card with Black Outline */}
      <View style={styles.cardContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Continue Reading</Text>
          <Pressable
            onPress={handleArrowPress}
            style={({ pressed }) => [
              styles.arrowButton,
              { transform: [{ scale: pressed ? 0.92 : 1 }] },
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View all library reading books"
          >
            <ArrowRight size={16} color="#18181B" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Content Row: Circular Thumbnail + Info + Dashed Progress Circle */}
        <Pressable
          onPress={handleCardPress}
          style={({ pressed }) => [
            styles.contentCard,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Continue reading ${book.title}`}
        >
          {/* Circular Thumbnail Cover with Black Outline */}
          <View style={styles.avatarCover}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          </View>

          {/* Book Info */}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              By {book.author}
            </Text>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  color="#FBBF24"
                  fill={i < Math.round(book.rating) ? '#FBBF24' : 'transparent'}
                />
              ))}
            </View>
          </View>

          {/* Dashed Circular Progress Ring */}
          <View style={styles.progressCircleDashed}>
            <Text style={styles.progressText}>{progressPercent}%</Text>
          </View>
        </Pressable>
      </View>

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
  outerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  avatarCover: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
  bookAuthor: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 1,
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  progressCircleDashed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#FF6B4A', // Tangerine / Coral dashed ring
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
  },
  progressText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#FF6B4A',
  },
});
