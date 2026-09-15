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
import { BOOKS } from '@/data/books';
import { Typography, Shadows } from '@/constants/theme';
import { SearchX, RotateCcw } from 'lucide-react-native';

const CATEGORIES = [
  'All',
  'Self-Help',
  'Philosophy',
  'Psychology',
  'Business',
  'Biography',
];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((b) => {
      const matchesQuery =
        !query.trim() ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || b.genres.includes(selectedCategory);

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const handleResetFilters = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setQuery('');
    setSelectedCategory('All');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore Catalog</Text>
        <Text style={styles.subtitle}>Discover thousands of editorial classics and modern bestsellers</Text>
        <View style={styles.searchContainer}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search genres, titles, ISBN..."
          />
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={styles.categoryScrollWrapper}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count =
              category === 'All'
                ? BOOKS.length
                : BOOKS.filter((b) => b.genres.includes(category)).length;

            return (
              <Pressable
                key={category}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  }
                  setSelectedCategory(category);
                }}
                style={({ pressed }) => [
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
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
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {category}
                </Text>
                <View
                  style={[
                    styles.categoryCountBadge,
                    isSelected && styles.categoryCountBadgeActive,
                  ]}
                >
                  <Text style={styles.categoryCountText}>{count}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isRefreshing ? (
        <View style={{ paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ flex: 1 }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1 }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1, minWidth: '45%' }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1, minWidth: '45%' }}><BookSkeletonCard width="100%" /></View>
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <SearchX size={36} color="#000000" strokeWidth={2.5} />
          </View>
          <Text style={styles.emptyTitle}>No matching books found</Text>
          <Text style={styles.emptySubtitle}>
            We couldn't find any titles matching your search and category filter.
          </Text>
          <Pressable
            onPress={handleResetFilters}
            style={({ pressed }) => [
              styles.resetBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
          >
            <RotateCcw size={15} color="#000000" strokeWidth={2.5} />
            <Text style={styles.resetBtnText}>RESET FILTERS</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <BookCard book={item} width="100%" />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#000000"
              colors={['#FFDE59', '#2EEC96', '#FF6B4A']}
              progressBackgroundColor="#FFFFFF"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    marginTop: 4,
    marginBottom: 12,
  },
  searchContainer: {
    marginBottom: 12,
  },
  categoryScrollWrapper: {
    marginBottom: 8,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 20,
    paddingBottom: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    ...Shadows.sm,
  },
  categoryPillActive: {
    backgroundColor: '#FFDE59',
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  categoryPillTextActive: {
    color: '#000000',
  },
  categoryCountBadge: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  categoryCountBadgeActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryCountText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 110,
  },
  columnWrapper: {
    gap: 10,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconBox: {
    width: 68,
    height: 68,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: '#FFDE59',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.button,
  },
  resetBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
});
