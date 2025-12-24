import { cn } from '@/lib/utils';
import { useFontSize } from '@/contexts/FontSizeContext';
import type { Verse } from '@/types/bible';

interface VerseViewerProps {
  verses: Verse[];
  selectedVerse?: number | null;
  onVerseClick?: (verseNumber: number) => void;
  highlightedVerses?: number[];
}

export function VerseViewer({ 
  verses, 
  selectedVerse, 
  onVerseClick,
  highlightedVerses = []
}: VerseViewerProps) {
  const { fontSize } = useFontSize();

  return (
    <div className="space-y-2 py-4">
      {verses.map((verse, index) => (
        <div
          key={verse.verse}
          onClick={() => onVerseClick?.(verse.verse)}
          className={cn(
            "verse-card fade-in",
            selectedVerse === verse.verse && "selected",
            highlightedVerses.includes(verse.verse) && "bg-accent/10 border-l-accent"
          )}
          style={{ animationDelay: `${index * 20}ms` }}
        >
          <span className="verse-number">{verse.verse}</span>
          <span className={cn("verse-text", `verse-text-${fontSize}`)}>
            {verse.text}
          </span>
        </div>
      ))}
    </div>
  );
}
