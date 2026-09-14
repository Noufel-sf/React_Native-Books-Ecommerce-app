import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCard } from '@/components/product/BookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import { BOOKS, CONTINUE_READING_BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Typography } from '@/constants/theme';

export default function ReadingScreen() {
  const [activeTab, setActiveTab] = useState<'reading' | 'favorites'>('reading');
  const { favorites } = useFavoritesStore();

  const favoriteBooks = BOOKS.filter((b) => favorites.includes(b.id));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Text style={styles.subtitle}>Track your ongoing books and saved wishlist</Text>

        <View style={styles.tabToggle}>
          <Pressable
            onPress={() => setActiveTab('reading')}
            style={[styles.toggleBtn, activeTab === 'reading' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'reading' && styles.toggleTextActive]}>
              Currently Reading ({CONTINUE_READING_BOOKS.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('favorites')}
            style={[styles.toggleBtn, activeTab === 'favorites' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'favorites' && styles.toggleTextActive]}>
              Wishlist ({favoriteBooks.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {activeTab === 'reading' ? (
        <FlatList
          data={CONTINUE_READING_BOOKS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContinueReadingCard book={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={favoriteBooks}
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
      )}
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8C8276',
    marginTop: 2,
    marginBottom: 14,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#EFEAE0',
    borderRadius: 9999,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9999,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C7266',
  },
  toggleTextActive: {
    color: '#1A1816',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
  },
});
