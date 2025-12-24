import { useEffect, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BibleApiService } from '@/services/bibleApi';
import type { Verse, BookMetadata } from '@/types/bible';

interface VerseOfDayProps {
  onNavigate?: (book: BookMetadata, chapter: number, verse: number) => void;
  books: BookMetadata[];
  language: string;
}

export function VerseOfDay({ onNavigate, books, language }: VerseOfDayProps) {
  const [verseData, setVerseData] = useState<{
    book: string;
    bookMeta: BookMetadata;
    chapter: number;
    verse: Verse;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVerseOfDay = async () => {
      if (books.length === 0) return;
      
      setLoading(true);
      try {
        const api = new BibleApiService();
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        
        // Select a book based on day
        const bookIndex = dayOfYear % books.length;
        const selectedBookMeta = books[bookIndex];
        
        const bookData = await api.fetchBook(language, selectedBookMeta.file);
        const chapterIndex = today.getDate() % bookData.chapters.length;
        const chapter = bookData.chapters[chapterIndex];
        const verseIndex = (today.getDate() + today.getMonth()) % chapter.verses.length;
        
        setVerseData({
          book: bookData.book,
          bookMeta: selectedBookMeta,
          chapter: chapter.chapter,
          verse: chapter.verses[verseIndex]
        });
      } catch (error) {
        console.error('Error loading verse of day:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerseOfDay();
  }, [books, language]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="h-6 w-full bg-muted rounded mb-2" />
        <div className="h-6 w-3/4 bg-muted rounded" />
      </div>
    );
  }

  if (!verseData) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary rounded-2xl p-6 border border-primary/20">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Verse of the Day</span>
        </div>
        
        <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-foreground mb-4">
          "{verseData.verse.text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <cite className="text-muted-foreground not-italic">
            — {verseData.book} {verseData.chapter}:{verseData.verse.verse}
          </cite>
          
          {onNavigate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(verseData.bookMeta, verseData.chapter, verseData.verse.verse)}
              className="gap-1 text-primary hover:text-primary"
            >
              Read more
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
