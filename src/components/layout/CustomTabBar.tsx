import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, BookMarked, User, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { Colors, Typography } from '@/constants/theme';

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

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8);

  const getTabDetails = (routeName: string, isFocused: boolean) => {
    const activeColor = Colors.primary; // #D97706
    const inactiveColor = '#9CA3AF';
    const color = isFocused ? activeColor : inactiveColor;
    const size = 22;
    const strokeWidth = isFocused ? 2.4 : 1.8;

    switch (routeName) {
      case 'index':
        return {
          label: 'Home',
          icon: <Home size={size} color={color} strokeWidth={strokeWidth} fill={isFocused ? activeColor : 'none'} />,
        };
      case 'explore':
        return {
          label: 'Search',
          icon: <Search size={size} color={color} strokeWidth={strokeWidth} />,
        };
      case 'reading':
        return {
          label: 'Library',
          icon: <BookMarked size={size} color={color} strokeWidth={strokeWidth} fill={isFocused ? activeColor : 'none'} />,
        };
      case 'cart':
        return {
          label: 'Cart',
          icon: <ShoppingBag size={size} color={color} strokeWidth={strokeWidth} fill={isFocused ? activeColor : 'none'} />,
        };
      case 'profile':
        return {
          label: 'Account',
          icon: <User size={size} color={color} strokeWidth={strokeWidth} fill={isFocused ? activeColor : 'none'} />,
        };
      default:
        return {
          label: routeName,
          icon: <Home size={size} color={color} strokeWidth={strokeWidth} />,
        };
    }
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomPadding }]}>
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

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

          const { label, icon } = getTabDetails(route.name, isFocused);

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              <View style={styles.iconWrapper}>
                {icon}
                {route.name === 'cart' && totalCartItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {totalCartItems > 99 ? '99+' : totalCartItems}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrapper: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    fontFamily: Typography.sans.bold,
    color: Colors.primary, // Golden amber #D97706
  },
  tabLabelInactive: {
    fontFamily: Typography.sans.medium,
    color: '#9CA3AF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: Typography.sans.bold,
  },
});
