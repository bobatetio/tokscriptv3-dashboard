import { createContext, useContext, useState, type ReactNode } from 'react';
import { VideoSession } from '../components/videos/types';

interface NewTranscriptContextValue {
  isOpen: boolean;
  open: (tab?: string) => void;
  close: () => void;
  initialTab: string | null;
  pendingVideoLinks: string[];
  setPendingVideoLinks: (links: string[]) => void;
  videoSessions: VideoSession[];
  addVideoSession: (session: VideoSession) => void;
  pendingDownloads: number;
  setPendingDownloads: (n: number) => void;
}

const NewTranscriptContext = createContext<NewTranscriptContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  initialTab: null,
  pendingVideoLinks: [],
  setPendingVideoLinks: () => {},
  videoSessions: [],
  addVideoSession: () => {},
  pendingDownloads: 0,
  setPendingDownloads: () => {},
});

export function NewTranscriptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<string | null>(null);
  const [pendingVideoLinks, setPendingVideoLinks] = useState<string[]>([]);
  const [videoSessions, setVideoSessions] = useState<VideoSession[]>([]);
  const [pendingDownloads, setPendingDownloads] = useState(0);

  const addVideoSession = (session: VideoSession) => {
    setVideoSessions(prev => [session, ...prev]);
  };

  return (
    <NewTranscriptContext.Provider value={{
      isOpen,
      open: (tab?: string) => { setInitialTab(tab ?? null); setIsOpen(true); },
      close: () => { setIsOpen(false); setInitialTab(null); },
      initialTab,
      pendingVideoLinks,
      setPendingVideoLinks,
      videoSessions,
      addVideoSession,
      pendingDownloads,
      setPendingDownloads,
    }}>
      {children}
    </NewTranscriptContext.Provider>
  );
}

export function useNewTranscript() {
  return useContext(NewTranscriptContext);
}
