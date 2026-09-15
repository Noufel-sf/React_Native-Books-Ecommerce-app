import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Heart, Bell, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { CURRENT_USER } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useAuthStore } from '@/store/authStore';
import { Shadows, Typography } from '@/constants/theme';
import { Pressable } from 'react-native';

export const HomeHeader: React.FC = () => {
  const router = useRouter();
  const { favorites } = useFavoritesStore();
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
      {/* User Avatar and Info */}
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
              <User size={18} color="#000000" strokeWidth={2.5} />
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {isAuthenticated && user ? user.name : 'Guest Reader'}
            </Text>
            {isAuthenticated && user?.isVerified && (
              <CheckCircle2 size={15} color="#000000" fill="#2EEC96" style={styles.checkIcon} />
            )}
          </View>
          <Text style={styles.userEmail}>
            {isAuthenticated && user ? user.email : 'Tap to sign in'}
          </Text>
        </View>
      </Pressable>

      {/* Action Buttons: Wishlist & Notifications */}
      <View style={styles.actions}>
        <IconButton
          icon={<Heart size={18} color="#000000" strokeWidth={2.5} />}
          badgeCount={favorites.length}
          onPress={() => router.push('/(tabs)/reading')}
          accessibilityLabel="Saved books"
          backgroundColor="#FFFFFF"
        />
        <IconButton
          icon={<Bell size={18} color="#000000" strokeWidth={2.5} />}
          badgeCount={CURRENT_USER.unreadNotifications}
          onPress={() => {}}
          accessibilityLabel="Notifications"
          backgroundColor="#FFDE59"
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
    paddingTop: 8,
    paddingBottom: 14,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  guestAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.3,
  },
  checkIcon: {
    marginLeft: 5,
  },
  userEmail: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
