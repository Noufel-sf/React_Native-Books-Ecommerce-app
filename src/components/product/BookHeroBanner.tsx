import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Book } from '@/types/book';
import { Shadows, Typography } from '@/constants/theme';

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
          {
            transform: [
              { translateX: pressed ? 2 : 0 },
              { translateY: pressed ? 2 : 0 },
            ],
          },
        ]}
      >
        {/* Left Column: Details & Call To Action */}
        <View style={styles.leftColumn}>
          {/* Neobrutal Sticker Badge */}
          <View style={styles.popularBadge}>
            <Sparkles size={12} color="#000000" style={styles.badgeIcon} />
            <Text style={styles.popularText}>POPULAR PICK</Text>
          </View>

          {/* Book Title */}
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>

          {/* Author */}
          <Text style={styles.author}>
            by {book.author} {book.originalYear ? `(${book.originalYear})` : ''}
          </Text>

          {/* Read More Button Sticker */}
          <View style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>EXPLORE NOW</Text>
            <ArrowRight size={13} color="#000000" strokeWidth={2.5} style={styles.arrowIcon} />
          </View>
        </View>

        {/* Right Column: Framed Book Cover with Hard Shadow */}
        <View style={styles.rightColumn}>
          <View style={styles.coverFrame}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>
      </Pressable>

      {/* Neobrutal Carousel Dots */}
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
    backgroundColor: '#FFDE59',
    borderRadius: 0,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  leftColumn: {
    flex: 1.1,
    paddingRight: 10,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
    marginBottom: 10,
    ...Shadows.sm,
  },
  badgeIcon: {
    marginRight: 4,
  },
  popularText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    lineHeight: 23,
    letterSpacing: -0.4,
  },
  author: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#333333',
    marginTop: 4,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 14,
    ...Shadows.sm,
  },
  readMoreText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  rightColumn: {
    flex: 0.9,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  coverFrame: {
    width: 95,
    height: 135,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Shadows.button,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  activeDot: {
    width: 22,
    backgroundColor: '#000000',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#FFFFFF',
  },
});
