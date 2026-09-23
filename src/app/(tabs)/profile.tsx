import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  CreditCard,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useOrdersStore } from '@/store/ordersStore';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrdersStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSignOut = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium).catch?.(() => {});
    }
    logout();
    router.push('/login' as any);
  };

  const handleMenuPress = (route?: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    if (route) {
      router.push(route as any);
    }
  };

  const menuItems = [
    {
      icon: <Clock size={18} color="#18181B" strokeWidth={2.2} />,
      bg: '#38BDF8', // Cyan Blue
      title: 'Order History',
      subtitle: orders.length > 0 ? `${orders.length} orders placed` : 'View past orders and shipments',
      route: '/orders',
    },
    {
      icon: <MapPin size={18} color="#18181B" strokeWidth={2.2} />,
      bg: '#FF6B4A', // Tangerine
      title: 'Delivery Addresses',
      subtitle: '2 saved addresses',
    },
    {
      icon: <CreditCard size={18} color="#18181B" strokeWidth={2.2} />,
      bg: '#FFD027', // Cyber Yellow
      title: 'Payment Methods',
      subtitle: 'Apple Pay & saved cards',
    },
    {
      icon: <Settings size={18} color="#18181B" strokeWidth={2.2} />,
      bg: '#A7F3D0', // Mint
      title: 'Preferences',
      subtitle: 'Reader theme, notifications & sync',
    },
    {
      icon: <HelpCircle size={18} color="#18181B" strokeWidth={2.2} />,
      bg: '#E9D5FF', // Lavender
      title: 'Help & Concierge',
      subtitle: 'Editorial assistance & inquiries',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.contentWrapper,
            { paddingTop: Math.max(insets.top + 8, Platform.OS === 'web' ? 28 : 16) },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Account</Text>
          </View>

          {/* Profile Card / Guest Card */}
          {isAuthenticated && user ? (
            <View style={styles.profileCard}>
              <View style={styles.profileHeaderRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri:
                        user.avatarUrl ??
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                    }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.verifiedDot}>
                    <CheckCircle2 size={13} color="#FFFFFF" fill="#18181B" />
                  </View>
                </View>

                <View style={styles.profileInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{user.name}</Text>
                  </View>
                  <Text style={styles.email}>{user.email}</Text>
                  <View style={styles.memberBadge}>
                    <Award size={11} color="#18181B" strokeWidth={2.4} />
                    <Text style={styles.memberBadgeText}>VIP MEMBER</Text>
                  </View>
                </View>
              </View>

              {/* Neo-Pop Quick Stats Capsule */}
              <View style={styles.profileStatsRow}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatNum}>12</Text>
                  <Text style={styles.profileStatTitle}>Books Read</Text>
                </View>
                <View style={styles.profileStatDiv} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatNum}>5-Day</Text>
                  <Text style={styles.profileStatTitle}>Streak 🔥</Text>
                </View>
                <View style={styles.profileStatDiv} />
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatNum}>15% Off</Text>
                  <Text style={styles.profileStatTitle}>VIP Perks</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.guestCard}>
              <View style={styles.guestBadge}>
                <Sparkles size={12} color="#18181B" />
                <Text style={styles.guestBadgeText}>GUEST MODE</Text>
              </View>
              <Text style={styles.guestTitle}>Sign in to your account</Text>
              <Text style={styles.guestSubtitle}>
                Sync your library across devices, track real orders, and leave verified reviews.
              </Text>
              <Pressable
                onPress={() => router.push('/login' as any)}
                style={({ pressed }) => [
                  styles.guestLoginBtn,
                  { transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <LogIn size={15} color="#18181B" strokeWidth={2.5} />
                <Text style={styles.guestLoginBtnText}>Sign In / Register</Text>
              </Pressable>
            </View>
          )}

          {/* Menu Items with Pop Color Outlined Circles */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleMenuPress(item.route)}
                style={({ pressed }) => [
                  styles.menuItem,
                  index === menuItems.length - 1 && { borderBottomWidth: 0 },
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View style={[styles.menuIconWrapper, { backgroundColor: item.bg }]}>
                  {item.icon}
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={18} color="#18181B" strokeWidth={2.2} />
              </Pressable>
            ))}
          </View>

          {/* Sign Out / Sign In Button */}
          {isAuthenticated ? (
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.logoutBtn,
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <LogOut size={16} color="#18181B" strokeWidth={2.2} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/login' as any)}
              style={({ pressed }) => [
                styles.logoutBtn,
                styles.loginAltBtn,
                { transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
            >
              <LogIn size={16} color="#18181B" strokeWidth={2.2} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Sign In</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 110,
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  header: {
    paddingHorizontal: 4,
    paddingBottom: 14,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.4,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.8,
    borderColor: '#18181B',
    marginBottom: 16,
    width: '100%',
    ...Shadows.popSm,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatNum: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  profileStatTitle: {
    fontSize: 10.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 1,
  },
  profileStatDiv: {
    width: 1.5,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  email: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderWidth: 1.5,
    borderColor: '#18181B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberBadgeText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.3,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.8,
    borderColor: '#18181B',
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    ...Shadows.popSm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3F4F6',
  },
  menuIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  menuSubtitle: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  logoutBtn: {
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.8,
    borderColor: '#18181B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...Shadows.popSm,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  loginAltBtn: {
    backgroundColor: '#FFD027',
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.8,
    borderColor: '#18181B',
    marginBottom: 16,
    width: '100%',
    ...Shadows.popSm,
  },
  guestBadge: {
    backgroundColor: '#FFD027',
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  guestBadgeText: {
    fontSize: 9.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  guestTitle: {
    fontSize: 16.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 14,
  },
  guestLoginBtn: {
    backgroundColor: '#FFD027',
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  guestLoginBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
});
