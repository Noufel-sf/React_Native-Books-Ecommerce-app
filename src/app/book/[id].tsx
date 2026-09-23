import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  MoreHorizontal,
  Minus,
  Plus,
  Star,
  Check,
  BookOpen,
  UserCheck,
  MessageSquarePlus,
  ArrowRight,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BOOKS, AUTHORITY_BOOK } from '@/data/books';
import { BookFormat } from '@/types/book';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { BookReaderModal } from '@/components/product/BookReaderModal';
import { WriteReviewModal } from '@/components/product/WriteReviewModal';
import { BookCard } from '@/components/product/BookCard';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const book =
    BOOKS.find((b) => b.id === id) ??
    AUTHORITY_BOOK;

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.showToast);

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    book.availableFormats?.[0] ?? 'Paperback'
  );
  const [quantity, setQuantity] = useState(2);
  const [isAdded, setIsAdded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [readerModalVisible, setReaderModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Format pricing
  const getFormatPrice = (format: BookFormat) => {
    switch (format) {
      case 'Hardcover':
        return +(book.price + 5.0).toFixed(2);
      case 'Paperback':
        return +(book.price).toFixed(2);
      case 'E-Book':
        return +(Math.max(9.99, book.price - 8.0)).toFixed(2);
      case 'Audiobook':
        return +(book.price + 4.0).toFixed(2);
      default:
        return book.price;
    }
  };

  const currentPrice = getFormatPrice(selectedFormat);

  // Recommended related books
  const relatedBooks = useMemo(() => {
    return BOOKS.filter((b) => b.id !== book.id);
  }, [book.id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleIncrement = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
      }
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success).catch?.(() => {});
    }
    addItem({ ...book, price: currentPrice }, selectedFormat, quantity);
    setIsAdded(true);
    showToast({
      title: 'Added to your bag! ✓',
      message: `${quantity}x ${book.title} (${selectedFormat}) • $${(currentPrice * quantity).toFixed(2)}`,
      actionLabel: 'VIEW CART',
      onAction: () => router.push('/(tabs)/cart' as any),
    });
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen 2: Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        {/* Cyan Circular Back Button */}
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backCircle,
            { transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={18} color="#18181B" strokeWidth={2.4} />
        </Pressable>

        {/* Center Title */}
        <Text style={styles.headerTitle}>Detail Book</Text>

        {/* Right More Options */}
        <Pressable
          onPress={() => {
            Haptics.selectionAsync?.().catch?.(() => {});
          }}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel="Options"
        >
          <MoreHorizontal size={22} color="#18181B" strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen 2: Book Showcase */}
        <View style={styles.showcaseSection}>
          <View style={styles.coverFrame}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>

        {/* Screen 2: Overlapping White Card with 2px Black Outline */}
        <View style={styles.detailsCard}>
          {/* Pinned Circular Red Bookmark Stamp */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
              }
              toggleFavorite(book.id);
            }}
            style={({ pressed }) => [
              styles.bookmarkStamp,
              { transform: [{ scale: pressed ? 0.92 : 1 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Bookmark book"
          >
            <Bookmark
              size={18}
              color="#FFFFFF"
              fill={favorite ? '#FFFFFF' : 'none'}
              strokeWidth={2.4}
            />
          </Pressable>

          {/* Red Price */}
          <Text style={styles.priceText}>${currentPrice.toFixed(2)}</Text>

          {/* Book Title */}
          <Text style={styles.titleText}>{book.title}</Text>

          {/* Author */}
          <Text style={styles.authorText}>{book.author}</Text>

          {/* 3-Column Stats Capsule */}
          <View style={styles.statsCapsule}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>{book.rating.toFixed(1)}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Number of pages</Text>
              <Text style={styles.statValue}>{book.pages ?? 120} Page</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Language</Text>
              <Text style={styles.statValue}>{book.language ?? 'ENG'}</Text>
            </View>
          </View>

          {/* Format Selector Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Select Format</Text>
            <View style={styles.formatRow}>
              {(book.availableFormats ?? ['Paperback', 'Hardcover', 'E-Book']).map((fmt) => {
                const isSelected = selectedFormat === fmt;
                const price = getFormatPrice(fmt);
                return (
                  <Pressable
                    key={fmt}
                    onPress={() => setSelectedFormat(fmt)}
                    style={[
                      styles.formatChip,
                      isSelected ? styles.formatChipActive : styles.formatChipInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.formatName,
                        isSelected && styles.formatNameActive,
                      ]}
                    >
                      {fmt}
                    </Text>
                    <Text
                      style={[
                        styles.formatPrice,
                        isSelected && styles.formatPriceActive,
                      ]}
                    >
                      ${price.toFixed(2)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Read Free Sample Action Button */}
          <Pressable
            onPress={() => setReaderModalVisible(true)}
            style={({ pressed }) => [
              styles.sampleBtn,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Read free sample"
          >
            <BookOpen size={16} color="#18181B" strokeWidth={2.4} />
            <Text style={styles.sampleBtnText}>Read Free Sample Chapter</Text>
          </Pressable>

          {/* Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>About This Book</Text>
            <Text style={styles.descriptionText}>
              {book.description ??
                'Gallery West Residence is an apartment that is part of the AKR Gallery West mixed-use complex that is integrated with office, gallery, and modern art museums.'}
            </Text>
          </View>

          {/* About the Author Section */}
          <View style={styles.authorCard}>
            <View style={styles.authorHeaderRow}>
              <View style={styles.authorAvatarBox}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                  }}
                  style={styles.authorAvatar}
                />
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorNameText}>{book.author}</Text>
                <Text style={styles.authorRoleText}>Bestselling Author</Text>
              </View>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.selectionAsync?.().catch?.(() => {});
                  }
                  setIsFollowing(!isFollowing);
                }}
                style={[
                  styles.followBtn,
                  isFollowing && styles.followBtnActive,
                ]}
              >
                <Text style={styles.followBtnText}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.authorBioText}>
              Renowned author celebrated for innovative storytelling, vivid world-building, and thought-provoking narrative exploration.
            </Text>
          </View>

          {/* Community Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeaderRow}>
              <View>
                <Text style={styles.sectionLabel}>Customer Reviews</Text>
                <View style={styles.starsSummaryRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      color="#FBBF24"
                      fill={i < Math.round(book.rating) ? '#FBBF24' : 'transparent'}
                    />
                  ))}
                  <Text style={styles.ratingSummaryText}>
                    {book.rating.toFixed(1)} of 5 ({book.reviewsCount.toLocaleString()} reviews)
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setReviewModalVisible(true)}
                style={styles.writeReviewBtn}
                accessibilityRole="button"
                accessibilityLabel="Write review"
              >
                <MessageSquarePlus size={14} color="#18181B" strokeWidth={2.4} />
                <Text style={styles.writeReviewText}>Write</Text>
              </Pressable>
            </View>

            {/* Review Cards */}
            <View style={styles.reviewSnippetCard}>
              <View style={styles.reviewerRow}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                  style={styles.reviewerAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewerName}>Alexander Scott</Text>
                  <Text style={styles.reviewDate}>Verified Reader • 2 days ago</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} color="#FBBF24" fill="#FBBF24" />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>
                "An unforgettable masterpiece. The depth of the characters and the prose pacing kept me hooked until the final page."
              </Text>
            </View>
          </View>

          {/* You May Also Like Shelf */}
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeaderRow}>
              <Text style={styles.sectionLabel}>You May Also Like</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/explore')}
                style={styles.relatedArrow}
              >
                <ArrowRight size={15} color="#18181B" strokeWidth={2.4} />
              </Pressable>
            </View>

            <FlatList
              horizontal
              data={relatedBooks}
              keyExtractor={(item) => `detail-rel-${item.id}`}
              renderItem={({ item }) => <BookCard book={item} width={134} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            />
          </View>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>

      {/* Screen 2: Electric Sky Blue Bottom Docked Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.bottomBarContent}>
          {/* Left: QTY Stepper Pill */}
          <View style={styles.qtyStepper}>
            <Text style={styles.qtyLabel}>QTY</Text>
            <View style={styles.qtyDivider} />
            <Pressable
              onPress={handleDecrement}
              style={styles.qtyBtn}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <Minus size={13} color="#18181B" strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              onPress={handleIncrement}
              style={styles.qtyBtn}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <Plus size={13} color="#18181B" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Right: Cyber Yellow Add to Cart Button */}
          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.addToCartBtn,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            {isAdded ? (
              <Check size={16} color="#18181B" strokeWidth={2.5} />
            ) : null}
            <Text style={styles.addToCartText}>
              {isAdded ? 'Added' : 'Add to Cart'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Reader Modal */}
      <BookReaderModal
        visible={readerModalVisible}
        onClose={() => setReaderModalVisible(false)}
        bookId={book.id}
        title={book.title}
        author={book.author}
        coverImage={book.coverImage}
        onBuyPress={handleAddToCart}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        bookId={book.id}
        bookTitle={book.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#38BDF8', // Cyan Blue from mockup
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  showcaseSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  coverFrame: {
    width: 160,
    height: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    ...Shadows.popSm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 2,
    borderColor: '#18181B',
    paddingHorizontal: 20,
    paddingTop: 24,
    position: 'relative',
    marginTop: 10,
  },
  bookmarkStamp: {
    position: 'absolute',
    top: -22,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444', // Red circular bookmark stamp
    borderWidth: 2,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  priceText: {
    fontSize: 22,
    fontFamily: Typography.sans.bold,
    color: '#EF4444', // Red price text from mockup
    textAlign: 'center',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  authorText: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },
  statsCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1.8,
    borderColor: '#18181B',
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  statDivider: {
    width: 1.5,
    height: 24,
    backgroundColor: '#18181B',
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  formatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formatChip: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#18181B',
    alignItems: 'center',
  },
  formatChipActive: {
    backgroundColor: '#FFD027', // Cyber Yellow
  },
  formatChipInactive: {
    backgroundColor: '#FFFFFF',
  },
  formatName: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  formatNameActive: {
    color: '#18181B',
  },
  formatPrice: {
    fontSize: 10.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  formatPriceActive: {
    color: '#18181B',
    fontFamily: Typography.sans.bold,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 10,
    marginBottom: 20,
  },
  sampleBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#374151',
    lineHeight: 20,
  },
  authorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 14,
    marginBottom: 20,
  },
  authorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  authorAvatar: {
    width: '100%',
    height: '100%',
  },
  authorInfo: {
    flex: 1,
  },
  authorNameText: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  authorRoleText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  followBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  followBtnActive: {
    backgroundColor: '#E5E7EB',
  },
  followBtnText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  authorBioText: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#4B5563',
    lineHeight: 18,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  starsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingSummaryText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginLeft: 4,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  writeReviewText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  reviewSnippetCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 12,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#18181B',
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  reviewDate: {
    fontSize: 10,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#374151',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  relatedSection: {
    marginTop: 10,
  },
  relatedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  relatedArrow: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedList: {
    paddingRight: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#38BDF8', // Electric Sky Blue from mockup
    borderTopWidth: 2,
    borderTopColor: '#18181B',
    paddingTop: 12,
    zIndex: 99,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    gap: 12,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 12,
    height: 44,
  },
  qtyLabel: {
    fontSize: 10.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginRight: 6,
  },
  qtyDivider: {
    width: 1.5,
    height: 16,
    backgroundColor: '#18181B',
    marginRight: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    paddingHorizontal: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD027', // Cyber Sunshine Yellow from mockup
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    height: 44,
    gap: 6,
  },
  addToCartText: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
});
