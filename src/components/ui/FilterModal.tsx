import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { BookFormat } from '@/types/book';

export interface FilterOptions {
  format?: BookFormat | 'All';
  minRating?: number;
  sortBy: 'popular' | 'rating' | 'priceAsc' | 'priceDesc';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | 'All'>(
    currentFilters.format ?? 'All'
  );
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    currentFilters.minRating
  );
  const [selectedSort, setSelectedSort] = useState<FilterOptions['sortBy']>(
    currentFilters.sortBy
  );

  const formats: (BookFormat | 'All')[] = [
    'All',
    'Hardcover',
    'Paperback',
    'E-Book',
    'Audiobook',
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'priceAsc', label: 'Price: Low to High' },
    { id: 'priceDesc', label: 'Price: High to Low' },
  ];

  const handleApply = () => {
    onApply({
      format: selectedFormat,
      minRating: selectedRating,
      sortBy: selectedSort,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedFormat('All');
    setSelectedRating(undefined);
    setSelectedSort('popular');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter Books</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
            >
              <X size={20} color="#1A1816" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Format Section */}
            <Text style={styles.sectionTitle}>Format</Text>
            <View style={styles.pillsRow}>
              {formats.map((f) => {
                const isSelected = selectedFormat === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setSelectedFormat(f)}
                    style={[
                      styles.pill,
                      isSelected && styles.pillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Minimum Rating Section */}
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.pillsRow}>
              {[undefined, 4.5, 4.8].map((r) => {
                const isSelected = selectedRating === r;
                return (
                  <Pressable
                    key={r ? `${r}` : 'all'}
                    onPress={() => setSelectedRating(r)}
                    style={[
                      styles.pill,
                      isSelected && styles.pillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextSelected,
                      ]}
                    >
                      {r ? `${r} ★ and above` : 'Any Rating'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Sort Section */}
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortList}>
              {sortOptions.map((opt) => {
                const isSelected = selectedSort === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSelectedSort(opt.id as any)}
                    style={styles.sortItem}
                  >
                    <Text
                      style={[
                        styles.sortText,
                        isSelected && styles.sortTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Check size={18} color="#D48C2B" strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleReset}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={styles.applyBtn}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 24, 22, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '80%',
    ...Shadows.floating,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillSelected: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  pillText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.medium,
    color: '#4B5563',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontFamily: Typography.sans.semiBold,
  },
  sortList: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortText: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  sortTextSelected: {
    fontFamily: Typography.sans.semiBold,
    color: '#D97706',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#4B5563',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    backgroundColor: '#D97706',
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: '#FFFFFF',
  },
});
