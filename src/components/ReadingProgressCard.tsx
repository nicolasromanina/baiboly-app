import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReadingProgress, BookMetadata } from '@/types/bible';

interface ReadingProgressCardProps {
  progress: ReadingProgress | null;
  books: BookMetadata[];
  onContinue: (book: BookMetadata, chapter: number) => void;
}

export function ReadingProgressCard({ progress, books, onContinue }: ReadingProgressCardProps) {
  if (!progress) return null;

  const book = books.find(b => b.file.includes(progress.book) || b.id === progress.book);
  if (!book) return null;

  const progressPercent = Math.round((progress.chapter / book.chapters) * 100);

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary rounded-lg">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Continue Reading</h3>
            <p className="text-xs text-muted-foreground">
              {book.name} · Chapter {progress.chapter}
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={() => onContinue(book, progress.chapter)}
          className="gap-1"
        >
          Continue
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
