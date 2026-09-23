import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { NeoPopSearchBar } from '@/components/ui/NeoPopSearchBar';
import { CategorySelector } from '@/components/ui/CategorySelector';
import { TrendingBooksCard } from '@/components/product/TrendingBooksCard';
import { SpotlightEbookCard } from '@/components/product/SpotlightEbookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BookCard } from '@/components/product/BookCard';
import { BOOKS, AUTHORITY_BOOK } from '@/data/books';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/explore',
        params: { q: searchQuery.trim() },
      });
    }
  };

  // Trending books matching reference mockup (Screen 1)
  const trendingBooks = BOOKS.slice(0, 5);

  // Spotlight book matching reference mockup (Screen 3)
  const spotlightBook =
    BOOKS.find((b) => b.id === 'muscle-trovelutions') ??
    BOOKS[3];

  // More Recommended books
  const filteredRecommended = useMemo(() => {
    if (selectedCategory === 'all') {
      return BOOKS.filter((b) => b.id !== spotlightBook.id);
    }
    return BOOKS.filter((b) =>
      b.genres.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [selectedCategory, spotlightBook]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B4A"
            colors={['#FF6B4A']}
          />
        }
      >
        {/* Screen 1: Top Navigation Header (Tangerine launcher & profile) */}
        <HomeHeader />

        {/* Screen 1: Search Bar with Cyber Yellow 3D Offset Slab */}
        <NeoPopSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearchSubmit}
        />

        {/* Neo-Pop Category Filter Pills */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Screen 1: Trending Book Electric Sky-Blue Curved Container */}
        <TrendingBooksCard books={trendingBooks} />

        {/* Screen 3 Spotlight: Top E-Book Reading Card */}
        <SpotlightEbookCard book={spotlightBook} />

        {/* Screen 1: Continue Reading Card with Dashed Progress Ring */}
        <ContinueReadingCard book={AUTHORITY_BOOK} />

        {/* Additional Section: More Recommended Shelf */}
        <SectionHeader
          title="More Recomended"
          actionText="View all"
          onActionPress={() => router.push('/(tabs)/explore')}
        />

        <View style={styles.recommendedListWrapper}>
          <FlatList
            horizontal
            data={filteredRecommended}
            keyExtractor={(item) => `home-rec-${item.id}`}
            renderItem={({ item }) => <BookCard book={item} width={138} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedListContent}
          />
        </View>

        {/* Bottom padding for floating dock */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  recommendedListWrapper: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    marginBottom: 16,
  },
  recommendedListContent: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 6,
  },
  bottomSpacer: {
    height: 90,
  },
});
