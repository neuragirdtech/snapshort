import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, User } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  FadeIn
} from 'react-native-reanimated';

import HomeScreen from '../screens/home/HomeScreen';
import { Colors, Typography } from '../../core/constants/theme';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Konfigurasi Lebar Presisi
const BAR_WIDTH = SCREEN_WIDTH * 0.6; // 60% agar pas untuk 3 tab dengan teks
const ACTIVE_W = 105;
const INACTIVE_W = 48;
const GAP = 6;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  
  // Animasi Sliding & Resizing Indicator (The Water effect)
  const indicatorStyle = useAnimatedStyle(() => {
    let xPos = 8; // Initial padding
    if (state.index === 1) xPos = 8 + INACTIVE_W + GAP;
    if (state.index === 2) xPos = 8 + INACTIVE_W + GAP + INACTIVE_W + GAP;
    
    // Khusus jika yang aktif di tengah atau akhir, posisi bergeser mengikuti lebar tab dinamis
    // Agar lebih akurat, kita gunakan perhitungan tetap:
    const positions = [
        8, 
        8 + (state.index === 0 ? ACTIVE_W : INACTIVE_W) + GAP,
        8 + (state.index === 0 ? ACTIVE_W : INACTIVE_W) + GAP + (state.index === 1 ? ACTIVE_W : INACTIVE_W) + GAP
    ];

    // Logika sliding yang stabil:
    const activeX = state.index === 0 ? 8 : (state.index === 1 ? 8 + INACTIVE_W + GAP : 8 + (INACTIVE_W * 2) + (GAP * 2));

    return {
      width: withSpring(ACTIVE_W, { damping: 20, stiffness: 250 }),
      transform: [{ translateX: withSpring(activeX, { damping: 20, stiffness: 250, mass: 0.8 }) }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.capsule}>
        {/* Sliding Liquid Pill */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let Icon = Home;
          if (route.name === 'Discover') Icon = Compass;
          if (route.name === 'Profile') Icon = User;

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              activeOpacity={1}
            >
              <Animated.View style={[
                  styles.tabItem,
                  { width: isFocused ? ACTIVE_W : INACTIVE_W }
              ]}>
                <View style={styles.content}>
                  <Icon size={20} color={isFocused ? '#FFF' : 'rgba(255,255,255,0.4)'} />
                  {isFocused && (
                    <Animated.Text 
                      entering={FadeIn.duration(200)}
                      style={styles.label}
                      numberOfLines={1}
                    >
                      {route.name}
                    </Animated.Text>
                  )}
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={ViewPlaceholder} />
      <Tab.Screen name="Profile" component={ViewPlaceholder} />
    </Tab.Navigator>
  );
};

const ViewPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ ...Typography.h3 }}>Coming Soon</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', zIndex: 99 },
  capsule: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 25, 28, 0.98)',
    borderRadius: 100,
    padding: 8,
    gap: GAP,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  indicator: {
    position: 'absolute',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 100,
    left: 0,
  },
  tabItem: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  }
});

export default MainTabNavigator;
