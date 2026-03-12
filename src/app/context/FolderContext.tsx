/**
 * FolderContext
 * Unified folder system — a folder can hold any mix of
 * transcripts, profiles, and prompts.
 *
 * DATA_VERSION: bump this string whenever INITIAL_FOLDERS changes so
 * React resets stale HMR state to the latest seed data.
 */
import React, { createContext, useContext, useState } from 'react';

export type FolderItemType = 'transcript' | 'profile' | 'prompt';

export interface FolderItem {
  uid: string;
  type: FolderItemType;
  refId: string | number;
  name: string;
  /** profile: @handle  |  transcript: duration  |  prompt: category */
  meta?: string;
  /** transcript: creator @handle */
  handle?: string;
  /** profile: avatar URL */
  avatar?: string;
  addedAt: string;
  // ── Rich display metadata ──────────────────────────────────────────────────
  /** transcript: video thumbnail URL */
  thumbnail?: string;
  /** transcript: source platform ('YouTube' | 'TikTok' | 'Instagram') */
  platform?: string;
  /** profile: platforms the creator is active on */
  platforms?: string[];
  /** profile: total video count on that creator */
  videoCount?: number;
}

export interface Folder {
  id: number;
  name: string;
  items: FolderItem[];
}

interface FolderContextValue {
  folders: Folder[];
  addItem: (folderId: number, item: Omit<FolderItem, 'uid' | 'addedAt'>) => void;
  removeItem: (folderId: number, type: FolderItemType, refId: string | number) => void;
  toggleItem: (folderId: number, item: Omit<FolderItem, 'uid' | 'addedAt'>) => void;
  createFolder: (name: string) => number;
  deleteFolder: (folderId: number) => void;
  renameFolder: (folderId: number, name: string) => void;
  isInFolder: (folderId: number, type: FolderItemType, refId: string | number) => boolean;
  getFoldersContaining: (type: FolderItemType, refId: string | number) => Folder[];
}

export const FolderContext = createContext<FolderContextValue>({
  folders: [],
  addItem: () => {},
  removeItem: () => {},
  toggleItem: () => {},
  createFolder: () => 0,
  deleteFolder: () => {},
  renameFolder: () => {},
  isInFolder: () => false,
  getFoldersContaining: () => [],
});

let nextFolderId = 600;

// ─── Bump DATA_VERSION whenever INITIAL_FOLDERS changes ───────────────────────
const DATA_VERSION = 'v6-transcript-handles';

// ─── Seed data ────────────────────────────────────────────────────────────────
// Free users start with only the Favourites folder.
// The limit is FREE_LIMITS.folders = 3, so they can create 2 more before
// hitting the upgrade gate.
const INITIAL_FOLDERS: Folder[] = [
  {
    id: 500,
    name: 'Favourites',
    items: [
      // ── Profiles (10) ──────────────────────────────────────────────────────
      {
        uid: 'f500-p01', type: 'profile', refId: 'tokcast',
        name: 'TokCast', meta: '@tokcast',
        avatar: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',
        addedAt: '2026-02-14T10:00:00Z',
        platforms: ['YouTube', 'TikTok'],
        videoCount: 214,
      },
      {
        uid: 'f500-p02', type: 'profile', refId: 'fitwithjess',
        name: 'Fit With Jess', meta: '@fitwithjess',
        avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
        addedAt: '2026-02-20T14:30:00Z',
        platforms: ['YouTube', 'TikTok'],
        videoCount: 347,
      },
      {
        uid: 'f500-p03', type: 'profile', refId: 'roamingalex',
        name: 'Roaming Alex', meta: '@roamingalex',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        addedAt: '2026-02-18T08:45:00Z',
        platforms: ['YouTube', 'Instagram'],
        videoCount: 189,
      },
      {
        uid: 'f500-p04', type: 'profile', refId: 'desksetup',
        name: 'Desk Setup Daily', meta: '@desksetup',
        avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=400&q=80',
        addedAt: '2026-02-16T11:20:00Z',
        platforms: ['YouTube'],
        videoCount: 163,
      },
      {
        uid: 'f500-p05', type: 'profile', refId: 'chefmarcus',
        name: 'Chef Marcus', meta: '@chefmarcus',
        avatar: 'https://images.unsplash.com/photo-1583394293214-be3e3c5e3632?w=400&q=80',
        addedAt: '2026-02-15T13:00:00Z',
        platforms: ['TikTok', 'Instagram'],
        videoCount: 284,
      },
      {
        uid: 'f500-p06', type: 'profile', refId: 'mindfulmornings',
        name: 'Mindful Mornings', meta: '@mindfulmornings',
        avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&q=80',
        addedAt: '2026-02-13T07:30:00Z',
        platforms: ['TikTok', 'YouTube'],
        videoCount: 97,
      },
      {
        uid: 'f500-p07', type: 'profile', refId: 'techwithtara',
        name: 'Tech with Tara', meta: '@techwithtara',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        addedAt: '2026-02-12T16:00:00Z',
        platforms: ['TikTok', 'Instagram'],
        videoCount: 312,
      },
      {
        uid: 'f500-p08', type: 'profile', refId: 'growthlab',
        name: 'Growth Lab', meta: '@growthlab',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        addedAt: '2026-02-11T09:00:00Z',
        platforms: ['YouTube', 'TikTok'],
        videoCount: 78,
      },
      {
        uid: 'f500-p09', type: 'profile', refId: 'sarahbuilds',
        name: 'Sarah Builds', meta: '@sarahbuilds',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        addedAt: '2026-02-10T14:15:00Z',
        platforms: ['YouTube', 'Instagram'],
        videoCount: 441,
      },
      {
        uid: 'f500-p10', type: 'profile', refId: 'veganvibes',
        name: 'Vegan Vibes', meta: '@veganvibes',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
        addedAt: '2026-02-09T10:30:00Z',
        platforms: ['TikTok', 'Instagram'],
        videoCount: 528,
      },
      // ── Prompts (10) ───────────────────────────────────────────────────────
      {
        uid: 'f500-pr01', type: 'prompt', refId: 1,
        name: 'Viral Hook Generator', meta: 'Hooks',
        addedAt: '2026-02-22T09:15:00Z',
      },
      {
        uid: 'f500-pr02', type: 'prompt', refId: 2,
        name: 'LinkedIn Thread Converter', meta: 'Repurpose',
        addedAt: '2026-02-21T11:00:00Z',
      },
      {
        uid: 'f500-pr03', type: 'prompt', refId: 3,
        name: 'Executive Summary', meta: 'Summary',
        addedAt: '2026-02-20T10:30:00Z',
      },
      {
        uid: 'f500-pr04', type: 'prompt', refId: 4,
        name: 'Rewrite for Virality', meta: 'Script',
        addedAt: '2026-02-19T14:00:00Z',
      },
      {
        uid: 'f500-pr05', type: 'prompt', refId: 5,
        name: 'Virality Score & Breakdown', meta: 'Analysis',
        addedAt: '2026-02-18T16:30:00Z',
      },
      {
        uid: 'f500-pr06', type: 'prompt', refId: 6,
        name: 'Comment Bait Questions', meta: 'Engagement',
        addedAt: '2026-02-17T09:45:00Z',
      },
      {
        uid: 'f500-pr07', type: 'prompt', refId: 8,
        name: 'YouTube SEO Description', meta: 'SEO',
        addedAt: '2026-02-16T13:20:00Z',
      },
      {
        uid: 'f500-pr08', type: 'prompt', refId: 9,
        name: 'Pattern-Interrupt Openers', meta: 'Hooks',
        addedAt: '2026-02-15T10:00:00Z',
      },
      {
        uid: 'f500-pr09', type: 'prompt', refId: 12,
        name: 'Caption Pack (5 Styles)', meta: 'Engagement',
        addedAt: '2026-02-14T15:30:00Z',
      },
      {
        uid: 'f500-pr10', type: 'prompt', refId: 14,
        name: 'TLDR Tweet', meta: 'Summary',
        addedAt: '2026-02-13T11:45:00Z',
      },
      // ── Transcripts (10) ───────────────────────────────────────────────────
      {
        uid: 'f500-t01', type: 'transcript', refId: 'transcript-f01',
        name: 'MrBeast — 50 Hours Buried Alive', meta: '28:14',
        handle: '@mrbeast',
        addedAt: '2026-03-01T09:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1642726197634-2a21f764220a?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t02', type: 'transcript', refId: 'transcript-f02',
        name: 'Ali Abdaal — My Morning Routine 2026', meta: '14:52',
        handle: '@aliabdaal',
        addedAt: '2026-02-28T10:30:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1768295984707-64ab37e539dd?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t03', type: 'transcript', refId: 'transcript-f03',
        name: 'Lex Fridman Podcast #412 — Sam Altman', meta: '3:08:44',
        handle: '@lexfridman',
        addedAt: '2026-02-27T14:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1660675588067-13ecd2c19de4?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t04', type: 'transcript', refId: 'transcript-f04',
        name: 'MKBHD — iPhone 17 Review', meta: '22:31',
        handle: '@mkbhd',
        addedAt: '2026-02-26T16:15:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1584091376810-0f79ff748352?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t05', type: 'transcript', refId: 'transcript-f05',
        name: 'Andrew Huberman — Sleep Protocol', meta: '1:44:10',
        handle: '@hubermanlab',
        addedAt: '2026-02-25T08:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1576073460124-e073bb8d87f9?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t06', type: 'transcript', refId: 'transcript-f06',
        name: 'Y Combinator — How to Start a Startup', meta: '47:33',
        handle: '@ycombinator',
        addedAt: '2026-02-24T11:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1576073460124-e073bb8d87f9?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t07', type: 'transcript', refId: 'transcript-f07',
        name: 'Veritasium — Why Most People Are Wrong', meta: '18:06',
        handle: '@veritasium',
        addedAt: '2026-02-23T13:30:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1769839271422-470ea5c9eca0?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t08', type: 'transcript', refId: 'transcript-f08',
        name: 'Fireship — The Future of AI in 100 Seconds', meta: '2:08',
        handle: '@fireship',
        addedAt: '2026-02-22T15:45:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1753998943619-b9cd910887e5?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t09', type: 'transcript', refId: 'transcript-f09',
        name: 'Linus Tech Tips — $50k PC Build', meta: '35:19',
        handle: '@linustechtips',
        addedAt: '2026-02-21T10:00:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1729357671906-875e1bc2f0bf?w=320&q=80',
        platform: 'YouTube',
      },
      {
        uid: 'f500-t10', type: 'transcript', refId: 'transcript-f10',
        name: 'Cold Fusion — The Collapse of Silicon Valley Bank', meta: '21:44',
        handle: '@coldfusion',
        addedAt: '2026-02-20T12:30:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1678716192971-488d15fb7687?w=320&q=80',
        platform: 'YouTube',
      },
    ],
  },
];

// ─── Provider ─────────────────────────────────────────────────────────────────
export function FolderProvider({ children }: { children: React.ReactNode }) {
  // dataVersion tracks which seed data is loaded.
  // When DATA_VERSION changes (e.g. after an HMR reload), prevVersion
  // will differ → we reset folders to the latest INITIAL_FOLDERS in-render.
  const [prevVersion, setPrevVersion] = useState(DATA_VERSION);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);

  // React-supported in-render state sync pattern (like getDerivedStateFromProps).
  // Runs synchronously if the module's DATA_VERSION changes between renders.
  if (prevVersion !== DATA_VERSION) {
    setPrevVersion(DATA_VERSION);
    setFolders(INITIAL_FOLDERS);
  }

  const addItem = (folderId: number, item: Omit<FolderItem, 'uid' | 'addedAt'>) => {
    setFolders(prev => prev.map(f => {
      if (f.id !== folderId) return f;
      const already = f.items.some(i => i.type === item.type && i.refId === item.refId);
      if (already) return f;
      return {
        ...f,
        items: [
          ...f.items,
          { ...item, uid: `f${folderId}-${Date.now()}`, addedAt: new Date().toISOString() },
        ],
      };
    }));
  };

  const removeItem = (folderId: number, type: FolderItemType, refId: string | number) => {
    setFolders(prev => prev.map(f => {
      if (f.id !== folderId) return f;
      return { ...f, items: f.items.filter(i => !(i.type === type && i.refId === refId)) };
    }));
  };

  const toggleItem = (folderId: number, item: Omit<FolderItem, 'uid' | 'addedAt'>) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    const exists = folder.items.some(i => i.type === item.type && i.refId === item.refId);
    if (exists) removeItem(folderId, item.type, item.refId);
    else addItem(folderId, item);
  };

  const createFolder = (name: string): number => {
    const id = nextFolderId++;
    setFolders(prev => [...prev, { id, name, items: [] }]);
    return id;
  };

  const deleteFolder = (folderId: number) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const renameFolder = (folderId: number, name: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name } : f));
  };

  const isInFolder = (folderId: number, type: FolderItemType, refId: string | number): boolean => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.items.some(i => i.type === type && i.refId === refId) ?? false;
  };

  const getFoldersContaining = (type: FolderItemType, refId: string | number): Folder[] => {
    return folders.filter(f => f.items.some(i => i.type === type && i.refId === refId));
  };

  return (
    <FolderContext.Provider value={{
      folders, addItem, removeItem, toggleItem,
      createFolder, deleteFolder, renameFolder,
      isInFolder, getFoldersContaining,
    }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  return useContext(FolderContext);
}