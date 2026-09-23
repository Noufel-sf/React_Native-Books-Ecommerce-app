import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CATEGORIES } from '@/data/categories';
import { Typography, BorderRadius } from '@/constants/theme';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  all: '⚡',
  comedy: '🎭',
  fiction: '✨',
  romance: '💖',
  biography: '👤',
  'self-help': '🧠',
  technology: '💻',
  history: '🏛️',
  fantasy: '🔮',
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleSelect = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    onSelectCategory(id);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory.toLowerCase() === category.id.toLowerCase();
          const icon = CATEGORY_ICONS[category.id.toLowerCase()] || '📖';

          return (
            <Pressable
              key={category.id}
              onPress={() => handleSelect(category.id)}
              style={({ pressed }) => [
                styles.pillChip,
                isSelected ? styles.pillActive : styles.pillInactive,
                { transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityState={isSelected ? { selected: true } : {}}
              accessibilityLabel={`Filter by ${category.name}`}
            >
              <Text style={styles.chipIcon}>{icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  isSelected ? styles.textActive : styles.textInactive,
                ]}
              >
                {category.name}
              </Text>
              {category.count !== undefined && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected ? styles.countBadgeActive : styles.countBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected ? styles.countTextActive : styles.countTextInactive,
                    ]}
                  >
                    {category.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  pillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#FFD027', // Cyber Yellow active pill
  },
  pillInactive: {
    backgroundColor: '#FFFFFF', // Crisp white inactive pill
  },
  chipIcon: {
    fontSize: 13,
  },
  categoryText: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
  textActive: {
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  textInactive: {
    fontFamily: Typography.sans.semiBold,
    color: '#18181B',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  countBadgeActive: {
    backgroundColor: '#18181B',
  },
  countBadgeInactive: {
    backgroundColor: '#F3F4F6',
  },
  countText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countTextInactive: {
    color: '#6B7280',
  },
});
