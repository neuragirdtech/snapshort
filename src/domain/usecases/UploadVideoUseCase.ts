import { IVideoRepository } from '../repositories/IVideoRepository';
import { Video } from '../entities/Video';

export class UploadVideoUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  async execute(
    fileUri: string, 
    onProgress?: (progress: number) => void,
    options?: { 
      prompt?: string, 
      clipCount?: number, 
      aspectRatio?: string, 
      subtitleColor?: string,
      realism?: number,
      motion?: string
    }
  ): Promise<Video> {
    return await this.videoRepository.uploadVideo(fileUri, onProgress, options);
  }
}
