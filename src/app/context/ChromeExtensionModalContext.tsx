import { createContext, useContext, useState, type ReactNode } from 'react';

interface ChromeExtensionModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ChromeExtensionModalContext = createContext<ChromeExtensionModalContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function ChromeExtensionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ChromeExtensionModalContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }}>
      {children}
    </ChromeExtensionModalContext.Provider>
  );
}

export function useExtensionModal() {
  return useContext(ChromeExtensionModalContext);
}
