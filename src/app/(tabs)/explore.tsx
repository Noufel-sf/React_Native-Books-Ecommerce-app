import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SearchBar } from '@/components/ui/SearchBar';
import { BookCard } from '@/components/product/BookCard';
import { BookSkeletonCard } from '@/components/ui/SkeletonLoader';
import { FilterModal, FilterOptions } from '@/components/ui/FilterModal';
import { BOOKS } from '@/data/books';
import { Colors, Typography, BorderRadius } from '@/constants/theme';
import { SearchX, RotateCcw } from 'lucide-react-native';

const FILTER_TABS = ['All Result', 'Free', 'Premium', 'Author', 'Genre'];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Result');
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
    }, 900);
  }, []);

  const handleTabPress = (tab: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    setActiveTab(tab);
  };

  const filteredBooks = useMemo(() => {
    let result = BOOKS.filter((b) => {
      const matchesQuery =
        !query.trim() ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()));

      let matchesTab = true;
      if (activeTab === 'Free') {
        matchesTab = b.price < 16;
      } else if (activeTab === 'Premium') {
        matchesTab = b.price >= 18;
      } else if (activeTab === 'Genre') {
        matchesTab = b.genres.includes('Self-Help') || b.genres.includes('Fiction');
      }

      return matchesQuery && matchesTab;
    });

    if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [query, activeTab, filters]);

  const handleResetFilters = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setQuery('');
    setActiveTab('All Result');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onFilterPress={() => setIsFilterVisible(true)}
          placeholder="Search Book"
        />
      </View>

      {/* Quick Filter Tabs (All Result, Free, Premium, Author, Genre) */}
      <View style={styles.tabsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={styles.tabItem}
                hitSlop={6}
              >
                <Text
                  style={[
                    styles.tabText,
                    isSelected ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 2-Column Books Grid */}
      {isRefreshing ? (
        <View style={styles.skeletonGrid}>
          <View style={styles.skeletonCol}>
            <BookSkeletonCard width="100%" />
            <BookSkeletonCard width="100%" />
          </View>
          <View style={styles.skeletonCol}>
            <BookSkeletonCard width="100%" />
            <BookSkeletonCard width="100%" />
          </View>
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SearchX size={36} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Books Found</Text>
          <Text style={styles.emptySubtitle}>
            We couldn't find any titles matching "{query}".
          </Text>
          <Pressable onPress={handleResetFilters} style={styles.resetBtn}>
            <RotateCcw size={14} color="#FFFFFF" />
            <Text style={styles.resetBtnText}>Clear Filters</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <BookCard book={item} width="100%" />
            </View>
          )}
        />
      )}

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
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  tabsSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 22,
  },
  tabItem: {
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    fontFamily: Typography.sans.bold,
    color: Colors.primary, // Golden Amber #D97706
  },
  tabTextInactive: {
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '47.5%',
  },
  skeletonGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  skeletonCol: {
    flex: 1,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  resetBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
  },
});
