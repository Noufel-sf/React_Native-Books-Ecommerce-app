import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Typography } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onActionPress && (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.arrowButton,
            { transform: [{ scale: pressed ? 0.92 : 1 }] },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`View all ${title}`}
        >
          <ArrowRight size={16} color="#18181B" strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 10,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
