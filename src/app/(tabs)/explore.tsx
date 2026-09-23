import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, ArrowRight, MoreHorizontal, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BOOKS } from '@/data/books';
import { Typography, BorderRadius } from '@/constants/theme';

export default function ExploreScreen() {
  const router = useRouter();

  // Reference featured book for "Top E-Book Reading"
  const topEbook =
    BOOKS.find((b) => b.id === 'muscle-trovelutions') ??
    BOOKS[3];

  // More Recommended books
  const recommendedBooks = BOOKS.filter((b) => b.id !== topEbook.id);

  const handleBack = () => {
    router.replace('/(tabs)');
  };

  const handleBookPress = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    router.push({
      pathname: '/book/[id]',
      params: { id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen 3: Top Navigation Bar */}
      <View style={styles.header}>
        {/* Cyan Circular Back Button */}
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backCircle,
            { transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={18} color="#18181B" strokeWidth={2.4} />
        </Pressable>

        {/* Center Title */}
        <Text style={styles.headerTitle}>More Book</Text>

        {/* Right Options */}
        <Pressable
          onPress={() => {
            Haptics.selectionAsync?.().catch?.(() => {});
          }}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel="Options"
        >
          <MoreHorizontal size={22} color="#18181B" strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen 3: Top E-Book Reading Spotlight Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top E-Book Reading</Text>
          <Text style={styles.sectionSubtitle}>
            This top e-book for you, we have many type for you needed ( science, design, & busines )
          </Text>
        </View>

        {/* Spotlight Card with Yellow Detail Button */}
        <View style={styles.spotlightCard}>
          {/* Book Cover with 1.8px Black Border */}
          <View style={styles.spotlightCoverFrame}>
            <Image
              source={{ uri: topEbook.coverImage }}
              style={styles.spotlightCoverImage}
              contentFit="cover"
            />
          </View>

          {/* Book Details */}
          <View style={styles.spotlightDetails}>
            <Text style={styles.spotlightTitle} numberOfLines={2}>
              {topEbook.title}
            </Text>
            <Text style={styles.spotlightAuthor}>By {topEbook.author}</Text>

            {/* Stars */}
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  color="#FBBF24"
                  fill={i < Math.round(topEbook.rating) ? '#FBBF24' : 'transparent'}
                />
              ))}
            </View>

            {/* Price */}
            <Text style={styles.spotlightPrice}>${topEbook.price.toFixed(2)}</Text>

            {/* Cyber Yellow Pill Detail Button */}
            <Pressable
              onPress={() => handleBookPress(topEbook.id)}
              style={({ pressed }) => [
                styles.detailBtn,
                { transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${topEbook.title}`}
            >
              <Text style={styles.detailBtnText}>Detail</Text>
            </Pressable>
          </View>
        </View>

        {/* Screen 3: More Recommended Section */}
        <View style={styles.recommendedContainer}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>More Recomended</Text>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.arrowBox,
                { transform: [{ scale: pressed ? 0.92 : 1 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="View more recommended"
            >
              <ArrowRight size={16} color="#18181B" strokeWidth={2.4} />
            </Pressable>
          </View>

          {/* 2-Column Grid of Recommended Books */}
          <View style={styles.booksGrid}>
            {recommendedBooks.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => handleBookPress(b.id)}
                style={({ pressed }) => [
                  styles.gridCard,
                  { transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`View ${b.title}`}
              >
                <View style={styles.gridCoverFrame}>
                  <Image
                    source={{ uri: b.coverImage }}
                    style={styles.gridCoverImage}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.gridInfo}>
                  <Text style={styles.gridAuthor} numberOfLines={1}>
                    By {b.author}
                  </Text>
                  <Text style={styles.gridTitle} numberOfLines={1}>
                    {b.title}
                  </Text>
                  <Text style={styles.gridPrice}>${b.price.toFixed(2)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#38BDF8', // Cyan Blue from mockup
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    lineHeight: 18,
  },
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 14,
    marginBottom: 24,
  },
  spotlightCoverFrame: {
    width: 104,
    height: 146,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  spotlightCoverImage: {
    width: '100%',
    height: '100%',
  },
  spotlightDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  spotlightTitle: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    lineHeight: 20,
    marginBottom: 3,
  },
  spotlightAuthor: {
    fontSize: 11.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 6,
  },
  spotlightPrice: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginBottom: 10,
  },
  detailBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow from mockup
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  detailBtnText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  recommendedContainer: {
    paddingHorizontal: 20,
  },
  recommendedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recommendedTitle: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  gridCoverFrame: {
    width: '100%',
    aspectRatio: 0.72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gridCoverImage: {
    width: '100%',
    height: '100%',
  },
  gridInfo: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  gridAuthor: {
    fontSize: 10,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  gridTitle: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginTop: 2,
  },
  gridPrice: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginTop: 4,
  },
});
