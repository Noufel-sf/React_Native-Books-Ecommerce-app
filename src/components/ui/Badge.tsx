import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export type BadgeVariant = 'readNow' | 'popular' | 'rating' | 'discount' | 'neutral';

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
        <Star size={size === 'md' ? 12 : 10} color={Colors.status.rating} fill={Colors.status.rating} style={styles.icon} />
      )}
      {variant === 'popular' && icon && (
        <Sparkles size={size === 'md' ? 12 : 10} color={Colors.text.accent} style={styles.icon} />
      )}
      <Text style={[styles.textBase, styles[`${variant}Text`], size === 'md' && styles.textMd]}>
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
    borderRadius: 9999,
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
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 11,
  },
  readNow: {
    backgroundColor: '#F7EFE2',
  },
  readNowText: {
    color: '#A86C1D',
    textTransform: 'uppercase',
  },
  popular: {
    backgroundColor: '#F5ECE0',
  },
  popularText: {
    color: '#9E651D',
  },
  rating: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#F0E7D8',
  },
  ratingText: {
    color: '#2A221B',
    fontWeight: '700',
  },
  discount: {
    backgroundColor: '#FDF0EF',
  },
  discountText: {
    color: '#C94A3D',
  },
  neutral: {
    backgroundColor: '#EFEBE2',
  },
  neutralText: {
    color: '#6B6258',
  },
});
