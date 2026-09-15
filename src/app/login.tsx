import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Check, BookOpen, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Typography, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

type AuthMode = 'signin' | 'signup';

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup, continueAsGuest } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    triggerHaptic();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }

      router.replace('/(tabs)');
    } catch (e) {
      setErrors({ email: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    triggerHaptic();
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const handleSocialMock = (provider: string) => {
    triggerHaptic();
    setIsLoading(true);
    setTimeout(async () => {
      await login(`${provider.toLowerCase()}.user@example.com`);
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Navigation Header */}
        <View style={styles.navHeader}>
          <Pressable
            onPress={() => {
              triggerHaptic();
              router.back();
            }}
            style={({ pressed }) => [
              styles.backBtn,
              {
                transform: [
                  { translateX: pressed ? 1 : 0 },
                  { translateY: pressed ? 1 : 0 },
                ],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={18} color="#000000" strokeWidth={2.5} />
          </Pressable>

          <View style={styles.brandSticker}>
            <BookOpen size={14} color="#000000" strokeWidth={2.5} />
            <Text style={styles.brandStickerText}>LUMINA BOOKS</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Heading */}
          <View style={styles.headingBox}>
            <View style={styles.tagRow}>
              <View style={styles.tagBadge}>
                <Sparkles size={11} color="#000000" />
                <Text style={styles.tagBadgeText}>MEMBERSHIP</Text>
              </View>
            </View>
            <Text style={styles.mainTitle}>
              {mode === 'signin' ? 'Welcome Back.' : 'Create Account.'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'signin'
                ? 'Sign in to access your curated library, saved orders, and wishlist.'
                : 'Join thousands of ambitious readers building their personal library.'}
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.tabSwitcher}>
            <Pressable
              onPress={() => {
                triggerHaptic();
                setMode('signin');
                setErrors({});
              }}
              style={[
                styles.tabBtn,
                mode === 'signin' && styles.tabBtnActive,
              ]}
            >
              <Text style={styles.tabBtnText}>SIGN IN</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic();
                setMode('signup');
                setErrors({});
              }}
              style={[
                styles.tabBtn,
                mode === 'signup' && styles.tabBtnActive,
              ]}
            >
              <Text style={styles.tabBtnText}>NEW ACCOUNT</Text>
            </Pressable>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Full Name Input (Sign Up only) */}
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME *</Text>
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Robert Greene"
                  placeholderTextColor="#999999"
                  style={[styles.input, errors.name ? styles.inputError : null]}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS *</Text>
              <TextInput
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@example.com"
                placeholderTextColor="#999999"
                style={[styles.input, errors.email ? styles.inputError : null]}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD *</Text>
              <View style={[styles.passwordWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  placeholder="Min 6 characters"
                  placeholderTextColor="#999999"
                  style={styles.passwordInput}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#000000" strokeWidth={2.2} />
                  ) : (
                    <Eye size={18} color="#000000" strokeWidth={2.2} />
                  )}
                </Pressable>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Remember Me & Forgot Password Row */}
            {mode === 'signin' && (
              <View style={styles.optionsRow}>
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setRememberMe(!rememberMe);
                  }}
                  style={styles.rememberMeBtn}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Check size={12} color="#000000" strokeWidth={3} />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </Pressable>

                <Pressable onPress={() => triggerHaptic()}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
              </View>
            )}

            {/* Submit Primary CTA */}
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.submitBtn,
                mode === 'signup' && styles.signupBtn,
                {
                  transform: [
                    { translateX: pressed ? 2 : 0 },
                    { translateY: pressed ? 2 : 0 },
                  ],
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE FREE ACCOUNT'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Social Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONNECT WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <Pressable
              onPress={() => handleSocialMock('Google')}
              style={({ pressed }) => [
                styles.socialBtn,
                {
                  transform: [
                    { translateX: pressed ? 2 : 0 },
                    { translateY: pressed ? 2 : 0 },
                  ],
                },
              ]}
            >
              <Text style={styles.socialBtnText}>G  Google</Text>
            </Pressable>

            <Pressable
              onPress={() => handleSocialMock('Apple')}
              style={({ pressed }) => [
                styles.socialBtn,
                {
                  transform: [
                    { translateX: pressed ? 2 : 0 },
                    { translateY: pressed ? 2 : 0 },
                  ],
                },
              ]}
            >
              <Text style={styles.socialBtnText}>  Apple</Text>
            </Pressable>
          </View>

          {/* Continue as Guest */}
          <Pressable onPress={handleGuest} style={styles.guestBtn}>
            <Text style={styles.guestText}>Continue as Guest ➔</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  brandSticker: {
    backgroundColor: '#FFDE59',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  brandStickerText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  headingBox: {
    marginTop: 10,
    marginBottom: 20,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#2EEC96',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagBadgeText: {
    fontSize: 9,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 30,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Typography.sans.medium,
    color: '#666666',
    marginTop: 4,
    lineHeight: 19,
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    ...Shadows.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFDE59',
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 18,
    gap: 16,
    ...Shadows.card,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    color: '#000000',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: Typography.sans.medium,
    color: '#000000',
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: '#FF6B4A',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 11,
    fontFamily: Typography.sans.bold,
    color: '#FF6B4A',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  rememberMeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2EEC96',
  },
  rememberMeText: {
    fontSize: 12,
    fontFamily: Typography.sans.medium,
    color: '#000000',
  },
  forgotText: {
    fontSize: 12,
    fontFamily: Typography.sans.bold,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    backgroundColor: '#FFDE59',
    borderRadius: 0,
    borderWidth: 2.5,
    borderColor: '#000000',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    ...Shadows.button,
  },
  signupBtn: {
    backgroundColor: '#2EEC96',
  },
  submitBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#000000',
  },
  dividerText: {
    fontSize: 10,
    fontFamily: Typography.sans.bold,
    color: '#777777',
    letterSpacing: 0.5,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  socialBtnText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
  },
  guestBtn: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  guestText: {
    fontSize: 13,
    fontFamily: Typography.sans.bold,
    color: '#000000',
    textDecorationLine: 'underline',
  },
});
