import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { GenreCategory } from '@/types/book';
import { CATEGORIES } from '@/data/categories';
import { Colors } from '@/constants/theme';

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
            style={styles.item}
          >
            <Text
              style={[
                styles.categoryText,
                isSelected ? styles.categoryTextActive : styles.categoryTextInactive,
              ]}
            >
              {category.name}
            </Text>
            {isSelected && <View style={styles.activeDot} />}
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
  item: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#1A1816',
    fontWeight: '700',
  },
  categoryTextInactive: {
    color: '#8C8276',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D48C2B',
    marginTop: 4,
  },
});
