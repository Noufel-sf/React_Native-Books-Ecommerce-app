import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, ArrowUpDown, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

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
  placeholder = 'Search by title, author, or genre...',
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
          <View style={styles.filterIconCircle}>
            <ArrowUpDown size={15} color={Colors.primary} strokeWidth={2.2} />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Shadows.sm,
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
    paddingLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
