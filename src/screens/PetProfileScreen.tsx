import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeInsets } from '../hooks/useSafeInsets';
import { useNavigation } from '@react-navigation/native';

export default function PetProfileScreen() {
  const { colors } = useTheme();
  const { pet, user } = useAuth();
  const insets = useSafeInsets();
  const navigation = useNavigation();

  if (!pet || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text as string} />
          </TouchableOpacity>
          
          <View style={styles.centerContent}>
            <Ionicons name="paw-outline" size={64} color={colors.accent as string} />
            <Text style={[styles.title, { color: colors.text }]}>No Pet Found</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Add a pet to your profile to see their information here.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const handleEditPet = () => {
    Alert.alert(
      'Edit Pet Profile',
      'Pet profile editing will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleMedicalHistory = () => {
    Alert.alert(
      'Medical History',
      'Medical history tracking will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleVaccinations = () => {
    Alert.alert(
      'Vaccination Records',
      'Vaccination tracking will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const getAgeText = () => {
    if (pet.age === 1) {
      return '1 year old';
    }
    return `${pet.age} years old`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text as string} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.accent }]}
              onPress={handleEditPet}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Pet Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>{pet.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
            <Text style={[styles.petDetails, { color: colors.text }]}>
              {pet.breed} • {getAgeText()}
            </Text>
          </View>

          {/* Pet Info Cards */}
          <View style={styles.infoSection}>
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={colors.accent as string} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>Basic Information</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.text }]}>Name:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{pet.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.text }]}>Breed:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{pet.breed}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.text }]}>Age:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{getAgeText()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.text }]}>Owner:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{user.name}</Text>
                </View>
              </View>
            </View>

            {/* Medical History Card */}
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleMedicalHistory}
            >
              <View style={styles.actionHeader}>
                <Ionicons name="medical" size={24} color={colors.accent as string} />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>Medical History</Text>
                  <Text style={[styles.actionSubtitle, { color: colors.text }]}>View past consultations and treatments</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text as string} />
              </View>
            </TouchableOpacity>

            {/* Vaccinations Card */}
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleVaccinations}
            >
              <View style={styles.actionHeader}>
                <Ionicons name="shield-checkmark" size={24} color={colors.accent as string} />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: colors.text }]}>Vaccinations</Text>
                  <Text style={[styles.actionSubtitle, { color: colors.text }]}>Track vaccination records and schedules</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text as string} />
              </View>
            </TouchableOpacity>

            {/* Health Stats Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.infoHeader}>
                <Ionicons name="analytics" size={24} color={colors.accent as string} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>Health Overview</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.accent }]}>3</Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>AI Consultations</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.accent }]}>1</Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>Vet Visits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.accent }]}>✓</Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>Up to Date</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  petName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  petDetails: {
    fontSize: 16,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});
