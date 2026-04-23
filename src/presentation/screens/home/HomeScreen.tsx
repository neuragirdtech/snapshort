import React, { useCallback } from 'react';
import { StyleSheet, ScrollView, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../../core/constants/theme';

// Scalable Components
import { HomeHero } from './components/HomeHero';
import { QuickActions } from './components/QuickActions';
import { RecentProjects } from './components/RecentProjects';
import { FloatingNav } from './components/FloatingNav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePickVideo = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset.uri) return;

    navigation.navigate('VideoConfig', {
      videoUri: asset.uri,
      duration: asset.duration
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step 1: Greeting & Main CTA */}
        <HomeHero onCreateNew={handlePickVideo} />

        {/* Step 2: Quick Features */}
        {/* <QuickActions /> */}

        {/* Step 3: Projects History */}
        <RecentProjects />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: 0,
  }
});

export default HomeScreen;
