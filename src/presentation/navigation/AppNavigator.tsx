import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import { View, ActivityIndicator } from 'react-native';
import EditorScreen from '../screens/editor/EditorScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GetStartedScreen from '../screens/onboarding/GetStartedScreen';
import VideoPlayerScreen from '../screens/player/VideoPlayerScreen';
import CreativeConfigScreen from '../screens/creative/CreativeConfigScreen';
import MainTabNavigator from './MainTabNavigator';
import { useAuthStore } from '../hooks/useAuthStore';

import { ClipsResultScreen } from '../screens/clips/ClipsResultScreen';
import FullVideoResultScreen from '../screens/result/FullVideoResultScreen';

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined; 
  Editor: { videoId: string, initialClipIndex?: number }; 
  VideoPlayer: { videoUri?: string, title?: string, videoId?: string };
  VideoConfig: { videoUri: string, duration?: number };
  ClipsResult: { videoId: string };
  FullVideoResult: { videoUrl: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated) {
      RNBootSplash.hide({ fade: true });
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
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Editor" component={EditorScreen} options={{ headerShown: false }} />
          <Stack.Screen 
            name="VideoPlayer" 
            component={VideoPlayerScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="VideoConfig" 
            component={CreativeConfigScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ClipsResult" 
            component={ClipsResultScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FullVideoResult" 
            component={FullVideoResultScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
