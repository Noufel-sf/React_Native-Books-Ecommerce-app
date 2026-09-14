import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  badgeCount?: number;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  badgeCount,
  size = 40,
  backgroundColor = '#FFFFFF',
  style,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        style,
      ]}
    >
      {icon}
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE5D8',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E24C38',
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
