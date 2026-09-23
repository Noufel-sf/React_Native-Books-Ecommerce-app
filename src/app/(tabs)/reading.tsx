import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Heart, Flame, BookCheck, Clock } from 'lucide-react-native';
import { BookCard } from '@/components/product/BookCard';
import { ContinueReadingCard } from '@/components/product/ContinueReadingCard';
import { BOOKS, CONTINUE_READING_BOOKS } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { SwipeToDeleteRow } from '@/components/gestures/SwipeToDeleteRow';

export default function ReadingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'reading' | 'favorites'>('reading');
  const [readingList, setReadingList] = useState(CONTINUE_READING_BOOKS);
  const { favorites } = useFavoritesStore();

  const favoriteBooks = BOOKS.filter((b) => favorites.includes(b.id));

  const handleTabSwitch = (tab: 'reading' | 'favorites') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top + 8, Platform.OS === 'web' ? 28 : 16) },
        ]}
      >
        <Text style={styles.title}>My Library</Text>
        <Text style={styles.subtitle}>
          {activeTab === 'reading'
            ? `${readingList.length} active ${readingList.length === 1 ? 'title' : 'titles'} • Swipe left to remove`
            : `${favoriteBooks.length} saved ${favoriteBooks.length === 1 ? 'title' : 'titles'}`}
        </Text>

        {/* Reading Habit Stats Ribbon (Neo-Pop) */}
        <View style={styles.statsRibbon}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#FF6B4A' }]}>
              <Flame size={12} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <Text style={styles.statLabel}>5-Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#FFD027' }]}>
              <Clock size={12} color="#18181B" strokeWidth={2.4} />
            </View>
            <Text style={styles.statLabel}>3.2h This Week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconBadge, { backgroundColor: '#38BDF8' }]}>
              <BookCheck size={12} color="#18181B" strokeWidth={2.4} />
            </View>
            <Text style={styles.statLabel}>4 Finished</Text>
          </View>
        </View>

        {/* Tab Toggle Segmented Control (Neo-Pop) */}
        <View style={styles.tabToggle}>
          <Pressable
            onPress={() => handleTabSwitch('reading')}
            style={[styles.toggleBtn, activeTab === 'reading' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'reading' && styles.toggleTextActive]}>
              Reading ({readingList.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleTabSwitch('favorites')}
            style={[styles.toggleBtn, activeTab === 'favorites' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'favorites' && styles.toggleTextActive]}>
              Wishlist ({favoriteBooks.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'reading' ? (
        readingList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <BookCheck size={32} color="#18181B" strokeWidth={2.2} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any ongoing books right now. Discover your next great story.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)')}
              style={({ pressed }) => [
                styles.exploreBtn,
                { transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
            >
              <Text style={styles.exploreBtnText}>Browse Catalog</Text>
            </Pressable>
          </View>
        ) : (
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
        )
      ) : favoriteBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Heart size={30} color="#18181B" fill="#FF6B4A" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Tap the bookmark stamp on any book cover to save your favorite titles here.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={({ pressed }) => [
              styles.exploreBtn,
              { transform: [{ scale: pressed ? 0.96 : 1 }] },
            ]}
          >
            <Text style={styles.exploreBtnText}>Browse Books</Text>
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
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 10,
  },
  statsRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1.8,
    borderColor: '#18181B',
    ...Shadows.popSm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#18181B',
  },
  statLabel: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  statDivider: {
    width: 1.5,
    height: 16,
    backgroundColor: '#18181B',
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 1.8,
    borderColor: '#18181B',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  toggleText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#18181B',
    fontFamily: Typography.sans.bold,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 110,
    gap: 12,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
  },
  emptyContainer: {
    padding: 32,
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1.8,
    borderColor: '#18181B',
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B4A', // Tangerine
    borderWidth: 2,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  exploreBtn: {
    backgroundColor: '#FFD027',
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  exploreBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
});
