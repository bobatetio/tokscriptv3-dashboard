import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type TourStep = {
  id: string;
  target: string | null;
  title: string;
  description: string;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to TokScript',
    description: "You're all set up. Let's take a quick tour so you know your way around — it'll only take a moment.",
  },
  {
    id: 'new-scan',
    target: '[data-tour="new-scan"]',
    title: 'Start a new scan',
    description: 'Paste any TikTok, YouTube, or Instagram URL here to instantly transcribe a video.',
  },
  {
    id: 'library',
    target: '[data-tour="singles"]',
    title: 'Your transcript library',
    description: 'All your transcribed videos live here. Browse, search, filter, and manage them from one place.',
  },
  {
    id: 'profiles',
    target: '[data-tour="profiles"]',
    title: 'Creator profiles',
    description: 'Track specific creators, scan their entire back-catalogue, and download transcripts in bulk.',
  },
  {
    id: 'prompt-base',
    target: '[data-tour="prompt-base"]',
    title: 'AI Prompt library',
    description: 'Ready-made prompts to turn any transcript into viral hooks, summaries, scripts, SEO copy, and more.',
  },
];

type TourContextType = {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  start: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
};

const TourContext = createContext<TourContextType | null>(null);

const STORAGE_KEY = 'tokscript_tour_done';

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setIsActive(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const finish = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const next = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= TOUR_STEPS.length - 1) {
        finish();
        return 0;
      }
      return prev + 1;
    });
  }, [finish]);

  const prev = useCallback(() => {
    setCurrentStep(p => Math.max(0, p - 1));
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  return (
    <TourContext.Provider value={{ isActive, currentStep, steps: TOUR_STEPS, start, next, prev, skip }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}
