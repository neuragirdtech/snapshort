import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import { View, ActivityIndicator } from 'react-native';
import ResultScreen from '../screens/result/ResultScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GetStartedScreen from '../screens/onboarding/GetStartedScreen';
import VideoPlayerScreen from '../screens/player/VideoPlayerScreen';
import MainDrawerNavigator from './MainDrawerNavigator';
import { useAuthStore } from '../hooks/useAuthStore';

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined; 
  Result: { videoId: string };
  VideoPlayer: { videoUri?: string, title?: string, videoId?: string }; // videoId ditambahkan untuk fetch BE
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated) {
      RNBootSplash.hide({ fade: true, duration: 500 });
    }
  }, [_hasHydrated]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F12', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F0F12' },
        headerShadowVisible: false,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#0F0F12' },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainDrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Video Clips' }} />
          <Stack.Screen 
            name="VideoPlayer" 
            component={VideoPlayerScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
