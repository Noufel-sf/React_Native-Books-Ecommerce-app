import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SearchBar } from '@/components/ui/SearchBar';
import { BookCard } from '@/components/product/BookCard';
import { BookSkeletonCard } from '@/components/ui/SkeletonLoader';
import { BOOKS } from '@/data/books';
import { Typography } from '@/constants/theme';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
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

  const filteredBooks = BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore Catalog</Text>
        <Text style={styles.subtitle}>Discover thousands of editorial classics and modern bestsellers</Text>
        <View style={styles.searchContainer}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search genres, titles, ISBN..." />
        </View>
      </View>

      {isRefreshing ? (
        <View style={{ paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ flex: 1 }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1 }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1, minWidth: '45%' }}><BookSkeletonCard width="100%" /></View>
          <View style={{ flex: 1, minWidth: '45%' }}><BookSkeletonCard width="100%" /></View>
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
    paddingBottom: 8,
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
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 110,
    gap: 14,
  },
  columnWrapper: {
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
});
