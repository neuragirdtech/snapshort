import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Modal, TextInput, Alert, Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Play, Clock, CheckCircle2, AlertCircle, Edit2, Download, Trash2, ChevronRight } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { VideoApi } from '../../../data/api/VideoApi';
import { Video } from '../../../domain/entities/Video';
import { ApiConfig } from '../../../core/constants/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchVideos = async () => {
    try {
      const data = await VideoApi.getMyVideos();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const handleOpenMenu = (video: Video) => {
    setSelectedVideo(video);
    setMenuVisible(true);
  };

  const handleEdit = () => {
    if (!selectedVideo) return;
    setNewTitle(selectedVideo.title);
    setMenuVisible(false);
    setEditVisible(true);
  };

  const handleSaveTitle = async () => {
    if (!selectedVideo || !newTitle.trim()) return;
    try {
      await VideoApi.updateTitle(selectedVideo.id, newTitle);
      Alert.alert('Success', 'Title updated successfully');
      setEditVisible(false);
      fetchVideos();
    } catch (error) {
      Alert.alert('Error', 'Failed to update title');
    }
  };

  const handleDownload = () => {
    if (!selectedVideo) return;
    const url = `${ApiConfig.BASE_URL}/${selectedVideo.url}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open video link'));
    setMenuVisible(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={14} color="#10B981" /> };
      case 'processing': return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', icon: <ActivityIndicator size={12} color="#6366F1" /> };
      case 'failed': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertCircle size={14} color="#EF4444" /> };
      default: return { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)', icon: null };
    }
  };

  const renderItem = ({ item }: { item: Video }) => {
    const status = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleOpenMenu(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardIcon}>
          <Play color={status.color} size={24} fill={`${status.color}33`} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.videoTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{item.duration || 0}s</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              {status.icon}
              <Text style={[styles.statusText, { color: status.color }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chevronContainer}>
          <ChevronRight color="#475569" size={20} />
        </View>
      </TouchableOpacity>
    );
  };


  console.log("videos", videos)

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        />
      )}

      {/* Action Menu Modal */}
      <Modal transparent visible={menuVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.sheetIndicator} />
            <Text style={styles.sheetHeader} numberOfLines={2}>{selectedVideo?.title}</Text>

            <TouchableOpacity style={styles.actionItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate('VideoPlayer', {
                videoId: selectedVideo!.id
              });
            }}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Play color="#6366F1" size={20} fill="#6366F1" />
              </View>
              <Text style={styles.actionText}>View Clips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleEdit}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                <Edit2 color="#FFF" size={20} />
              </View>
              <Text style={styles.actionText}>Rename Project</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleDownload}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                <Download color="#FFF" size={20} />
              </View>
              <Text style={styles.actionText}>Download original</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Trash2 color="#EF4444" size={20} />
              </View>
              <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Title Modal */}
      <Modal transparent visible={editVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.editTitle}>Rename Project</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter new title..."
              placeholderTextColor="#475569"
              autoFocus
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={handleSaveTitle}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#16161A',
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F1F23',
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 16 },
  videoTitle: { ...Typography.body, fontWeight: 'bold', color: '#FFF' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  metaText: { fontSize: 12, color: '#94A3B8', marginLeft: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  chevronContainer: { marginLeft: 8 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  actionSheet: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 16,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  sheetIndicator: { width: 40, height: 4, backgroundColor: '#1F1F23', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { color: '#FFF', fontSize: 18, textAlign: 'center', marginBottom: 24, fontWeight: 'bold', paddingHorizontal: 20 },
  actionIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
  actionText: { color: '#FFF', fontSize: 16, marginLeft: 16, fontWeight: '600' },

  editModal: { backgroundColor: '#16161A', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#1F1F23', marginHorizontal: 20, marginBottom: 300 },
  editTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#0F0F12', borderRadius: 12, padding: 16, color: '#FFF', marginBottom: 24, borderWidth: 1, borderColor: '#1F1F23' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnCancel: { backgroundColor: '#1F1F23' },
  btnSave: { backgroundColor: Colors.primary },
  btnText: { color: '#FFF', fontWeight: 'bold' },
});

export default HistoryScreen;
