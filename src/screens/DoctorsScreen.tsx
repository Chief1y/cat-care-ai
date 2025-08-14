import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';

const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', location: 'New York, USA', specialty: 'Feline Internal Medicine', rating: 4.9, image: '🐱', price: 120 },
  { id: 2, name: 'Dr. Hiroshi Tanaka', location: 'Tokyo, Japan', specialty: 'Veterinary Surgery', rating: 4.8, image: '🏥', price: 180 },
  { id: 3, name: 'Dr. Emma Wilson', location: 'London, UK', specialty: 'Emergency Pet Care', rating: 4.7, image: '🚨', price: 200 },
  { id: 4, name: 'Dr. Marco Silva', location: 'São Paulo, Brazil', specialty: 'Cat Behavior', rating: 4.9, image: '🧠', price: 90 },
  { id: 5, name: 'Dr. Anna Mueller', location: 'Berlin, Germany', specialty: 'Feline Cardiology', rating: 4.8, image: '❤️', price: 150 },
  { id: 6, name: 'Dr. Chen Wei', location: 'Shanghai, China', specialty: 'Pet Dermatology', rating: 4.6, image: '🔬', price: 110 },
  { id: 7, name: 'Dr. Priya Patel', location: 'Mumbai, India', specialty: 'Feline Nutrition', rating: 4.7, image: '🥗', price: 85 },
  { id: 8, name: 'Dr. Jean Dubois', location: 'Paris, France', specialty: 'Cat Oncology', rating: 4.9, image: '🎗️', price: 220 },
  { id: 9, name: 'Dr. Lars Andersen', location: 'Copenhagen, Denmark', specialty: 'Pet Dental Care', rating: 4.8, image: '🦷', price: 130 },
];

export default function DoctorsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { hasUsedFirstConsult, markFirstConsultUsed } = useSubscription();

  const getDiscountedPrice = (originalPrice: number) => {
    return Math.round(originalPrice * 0.3); // 70% off = 30% of original price
  };

  const handleBookConsultation = async (doctor: any) => {
    const isFirstConsult = !hasUsedFirstConsult;
    const price = isFirstConsult ? getDiscountedPrice(doctor.price) : doctor.price;
    const savings = isFirstConsult ? doctor.price - price : 0;
    
    Alert.alert(
      'Book Online Conversation',
      `Doctor: ${doctor.name}\n${isFirstConsult ? `Special First Consult Price: $${price} (Save $${savings}!)` : `Consultation Fee: $${doctor.price}`}\n\nProceed with booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: async () => {
            if (isFirstConsult) {
              await markFirstConsultUsed();
            }
            Alert.alert('Booking Confirmed', `Your consultation with ${doctor.name} has been booked!`);
          }
        }
      ]
    );
  };
  
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
        
        {mockDoctors.map((doctor) => {
          const isFirstConsult = !hasUsedFirstConsult;
          const discountedPrice = getDiscountedPrice(doctor.price);
          
          return (
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
                  
                  {/* Pricing Display */}
                  <View style={styles.pricingContainer}>
                    {isFirstConsult ? (
                      <View style={styles.firstConsultPricing}>
                        <Text style={[styles.originalPrice, { color: colors.text }]}>
                          ${doctor.price}
                        </Text>
                        <Text style={[styles.discountedPrice, { color: '#FF6B6B' }]}>
                          ${discountedPrice}
                        </Text>
                        <View style={[styles.discountBadge, { backgroundColor: '#FF6B6B' }]}>
                          <Text style={styles.discountText}>70% OFF</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={[styles.regularPrice, { color: colors.text }]}>
                        ${doctor.price}
                      </Text>
                    )}
                    <Text style={[styles.firstConsultNote, { color: colors.accent }]}>
                      {isFirstConsult ? 'First consultation special!' : 'Per consultation'}
                    </Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.rating, { color: colors.text }]}>{doctor.rating}</Text>
                </View>
              </View>
              <View style={[styles.actionButtons]}>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={() => handleBookConsultation(doctor)}
                >
                  <Ionicons name="videocam" size={16} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Book Online Conversation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="person" size={16} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
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
  pricingContainer: {
    marginTop: 8,
  },
  firstConsultPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  regularPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  firstConsultNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  buttonIcon: {
    marginRight: 6,
  },
});
