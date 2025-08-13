import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, pet } = useAuth();

  const handleMyPetPress = () => {
    if (pet) {
      Alert.alert(
        `${pet.name}'s Profile`,
        `Name: ${pet.name}\nBreed: ${pet.breed}\nAge: ${pet.age} years`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('No Pet Found', 'Please add a pet to your profile.');
    }
  };

  const getWelcomeMessage = () => {
    if (user?.type === 'doctor') {
      return {
        title: `Welcome back, Dr. ${user.name.split(' ')[user.name.split(' ').length - 1]}`,
        subtitle: 'Access your recent consultations and help pet owners with their questions.',
        icon: 'medical' as const
      };
    } else {
      return {
        title: pet ? `Welcome back, ${user?.name}!` : 'Welcome to CatCare AI',
        subtitle: pet 
          ? `${pet.name} is lucky to have you! Use our AI assistant for health advice and find nearby veterinarians.`
          : 'Your AI assistant for cat health. Use the ChatBot button above to ask questions about your cat\'s health and get helpful advice.',
        icon: 'heart' as const
      };
    }
  };

  const welcomeMessage = getWelcomeMessage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name={welcomeMessage.icon} size={48} color={colors.accent as string} style={styles.icon} />
        <Text style={[styles.title, { color: colors.text }]}>{welcomeMessage.title}</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {welcomeMessage.subtitle}
        </Text>

        {/* My Pet Button for pet owners */}
        {user?.type === 'pet_owner' && (
          <TouchableOpacity
            style={[styles.petButton, { backgroundColor: colors.accent }]}
            onPress={handleMyPetPress}
          >
            <Ionicons name="paw" size={20} color="#fff" />
            <Text style={styles.petButtonText}>
              {pet ? `My Pet: ${pet.name}` : 'Add Pet'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Quick Stats for doctors */}
        {user?.type === 'doctor' && (
          <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.statItem}>
              <Ionicons name="call" size={24} color={colors.accent as string} />
              <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Recent Calls</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color={colors.accent as string} />
              <Text style={[styles.statNumber, { color: colors.text }]}>48</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Total Patients</Text>
            </View>
          </View>
        )}
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
    marginBottom: 24,
  },
  petButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
  },
  petButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },
});
