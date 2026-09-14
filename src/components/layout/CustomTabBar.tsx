import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, BookOpen, User, ShoppingBag } from 'lucide-react-native';
import { useCartStore } from '@/store/cartStore';
import { Shadows, Typography } from '@/constants/theme';

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

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8);

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#000000' : '#888888';
    const size = 22;

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

          // Elevated Center Button in Neobrutalist Yellow
          if (isCenterTab) {
            return (
              <View key={route.key} style={styles.centerButtonWrapper}>
                <Pressable
                  onPress={onPress}
                  style={({ pressed }) => [
                    styles.centerButton,
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
                  <ShoppingBag size={24} color="#000000" strokeWidth={2.5} />
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
    borderTopWidth: 3,
    borderTopColor: '#000000',
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
    fontFamily: Typography.sans.bold,
  },
  tabLabelDefault: {
    color: '#888888',
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
    borderRadius: 16,
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    ...Shadows.button,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#2EEC96',
    borderRadius: 9999,
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
});
