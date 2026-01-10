import { useCallback, useState } from 'react';
import { Upload, FolderOpen, Disc } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  hasFiles: boolean;
}

export const DropZone = ({ onFilesAdded, hasFiles }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    e.target.value = '';
  }, [onFilesAdded]);

  const handleFolderSelect = useCallback(async () => {
    try {
      // @ts-ignore - File System Access API
      if ('showDirectoryPicker' in window) {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker();
        const files: File[] = [];
        
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            if (file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(file.name)) {
              files.push(file);
            }
          }
        }
        
        if (files.length > 0) {
          onFilesAdded(files);
        }
      }
    } catch (err) {
      console.log('Folder selection cancelled or not supported');
    }
  }, [onFilesAdded]);

  if (hasFiles) {
    return (
      <div className="flex gap-2 mb-6">
        <label className="retro-button flex items-center gap-2 px-4 py-2 rounded border-2 border-border bg-muted hover:border-muted-foreground/50 cursor-pointer transition-all">
          <Upload className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Add Files</span>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
        
        {'showDirectoryPicker' in window && (
          <button
            onClick={handleFolderSelect}
            className="retro-button flex items-center gap-2 px-4 py-2 rounded border-2 border-border bg-muted hover:border-muted-foreground/50 transition-all"
          >
            <FolderOpen className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Add Folder</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center py-16 px-8 rounded border-2 border-dashed transition-all duration-300 noise-overlay',
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.01]' 
          : 'border-border hover:border-muted-foreground/50 bg-card/50'
      )}
    >
      {/* Decorative cassette reels */}
      <div className="absolute top-8 left-12 opacity-20">
        <div className="w-16 h-16 rounded-full border-4 border-border" />
      </div>
      <div className="absolute top-8 right-12 opacity-20">
        <div className="w-16 h-16 rounded-full border-4 border-border" />
      </div>
      
      {/* Main content */}
      <div className={cn(
        'p-4 rounded-full mb-6 transition-all duration-300 border-2',
        isDragging 
          ? 'bg-primary/20 border-primary/50' 
          : 'bg-muted border-border'
      )}>
        <Disc className={cn(
          'w-10 h-10 transition-colors',
          isDragging ? 'text-primary animate-spin-slow' : 'text-muted-foreground'
        )} />
      </div>

      <h3 className="font-display text-xl mb-2 tracking-wide">
        {isDragging ? (
          <span className="text-primary amber-glow">DROP YOUR TAPES</span>
        ) : (
          <span>LOAD YOUR SOUNDS</span>
        )}
      </h3>
      
      <p className="text-muted-foreground text-center mb-6 max-w-md text-sm">
        Drag and drop audio files here, or use the buttons below.
        <br />
        <span className="text-xs opacity-70">Supports MP3, WAV, OGG, M4A, FLAC</span>
      </p>

      <div className="flex gap-3">
        <label className={cn(
          "retro-button flex items-center gap-2 px-6 py-3 rounded border-2 cursor-pointer transition-all",
          "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
        )}>
          <Upload className="w-4 h-4" />
          <span>Choose Files</span>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>

        {'showDirectoryPicker' in window && (
          <button
            onClick={handleFolderSelect}
            className="retro-button flex items-center gap-2 px-6 py-3 rounded border-2 border-border bg-muted hover:border-muted-foreground/50 transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select Folder</span>
          </button>
        )}
      </div>

      {/* Keyboard hint - styled like cassette label */}
      <div className="mt-8 px-4 py-2 rounded-sm bg-muted/50 border border-border">
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          Keys 1-9 to trigger • ESC to stop all
        </p>
      </div>
    </div>
  );
};
