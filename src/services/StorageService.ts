import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  type: 'pet_owner' | 'doctor';
  createdAt: string;
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
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
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
    const user = await this.findUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Current User Session
  static async setCurrentUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Pet Management
  static async savePet(pet: Pet): Promise<void> {
    try {
      const pets = await this.getPets();
      // Remove existing pet for this owner (one pet per owner for now)
      const filteredPets = pets.filter(p => p.ownerId !== pet.ownerId);
      filteredPets.push(pet);
      await AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(filteredPets));
    } catch (error) {
      console.error('Error saving pet:', error);
      throw error;
    }
  }

  static async getPets(): Promise<Pet[]> {
    try {
      const petsJson = await AsyncStorage.getItem(STORAGE_KEYS.PETS);
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
      await AsyncStorage.setItem(STORAGE_KEYS.DOCTOR_CALLS, JSON.stringify(mockCalls));
    }
  }

  static async getDoctorCalls(): Promise<DoctorCall[]> {
    try {
      const callsJson = await AsyncStorage.getItem(STORAGE_KEYS.DOCTOR_CALLS);
      return callsJson ? JSON.parse(callsJson) : [];
    } catch (error) {
      console.error('Error getting doctor calls:', error);
      return [];
    }
  }

  // Initialize demo users for testing
  static async initializeDemoUsers(): Promise<void> {
    try {
      const existingUsers = await this.getUsers();
      if (existingUsers.length === 0) {
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
        
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        await AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));

        console.log('Demo users initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing demo users:', error);
    }
  }

  // Utility
  static async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}
