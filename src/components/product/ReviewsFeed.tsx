import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Star, ThumbsUp, CheckCircle2, MessageSquare } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Typography, Shadows } from '@/constants/theme';
import { useReviewsStore, BookReview } from '@/store/reviewsStore';

interface ReviewsFeedProps {
  bookId: string;
  onWriteReviewPress: () => void;
}

export const ReviewsFeed: React.FC<ReviewsFeedProps> = ({
  bookId,
  onWriteReviewPress,
}) => {
  const allReviews = useReviewsStore((state) => state.reviews);
  const toggleHelpful = useReviewsStore((state) => state.toggleHelpful);
  const helpfulMap = useReviewsStore((state) => state.helpfulMap);

  const reviews = React.useMemo(
    () => allReviews.filter((r) => r.bookId === bookId),
    [allReviews, bookId]
  );

  const handleToggleHelpful = (reviewId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    toggleHelpful(reviewId);
  };

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <MessageSquare size={24} color="#000000" />
        </View>
        <Text style={styles.emptyTitle}>No community reviews yet</Text>
        <Text style={styles.emptySubtitle}>
          Have you read this book? Be the first reader to share your thoughts.
        </Text>
        <Pressable
          onPress={onWriteReviewPress}
          style={({ pressed }) => [
            styles.emptyWriteBtn,
            {
              transform: [
                { translateX: pressed ? 2 : 0 },
                { translateY: pressed ? 2 : 0 },
              ],
            },
          ]}
        >
          <Text style={styles.emptyWriteBtnText}>WRITE FIRST REVIEW</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.feedContainer}>
      {reviews.map((review) => {
        const isHelpful = !!helpfulMap[review.id];
        return (
          <View key={review.id} style={styles.reviewCard}>
            {/* Review Header: User & Verified Badge */}
            <View style={styles.reviewHeader}>
              <View style={styles.userRow}>
                {review.userAvatar ? (
                  <Image
                    source={{ uri: review.userAvatar }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>
                      {review.userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.userMeta}>
                  <Text style={styles.userName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>

              {review.isVerifiedPurchase && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 size={11} color="#000000" />
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              )}
            </View>

            {/* Stars Row */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  color="#000000"
                  fill={s <= review.rating ? '#FFDE59' : '#FFFFFF'}
                  strokeWidth={2}
                />
              ))}
            </View>

            {/* Headline */}
            <Text style={styles.reviewHeadline}>{review.title}</Text>

            {/* Body */}
            <Text style={styles.reviewBody}>{review.comment}</Text>

            {/* Helpful Button Row */}
            <View style={styles.footerRow}>
              <Pressable
                onPress={() => handleToggleHelpful(review.id)}
                style={({ pressed }) => [
                  styles.helpfulBtn,
                  isHelpful && styles.helpfulBtnActive,
                  {
                    transform: [
                      { translateX: pressed ? 1 : 0 },
                      { translateY: pressed ? 1 : 0 },
                    ],
                  },
                ]}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Mark review as helpful"
              >
                <ThumbsUp
                  size={12}
                  color="#000000"
                  fill={isHelpful ? '#000000' : 'none'}
                  strokeWidth={2.2}
                />
                <Text style={styles.helpfulText}>
                  Helpful {review.helpfulCount > 0 ? `(${review.helpfulCount})` : ''}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    gap: 12,
    marginTop: 14,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 16,
    ...Shadows.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  userMeta: {
    gap: 1,
  },
  userName: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#777777',
  },
  verifiedBadge: {
    backgroundColor: '#2EEC96',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  verifiedText: {
    fontSize: 9,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  reviewHeadline: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    marginBottom: 6,
    lineHeight: 19,
  },
  reviewBody: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#333333',
    lineHeight: 19,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  helpfulBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  helpfulBtnActive: {
    backgroundColor: '#FFDE59',
  },
  helpfulText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 20,
    alignItems: 'center',
    marginTop: 14,
    ...Shadows.card,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  emptyWriteBtn: {
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Shadows.button,
  },
  emptyWriteBtnText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
});
