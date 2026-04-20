import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// Impor ViewType dari library
import { useVideoPlayer, VideoView } from 'react-native-video';

const VideoPlayerScreen = ({ route, navigation }: any) => {
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  const fullUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  const player = useVideoPlayer(
    'https://www.w3schools.com/html/mov_bbb.mp4',
    (_player) => {
      _player.play();
    }
  );

  return (
    <VideoView
      player={player}
      style={{ width: '100%', aspectRatio: 16 / 9 }}
      controls
    />
  );
};

export default VideoPlayerScreen;
