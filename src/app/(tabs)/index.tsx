import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { HomeHeader } from '@/components/layout/HomeHeader';
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
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import {
  BookSkeletonCard,
  HeroSkeletonBanner,
  ContinueReadingSkeleton,
} from '@/components/ui/SkeletonLoader';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  }, []);

  // Filter books based on category
  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'all') {
      return BOOKS;
    }
    return BOOKS.filter((b) =>
      b.genres.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

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
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* User Greeting Header */}
        <HomeHeader />

        {isRefreshing ? (
          <View style={{ marginTop: 6 }}>
            <HeroSkeletonBanner />
            <SectionHeader title="Loading Books..." />
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20 }}>
              <BookSkeletonCard width={140} />
              <BookSkeletonCard width={140} />
            </View>
          </View>
        ) : (
          <>
            {/* Hero Card Banner */}
            <BookHeroBanner book={HERO_BOOK} />

            {/* Genre Category Selector Tabs */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Horizontal Books Carousel */}
            <FlatList
              horizontal
              data={filteredBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BookCard book={item} width={138} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />

            {/* Continue Reading Section */}
            <SectionHeader
              title="Continue Reading"
              actionText="View all"
              onActionPress={() => {}}
            />

            {/* Horizontal Continue Reading Shelf */}
            <FlatList
              horizontal
              data={CONTINUE_READING_BOOKS}
              keyExtractor={(item) => `continue-${item.id}`}
              renderItem={({ item }) => <ContinueReadingCard book={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.continueListContent}
            />
          </>
        )}

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
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  horizontalListContent: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 10,
  },
  continueListContent: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 14,
  },
  bottomSpacer: {
    height: 90,
  },
});
