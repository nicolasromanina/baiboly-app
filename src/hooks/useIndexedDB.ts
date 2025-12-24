import { useState, useEffect } from 'react';
import { IndexedDbService } from '../services/indexedDbService';

export function useIndexedDB() {
  const [dbService, setDbService] = useState<IndexedDbService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      const service = new IndexedDbService();
      try {
        await service.init();
        setDbService(service);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    initDb();
  }, []);

  return { dbService, isInitialized };
}
