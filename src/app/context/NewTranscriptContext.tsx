import { createContext, useContext, useState, type ReactNode } from 'react';

interface NewTranscriptContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const NewTranscriptContext = createContext<NewTranscriptContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function NewTranscriptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NewTranscriptContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </NewTranscriptContext.Provider>
  );
}

export function useNewTranscript() {
  return useContext(NewTranscriptContext);
}
