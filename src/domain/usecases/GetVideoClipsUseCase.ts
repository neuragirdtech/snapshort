import { IVideoRepository } from '../repositories/IVideoRepository';
import { VideoClip } from '../entities/Video';

export class GetVideoClipsUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  async execute(videoId: string): Promise<VideoClip[]> {
    return await this.videoRepository.getVideoClips(videoId);
  }
}
