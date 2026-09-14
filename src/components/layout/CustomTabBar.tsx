import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, BookOpen, User, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { Shadows } from '@/constants/theme';

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

  // Bottom padding accounts for iPhone Home Indicator and Android navigation
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#1A1816' : '#9E9488';
    const size = 22;

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} strokeWidth={isFocused ? 2.4 : 1.8} />;
      case 'explore':
        return <Compass size={size} color={color} strokeWidth={isFocused ? 2.4 : 1.8} />;
      case 'cart':
        return <ShoppingBag size={size} color={color} strokeWidth={isFocused ? 2.4 : 1.8} />;
      case 'reading':
        return <BookOpen size={size} color={color} strokeWidth={isFocused ? 2.4 : 1.8} />;
      case 'profile':
        return <User size={size} color={color} strokeWidth={isFocused ? 2.4 : 1.8} />;
      default:
        return <Home size={size} color={color} />;
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
        return 'Reading';
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
          const { options } = descriptors[route.key];
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

          // Elevated Center Button (matching screenshot's gold floating circular action)
          if (isCenterTab) {
            return (
              <View key={route.key} style={styles.centerButtonWrapper}>
                <Pressable
                  onPress={onPress}
                  style={({ pressed }) => [
                    styles.centerButton,
                    { transform: [{ scale: pressed ? 0.94 : 1 }] },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Cart"
                >
                  <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2.4} />
                  {totalCartItems > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <View style={styles.iconContainer}>
                {getTabIcon(route.name, isFocused)}
              </View>
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
    borderTopWidth: 1,
    borderTopColor: '#EFE7DA',
    ...Shadows.floatingBar,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
  },
  tabLabelDefault: {
    color: '#8C8276',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#1A1816',
    fontWeight: '700',
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    top: -12,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D48C2B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B8731F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#E24C38',
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
