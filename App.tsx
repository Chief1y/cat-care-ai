import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { ChatProvider } from './src/context/ChatContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RightPanel from './src/ui/RightPanel';
import AuthScreen from './src/screens/AuthScreen';

function AppContent() {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <AppNavigator 
        rightPanelVisible={rightPanelVisible}
        setRightPanelVisible={setRightPanelVisible}
      />
      <RightPanel 
        visible={rightPanelVisible} 
        onClose={() => setRightPanelVisible(false)} 
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
