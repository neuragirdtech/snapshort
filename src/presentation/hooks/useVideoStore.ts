import { create } from 'zustand';
import { Video, VideoClip } from '../../domain/entities/Video';

interface VideoState {
  currentVideo: Video | null;
  clips: VideoClip[];
  isProcessing: boolean;
  uploadProgress: number;
  error: string | null;

  setCurrentVideo: (video: Video | null) => void;
  setClips: (clips: VideoClip[]) => void;
  setProcessing: (status: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  clips: [],
  isProcessing: false,
  uploadProgress: 0,
  error: null,

  setCurrentVideo: (video) => set({ currentVideo: video }),
  setClips: (clips) => set({ clips }),
  setProcessing: (status) => set({ isProcessing: status }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setError: (error) => set({ error }),
  reset: () => set({ currentVideo: null, clips: [], isProcessing: false, uploadProgress: 0, error: null }),
}));
