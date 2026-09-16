import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={36} color="#000000" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Explore our catalog and find your next favorite read.</Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={({ pressed }) => [styles.exploreBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.exploreBtnText}>Browse Books</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image source={{ uri: item.book.coverImage }} style={styles.thumbnail} contentFit="cover" />
                <View style={styles.cardDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.book.title}</Text>
                  <Text style={styles.itemFormat}>{item.format} • by {item.book.author}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => removeItem(item.id)}
                    style={({ pressed }) => [styles.deleteIconBtn, { opacity: pressed ? 0.6 : 1 }]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remove item"
                  >
                    <Trash2 size={16} color="#000000" strokeWidth={2.2} />
                  </Pressable>
                  <View style={styles.qtyControls}>
                    <Pressable
                      onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      style={styles.qtyBtn}
                    >
                      <Minus size={13} color="#000000" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={13} color="#000000" strokeWidth={2.5} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          {/* Pricing summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Delivery</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/checkout' as any)}
              style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12.5,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  thumbnail: {
    width: 52,
    height: 72,
    borderRadius: BorderRadius.xs,
    backgroundColor: '#F3F4F6',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13.5,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
  itemFormat: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
    marginTop: 5,
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  deleteIconBtn: {
    padding: 3,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: 20,
    paddingBottom: 100,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 15.5,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Shadows.button,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: BorderRadius.full,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
});
