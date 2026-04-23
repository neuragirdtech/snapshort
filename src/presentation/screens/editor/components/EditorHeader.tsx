import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, Upload } from 'lucide-react-native';
import { Colors } from '../../../../core/constants/theme';

interface EditorHeaderProps {
  title: string;
  metadata?: string;
  onBack: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ title, metadata, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <ArrowLeft size={22} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.titleInfo}>
        <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        {metadata && <Text style={styles.metaText}>{metadata}</Text>}
      </View>

      <TouchableOpacity 
        style={styles.exportBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.exportText}>Export</Text>
        <Upload size={18} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#000',
    paddingTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  titleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary, 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  exportText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
