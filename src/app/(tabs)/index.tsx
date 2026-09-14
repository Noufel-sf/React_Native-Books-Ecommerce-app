import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'popular',
  });

  // Filter books based on search input, selected genre, and filter modal options
  const filteredFeaturedBooks = useMemo(() => {
    let result = BOOKS.filter((book) => {
      // Don't repeat the hero book in the main trending section unless filtered specifically
      if (book.id === HERO_BOOK.id && selectedCategory === 'all' && !searchQuery) {
        return false;
      }

      // Filter by genre
      const matchesCategory =
        selectedCategory === 'all' ||
        book.genres.some(
          (g) => g.toLowerCase() === selectedCategory.toLowerCase()
        );

      // Filter by search
      const matchesSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by format
      const matchesFormat =
        !filters.format ||
        filters.format === 'All' ||
        book.availableFormats.includes(filters.format);

      // Filter by min rating
      const matchesRating =
        !filters.minRating || book.rating >= filters.minRating;

      return matchesCategory && matchesSearch && matchesFormat && matchesRating;
    });

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

        {/* Hero Promotional Banner (Think and Grow Rich) */}
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
            renderItem={({ item }) => <BookCard book={item} />}
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

        {/* Continue Reading Section (from reference design) */}
        <SectionHeader
          title="Continue Reading"
          actionText="View all"
          onActionPress={() => {}}
        />

        {CONTINUE_READING_BOOKS.map((book) => (
          <ContinueReadingCard key={book.id} book={book} />
        ))}

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
    paddingRight: 6,
    paddingVertical: 14,
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
