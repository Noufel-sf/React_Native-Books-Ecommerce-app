import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Home, Compass, BookMarked, User, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';

export type CustomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const totalCartItems = useCartStore((s) => s.getTotalItems());

  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 12);

  const getTabDetails = (routeName: string, isFocused: boolean) => {
    const activeColor = '#18181B'; // Black inside yellow pill
    const inactiveColor = '#FFFFFF'; // White icons on orange bar
    const color = isFocused ? activeColor : inactiveColor;
    const size = 19;
    const strokeWidth = 2.4;

    switch (routeName) {
      case 'index':
        return {
          label: 'Home',
          icon: <Home size={size} color={color} strokeWidth={strokeWidth} />,
        };
      case 'explore':
        return {
          label: 'Explore',
          icon: <Compass size={size} color={color} strokeWidth={strokeWidth} />,
        };
      case 'reading':
        return {
          label: 'Library',
          icon: <BookMarked size={size} color={color} strokeWidth={strokeWidth} />,
        };
      case 'cart':
        return {
          label: 'Cart',
          icon: <ShoppingBag size={size} color={color} strokeWidth={strokeWidth} />,
        };
      case 'profile':
        return {
          label: 'Account',
          icon: <User size={size} color={color} strokeWidth={strokeWidth} />,
        };
      default:
        return {
          label: routeName,
          icon: <Home size={size} color={color} strokeWidth={strokeWidth} />,
        };
    }
  };

  return (
    <View style={[styles.floatingWrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      {/* Tangerine Coral Pill Bar with Solid Black Border */}
      <View style={styles.dockBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const { label, icon } = getTabDetails(route.name, isFocused);

          if (isFocused) {
            // Cyber Yellow Active Capsule Pill
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.activePill,
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: true }}
                accessibilityLabel={label}
              >
                {icon}
                <Text style={styles.activePillText}>{label}</Text>
              </Pressable>
            );
          }

          // Inactive Minimalist White Icon
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.inactiveTab,
                { transform: [{ scale: pressed ? 0.92 : 1 }] },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: false }}
              accessibilityLabel={label}
            >
              <View style={styles.iconContainer}>
                {icon}
                {route.name === 'cart' && totalCartItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {totalCartItems > 99 ? '99+' : totalCartItems}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF6B4A', // Tangerine Orange from mockup
    borderRadius: BorderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1.8,
    borderColor: '#18181B',
    ...Shadows.popSm,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD027', // Cyber Sunshine Yellow from mockup
    borderRadius: BorderRadius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.8,
    borderColor: '#18181B',
    gap: 6,
  },
  activePillText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  inactiveTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#18181B',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: Typography.sans.bold,
  },
});
