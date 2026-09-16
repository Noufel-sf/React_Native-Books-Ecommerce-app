import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, ArrowUpDown, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius } from '@/constants/theme';

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
  placeholder = 'Search Book',
  autoFocus = false,
}) => {
  const handleClear = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      {/* Left Search Icon */}
      <Search size={18} color="#9CA3AF" strokeWidth={2.2} style={styles.searchIcon} />

      {/* Text Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
      />

      {/* Clear (X) Button */}
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={styles.clearBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X size={15} color="#9CA3AF" strokeWidth={2} />
        </Pressable>
      )}

      {/* Right Sort/Filter Icon (ArrowUpDown) */}
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={styles.filterButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sort or filter books"
        >
          <ArrowUpDown size={17} color="#6B7280" strokeWidth={2.2} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGray, // #F3F4F6
    borderRadius: BorderRadius.full,     // 9999px rounded pill
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    color: Colors.text.primary,
    paddingVertical: 8,
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    paddingLeft: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
