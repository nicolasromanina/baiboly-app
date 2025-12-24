import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/hooks/useSearch';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: SearchResult[];
  isSearching: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  onResultClick: (bookId: string, chapter: number, verse: number) => void;
  onClear: () => void;
}

function HighlightedText({ text, matchIndices }: { text: string; matchIndices: [number, number][] }) {
  if (matchIndices.length === 0) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const [start, end] of matchIndices) {
    if (start > lastEnd) {
      parts.push(<span key={`text-${lastEnd}`}>{text.slice(lastEnd, start)}</span>);
    }
    parts.push(
      <mark key={`highlight-${start}`} className="bg-primary/30 text-foreground rounded px-0.5">
        {text.slice(start, end)}
      </mark>
    );
    lastEnd = end;
  }

  if (lastEnd < text.length) {
    parts.push(<span key={`text-${lastEnd}`}>{text.slice(lastEnd)}</span>);
  }

  return <>{parts}</>;
}

export function SearchDialog({
  open,
  onOpenChange,
  results,
  isSearching,
  searchQuery,
  onSearch,
  onResultClick,
  onClear,
}: SearchDialogProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (open) {
      setInputValue(searchQuery);
    }
  }, [open, searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length >= 2) {
        onSearch(inputValue);
      } else if (inputValue.length === 0) {
        onClear();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch, onClear]);

  const handleResultClick = useCallback((result: SearchResult) => {
    onResultClick(result.bookId, result.chapter, result.verse.verse);
    onOpenChange(false);
  }, [onResultClick, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search the Bible</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search verses..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => {
                  setInputValue('');
                  onClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Found {results.length}{results.length === 100 ? '+' : ''} results
                </p>
                {results.map((result, index) => (
                  <button
                    key={`${result.bookId}-${result.chapter}-${result.verse.verse}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-200",
                      "bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border",
                      "group"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">
                          {result.bookName} {result.chapter}:{result.verse.verse}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-serif">
                      <HighlightedText text={result.verse.text} matchIndices={result.matchIndices} />
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : inputValue.length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p>No results found for "{inputValue}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p>Type at least 2 characters to search</p>
              <p className="text-sm mt-1">Search across all books and verses</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
