import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Clock, Settings, HelpCircle, LogOut } from 'lucide-react-native';
import { CURRENT_USER } from '@/data/books';
import { Typography, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const menuItems = [
    { icon: <Clock size={18} color="#000000" />, title: 'Order History', subtitle: 'View past orders and shipments' },
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

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: CURRENT_USER.avatarUrl }} style={styles.avatar} contentFit="cover" />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{CURRENT_USER.name}</Text>
              <CheckCircle2 size={16} color="#000000" fill="#2EEC96" style={styles.checkIcon} />
            </View>
            <Text style={styles.email}>{CURRENT_USER.email}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>LUMINA VIP MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
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

        {/* Logout simulation */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <LogOut size={16} color="#000000" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out (Simulated)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 0,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    marginBottom: 20,
    ...Shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
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
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  checkIcon: {
    marginLeft: 6,
  },
  email: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: '#FFDE59',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: '#000000',
    marginTop: 8,
    ...Shadows.sm,
  },
  memberBadgeText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    overflow: 'hidden',
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#000000',
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 0,
    backgroundColor: '#FAF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  menuSubtitle: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 2,
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 0,
    backgroundColor: '#FF6B4A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.button,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
});
