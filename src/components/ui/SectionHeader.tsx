import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { Shadows, Typography } from '@/constants/theme';

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
      {actionText && (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.actionButton,
            {
              transform: [
                { translateX: pressed ? 1.5 : 0 },
                { translateY: pressed ? 1.5 : 0 },
              ],
            },
          ]}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          <ArrowUpRight size={14} color="#000000" strokeWidth={2.5} style={styles.icon} />
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
    marginBottom: 14,
    marginTop: 22,
  },
  title: {
    fontSize: 22,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDE59',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    ...Shadows.sm,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    textTransform: 'uppercase',
  },
  icon: {
    marginLeft: 3,
  },
});
