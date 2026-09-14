import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/ui/SearchBar';
import { BookCard } from '@/components/product/BookCard';
import { BOOKS } from '@/data/books';
import { CATEGORIES } from '@/data/categories';
import { Typography } from '@/constants/theme';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');

  const filteredBooks = BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>Explore Catalog</Text>
        <Text style={styles.subtitle}>Discover thousands of editorial classics and modern bestsellers</Text>
        <View style={styles.searchContainer}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search genres, titles, ISBN..." />
        </View>
      </View>

      <FlatList
        data={filteredBooks}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <BookCard book={item} width={165} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#8C8276',
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 110,
  },
  gridItem: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
  },
});
