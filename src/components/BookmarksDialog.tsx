import { useState } from 'react';
import { Bookmark, Trash2, ArrowRight, X, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Bookmark as BookmarkType, BookMetadata } from '@/types/bible';

interface BookmarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookmarks: BookmarkType[];
  books: BookMetadata[];
  onDeleteBookmark: (bookmark: BookmarkType) => void;
  onNavigate: (bookId: string, chapter: number, verse: number) => void;
}

export function BookmarksDialog({
  open,
  onOpenChange,
  bookmarks,
  books,
  onDeleteBookmark,
  onNavigate,
}: BookmarksDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Group bookmarks by book
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const bookName = books.find(b => b.id === bookmark.book)?.name || bookmark.book;
    if (!acc[bookName]) {
      acc[bookName] = [];
    }
    acc[bookName].push(bookmark);
    return acc;
  }, {} as Record<string, BookmarkType[]>);

  // Sort each group by chapter and verse
  Object.keys(groupedBookmarks).forEach(bookName => {
    groupedBookmarks[bookName].sort((a, b) => {
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
  });

  const handleNavigate = (bookmark: BookmarkType) => {
    onNavigate(bookmark.book, bookmark.chapter, bookmark.verse);
    onOpenChange(false);
  };

  const handleDelete = (bookmark: BookmarkType, index: number) => {
    if (confirmDelete === index) {
      onDeleteBookmark(bookmark);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(index);
      // Auto reset after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setConfirmDelete(null);
    }}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Bookmarks ({bookmarks.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bookmark className="h-12 w-12 mb-4 opacity-20" />
              <p>No bookmarks yet</p>
              <p className="text-sm mt-1">Click a verse and save it to add bookmarks</p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {Object.entries(groupedBookmarks).map(([bookName, bookmarks]) => (
                  <div key={bookName}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        {bookName}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {bookmarks.map((bookmark, index) => (
                        <div
                          key={`${bookmark.book}-${bookmark.chapter}-${bookmark.verse}`}
                          className={cn(
                            "p-4 rounded-xl transition-all duration-200",
                            "bg-secondary/50 border border-transparent hover:border-border",
                            "group"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              onClick={() => handleNavigate(bookmark)}
                              className="flex-1 text-left"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">
                                  Chapter {bookmark.chapter}:{bookmark.verse}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 font-serif">
                                "{bookmark.text}"
                              </p>
                            </button>
                            <Button
                              variant={confirmDelete === index ? "destructive" : "ghost"}
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleDelete(bookmark, index)}
                            >
                              {confirmDelete === index ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(bookmark.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
