import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSafeInsets } from '../hooks/useSafeInsets';

type Props = NativeStackHeaderProps & {
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
};

export const TopBar: React.FC<Props> = ({ route, rightPanelVisible, setRightPanelVisible }) => {
  const { colors, theme } = useTheme();
  const nav = useNavigation();

  const isChat = route?.name === 'Chat';

  // Completely separate rendering for web vs mobile
  if (Platform.OS === 'web') {
    return (
      <>
        <StatusBar 
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'} 
          backgroundColor={colors.card as string}
        />
        <View style={[
          {
            height: 60,
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            position: 'relative',
            top: 0,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          }
        ]}>
          {/* Left side - Home/Back button */}
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (rightPanelVisible) return;
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
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
            }}
            onPress={() => nav.navigate('Chat' as never)}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#fff" style={{marginRight: 6}} />
            <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>ChatBot</Text>
          </TouchableOpacity>

          {/* Right side - Menu button */}
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setRightPanelVisible(true)}
          >
            <MaterialIcons name="menu" size={26} color={colors.text as string} />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // Mobile rendering with safe areas
  const insets = useSafeInsets();
  const safeTop = insets?.top || 20;

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
          paddingTop: safeTop + 8,
          height: safeTop + 52,
        }
      ]}>
        {/* Left side - Home/Back button */}
        <View style={styles.sideContainer}>
          <TouchableOpacity
            style={styles.left}
            onPress={() => {
              if (rightPanelVisible) return;
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
        </View>

        {/* Center - ChatBot button */}
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={[styles.centerButton, { backgroundColor: colors.accent }]}
            onPress={() => nav.navigate('Chat' as never)}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#fff" style={styles.chatIcon} />
            <Text style={styles.centerText}>ChatBot</Text>
          </TouchableOpacity>
        </View>

        {/* Right side - Menu button */}
        <View style={[styles.sideContainer, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            style={styles.right}
            onPress={() => setRightPanelVisible(true)}
          >
            <MaterialIcons name="menu" size={26} color={colors.text as string} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
  sideContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  left: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  chatIcon: {
    marginRight: 4,
  },
  centerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});