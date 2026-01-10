export interface AudioFile {
  id: string;
  name: string;
  displayName: string;
  file: File;
  url: string;
  duration?: number;
  keyBinding?: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
