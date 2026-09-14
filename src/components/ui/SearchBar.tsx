import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

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
  placeholder = 'Search books...',
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <Search size={18} color="#8C8276" style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9E9488"
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterButton,
          { opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Open filters"
      >
        <SlidersHorizontal size={16} color="#9E651D" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1A1816',
    paddingVertical: 6,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5E8D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
