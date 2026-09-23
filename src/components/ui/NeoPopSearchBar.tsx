import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, Mic } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Typography, BorderRadius } from '@/constants/theme';

interface NeoPopSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export const NeoPopSearchBar: React.FC<NeoPopSearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search',
}) => {
  return (
    <View style={styles.container}>
      {/* 2.5D Yellow Offset Slab Underneath */}
      <View style={styles.yellowSlab} />

      {/* Main White Pill Input */}
      <View style={styles.inputPill}>
        <Search size={18} color="#18181B" strokeWidth={2.4} style={styles.searchIcon} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          style={styles.textInput}
          returnKeyType="search"
        />

        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.selectionAsync?.().catch?.(() => {});
            }
          }}
          style={styles.micButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Voice search"
        >
          <Mic size={18} color="#18181B" strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    position: 'relative',
  },
  yellowSlab: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -3,
    height: 48,
    backgroundColor: '#FFD027', // Cyber Sunshine Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    height: 48,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: Typography.sans.semiBold,
    color: '#18181B',
    paddingVertical: 8,
  },
  micButton: {
    paddingLeft: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
