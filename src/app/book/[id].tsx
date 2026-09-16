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
  Platform,
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
  Edit3,
  ShoppingBag,
  BookOpen,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BOOKS } from '@/data/books';
import { BookFormat } from '@/types/book';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Colors, Shadows, Typography, BorderRadius } from '@/constants/theme';
import { BookCard } from '@/components/product/BookCard';
import { ZoomableBookCover } from '@/components/gestures/ZoomableBookCover';
import { WriteReviewModal } from '@/components/product/WriteReviewModal';
import { ReviewsFeed } from '@/components/product/ReviewsFeed';
import { BookReaderModal } from '@/components/product/BookReaderModal';

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
  const showToast = useToastStore((s) => s.showToast);

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    book.availableFormats?.[0] ?? 'E-Book'
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [readerModalVisible, setReaderModalVisible] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const getFormatPrice = (format: BookFormat) => {
    switch (format) {
      case 'Hardcover':
        return +(book.price + 5.0).toFixed(2);
      case 'Paperback':
        return +(book.price).toFixed(2);
      case 'E-Book':
        return +(Math.max(9.99, book.price - 4.0)).toFixed(2);
      case 'Audiobook':
        return +(book.price + 2.0).toFixed(2);
      default:
        return book.price;
    }
  };

  const currentPrice = getFormatPrice(selectedFormat);

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
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    addItem({ ...book, price: currentPrice }, selectedFormat);
    setIsAdded(true);
    showToast({
      title: 'Added to your bag! ✓',
      message: `${book.title} (${selectedFormat}) • $${currentPrice.toFixed(2)}`,
      actionLabel: 'VIEW BAG',
      onAction: () => router.push('/(tabs)/cart' as any),
    });
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const breakdown = book.ratingBreakdown ?? {
    5: 82,
    4: 68,
    3: 20,
    2: 12,
    1: 4,
  };

  const genreColors = ['#FEF3C7', '#F3E8FF', '#ECFDF5', '#EFF6FF'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
        onScroll={(e) => {
          const scrollY = e.nativeEvent.contentOffset.y;
          setShowStickyBar(scrollY > 280);
        }}
        scrollEventThrottle={16}
      >
        {/* Book Header Summary: Interactive Zoomable Cover on Left, Info on Right */}
        <View style={styles.heroSection}>
          <ZoomableBookCover uri={book.coverImage} width={148} height={220} />

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
              <Star size={13} color="#D97706" fill="#FBBF24" />
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

        {/* Dynamic Format Selector */}
        <View style={styles.formatSection}>
          <Text style={styles.formatSectionLabel}>SELECT FORMAT</Text>
          <View style={styles.formatChipsRow}>
            {(book.availableFormats ?? ['Hardcover', 'Paperback', 'E-Book', 'Audiobook']).map((fmt) => {
              const isSelected = selectedFormat === fmt;
              const fmtPrice = getFormatPrice(fmt);
              return (
                <Pressable
                  key={fmt}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    }
                    setSelectedFormat(fmt);
                  }}
                  style={({ pressed }) => [
                    styles.formatChip,
                    isSelected && styles.formatChipActive,
                    {
                      transform: [
                        { translateX: pressed ? 1.5 : 0 },
                        { translateY: pressed ? 1.5 : 0 },
                      ],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.formatChipTitle,
                      isSelected && styles.formatChipTitleActive,
                    ]}
                  >
                    {fmt}
                  </Text>
                  <Text
                    style={[
                      styles.formatChipPrice,
                      isSelected && styles.formatChipPriceActive,
                    ]}
                  >
                    ${fmtPrice.toFixed(2)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dual Neobrutal Action Buttons: Read Sample & Buy */}
        <View style={styles.actionButtonsContainer}>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }
              setReaderModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.readSampleButton,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Read sample preview"
          >
            <BookOpen size={18} color="#000000" strokeWidth={2.5} />
            <Text style={styles.readSampleButtonText}>SAMPLE</Text>
          </Pressable>

          <Pressable
            onPress={handleBuy}
            style={({ pressed }) => [
              styles.buyButton,
              isAdded && styles.buyButtonSuccess,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Buy ${selectedFormat} for USD $${currentPrice.toFixed(2)}`}
          >
            {isAdded ? (
              <View style={styles.buttonInner}>
                <Check size={20} color="#000000" strokeWidth={3} />
                <Text style={styles.buyButtonText}>ADDED TO BAG ✓</Text>
              </View>
            ) : (
              <Text style={styles.buyButtonText}>
                BUY {selectedFormat.toUpperCase()} • ${currentPrice.toFixed(2)}
              </Text>
            )}
          </Pressable>
        </View>

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
            onPress={() => setReviewModalVisible(true)}
            style={({ pressed }) => [
              styles.writeReviewBtn,
              {
                transform: [
                  { translateX: pressed ? 1 : 0 },
                  { translateY: pressed ? 1 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Write a review"
          >
            <Edit3 size={13} color="#000000" strokeWidth={2.5} />
            <Text style={styles.writeReviewBtnText}>WRITE REVIEW</Text>
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
                  size={14}
                  color="#FBBF24"
                  fill="#FBBF24"
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

        {/* Community Reviews Feed */}
        <ReviewsFeed
          bookId={book.id}
          onWriteReviewPress={() => setReviewModalVisible(true)}
        />

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

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Sticky Bottom Purchase Bar */}
      {showStickyBar && (
        <View style={styles.stickyBar}>
          <View style={styles.stickyMeta}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.stickyThumbnail}
              contentFit="cover"
            />
            <View style={styles.stickyDetails}>
              <Text style={styles.stickyTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.stickyFormat}>
                {selectedFormat} • <Text style={styles.stickyPrice}>${currentPrice.toFixed(2)}</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleBuy}
            style={({ pressed }) => [
              styles.stickyBuyBtn,
              isAdded && styles.stickyBuyBtnSuccess,
              {
                transform: [
                  { translateX: pressed ? 1.5 : 0 },
                  { translateY: pressed ? 1.5 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Add to bag"
          >
            {isAdded ? (
              <Check size={16} color="#000000" strokeWidth={3} />
            ) : (
              <ShoppingBag size={15} color="#000000" strokeWidth={2.5} />
            )}
            <Text style={styles.stickyBuyBtnText}>
              {isAdded ? 'ADDED' : 'ADD TO BAG'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Write Community Review Modal */}
      <WriteReviewModal
        visible={reviewModalVisible}
        bookId={book.id}
        bookTitle={book.title}
        onClose={() => setReviewModalVisible(false)}
      />

      {/* In-App E-Reader / Sample Reader Modal */}
      <BookReaderModal
        visible={readerModalVisible}
        bookId={book.id}
        title={book.title}
        author={book.author}
        coverImage={book.coverImage}
        onClose={() => setReaderModalVisible(false)}
        onBuyPress={handleBuy}
      />
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
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookmarkBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkBadgeActive: {
    backgroundColor: '#FEF3C7',
  },
  sendIcon: {
    transform: [{ rotate: '-15deg' }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
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
    borderRadius: BorderRadius.lg,
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
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 13.5,
    fontFamily: Typography.sans.semiBold,
    color: Colors.primary,
    marginTop: 4,
  },
  releaseDate: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
    marginTop: 3,
    marginBottom: 10,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genrePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
  },
  genreText: {
    fontSize: 10,
    fontFamily: Typography.sans.semiBold,
    color: '#4B5563',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricValue: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  metricLabel: {
    fontSize: 9.5,
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  readSampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    height: 50,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  readSampleButtonText: {
    color: Colors.text.primary,
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
  },
  buyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.button,
  },
  buyButtonSuccess: {
    backgroundColor: '#10B981',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeReviewBtn: {
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  writeReviewBtnText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  contentBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 22,
  },
  description: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    lineHeight: 20,
    color: '#4B5563',
  },
  ratingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    ...Shadows.card,
  },
  ratingsLeft: {
    alignItems: 'center',
    paddingRight: 18,
  },
  scoreLarge: {
    fontSize: 38,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    lineHeight: 42,
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
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
    marginTop: 4,
  },
  ratingsRight: {
    flex: 1,
    gap: 5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIndexText: {
    fontSize: 11,
    fontFamily: Typography.sans.semiBold,
    color: '#6B7280',
    width: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
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
  formatSection: {
    marginBottom: 16,
    gap: 8,
  },
  formatSectionLabel: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  formatChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formatChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
    gap: 2,
  },
  formatChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: Colors.primary,
  },
  formatChipTitle: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  formatChipTitleActive: {
    color: Colors.primary,
    fontFamily: Typography.sans.bold,
  },
  formatChipPrice: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  formatChipPriceActive: {
    color: Colors.primary,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99,
  },
  stickyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  stickyThumbnail: {
    width: 36,
    height: 48,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  stickyDetails: {
    marginLeft: 10,
    flex: 1,
  },
  stickyTitle: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  stickyFormat: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
    marginTop: 2,
  },
  stickyPrice: {
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  stickyBuyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.button,
  },
  stickyBuyBtnSuccess: {
    backgroundColor: '#10B981',
  },
  stickyBuyBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
