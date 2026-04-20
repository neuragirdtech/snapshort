import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import HomeScreen from '../screens/home/HomeScreen';
import ResultScreen from '../screens/result/ResultScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GetStartedScreen from '../screens/onboarding/GetStartedScreen';
import { useAuthStore } from '../hooks/useAuthStore';

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Result: { videoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    RNBootSplash.hide({ fade: true, duration: 500 });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F0F12',
        },
        headerShadowVisible: false,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: { backgroundColor: '#0F0F12' },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen 
            name="GetStarted" 
            component={GetStartedScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'SnapCut' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen} 
            options={{ title: 'Video Clips' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
