import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PlusCircle } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

const { width } = Dimensions.get('window');

interface Props {
  onCreateNew: () => void;
  userName?: string;
}

export const HomeHero: React.FC<Props> = ({ onCreateNew, userName = 'User' }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop' }}
        style={styles.heroImage}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.9)']}
          style={styles.fullOverlay}
        >
          {/* Header Overlay */}
          <View style={styles.headerOverlay}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.brandTitle}>Create Your Story</Text>
            </View>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }} 
              style={styles.avatar} 
            />
          </View>

          {/* Action Button Overlay */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.createBtn} onPress={onCreateNew} activeOpacity={0.9}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <PlusCircle size={24} color="#FFF" />
                <Text style={styles.btnText}>Create New</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: width, marginBottom: -20 },
  heroImage: { width: width, height: 450 },
  imageStyle: { resizeMode: 'cover' },
  fullOverlay: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  headerOverlay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  welcomeText: { ...Typography.caption, color: '#FFFFFF', opacity: 0.8, fontSize: 14 },
  brandTitle: { ...Typography.h1, color: Colors.primary, fontSize: 32, marginTop: -4 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  buttonWrapper: { paddingHorizontal: 20 },
  createBtn: { width: '100%', height: 64, borderRadius: 24, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
});
