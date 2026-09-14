import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

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
          style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          <ChevronRight size={14} color="#8C8276" style={styles.chevron} />
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
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1816',
    letterSpacing: -0.3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C8276',
  },
  chevron: {
    marginLeft: 2,
  },
});
