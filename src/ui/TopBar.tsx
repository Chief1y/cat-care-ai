import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
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
          paddingTop: Math.max(safeTop, 20) + 8,
          borderBottomColor: colors.border,
        }
      ]}>
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

        <TouchableOpacity
          style={[styles.centerButton, { backgroundColor: colors.accent }]}
          onPress={() => nav.navigate('Chat' as never)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#fff" style={styles.chatIcon} />
          <Text style={styles.centerText}>ChatBot</Text>
        </TouchableOpacity>

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
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  left: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  centerButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
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