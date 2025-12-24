import type { Book, Language } from '../types/bible';

const DB_NAME = 'BibleAppDB';
const DB_VERSION = 2;
const BOOKS_STORE = 'books';
const LANGUAGES_STORE = 'languages';

export class IndexedDbService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        
        if (this.db.objectStoreNames.contains(BOOKS_STORE)) {
          this.db.deleteObjectStore(BOOKS_STORE);
        }
        if (this.db.objectStoreNames.contains(LANGUAGES_STORE)) {
          this.db.deleteObjectStore(LANGUAGES_STORE);
        }
        
        const booksStore = this.db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        booksStore.createIndex('language', 'language', { unique: false });
        booksStore.createIndex('file', 'file', { unique: false });
        
        this.db.createObjectStore(LANGUAGES_STORE, { keyPath: 'code' });
      };
    });
  }

  async saveBook(language: string, fileName: string, book: Book): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKS_STORE], 'readwrite');
      const store = transaction.objectStore(BOOKS_STORE);
      
      store.put({
        id: `${language}:${fileName}`,
        language,
        file: fileName,
        data: book,
        timestamp: Date.now()
      });
      
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async getBook(language: string, fileName: string): Promise<Book | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([BOOKS_STORE], 'readonly');
      const store = transaction.objectStore(BOOKS_STORE);
      const request = store.get(`${language}:${fileName}`);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.data || null);
    });
  }

  async saveLanguages(languages: Language[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([LANGUAGES_STORE], 'readwrite');
      const store = transaction.objectStore(LANGUAGES_STORE);
      
      languages.forEach(lang => store.put(lang));
      
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async getLanguages(): Promise<Language[] | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([LANGUAGES_STORE], 'readonly');
      const store = transaction.objectStore(LANGUAGES_STORE);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.length > 0 ? request.result : null);
    });
  }
}
