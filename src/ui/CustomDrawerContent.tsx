import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { navigation } = props;

  const menuItems = [
    { name: 'Home', icon: 'home-outline', screen: 'Home' },
    { name: 'Map', icon: 'map-outline', screen: 'Map' },
    { name: 'Nearby Vets', icon: 'medical-outline', screen: 'Vets' },
    { name: 'Doctors', icon: 'person-outline', screen: 'Doctors' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Ionicons name="heart" size={32} color="#fff" />
          <Text style={styles.headerTitle}>CatCare AI</Text>
          <Text style={styles.headerSubtitle}>Pet Health Assistant</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                navigation.navigate('Main', { screen: item.screen });
                navigation.closeDrawer();
              }}
            >
              <Ionicons name={item.icon as any} size={24} color={colors.accent as string} />
              <Text style={[styles.menuText, { color: colors.text }]}>{item.name}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color={colors.text as string} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            Version 1.0.0
          </Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
