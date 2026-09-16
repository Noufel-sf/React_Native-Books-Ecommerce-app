import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Star, ThumbsUp, CheckCircle2, MessageSquare } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
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
                  size={13}
                  color={s <= review.rating ? '#FBBF24' : '#E5E7EB'}
                  fill={s <= review.rating ? '#FBBF24' : 'transparent'}
                  strokeWidth={1.5}
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
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    borderRadius: BorderRadius.full,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#D97706',
  },
  userMeta: {
    gap: 1,
  },
  userName: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#9CA3AF',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  verifiedText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.medium,
    color: '#059669',
    letterSpacing: 0.3,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  reviewHeadline: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
    marginBottom: 6,
    lineHeight: 19,
  },
  reviewBody: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  helpfulBtn: {
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  helpfulText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#4B5563',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: BorderRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginTop: 14,
    ...Shadows.card,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  emptyWriteBtn: {
    backgroundColor: '#D97706',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 9,
    ...Shadows.card,
  },
  emptyWriteBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.semiBold,
    color: '#FFFFFF',
  },
});
