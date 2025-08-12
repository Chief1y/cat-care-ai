import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import RightPanel from './src/ui/RightPanel';

export default function App() {
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator 
          rightPanelVisible={rightPanelVisible}
          setRightPanelVisible={setRightPanelVisible}
        />
        <RightPanel 
          visible={rightPanelVisible} 
          onClose={() => setRightPanelVisible(false)} 
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
