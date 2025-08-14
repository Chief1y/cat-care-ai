import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { ChatProvider } from './src/context/ChatContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import RightPanel from './src/ui/RightPanel';
import AuthScreen from './src/screens/AuthScreen';
import { Platform } from 'react-native';

function AppContent() {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const { user, isLoading } = useAuth();

  // Auto-close auth screen when user logs in
  useEffect(() => {
    if (user && showAuthScreen) {
      setShowAuthScreen(false);
    }
  }, [user, showAuthScreen]);

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  // Show auth screen when explicitly requested
  if (showAuthScreen) {
    return <AuthScreen onClose={() => setShowAuthScreen(false)} />;
  }

  // Always show the main app, login is optional
  return (
    <>
      <AppNavigator 
        rightPanelVisible={rightPanelVisible}
        setRightPanelVisible={setRightPanelVisible}
      />
      <RightPanel 
        visible={rightPanelVisible} 
        onClose={() => setRightPanelVisible(false)}
        onShowLogin={() => setShowAuthScreen(true)}
      />
    </>
  );
}

export default function App() {
  // For web, we don't need SafeAreaProvider as it can cause layout issues
  if (Platform.OS === 'web') {
    return (
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // For mobile, use SafeAreaProvider
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
