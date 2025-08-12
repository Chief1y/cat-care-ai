import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Mock Google Maps Interface */}
      <View style={[styles.mapContainer, { backgroundColor: colors.surface }]}>
        {/* Map Background */}
        <View style={styles.mapBackground}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={[styles.mapLabel, { color: colors.text }]}>Interactive Map</Text>
        </View>
        
        {/* Location Pins */}
        <View style={styles.pin1}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        <View style={styles.pin2}>
          <Text style={styles.pinIcon}>🏥</Text>
        </View>
        <View style={styles.pin3}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        
        {/* Current Location */}
        <View style={styles.currentLocation}>
          <View style={[styles.currentDot, { backgroundColor: colors.primary }]} />
        </View>
        
        {/* Map Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card }]}>
            <Ionicons name="add" size={20} color={colors.text as string} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card }]}>
            <Ionicons name="remove" size={20} color={colors.text as string} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card }]}>
            <Ionicons name="locate" size={20} color={colors.text as string} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.text as string} />
          <Text style={[styles.searchText, { color: colors.text }]}>Search for places...</Text>
        </View>
      </View>
      
      {/* Bottom Info Panel */}
      <View style={[styles.infoPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.infoPanelHeader}>
          <Ionicons name="map" size={24} color={colors.accent as string} />
          <Text style={[styles.infoPanelTitle, { color: colors.text }]}>Pet Services Map</Text>
        </View>
        <Text style={[styles.infoPanelText, { color: colors.text }]}>
          Navigate around to find veterinary clinics, pet stores, and emergency services near you.
        </Text>
        <View style={styles.mapFeatures}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏥</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>Vet Clinics</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚨</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>Emergency</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🏪</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>Pet Stores</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  mapEmoji: {
    fontSize: 120,
    marginBottom: 16,
  },
  mapLabel: {
    fontSize: 24,
    fontWeight: '600',
  },
  pin1: {
    position: 'absolute',
    top: '20%',
    left: '30%',
  },
  pin2: {
    position: 'absolute',
    top: '40%',
    right: '25%',
  },
  pin3: {
    position: 'absolute',
    bottom: '35%',
    left: '20%',
  },
  pinIcon: {
    fontSize: 32,
  },
  currentLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  currentDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: '30%',
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    gap: 12,
  },
  searchText: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoPanel: {
    padding: 20,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoPanelTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoPanelText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  mapFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
