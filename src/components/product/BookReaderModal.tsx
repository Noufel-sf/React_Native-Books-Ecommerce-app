import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Bookmark,
  Sliders,
  Type,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getBookSample, BookSample } from '@/data/bookSamples';
import {
  useReadingProgressStore,
  ReaderTheme,
  ReaderFont,
} from '@/store/readingProgressStore';
import { Typography, Shadows } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

interface BookReaderModalProps {
  visible: boolean;
  onClose: () => void;
  bookId: string;
  title: string;
  author: string;
  coverImage?: string;
  onBuyPress?: () => void;
}

const THEME_STYLES: Record<
  ReaderTheme,
  {
    bg: string;
    paper: string;
    text: string;
    subtext: string;
    border: string;
    accent: string;
    quoteBg: string;
    cardBg: string;
    barStyle: 'light-content' | 'dark-content';
  }
> = {
  light: {
    bg: '#FAF5EE',
    paper: '#FFFFFF',
    text: '#111111',
    subtext: '#555555',
    border: '#000000',
    accent: '#FFDE59',
    quoteBg: '#FFF8DB',
    cardBg: '#FFFFFF',
    barStyle: 'dark-content',
  },
  sepia: {
    bg: '#F5EFE0',
    paper: '#EDE3CD',
    text: '#3A2814',
    subtext: '#6A5640',
    border: '#2A1B0D',
    accent: '#DEAB49',
    quoteBg: '#E3D7BA',
    cardBg: '#EFE7D3',
    barStyle: 'dark-content',
  },
  dark: {
    bg: '#121212',
    paper: '#1A1A1A',
    text: '#EDEDED',
    subtext: '#9E9E9E',
    border: '#404040',
    accent: '#2EEC96',
    quoteBg: '#222222',
    cardBg: '#1E1E1E',
    barStyle: 'light-content',
  },
};

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  visible,
  onClose,
  bookId,
  title,
  author,
  coverImage,
  onBuyPress,
}) => {
  const sampleData: BookSample = getBookSample(bookId, title, author);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    theme,
    fontSize,
    fontFamily,
    setTheme,
    setFontSize,
    setFontFamily,
    isBookmarked,
    toggleBookmark,
    updateProgress,
    getProgress,
  } = useReadingProgressStore();

  const showToast = useToastStore((s) => s.showToast);
  const bookmarked = isBookmarked(bookId);
  const savedProgress = getProgress(bookId);
  const activeTheme = THEME_STYLES[theme];

  const currentChapter =
    sampleData.chapters[currentChapterIdx] ?? sampleData.chapters[0];

  useEffect(() => {
    if (visible && savedProgress) {
      setScrollProgress(savedProgress.progressPercent);
      if (
        savedProgress.lastChapterIndex !== undefined &&
        savedProgress.lastChapterIndex < sampleData.chapters.length
      ) {
        setCurrentChapterIdx(savedProgress.lastChapterIndex);
      }
    }
  }, [visible, bookId]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const maxScroll = contentSize.height - layoutMeasurement.height;
    if (maxScroll <= 0) return;

    const progress = Math.min(100, Math.max(0, Math.round((contentOffset.y / maxScroll) * 100)));
    setScrollProgress(progress);

    updateProgress(bookId, {
      progressPercent: progress,
      lastChapterIndex: currentChapterIdx,
    });
  };

  const handleToggleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    const nextState = toggleBookmark(bookId);
    showToast({
      title: nextState ? 'Bookmark Saved! ★' : 'Bookmark Removed',
      message: nextState
        ? `Marked "${currentChapter.chapterTitle}"`
        : 'Removed from reading bookmarks.',
    });
  };

  const handleThemeChange = (newTheme: ReaderTheme) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    setTheme(newTheme);
  };

  const handleFontChange = (newFont: ReaderFont) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    setFontFamily(newFont);
  };

  const handleChapterSelect = (idx: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setCurrentChapterIdx(idx);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    updateProgress(bookId, {
      progressPercent: 0,
      lastChapterIndex: idx,
    });
  };

  const fontStyle =
    fontFamily === 'serif'
      ? { fontFamily: Typography.serif.semiBold }
      : { fontFamily: Typography.sans.medium };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: activeTheme.bg }]}
        edges={['top', 'bottom']}
      >
        <StatusBar
          barStyle={activeTheme.barStyle}
          backgroundColor={activeTheme.bg}
        />

        {/* Top Header Bar */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: activeTheme.paper,
              borderBottomColor: activeTheme.border,
            },
          ]}
        >
          {/* Left: Book & Chapter metadata */}
          <View style={styles.headerLeft}>
            <Text
              style={[styles.headerBookTitle, { color: activeTheme.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: activeTheme.subtext }]}
              numberOfLines={1}
            >
              {currentChapter.chapterTitle}
            </Text>
          </View>

          {/* Right Action Buttons */}
          <View style={styles.headerActions}>
            {/* Progress Badge */}
            <View
              style={[
                styles.progressBadge,
                {
                  backgroundColor: activeTheme.accent,
                  borderColor: activeTheme.border,
                },
              ]}
            >
              <Text style={styles.progressBadgeText}>{scrollProgress}%</Text>
            </View>

            {/* Bookmark Button */}
            <Pressable
              onPress={handleToggleBookmark}
              hitSlop={6}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  borderColor: activeTheme.border,
                  backgroundColor: bookmarked ? activeTheme.accent : activeTheme.paper,
                  transform: [{ translateY: pressed ? 1.5 : 0 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Bookmark chapter"
            >
              <Bookmark
                size={16}
                color={activeTheme.text}
                fill={bookmarked ? activeTheme.text : 'none'}
                strokeWidth={2.5}
              />
            </Pressable>

            {/* Typography / Settings Button */}
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }
                setShowSettings((prev) => !prev);
              }}
              hitSlop={6}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  borderColor: activeTheme.border,
                  backgroundColor: showSettings ? activeTheme.accent : activeTheme.paper,
                  transform: [{ translateY: pressed ? 1.5 : 0 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Reading Settings"
            >
              <Type size={16} color={activeTheme.text} strokeWidth={2.5} />
            </Pressable>

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              hitSlop={6}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  borderColor: activeTheme.border,
                  transform: [{ translateY: pressed ? 1.5 : 0 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close Reader"
            >
              <X size={17} color="#000000" strokeWidth={3} />
            </Pressable>
          </View>
        </View>

        {/* Real-time Progress Bar Line */}
        <View style={[styles.progressTrack, { backgroundColor: activeTheme.paper }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${scrollProgress}%`,
                backgroundColor: activeTheme.accent,
              },
            ]}
          />
        </View>

        {/* Collapsible Neobrutalist Typography Toolbar */}
        {showSettings && (
          <View
            style={[
              styles.settingsPanel,
              {
                backgroundColor: activeTheme.paper,
                borderColor: activeTheme.border,
              },
            ]}
          >
            {/* Theme Selector */}
            <View style={styles.settingsRow}>
              <Text style={[styles.settingsLabel, { color: activeTheme.subtext }]}>
                THEME
              </Text>
              <View style={styles.themeChips}>
                {(['light', 'sepia', 'dark'] as ReaderTheme[]).map((t) => {
                  const isSel = theme === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => handleThemeChange(t)}
                      style={[
                        styles.themeChip,
                        { borderColor: activeTheme.border },
                        t === 'light' && { backgroundColor: '#FAF5EE' },
                        t === 'sepia' && { backgroundColor: '#F5EFE0' },
                        t === 'dark' && { backgroundColor: '#1A1A1A' },
                        isSel && styles.themeChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.themeChipText,
                          {
                            color: t === 'dark' ? '#FFFFFF' : '#000000',
                            fontFamily: isSel ? Typography.sans.bold : Typography.sans.medium,
                          },
                        ]}
                      >
                        {t.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Font Family & Size Controls */}
            <View style={styles.settingsRow}>
              <Text style={[styles.settingsLabel, { color: activeTheme.subtext }]}>
                TYPE
              </Text>
              <View style={styles.fontFamilyRow}>
                <Pressable
                  onPress={() => handleFontChange('serif')}
                  style={[
                    styles.fontFamilyBtn,
                    { borderColor: activeTheme.border },
                    fontFamily === 'serif' && { backgroundColor: activeTheme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.fontFamilyText,
                      {
                        color: activeTheme.text,
                        fontFamily: Typography.serif.bold,
                      },
                    ]}
                  >
                    Serif
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleFontChange('sans')}
                  style={[
                    styles.fontFamilyBtn,
                    { borderColor: activeTheme.border },
                    fontFamily === 'sans' && { backgroundColor: activeTheme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.fontFamilyText,
                      {
                        color: activeTheme.text,
                        fontFamily: Typography.sans.bold,
                      },
                    ]}
                  >
                    Sans
                  </Text>
                </Pressable>
              </View>

              {/* Font Size Stepper */}
              <View style={[styles.sizeStepper, { borderColor: activeTheme.border }]}>
                <Pressable
                  onPress={() => setFontSize(fontSize - 1)}
                  disabled={fontSize <= 13}
                  hitSlop={4}
                  style={styles.sizeBtn}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      { color: fontSize <= 13 ? activeTheme.subtext : activeTheme.text },
                    ]}
                  >
                    A-
                  </Text>
                </Pressable>
                <Text style={[styles.sizeValue, { color: activeTheme.text }]}>
                  {fontSize}px
                </Text>
                <Pressable
                  onPress={() => setFontSize(fontSize + 1)}
                  disabled={fontSize >= 24}
                  hitSlop={4}
                  style={styles.sizeBtn}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      { color: fontSize >= 24 ? activeTheme.subtext : activeTheme.text },
                    ]}
                  >
                    A+
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Chapter Tabs Bar (if multiple chapters) */}
        {sampleData.chapters.length > 1 && (
          <View
            style={[
              styles.chapterTabsBar,
              {
                backgroundColor: activeTheme.bg,
                borderBottomColor: activeTheme.border,
              },
            ]}
          >
            {sampleData.chapters.map((ch, idx) => {
              const isSelected = idx === currentChapterIdx;
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleChapterSelect(idx)}
                  style={[
                    styles.chapterTabChip,
                    {
                      borderColor: activeTheme.border,
                      backgroundColor: isSelected ? activeTheme.accent : activeTheme.paper,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chapterTabChipText,
                      {
                        color: activeTheme.text,
                        fontFamily: isSelected
                          ? Typography.sans.bold
                          : Typography.sans.medium,
                      },
                    ]}
                  >
                    Ch. {ch.chapterNumber}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Scrollable Reading Content */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Chapter Header Banner */}
          <View style={styles.chapterHeader}>
            <View
              style={[
                styles.chapterTag,
                {
                  backgroundColor: activeTheme.accent,
                  borderColor: activeTheme.border,
                },
              ]}
            >
              <Text style={styles.chapterTagText}>
                CHAPTER {currentChapter.chapterNumber} OF {sampleData.chapters.length}
              </Text>
            </View>

            <Text
              style={[
                styles.chapterTitleText,
                { color: activeTheme.text },
                fontFamily === 'serif'
                  ? { fontFamily: Typography.serif.bold }
                  : { fontFamily: Typography.sans.bold },
              ]}
            >
              {currentChapter.chapterTitle}
            </Text>

            {currentChapter.subtitle && (
              <Text
                style={[
                  styles.chapterSubtitleText,
                  { color: activeTheme.subtext },
                ]}
              >
                {currentChapter.subtitle}
              </Text>
            )}

            {/* Author Credit Stamp */}
            <View style={styles.authorStamp}>
              <Text
                style={[
                  styles.authorStampText,
                  { color: activeTheme.subtext },
                ]}
              >
                EXCERPT BY {author.toUpperCase()} • DIGITAL SAMPLE EDITION
              </Text>
            </View>
          </View>

          {/* Quotation Highlight Card */}
          {currentChapter.quote && (
            <View
              style={[
                styles.quoteCard,
                {
                  backgroundColor: activeTheme.quoteBg,
                  borderColor: activeTheme.border,
                  borderLeftColor: activeTheme.accent,
                },
              ]}
            >
              <Sparkles size={16} color={activeTheme.text} strokeWidth={2.5} />
              <Text
                style={[
                  styles.quoteText,
                  {
                    color: activeTheme.text,
                    fontSize: fontSize,
                    fontStyle: 'italic',
                  },
                  fontStyle,
                ]}
              >
                "{currentChapter.quote.text}"
              </Text>
              <Text
                style={[
                  styles.quoteAuthor,
                  { color: activeTheme.subtext },
                ]}
              >
                — {currentChapter.quote.author}
              </Text>
            </View>
          )}

          {/* Body Paragraphs */}
          <View style={styles.paragraphsWrapper}>
            {currentChapter.paragraphs.map((p, idx) => (
              <Text
                key={idx}
                style={[
                  styles.paragraph,
                  {
                    color: activeTheme.text,
                    fontSize: fontSize,
                    lineHeight: Math.round(fontSize * 1.65),
                  },
                  fontStyle,
                ]}
              >
                {p}
              </Text>
            ))}
          </View>

          {/* End of Excerpt / Call to Action Box */}
          <View
            style={[
              styles.endCard,
              {
                backgroundColor: activeTheme.paper,
                borderColor: activeTheme.border,
              },
            ]}
          >
            <View
              style={[
                styles.endBadge,
                {
                  backgroundColor: activeTheme.accent,
                  borderColor: activeTheme.border,
                },
              ]}
            >
              <Text style={styles.endBadgeText}>END OF SAMPLE PREVIEW</Text>
            </View>

            <Text
              style={[
                styles.endTitle,
                { color: activeTheme.text },
              ]}
            >
              Enjoying this book?
            </Text>
            <Text
              style={[
                styles.endDescription,
                { color: activeTheme.subtext },
              ]}
            >
              Unlock the complete edition with full audiobook narration, unlimited offline bookmarks, and high-res diagrams.
            </Text>

            {/* Action Row */}
            <View style={styles.endActionRow}>
              {currentChapterIdx < sampleData.chapters.length - 1 ? (
                <Pressable
                  onPress={() => handleChapterSelect(currentChapterIdx + 1)}
                  style={({ pressed }) => [
                    styles.nextChapterBtn,
                    {
                      borderColor: activeTheme.border,
                      backgroundColor: activeTheme.paper,
                      transform: [{ translateY: pressed ? 2 : 0 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.nextChapterBtnText,
                      { color: activeTheme.text },
                    ]}
                  >
                    NEXT CHAPTER
                  </Text>
                  <ChevronRight size={16} color={activeTheme.text} strokeWidth={2.5} />
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => {
                  onClose();
                  if (onBuyPress) onBuyPress();
                }}
                style={({ pressed }) => [
                  styles.buySampleBtn,
                  {
                    borderColor: activeTheme.border,
                    backgroundColor: '#FFDE59',
                    transform: [{ translateY: pressed ? 2 : 0 }],
                  },
                ]}
              >
                <ShoppingBag size={16} color="#000000" strokeWidth={2.5} />
                <Text style={styles.buySampleBtnText}>GET FULL BOOK</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2.5,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  headerBookTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
    borderWidth: 2,
    ...Shadows.sm,
  },
  progressBadgeText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 0,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 0,
    borderWidth: 2,
    backgroundColor: '#FF6B4A',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  progressTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  settingsPanel: {
    borderBottomWidth: 2.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    ...Shadows.card,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    letterSpacing: 0.5,
    width: 50,
  },
  themeChips: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  themeChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 2,
  },
  themeChipSelected: {
    borderWidth: 2.5,
    ...Shadows.sm,
  },
  themeChipText: {
    fontSize: 11,
  },
  fontFamilyRow: {
    flexDirection: 'row',
    gap: 6,
  },
  fontFamilyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 0,
    borderWidth: 2,
  },
  fontFamilyText: {
    fontSize: 12,
  },
  sizeStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 0,
  },
  sizeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sizeBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
  sizeValue: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    paddingHorizontal: 4,
  },
  chapterTabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 2,
  },
  chapterTabChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 0,
    borderWidth: 2,
    ...Shadows.sm,
  },
  chapterTabChipText: {
    fontSize: 11,
  },
  scrollContainer: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 60,
  },
  chapterHeader: {
    marginBottom: 24,
  },
  chapterTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderRadius: 0,
    marginBottom: 10,
    ...Shadows.sm,
  },
  chapterTagText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  chapterTitleText: {
    fontSize: 26,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  chapterSubtitleText: {
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    lineHeight: 20,
    marginBottom: 12,
  },
  authorStamp: {
    borderTopWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingTop: 8,
    marginTop: 4,
  },
  authorStampText: {
    fontSize: 9,
    fontFamily: Typography.sans.bold,
    letterSpacing: 0.8,
  },
  quoteCard: {
    borderWidth: 2,
    borderLeftWidth: 5,
    borderRadius: 0,
    padding: 16,
    marginBottom: 24,
    gap: 10,
    ...Shadows.card,
  },
  quoteText: {
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    textAlign: 'right',
  },
  paragraphsWrapper: {
    gap: 18,
  },
  paragraph: {
    letterSpacing: 0.2,
  },
  endCard: {
    marginTop: 40,
    borderWidth: 2.5,
    borderRadius: 0,
    padding: 20,
    alignItems: 'center',
    ...Shadows.card,
  },
  endBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderRadius: 0,
    marginBottom: 12,
    ...Shadows.sm,
  },
  endBadgeText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  endTitle: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    marginBottom: 6,
  },
  endDescription: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  endActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  nextChapterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 0,
    borderWidth: 2,
    gap: 6,
    ...Shadows.button,
  },
  nextChapterBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
  },
  buySampleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 0,
    borderWidth: 2.5,
    gap: 6,
    ...Shadows.button,
  },
  buySampleBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
});
