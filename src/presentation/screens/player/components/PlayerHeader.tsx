import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Upload } from 'lucide-react-native';
import { Colors } from '../../../../core/constants/theme';

interface PlayerHeaderProps {
  title: string;
  status: string;
  onBack: () => void;
  onExport: () => void;
}

export const PlayerHeader = ({ title, status, onBack, onExport }: PlayerHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <ArrowLeft color="#FFFFFF" size={20} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1}>{title || 'Untitled Video'}</Text>
        <Text style={styles.subtitleText}>{status === 'completed' ? 'Processed' : 'Draft'} • 1080p</Text>
      </View>

      <TouchableOpacity 
        style={[styles.exportButton, { backgroundColor: Colors.primary }]}
        onPress={onExport}
      >
        <Text style={styles.exportText}>Export</Text>
        <Upload color={Colors.background} size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitleText: {
    color: '#888888',
    fontSize: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 6,
    fontSize: 14,
  },
});
