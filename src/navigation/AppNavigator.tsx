import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import MapScreen from '../screens/MapScreen';
import VetsScreen from '../screens/VetsScreen';
import DoctorsScreen from '../screens/DoctorsScreen';

import { NavigationContainer } from '@react-navigation/native';
import { TopBar } from '../ui/TopBar';
import CustomDrawerContent from '../ui/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

type AppNavigatorProps = {
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
};

function MainStack({ rightPanelVisible, setRightPanelVisible }: AppNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => (
          <TopBar 
            {...props} 
            rightPanelVisible={rightPanelVisible}
            setRightPanelVisible={setRightPanelVisible}
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Vets" component={VetsScreen} />
      <Stack.Screen name="Doctors" component={DoctorsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator({ rightPanelVisible, setRightPanelVisible }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
          },
        }}
        initialRouteName="Main"
      >
        <Drawer.Screen 
          name="Main" 
          options={{ drawerLabel: 'Home' }}
        >
          {(props) => (
            <MainStack 
              {...props} 
              rightPanelVisible={rightPanelVisible}
              setRightPanelVisible={setRightPanelVisible}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
