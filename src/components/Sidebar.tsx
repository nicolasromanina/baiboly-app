import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { BookMetadata } from '@/types/bible';

interface SidebarProps {
  books: BookMetadata[];
  selectedBook: BookMetadata | null;
  onBookChange: (book: BookMetadata) => void;
}

export function Sidebar({ books, selectedBook, onBookChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTestament, setExpandedTestament] = useState<'old' | 'new' | 'both'>('old');

  const oldTestamentBooks = books.filter(b => b.testament === 'old');
  const newTestamentBooks = books.filter(b => b.testament === 'new');

  const filteredOldTestament = oldTestamentBooks.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredNewTestament = newTestamentBooks.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-expand the testament containing the selected book
  useEffect(() => {
    if (selectedBook) {
      if (selectedBook.testament === 'new') {
        setExpandedTestament('new');
      } else {
        setExpandedTestament('old');
      }
    }
  }, [selectedBook]);

  // When searching, expand both
  useEffect(() => {
    if (searchQuery) {
      setExpandedTestament('both');
    }
  }, [searchQuery]);

  const toggleTestament = (testament: 'old' | 'new') => {
    if (expandedTestament === 'both') {
      setExpandedTestament(testament);
    } else if (expandedTestament === testament) {
      setExpandedTestament(testament === 'old' ? 'new' : 'old');
    } else {
      setExpandedTestament(testament);
    }
  };

  const isExpanded = (testament: 'old' | 'new') => 
    expandedTestament === testament || expandedTestament === 'both';

  const renderBookList = (bookList: BookMetadata[]) => (
    <div className="space-y-0.5 py-1 pl-2">
      {bookList.map((book) => (
        <button
          key={book.file}
          onClick={() => onBookChange(book)}
          className={cn(
            "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-secondary flex items-center justify-between group text-sm",
            selectedBook?.file === book.file && "bg-primary text-primary-foreground hover:bg-primary"
          )}
        >
          <span className="truncate font-medium">{book.name}</span>
          <span className={cn(
            "text-xs opacity-50 tabular-nums",
            selectedBook?.file === book.file && "opacity-70"
          )}>
            {book.chapters}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--sidebar-bg))]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Books
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background text-sm"
          />
        </div>
      </div>

      {/* Book list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Old Testament */}
          <div className="mb-1">
            <button
              onClick={() => toggleTestament('old')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Old Testament ({filteredOldTestament.length})
              </span>
              {isExpanded('old') ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded('old') ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}>
              {renderBookList(filteredOldTestament)}
            </div>
          </div>

          {/* New Testament */}
          <div>
            <button
              onClick={() => toggleTestament('new')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                New Testament ({filteredNewTestament.length})
              </span>
              {isExpanded('new') ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded('new') ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}>
              {renderBookList(filteredNewTestament)}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
