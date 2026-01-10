import { Circle, Square, Trash2 } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { cn } from '@/lib/utils';

interface HeaderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onStopAll: () => void;
  onClearAll: () => void;
  hasFiles: boolean;
  playingCount: number;
}

// Cassette reel component
const CassetteReel = ({ spinning }: { spinning: boolean }) => (
  <div className={cn(
    "relative w-10 h-10 rounded-full bg-gradient-to-br from-muted to-background border-2 border-border flex items-center justify-center",
    spinning && "animate-spin-slow"
  )}>
    <div className="absolute w-6 h-6 rounded-full border border-border/50" />
    <div className="w-3 h-3 rounded-full bg-background border border-border" />
    {/* Spokes */}
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 60, 120].map((deg) => (
        <div
          key={deg}
          className="absolute w-0.5 h-full bg-border/30"
          style={{ transform: `rotate(${deg}deg)` }}
        />
      ))}
    </div>
  </div>
);

export const Header = ({ 
  volume, 
  onVolumeChange, 
  onStopAll, 
  onClearAll,
  hasFiles,
  playingCount,
}: HeaderProps) => {
  const isPlaying = playingCount > 0;

  return (
    <header className="vintage-panel sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with cassette reels */}
          <div className="flex items-center gap-4">
            <CassetteReel spinning={isPlaying} />
            
            <div className="flex flex-col">
              <h1 className="font-display text-2xl tracking-wide leading-none">
                <span className={cn("text-primary", isPlaying && "amber-glow")}>TAPE</span>
                <span className="text-foreground">DECK</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] mt-0.5">
                Audio Trigger System
              </p>
            </div>
            
            <CassetteReel spinning={isPlaying} />
          </div>

          {/* Controls */}
          {hasFiles && (
            <div className="flex items-center gap-3">
              {/* Playing indicator - VU style */}
              {isPlaying && (
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-muted/50 border border-border">
                  <Circle className="w-2 h-2 fill-primary text-primary animate-pulse" />
                  <span className="text-xs text-primary font-mono uppercase tracking-wider">
                    {playingCount} Active
                  </span>
                </div>
              )}

              <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
              
              <div className="h-8 w-px bg-border" />
              
              <button
                onClick={onStopAll}
                className={cn(
                  'retro-button flex items-center gap-2 px-4 py-2 rounded border-2 transition-all',
                  isPlaying
                    ? 'bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30'
                    : 'bg-muted border-border text-muted-foreground hover:border-muted-foreground/50'
                )}
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </button>

              <button
                onClick={onClearAll}
                className="retro-button flex items-center gap-2 px-4 py-2 rounded border-2 border-border bg-muted text-muted-foreground hover:border-muted-foreground/50 transition-all"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative tape strip */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
};
