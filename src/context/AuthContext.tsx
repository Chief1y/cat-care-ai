import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService, User, Pet } from '../services/StorageService';

type AuthContextType = {
  user: User | null;
  pet: Pet | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  savePet: (petData: Omit<Pet, 'id' | 'ownerId'>) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on app start
  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      // Initialize demo users if none exist
      await StorageService.initializeDemoUsers();
      
      const currentUser = await StorageService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.type === 'pet_owner') {
          const userPet = await StorageService.getPetByOwnerId(currentUser.id);
          setPet(userPet);
        }
        // Initialize mock doctor calls if user is a doctor
        if (currentUser.type === 'doctor') {
          await StorageService.initializeMockDoctorCalls();
        }
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const validUser = await StorageService.validateLogin(username, password);
      if (validUser) {
        await StorageService.setCurrentUser(validUser);
        setUser(validUser);
        
        if (validUser.type === 'pet_owner') {
          const userPet = await StorageService.getPetByOwnerId(validUser.id);
          setPet(userPet);
        } else if (validUser.type === 'doctor') {
          await StorageService.initializeMockDoctorCalls();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await StorageService.logout();
      setUser(null);
      setPet(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // Check if username already exists
      const existingUser = await StorageService.findUserByUsername(userData.username);
      if (existingUser) {
        return false; // Username taken
      }

      const newUser: User = {
        ...userData,
        id: 'user-' + Date.now(),
        createdAt: new Date().toISOString()
      };

      await StorageService.saveUser(newUser);
      await StorageService.setCurrentUser(newUser);
      setUser(newUser);
      
      if (newUser.type === 'doctor') {
        await StorageService.initializeMockDoctorCalls();
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const savePet = async (petData: Omit<Pet, 'id' | 'ownerId'>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    const newPet: Pet = {
      ...petData,
      id: 'pet-' + Date.now(),
      ownerId: user.id
    };

    await StorageService.savePet(newPet);
    setPet(newPet);
  };

  const refreshUserData = async (): Promise<void> => {
    if (user && user.type === 'pet_owner') {
      const userPet = await StorageService.getPetByOwnerId(user.id);
      setPet(userPet);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      pet,
      isLoading,
      login,
      logout,
      register,
      savePet,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
