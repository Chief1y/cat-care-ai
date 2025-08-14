import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const { navigation } = props;
  const { user } = useAuth();
  const { isSubscribed, remainingFreeRequests } = useSubscription();

  // Different menu items based on user type and login status
  const getMenuItems = () => {
    if (!user) {
      // Guest user - only home
      return [
        { name: 'Home', icon: 'home-outline', screen: 'Home' },
      ];
    }

    const baseItems = [
      { name: 'Home', icon: 'home-outline', screen: 'Home' },
      { name: 'Map', icon: 'map-outline', screen: 'Map' },
    ];

    if (user.type === 'doctor') {
      return [
        ...baseItems,
        { name: 'Recent Calls', icon: 'call-outline', screen: 'RecentCalls' },
        { name: 'Patient Records', icon: 'document-text-outline', screen: 'Home' },
        { name: 'Schedule', icon: 'calendar-outline', screen: 'Home' },
      ];
    } else {
      return [
        ...baseItems,
        { name: 'Nearby Vets', icon: 'medical-outline', screen: 'Vets' },
        { name: 'Doctors', icon: 'person-outline', screen: 'Doctors' },
        { name: 'Health Records', icon: 'heart-outline', screen: 'Home' },
        { name: 'Reminders', icon: 'notifications-outline', screen: 'Home' },
      ];
    }
  };

  const getUserTitle = () => {
    if (!user) {
      return 'Guest User';
    }
    if (user.type === 'doctor') {
      return `Dr. ${user.name}`;
    }
    return user.name || 'Pet Owner';
  };

  const getUserSubtitle = () => {
    if (!user) {
      return 'Sign in to unlock all features';
    }
    return user.type === 'doctor' ? 'Veterinarian' : 'Pet Health Assistant';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          {!user ? (
            <Ionicons name="person-outline" size={32} color="#fff" />
          ) : user.type === 'doctor' ? (
            <Ionicons name="medical" size={32} color="#fff" />
          ) : (
            <Image 
              source={require('../../assets/transcat1.png')} 
              style={{ width: 32, height: 32, tintColor: '#fff' }} 
              resizeMode="contain"
            />
          )}
          <Text style={styles.headerTitle}>{getUserTitle()}</Text>
          <Text style={styles.headerSubtitle}>{getUserSubtitle()}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {getMenuItems().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                navigation.navigate('Main', { screen: item.screen });
                navigation.closeDrawer();
              }}
            >
              <Ionicons name={item.icon as any} size={24} color={colors.accent as string} />
              <Text style={[styles.menuText, { color: colors.text }]}>{item.name}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color={colors.text as string} />
            </TouchableOpacity>
          ))}

          {/* Subscription Menu Item - Only for pet owners */}
          {user && user.type !== 'doctor' && (
            <TouchableOpacity
              style={[styles.menuItem, styles.subscriptionItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                navigation.navigate('Main', { screen: 'Subscription' });
                navigation.closeDrawer();
              }}
            >
              <Ionicons 
                name={isSubscribed ? "diamond" : "diamond-outline"} 
                size={24} 
                color={isSubscribed ? "#FFD700" : colors.accent as string} 
              />
              <View style={styles.subscriptionTextContainer}>
                <Text style={[styles.menuText, { color: colors.text }]}>
                  {isSubscribed ? 'Premium Plan' : 'Upgrade to Premium'}
                </Text>
                {!isSubscribed && (
                  <Text style={[styles.subscriptionSubtext, { color: colors.accent }]}>
                    {remainingFreeRequests} free requests left
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={colors.text as string} />
            </TouchableOpacity>
          )}

          {/* Comments Menu Item - Only for doctors */}
          {user && user.type === 'doctor' && (
            <TouchableOpacity
              style={[styles.menuItem, styles.commentsItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                // TODO: Navigate to comments/reviews screen
                navigation.closeDrawer();
              }}
            >
              <Ionicons name="star-outline" size={24} color={colors.accent as string} />
              <View style={styles.subscriptionTextContainer}>
                <Text style={[styles.menuText, { color: colors.text }]}>Reviews & Feedback</Text>
                <Text style={[styles.subscriptionSubtext, { color: colors.accent }]}>
                  View patient reviews
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={colors.text as string} />
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            CatCare AI v1.0.0
          </Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
  subscriptionItem: {
    backgroundColor: 'rgba(52, 152, 219, 0.08)',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
  },
  subscriptionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  subscriptionSubtext: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
    fontWeight: '500',
  },
  commentsItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
});
