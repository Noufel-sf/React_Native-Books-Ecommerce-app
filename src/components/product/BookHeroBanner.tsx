import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { BookCover3D } from '@/components/product/BookCover3D';
import { Colors, Typography } from '@/constants/theme';

interface BookHeroBannerProps {
  book: Book;
}

export const BookHeroBanner: React.FC<BookHeroBannerProps> = ({ book }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleBannerPress = () => {
    router.push({
      pathname: '/book/[id]',
      params: { id: book.id },
    });
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleBannerPress}
        style={({ pressed }) => [
          styles.bannerCard,
          { opacity: pressed ? 0.94 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
        ]}
      >
        {/* Left Column: Details & Call To Action */}
        <View style={styles.leftColumn}>
          {/* Popular Tag */}
          <View style={styles.popularBadge}>
            <Sparkles size={11} color="#A86C1D" style={styles.badgeIcon} />
            <Text style={styles.popularText}>Popular</Text>
          </View>

          {/* Book Title */}
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>

          {/* Author & Year */}
          <Text style={styles.author}>
            {book.author} {book.originalYear ? `(${book.originalYear})` : ''}
          </Text>

          {/* Read More Action */}
          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>Read More...</Text>
            <ArrowRight size={13} color="#8C5C1E" style={styles.arrowIcon} />
          </View>
        </View>

        {/* Right Column: 3D Stacked Book Cover Perspective */}
        <View style={styles.rightColumn}>
          {/* Background decorative stacked book */}
          <View style={styles.stackBacking}>
            <BookCover3D
              imageUrl={book.coverImage}
              width={82}
              height={118}
              style={{ opacity: 0.55 }}
            />
          </View>

          {/* Foreground 3D Book Cover */}
          <View style={styles.foregroundCover}>
            <BookCover3D
              imageUrl={book.coverImage}
              width={96}
              height={136}
              variant="hero"
            />
          </View>
        </View>
      </Pressable>

      {/* Carousel Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((dotIndex) => (
          <Pressable
            key={dotIndex}
            onPress={() => setActiveSlide(dotIndex)}
            style={[
              styles.dot,
              activeSlide === dotIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  bannerCard: {
    backgroundColor: '#F5ECE0',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DBC9',
    overflow: 'hidden',
  },
  leftColumn: {
    flex: 1.1,
    paddingRight: 10,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  popularText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#A86C1D',
  },
  title: {
    fontSize: 18,
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#7C7368',
    marginTop: 4,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#9E651D',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  rightColumn: {
    flex: 0.9,
    height: 140,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackBacking: {
    position: 'absolute',
    right: 0,
    top: 4,
    transform: [{ rotate: '5deg' }],
  },
  foregroundCover: {
    position: 'absolute',
    right: 14,
    top: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#D48C2B',
  },
  inactiveDot: {
    width: 5,
    backgroundColor: '#D9D0C3',
  },
});
