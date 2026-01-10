import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const isMuted = volume === 0;

  const toggleMute = () => {
    onVolumeChange(isMuted ? 0.8 : 0);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted/50 border border-border">
      <button
        onClick={toggleMute}
        className={cn(
          'p-1 rounded transition-colors',
          isMuted ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      
      {/* VU meter style slider background */}
      <div className="relative w-24">
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-green-600/30 via-yellow-500/30 to-red-500/30" />
        </div>
        <Slider
          value={[volume]}
          onValueChange={([val]) => onVolumeChange(val)}
          max={1}
          step={0.01}
          className="relative"
        />
      </div>
      
      <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
};
