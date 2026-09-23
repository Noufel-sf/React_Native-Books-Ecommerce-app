import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Book } from '@/types/book';
import { Typography, BorderRadius } from '@/constants/theme';

interface TrendingBooksCardProps {
  books: Book[];
}

export const TrendingBooksCard: React.FC<TrendingBooksCardProps> = ({ books }) => {
  const router = useRouter();

  const handleArrowPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    router.push('/(tabs)/explore');
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
    <View style={styles.outerContainer}>
      {/* Electric Sky Blue Curved Container */}
      <View style={styles.blueCard}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Trending Book</Text>
          <Pressable
            onPress={handleArrowPress}
            style={({ pressed }) => [
              styles.arrowButton,
              { transform: [{ scale: pressed ? 0.92 : 1 }] },
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View all trending books"
          >
            <ArrowRight size={16} color="#18181B" strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* Horizontal Shelf of Neo-Pop White Cards */}
        <FlatList
          horizontal
          data={books}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleBookPress(item.id)}
              style={({ pressed }) => [
                styles.bookCard,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              <View style={styles.coverFrame}>
                <Image
                  source={{ uri: item.coverImage }}
                  style={styles.coverImage}
                  contentFit="cover"
                  transition={200}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.authorText} numberOfLines={1}>
                  {item.author}
                </Text>
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  blueCard: {
    backgroundColor: '#38BDF8', // Electric Sky Blue from mockup
    borderRadius: 28,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingTop: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bookCard: {
    width: 126,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 8,
    alignItems: 'center',
  },
  coverFrame: {
    width: 106,
    height: 146,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    width: '100%',
    marginTop: 8,
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  authorText: {
    fontSize: 10,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
});
