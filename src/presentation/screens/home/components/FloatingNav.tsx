import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, Compass, User } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

export const FloatingNav: React.FC = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.capsule}>
        <TouchableOpacity style={[styles.item, styles.activeItem]}>
          <Home size={20} color="#000" />
          <Text style={styles.activeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Compass size={20} color="#94A3B8" />
          <Text style={styles.text}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <User size={20} color="#94A3B8" />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  capsule: { flexDirection: 'row', backgroundColor: 'rgba(30, 30, 35, 0.95)', borderRadius: 100, padding: 8, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 100, gap: 8 },
  activeItem: { backgroundColor: Colors.primary },
  text: { ...Typography.caption, color: '#94A3B8', fontWeight: 'bold' },
  activeText: { ...Typography.caption, color: '#FFFFFF', fontWeight: 'bold' },
});
