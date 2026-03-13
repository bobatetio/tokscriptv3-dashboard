import { HistoryEntry } from '../DiscoverPage';

export interface VideoDownloadItem {
  id: number;
  url: string;
  status: 'pending' | 'downloading' | 'complete' | 'error';
  progress: number; // 0-100
  entry?: HistoryEntry; // populated once "downloaded"
}

export interface VideoSession {
  id: string;          // timestamp-based
  name: string;        // auto: "Download Mar 12, 2026 2:14 PM"
  createdAt: string;   // ISO date
  sourceLinks: string[];
  videos: HistoryEntry[];
  status: 'downloading' | 'complete' | 'partial';
}
