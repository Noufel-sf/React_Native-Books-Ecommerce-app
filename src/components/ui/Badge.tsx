import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Sparkles } from 'lucide-react-native';
import { Colors, Shadows, Typography } from '@/constants/theme';

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
        <Star
          size={size === 'md' ? 12 : 10}
          color="#000000"
          fill="#FFDE59"
          style={styles.icon}
        />
      )}
      {variant === 'popular' && icon && (
        <Sparkles size={size === 'md' ? 12 : 10} color="#000000" style={styles.icon} />
      )}
      <Text style={[styles.textBase, size === 'md' && styles.textMd]}>
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
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFDE59',
    ...Shadows.sm,
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
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textMd: {
    fontSize: 11,
  },
  readNow: {
    backgroundColor: '#FFDE59',
  },
  popular: {
    backgroundColor: '#FF6B4A',
  },
  rating: {
    backgroundColor: '#FFFFFF',
  },
  discount: {
    backgroundColor: '#FFA6D5',
  },
  neutral: {
    backgroundColor: '#C4A1FF',
  },
});
