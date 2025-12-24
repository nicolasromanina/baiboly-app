import { useState, useEffect, useCallback } from 'react';
import { IndexedDbService } from '../services/indexedDbService';
import { BibleApiService } from '../services/bibleApi';
import type { Book, BookMetadata, Language } from '../types/bible';

interface UseBibleDataProps {
  dbService: IndexedDbService | null;
  language: string;
  selectedBook: BookMetadata | null;
}

export function useBibleData({ dbService, language, selectedBook }: UseBibleDataProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiService = new BibleApiService();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const cachedLanguages = await dbService?.getLanguages();
        if (cachedLanguages) {
          setLanguages(cachedLanguages);
        } else {
          const langs = await apiService.fetchLanguages();
          setLanguages(langs);
          await dbService?.saveLanguages(langs);
        }
      } catch (err) {
        console.error('Error loading languages:', err);
        setError('Failed to load languages');
      }
    };

    if (dbService) {
      loadLanguages();
    }
  }, [dbService]);

  useEffect(() => {
    const loadBooks = async () => {
      if (!language) {
        setBooks([]);
        return;
      }
      
      try {
        setLoading(true);
        const booksData = await apiService.fetchAvailableBooks(language);
        setBooks(booksData);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [language]);

  const loadBook = useCallback(async () => {
    if (!dbService || !language || !selectedBook) return;

    try {
      setLoading(true);
      setError(null);

      const cachedBook = await dbService.getBook(language, selectedBook.file);
      if (cachedBook) {
        setBookData(cachedBook);
        return;
      }

      const fetchedBook = await apiService.fetchBook(language, selectedBook.file);
      setBookData(fetchedBook);
      
      await dbService.saveBook(language, selectedBook.file, fetchedBook);
    } catch (err) {
      console.error('Error loading book:', err);
      setError(`Failed to load book: ${selectedBook.name}`);
    } finally {
      setLoading(false);
    }
  }, [dbService, language, selectedBook]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  return {
    languages,
    books,
    bookData,
    loading,
    error,
    refetchBook: loadBook
  };
}
