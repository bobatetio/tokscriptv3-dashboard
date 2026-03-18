// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface VideoItem {
  id: number;
  title: string;
  duration: string;
  date: string;
  thumbnail?: string;
  source?: string;
  views?: string;
  platform?: string;
  avatar?: string;
  status?: 'complete' | 'failed' | 'processing';
  url?: string;
}

export interface GroupItem {
  id: number;
  name: string;
  count: number;
  videos: VideoItem[];
}

// ─── Static Bulk Batches ───────────────────────────────────────────────────────

export const STATIC_BULK: GroupItem[] = [
  {
    id: 301, name: 'Conference 2026 Batch', count: 6,
    videos: [
      { id: 401, title: 'Opening keynote',         duration: '1:56', date: 'Feb 10, 2026, 10:15 AM', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', source: '@keynoteking',  views: '1.7M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=keynoteking' },
      { id: 402, title: 'Panel: Future of AI',     duration: '1:31', date: 'Feb 10, 2026, 2:30 PM', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', source: '@aifuturist',   views: '4.2M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=aifuturist' },
      { id: 403, title: 'Workshop – UX trends',    duration: '0:46', date: 'Feb 11, 2026, 4:45 PM', thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80', source: '@uxtrends',     views: '891K', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=uxtrends' },
      { id: 404, title: 'Startup pitch session',   duration: '1:14', date: 'Feb 11, 2026, 9:00 AM', thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80', source: '@startuplife',  views: '2.3M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=startuplife' },
      { id: 405, title: 'Closing remarks',         duration: '0:33', date: 'Feb 11, 2026, 1:15 PM', thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80', source: '@closingnotes', views: '556K', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=closingnotes' },
      { id: 406, title: 'Networking highlight reel', duration: '1:49', date: 'Feb 12, 2026, 3:00 PM', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80', source: '@networkpro',   views: '1.1M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=networkpro' },
    ],
  },
  {
    id: 302, name: 'Onboarding Videos', count: 3,
    videos: [
      { id: 407, title: 'Welcome & orientation', duration: '0:57', date: 'Jan 20, 2026, 7:30 PM', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', source: '@hrteam',    views: '445K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=hrteam' },
      { id: 408, title: 'Platform walkthrough',  duration: '1:22', date: 'Jan 20, 2026, 11:00 AM', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', source: '@devops101', views: '338K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=devops101' },
      { id: 409, title: 'Team intro session',    duration: '0:41', date: 'Jan 21, 2026, 5:15 PM', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', source: '@ceofounder', views: '201K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=ceofounder' },
    ],
  },
];

// ─── Sidebar Format (lighter, no videos array) ────────────────────────────────

export const STATIC_BULK_SIDEBAR: { id: number; name: string; count: number }[] = [
  { id: 301, name: 'Conference 2026 Batch', count: 6 },
  { id: 302, name: 'Onboarding Videos',     count: 3 },
];

// ─── Snippets for Bulk Items (ids 401–409) ────────────────────────────────────

export const BULK_SNIPPETS: Record<number, string> = {
  401: "An electrifying opening keynote setting the tone for the entire two-day conference. Standing ovation at the end.",
  402: "Five experts debating the trajectory of AI over the next decade. The disagreements were as informative as the agreements.",
  403: "Hands-on workshop covering the five UX trends that will define product design in 2027 and beyond.",
  404: "Eight startups, ninety seconds each, competing for the audience choice award. The energy was unreal.",
  405: "The closing remarks summarised every keynote, workshop, and panel into five actionable takeaways for attendees.",
  406: "A curated highlight reel of all the hallway conversations, demos, and spontaneous connections made over two days.",
  407: "Welcome to the team! This orientation video covers culture, values, tooling, and who to ask when you're stuck.",
  408: "A complete walkthrough of every feature in the platform. Bookmark this — you'll come back to it again and again.",
  409: "The founding team introduces themselves, shares the company origin story, and explains why they're excited for what's next.",
};
