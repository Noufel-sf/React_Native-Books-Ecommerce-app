import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { CATEGORIES } from '@/data/categories';
import { Colors, Typography } from '@/constants/theme';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory.toLowerCase() === category.id.toLowerCase();
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            style={styles.tabItem}
            hitSlop={8}
          >
            <Text
              style={[
                styles.categoryText,
                isSelected ? styles.textActive : styles.textInactive,
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 20,
  },
  tabItem: {
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  textActive: {
    fontFamily: Typography.sans.bold,
    color: Colors.primary, // Golden amber #D97706
  },
  textInactive: {
    fontFamily: Typography.sans.medium,
    color: '#8E8E93', // Subtle gray
  },
});
