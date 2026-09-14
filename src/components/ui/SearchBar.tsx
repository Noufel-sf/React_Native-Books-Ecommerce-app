import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Shadows, Typography } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search books, authors, genres...',
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <Search size={20} color="#000000" strokeWidth={2.5} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterButton,
          {
            transform: [
              { translateX: pressed ? 1.5 : 0 },
              { translateY: pressed ? 1.5 : 0 },
            ],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Open filters"
      >
        <SlidersHorizontal size={18} color="#000000" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    color: '#000000',
    paddingVertical: 6,
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
