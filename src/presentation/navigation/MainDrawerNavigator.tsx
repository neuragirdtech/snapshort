import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, History, Settings, LogOut, Menu } from 'lucide-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { useAuthStore } from '../hooks/useAuthStore';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type DrawerParamList = {
  HomeDrawer: undefined;
  HistoryDrawer: undefined;
  SettingsDrawer: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: any) => {
  const { logout, user } = useAuthStore();
  
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => props.navigation.navigate('HomeDrawer')}
        >
          <Home color="#FFFFFF" size={22} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('HistoryDrawer')}
        >
          <History color="#FFFFFF" size={22} />
          <Text style={styles.menuText}>My Clips</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('SettingsDrawer')}
        >
          <Settings color="#FFFFFF" size={22} />
          <Text style={styles.menuText}>AI Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut color="#FF4444" size={22} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'SnapShort', // Judul statis
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.openDrawer()} 
            style={{ marginLeft: 20 }}
          >
            <Menu color="#FFFFFF" size={24} />
          </TouchableOpacity>
        ),
        drawerStyle: {
          backgroundColor: '#0F0F12',
          width: 280,
        },
        headerStyle: {
          backgroundColor: '#0F0F12',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Drawer.Screen 
        name="HomeDrawer" 
        component={HomeScreen} 
      />
      <Drawer.Screen 
        name="HistoryDrawer" 
        component={HistoryScreen} 
      />
      <Drawer.Screen 
        name="SettingsDrawer" 
        component={SettingsScreen} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0F0F12',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F23',
    paddingBottom: 20,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    marginBottom: 15,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F1F23',
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
  },
});

export default MainDrawerNavigator;
