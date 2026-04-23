export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  duration: number;
  title: string;
  status: 'processing' | 'completed' | 'failed';
  subtitles?: Subtitle[];
  meta?: {
    resolution?: string;
    fps?: string;
    duration?: number;
  };
}

export interface Subtitle {
  time?: number; 
  startTime: number;
  endTime: number;
  text: string;
  thumbnail?: string;
}

export interface VideoClip extends Video {
  parentVideoId: string;
}
