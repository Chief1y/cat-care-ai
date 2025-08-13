import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSafeInsets() {
  if (Platform.OS === 'web') {
    // For web, return default insets
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  try {
    const insets = useSafeAreaInsets();
    return insets;
  } catch (error) {
    // Fallback if SafeAreaProvider is not available
    return { top: 20, bottom: 0, left: 0, right: 0 };
  }
}
