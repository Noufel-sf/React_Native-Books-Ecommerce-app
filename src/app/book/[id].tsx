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
  Bookmark,
  Heart,
  Star,
  ShoppingBag,
  Check,
} from 'lucide-react-native';
import { BOOKS } from '@/data/books';
import { BookCover3D } from '@/components/product/BookCover3D';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCartStore } from '@/store/cartStore';
import { BookFormat } from '@/types/book';

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
        {/* Big 3D Book Cover Centerpiece (matching the reference detail screen) */}
        <View style={styles.coverSection}>
          <BookCover3D
            imageUrl={book.coverImage}
            width={160}
            height={230}
            variant="hero"
          />
        </View>

        {/* Title & Author */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          {book.subtitle && <Text style={styles.subtitle}>{book.subtitle}</Text>}
        </View>

        {/* Stats Grid (Rating, Pages, Language, Audio) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statValueRow}>
              <Star size={14} color="#D48C2B" fill="#D48C2B" />
              <Text style={styles.statValue}>{book.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.pages}</Text>
            <Text style={styles.statLabel}>Pages</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.language.slice(0, 3)}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.audioLength ?? 'N/A'}</Text>
            <Text style={styles.statLabel}>Audio</Text>
          </View>
        </View>

        {/* Available Formats Selector */}
        <View style={styles.formatSection}>
          <Text style={styles.sectionTitle}>Choose Format</Text>
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

        {/* Publisher & Edition Card (from reference design) */}
        <View style={styles.editorialCard}>
          <Text style={styles.borzoiHeading}>EDITORIAL EDITION</Text>
          <Text style={styles.publisherName}>PUBLISHED BY {book.publisher.toUpperCase()}</Text>
          <View style={styles.cardDivider} />
          <Text style={styles.descriptionText}>{book.description}</Text>
          <View style={styles.isbnRow}>
            <Text style={styles.isbnText}>ISBN: {book.isbn}</Text>
            <Text style={styles.yearText}>Est. {book.originalYear ?? 2020}</Text>
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
  coverSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1816',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 14,
    color: '#7C7368',
    marginTop: 4,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#9E9488',
    marginTop: 4,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1816',
  },
  statLabel: {
    fontSize: 11,
    color: '#8C8276',
    marginTop: 3,
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
    fontSize: 15,
    fontWeight: '700',
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
    fontWeight: '600',
    color: '#6B6258',
  },
  formatPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  editorialCard: {
    backgroundColor: '#FAF7F0',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8DEC9',
    alignItems: 'center',
    marginBottom: 20,
  },
  borzoiHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#8C7A65',
    marginBottom: 4,
  },
  publisherName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A231C',
    letterSpacing: 0.8,
  },
  cardDivider: {
    width: 60,
    height: 1,
    backgroundColor: '#D9CEBD',
    marginVertical: 14,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#463F38',
    textAlign: 'center',
  },
  isbnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EBE2D3',
  },
  isbnText: {
    fontSize: 11,
    color: '#8C8276',
    fontFamily: 'monospace',
  },
  yearText: {
    fontSize: 11,
    color: '#8C8276',
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
    color: '#8C8276',
  },
  priceValue: {
    fontSize: 19,
    fontWeight: '800',
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
    fontWeight: '700',
  },
});
