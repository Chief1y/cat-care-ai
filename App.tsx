import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { ChatProvider } from './src/context/ChatContext';
import RightPanel from './src/ui/RightPanel';

export default function App() {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatProvider>
          <AppNavigator 
            rightPanelVisible={rightPanelVisible}
            setRightPanelVisible={setRightPanelVisible}
          />
          <RightPanel 
            visible={rightPanelVisible} 
            onClose={() => setRightPanelVisible(false)} 
          />
        </ChatProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
