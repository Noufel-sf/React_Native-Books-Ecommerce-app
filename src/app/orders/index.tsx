import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, Receipt, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useOrdersStore, Order } from '@/store/ordersStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { OrderReceiptModal } from '@/components/checkout/OrderReceiptModal';

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrdersStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);

  const handleOpenReceipt = (order: Order) => {
    triggerHaptic();
    setSelectedOrder(order);
    setReceiptVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
          style={({ pressed }) => [
            styles.backBtn,
            {
              transform: [
                { translateX: pressed ? 2 : 0 },
                { translateY: pressed ? 2 : 0 },
              ],
            },
          ]}
        >
          <ArrowLeft size={18} color="#000000" strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.title}>ORDER HISTORY</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{orders.length}</Text>
        </View>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Package size={36} color="#000000" />
          </View>
          <Text style={styles.emptyTitle}>No orders placed yet</Text>
          <Text style={styles.emptySubtitle}>
            Your completed purchases and receipt tickets will appear here.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={({ pressed }) => [
              styles.exploreBtn,
              {
                transform: [
                  { translateX: pressed ? 2 : 0 },
                  { translateY: pressed ? 2 : 0 },
                ],
              },
            ]}
          >
            <Text style={styles.exploreBtnText}>Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              {/* Order Header Row */}
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={styles.orderId}>#{item.id}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Delivered'
                      ? styles.statusDelivered
                      : item.status === 'Shipped'
                      ? styles.statusShipped
                      : styles.statusProcessing,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              {/* Book Covers Strip */}
              <View style={styles.coverStrip}>
                {item.items.slice(0, 4).map((orderItem) => (
                  <Image
                    key={orderItem.id}
                    source={{ uri: orderItem.book.coverImage }}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />
                ))}
                {item.items.length > 4 && (
                  <View style={styles.extraBadge}>
                    <Text style={styles.extraText}>+{item.items.length - 4}</Text>
                  </View>
                )}
                <View style={styles.itemMeta}>
                  <Text style={styles.itemsSummary}>
                    {item.items.reduce((sum, i) => sum + i.quantity, 0)} items purchased
                  </Text>
                  <Text style={styles.destinationText} numberOfLines={1}>
                    Ship to: {item.shippingAddress.city}, {item.shippingAddress.postalCode}
                  </Text>
                </View>
              </View>

              {/* Footer Row */}
              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
                </View>
                <Pressable
                  onPress={() => handleOpenReceipt(item)}
                  style={({ pressed }) => [
                    styles.receiptBtn,
                    {
                      transform: [
                        { translateX: pressed ? 2 : 0 },
                        { translateY: pressed ? 2 : 0 },
                      ],
                    },
                  ]}
                >
                  <Receipt size={14} color="#000000" strokeWidth={2.5} />
                  <Text style={styles.receiptBtnText}>RECEIPT</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Receipt Modal */}
      <OrderReceiptModal
        visible={receiptVisible}
        order={selectedOrder}
        onClose={() => setReceiptVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#38BDF8', // Cyan Blue
    borderWidth: 1.8,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.3,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFD027', // Cyber Yellow
    borderWidth: 1.5,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 16,
    ...Shadows.popSm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  orderDate: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  statusProcessing: {
    backgroundColor: '#FFD027', // Cyber Yellow
  },
  statusShipped: {
    backgroundColor: '#38BDF8', // Cyan Blue
  },
  statusDelivered: {
    backgroundColor: '#A7F3D0', // Mint
  },
  statusText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.3,
  },
  coverStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  thumbnail: {
    width: 44,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  extraBadge: {
    width: 44,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  itemMeta: {
    flex: 1,
    marginLeft: 6,
  },
  itemsSummary: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  destinationText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  receiptBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.popSm,
  },
  receiptBtnText: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B4A', // Tangerine
    borderWidth: 2,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
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
  },
  exploreBtn: {
    backgroundColor: '#FFD027',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    ...Shadows.popSm,
  },
  exploreBtnText: {
    color: '#18181B',
    fontSize: 13,
    fontFamily: Typography.sans.bold,
  },
});
