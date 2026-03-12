/**
 * UserContext
 * ───────────
 * Tracks the logged-in user's plan (free | pro) and exposes an
 * upgrade-modal trigger used across all inner pages.
 */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserPlan = 'free' | 'pro';

interface UserContextValue {
  plan: UserPlan;
  setPlan: (p: UserPlan) => void;
  upgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
  /** Monthly transcription quota */
  transcriptionsUsed: number;
  transcriptionsLimit: number;
}

export const UserContext = createContext<UserContextValue>({
  plan: 'free',
  setPlan: () => {},
  upgradeOpen: false,
  openUpgrade: () => {},
  closeUpgrade: () => {},
  transcriptionsUsed: 3,
  transcriptionsLimit: 5,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<UserPlan>('free');
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const setPlan = (p: UserPlan) => {
    setPlanState(p);
    if (p === 'pro') setUpgradeOpen(false);
  };

  return (
    <UserContext.Provider value={{
      plan,
      setPlan,
      upgradeOpen,
      openUpgrade:  () => setUpgradeOpen(true),
      closeUpgrade: () => setUpgradeOpen(false),
      transcriptionsUsed: 3,
      transcriptionsLimit: 5,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

/** Free-tier hard limits */
export const FREE_LIMITS = {
  singles:        3,
  prompts:        5,
  discoverViews:  5,
  folders:        3,
} as const;