import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Typography, Shadows } from '@/constants/theme';

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
    backgroundColor: '#FAF5EE',
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
  subtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#555555',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  thumbnail: {
    width: 55,
    height: 75,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#ECE5D8',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  itemFormat: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#FF6B4A',
    marginTop: 6,
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 75,
  },
  deleteIconBtn: {
    padding: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#000000',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 20,
    paddingBottom: 100,
    borderTopWidth: 3,
    borderColor: '#000000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#000000',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  checkoutBtn: {
    backgroundColor: '#FFDE59',
    borderRadius: 0,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000000',
    gap: 8,
    ...Shadows.button,
  },
  checkoutText: {
    color: '#000000',
    fontSize: 15,
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
    width: 72,
    height: 72,
    borderRadius: 0,
    backgroundColor: '#FFDE59',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.card,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: '#FFDE59',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    ...Shadows.button,
  },
  exploreBtnText: {
    color: '#000000',
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
});
