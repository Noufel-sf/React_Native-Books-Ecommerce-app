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
  ChevronLeft,
  Share2,
  Heart,
  Star,
  ShoppingBag,
  Check,
  Volume2,
  Play,
  Pause,
  ChevronRight,
  BookOpen,
  Bookmark,
} from 'lucide-react-native';
import { BOOKS } from '@/data/books';
import { BookCover3D } from '@/components/product/BookCover3D';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { BookFormat } from '@/types/book';
import { Typography } from '@/constants/theme';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const book = BOOKS.find((b) => b.id === id) ?? BOOKS[0];

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(book.id);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(
    book.availableFormats[0] ?? 'Hardcover'
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [page, setPage] = useState(2);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${book.title}" by ${book.author} on Lumina Books!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleAddToCart = () => {
    addItem(book, selectedFormat);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color="#1A1816" />
        </Pressable>

        <View style={styles.topRightActions}>
          <Pressable
            onPress={() => toggleFavorite(book.id)}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Save to wishlist"
          >
            <Heart
              size={20}
              color={favorite ? '#C94A3D' : '#1A1816'}
              fill={favorite ? '#C94A3D' : 'transparent'}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Share book"
          >
            <Share2 size={20} color="#1A1816" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Cover Section with Volume Slider (Matching Reference Image) */}
        <View style={styles.heroRow}>
          {/* Vertical Volume Slider on Left (from reference design) */}
          <View style={styles.volumeColumn}>
            <View style={styles.volumeTrack}>
              <View style={styles.volumeThumb} />
            </View>
            <Volume2 size={16} color="#A86C1D" style={{ marginTop: 8 }} />
          </View>

          {/* 3D Book Cover Centerpiece */}
          <View style={styles.coverCenter}>
            <BookCover3D
              imageUrl={book.coverImage}
              width={160}
              height={230}
              variant="hero"
            />
          </View>

          {/* Balance spacer on right */}
          <View style={{ width: 28 }} />
        </View>

        {/* Title & Author */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          {book.subtitle && <Text style={styles.subtitle}>{book.subtitle}</Text>}
        </View>

        {/* Stats Row (Rating, Number of Page, Language, Audio) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statValueRow}>
              <Star size={13} color="#D48C2B" fill="#D48C2B" />
              <Text style={styles.statValue}>{book.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.pages}</Text>
            <Text style={styles.statLabel}>Number Of Page</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.language.slice(0, 3)}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.audioLength ?? '2h30m'}</Text>
            <Text style={styles.statLabel}>Audio</Text>
          </View>
        </View>

        {/* Available Formats Selector */}
        <View style={styles.formatSection}>
          <Text style={styles.sectionTitle}>Select Format</Text>
          <View style={styles.formatPillsRow}>
            {book.availableFormats.map((format) => {
              const isSelected = selectedFormat === format;
              return (
                <Pressable
                  key={format}
                  onPress={() => setSelectedFormat(format)}
                  style={[
                    styles.formatPill,
                    isSelected && styles.formatPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.formatPillText,
                      isSelected && styles.formatPillTextSelected,
                    ]}
                  >
                    {format}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Editorial Borzoi Card (from reference design) */}
        <View style={styles.editorialCard}>
          <Text style={styles.borzoiHeading}>THIS IS A BORZOI BOOK</Text>
          <Text style={styles.publisherName}>PUBLISHED BY {book.publisher.toUpperCase()}</Text>
          <View style={styles.cardDivider} />
          <Text style={styles.copyrightText}>© {book.originalYear ?? 1992} by {book.author}</Text>
          <Text style={styles.descriptionText}>{book.description}</Text>
          <View style={styles.isbnRow}>
            <Text style={styles.isbnText}>eISBN: {book.isbn}</Text>
          </View>
        </View>

        {/* Audio Player & Reader Controller (from reference design) */}
        <View style={styles.audioPlayerCard}>
          <View style={styles.audioProgressRow}>
            <Pressable
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.playPauseBtn}
            >
              {isPlaying ? (
                <Pause size={16} color="#1A1816" />
              ) : (
                <Play size={16} color="#1A1816" fill="#1A1816" />
              )}
            </Pressable>
            <View style={styles.audioProgressBar}>
              <View style={[styles.audioProgressFill, { width: '38%' }]} />
              <View style={styles.audioKnob} />
            </View>
            <Text style={styles.audioTime}>-2h12m</Text>
          </View>

          {/* Reader Pagination & Chapter Controls */}
          <View style={styles.pageControlsRow}>
            <BookOpen size={18} color="#8C8276" />
            <View style={styles.pagePill}>
              <Pressable
                onPress={() => setPage(Math.max(1, page - 1))}
                hitSlop={8}
              >
                <ChevronLeft size={16} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.pageText}>
                {page} / {book.pages}
              </Text>
              <Pressable
                onPress={() => setPage(Math.min(book.pages, page + 1))}
                hitSlop={8}
              >
                <ChevronRight size={16} color="#FFFFFF" />
              </Pressable>
            </View>
            <Bookmark size={18} color="#8C8276" />
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Bottom Add-To-Cart Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${book.price.toFixed(2)}</Text>
        </View>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.addToCartBtn,
            isAdded && styles.addedBtn,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Add book to cart"
        >
          {isAdded ? (
            <>
              <Check size={18} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.addToCartText}>Added to Cart</Text>
            </>
          ) : (
            <>
              <ShoppingBag size={18} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add to Cart • ${book.price.toFixed(2)}</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE5D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 20,
  },
  volumeColumn: {
    alignItems: 'center',
    width: 28,
  },
  volumeTrack: {
    width: 4,
    height: 80,
    backgroundColor: '#EBE2D3',
    borderRadius: 2,
    position: 'relative',
    alignItems: 'center',
  },
  volumeThumb: {
    position: 'absolute',
    top: 32,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D48C2B',
  },
  coverCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    color: '#7C7368',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#9E9488',
    marginTop: 4,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ECE5D8',
    marginBottom: 20,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginTop: 3,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EFEAE0',
  },
  formatSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#1A1816',
    marginBottom: 10,
  },
  formatPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formatPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  formatPillSelected: {
    backgroundColor: '#1A1816',
    borderColor: '#1A1816',
  },
  formatPillText: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#6B6258',
  },
  formatPillTextSelected: {
    color: '#FFFFFF',
    fontFamily: Typography.sans.bold,
  },
  editorialCard: {
    backgroundColor: '#FAF7F0',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E8DEC9',
    alignItems: 'center',
    marginBottom: 20,
  },
  borzoiHeading: {
    fontSize: 12,
    fontFamily: Typography.serif.bold,
    letterSpacing: 1.5,
    color: '#705F4D',
    marginBottom: 4,
  },
  publisherName: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#2A231C',
    letterSpacing: 0.8,
  },
  cardDivider: {
    width: 60,
    height: 1,
    backgroundColor: '#D9CEBD',
    marginVertical: 12,
  },
  copyrightText: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: Typography.serif.semiBold,
    lineHeight: 20,
    color: '#463F38',
    textAlign: 'center',
  },
  isbnRow: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EBE2D3',
    width: '100%',
    alignItems: 'center',
  },
  isbnText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8C8276',
  },
  audioPlayerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE5D8',
    marginBottom: 20,
  },
  audioProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playPauseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#EBE2D3',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: '#D48C2B',
    borderRadius: 2,
  },
  audioKnob: {
    position: 'absolute',
    left: '37%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D48C2B',
  },
  audioTime: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8C8276',
  },
  pageControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
  },
  pagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1816',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 12,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Typography.sans.bold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECE5D8',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
  },
  priceValue: {
    fontSize: 19,
    fontFamily: Typography.sans.bold,
    color: '#B87826',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#D48C2B',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addedBtn: {
    backgroundColor: '#2E7D47',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Typography.sans.bold,
  },
});
