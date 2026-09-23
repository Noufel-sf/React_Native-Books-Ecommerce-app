import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LayoutGrid, MessageSquare, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CURRENT_USER } from '@/data/books';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/theme';

export const HomeHeader: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const totalCartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const handleProfilePress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/login' as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: Tangerine Orange Grid Launcher Circle */}
      <Pressable
        onPress={() => {
          Haptics.selectionAsync?.().catch?.(() => {});
          router.push('/(tabs)/explore');
        }}
        style={({ pressed }) => [
          styles.gridButton,
          { transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Explore catalog"
      >
        <LayoutGrid size={18} color="#FFFFFF" strokeWidth={2.4} />
      </Pressable>

      {/* Right: Message/Inbox + Cart + Profile Avatar */}
      <View style={styles.rightActions}>
        {/* Inbox / Notification with Blue Indicator Dot */}
        <Pressable
          onPress={() => {
            Haptics.selectionAsync?.().catch?.(() => {});
          }}
          style={({ pressed }) => [
            styles.iconButton,
            { transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Messages"
        >
          <MessageSquare size={18} color="#18181B" strokeWidth={2} />
          <View style={styles.blueDot} />
        </Pressable>

        {/* User Profile Avatar with Black Outline */}
        <Pressable
          onPress={handleProfilePress}
          style={({ pressed }) => [
            styles.avatarButton,
            { transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Image
            source={{
              uri:
                isAuthenticated && user?.avatarUrl
                  ? user.avatarUrl
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.avatarImage}
            contentFit="cover"
          />
        </Pressable>
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
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  gridButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B4A', // Tangerine Coral from mockup
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  blueDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8', // Cyan dot from mockup
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
