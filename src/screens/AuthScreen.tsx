import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import NameStepScreen from './NameStepScreen';
import PetStepScreen from './PetStepScreen';

type AuthStep = 'login' | 'register' | 'name' | 'pet';

interface RegistrationData {
  username: string;
  password: string;
  userType: 'petowner' | 'doctor';
  firstName?: string;
  lastName?: string;
}

export default function AuthScreen({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    username: '',
    password: '',
    userType: 'petowner'
  });

  const { colors } = useTheme();

  const handleNavigateToRegister = () => {
    setCurrentStep('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentStep('login');
  };

  const handleNavigateToNameStep = (credentials: { username: string; password: string; userType: 'petowner' | 'doctor' }) => {
    setRegistrationData(credentials);
    setCurrentStep('name');
  };

  const handleNavigateToPetStep = (nameData: { firstName: string; lastName: string }) => {
    setRegistrationData(prev => ({ ...prev, ...nameData }));
    setCurrentStep('pet');
  };

  const handleBackToRegister = () => {
    setCurrentStep('register');
  };

  const handleBackToNameStep = () => {
    setCurrentStep('name');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToRegister={handleNavigateToRegister}
            onClose={onClose}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToNameStep={handleNavigateToNameStep}
          />
        );
      
      case 'name':
        return (
          <NameStepScreen
            credentials={registrationData}
            onNavigateToPetStep={registrationData.userType === 'petowner' ? handleNavigateToPetStep : undefined}
            onBack={handleBackToRegister}
          />
        );
      
      case 'pet':
        return (
          <PetStepScreen
            credentials={{
              ...registrationData,
              firstName: registrationData.firstName || '',
              lastName: registrationData.lastName || ''
            }}
            onBack={handleBackToNameStep}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderCurrentStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
