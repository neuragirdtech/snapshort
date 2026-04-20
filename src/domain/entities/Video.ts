export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  duration: number;
  title: string;
  status: 'processing' | 'completed' | 'failed';
  subtitles?: Subtitle[];
}

export interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

export interface VideoClip extends Video {
  parentVideoId: string;
}
