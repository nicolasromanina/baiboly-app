import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChapterNavigation } from '@/components/ChapterNavigation';
import { VerseViewer } from '@/components/VerseViewer';
import { VerseOfDay } from '@/components/VerseOfDay';
import { FloatingActions } from '@/components/FloatingActions';
import { ReadingProgressCard } from '@/components/ReadingProgressCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useBibleData } from '@/hooks/useBibleData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, BookOpen } from 'lucide-react';
import type { BookMetadata, Bookmark, ReadingProgress } from '@/types/bible';

function BibleApp() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedBook, setSelectedBook] = useState<BookMetadata | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', []);
  const [readingProgress, setReadingProgress] = useLocalStorage<ReadingProgress | null>('readingProgress', null);

  const { dbService, isInitialized } = useIndexedDB();
  
  const { languages, books, bookData, loading, error } = useBibleData({
    dbService,
    language: selectedLanguage,
    selectedBook
  });

  // Save reading progress
  useEffect(() => {
    if (selectedBook && currentChapter) {
      setReadingProgress({
        language: selectedLanguage,
        book: selectedBook.id,
        chapter: currentChapter,
        verse: selectedVerse || 1,
        timestamp: Date.now()
      });
    }
  }, [selectedBook, currentChapter, selectedVerse, selectedLanguage]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setSelectedBook(null);
    setCurrentChapter(1);
    setSelectedVerse(null);
  };

  const handleBookChange = (book: BookMetadata) => {
    setSelectedBook(book);
    setCurrentChapter(1);
    setSelectedVerse(null);
  };

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);
    setSelectedVerse(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(prev => prev === verseNumber ? null : verseNumber);
  };

  const handleVerseOfDayNavigate = (book: BookMetadata, chapter: number, verse: number) => {
    setSelectedBook(book);
    setCurrentChapter(chapter);
    setSelectedVerse(verse);
  };

  const handleContinueReading = (book: BookMetadata, chapter: number) => {
    setSelectedBook(book);
    setCurrentChapter(chapter);
  };

  const toggleBookmark = () => {
    if (!selectedBook || !selectedVerse || !bookData) return;
    
    const chapterData = bookData.chapters.find(c => c.chapter === currentChapter);
    const verseData = chapterData?.verses.find(v => v.verse === selectedVerse);
    
    if (!verseData) return;

    const newBookmark: Bookmark = {
      language: selectedLanguage,
      book: selectedBook.id,
      chapter: currentChapter,
      verse: selectedVerse,
      text: verseData.text,
      timestamp: Date.now()
    };

    const exists = bookmarks.some(b => 
      b.language === newBookmark.language && 
      b.book === newBookmark.book && 
      b.chapter === newBookmark.chapter && 
      b.verse === newBookmark.verse
    );

    if (exists) {
      setBookmarks(bookmarks.filter(b => !(
        b.language === newBookmark.language && 
        b.book === newBookmark.book && 
        b.chapter === newBookmark.chapter && 
        b.verse === newBookmark.verse
      )));
    } else {
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  const currentChapterData = bookData?.chapters.find(c => c.chapter === currentChapter);
  
  const isBookmarked = selectedBook && selectedVerse ? bookmarks.some(b => 
    b.language === selectedLanguage && 
    b.book === selectedBook.id && 
    b.chapter === currentChapter && 
    b.verse === selectedVerse
  ) : false;

  const selectedVerseData = currentChapterData?.verses.find(v => v.verse === selectedVerse);
  const verseReference = selectedBook && selectedVerse 
    ? `${bookData?.book || selectedBook.name} ${currentChapter}:${selectedVerse}`
    : undefined;

  const sidebarContent = (
    <Sidebar
      books={books}
      selectedBook={selectedBook}
      onBookChange={handleBookChange}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        sidebarContent={sidebarContent}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 border-r border-border">
          {sidebarContent}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container max-w-3xl mx-auto px-4 py-6">
            {/* Welcome state - no book selected */}
            {!selectedBook && (
              <div className="space-y-6 fade-in">
                {/* Verse of the day */}
                <VerseOfDay 
                  books={books}
                  language={selectedLanguage}
                  onNavigate={handleVerseOfDayNavigate}
                />

                {/* Reading progress */}
                <ReadingProgressCard
                  progress={readingProgress}
                  books={books}
                  onContinue={handleContinueReading}
                />

                {/* Quick start hint */}
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Start Reading</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Select a book from the sidebar to begin your journey through the scriptures.
                  </p>
                </div>
              </div>
            )}

            {/* Book selected */}
            {selectedBook && (
              <div className="fade-in">
                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive mb-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="loading-spinner" />
                  </div>
                )}

                {/* Chapter content */}
                {!loading && bookData && currentChapterData && (
                  <>
                    {/* Book title */}
                    <h1 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-6">
                      {bookData.book}
                    </h1>

                    {/* Chapter navigation */}
                    <ChapterNavigation
                      currentChapter={currentChapter}
                      totalChapters={selectedBook.chapters || bookData.chapters.length}
                      onChapterChange={handleChapterChange}
                    />

                    {/* Verses */}
                    <VerseViewer
                      verses={currentChapterData.verses}
                      selectedVerse={selectedVerse}
                      onVerseClick={handleVerseClick}
                    />

                    {/* Bottom chapter navigation */}
                    <div className="mt-6 pb-24">
                      <ChapterNavigation
                        currentChapter={currentChapter}
                        totalChapters={selectedBook.chapters || bookData.chapters.length}
                        onChapterChange={handleChapterChange}
                      />
                    </div>
                  </>
                )}

                {/* No data state */}
                {!loading && !bookData && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">
                      No data available for {selectedBook.name}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating actions bar */}
      <FloatingActions
        isVisible={!!selectedVerse}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        selectedVerseText={selectedVerseData?.text}
        verseReference={verseReference}
      />
    </div>
  );
}

export default function Index() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <BibleApp />
      </FontSizeProvider>
    </ThemeProvider>
  );
}
