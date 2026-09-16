import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ShoppingBag, Bell, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { CURRENT_USER } from '@/data/books';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, BorderRadius } from '@/constants/theme';

export const HomeHeader: React.FC = () => {
  const router = useRouter();
  const totalCartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { user, isAuthenticated } = useAuthStore();

  const handleUserPress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/login' as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: User Avatar & Welcome */}
      <Pressable onPress={handleUserPress} style={styles.userSection}>
        <View style={styles.avatarWrapper}>
          {isAuthenticated && user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.guestAvatar}>
              <User size={18} color="#6B7280" strokeWidth={2} />
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greetingText}>Good Day,</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {isAuthenticated && user ? user.name : 'Book Lover'}
          </Text>
        </View>
      </Pressable>

      {/* Right: Cart & Notifications */}
      <View style={styles.actions}>
        <IconButton
          icon={<ShoppingBag size={17} color={Colors.text.primary} strokeWidth={2} />}
          badgeCount={totalCartCount}
          onPress={() => router.push('/(tabs)/cart' as any)}
          accessibilityLabel="Shopping Cart"
          backgroundColor="#F3F4F6"
        />
        <IconButton
          icon={<Bell size={17} color={Colors.text.primary} strokeWidth={2} />}
          badgeCount={CURRENT_USER.unreadNotifications}
          onPress={() => {}}
          accessibilityLabel="Notifications"
          backgroundColor="#F3F4F6"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  guestAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  userInfo: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
  },
  userName: {
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
