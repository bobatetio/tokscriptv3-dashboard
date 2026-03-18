import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

const BULK_DATA_VERSION = 2;

// ─── Types ────────────────────────────────────────────────────────────────────

export type BulkVideoStatus =
  | 'pending'
  | 'downloading'
  | 'transcribing'
  | 'completed'
  | 'failed'
  | 'unavailable';

export interface BulkVideo {
  id: number;
  url: string;
  title: string;
  platform: string;
  thumbnail?: string;
  duration?: string;
  creator?: string;
  avatar?: string;          // creator avatar URL
  verified?: boolean;
  snippet?: string;         // mock transcript snippet
  status: BulkVideoStatus;
  progress: number;
  error?: string;
  completedAt?: number;     // timestamp when this video completed
}

export interface BulkBatch {
  id: number;
  name: string;
  createdAt: number;
  status: 'processing' | 'completed' | 'partial' | 'failed';
  videos: BulkVideo[];
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface BulkContextValue {
  bulkBatches: BulkBatch[];
  addBulkBatch: (batch: BulkBatch) => void;
  activeBatchId: number | null;
  setActiveBatchId: (id: number | null) => void;
  retryVideo: (batchId: number, videoId: number) => void;
  removeVideo: (batchId: number, videoId: number) => void;
  removeBatch: (batchId: number) => void;
}

// ─── Mock Creator Names ───────────────────────────────────────────────────────

const MOCK_CREATORS = [
  { handle: '@keynoteking', avatar: 'https://i.pravatar.cc/40?u=keynoteking', verified: true },
  { handle: '@aifuturist', avatar: 'https://i.pravatar.cc/40?u=aifuturist', verified: true },
  { handle: '@jasonlee', avatar: 'https://i.pravatar.cc/40?u=jasonlee', verified: false },
  { handle: '@sarahkim', avatar: 'https://i.pravatar.cc/40?u=sarahkim', verified: false },
  { handle: '@contentpro', avatar: 'https://i.pravatar.cc/40?u=contentpro', verified: false },
  { handle: '@viralvibes', avatar: 'https://i.pravatar.cc/40?u=viralvibes', verified: false },
  { handle: '@trendtracker', avatar: 'https://i.pravatar.cc/40?u=trendtracker', verified: false },
  { handle: '@clipmaster', avatar: 'https://i.pravatar.cc/40?u=clipmaster', verified: false },
];

const MOCK_TITLES = [
  'How I went viral with this one trick...',
  'The secret nobody talks about',
  'Day in my life working from home',
  'Trying this viral recipe for the first time',
  'POV: you discover this hack',
  'Watch this before it gets taken down',
  'Replying to @someone about this...',
  'Stop scrolling — you need to see this',
  'I tested 5 different methods and here\'s what...',
  'The results are actually insane',
  'Why everyone is switching to this',
  'Things I wish I knew sooner',
];

const MOCK_SNIPPETS = [
  "Hey everybody, today I'm going to show you something that completely changed the way I think about this...",
  "So I've been testing this for about two weeks now and the results are honestly pretty surprising...",
  "The number one mistake I see people make is they try to do everything at once instead of focusing on...",
  "Let me walk you through exactly how I set this up step by step so you can do it yourself...",
  "A lot of people have been asking me about this so I finally decided to make a full breakdown...",
  "I wasn't planning on sharing this but after seeing the response it got I think everyone needs to know...",
  "This is probably the most underrated strategy I've come across and nobody is talking about it...",
  "I tested this against five different methods and the difference was honestly night and day...",
];

function randomDuration(): string {
  const mins = Math.random() < 0.5 ? 0 : 1;
  const secs = Math.floor(Math.random() * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TERMINAL: BulkVideoStatus[] = ['completed', 'failed', 'unavailable'];

function isTerminal(s: BulkVideoStatus): boolean {
  return TERMINAL.includes(s);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BulkProcessingContext = createContext<BulkContextValue>({
  bulkBatches: [],
  addBulkBatch: () => {},
  activeBatchId: null,
  setActiveBatchId: () => {},
  retryVideo: () => {},
  removeVideo: () => {},
  removeBatch: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BulkProcessingProvider({ children }: { children: React.ReactNode }) {
  // Hydrate from sessionStorage on mount
  const [bulkBatches, setBulkBatches] = useState<BulkBatch[]>(() => {
    try {
      const version = sessionStorage.getItem('bulkBatchesVersion');
      if (version !== String(BULK_DATA_VERSION)) {
        sessionStorage.removeItem('bulkBatches');
        return [];
      }
      const saved = sessionStorage.getItem('bulkBatches');
      if (saved) return JSON.parse(saved) as BulkBatch[];
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const [activeBatchId, setActiveBatchId] = useState<number | null>(null);

  // Ref mirror to avoid stale closures in the interval
  const batchesRef = useRef<BulkBatch[]>(bulkBatches);

  // Throttle: track last time we called setBulkBatches
  const lastFlushRef = useRef<number>(0);

  // Persist to sessionStorage whenever bulkBatches changes
  useEffect(() => {
    try {
      sessionStorage.setItem('bulkBatches', JSON.stringify(bulkBatches));
      sessionStorage.setItem('bulkBatchesVersion', String(BULK_DATA_VERSION));
    } catch {
      // quota exceeded or private browsing — ignore
    }
  }, [bulkBatches]);

  // ── Simulation Engine ──────────────────────────────────────────────────────
  useEffect(() => {
    const intervalId = setInterval(() => {
      const current = batchesRef.current;
      const processingBatches = current.filter(b => b.status === 'processing');
      if (processingBatches.length === 0) return;

      let changed = false;

      const newBatches = current.map(batch => {
        if (batch.status !== 'processing') return batch;

        // Count active (in-flight) videos
        const activeCount = batch.videos.filter(
          v => v.status === 'downloading' || v.status === 'transcribing'
        ).length;

        let videos = [...batch.videos];

        // Promote pending → downloading if fewer than 3 concurrent
        let promotions = 0;
        for (let i = 0; i < videos.length && activeCount + promotions < 3; i++) {
          if (videos[i].status === 'pending') {
            videos = videos.map((v, idx) =>
              idx === i ? { ...v, status: 'downloading' as BulkVideoStatus } : v
            );
            promotions++;
            changed = true;
          }
        }

        // Tick each active video
        videos = videos.map(v => {
          if (v.status === 'downloading') {
            const inc = randomBetween(15, 30);
            const newProgress = v.progress + inc;
            if (newProgress >= 100) {
              changed = true;
              return { ...v, status: 'transcribing' as BulkVideoStatus, progress: 0 };
            }
            changed = true;
            return { ...v, progress: newProgress };
          }

          if (v.status === 'transcribing') {
            const inc = randomBetween(20, 40);
            const newProgress = v.progress + inc;
            if (newProgress >= 100) {
              changed = true;
              const roll = Math.random();
              if (roll < 0.85) {
                const c = MOCK_CREATORS[Math.floor(Math.random() * MOCK_CREATORS.length)];
                return {
                  ...v,
                  status: 'completed' as BulkVideoStatus,
                  progress: 0,
                  title: MOCK_TITLES[Math.floor(Math.random() * MOCK_TITLES.length)],
                  creator: c.handle,
                  avatar: c.avatar,
                  verified: c.verified,
                  snippet: MOCK_SNIPPETS[Math.floor(Math.random() * MOCK_SNIPPETS.length)],
                  thumbnail: `https://picsum.photos/seed/${v.id}/400/600`,
                  duration: randomDuration(),
                  completedAt: Date.now(),
                };
              } else if (roll < 0.93) {
                return { ...v, status: 'unavailable' as BulkVideoStatus, progress: 100 };
              } else {
                return {
                  ...v,
                  status: 'failed' as BulkVideoStatus,
                  progress: 100,
                  error: 'Video could not be processed',
                };
              }
            }
            changed = true;
            return { ...v, progress: newProgress };
          }

          return v;
        });

        // Determine if batch is now fully terminal
        const allDone = videos.every(v => isTerminal(v.status));
        let batchStatus = batch.status;
        if (allDone) {
          const completedCount = videos.filter(v => v.status === 'completed').length;
          const failedCount = videos.filter(
            v => v.status === 'failed' || v.status === 'unavailable'
          ).length;
          if (completedCount === videos.length) {
            batchStatus = 'completed';
          } else if (failedCount === videos.length) {
            batchStatus = 'failed';
          } else {
            batchStatus = 'partial';
          }
          changed = true;
        }

        return { ...batch, videos, status: batchStatus };
      });

      // Always update the ref
      batchesRef.current = newBatches;

      // Throttled state flush: max 4 renders/second (250ms between flushes)
      if (changed) {
        const now = Date.now();
        if (now - lastFlushRef.current >= 250) {
          lastFlushRef.current = now;
          setBulkBatches(newBatches);
        }
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []); // runs once — all state access is via refs

  // ── addBulkBatch ───────────────────────────────────────────────────────────
  const addBulkBatch = (batch: BulkBatch) => {
    const newBatches = [...batchesRef.current, batch];
    batchesRef.current = newBatches;
    setBulkBatches(newBatches);
    try {
      sessionStorage.setItem('bulkBatches', JSON.stringify(newBatches));
    } catch {
      // ignore
    }
  };

  // ── retryVideo ─────────────────────────────────────────────────────────────
  const retryVideo = (batchId: number, videoId: number) => {
    setBulkBatches(prev => {
      const newBatches = prev.map(batch => {
        if (batch.id !== batchId) return batch;
        const videos = batch.videos.map(v =>
          v.id === videoId ? { ...v, status: 'pending' as BulkVideoStatus, progress: 0, error: undefined } : v
        );
        const batchStatus: BulkBatch['status'] =
          batch.status === 'completed' || batch.status === 'partial' || batch.status === 'failed'
            ? 'processing'
            : batch.status;
        return { ...batch, videos, status: batchStatus };
      });
      batchesRef.current = newBatches;
      return newBatches;
    });
  };

  // ── removeVideo ────────────────────────────────────────────────────────────
  const removeVideo = (batchId: number, videoId: number) => {
    setBulkBatches(prev => {
      const newBatches = prev
        .map(batch => {
          if (batch.id !== batchId) return batch;
          const videos = batch.videos.filter(v => v.id !== videoId);
          return { ...batch, videos };
        })
        .filter(batch => batch.videos.length > 0); // remove empty batches
      batchesRef.current = newBatches;
      return newBatches;
    });
  };

  // ── removeBatch ─────────────────────────────────────────────────────────────
  const removeBatch = (batchId: number) => {
    setBulkBatches(prev => {
      const newBatches = prev.filter(b => b.id !== batchId);
      batchesRef.current = newBatches;
      return newBatches;
    });
  };

  return (
    <BulkProcessingContext.Provider
      value={{
        bulkBatches,
        addBulkBatch,
        activeBatchId,
        setActiveBatchId,
        retryVideo,
        removeVideo,
        removeBatch,
      }}
    >
      {children}
    </BulkProcessingContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBulkProcessing() {
  return useContext(BulkProcessingContext);
}
