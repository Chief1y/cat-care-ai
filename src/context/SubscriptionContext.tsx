import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { StorageService } from '../services/StorageService';

interface SubscriptionContextType {
  canMakeAIRequest: boolean;
  remainingFreeRequests: number;
  subscriptionType: 'free' | 'monthly' | 'yearly';
  isSubscribed: boolean;
  hasUsedFirstConsult: boolean;
  makeAIRequest: () => Promise<boolean>;
  upgradeSubscription: (type: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  markFirstConsultUsed: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  simulateReachingLimit: () => Promise<void>; // Test function
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, refreshUserData } = useAuth();
  const [canMakeAIRequest, setCanMakeAIRequest] = useState(true);
  const [remainingFreeRequests, setRemainingFreeRequests] = useState(20);
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'monthly' | 'yearly'>('free');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasUsedFirstConsult, setHasUsedFirstConsult] = useState(false);

  useEffect(() => {
    if (user) {
      updateSubscriptionState();
    }
  }, [user]);

  const updateSubscriptionState = () => {
    if (!user) return;

    console.log('🔄 Updating subscription state for user:', user.name);

    // Initialize usage if not exists (ensure new users start with proper state)
    const usage = user.usage || {
      aiRequests: 0,
      freeRequestsUsed: 0,
      lastFreeRequestReset: new Date().toISOString(),
      hasUsedFirstConsult: false
    };

    // Initialize subscription if not exists
    const subscription = user.subscription || {
      type: 'free',
      isActive: true
    };

    // Calculate remaining free requests (simplified logic)
    const totalFreeRequests = 20; // Initial 20 free requests
    const usedRequests = usage.freeRequestsUsed || 0;
    const availableFreeRequests = Math.max(0, totalFreeRequests - usedRequests);

    console.log('📊 Request calculation:', {
      totalFreeRequests,
      freeRequestsUsed: usage.freeRequestsUsed,
      usedRequests,
      availableFreeRequests,
      userUsage: usage
    });

    // Check subscription status
    const now = new Date();
    const isActiveSubscription = subscription.isActive && 
      (subscription.type === 'free' || 
       !subscription.expiresAt || 
       new Date(subscription.expiresAt) > now);

    // Update state
    setSubscriptionType(subscription.type);
    setIsSubscribed(isActiveSubscription && subscription.type !== 'free');
    setHasUsedFirstConsult(usage.hasUsedFirstConsult);
    setRemainingFreeRequests(Math.max(0, availableFreeRequests));
    
    // For canMakeAIRequest, be more permissive - let the send function handle the logic
    const canMake = isActiveSubscription && (subscription.type !== 'free' || availableFreeRequests > 0);
    setCanMakeAIRequest(canMake);
    
    console.log('✅ Subscription state updated:', {
      subscriptionType: subscription.type,
      isSubscribed: isActiveSubscription && subscription.type !== 'free',
      remainingFreeRequests: Math.max(0, availableFreeRequests),
      canMakeAIRequest: canMake,
      isActiveSubscription
    });
  };

  const makeAIRequest = async (): Promise<boolean> => {
    if (!user) {
      console.log('❌ No user found for AI request');
      return false;
    }

    console.log('🤖 Making AI request. Current state:', { 
      isSubscribed, 
      remainingFreeRequests, 
      subscriptionType 
    });

    try {
      // If user has subscription, allow request without consuming counter
      if (isSubscribed) {
        console.log('✅ User has subscription, allowing request without consuming counter');
        return true;
      }

      // If user is on free plan, check and update free request count
      if (remainingFreeRequests > 0) {
        console.log('📉 Consuming free request. Remaining before:', remainingFreeRequests);
        
        const updatedUser = {
          ...user,
          usage: {
            ...user.usage,
            aiRequests: (user.usage?.aiRequests || 0) + 1,
            freeRequestsUsed: (user.usage?.freeRequestsUsed || 0) + 1,
            lastFreeRequestReset: user.usage?.lastFreeRequestReset || new Date().toISOString(),
            hasUsedFirstConsult: user.usage?.hasUsedFirstConsult || false
          }
        };

        await StorageService.updateUser(updatedUser);
        
        // Update local state immediately for smooth UX
        const newRemainingRequests = remainingFreeRequests - 1;
        setRemainingFreeRequests(newRemainingRequests);
        
        // Then refresh data to ensure consistency
        await refreshUserData();
        console.log('✅ Free request consumed successfully. New remaining:', newRemainingRequests);
        return true;
      }

      console.log('❌ No free requests remaining');
      return false;

      return false;
    } catch (error) {
      console.error('Error making AI request:', error);
      return false;
    }
  };

  const upgradeSubscription = async (type: 'monthly' | 'yearly'): Promise<void> => {
    if (!user) return;

    try {
      const expirationDate = new Date();
      if (type === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      const updatedUser = {
        ...user,
        subscription: {
          type,
          expiresAt: expirationDate.toISOString(),
          isActive: true
        }
      };

      await StorageService.updateUser(updatedUser);
      await refreshUserData();
      // Immediate state update for smooth UX
      setSubscriptionType(type);
      setIsSubscribed(true);
      console.log('🎉 Subscription upgraded immediately:', type);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  const cancelSubscription = async (): Promise<void> => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        subscription: {
          type: 'free' as const,
          expiresAt: undefined,
          isActive: false
        },
        usage: {
          ...user.usage,
          aiRequests: user.usage?.aiRequests || 0,
          freeRequestsUsed: 0, // Reset free requests
          lastFreeRequestReset: new Date().toISOString(),
          hasUsedFirstConsult: user.usage?.hasUsedFirstConsult || false
        }
      };

      await StorageService.updateUser(updatedUser);
      await refreshUserData();
      // Immediate state update for smooth UX
      setSubscriptionType('free');
      setIsSubscribed(false);
      setRemainingFreeRequests(20); // Reset to 20 free requests
      console.log('🔄 Subscription canceled immediately, back to free plan');
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const markFirstConsultUsed = async (): Promise<void> => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        usage: {
          ...user.usage,
          aiRequests: user.usage?.aiRequests || 0,
          freeRequestsUsed: user.usage?.freeRequestsUsed || 0,
          lastFreeRequestReset: user.usage?.lastFreeRequestReset || new Date().toISOString(),
          hasUsedFirstConsult: true
        }
      };

      await StorageService.updateUser(updatedUser);
      await refreshUserData();
    } catch (error) {
      console.error('Error marking first consult used:', error);
    }
  };

  const refreshUsage = async (): Promise<void> => {
    await refreshUserData();
  };

  // Test function to simulate reaching free limit (for demo purposes)
  const simulateReachingLimit = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        usage: {
          ...user.usage,
          aiRequests: 20,
          freeRequestsUsed: 20,
          lastFreeRequestReset: user.usage?.lastFreeRequestReset || new Date().toISOString(),
          hasUsedFirstConsult: user.usage?.hasUsedFirstConsult || false
        }
      };

      await StorageService.updateUser(updatedUser);
      await refreshUserData();
      console.log('🧪 Simulated reaching free request limit for testing');
    } catch (error) {
      console.error('Error simulating limit:', error);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        canMakeAIRequest,
        remainingFreeRequests,
        subscriptionType,
        isSubscribed,
        hasUsedFirstConsult,
        makeAIRequest,
        upgradeSubscription,
        cancelSubscription,
        markFirstConsultUsed,
        refreshUsage,
        simulateReachingLimit, // Test function
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
