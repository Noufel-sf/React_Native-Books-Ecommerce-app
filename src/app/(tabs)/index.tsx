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
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter books based on search input and selected genre
  const filteredFeaturedBooks = useMemo(() => {
    return BOOKS.filter((book) => {
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

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

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
            onFilterPress={() => {}}
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
          title={selectedCategory === 'all' ? 'Featured Books' : `${selectedCategory.toUpperCase()} Books`}
          actionText="View all"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EE',
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
    paddingVertical: 10,
  },
  emptyContainer: {
    padding: 24,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    marginVertical: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1816',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8C8276',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 90,
  },
});
