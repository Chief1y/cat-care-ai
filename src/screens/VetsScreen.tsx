import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const mockVetClinics = [
  { id: 1, name: 'City Pet Emergency Center', distance: '0.5 miles', rating: 4.8, services: 'Emergency, Surgery', phone: '+1-555-0123' },
  { id: 2, name: 'Happy Paws Veterinary Clinic', distance: '1.2 miles', rating: 4.9, services: 'General Care, Dental', phone: '+1-555-0124' },
  { id: 3, name: 'Animal Health Center', distance: '2.1 miles', rating: 4.7, services: 'Specialized Care, X-Ray', phone: '+1-555-0125' },
  { id: 4, name: 'Pet Care Plus', distance: '2.8 miles', rating: 4.6, services: 'Grooming, Vaccination', phone: '+1-555-0126' },
  { id: 5, name: 'Downtown Vet Hospital', distance: '3.5 miles', rating: 4.8, services: 'Surgery, Oncology', phone: '+1-555-0127' },
];

export default function VetsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestMessage}>
          <Ionicons name="medical-outline" size={64} color={colors.accent as string} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>Sign In Required</Text>
          <Text style={[styles.guestSubtitle, { color: colors.text }]}>
            Please sign in to view nearby veterinary clinics and access location-based services.
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mock Map Area */}
        <View style={[styles.mapContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.mapPlaceholder, { color: colors.text }]}>🗺️</Text>
          <Text style={[styles.mapText, { color: colors.text }]}>Interactive Map View</Text>
          <Text style={[styles.mapSubtext, { color: colors.text }]}>Tap to explore nearby vet clinics</Text>
          <View style={styles.mapIcons}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.pinIcon}>🏥</Text>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.pinIcon}>🏥</Text>
            <Text style={styles.pinIcon}>📍</Text>
          </View>
        </View>
        
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="medical" size={24} color={colors.accent as string} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Nearby Veterinary Clinics</Text>
        </View>
        
        {mockVetClinics.map((clinic) => (
          <TouchableOpacity 
            key={clinic.id} 
            style={[styles.clinicCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.clinicHeader}>
              <View style={styles.clinicIcon}>
                <Ionicons name="medical" size={24} color={colors.accent as string} />
              </View>
              <View style={styles.clinicInfo}>
                <Text style={[styles.clinicName, { color: colors.text }]}>{clinic.name}</Text>
                <Text style={[styles.clinicServices, { color: colors.text }]}>{clinic.services}</Text>
                <View style={styles.clinicMeta}>
                  <View style={styles.distance}>
                    <Ionicons name="location-outline" size={14} color={colors.accent as string} />
                    <Text style={[styles.distanceText, { color: colors.text }]}>{clinic.distance}</Text>
                  </View>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{clinic.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                  <Ionicons name="call" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="navigate" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  mapIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  pinIcon: {
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clinicCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicIcon: {
    marginRight: 12,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clinicServices: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  clinicMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
  },
});
