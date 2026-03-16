import { HistoryEntry } from '../DiscoverPage';
import { VideoSession } from './types';
import { VIDEOS_DATA } from './videoData';

export const MOCK_SESSIONS: VideoSession[] = [
  {
    id: 'session-1741428720000',
    name: 'Download Mar 8, 2026 10:32 AM',
    createdAt: '2026-03-08T10:32:00.000Z',
    sourceLinks: [
      'https://youtube.com/watch?v=mock1001',
      'https://tiktok.com/@tokcast/video/mock1002',
      'https://instagram.com/reel/mock1003',
      'https://youtube.com/watch?v=mock1004',
    ],
    videos: VIDEOS_DATA.filter(v => [1001, 1002, 1003, 1004].includes(v.id)),
    status: 'complete',
  },
  {
    id: 'session-1740994500000',
    name: 'Download Mar 3, 2026 3:15 PM',
    createdAt: '2026-03-03T15:15:00.000Z',
    sourceLinks: [
      'https://tiktok.com/@fitnesswithsarah/video/mock1006',
      'https://youtube.com/watch?v=mock1007',
      'https://instagram.com/reel/mock1008',
    ],
    videos: VIDEOS_DATA.filter(v => [1006, 1007, 1008].includes(v.id)),
    status: 'complete',
  },
  {
    id: 'session-1740652500000',
    name: 'Download Feb 27, 2026 11:45 AM',
    createdAt: '2026-02-27T11:45:00.000Z',
    sourceLinks: [
      'https://youtube.com/watch?v=mock1010',
      'https://tiktok.com/@booknerd/video/mock1011',
      'https://youtube.com/watch?v=mock1013',
      'https://instagram.com/reel/mock1014',
      'https://youtube.com/watch?v=mock1015',
      'https://tiktok.com/@worldwanderer/video/mock1016',
    ],
    videos: VIDEOS_DATA.filter(v => [1010, 1011, 1013, 1014, 1015, 1016].includes(v.id)),
    status: 'complete',
  },
];

export function createSession(links: string[], videos: HistoryEntry[]): VideoSession {
  const now = new Date();
  const fmt = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return {
    id: `session-${Date.now()}`,
    name: `Download ${fmt}`,
    createdAt: now.toISOString(),
    sourceLinks: links,
    videos,
    status: 'complete',
  };
}
