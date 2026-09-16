import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Sparkles, Flame } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '@/constants/theme';

export type BadgeVariant = 'readNow' | 'popular' | 'rating' | 'discount' | 'neutral' | 'picked';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'readNow',
  size = 'sm',
  icon = true,
}) => {
  return (
    <View style={[styles.badgeBase, styles[variant], size === 'md' && styles.sizeMd]}>
      {variant === 'rating' && icon && (
        <Star
          size={size === 'md' ? 12 : 10}
          color="#FBBF24"
          fill="#FBBF24"
          style={styles.icon}
        />
      )}
      {variant === 'popular' && icon && (
        <Flame size={size === 'md' ? 12 : 10} color="#D97706" style={styles.icon} />
      )}
      <Text style={[styles.textBase, styles[`${variant}Text` as keyof typeof styles], size === 'md' && styles.textMd]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full, // pill
    backgroundColor: '#FEF3C7',
  },
  sizeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 4,
  },
  textBase: {
    fontSize: 10,
    fontFamily: Typography.sans.semiBold,
    color: Colors.primary,
    letterSpacing: 0.1,
  },
  textMd: {
    fontSize: 11,
  },
  readNow: {
    backgroundColor: '#FEF3C7',
  },
  readNowText: {
    color: '#D97706',
  },
  popular: {
    backgroundColor: '#FEF3C7',
  },
  popularText: {
    color: '#D97706',
  },
  rating: {
    backgroundColor: '#FFFBEB',
  },
  ratingText: {
    color: '#D97706',
  },
  discount: {
    backgroundColor: '#FEE2E2',
  },
  discountText: {
    color: '#EF4444',
  },
  neutral: {
    backgroundColor: '#F3F4F6',
  },
  neutralText: {
    color: '#4B5563',
  },
  picked: {
    backgroundColor: '#EEF2FF',
  },
  pickedText: {
    color: '#6366F1',
  },
});
