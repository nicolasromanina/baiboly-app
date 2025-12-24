import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Verse } from '@/types/bible';

interface AudioPlayerProps {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentIndex: number;
  verses: Verse[];
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function AudioPlayer({
  isPlaying,
  isPaused,
  isSupported,
  currentIndex,
  verses,
  onPlay,
  onPause,
  onResume,
  onStop,
}: AudioPlayerProps) {
  if (!isSupported) {
    return null;
  }

  const currentVerse = currentIndex >= 0 ? verses[currentIndex] : null;
  const progress = verses.length > 0 ? ((currentIndex + 1) / verses.length) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={onPlay}
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        ) : (
          <>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={isPaused ? onResume : onPause}
            >
              {isPaused ? (
                <Play className="h-5 w-5 ml-0.5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onStop}
            >
              <Square className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate">
            {isPlaying ? (
              currentVerse ? (
                `Verse ${currentVerse.verse}`
              ) : (
                'Playing...'
              )
            ) : (
              'Listen to Chapter'
            )}
          </span>
        </div>
        
        {isPlaying && (
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {isPlaying && (
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {currentIndex + 1}/{verses.length}
        </span>
      )}
    </div>
  );
}
