import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';

const FREE_SHIPPING_THRESHOLD = 45.0;

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync?.().catch?.(() => {});
    }
    updateQuantity(id, qty);
  };

  const handleRemoveItem = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light).catch?.(() => {});
    }
    removeItem(id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top + 8, Platform.OS === 'web' ? 28 : 16) },
        ]}
      >
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={34} color="#18181B" strokeWidth={2.4} />
          </View>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>Explore our catalog and find your next favorite hardcover or e-book.</Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={({ pressed }) => [
              styles.exploreBtn,
              { transform: [{ scale: pressed ? 0.96 : 1 }] },
            ]}
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
                {/* Book Thumbnail with Black Border */}
                <View style={styles.thumbnailFrame}>
                  <Image source={{ uri: item.book.coverImage }} style={styles.thumbnail} contentFit="cover" />
                </View>

                {/* Details */}
                <View style={styles.cardDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.book.title}</Text>
                  <Text style={styles.itemFormat}>{item.format} • by {item.book.author}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>

                {/* Actions: Delete & Stepper */}
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => handleRemoveItem(item.id)}
                    style={({ pressed }) => [styles.deleteIconBtn, { opacity: pressed ? 0.6 : 1 }]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remove item"
                  >
                    <Trash2 size={16} color="#6B7280" strokeWidth={2} />
                  </Pressable>

                  {/* Neo-Pop Stepper Pill */}
                  <View style={styles.qtyStepper}>
                    <Pressable
                      onPress={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      style={styles.qtyBtn}
                    >
                      <Minus size={11} color="#18181B" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={11} color="#18181B" strokeWidth={2.5} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          {/* Pricing Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryInner}>
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

              {/* Cyber Yellow Neo-Pop Checkout CTA Button */}
              <Pressable
                onPress={() => router.push('/checkout' as any)}
                style={({ pressed }) => [
                  styles.checkoutBtn,
                  { transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                <ArrowRight size={16} color="#18181B" strokeWidth={2.4} />
              </Pressable>
            </View>
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
    paddingHorizontal: 18,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  shippingRibbon: {
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.8,
    borderColor: '#18181B',
    maxWidth: 500,
    alignSelf: 'center',
    ...Shadows.popSm,
  },
  shippingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shippingIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#38BDF8', // Cyan Blue
    borderWidth: 1.5,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shippingLabel: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  shippingProgressBar: {
    height: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#18181B',
  },
  shippingProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B4A', // Tangerine
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.8,
    borderColor: '#18181B',
    ...Shadows.popSm,
  },
  thumbnailFrame: {
    width: 54,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.2,
  },
  itemFormat: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    marginTop: 6,
  },
  cardActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  deleteIconBtn: {
    padding: 4,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  qtyBtn: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2,
    borderTopColor: '#18181B',
    paddingTop: 18,
    paddingBottom: 110,
  },
  summaryInner: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 18,
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
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  totalRow: {
    borderTopWidth: 1.8,
    borderTopColor: '#18181B',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 15.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  checkoutBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Shadows.popSm,
  },
  checkoutText: {
    color: '#18181B',
    fontSize: 14,
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
    backgroundColor: '#FF6B4A', // Tangerine
    borderWidth: 2,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  exploreBtn: {
    backgroundColor: '#FFD027',
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: BorderRadius.full,
  },
  exploreBtnText: {
    color: '#18181B',
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
});
