import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, BookOpen, User, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Shadows, Typography } from '@/constants/theme';

export type CustomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

interface TabButtonProps {
  route: { key: string; name: string };
  isFocused: boolean;
  onPress: () => void;
  getTabIcon: (routeName: string, isFocused: boolean) => React.ReactNode;
  getTabLabel: (routeName: string) => string;
  badgeCount?: number;
}

const AnimatedTabButton: React.FC<TabButtonProps> = ({
  route,
  isFocused,
  onPress,
  getTabIcon,
  getTabLabel,
  badgeCount,
}) => {
  const scale = useSharedValue(isFocused ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.9, {
      damping: 12,
      stiffness: 220,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        {
          transform: [
            { translateX: pressed ? 1.5 : 0 },
            { translateY: pressed ? 1.5 : 0 },
          ],
        },
      ]}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={getTabLabel(route.name)}
    >
      <Animated.View
        style={[
          styles.iconBox,
          isFocused ? styles.iconBoxFocused : styles.iconBoxDefault,
          animatedStyle,
        ]}
      >
        {getTabIcon(route.name, isFocused)}
        {!!badgeCount && badgeCount > 0 && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.tabLabelFocused : styles.tabLabelDefault,
        ]}
      >
        {getTabLabel(route.name)}
      </Text>
    </Pressable>
  );
};

const AnimatedCartButton: React.FC<{
  onPress: () => void;
  isFocused: boolean;
  totalCartItems: number;
}> = ({ onPress, isFocused, totalCartItems }) => {
  const scale = useSharedValue(isFocused ? 1.06 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.06 : 1, {
      damping: 12,
      stiffness: 200,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.centerButtonWrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.centerButton,
          isFocused && styles.centerButtonActive,
          {
            transform: [
              { translateX: pressed ? 2 : 0 },
              { translateY: pressed ? 2 : 0 },
            ],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Cart"
      >
        <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
          <ShoppingBag size={24} color="#000000" strokeWidth={isFocused ? 3 : 2.5} />
        </Animated.View>
        {totalCartItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const totalCartItems = useCartStore((s) => s.getTotalItems());
  const favoritesCount = useFavoritesStore((s) => s.favorites.length);

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#000000' : '#777777';
    const size = 20;

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} strokeWidth={isFocused ? 2.8 : 2} />;
      case 'explore':
        return <Compass size={size} color={color} strokeWidth={isFocused ? 2.8 : 2} />;
      case 'cart':
        return <ShoppingBag size={size} color={color} strokeWidth={isFocused ? 2.8 : 2} />;
      case 'reading':
        return <BookOpen size={size} color={color} strokeWidth={isFocused ? 2.8 : 2} />;
      case 'profile':
        return <User size={size} color={color} strokeWidth={isFocused ? 2.8 : 2} />;
      default:
        return <Home size={size} color={color} strokeWidth={2} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'explore':
        return 'Explore';
      case 'cart':
        return 'Cart';
      case 'reading':
        return 'Library';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenterTab = route.name === 'cart';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenterTab) {
            return (
              <AnimatedCartButton
                key={route.key}
                onPress={onPress}
                isFocused={isFocused}
                totalCartItems={totalCartItems}
              />
            );
          }

          return (
            <AnimatedTabButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              getTabIcon={getTabIcon}
              getTabLabel={getTabLabel}
              badgeCount={route.name === 'reading' ? favoritesCount : undefined}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 3,
    borderTopColor: '#000000',
    ...Shadows.floatingBar,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 62,
    paddingHorizontal: 6,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconBox: {
    width: 44,
    height: 34,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxFocused: {
    backgroundColor: '#FFDE59',
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.sm,
  },
  iconBoxDefault: {
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: Typography.sans.bold,
  },
  tabLabelDefault: {
    color: '#777777',
  },
  tabLabelFocused: {
    color: '#000000',
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    ...Shadows.button,
  },
  centerButtonActive: {
    borderWidth: 3.5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#2EEC96',
    borderRadius: 0,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  cartBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontFamily: Typography.sans.bold,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B4A',
    borderRadius: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: Typography.sans.bold,
  },
});
