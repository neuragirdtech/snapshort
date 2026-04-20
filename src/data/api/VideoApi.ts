import axios from 'axios';
import { Video, VideoClip } from '../../domain/entities/Video';
import { ApiConfig } from '../../core/constants/api';
import { useAuthStore } from '../../presentation/hooks/useAuthStore';

export const VideoApi = {
  upload: async (fileUri: string, onProgress?: (progress: number) => void): Promise<Video> => {
    if (ApiConfig.USE_MOCK) {
      for (let i = 0; i <= 100; i += 10) {
        if (onProgress) onProgress(i);
        await new Promise(resolve => setTimeout(() => resolve(true), 200));
      }
      return {
        id: 'vid_123',
        url: fileUri,
        title: 'Uploaded Video',
        duration: 60,
        status: 'processing',
      };
    }

    const { token, activeProvider, apiToken } = useAuthStore.getState();
    const formData = new FormData();
    formData.append('video', {
      uri: fileUri,
      name: 'upload.mp4',
      type: 'video/mp4',
    } as any);

    const headers: any = {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
      'x-ai-provider': activeProvider, // 'gemini' | 'openai' | 'claude'
    };

    if (apiToken) {
      headers['x-api-key'] = apiToken;
    }

    const response = await axios.post(`${ApiConfig.BASE_URL}/videos/upload`, formData, {
      headers,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  getStatus: async (videoId: string): Promise<Video> => {
    if (ApiConfig.USE_MOCK) return { id: videoId, url: '', title: 'Sample Video', duration: 60, status: 'completed' };
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ApiConfig.BASE_URL}/videos/${videoId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getClips: async (videoId: string): Promise<VideoClip[]> => {
    if (ApiConfig.USE_MOCK) return [];
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ApiConfig.BASE_URL}/videos/${videoId}/clips`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  getMyVideos: async (): Promise<Video[]> => {
    const token = useAuthStore.getState().token;
    const response = await axios.get(`${ApiConfig.BASE_URL}/videos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },

  updateTitle: async (videoId: string, title: string): Promise<any> => {
    const token = useAuthStore.getState().token;
    const response = await axios.post(`${ApiConfig.BASE_URL}/videos/${videoId}/update-title`, { title }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  },
};
