import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight, Flame } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface BookHeroBannerProps {
  book: Book;
}

export const BookHeroBanner: React.FC<BookHeroBannerProps> = ({ book }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleBannerPress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleBannerPress}
        style={({ pressed }) => [
          styles.bannerCard,
          { opacity: pressed ? 0.95 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Read about ${book.title}`}
      >
        {/* Left Column: Details */}
        <View style={styles.leftColumn}>
          {/* Popular Tag */}
          <View style={styles.popularBadge}>
            <Flame size={12} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.popularText}>Popular</Text>
          </View>

          {/* Book Title */}
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>

          {/* Author & Year */}
          <Text style={styles.author} numberOfLines={1}>
            {book.author} {book.originalYear ? `(${book.originalYear})` : ''}
          </Text>

          {/* Read More Link */}
          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>Read More</Text>
            <ArrowRight size={14} color={Colors.primary} strokeWidth={2.2} />
          </View>
        </View>

        {/* Right Column: Fanned Book Covers */}
        <View style={styles.rightColumn}>
          {/* Peeking Background Cover */}
          <View style={styles.backCoverFrame}>
            <Image
              source={{ uri: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' }}
              style={styles.coverImage}
              contentFit="cover"
            />
          </View>

          {/* Foreground Primary Cover */}
          <View style={styles.frontCoverFrame}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>
      </Pressable>

      {/* Carousel Indicator Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((dotIndex) => {
          const isActive = activeSlide === dotIndex;
          return (
            <Pressable
              key={dotIndex}
              onPress={() => setActiveSlide(dotIndex)}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
              hitSlop={8}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  bannerCard: {
    backgroundColor: Colors.surfaceSubtle, // Warm cream #FBF7F0
    borderRadius: BorderRadius.xl, // 20px
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 165,
    overflow: 'hidden',
  },
  leftColumn: {
    flex: 1.15,
    justifyContent: 'center',
    paddingRight: 10,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  popularText: {
    fontSize: 12,
    fontFamily: Typography.sans.semiBold,
    color: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.4,
    lineHeight: 25,
    marginBottom: 6,
  },
  author: {
    fontSize: 12.5,
    fontFamily: Typography.sans.medium,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  rightColumn: {
    flex: 0.85,
    height: 130,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCoverFrame: {
    position: 'absolute',
    right: 2,
    top: 6,
    width: 78,
    height: 112,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    opacity: 0.8,
    transform: [{ rotate: '7deg' }],
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  frontCoverFrame: {
    position: 'absolute',
    right: 22,
    top: 2,
    width: 86,
    height: 122,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Shadows.heroCover,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#E5E7EB',
  },
});
