import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Book } from '@/types/book';
import { Typography, BorderRadius } from '@/constants/theme';

interface SpotlightEbookCardProps {
  book: Book;
}

export const SpotlightEbookCard: React.FC<SpotlightEbookCardProps> = ({ book }) => {
  const router = useRouter();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top E-Book Reading</Text>
        <Text style={styles.sectionSubtitle}>
          This top e-book for you, we have many type for you needed ( science, design, & busines )
        </Text>
      </View>

      {/* Spotlight Card */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.spotlightCard,
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${book.title}`}
      >
        {/* Book Cover Frame */}
        <View style={styles.coverFrame}>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.bookAuthor}>By {book.author}</Text>

          {/* Yellow Rating Stars */}
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                color="#FBBF24"
                fill={i < Math.round(book.rating) ? '#FBBF24' : 'transparent'}
              />
            ))}
          </View>

          {/* Price */}
          <Text style={styles.priceText}>${book.price.toFixed(2)}</Text>

          {/* Cyber Yellow Detail Pill Button */}
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.detailBtn,
              { transform: [{ scale: pressed ? 0.94 : 1 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Detail"
          >
            <Text style={styles.detailBtnText}>Detail</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    lineHeight: 16,
  },
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 14,
  },
  coverFrame: {
    width: 104,
    height: 146,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  detailsCol: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    lineHeight: 20,
    marginBottom: 3,
  },
  bookAuthor: {
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
  priceText: {
    fontSize: 15.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginBottom: 10,
  },
  detailBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow from mockup
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 105,
  },
  detailBtnText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
});
