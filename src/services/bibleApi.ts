import type { Book, BookMetadata, Language } from '../types/bible';

const BASE_URL = 'https://baiboly.vercel.app';

interface BooksIndex {
  books: BookMetadata[];
}

export class BibleApiService {
  private fetchOptions: RequestInit = {
    method: 'GET',
    cache: 'no-cache',
  };

  async fetchLanguages(): Promise<Language[]> {
    return [
      { code: "mg", name: "Malagasy", nativeName: "Malagasy", booksCount: 66 },
      { code: "en", name: "English", nativeName: "English", booksCount: 66 },
      { code: "ko", name: "Korean", nativeName: "한국어", booksCount: 66 }
    ];
  }

  async fetchAvailableBooks(language: string): Promise<BookMetadata[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/${language}/index.json`,
        this.fetchOptions
      );
      if (!response.ok) throw new Error('Failed to fetch books index');
      
      const data: BooksIndex = await response.json();
      return data.books || [];
    } catch (error) {
      console.warn(`Using fallback books for ${language}`);
      return this.getDefaultBooksMetadata();
    }
  }

  async fetchBook(language: string, fileName: string): Promise<Book> {
    const response = await fetch(
      `${BASE_URL}/${language}/${fileName}`,
      this.fetchOptions
    );
    if (!response.ok) throw new Error(`Failed to fetch book: ${fileName}`);
    return response.json();
  }

  private getDefaultBooksMetadata(): BookMetadata[] {
    return [
      { id: 'gen', name: 'Genesis', file: 'Genesis.json', testament: 'old', chapters: 50 },
      { id: 'exo', name: 'Exodus', file: 'Exodus.json', testament: 'old', chapters: 40 },
      { id: 'lev', name: 'Leviticus', file: 'Leviticus.json', testament: 'old', chapters: 27 },
      { id: 'num', name: 'Numbers', file: 'Numbers.json', testament: 'old', chapters: 36 },
      { id: 'deu', name: 'Deuteronomy', file: 'Deuteronomy.json', testament: 'old', chapters: 34 },
      { id: 'jos', name: 'Joshua', file: 'Joshua.json', testament: 'old', chapters: 24 },
      { id: 'jdg', name: 'Judges', file: 'Judges.json', testament: 'old', chapters: 21 },
      { id: 'rut', name: 'Ruth', file: 'Ruth.json', testament: 'old', chapters: 4 },
      { id: '1sa', name: '1 Samuel', file: '1 Samuel.json', testament: 'old', chapters: 31 },
      { id: '2sa', name: '2 Samuel', file: '2 Samuel.json', testament: 'old', chapters: 24 },
      { id: '1ki', name: '1 Kings', file: '1 Kings.json', testament: 'old', chapters: 22 },
      { id: '2ki', name: '2 Kings', file: '2 Kings.json', testament: 'old', chapters: 25 },
      { id: '1ch', name: '1 Chronicles', file: '1 Chronicles.json', testament: 'old', chapters: 29 },
      { id: '2ch', name: '2 Chronicles', file: '2 Chronicles.json', testament: 'old', chapters: 36 },
      { id: 'ezr', name: 'Ezra', file: 'Ezra.json', testament: 'old', chapters: 10 },
      { id: 'neh', name: 'Nehemiah', file: 'Nehemiah.json', testament: 'old', chapters: 13 },
      { id: 'est', name: 'Esther', file: 'Esther.json', testament: 'old', chapters: 10 },
      { id: 'job', name: 'Job', file: 'Job.json', testament: 'old', chapters: 42 },
      { id: 'psa', name: 'Psalms', file: 'Psalms.json', testament: 'old', chapters: 150 },
      { id: 'pro', name: 'Proverbs', file: 'Proverbs.json', testament: 'old', chapters: 31 },
      { id: 'ecc', name: 'Ecclesiastes', file: 'Ecclesiastes.json', testament: 'old', chapters: 12 },
      { id: 'sos', name: 'Song of Solomon', file: 'Song of Solomon.json', testament: 'old', chapters: 8 },
      { id: 'isa', name: 'Isaiah', file: 'Isaiah.json', testament: 'old', chapters: 66 },
      { id: 'jer', name: 'Jeremiah', file: 'Jeremiah.json', testament: 'old', chapters: 52 },
      { id: 'lam', name: 'Lamentations', file: 'Lamentations.json', testament: 'old', chapters: 5 },
      { id: 'eze', name: 'Ezekiel', file: 'Ezekiel.json', testament: 'old', chapters: 48 },
      { id: 'dan', name: 'Daniel', file: 'Daniel.json', testament: 'old', chapters: 12 },
      { id: 'hos', name: 'Hosea', file: 'Hosea.json', testament: 'old', chapters: 14 },
      { id: 'joe', name: 'Joel', file: 'Joel.json', testament: 'old', chapters: 3 },
      { id: 'amo', name: 'Amos', file: 'Amos.json', testament: 'old', chapters: 9 },
      { id: 'oba', name: 'Obadiah', file: 'Obadiah.json', testament: 'old', chapters: 1 },
      { id: 'jon', name: 'Jonah', file: 'Jonah.json', testament: 'old', chapters: 4 },
      { id: 'mic', name: 'Micah', file: 'Micah.json', testament: 'old', chapters: 7 },
      { id: 'nah', name: 'Nahum', file: 'Nahum.json', testament: 'old', chapters: 3 },
      { id: 'hab', name: 'Habakkuk', file: 'Habakkuk.json', testament: 'old', chapters: 3 },
      { id: 'zep', name: 'Zephaniah', file: 'Zephaniah.json', testament: 'old', chapters: 3 },
      { id: 'hag', name: 'Haggai', file: 'Haggai.json', testament: 'old', chapters: 2 },
      { id: 'zac', name: 'Zechariah', file: 'Zechariah.json', testament: 'old', chapters: 14 },
      { id: 'mal', name: 'Malachi', file: 'Malachi.json', testament: 'old', chapters: 4 },
      { id: 'mat', name: 'Matthew', file: 'Matthew.json', testament: 'new', chapters: 28 },
      { id: 'mar', name: 'Mark', file: 'Mark.json', testament: 'new', chapters: 16 },
      { id: 'luk', name: 'Luke', file: 'Luke.json', testament: 'new', chapters: 24 },
      { id: 'joh', name: 'John', file: 'John.json', testament: 'new', chapters: 21 },
      { id: 'act', name: 'Acts', file: 'Acts.json', testament: 'new', chapters: 28 },
      { id: 'rom', name: 'Romans', file: 'Romans.json', testament: 'new', chapters: 16 },
      { id: '1co', name: '1 Corinthians', file: '1 Corinthians.json', testament: 'new', chapters: 16 },
      { id: '2co', name: '2 Corinthians', file: '2 Corinthians.json', testament: 'new', chapters: 13 },
      { id: 'gal', name: 'Galatians', file: 'Galatians.json', testament: 'new', chapters: 6 },
      { id: 'eph', name: 'Ephesians', file: 'Ephesians.json', testament: 'new', chapters: 6 },
      { id: 'php', name: 'Philippians', file: 'Philippians.json', testament: 'new', chapters: 4 },
      { id: 'col', name: 'Colossians', file: 'Colossians.json', testament: 'new', chapters: 4 },
      { id: '1th', name: '1 Thessalonians', file: '1 Thessalonians.json', testament: 'new', chapters: 5 },
      { id: '2th', name: '2 Thessalonians', file: '2 Thessalonians.json', testament: 'new', chapters: 3 },
      { id: '1ti', name: '1 Timothy', file: '1 Timothy.json', testament: 'new', chapters: 6 },
      { id: '2ti', name: '2 Timothy', file: '2 Timothy.json', testament: 'new', chapters: 4 },
      { id: 'tit', name: 'Titus', file: 'Titus.json', testament: 'new', chapters: 3 },
      { id: 'phm', name: 'Philemon', file: 'Philemon.json', testament: 'new', chapters: 1 },
      { id: 'heb', name: 'Hebrews', file: 'Hebrews.json', testament: 'new', chapters: 13 },
      { id: 'jam', name: 'James', file: 'James.json', testament: 'new', chapters: 5 },
      { id: '1pe', name: '1 Peter', file: '1 Peter.json', testament: 'new', chapters: 5 },
      { id: '2pe', name: '2 Peter', file: '2 Peter.json', testament: 'new', chapters: 3 },
      { id: '1jo', name: '1 John', file: '1 John.json', testament: 'new', chapters: 5 },
      { id: '2jo', name: '2 John', file: '2 John.json', testament: 'new', chapters: 1 },
      { id: '3jo', name: '3 John', file: '3 John.json', testament: 'new', chapters: 1 },
      { id: 'jud', name: 'Jude', file: 'Jude.json', testament: 'new', chapters: 1 },
      { id: 'rev', name: 'Revelation', file: 'Revelation.json', testament: 'new', chapters: 22 }
    ];
  }
}
