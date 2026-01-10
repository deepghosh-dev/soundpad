import { AudioFile } from '@/types/audio';
import { SoundPad } from './SoundPad';

interface SoundGridProps {
  audioFiles: AudioFile[];
  playingIds: Set<string>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const SoundGrid = ({ audioFiles, playingIds, onToggle, onRemove }: SoundGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {audioFiles.map((audio, index) => (
        <div
          key={audio.id}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <SoundPad
            audio={audio}
            isPlaying={playingIds.has(audio.id)}
            onToggle={() => onToggle(audio.id)}
            onRemove={() => onRemove(audio.id)}
          />
        </div>
      ))}
    </div>
  );
};
