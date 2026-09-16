import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { BookCard } from '@/components/product/BookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import { BOOKS, CONTINUE_READING_BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { SwipeToDeleteRow } from '@/components/gestures/SwipeToDeleteRow';

export default function ReadingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reading' | 'favorites'>('reading');
  const [readingList, setReadingList] = useState(CONTINUE_READING_BOOKS);
  const { favorites } = useFavoritesStore();

  const favoriteBooks = BOOKS.filter((b) => favorites.includes(b.id));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Text style={styles.subtitle}>
          {activeTab === 'reading'
            ? `${readingList.length} ongoing ${readingList.length === 1 ? 'book' : 'books'} • Swipe left to remove`
            : `${favoriteBooks.length} saved ${favoriteBooks.length === 1 ? 'book' : 'books'}`}
        </Text>

        <View style={styles.tabToggle}>
          <Pressable
            onPress={() => setActiveTab('reading')}
            style={[styles.toggleBtn, activeTab === 'reading' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'reading' && styles.toggleTextActive]}>
              Currently Reading ({readingList.length})
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
          key="reading-list"
          data={readingList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeToDeleteRow
              deleteLabel="REMOVE"
              onDelete={() => setReadingList((prev) => prev.filter((b) => b.id !== item.id))}
            >
              <ContinueReadingCard book={item} fullWidth />
            </SwipeToDeleteRow>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : favoriteBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Heart size={32} color="#000000" fill="#FF6B4A" strokeWidth={2.5} />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart sticker on any book to save your favorite titles here.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/explore')}
            style={({ pressed }) => [
              styles.exploreBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
          >
            <Text style={styles.exploreBtnText}>Browse Catalog</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          key="favorites-grid"
          data={favoriteBooks}
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12.5,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
    marginTop: 2,
    marginBottom: 12,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
  },
  toggleTextActive: {
    color: Colors.primary,
    fontFamily: Typography.sans.bold,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
  },
  emptyContainer: {
    padding: 28,
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exploreBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
  },
});
