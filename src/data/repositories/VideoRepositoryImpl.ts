import { IVideoRepository } from '../../domain/repositories/IVideoRepository';
import { Video, VideoClip } from '../../domain/entities/Video';
import { VideoApi } from '../api/VideoApi';

export class VideoRepositoryImpl implements IVideoRepository {
  async uploadVideo(fileUri: string, onProgress?: (progress: number) => void): Promise<Video> {
    try {
      return await VideoApi.upload(fileUri, onProgress);
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  async getVideoStatus(videoId: string): Promise<Video> {
    try {
      return await VideoApi.getStatus(videoId);
    } catch (error) {
      console.error('Error getting video status:', error);
      throw error;
    }
  }

  async getVideoClips(videoId: string): Promise<VideoClip[]> {
    try {
      return await VideoApi.getClips(videoId);
    } catch (error) {
      console.error('Error getting video clips:', error);
      throw error;
    }
  }
}
