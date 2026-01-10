import { AudioFile } from '@/types/audio';
import { Volume2, X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundPadProps {
  audio: AudioFile;
  isPlaying: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

// VU Meter style visualizer
const VUMeter = ({ isPlaying }: { isPlaying: boolean }) => {
  if (!isPlaying) return null;
  
  return (
    <div className="absolute bottom-2 left-2 right-2 flex items-end gap-0.5 h-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="vu-bar flex-1 rounded-sm"
          style={{ 
            height: '100%',
            background: i < 5 
              ? 'hsl(120 50% 40%)' 
              : i < 7 
                ? 'hsl(45 90% 50%)' 
                : 'hsl(0 70% 50%)',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

// Tape reel mini icon
const MiniReel = ({ spinning }: { spinning: boolean }) => (
  <div className={cn(
    "w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center",
    spinning && "animate-spin-slow"
  )}>
    <div className="w-2 h-2 rounded-full bg-background border border-border/50" />
  </div>
);

export const SoundPad = ({ audio, isPlaying, onToggle, onRemove }: SoundPadProps) => {
  return (
    <div
      className={cn(
        'sound-pad group relative aspect-square flex flex-col p-3',
        isPlaying ? 'sound-pad-playing warm-pulse' : 'sound-pad-idle'
      )}
      onClick={onToggle}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/30 hover:bg-destructive/50 text-foreground z-10"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Key binding badge - cassette label style */}
      {audio.keyBinding && (
        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-sm bg-primary/20 border border-primary/40 text-primary text-[10px] font-mono font-semibold">
          {audio.keyBinding}
        </div>
      )}

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 mb-6">
        {/* Tape reel or speaker icon */}
        {isPlaying ? (
          <MiniReel spinning={true} />
        ) : (
          <div className="p-2 rounded bg-muted/50 border border-border/50 group-hover:border-primary/30 transition-colors">
            <Volume2 className="w-5 h-5 text-muted-foreground group-hover:text-primary/70 transition-colors" />
          </div>
        )}

        {/* Recording indicator */}
        {isPlaying && (
          <div className="flex items-center gap-1">
            <Circle className="w-1.5 h-1.5 fill-primary text-primary animate-pulse" />
            <span className="text-[9px] font-mono text-primary uppercase tracking-wider">Playing</span>
          </div>
        )}
      </div>

      {/* Name - label strip style */}
      <div className={cn(
        'absolute left-0 right-0 bottom-8 mx-2 px-2 py-1 rounded-sm text-center',
        isPlaying ? 'bg-primary/20' : 'bg-muted/80'
      )}>
        <span className={cn(
          'text-[11px] font-medium line-clamp-1 transition-colors',
          isPlaying ? 'text-primary' : 'text-foreground/80'
        )}>
          {audio.displayName}
        </span>
      </div>

      {/* VU Meter */}
      <VUMeter isPlaying={isPlaying} />
    </div>
  );
};
