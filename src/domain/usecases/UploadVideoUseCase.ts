import { IVideoRepository } from '../repositories/IVideoRepository';
import { Video } from '../entities/Video';

export class UploadVideoUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  async execute(fileUri: string, onProgress?: (progress: number) => void): Promise<Video> {
    return await this.videoRepository.uploadVideo(fileUri, onProgress);
  }
}
