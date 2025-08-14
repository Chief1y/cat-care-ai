import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Web-compatible storage wrapper
const WebStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage getItem error:', error);
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (error) {
        console.error('localStorage setItem error:', error);
        throw error;
      }
    }
    return AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
        return;
      } catch (error) {
        console.error('localStorage removeItem error:', error);
        throw error;
      }
    }
    return AsyncStorage.removeItem(key);
  },

  async multiRemove(keys: string[]): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        keys.forEach(key => localStorage.removeItem(key));
        return;
      } catch (error) {
        console.error('localStorage multiRemove error:', error);
        throw error;
      }
    }
    return AsyncStorage.multiRemove(keys);
  }
};

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  type: 'pet_owner' | 'doctor';
  createdAt: string;
  subscription?: {
    type: 'free' | 'monthly' | 'yearly';
    expiresAt?: string;
    isActive: boolean;
  };
  usage?: {
    aiRequests: number;
    freeRequestsUsed: number;
    lastFreeRequestReset: string;
    hasUsedFirstConsult: boolean;
  };
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  ownerId: string;
}

export interface DoctorCall {
  id: string;
  patientName: string;
  petName: string;
  petBreed: string;
  callDate: string;
  callTime: string;
  status: 'completed' | 'missed' | 'scheduled';
  duration?: string;
}

const STORAGE_KEYS = {
  USERS: '@pet_ai_users',
  CURRENT_USER: '@pet_ai_current_user',
  PETS: '@pet_ai_pets',
  DOCTOR_CALLS: '@pet_ai_doctor_calls'
};

export class StorageService {
  // User Management
  static async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getUsers();
      users.push(user);
      await WebStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async getUsers(): Promise<User[]> {
    try {
      const usersJson = await WebStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  static async findUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  static async validateLogin(username: string, password: string): Promise<User | null> {
    console.log('Validating login for:', username);
    const users = await this.getUsers();
    console.log('Available users:', users.map(u => ({ username: u.username, type: u.type })));
    const user = users.find(user => user.username === username);
    console.log('Found user:', user ? { username: user.username, type: user.type } : 'null');
    if (user && user.password === password) {
      console.log('Password matches, login successful');
      return user;
    }
    console.log('Login failed - user not found or password mismatch');
    return null;
  }

  static async updateUser(updatedUser: User): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(user => user.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await WebStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Update current user session if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === updatedUser.id) {
          await WebStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Current User Session
  static async setCurrentUser(user: User): Promise<void> {
    await WebStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await WebStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    await WebStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Pet Management
  static async savePet(pet: Pet): Promise<void> {
    try {
      const pets = await this.getPets();
      // Remove existing pet for this owner (one pet per owner for now)
      const filteredPets = pets.filter(p => p.ownerId !== pet.ownerId);
      filteredPets.push(pet);
      await WebStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(filteredPets));
    } catch (error) {
      console.error('Error saving pet:', error);
      throw error;
    }
  }

  static async getPets(): Promise<Pet[]> {
    try {
      const petsJson = await WebStorage.getItem(STORAGE_KEYS.PETS);
      return petsJson ? JSON.parse(petsJson) : [];
    } catch (error) {
      console.error('Error getting pets:', error);
      return [];
    }
  }

  static async getPetByOwnerId(ownerId: string): Promise<Pet | null> {
    const pets = await this.getPets();
    return pets.find(pet => pet.ownerId === ownerId) || null;
  }

  // Doctor Calls (Mock Data)
  static async initializeMockDoctorCalls(): Promise<void> {
    const existingCalls = await this.getDoctorCalls();
    if (existingCalls.length === 0) {
      const mockCalls: DoctorCall[] = [
        {
          id: 'call-1',
          patientName: 'Sarah Johnson',
          petName: 'Whiskers',
          petBreed: 'Persian',
          callDate: '2025-08-12',
          callTime: '14:30',
          status: 'completed',
          duration: '25 min'
        },
        {
          id: 'call-2',
          patientName: 'Mike Chen',
          petName: 'Luna',
          petBreed: 'British Shorthair',
          callDate: '2025-08-13',
          callTime: '09:15',
          status: 'completed',
          duration: '18 min'
        }
      ];
      await WebStorage.setItem(STORAGE_KEYS.DOCTOR_CALLS, JSON.stringify(mockCalls));
    }
  }

  static async getDoctorCalls(): Promise<DoctorCall[]> {
    try {
      const callsJson = await WebStorage.getItem(STORAGE_KEYS.DOCTOR_CALLS);
      return callsJson ? JSON.parse(callsJson) : [];
    } catch (error) {
      console.error('Error getting doctor calls:', error);
      return [];
    }
  }

  // Initialize demo users for testing
  static async initializeDemoUsers(): Promise<void> {
    try {
      console.log('Initializing demo users...');
      const existingUsers = await this.getUsers();
      console.log('Existing users:', existingUsers.length);
      if (existingUsers.length === 0) {
        console.log('No existing users, creating demo users...');
        // Create demo doctor
        const doctorId = Date.now().toString() + '_doctor';
        const doctorUser: User = {
          id: doctorId,
          username: 'doctor',
          password: 'password',
          name: 'Dr. Sarah Johnson',
          type: 'doctor',
          createdAt: new Date().toISOString()
        };

        // Create demo pet owner
        const ownerId = Date.now().toString() + '_owner';
        const petOwnerUser: User = {
          id: ownerId,
          username: 'petowner',
          password: 'password',
          name: 'Alex Smith',
          type: 'pet_owner',
          createdAt: new Date().toISOString()
        };

        // Create demo pet
        const petId = Date.now().toString() + '_pet';
        const demoPet: Pet = {
          id: petId,
          name: 'Whiskers',
          breed: 'Persian',
          age: 3,
          ownerId: ownerId
        };

        // Save demo data
        const users = [doctorUser, petOwnerUser];
        const pets = [demoPet];
        
        await WebStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        await WebStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));

        console.log('Demo users initialized successfully:', users.map(u => ({ username: u.username, type: u.type })));
      } else {
        console.log('Demo users already exist');
      }
    } catch (error) {
      console.error('Error initializing demo users:', error);
    }
  }

  // Utility
  static async clearAllData(): Promise<void> {
    await WebStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}
