import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { VideoApi } from '../../../data/api/VideoApi';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

// Modular Components
import { ClipCard } from './components/ClipCard';
import { ClipsHeader } from './components/ClipsHeader';

type ScreenRouteProp = RouteProp<RootStackParamList, 'ClipsResult'>;

export const ClipsResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ScreenRouteProp>();
  const { videoId } = route.params;

  const { data: clips, isLoading, refetch } = useQuery({
    queryKey: ['video-clips', videoId],
    queryFn: () => VideoApi.getClips(videoId),
    refetchInterval: (data) => (data?.length === 0 ? 3000 : false),
  });

  const renderClipItem = ({ item, index }: { item: any; index: number }) => (
    <ClipCard 
      item={item} 
      onPress={() => navigation.navigate('Editor', { videoId, initialClipIndex: index })} 
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Menganalisis Momen Viral...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ClipsHeader 
        title="AI Video Clips" 
        onBack={() => navigation.goBack()} 
      />

      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        renderItem={renderClipItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sedang memproses klip...</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryText}>Refresh Otomatis</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.md,
    color: Colors.textDim,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textDim,
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullVideoBtn: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fullVideoGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  fullVideoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
