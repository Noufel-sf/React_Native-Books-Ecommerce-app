import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Check, ArrowRight, Home } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Order } from '@/store/ordersStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface OrderReceiptModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  visible,
  order,
  onClose,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [visible]);

  if (!order) return null;

  const handleGoToOrders = () => {
    onClose();
    router.replace('/orders' as any);
  };

  const handleGoHome = () => {
    onClose();
    router.replace('/(tabs)');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.ticketWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Stamp Bar */}
            <View style={styles.receiptHeader}>
              <View style={styles.stampBox}>
                <Check size={14} color="#000000" strokeWidth={3} />
                <Text style={styles.stampText}>PAID IN FULL</Text>
              </View>
              <Text style={styles.receiptBrand}>LUMINA BOOKS</Text>
            </View>

            {/* Receipt Title */}
            <View style={styles.receiptBody}>
              <Text style={styles.receiptHeading}>ORDER RECEIPT</Text>
              <Text style={styles.orderNumber}>#{order.id}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>

              {/* Dashed Cut Line */}
              <View style={styles.dashedDivider} />

              {/* Customer Info */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>SHIPPED TO</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{order.shippingAddress.fullName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DESTINATION</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PAYMENT</Text>
                  <Text style={styles.infoValue}>
                    {order.paymentMethod === 'credit_card'
                      ? 'CARD •••• 4242'
                      : order.paymentMethod === 'apple_pay'
                      ? 'APPLE PAY'
                      : 'CASH ON DELIVERY'}
                  </Text>
                </View>
              </View>

              {/* Dashed Cut Line */}
              <View style={styles.dashedDivider} />

              {/* Items List */}
              <Text style={styles.sectionHeader}>PURCHASED ITEMS</Text>
              <View style={styles.itemsList}>
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.book.title}
                      </Text>
                      <Text style={styles.itemSub}>
                        Qty: {item.quantity} • {item.format}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Dashed Cut Line */}
              <View style={styles.dashedDivider} />

              {/* Financial Breakdown */}
              <View style={styles.breakdown}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>
                    {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>TOTAL PAID</Text>
                  <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Simulated Barcode */}
              <View style={styles.barcodeBox}>
                <View style={styles.barcodeStripes}>
                  {[1, 3, 2, 4, 1, 2, 4, 2, 3, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2].map(
                    (thickness, index) => (
                      <View
                        key={index}
                        style={[
                          styles.barcodeBar,
                          { width: thickness * 2, marginRight: 2 },
                        ]}
                      />
                    )
                  )}
                </View>
                <Text style={styles.barcodeText}>* {order.id} *</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <Pressable
                onPress={handleGoToOrders}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
              >
                <Text style={styles.primaryBtnText}>VIEW IN ORDERS</Text>
                <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
              </Pressable>

              <Pressable
                onPress={handleGoHome}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
              >
                <Home size={15} color="#000000" strokeWidth={2.5} />
                <Text style={styles.secondaryBtnText}>BACK TO SHOPPING</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  ticketWrapper: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  receiptHeader: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stampBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  stampText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#10B981',
    letterSpacing: 0.5,
  },
  receiptBrand: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  receiptBody: {
    padding: 18,
  },
  receiptHeading: {
    fontSize: 20,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  orderNumber: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: '#6B7280',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 11.5,
    fontFamily: Typography.sans.regular,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  infoSection: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: Typography.sans.semiBold,
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
    maxWidth: '65%',
    textAlign: 'right',
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemMeta: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
  itemSub: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#9CA3AF',
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  breakdown: {
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: Typography.sans.bold,
    color: Colors.primary,
  },
  barcodeBox: {
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  barcodeStripes: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },
  barcodeBar: {
    height: 30,
    backgroundColor: '#1A1A1A',
  },
  barcodeText: {
    fontSize: 10,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
    letterSpacing: 2,
    marginTop: 4,
  },
  actionContainer: {
    paddingHorizontal: 18,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...Shadows.button,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontFamily: Typography.sans.semiBold,
    color: Colors.text.primary,
  },
});
