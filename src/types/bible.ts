export interface BookMetadata {
  id: string;
  name: string;
  file: string;
  testament: 'old' | 'new';
  chapters: number;
}

export interface Book {
  book: string;
  chapters: Chapter[];
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Verse {
  verse: number;
  text: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  booksCount: number;
}

export interface Bookmark {
  language: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

export interface ReadingProgress {
  language: string;
  book: string;
  chapter: number;
  verse: number;
  timestamp: number;
}
