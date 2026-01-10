import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Header } from '@/components/Header';
import { DropZone } from '@/components/DropZone';
import { SoundGrid } from '@/components/SoundGrid';

const Index = () => {
  const {
    audioFiles,
    playingIds,
    volume,
    addAudioFiles,
    removeAudioFile,
    clearAllAudio,
    toggleAudio,
    stopAll,
    updateVolume,
  } = useAudioPlayer();

  const hasFiles = audioFiles.length > 0;

  return (
    <div className="min-h-screen bg-background wood-grain relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none noise-overlay" />
      
      <Header
        volume={volume}
        onVolumeChange={updateVolume}
        onStopAll={stopAll}
        onClearAll={clearAllAudio}
        hasFiles={hasFiles}
        playingCount={playingIds.size}
      />

      <main className="container mx-auto px-4 py-8 relative">
        <DropZone onFilesAdded={addAudioFiles} hasFiles={hasFiles} />

        {hasFiles && (
          <div className="mt-2">
            <SoundGrid
              audioFiles={audioFiles}
              playingIds={playingIds}
              onToggle={toggleAudio}
              onRemove={removeAudioFile}
            />
          </div>
        )}

        {!hasFiles && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-muted/30 border border-border/50">
              <span className="text-xl">📼</span>
              <p className="text-muted-foreground text-sm">
                Pro tip: Organize your sounds in folders for quick loading
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Warm ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]" />
      </div>
      
      {/* Bottom decorative strip */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
};

export default Index;
