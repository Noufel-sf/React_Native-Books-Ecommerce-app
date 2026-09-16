import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Star, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { CURRENT_USER } from '@/data/books';
import { useReviewsStore } from '@/store/reviewsStore';

interface WriteReviewModalProps {
  visible: boolean;
  bookId: string;
  bookTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: 'Masterpiece! Highly recommended',
  4: 'Very Good! Enjoyed it thoroughly',
  3: 'Average • Worth skimming',
  2: 'Below expectations',
  1: 'Disappointing / Did not finish',
};

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  visible,
  bookId,
  bookTitle,
  onClose,
  onSuccess,
}) => {
  const { addReview } = useReviewsStore();

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState(CURRENT_USER.name);
  const [errors, setErrors] = useState<{ title?: string; comment?: string }>({});

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const handleSelectStar = (selectedRating: number) => {
    triggerHaptic();
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    const newErrors: { title?: string; comment?: string } = {};
    if (!title.trim()) newErrors.title = 'Please write a short headline';
    if (!comment.trim()) newErrors.comment = 'Please share your thoughts';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    addReview({
      bookId,
      userName: userName.trim() || CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatarUrl,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      isVerifiedPurchase: true,
    });

    setTitle('');
    setComment('');
    setRating(5);
    setErrors({});
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.dialogWrapper}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <View style={styles.headerTitleBox}>
                <Text style={styles.headerTitle}>WRITE A REVIEW</Text>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  {
                    transform: [
                      { translateX: pressed ? 1 : 0 },
                      { translateY: pressed ? 1 : 0 },
                    ],
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close review dialog"
              >
                <X size={16} color="#000000" strokeWidth={3} />
              </Pressable>
            </View>

            {/* Scrollable Form Content */}
            <ScrollView
              style={styles.formScrollView}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {/* Book Title Banner */}
              <View style={styles.bookBanner}>
                <Text style={styles.bookBannerLabel}>REVIEWING</Text>
                <Text style={styles.bookBannerTitle} numberOfLines={1}>
                  {bookTitle}
                </Text>
              </View>

              {/* Star Rating Picker */}
              <View style={styles.ratingSection}>
                <Text style={styles.inputLabel}>YOUR OVERALL RATING *</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((starNum) => {
                    const isFilled = starNum <= rating;
                    return (
                      <Pressable
                        key={starNum}
                        onPress={() => handleSelectStar(starNum)}
                        style={styles.starTouchArea}
                        hitSlop={8}
                      >
                        <Star
                          size={30}
                          color={isFilled ? '#D97706' : '#D1D5DB'}
                          fill={isFilled ? '#FBBF24' : 'transparent'}
                          strokeWidth={1.5}
                        />
                      </Pressable>
                    );
                  })}
                </View>

                {/* Rating description chip */}
                <View style={styles.ratingChip}>
                  <Text style={styles.ratingChipText}>
                    {rating} / 5 • {RATING_DESCRIPTIONS[rating]}
                  </Text>
                </View>
              </View>

              {/* Headline Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>HEADLINE *</Text>
                <TextInput
                  value={title}
                  onChangeText={(val) => {
                    setTitle(val);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="e.g. Life-changing perspective on strategy"
                  placeholderTextColor="#999999"
                  style={[styles.textInput, errors.title ? styles.inputError : null]}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Review Body Input */}
              <View style={styles.inputGroup}>
                <View style={styles.labelWithCounter}>
                  <Text style={styles.inputLabel}>YOUR THOUGHTS *</Text>
                  <Text style={styles.counterText}>{comment.length} chars</Text>
                </View>
                <TextInput
                  value={comment}
                  onChangeText={(val) => {
                    setComment(val);
                    if (errors.comment) setErrors({ ...errors, comment: '' });
                  }}
                  placeholder="What did you think of the themes, writing style, and key takeaways?"
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={[
                    styles.textInput,
                    styles.textArea,
                    errors.comment ? styles.inputError : null,
                  ]}
                />
                {errors.comment && <Text style={styles.errorText}>{errors.comment}</Text>}
              </View>

              {/* User Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DISPLAY NAME</Text>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Your name"
                  placeholderTextColor="#999999"
                  style={styles.textInput}
                />
              </View>
            </ScrollView>

            {/* Sticky Bottom Action Bar */}
            <View style={styles.footerBar}>
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitBtn,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Submit review"
              >
                <Text style={styles.submitBtnText}>POST COMMUNITY REVIEW</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogWrapper: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'column',
    overflow: 'hidden',
    ...Shadows.floating,
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formScrollView: {
    flexShrink: 1,
  },
  bodyContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 20,
  },
  bookBanner: {
    backgroundColor: '#FBF7F0',
    borderRadius: BorderRadius.md,
    padding: 12,
  },
  bookBannerLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  bookBannerTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
    marginTop: 2,
  },
  ratingSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starTouchArea: {
    padding: 2,
  },
  ratingChip: {
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  ratingChipText: {
    fontSize: 11,
    fontFamily: Typography.sans.semiBold,
    color: '#D97706',
  },
  inputGroup: {
    gap: 6,
  },
  labelWithCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 85,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#EF4444',
  },
  footerBar: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#D97706',
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#FFFFFF',
  },
});
