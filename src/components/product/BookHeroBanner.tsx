import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { ArrowRight, Flame, Star } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Book } from '@/types/book';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { HERO_BOOK, BOOKS } from '@/data/books';

interface BookHeroBannerProps {
  book?: Book;
  books?: Book[];
}

const FEATURED_SLIDES: Book[] = [
  HERO_BOOK,
  BOOKS[0], // The Summer of Impossible Things
  BOOKS.find((b) => b.id === 'atomic-habits') || BOOKS[2],
];

export const BookHeroBanner: React.FC<BookHeroBannerProps> = ({ book, books }) => {
  const router = useRouter();
  const slides = books && books.length > 0 ? books : (book ? [book, ...FEATURED_SLIDES.filter(b => b.id !== book.id)] : FEATURED_SLIDES);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBook = slides[activeIndex] || HERO_BOOK;
  const secondaryBook = slides[(activeIndex + 1) % slides.length];

  const handleBannerPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    router.push({
      pathname: '/book/[id]',
      params: { id: activeBook.id },
    });
  };

  const handleSlideChange = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    setActiveIndex(index);
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleBannerPress}
        style={({ pressed }) => [
          styles.bannerCard,
          { opacity: pressed ? 0.95 : 1, transform: [{ scale: pressed ? 0.995 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Featured book: ${activeBook.title} by ${activeBook.author}`}
      >
        {/* Ambient Subtle Warm Highlight */}
        <View style={styles.ambientGlow} />

        {/* Left Column: Details & CTA */}
        <View style={styles.leftColumn}>
          {/* Editorial Tag */}
          <View style={styles.badgeRow}>
            <View style={styles.popularBadge}>
              <Flame size={11} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.popularText}>EDITOR'S CHOICE</Text>
            </View>
          </View>

          {/* Book Title */}
          <Text style={styles.title} numberOfLines={2}>
            {activeBook.title}
          </Text>

          {/* Author & Year */}
          <Text style={styles.author} numberOfLines={1}>
            {activeBook.author} {activeBook.originalYear ? `(${activeBook.originalYear})` : ''}
          </Text>

          {/* Meta: Rating, Price, Discount */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Star size={11} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>{activeBook.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.priceText}>${activeBook.price.toFixed(2)}</Text>
            {activeBook.discountPercent ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{activeBook.discountPercent}%</Text>
              </View>
            ) : null}
          </View>

          {/* Read More Pill CTA */}
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Explore Book</Text>
            <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        {/* Right Column: Fanned 3D Physical Book Covers */}
        <View style={styles.rightColumn}>
          {/* Peeking Background Book (Tilted) */}
          <View style={styles.backCoverFrame}>
            <Image
              source={{ uri: secondaryBook.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
            />
            <View style={styles.backSpineShadow} />
          </View>

          {/* Foreground Primary 3D Book */}
          <View style={styles.frontCoverFrame}>
            <Image
              source={{ uri: activeBook.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />
            {/* Hardcover spine crease & sheen */}
            <View style={styles.spineCrease} />
            <View style={styles.spineHighlight} />
            <View style={styles.topSheen} />
          </View>
        </View>
      </Pressable>

      {/* Carousel Indicator Dots */}
      <View style={styles.dotsContainer}>
        {slides.slice(0, 4).map((_, dotIndex) => {
          const isActive = activeIndex === dotIndex;
          return (
            <Pressable
              key={dotIndex}
              onPress={() => handleSlideChange(dotIndex)}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Slide ${dotIndex + 1}`}
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
    marginTop: 4,
    marginBottom: 14,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl, // 20px
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  ambientGlow: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  leftColumn: {
    flex: 1.2,
    justifyContent: 'center',
    paddingRight: 12,
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 19,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  metaDot: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  priceText: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.full,
  },
  discountText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.bold,
    color: '#15803D',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7.5,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  rightColumn: {
    flex: 0.8,
    height: 146,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  backCoverFrame: {
    position: 'absolute',
    right: 4,
    top: 8,
    width: 86,
    height: 122,
    borderRadius: 7,
    overflow: 'hidden',
    opacity: 0.88,
    transform: [{ rotate: '8deg' }],
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  backSpineShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  frontCoverFrame: {
    position: 'absolute',
    right: 26,
    top: 2,
    width: 94,
    height: 134,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-3deg' }],
    ...Shadows.heroCover,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  spineCrease: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  spineHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 8,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  topSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 4.5,
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
