import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChapterNavigationProps {
  currentChapter: number;
  totalChapters: number;
  bookName?: string;
  onChapterChange: (chapter: number) => void;
}

export function ChapterNavigation({ 
  currentChapter, 
  totalChapters, 
  bookName,
  onChapterChange 
}: ChapterNavigationProps) {
  const goToPrevious = () => {
    if (currentChapter > 1) {
      onChapterChange(currentChapter - 1);
    }
  };

  const goToNext = () => {
    if (currentChapter < totalChapters) {
      onChapterChange(currentChapter + 1);
    }
  };

  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between py-4 px-2 bg-card rounded-xl border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrevious}
        disabled={currentChapter === 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-2">
        {bookName && (
          <span className="font-medium text-foreground hidden sm:block">{bookName}</span>
        )}
        <Select
          value={currentChapter.toString()}
          onValueChange={(val) => onChapterChange(parseInt(val))}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter.toString()}>
                Chapter {chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">of {totalChapters}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        disabled={currentChapter === totalChapters}
        className="gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
