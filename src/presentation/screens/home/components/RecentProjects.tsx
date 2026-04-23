import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';
import { VideoApi } from '../../../../data/api/VideoApi';

export const RecentProjects: React.FC = () => {
  const navigation = useNavigation<any>();

  // Ambil data video dari Backend
  const { data: videos, isLoading } = useQuery({
    queryKey: ['recent-videos'],
    queryFn: () => VideoApi.getUserVideos(),
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  // Jika data kosong
  if (!videos || videos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Project</Text>
        <Text style={styles.emptyText}>No projects yet. Start creating!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Project</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>

      {videos.map((item: any) => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.item}
          onPress={() => navigation.navigate('FullVideoResult', { 
            videoId: item.id,
            videoUrl: item.url, 
            title: item.title 
          })}
        >
          <Image 
            source={{ uri: item.clips?.[0]?.url || item.url }} 
            style={styles.thumb} 
          />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.meta}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.md, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.h2, fontSize: 18 },
  seeAll: { ...Typography.caption, color: Colors.primary, fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: 16 },
  thumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: Colors.surface },
  info: { flex: 1 },
  title: { ...Typography.body, fontWeight: '700', fontSize: 16 },
  meta: { ...Typography.caption, color: '#64748B', marginTop: 4 },
  loadingContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748B', textAlign: 'center', marginTop: 20 },
});
