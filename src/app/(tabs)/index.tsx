import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { BookHeroBanner } from '@/components/product/BookHeroBanner';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BookCard } from '@/components/product/BookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import {
  HERO_BOOK,
  BOOKS,
  CONTINUE_READING_BOOKS,
} from '@/data/books';
import { Colors, Typography, Shadows } from '@/constants/theme';
import { FilterModal, FilterOptions } from '@/components/ui/FilterModal';
import {
  BookSkeletonCard,
  HeroSkeletonBanner,
  ContinueReadingSkeleton,
} from '@/components/ui/SkeletonLoader';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    format: 'All',
    sortBy: 'popular',
  });

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1100);
  }, []);

  // Filter books based on category, search query, format, and minRating
  const filteredFeaturedBooks = useMemo(() => {
    let result = BOOKS.filter((b) => b.id !== HERO_BOOK.id);

    // Filter by genre category
    if (selectedCategory !== 'all') {
      result = result.filter((b) =>
        b.genres.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Filter by Format (from FilterModal)
    if (filters.format && filters.format !== 'All') {
      result = result.filter((b) => b.availableFormats.includes(filters.format as any));
    }

    // Filter by Min Rating (from FilterModal)
    if (filters.minRating) {
      result = result.filter((b) => b.rating >= filters.minRating!);
    }

    // Apply sorting
    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, filters]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            colors={['#FFDE59', '#2EEC96', '#FF6B4A']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {/* User Brand Header */}
        <HomeHeader />

        {/* Search & Filter Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setIsFilterVisible(true)}
            placeholder="Search books, authors, genres..."
          />
        </View>

        {isRefreshing ? (
          /* Shimmering Skeleton Loader State on Pull-to-Refresh */
          <View style={{ marginTop: 4 }}>
            <HeroSkeletonBanner />
            <SectionHeader title="Refreshing Books..." onActionPress={() => {}} />
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginVertical: 14 }}>
              <BookSkeletonCard width={168} />
              <BookSkeletonCard width={168} />
            </View>
            <SectionHeader title="Ongoing Reads..." onActionPress={() => {}} />
            <ContinueReadingSkeleton />
          </View>
        ) : (
          <>
            {/* Hero Promotional Banner */}
            {!searchQuery && (
              <BookHeroBanner book={HERO_BOOK} />
            )}

            {/* Genre / Category Horizontal Selector */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Featured / Trending Section */}
            <SectionHeader
              title={selectedCategory === 'all' ? 'Most Popular' : `${selectedCategory.toUpperCase()} Books`}
              actionText="Show all"
              onActionPress={() => {}}
            />

            {/* Horizontal 3D Book List */}
            {filteredFeaturedBooks.length > 0 ? (
              <FlatList
                horizontal
                data={filteredFeaturedBooks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookCard book={item} width={172} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No books found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching for another title or selecting a different genre.
                </Text>
              </View>
            )}

            {/* Continue Reading Section */}
            <SectionHeader
              title="Continue Reading"
              actionText="View all"
              onActionPress={() => {}}
            />

            {CONTINUE_READING_BOOKS.map((book) => (
              <ContinueReadingCard key={book.id} book={book} />
            ))}
          </>
        )}

        {/* Extra bottom spacing so content scrolls past floating tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        currentFilters={filters}
        onApply={setFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  horizontalListContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 14,
    gap: 12,
  },
  emptyContainer: {
    padding: 24,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    marginVertical: 12,
    ...Shadows.card,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 90,
  },
});
