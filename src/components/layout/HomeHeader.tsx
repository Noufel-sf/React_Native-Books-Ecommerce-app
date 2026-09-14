import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Heart, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { CURRENT_USER } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Shadows, Typography } from '@/constants/theme';

export const HomeHeader: React.FC = () => {
  const router = useRouter();
  const { favorites } = useFavoritesStore();

  return (
    <View style={styles.container}>
      {/* User Avatar and Info */}
      <View style={styles.userSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: CURRENT_USER.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{CURRENT_USER.name}</Text>
            {CURRENT_USER.isVerified && (
              <CheckCircle2 size={15} color="#000000" fill="#2EEC96" style={styles.checkIcon} />
            )}
          </View>
          <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>
        </View>
      </View>

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
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
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
