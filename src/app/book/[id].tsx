import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Share,
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
  ShoppingBag,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { Typography } from '@/constants/theme';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Find the selected book or default to Harry Potter
  const book = BOOKS.find((b) => b.id === id) ?? BOOKS.find((b) => b.id === 'harry-potter-deathly-hallows') ?? BOOKS[0];

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);
  const addItem = useCartStore((s) => s.addItem);

  const [isAdded, setIsAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${book.title}" by ${book.author} on Lumina Books!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleBuy = () => {
    addItem(book, 'E-Book');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Rating breakdown percentages (fallback if not defined)
  const breakdown = book.ratingBreakdown ?? {
    5: 85,
    4: 62,
    3: 18,
    2: 24,
    1: 6,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#1A1816" strokeWidth={2.2} />
        </Pressable>

        <View style={styles.navRightActions}>
          <Pressable
            onPress={() => toggleFavorite(book.id)}
            style={({ pressed }) => [
              styles.bookmarkBadge,
              favorite && styles.bookmarkBadgeActive,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Bookmark book"
          >
            <Bookmark
              size={17}
              color="#FFFFFF"
              fill="#FFFFFF"
            />
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Share book"
          >
            <Send size={20} color="#1A1816" strokeWidth={2} style={styles.sendIcon} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Book Header Summary: Cover on Left, Info on Right */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.bookCover}
            contentFit="cover"
            transition={200}
          />

          <View style={styles.heroInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.releaseDate}>
              Released on {book.releaseDate ?? `Dec. ${book.originalYear ?? 2015}`}
            </Text>

            {/* Genre Pills (2x2 wrap) */}
            <View style={styles.genresGrid}>
              {book.genres.slice(0, 4).map((genre, idx) => (
                <View key={idx} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Metrics Row (4 Columns divided by lines) */}
        <View style={styles.metricsRow}>
          {/* Metric 1: Rating */}
          <View style={styles.metricItem}>
            <View style={styles.ratingValueRow}>
              <Text style={styles.metricValue}>{book.rating.toFixed(1)}</Text>
              <Star size={13} color="#555555" fill="#555555" style={styles.starSmall} />
            </View>
            <Text style={styles.metricLabel}>{book.reviewsCount > 1000 ? `${(book.reviewsCount / 1000).toFixed(1)}K` : book.reviewsCount} reviews</Text>
          </View>

          <View style={styles.metricDivider} />

          {/* Metric 2: Size */}
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{book.fileSize ?? '5.6 MB'}</Text>
            <Text style={styles.metricLabel}>size</Text>
          </View>

          <View style={styles.metricDivider} />

          {/* Metric 3: Pages */}
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{book.pages}</Text>
            <Text style={styles.metricLabel}>pages</Text>
          </View>

          <View style={styles.metricDivider} />

          {/* Metric 4: Purchases */}
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{book.purchasesCount ?? '50M+'}</Text>
            <Text style={styles.metricLabel}>purchases</Text>
          </View>
        </View>

        {/* Buy Action Button */}
        <Pressable
          onPress={handleBuy}
          style={({ pressed }) => [
            styles.buyButton,
            isAdded && styles.buyButtonSuccess,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Buy for USD $${book.price.toFixed(2)}`}
        >
          {isAdded ? (
            <View style={styles.buttonInner}>
              <Check size={20} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.buyButtonText}>Added to Cart</Text>
            </View>
          ) : (
            <Text style={styles.buyButtonText}>
              Buy USD ${book.price.toFixed(2)}
            </Text>
          )}
        </Pressable>

        {/* About this Ebook Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About this Ebook</Text>
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <ArrowRight size={18} color="#EA8616" strokeWidth={2.2} />
          </Pressable>
        </View>

        <Text
          style={styles.description}
          numberOfLines={isExpanded ? undefined : 4}
        >
          {book.description}
        </Text>

        {/* Ratings & Reviews Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <ArrowRight size={18} color="#EA8616" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Ratings Breakdown Grid */}
        <View style={styles.ratingsCard}>
          {/* Left: Overall Score and Stars */}
          <View style={styles.ratingsLeft}>
            <Text style={styles.scoreLarge}>{book.rating.toFixed(1)}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={15}
                  color="#EA8616"
                  fill="#EA8616"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.reviewsCountText}>
              ({book.reviewsCount > 1000 ? `${(book.reviewsCount / 1000).toFixed(1)}k` : book.reviewsCount} reviews)
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    padding: 6,
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bookmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#EA8616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkBadgeActive: {
    backgroundColor: '#C94A3D',
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
    marginBottom: 24,
  },
  bookCover: {
    width: 146,
    height: 218,
    borderRadius: 16,
    backgroundColor: '#EBE5D8',
    shadowColor: '#1A1816',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  heroInfo: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  title: {
    fontSize: 21,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#EA8616',
    marginTop: 8,
  },
  releaseDate: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginTop: 4,
    marginBottom: 12,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genrePill: {
    backgroundColor: '#F4F2EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  genreText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6C6358',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3EFE6',
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starSmall: {
    marginTop: -2,
  },
  metricValue: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginTop: 3,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#EDE8DE',
  },
  buyButton: {
    backgroundColor: '#EA8616',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EA8616',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  buyButtonSuccess: {
    backgroundColor: '#2E7D47',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Typography.sans.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 24,
  },
  ratingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingsLeft: {
    alignItems: 'center',
    paddingRight: 24,
  },
  scoreLarge: {
    fontSize: 44,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
    lineHeight: 50,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    marginRight: 2,
  },
  reviewsCountText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8C8276',
    marginTop: 6,
  },
  ratingsRight: {
    flex: 1,
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  starIndexText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
    width: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#EBE7DE',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EA8616',
    borderRadius: 2,
  },
});
