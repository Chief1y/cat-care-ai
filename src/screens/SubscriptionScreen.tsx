import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const { 
    remainingFreeRequests, 
    subscriptionType, 
    isSubscribed, 
    upgradeSubscription,
    cancelSubscription,
    refreshUsage 
  } = useSubscription();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshUsage();
    setRefreshing(false);
  }, [refreshUsage]);

  console.log('🔍 SubscriptionScreen state:', { 
    remainingFreeRequests, 
    subscriptionType, 
    isSubscribed 
  });

  const handleUpgrade = async (type: 'monthly' | 'yearly') => {
    const price = type === 'monthly' ? '$4.99' : '$39.99';
    const savings = type === 'yearly' ? ' (33% off!)' : '';
    
    // For web, skip alert and directly upgrade
    if (Platform.OS === 'web') {
      await upgradeSubscription(type);
      alert(`Demo Activated! You've successfully activated the ${type} plan demo!`);
      return;
    }
    
    Alert.alert(
      'Demo Subscription',
      `This is a demo! Activate ${type} plan for ${price}${savings}?\n\nYou'll get unlimited AI requests and the counter will disappear.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate (Demo)', 
          onPress: async () => {
            await upgradeSubscription(type);
            Alert.alert('Demo Activated!', `You've successfully activated the ${type} plan demo!`);
          }
        }
      ]
    );
  };

  const handleCancelSubscription = async () => {
    // For web, skip alert and directly cancel
    if (Platform.OS === 'web') {
      await cancelSubscription();
      alert('Subscription Canceled! You\'ve been returned to the free plan with renewed requests!');
      return;
    }
    
    Alert.alert(
      'Cancel Subscription',
      'This will return you to the free plan with 20 renewed free requests. Continue?',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Return to Free Plan', 
          style: 'destructive',
          onPress: async () => {
            await cancelSubscription();
            Alert.alert('Subscription Canceled', 'You\'ve been returned to the free plan with renewed requests!');
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="diamond" size={48} color={colors.accent as string} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>CatCare AI Premium</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>
            Unlimited AI consultations & premium features
          </Text>
        </View>

        {/* Current Status */}
        <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>Current Plan</Text>
          <View style={styles.statusRow}>
            <Ionicons 
              name={isSubscribed ? "diamond" : "heart"} 
              size={24} 
              color={colors.accent as string} 
            />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {isSubscribed ? `${subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)} Plan` : 'Free Plan'}
            </Text>
          </View>
          
          {!isSubscribed && (
            <View style={styles.usageInfo}>
              <Text style={[styles.usageText, { color: colors.text }]}>
                Free AI requests remaining: {remainingFreeRequests}
              </Text>
              <Text style={[styles.usageNote, { color: colors.accent }]}>
                +5 requests added monthly
              </Text>
            </View>
          )}
        </View>

        {/* Free Plan Features */}
        <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.planHeader}>
            <Text style={[styles.planTitle, { color: colors.text }]}>Free Plan</Text>
            <Text style={[styles.planPrice, { color: colors.text }]}>$0</Text>
          </View>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>20 AI requests included</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>+5 requests every month</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>70% off first doctor consultation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="close-circle" size={20} color="#FF6B6B" />
              <Text style={[styles.featureText, { color: colors.text }]}>Limited AI responses</Text>
            </View>
          </View>
        </View>

        {/* Monthly Plan */}
        <View style={[styles.planCard, styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.accent }]}>
          <View style={styles.planHeader}>
            <Text style={[styles.planTitle, { color: colors.text }]}>Monthly Plan</Text>
            <Text style={[styles.planPrice, { color: colors.accent }]}>$4.99</Text>
          </View>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>Unlimited AI requests</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>Priority AI responses</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>70% off first doctor consultation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>24/7 premium support</Text>
            </View>
          </View>
          {!isSubscribed && (
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
              onPress={() => handleUpgrade('monthly')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Monthly</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Yearly Plan */}
        <View style={[styles.planCard, styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planTitle, { color: colors.text }]}>Yearly Plan</Text>
              <View style={[styles.savingsBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.savingsText}>Save 33%!</Text>
              </View>
            </View>
            <View style={styles.yearlyPricing}>
              <Text style={[styles.originalYearlyPrice, { color: colors.text }]}>$59.88</Text>
              <Text style={[styles.planPrice, { color: colors.primary }]}>$39.99</Text>
            </View>
          </View>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>Unlimited AI requests</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>Priority AI responses</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>70% off first doctor consultation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>24/7 premium support</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.text }]}>Early access to new features</Text>
            </View>
          </View>
          {!isSubscribed && (
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
              onPress={() => handleUpgrade('yearly')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Yearly</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer Note */}
        {/* Cancel Subscription Button */}
        {isSubscribed && (
          <View style={[styles.cancelSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cancelTitle, { color: colors.text }]}>Manage Subscription</Text>
            <Text style={[styles.cancelDescription, { color: colors.text }]}>
              You can return to the free plan anytime. Your free requests will be renewed.
            </Text>
            <TouchableOpacity
              style={[styles.cancelButton]}
              onPress={handleCancelSubscription}
            >
              <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
              <Text style={styles.cancelButtonText}>Return to Free Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer Note */}
        <View style={[styles.footerNote, { backgroundColor: colors.surface }]}>
          <Ionicons name="information-circle" size={20} color={colors.accent as string} />
          <Text style={[styles.footerText, { color: colors.text }]}>
            Doctor consultations are charged separately. Premium subscribers get priority booking and exclusive features.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  usageInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  usageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  usageNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  planCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  premiumCard: {
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  yearlyPricing: {
    alignItems: 'flex-end',
  },
  originalYearlyPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  featuresList: {
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  upgradeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerNote: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  cancelSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  cancelTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cancelDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});
