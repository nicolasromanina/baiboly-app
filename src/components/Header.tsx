import { Book, Menu, Moon, Sun, Type, Minus, Plus, Search, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontSize } from '@/contexts/FontSizeContext';
import type { Language } from '@/types/bible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  sidebarContent?: React.ReactNode;
}

export function Header({ 
  languages, 
  selectedLanguage, 
  onLanguageChange,
  onOpenSearch,
  onOpenBookmarks,
  bookmarksCount,
  sidebarContent 
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Book className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">Baiboly</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onOpenSearch}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Bookmarks button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative"
            onClick={onOpenBookmarks}
          >
            <Bookmark className="h-4 w-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {bookmarksCount > 9 ? '9+' : bookmarksCount}
              </span>
            )}
          </Button>

          {/* Language selector */}
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[100px] sm:w-[130px] h-9 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font size control */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decreaseFontSize}
                  disabled={fontSize === 'sm'}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center capitalize">{fontSize}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={increaseFontSize}
                  disabled={fontSize === 'xl'}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
