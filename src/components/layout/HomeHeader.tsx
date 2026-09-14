import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Heart, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { CURRENT_USER } from '@/data/books';
import { useFavoritesStore } from '@/store/favoritesStore';

export const HomeHeader: React.FC = () => {
  const router = useRouter();
  const { favorites } = useFavoritesStore();

  return (
    <View style={styles.container}>
      {/* User Avatar and Info */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: CURRENT_USER.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{CURRENT_USER.name}</Text>
            {CURRENT_USER.isVerified && (
              <CheckCircle2 size={14} color="#1D9BF0" fill="#1D9BF0" style={styles.checkIcon} />
            )}
          </View>
          <Text style={styles.userEmail}>{CURRENT_USER.email}</Text>
        </View>
      </View>

      {/* Action Buttons: Wishlist & Notifications */}
      <View style={styles.actions}>
        <IconButton
          icon={<Heart size={18} color="#2A221B" />}
          badgeCount={favorites.length}
          onPress={() => router.push('/(tabs)/reading')}
          accessibilityLabel="Saved books"
          style={styles.actionButton}
        />
        <IconButton
          icon={<Bell size={18} color="#2A221B" />}
          badgeCount={CURRENT_USER.unreadNotifications}
          onPress={() => {}}
          accessibilityLabel="Notifications"
          style={styles.actionButton}
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
    paddingBottom: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E8DFD0',
    backgroundColor: '#EDE5D6',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1816',
  },
  checkIcon: {
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#8C8276',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#ECE4D7',
  },
});
