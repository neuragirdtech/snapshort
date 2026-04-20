import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { Play, Zap, MessageSquare, ArrowRight } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>;

const GetStartedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const features = [
    { icon: <Zap color={Colors.primary} size={24} />, text: 'AI-Powered Clipping' },
    { icon: <MessageSquare color={Colors.primary} size={24} />, text: 'Automated Subtitles' },
    { icon: <Play color={Colors.primary} size={24} />, text: 'Social-Ready Shorts' },
  ];

  return (
    <View style={styles.container}>
      {/* Abstract Background Element */}
      <View style={styles.abstractCircle} />
      
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>SnapCut</Text>
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.headline}>
            Transform Long Videos into <Text style={styles.highlight}>Viral</Text> Clips
          </Text>
          <Text style={styles.description}>
            The smartest way to repurpose your content for TikTok, Reels, and Shorts using AI.
          </Text>

          <View style={styles.featuresContainer}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.iconBg}>{f.icon}</View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            activeOpacity={0.8}
            style={styles.mainButtonContainer}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainButton}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <ArrowRight color={Colors.text} size={24} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginHighlight}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  abstractCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: Colors.primary,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 56,
    height: 56,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h2,
    letterSpacing: 1,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 52,
  },
  highlight: {
    color: Colors.primary,
  },
  description: {
    ...Typography.body,
    marginTop: Spacing.lg,
    color: Colors.textDim,
    lineHeight: 24,
  },
  featuresContainer: {
    marginTop: Spacing.xl * 1.5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.body,
    fontWeight: '600',
  },
  footer: {
    marginBottom: Spacing.xl,
  },
  mainButtonContainer: {
    height: 64,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: Spacing.md,
  },
  loginLink: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    color: Colors.textDim,
    fontSize: 14,
  },
  loginHighlight: {
    color: Colors.text,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
