import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet, Dimensions, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(300, width * 0.8);

export default function RightPanel({ visible, onClose } : { visible: boolean; onClose: () => void; }) {
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);

  // Fallback for safe area insets if not available
  const safeTop = insets?.top || 20;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Opening animation
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: PANEL_WIDTH,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      {/* Full screen touchable overlay */}
      <TouchableOpacity 
        style={StyleSheet.absoluteFillObject} 
        activeOpacity={1} 
        onPress={onClose} 
      />
      
      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX }],
            backgroundColor: colors.card,
            width: PANEL_WIDTH,
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
          }
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: safeTop + 20 }]}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="close" size={20} color={colors.text as string} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
            <Text style={[styles.itemText, { color: colors.text }]}>Login</Text>
            <Ionicons name="log-in-outline" size={20} color={colors.text as string} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
            <Text style={[styles.itemText, { color: colors.text }]}>Register</Text>
            <Ionicons name="person-add-outline" size={20} color={colors.text as string} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
            <Text style={[styles.itemText, { color: colors.text }]}>Language</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>🇬🇧</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
            <Text style={[styles.itemText, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeToggle}>
              <Text style={[styles.itemValue, { color: colors.text }]}>{theme === 'light' ? 'Light' : 'Dark'}</Text>
              <Ionicons 
                name={theme === 'light' ? 'sunny-outline' : 'moon-outline'} 
                size={20} 
                color={colors.text as string} 
              />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }]}>
            <Text style={[styles.itemText, { color: colors.text }]}>General settings</Text>
            <Ionicons name="settings-outline" size={20} color={colors.text as string} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999, // Very high z-index to cover everything
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    minHeight: 50,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 8,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 70,
    justifyContent: 'flex-end',
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.3,
  },
});