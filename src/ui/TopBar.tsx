import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackHeaderProps & {
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
};

export const TopBar: React.FC<Props> = ({ route, rightPanelVisible, setRightPanelVisible }) => {
  const { colors, theme } = useTheme();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  // Fallback for safe area insets if not available
  const safeTop = insets?.top || 20;

  const isChat = route?.name === 'Chat';

  return (
    <>
      <StatusBar 
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.card as string}
      />
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        }
      ]}>
        {/* Left side - Home/Back button */}
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            if (rightPanelVisible) return; // Prevent drawer open when right panel is open
            if (isChat) {
              nav.goBack();
            } else {
              nav.dispatch(DrawerActions.openDrawer());
            }
          }}
        >
          <Ionicons 
            name={isChat ? "arrow-back-outline" : "home-outline"} 
            size={24} 
            color={colors.text as string} 
          />
        </TouchableOpacity>

        {/* Center - ChatBot button */}
        <TouchableOpacity
          style={[styles.centerButton, { backgroundColor: colors.accent }]}
          onPress={() => nav.navigate('Chat' as never)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#fff" style={styles.chatIcon} />
          <Text style={styles.centerText}>ChatBot</Text>
        </TouchableOpacity>

        {/* Right side - Menu button */}
        <TouchableOpacity
          style={styles.right}
          onPress={() => setRightPanelVisible(true)}
        >
          <MaterialIcons name="menu" size={26} color={colors.text as string} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: Platform.OS === 'ios' ? 36 : 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  centerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chatIcon: {
    marginRight: 6,
  },
  centerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});