import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="heart" size={48} color={colors.accent as string} style={styles.icon} />
        <Text style={[styles.title, { color: colors.text }]}>Welcome to CatCare AI</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Your AI assistant for cat health. Use the ChatBot button above to ask questions about your cat's health and get helpful advice.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  welcomeCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 400,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 24,
    opacity: 0.8,
  },
});
