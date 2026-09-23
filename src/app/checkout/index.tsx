import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, CreditCard, Smartphone, Banknote, ShieldCheck, ShoppingBag } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/cartStore';
import { useOrdersStore, PaymentMethodType, Order } from '@/store/ordersStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { CURRENT_USER } from '@/data/books';
import { OrderReceiptModal } from '@/components/checkout/OrderReceiptModal';

type CheckoutStep = 'shipping' | 'payment' | 'confirm';

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const { createOrder } = useOrdersStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);

  // Form State: Shipping
  const [fullName, setFullName] = useState(CURRENT_USER.name);
  const [streetAddress, setStreetAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [postalCode, setPostalCode] = useState('97477');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(CURRENT_USER.name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextFromShipping = () => {
    if (validateShipping()) {
      triggerHaptic();
      setCurrentStep('payment');
    }
  };

  const handleNextFromPayment = () => {
    triggerHaptic();
    setCurrentStep('confirm');
  };

  const handlePlaceOrder = () => {
    triggerHaptic();
    const order = createOrder({
      items: [...items],
      shippingAddress: {
        fullName,
        streetAddress,
        city,
        postalCode,
        country: 'United States',
        phone,
      },
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
    });

    clearCart();
    setCreatedOrder(order);
    setReceiptVisible(true);
  };

  if (items.length === 0 && !receiptVisible) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <ArrowLeft size={20} color="#000000" strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.title}>CHECKOUT</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <ShoppingBag size={36} color="#000000" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add books to your cart before proceeding to checkout.</Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={({ pressed }) => [styles.exploreBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.exploreBtnText}>Browse Catalog</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top App Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              triggerHaptic();
              if (currentStep === 'payment') setCurrentStep('shipping');
              else if (currentStep === 'confirm') setCurrentStep('payment');
              else router.back();
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
          <Text style={styles.title}>CHECKOUT</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Step Indicator */}
        <View style={styles.stepperContainer}>
          <View
            style={[
              styles.stepBadge,
              currentStep === 'shipping' ? styles.stepActive : styles.stepDone,
            ]}
          >
            <Text style={styles.stepBadgeText}>1. SHIPPING</Text>
          </View>
          <View style={styles.stepConnector} />
          <View
            style={[
              styles.stepBadge,
              currentStep === 'payment'
                ? styles.stepActive
                : currentStep === 'confirm'
                ? styles.stepDone
                : styles.stepInactive,
            ]}
          >
            <Text style={styles.stepBadgeText}>2. PAYMENT</Text>
          </View>
          <View style={styles.stepConnector} />
          <View
            style={[
              styles.stepBadge,
              currentStep === 'confirm' ? styles.stepActive : styles.stepInactive,
            ]}
          >
            <Text style={styles.stepBadgeText}>3. CONFIRM</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: SHIPPING ADDRESS */}
          {currentStep === 'shipping' && (
            <View style={styles.stepContent}>
              <View style={styles.sectionHeaderBox}>
                <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
                <Text style={styles.sectionSubtitle}>Where should we deliver your books?</Text>
              </View>

              {/* Input: Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME *</Text>
                <TextInput
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  style={[styles.input, errors.fullName ? styles.inputError : null]}
                  placeholder="e.g. Robert Greene"
                  placeholderTextColor="#999999"
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </View>

              {/* Input: Street Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>STREET ADDRESS *</Text>
                <TextInput
                  value={streetAddress}
                  onChangeText={(val) => {
                    setStreetAddress(val);
                    if (errors.streetAddress) setErrors({ ...errors, streetAddress: '' });
                  }}
                  style={[styles.input, errors.streetAddress ? styles.inputError : null]}
                  placeholder="e.g. 123 Bookworm Way"
                  placeholderTextColor="#999999"
                />
                {errors.streetAddress && (
                  <Text style={styles.errorText}>{errors.streetAddress}</Text>
                )}
              </View>

              {/* Row: City & Postal */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>CITY *</Text>
                  <TextInput
                    value={city}
                    onChangeText={(val) => {
                      setCity(val);
                      if (errors.city) setErrors({ ...errors, city: '' });
                    }}
                    style={[styles.input, errors.city ? styles.inputError : null]}
                    placeholder="e.g. New York"
                    placeholderTextColor="#999999"
                  />
                  {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </View>

                <View style={[styles.inputGroup, { width: 120 }]}>
                  <Text style={styles.inputLabel}>POSTAL CODE *</Text>
                  <TextInput
                    value={postalCode}
                    onChangeText={(val) => {
                      setPostalCode(val);
                      if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                    }}
                    style={[styles.input, errors.postalCode ? styles.inputError : null]}
                    placeholder="10001"
                    placeholderTextColor="#999999"
                  />
                  {errors.postalCode && (
                    <Text style={styles.errorText}>{errors.postalCode}</Text>
                  )}
                </View>
              </View>

              {/* Input: Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER *</Text>
                <TextInput
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  keyboardType="phone-pad"
                  style={[styles.input, errors.phone ? styles.inputError : null]}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#999999"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Action Button */}
              <Pressable
                onPress={handleNextFromShipping}
                style={({ pressed }) => [
                  styles.ctaButton,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
              >
                <Text style={styles.ctaButtonText}>CONTINUE TO PAYMENT</Text>
              </Pressable>
            </View>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {currentStep === 'payment' && (
            <View style={styles.stepContent}>
              <View style={styles.sectionHeaderBox}>
                <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
                <Text style={styles.sectionSubtitle}>Select how you want to pay</Text>
              </View>

              {/* Payment Option Radio Cards */}
              <View style={styles.paymentOptions}>
                {/* Credit Card Option */}
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setPaymentMethod('credit_card');
                  }}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'credit_card' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <CreditCard size={20} color="#000000" strokeWidth={2.5} />
                    <Text style={styles.optionTitle}>Credit or Debit Card</Text>
                    {paymentMethod === 'credit_card' && (
                      <View style={styles.checkPill}>
                        <Check size={12} color="#000000" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </Pressable>

                {/* Apple Pay Option */}
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setPaymentMethod('apple_pay');
                  }}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'apple_pay' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <Smartphone size={20} color="#000000" strokeWidth={2.5} />
                    <Text style={styles.optionTitle}>Apple Pay / Google Pay</Text>
                    {paymentMethod === 'apple_pay' && (
                      <View style={styles.checkPill}>
                        <Check size={12} color="#000000" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </Pressable>

                {/* Cash on Delivery Option */}
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setPaymentMethod('cod');
                  }}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'cod' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <Banknote size={20} color="#000000" strokeWidth={2.5} />
                    <Text style={styles.optionTitle}>Cash on Delivery</Text>
                    {paymentMethod === 'cod' && (
                      <View style={styles.checkPill}>
                        <Check size={12} color="#000000" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>

              {/* Live Credit Card Preview & Inputs */}
              {paymentMethod === 'credit_card' && (
                <View style={styles.cardSection}>
                  {/* Neobrutalist Credit Card Graphic */}
                  <View style={styles.cardGraphic}>
                    <View style={styles.cardGraphicTop}>
                      <View style={styles.chipGraphic} />
                      <Text style={styles.cardBrandText}>LUMINA PAY</Text>
                    </View>
                    <Text style={styles.cardNumberGraphic}>{cardNumber || '•••• •••• •••• ••••'}</Text>
                    <View style={styles.cardGraphicBottom}>
                      <View>
                        <Text style={styles.cardSmallLabel}>CARDHOLDER</Text>
                        <Text style={styles.cardGraphicName} numberOfLines={1}>
                          {cardHolder || 'FULL NAME'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardSmallLabel}>EXPIRES</Text>
                        <Text style={styles.cardGraphicExp}>{cardExpiry || 'MM/YY'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Number Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CARD NUMBER *</Text>
                    <TextInput
                      value={cardNumber}
                      onChangeText={(val) => setCardNumber(formatCardNumber(val))}
                      keyboardType="number-pad"
                      maxLength={19}
                      style={styles.input}
                      placeholder="4242 4242 4242 4242"
                      placeholderTextColor="#999999"
                    />
                  </View>

                  {/* Cardholder Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>NAME ON CARD *</Text>
                    <TextInput
                      value={cardHolder}
                      onChangeText={(val) => setCardHolder(val.toUpperCase())}
                      style={styles.input}
                      placeholder="ROBERT GREENE"
                      placeholderTextColor="#999999"
                    />
                  </View>

                  {/* Expiry & CVV */}
                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={styles.inputLabel}>EXPIRY DATE *</Text>
                      <TextInput
                        value={cardExpiry}
                        onChangeText={(val) => setCardExpiry(formatExpiry(val))}
                        keyboardType="number-pad"
                        maxLength={5}
                        style={styles.input}
                        placeholder="MM/YY"
                        placeholderTextColor="#999999"
                      />
                    </View>

                    <View style={[styles.inputGroup, { width: 100 }]}>
                      <Text style={styles.inputLabel}>CVV *</Text>
                      <TextInput
                        value={cardCvv}
                        onChangeText={(val) => setCardCvv(val.replace(/\D/g, '').slice(0, 4))}
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                        style={styles.input}
                        placeholder="888"
                        placeholderTextColor="#999999"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Action Button */}
              <Pressable
                onPress={handleNextFromPayment}
                style={({ pressed }) => [
                  styles.ctaButton,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
              >
                <Text style={styles.ctaButtonText}>REVIEW ORDER</Text>
              </Pressable>
            </View>
          )}

          {/* STEP 3: ORDER CONFIRMATION & REVIEW */}
          {currentStep === 'confirm' && (
            <View style={styles.stepContent}>
              <View style={styles.sectionHeaderBox}>
                <Text style={styles.sectionTitle}>REVIEW & CONFIRM</Text>
                <Text style={styles.sectionSubtitle}>Verify your order before placement</Text>
              </View>

              {/* Shipping Summary Box */}
              <View style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewCardTitle}>SHIPPING TO</Text>
                  <Pressable onPress={() => setCurrentStep('shipping')}>
                    <Text style={styles.editLink}>EDIT</Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewMainText}>{fullName}</Text>
                <Text style={styles.reviewSubText}>
                  {streetAddress}, {city} {postalCode}
                </Text>
                <Text style={styles.reviewSubText}>{phone}</Text>
              </View>

              {/* Payment Summary Box */}
              <View style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewCardTitle}>PAYMENT METHOD</Text>
                  <Pressable onPress={() => setCurrentStep('payment')}>
                    <Text style={styles.editLink}>EDIT</Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewMainText}>
                  {paymentMethod === 'credit_card'
                    ? `Credit Card ending in ${cardNumber.slice(-4) || '4242'}`
                    : paymentMethod === 'apple_pay'
                    ? 'Apple Pay / Google Pay'
                    : 'Cash on Delivery'}
                </Text>
              </View>

              {/* Books Breakdown */}
              <View style={styles.reviewCard}>
                <Text style={styles.reviewCardTitle}>ORDER ITEMS ({items.length})</Text>
                <View style={styles.orderItemsList}>
                  {items.map((item) => (
                    <View key={item.id} style={styles.reviewItemRow}>
                      <Image
                        source={{ uri: item.book.coverImage }}
                        style={styles.reviewItemCover}
                        contentFit="cover"
                      />
                      <View style={styles.reviewItemDetails}>
                        <Text style={styles.reviewItemTitle} numberOfLines={1}>
                          {item.book.title}
                        </Text>
                        <Text style={styles.reviewItemFormat}>
                          {item.format} • Qty: {item.quantity}
                        </Text>
                      </View>
                      <Text style={styles.reviewItemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Price Breakdown */}
              <View style={styles.pricingBox}>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Subtotal</Text>
                  <Text style={styles.pricingValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Estimated Delivery</Text>
                  <Text style={styles.pricingValue}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </Text>
                </View>
                <View style={[styles.pricingRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Trust Badge */}
              <View style={styles.trustBadge}>
                <ShieldCheck size={16} color="#000000" strokeWidth={2.5} />
                <Text style={styles.trustText}>Simulated Checkout • No real money charged</Text>
              </View>

              {/* Place Order CTA */}
              <Pressable
                onPress={handlePlaceOrder}
                style={({ pressed }) => [
                  styles.placeOrderBtn,
                  {
                    transform: [
                      { translateX: pressed ? 2 : 0 },
                      { translateY: pressed ? 2 : 0 },
                    ],
                  },
                ]}
              >
                <Text style={styles.placeOrderBtnText}>
                  PLACE ORDER • ${total.toFixed(2)}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Order Success Receipt Modal */}
      <OrderReceiptModal
        visible={receiptVisible}
        order={createdOrder}
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
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
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.3,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  stepActive: {
    backgroundColor: '#FFD027', // Cyber Yellow
  },
  stepDone: {
    backgroundColor: '#38BDF8', // Cyan Blue
  },
  stepInactive: {
    backgroundColor: '#F3F4F6',
  },
  stepBadgeText: {
    fontSize: 10.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  stepConnector: {
    width: 16,
    height: 1.8,
    backgroundColor: '#18181B',
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    backgroundColor: '#FFFFFF',
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  stepContent: {
    gap: 16,
  },
  sectionHeaderBox: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  inputGroup: {
    gap: 5,
  },
  inputLabel: {
    fontSize: 11.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    fontFamily: Typography.sans.medium,
    color: '#18181B',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#EF4444',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  ctaButton: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Shadows.popSm,
  },
  ctaButtonText: {
    fontSize: 14,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.3,
  },
  paymentOptions: {
    gap: 10,
  },
  paymentOptionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    borderRadius: 18,
    padding: 14,
    ...Shadows.popSm,
  },
  paymentOptionActive: {
    borderColor: '#18181B',
    backgroundColor: '#FEF3C7',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTitle: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD027',
    borderWidth: 1.5,
    borderColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSection: {
    gap: 14,
    marginTop: 4,
  },
  cardGraphic: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#18181B',
    padding: 18,
    ...Shadows.popSm,
  },
  cardGraphicTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chipGraphic: {
    width: 36,
    height: 26,
    backgroundColor: '#FFD027',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#18181B',
  },
  cardBrandText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardNumberGraphic: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardGraphicBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardSmallLabel: {
    fontSize: 9,
    fontFamily: Typography.sans.medium,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  cardGraphicName: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
    maxWidth: 160,
  },
  cardGraphicExp: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    borderRadius: 20,
    padding: 14,
    ...Shadows.popSm,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewCardTitle: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.5,
  },
  editLink: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#38BDF8',
    textDecorationLine: 'underline',
  },
  reviewMainText: {
    fontSize: 13.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  reviewSubText: {
    fontSize: 12,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    marginTop: 2,
  },
  orderItemsList: {
    gap: 10,
    marginTop: 8,
  },
  reviewItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewItemCover: {
    width: 38,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.2,
    borderColor: '#18181B',
  },
  reviewItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  reviewItemTitle: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  reviewItemFormat: {
    fontSize: 11,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
    marginTop: 1,
  },
  reviewItemPrice: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  pricingBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#18181B',
    borderRadius: 20,
    padding: 14,
    gap: 8,
    ...Shadows.popSm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 13,
    fontFamily: Typography.sans.regular,
    color: '#6B7280',
  },
  pricingValue: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  totalRow: {
    borderTopWidth: 1.5,
    borderTopColor: '#18181B',
    paddingTop: 10,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  totalValue: {
    fontSize: 17,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  trustText: {
    fontSize: 11,
    fontFamily: Typography.sans.medium,
    color: '#6B7280',
  },
  placeOrderBtn: {
    backgroundColor: '#FFD027', // Cyber Yellow
    borderRadius: BorderRadius.full,
    borderWidth: 1.8,
    borderColor: '#18181B',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    ...Shadows.popSm,
  },
  placeOrderBtnText: {
    fontSize: 14.5,
    fontFamily: Typography.sans.bold,
    color: '#18181B',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  emptyIconBox: {
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
    marginBottom: 18,
  },
  exploreBtn: {
    backgroundColor: '#FFD027',
    paddingHorizontal: 22,
    paddingVertical: 11,
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
