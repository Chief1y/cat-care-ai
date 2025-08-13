import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeInsets } from '../hooks/useSafeInsets';

type Props = {
  credentials: { username: string; password: string; userType: 'petowner' | 'doctor' };
  onNavigateToPetStep?: (nameData: { firstName: string; lastName: string }) => void;
  onBack: () => void;
};

export default function NameStepScreen({ credentials, onNavigateToPetStep, onBack }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { colors } = useTheme();
  const { register } = useAuth();
  const insets = useSafeInsets();

  const handleContinue = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter your full name');
      } else {
        Alert.alert('Error', 'Please enter your full name');
      }
      return;
    }

    if (credentials.userType === 'doctor') {
      // For doctors, complete registration
      setIsLoading(true);
      try {
        const userData = {
          username: credentials.username,
          password: credentials.password,
          name: `${firstName.trim()} ${lastName.trim()}`,
          type: 'doctor' as const
        };
        
        const success = await register(userData);
        
        if (success) {
          if (Platform.OS === 'web') {
            window.alert('Registration successful! You are now logged in.');
          } else {
            Alert.alert('Success', 'Registration successful! You are now logged in.');
          }
        } else {
          if (Platform.OS === 'web') {
            window.alert('Registration failed. Username might already exist.');
          } else {
            Alert.alert('Error', 'Registration failed. Username might already exist.');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (Platform.OS === 'web') {
          window.alert('Something went wrong. Please try again.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // For pet owners, go to pet registration step
      if (onNavigateToPetStep) {
        onNavigateToPetStep({
          firstName: firstName.trim(),
          lastName: lastName.trim()
        });
      }
    }
  };

  const getTitle = () => {
    return credentials.userType === 'doctor' 
      ? "What's your name, Doctor?" 
      : "What's your name?";
  };

  const getSubtitle = () => {
    return credentials.userType === 'doctor'
      ? "Let's set up your veterinarian profile"
      : "Let's personalize your CatCare experience";
  };

  const getButtonText = () => {
    if (isLoading) return 'Creating Account...';
    return credentials.userType === 'doctor' ? 'Complete Registration' : 'Continue';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Header with back button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text as string} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, { backgroundColor: colors.accent }]} />
            <View style={[styles.progressDot, { backgroundColor: colors.accent }]} />
            <View style={[
              styles.progressDot, 
              { backgroundColor: credentials.userType === 'doctor' ? colors.accent : colors.border }
            ]} />
          </View>
        </View>

        <View style={styles.header}>
          <Ionicons 
            name={credentials.userType === 'doctor' ? 'medical' : 'person'} 
            size={48} 
            color={colors.accent as string} 
          />
          <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>{getSubtitle()}</Text>
        </View>

        {/* Name Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={colors.text as string + '60'}
                autoCapitalize="words"
                autoComplete="given-name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor={colors.text as string + '60'}
                autoCapitalize="words"
                autoComplete="family-name"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.accent }]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            <Text style={styles.continueButtonText}>
              {getButtonText()}
            </Text>
            {!isLoading && (
              <Ionicons 
                name={credentials.userType === 'doctor' ? 'checkmark' : 'arrow-forward'} 
                size={20} 
                color="#fff" 
                style={styles.buttonIcon} 
              />
            )}
          </TouchableOpacity>

          {credentials.userType === 'petowner' && (
            <View style={[styles.nextStepInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="information-circle" size={20} color={colors.accent as string} />
              <Text style={[styles.nextStepText, { color: colors.text }]}>
                Next: We'll help you add your pet's information
              </Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    height: '100%',
  },
  continueButton: {
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  nextStepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    gap: 12,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    opacity: 0.8,
  },
});
