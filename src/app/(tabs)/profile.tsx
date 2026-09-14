import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Clock, Settings, HelpCircle, LogOut } from 'lucide-react-native';
import { CURRENT_USER } from '@/data/books';
import { Typography } from '@/constants/theme';

export default function ProfileScreen() {
  const menuItems = [
    { icon: <Clock size={20} color="#8C8276" />, title: 'Order History', subtitle: 'View past orders and shipments' },
    { icon: <MapPin size={20} color="#8C8276" />, title: 'Delivery Addresses', subtitle: '2 saved addresses' },
    { icon: <CreditCard size={20} color="#8C8276" />, title: 'Payment Methods', subtitle: 'Saved mock cards' },
    { icon: <Settings size={20} color="#8C8276" />, title: 'Preferences', subtitle: 'Theme, notifications & font size' },
    { icon: <HelpCircle size={20} color="#8C8276" />, title: 'Help & FAQ', subtitle: 'Editorial assistance & returns' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />
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
              <CheckCircle2 size={16} color="#1D9BF0" fill="#1D9BF0" style={styles.checkIcon} />
            </View>
            <Text style={styles.email}>{CURRENT_USER.email}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>Lumina VIP Member</Text>
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
              <ChevronRight size={16} color="#B4ACA1" />
            </Pressable>
          ))}
        </View>

        {/* Logout simulation */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.75 : 1 }]}
        >
          <LogOut size={16} color="#C94A3D" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out (Simulated)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F5EE',
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
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
    letterSpacing: -0.5,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE5D8',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E8DFC9',
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
    fontFamily: Typography.serif.bold,
    color: '#1A1816',
  },
  checkIcon: {
    marginLeft: 4,
  },
  email: {
    fontSize: 12,
    color: '#8C8276',
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: '#FAF1E3',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    marginTop: 8,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A86C1D',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECE5D8',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F0E8',
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1816',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#8C8276',
    marginTop: 2,
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FDF0EF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F9DCDA',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C94A3D',
  },
});
