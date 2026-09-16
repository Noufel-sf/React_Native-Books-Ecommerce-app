import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Clock, Settings, HelpCircle, LogOut, LogIn, Sparkles } from 'lucide-react-native';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useOrdersStore } from '@/store/ordersStore';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { orders } = useOrdersStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    router.push('/login' as any);
  };

  const menuItems = [
    {
      icon: <Clock size={18} color="#000000" />,
      title: 'Order History',
      subtitle: orders.length > 0 ? `${orders.length} orders placed` : 'View past orders and shipments',
      route: '/orders',
    },
    { icon: <MapPin size={18} color="#000000" />, title: 'Delivery Addresses', subtitle: '2 saved addresses' },
    { icon: <CreditCard size={18} color="#000000" />, title: 'Payment Methods', subtitle: 'Saved mock cards' },
    { icon: <Settings size={18} color="#000000" />, title: 'Preferences', subtitle: 'Theme, notifications & font size' },
    { icon: <HelpCircle size={18} color="#000000" />, title: 'Help & FAQ', subtitle: 'Editorial assistance & returns' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF5EE" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Account</Text>
        </View>

        {/* Profile Card / Guest Card */}
        {isAuthenticated && user ? (
          <View style={styles.profileCard}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} contentFit="cover" />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.name}</Text>
                <CheckCircle2 size={16} color="#000000" fill="#2EEC96" style={styles.checkIcon} />
              </View>
              <Text style={styles.email}>{user.email}</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>LUMINA VIP MEMBER</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestBadge}>
              <Sparkles size={12} color="#000000" />
              <Text style={styles.guestBadgeText}>GUEST MODE</Text>
            </View>
            <Text style={styles.guestTitle}>Sign in to your account</Text>
            <Text style={styles.guestSubtitle}>
              Sync your library, track real shipments, and leave verified book reviews.
            </Text>
            <Pressable
              onPress={() => router.push('/login' as any)}
              style={({ pressed }) => [
                styles.guestLoginBtn,
                {
                  transform: [
                    { translateX: pressed ? 2 : 0 },
                    { translateY: pressed ? 2 : 0 },
                  ],
                },
              ]}
            >
              <LogIn size={15} color="#000000" strokeWidth={2.5} />
              <Text style={styles.guestLoginBtnText}>SIGN IN / REGISTER</Text>
            </Pressable>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                if ('route' in item && item.route) {
                  router.push(item.route as any);
                }
              }}
              style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={styles.menuIconWrapper}>{item.icon}</View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={16} color="#000000" />
            </Pressable>
          ))}
        </View>

        {/* Sign Out / Sign In Button */}
        {isAuthenticated ? (
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.logoutBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
          >
            <LogOut size={16} color="#000000" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push('/login' as any)}
            style={({ pressed }) => [
              styles.logoutBtn,
              styles.loginAltBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
          >
            <LogIn size={16} color="#000000" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Sign In</Text>
          </Pressable>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.4,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: BorderRadius.xl,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
    ...Shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  checkIcon: {
    marginLeft: 6,
  },
  email: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  memberBadgeText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
  menuSubtitle: {
    fontSize: 11.5,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#EF4444',
  },
  loginAltBtn: {
    backgroundColor: Colors.primary,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
    ...Shadows.card,
  },
  guestBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  guestBadgeText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  guestTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 14,
  },
  guestLoginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  guestLoginBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
  },
});
