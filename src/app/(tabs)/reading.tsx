import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { BookCard } from '@/components/product/BookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import { BOOKS, CONTINUE_READING_BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Typography, Shadows } from '@/constants/theme';
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
              <ContinueReadingCard book={item} />
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
    backgroundColor: '#FAF5EE',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
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
    marginTop: 2,
    marginBottom: 14,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 3,
    ...Shadows.sm,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 0,
  },
  toggleBtnActive: {
    backgroundColor: '#FFDE59',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  toggleText: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#555555',
  },
  toggleTextActive: {
    color: '#000000',
    fontFamily: Typography.sans.bold,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
    gap: 14,
  },
  columnWrapper: {
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
  emptyContainer: {
    padding: 24,
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 16,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  exploreBtn: {
    backgroundColor: '#FFDE59',
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Shadows.button,
  },
  exploreBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
});
