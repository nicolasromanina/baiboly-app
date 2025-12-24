import { useState, useCallback, useEffect, useRef } from 'react';

interface UseTextToSpeechProps {
  language: string;
}

// Language code mapping for speech synthesis
const languageVoiceMap: Record<string, string[]> = {
  en: ['en-US', 'en-GB', 'en'],
  mg: ['mg', 'mg-MG', 'fr', 'fr-FR'], // Malagasy fallback to French
  ko: ['ko-KR', 'ko'],
};

export function useTextToSpeech({ language }: UseTextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textsRef = useRef<string[]>([]);
  const currentIndexRef = useRef(-1);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const getVoice = useCallback(() => {
    if (!isSupported) return null;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredLangs = languageVoiceMap[language] || ['en-US'];
    
    for (const lang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }
    
    // Fallback to first available voice
    return voices[0] || null;
  }, [language, isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(-1);
    currentIndexRef.current = -1;
    textsRef.current = [];
  }, [isSupported]);

  const speakNext = useCallback(() => {
    if (currentIndexRef.current >= textsRef.current.length - 1) {
      stop();
      return;
    }

    currentIndexRef.current += 1;
    setCurrentIndex(currentIndexRef.current);
    
    const utterance = new SpeechSynthesisUtterance(textsRef.current[currentIndexRef.current]);
    utterance.voice = getVoice();
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      speakNext();
    };
    
    utterance.onerror = () => {
      stop();
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoice, stop]);

  const speak = useCallback((texts: string[]) => {
    if (!isSupported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    textsRef.current = texts;
    currentIndexRef.current = -1;
    setIsPlaying(true);
    setIsPaused(false);
    
    // Small delay to ensure voices are loaded
    setTimeout(() => {
      speakNext();
    }, 100);
  }, [isSupported, speakNext]);

  const pause = useCallback(() => {
    if (!isSupported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isPlaying]);

  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  const toggle = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isPlaying) {
      pause();
    }
  }, [isPaused, isPlaying, pause, resume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Load voices
  useEffect(() => {
    if (!isSupported) return;
    
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    currentIndex,
    speak,
    pause,
    resume,
    stop,
    toggle,
  };
}
