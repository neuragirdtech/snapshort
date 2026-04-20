import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Sparkles, Type, Scissors, Layers, Music, Image as ImageIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../../core/constants/theme';

export const Toolbar = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomToolbar, { paddingBottom: insets.bottom || 20 }]}>
      <ToolbarItem icon={<Sparkles color="#FFFFFF" size={24} />} label="AI Edit" />
      <ToolbarItem icon={<Type color={Colors.primary} size={24} />} label="Text" active />
      <ToolbarItem icon={<Scissors color="#FFFFFF" size={24} />} label="Trim" />
      <ToolbarItem icon={<Layers color="#FFFFFF" size={24} />} label="Effects" />
      <ToolbarItem icon={<Music color="#FFFFFF" size={24} />} label="Music" />
      <ToolbarItem icon={<ImageIcon color="#FFFFFF" size={24} />} label="Img" />
    </View>
  );
};

const ToolbarItem = ({ icon, label, active }: any) => (
  <TouchableOpacity style={[styles.toolbarItem, active && styles.toolbarItemActive]}>
    {icon}
    <Text style={[styles.toolbarLabel, active && styles.toolbarLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomToolbar: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingTop: 12,
    justifyContent: 'space-around',
  },
  toolbarItem: { alignItems: 'center', paddingHorizontal: 10, opacity: 0.6 },
  toolbarItemActive: { opacity: 1 },
  toolbarLabel: { color: '#888888', fontSize: 10, marginTop: 6 },
  toolbarLabelActive: { color: Colors.primary },
});
