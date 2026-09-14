import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { CATEGORIES } from '@/data/categories';
import { Shadows, Typography } from '@/constants/theme';

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
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            style={({ pressed }) => [
              styles.pill,
              isSelected ? styles.pillActive : styles.pillInactive,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
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
    paddingVertical: 12,
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  pillActive: {
    backgroundColor: '#FFDE59',
    ...Shadows.sm,
  },
  pillInactive: {
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
  textActive: {
    color: '#000000',
  },
  textInactive: {
    color: '#444444',
  },
});
