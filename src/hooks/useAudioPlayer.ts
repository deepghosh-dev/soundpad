import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioFile } from '@/types/audio';

export const useAudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [playingIds, setPlayingIds] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(0.8);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const addAudioFiles = useCallback((files: File[]) => {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];
    
    const newFiles: AudioFile[] = files
      .filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return audioExtensions.includes(ext) || file.type.startsWith('audio/');
      })
      .map((file, index) => {
        const id = `${Date.now()}-${index}-${file.name}`;
        const displayName = file.name.replace(/\.[^/.]+$/, '');
        const url = URL.createObjectURL(file);
        
        return {
          id,
          name: file.name,
          displayName,
          file,
          url,
          keyBinding: audioFiles.length + index < 9 ? String(audioFiles.length + index + 1) : undefined,
        };
      });

    setAudioFiles(prev => [...prev, ...newFiles]);
  }, [audioFiles.length]);

  const removeAudioFile = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
      audio.src = '';
      audioRefs.current.delete(id);
    }
    
    setAudioFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
    
    setPlayingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearAllAudio = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    audioRefs.current.clear();
    
    audioFiles.forEach(file => URL.revokeObjectURL(file.url));
    setAudioFiles([]);
    setPlayingIds(new Set());
  }, [audioFiles]);

  const playAudio = useCallback((id: string) => {
    const file = audioFiles.find(f => f.id === id);
    if (!file) return;

    let audio = audioRefs.current.get(id);
    
    if (!audio) {
      audio = new Audio(file.url);
      audio.volume = volume;
      audioRefs.current.set(id, audio);
      
      audio.addEventListener('ended', () => {
        setPlayingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      });
    }

    audio.currentTime = 0;
    audio.play();
    setPlayingIds(prev => new Set(prev).add(id));
  }, [audioFiles, volume]);

  const stopAudio = useCallback((id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlayingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleAudio = useCallback((id: string) => {
    if (playingIds.has(id)) {
      stopAudio(id);
    } else {
      playAudio(id);
    }
  }, [playingIds, playAudio, stopAudio]);

  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingIds(new Set());
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioRefs.current.forEach((audio) => {
      audio.volume = newVolume;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Escape to stop all
      if (e.key === 'Escape') {
        stopAll();
        return;
      }

      // Number keys 1-9
      if (/^[1-9]$/.test(e.key)) {
        const file = audioFiles.find(f => f.keyBinding === e.key);
        if (file) {
          e.preventDefault();
          toggleAudio(file.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioFiles, toggleAudio, stopAll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioFiles.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, []);

  return {
    audioFiles,
    playingIds,
    volume,
    addAudioFiles,
    removeAudioFile,
    clearAllAudio,
    playAudio,
    stopAudio,
    toggleAudio,
    stopAll,
    updateVolume,
  };
};
