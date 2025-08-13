import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', location: 'New York, USA', specialty: 'Feline Internal Medicine', rating: 4.9, image: '🐱' },
  { id: 2, name: 'Dr. Hiroshi Tanaka', location: 'Tokyo, Japan', specialty: 'Veterinary Surgery', rating: 4.8, image: '🏥' },
  { id: 3, name: 'Dr. Emma Wilson', location: 'London, UK', specialty: 'Emergency Pet Care', rating: 4.7, image: '🚨' },
  { id: 4, name: 'Dr. Marco Silva', location: 'São Paulo, Brazil', specialty: 'Cat Behavior', rating: 4.9, image: '🧠' },
  { id: 5, name: 'Dr. Anna Mueller', location: 'Berlin, Germany', specialty: 'Feline Cardiology', rating: 4.8, image: '❤️' },
  { id: 6, name: 'Dr. Chen Wei', location: 'Shanghai, China', specialty: 'Pet Dermatology', rating: 4.6, image: '🔬' },
  { id: 7, name: 'Dr. Priya Patel', location: 'Mumbai, India', specialty: 'Feline Nutrition', rating: 4.7, image: '🥗' },
  { id: 8, name: 'Dr. Jean Dubois', location: 'Paris, France', specialty: 'Cat Oncology', rating: 4.9, image: '🎗️' },
  { id: 9, name: 'Dr. Lars Andersen', location: 'Copenhagen, Denmark', specialty: 'Pet Dental Care', rating: 4.8, image: '🦷' },
];

export default function DoctorsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestMessage}>
          <Ionicons name="person-outline" size={64} color={colors.accent as string} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>Sign In Required</Text>
          <Text style={[styles.guestSubtitle, { color: colors.text }]}>
            Please sign in to access doctor consultations and medical services.
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="medical" size={32} color={colors.accent as string} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Pet Doctors Worldwide</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>Connect with specialized veterinarians</Text>
        </View>
        
        {mockDoctors.map((doctor) => (
          <TouchableOpacity 
            key={doctor.id} 
            style={[styles.doctorCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.doctorHeader}>
              <Text style={styles.doctorImage}>{doctor.image}</Text>
              <View style={styles.doctorInfo}>
                <Text style={[styles.doctorName, { color: colors.text }]}>{doctor.name}</Text>
                <Text style={[styles.doctorLocation, { color: colors.text }]}>{doctor.location}</Text>
                <Text style={[styles.doctorSpecialty, { color: colors.accent }]}>{doctor.specialty}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.rating, { color: colors.text }]}>{doctor.rating}</Text>
              </View>
            </View>
            <View style={[styles.actionButtons]}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={styles.buttonText}>Book Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={styles.buttonText}>View Profile</Text>
              </TouchableOpacity>
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
  header: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  doctorCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    fontSize: 32,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  doctorLocation: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
