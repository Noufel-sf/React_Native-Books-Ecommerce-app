import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Share,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Send,
  Star,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { Shadows, Typography } from '@/constants/theme';
import { BookCard } from '@/components/product/BookCard';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const book =
    BOOKS.find((b) => b.id === id) ??
    BOOKS.find((b) => b.id === 'the-rational-male') ??
    BOOKS[0];

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);
  const addItem = useCartStore((s) => s.addItem);

  const [isAdded, setIsAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestedBooks = useMemo(() => {
    if (!book) return [];
    const related = BOOKS.filter(
      (b) => b.id !== book.id && b.genres.some((g) => book.genres.includes(g))
    );
    const others = BOOKS.filter(
      (b) => b.id !== book.id && !b.genres.some((g) => book.genres.includes(g))
    );
    return [...related, ...others];
  }, [book]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${book.title}" by ${book.author} on Lumina Books!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleBuy = () => {
    addItem(book, 'E-Book');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const breakdown = book.ratingBreakdown ?? {
    5: 85,
    4: 62,
    3: 18,
    2: 24,
    1: 6,
  };

  const genreColors = ['#FFDE59', '#C4A1FF', '#2EEC96', '#68B5FF'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              transform: [
                { translateX: pressed ? 2 : 0 },
                { translateY: pressed ? 2 : 0 },
              ],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#000000" strokeWidth={2.8} />
        </Pressable>

        <View style={styles.navRightActions}>
          <Pressable
            onPress={() => toggleFavorite(book.id)}
            style={({ pressed }) => [
              styles.bookmarkBadge,
              favorite && styles.bookmarkBadgeActive,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Bookmark book"
          >
            <Bookmark
              size={18}
              color="#000000"
              fill={favorite ? '#FF6B4A' : '#000000'}
              strokeWidth={2}
            />
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Share book"
          >
            <Send size={18} color="#000000" strokeWidth={2.5} style={styles.sendIcon} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Book Header Summary: Big Framed Cover on Left, Info on Right */}
        <View style={styles.heroSection}>
          <View style={styles.coverFrame}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.bookCover}
              contentFit="cover"
              transition={200}
            />
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.releaseDate}>
              Released on {book.releaseDate ?? `Dec. ${book.originalYear ?? 2015}`}
            </Text>

            {/* Neobrutalist Genre Sticker Pills */}
            <View style={styles.genresGrid}>
              {book.genres.slice(0, 4).map((genre, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.genrePill,
                    { backgroundColor: genreColors[idx % genreColors.length] },
                  ]}
                >
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Metrics Row (4 Boxed Stickers with Hard Shadows) */}
        <View style={styles.metricsContainer}>
          {/* Metric 1: Rating */}
          <View style={styles.metricCard}>
            <View style={styles.ratingValueRow}>
              <Text style={styles.metricValue}>{book.rating.toFixed(1)}</Text>
              <Star size={13} color="#000000" fill="#FFDE59" />
            </View>
            <Text style={styles.metricLabel}>
              {book.reviewsCount > 1000
                ? `${(book.reviewsCount / 1000).toFixed(1)}K`
                : book.reviewsCount}{' '}
              reviews
            </Text>
          </View>

          {/* Metric 2: Size */}
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{book.fileSize ?? '5.6 MB'}</Text>
            <Text style={styles.metricLabel}>size</Text>
          </View>

          {/* Metric 3: Pages */}
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{book.pages}</Text>
            <Text style={styles.metricLabel}>pages</Text>
          </View>

          {/* Metric 4: Purchases */}
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{book.purchasesCount ?? '50M+'}</Text>
            <Text style={styles.metricLabel}>purchases</Text>
          </View>
        </View>

        {/* Big Neobrutal Buy Action Button */}
        <Pressable
          onPress={handleBuy}
          style={({ pressed }) => [
            styles.buyButton,
            isAdded && styles.buyButtonSuccess,
            {
              transform: [
                { translateX: pressed ? 3 : 0 },
                { translateY: pressed ? 3 : 0 },
              ],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Buy for USD $${book.price.toFixed(2)}`}
        >
          {isAdded ? (
            <View style={styles.buttonInner}>
              <Check size={22} color="#000000" strokeWidth={3} />
              <Text style={styles.buyButtonText}>ADDED TO CART ✓</Text>
            </View>
          ) : (
            <Text style={styles.buyButtonText}>
              BUY USD ${book.price.toFixed(2)}
            </Text>
          )}
        </Pressable>

        {/* About this Ebook Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About this Ebook</Text>
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            hitSlop={8}
            style={styles.arrowButton}
          >
            <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.contentBox}>
          <Text
            style={styles.description}
            numberOfLines={isExpanded ? undefined : 4}
          >
            {book.description}
          </Text>
        </View>

        {/* Ratings & Reviews Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            style={styles.arrowButton}
          >
            <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Neobrutal Ratings Card */}
        <View style={styles.ratingsCard}>
          {/* Left: Overall Score and Stars */}
          <View style={styles.ratingsLeft}>
            <Text style={styles.scoreLarge}>{book.rating.toFixed(1)}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={15}
                  color="#000000"
                  fill="#FFDE59"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.reviewsCountText}>
              ({book.reviewsCount > 1000
                ? `${(book.reviewsCount / 1000).toFixed(1)}k`
                : book.reviewsCount}{' '}
              reviews)
            </Text>
          </View>

          {/* Right: 5-to-1 Star Progress Bars */}
          <View style={styles.ratingsRight}>
            {[5, 4, 3, 2, 1].map((ratingNum) => {
              const fillPercentage = (breakdown as any)[ratingNum] ?? 10;
              return (
                <View key={ratingNum} style={styles.progressRow}>
                  <Text style={styles.starIndexText}>{ratingNum}</Text>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${fillPercentage}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Suggested Books / Similar Reads Section */}
        {suggestedBooks.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/explore')}
                hitSlop={8}
                style={styles.arrowButton}
                accessibilityRole="button"
                accessibilityLabel="View all suggestions"
              >
                <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={suggestedBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BookCard book={item} width={168} />}
              showsHorizontalScrollIndicator={false}
              style={styles.suggestedListWrapper}
              contentContainerStyle={styles.suggestedListContent}
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookmarkBadge: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  bookmarkBadgeActive: {
    backgroundColor: '#FF6B4A',
  },
  sendIcon: {
    transform: [{ rotate: '-15deg' }],
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 22,
  },
  coverFrame: {
    width: 148,
    height: 220,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Shadows.card,
  },
  bookCover: {
    width: '100%',
    height: '100%',
  },
  heroInfo: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  author: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#FF6B4A',
    marginTop: 6,
  },
  releaseDate: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 4,
    marginBottom: 12,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genrePill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  genreText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    textTransform: 'uppercase',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    ...Shadows.sm,
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricValue: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#666666',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  buyButton: {
    backgroundColor: '#FFDE59',
    height: 54,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Shadows.card,
  },
  buyButtonSuccess: {
    backgroundColor: '#2EEC96',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.3,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 14,
    marginBottom: 22,
    ...Shadows.card,
  },
  description: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    lineHeight: 22,
    color: '#222222',
  },
  ratingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 16,
    ...Shadows.card,
  },
  ratingsLeft: {
    alignItems: 'center',
    paddingRight: 20,
  },
  scoreLarge: {
    fontSize: 42,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    lineHeight: 48,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  starIcon: {
    marginRight: 2,
  },
  reviewsCountText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#666666',
    marginTop: 6,
  },
  ratingsRight: {
    flex: 1,
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIndexText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    width: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: '#FAF5EE',
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFDE59',
  },
  suggestedListWrapper: {
    marginHorizontal: -20,
    marginBottom: 8,
  },
  suggestedListContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
});
