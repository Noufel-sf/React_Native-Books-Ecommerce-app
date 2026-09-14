import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';

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
        <Text style={styles.subtitle}>{items.length} unique items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={36} color="#A86C1D" />
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
                <View style={styles.qtyControls}>
                  <Pressable
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    {item.quantity === 1 ? (
                      <Trash2 size={13} color="#C94A3D" />
                    ) : (
                      <Minus size={13} color="#1A1816" />
                    )}
                  </Pressable>
                  <Text style={styles.qtyNumber}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    <Plus size={13} color="#1A1816" />
                  </Pressable>
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
              style={({ pressed }) => [styles.checkoutBtn, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <ArrowRight size={16} color="#FFFFFF" />
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
    backgroundColor: '#F8F5EE',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1816',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8C8276',
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
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  thumbnail: {
    width: 55,
    height: 75,
    borderRadius: 6,
    backgroundColor: '#ECE5D8',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1816',
  },
  itemFormat: {
    fontSize: 11,
    color: '#8C8276',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B87826',
    marginTop: 6,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6EE',
    borderRadius: 9999,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E8DFC9',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1816',
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 100,
    borderTopWidth: 1,
    borderTopColor: '#ECE5D8',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8C8276',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1816',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1816',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B87826',
  },
  checkoutBtn: {
    backgroundColor: '#D48C2B',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
    borderRadius: 36,
    backgroundColor: '#FAF1E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1816',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8C8276',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: '#1A1816',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
