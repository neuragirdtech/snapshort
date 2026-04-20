import axios from 'axios';
import { Video, VideoClip } from '../../domain/entities/Video';
import { ApiConfig } from '../../core/constants/api';

export const VideoApi = {
  upload: async (fileUri: string, onProgress?: (progress: number) => void): Promise<Video> => {
    if (ApiConfig.USE_MOCK) {
      // Simulate upload progress
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

    const formData = new FormData();
    formData.append('video', {
      uri: fileUri,
      name: 'upload.mp4',
      type: 'video/mp4',
    } as any);

    const response = await axios.post(`${ApiConfig.BASE_URL}/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    if (ApiConfig.USE_MOCK) {
      return {
        id: videoId,
        url: '',
        title: 'Sample Video',
        duration: 60,
        status: 'completed',
      };
    }
    const response = await axios.get(`${ApiConfig.BASE_URL}/videos/${videoId}/status`);
    return response.data;
  },

  getClips: async (videoId: string): Promise<VideoClip[]> => {
    if (ApiConfig.USE_MOCK) {
      await new Promise(resolve => setTimeout(() => resolve(true), 1500));
      return [
        {
          id: 'clip_1',
          parentVideoId: videoId,
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/id/1/400/300',
          duration: 15,
          title: 'Epic Moment 1',
          status: 'completed',
          subtitles: [
            { startTime: 0, endTime: 5, text: "Look at this amazing scenery!" },
            { startTime: 5, endTime: 10, text: "Nature is truly beautiful." },
            { startTime: 10, endTime: 15, text: "Don't forget to follow!" },
          ]
        },
        {
          id: 'clip_2',
          parentVideoId: videoId,
          url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/id/10/400/300',
          duration: 12,
          title: 'The Big Jump',
          status: 'completed',
          subtitles: [
            { startTime: 0, endTime: 6, text: "Wait for it..." },
            { startTime: 6, endTime: 12, text: "BOOM! Incredible!" },
          ]
        }
      ];
    }
    const response = await axios.get(`${ApiConfig.BASE_URL}/videos/${videoId}/clips`);
    return response.data;
  },
};
