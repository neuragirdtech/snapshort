import { Video, VideoClip } from '../entities/Video';

export interface IVideoRepository {
  uploadVideo(
    fileUri: string, 
    onProgress?: (progress: number) => void,
    options?: { prompt?: string, clipCount?: number, aspectRatio?: string, subtitleColor?: string }
  ): Promise<Video>;
  getVideoStatus(videoId: string): Promise<Video>;
  getVideoClips(videoId: string): Promise<VideoClip[]>;
}
