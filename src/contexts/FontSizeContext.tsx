import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type FontSize = 'sm' | 'base' | 'lg' | 'xl';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const fontSizes: FontSize[] = ['sm', 'base', 'lg', 'xl'];

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useLocalStorage<FontSize>('fontSize', 'base');

  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) throw new Error('useFontSize must be used within FontSizeProvider');
  return context;
};
