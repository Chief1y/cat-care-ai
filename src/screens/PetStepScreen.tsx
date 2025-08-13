import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  credentials: { 
    username: string; 
    password: string; 
    userType: 'petowner' | 'doctor';
    firstName: string;
    lastName: string;
  };
  onBack: () => void;
};

const BREEDS = [
  'Persian',
  'Maine Coon',
  'British Shorthair',
  'Ragdoll',
  'Siamese',
  'American Shorthair',
  'Scottish Fold',
  'Sphynx',
  'Russian Blue'
];

export default function PetStepScreen({ credentials, onBack }: Props) {
  const [petName, setPetName] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { colors } = useTheme();
  const { register, savePet } = useAuth();
  const insets = useSafeAreaInsets();

  const handleCompleteRegistration = async () => {
    if (!petName.trim() || !selectedBreed.trim() || !petAge.trim()) {
      Alert.alert('Error', 'Please fill in all pet information');
      return;
    }

    const age = parseInt(petAge);
    if (isNaN(age) || age < 0 || age > 30) {
      Alert.alert('Error', 'Please enter a valid age (0-30 years)');
      return;
    }

    setIsLoading(true);
    try {
      // First register the user
      const success = await register({
        username: credentials.username,
        password: credentials.password,
        name: `${credentials.firstName} ${credentials.lastName}`,
        type: 'pet_owner'
      });
      
      if (success) {
        // Then add the pet
        await savePet({
          name: petName.trim(),
          breed: selectedBreed,
          age: age
        });
        
        Alert.alert(
          'Welcome to CatCare AI!', 
          `Your account has been created and ${petName} has been added to your profile. You can now start chatting with our AI veterinarian!`,
          [{ text: 'Get Started' }]
        );
      } else {
        Alert.alert('Registration Failed', 'Username already exists. Please choose a different username.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectBreed = (breed: string) => {
    setSelectedBreed(breed);
    setShowBreedModal(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
          {/* Header with back button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text as string} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: colors.accent }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.accent }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.accent }]} />
            </View>
          </View>

          <View style={styles.header}>
            <Ionicons name="heart" size={48} color={colors.accent as string} />
            <Text style={[styles.title, { color: colors.text }]}>Tell us about your cat</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              This helps us provide better care recommendations
            </Text>
          </View>

          {/* Pet Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Cat's Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="heart-outline" size={20} color={colors.text as string} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="What's your cat's name?"
                  placeholderTextColor={colors.text as string + '60'}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Breed</Text>
              <TouchableOpacity
                style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setShowBreedModal(true)}
              >
                <Ionicons name="paw-outline" size={20} color={colors.text as string} style={styles.inputIcon} />
                <Text style={[
                  styles.input,
                  { color: selectedBreed ? colors.text : colors.text as string + '60' }
                ]}>
                  {selectedBreed || 'Select your cat\'s breed'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.text as string} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Age (years)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="calendar-outline" size={20} color={colors.text as string} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={petAge}
                  onChangeText={setPetAge}
                  placeholder="How old is your cat?"
                  placeholderTextColor={colors.text as string + '60'}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: colors.accent }]}
              onPress={handleCompleteRegistration}
              disabled={isLoading}
            >
              <Text style={styles.completeButtonText}>
                {isLoading ? 'Creating Your Account...' : 'Complete Registration'}
              </Text>
              {!isLoading && (
                <Ionicons name="checkmark" size={20} color="#fff" style={styles.buttonIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Breed Selection Modal */}
      <Modal
        visible={showBreedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBreedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Breed</Text>
              <TouchableOpacity
                onPress={() => setShowBreedModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text as string} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.breedList}>
              {BREEDS.map((breed) => (
                <TouchableOpacity
                  key={breed}
                  style={[
                    styles.breedOption,
                    { 
                      backgroundColor: selectedBreed === breed ? colors.accent : 'transparent',
                      borderBottomColor: colors.border
                    }
                  ]}
                  onPress={() => selectBreed(breed)}
                >
                  <Text style={[
                    styles.breedText,
                    { color: selectedBreed === breed ? '#fff' : colors.text }
                  ]}>
                    {breed}
                  </Text>
                  {selectedBreed === breed && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[styles.breedOption, { borderBottomColor: colors.border }]}
                onPress={() => selectBreed('Other')}
              >
                <Text style={[styles.breedText, { color: colors.text }]}>Other</Text>
                {selectedBreed === 'Other' && (
                  <Ionicons name="checkmark" size={20} color={colors.accent as string} />
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  completeButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  breedList: {
    paddingHorizontal: 20,
  },
  breedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  breedText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
