import React, { useState, useContext, useRef, useEffect } from 'react';
import imgBannerBg from "../../assets/b3a148853965f0eea6c20b8748026b122bc3fc9c.png";
import imgBannerBgLight from "../../assets/ad9c0482dcac9cb102e3083cdd68a90c0bd9c4dc.png";
import imgBannerRocket from "../../assets/9bf39e8d7f131ea242d7146ac4fd23d28eccaa3e.png";
import svgNewCta from "../../imports/svg-dryrzs8s7b";
import { useNavigate, useLocation } from 'react-router';

import {
  Search, ChevronDown, ChevronRight,
  Film, X, Plus, ArrowLeft,
  Clock, Calendar,
  Heart, ArrowUpDown, ListFilter,
  Globe,
  Download, Sparkles,
  FileText, TrendingUp, Zap, List, Layers, LayoutGrid, Columns2, Play, CheckCheck, SlidersHorizontal,
  Users, Folder, FolderPlus, MoreHorizontal,
  Copy, Link2, ExternalLink, FolderInput, Pencil, RefreshCw, Trash2, Eye, BookOpen,
  Video, User,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  TranscriptDetailPanel,
  TranscriptDetailVideo,
  RelatedVideo,
  DownloadFormat,
} from './TranscriptDetailPanel';

import OutlineSearchMagnifer from '../../imports/OutlineSearchMagnifer';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { UserContext, FREE_LIMITS } from '../context/UserContext';
import { PROMPTS } from './PromptBasePage';
import { formatDuration, parseDuration as _parseDuration } from '../utils/formatDuration';
import { useNewTranscript } from '../context/NewTranscriptContext';
import { SaveToFolderModal } from './SaveToFolderModal';
import { SelectionBar } from './SelectionBar';
import { simulateVideoDownload, simulateCoverDownload, simulateZipDownload } from './videos/downloadUtils';

// ─── Verified Creators ────────────────────────────────────────────────────────
const VERIFIED_CREATORS = new Set([
  '@tokcast', '@founders', '@engineering', '@productteam',
  '@fitwithjess', '@techbrosam', '@kitchenlabs', '@gamervault',
  '@keynoteking', '@aifuturist', '@productivityhacks', '@chefmike',
]);

// ─── Mock Data ────────────────────────────────────────────────────────────────
interface Transcript {
  id: number;
  title: string;
  duration: string;
  date: string;
  words: number;
  thumbnail: string;
  source: string;
  views: string;
  platform?: string;
  avatar?: string;
  status?: 'complete' | 'failed' | 'processing';
  url?: string;
}

interface VideoItem {
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

interface GroupItem {
  id: number;
  name: string;
  count: number;
  videos: VideoItem[];
}



const SINGLES: Transcript[] = [
  { id: 1,  title: 'Product launch keynote',        duration: '0:58',  date: 'Feb 24', words: 2341,  thumbnail: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=400&q=80',  source: '@productteam', views: '2.4M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=productteam' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0001' },
  { id: 2,  title: 'User interview – Sarah K.',      duration: '1:44',  date: 'Feb 23', words: 5820,  thumbnail: 'https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?w=400&q=80',  source: '@research',    views: '892K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=research' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000002' },
  { id: 3,  title: 'Weekly standup recap',           duration: '0:32',  date: 'Feb 22', words: 1102,  thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  source: '@teamlead',    views: '441K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=teamlead' , status: 'complete', url: 'https://www.instagram.com/reel/mock0003/' },
  { id: 4,  title: 'Investor Q&A session',           duration: '1:51',  date: 'Feb 21', words: 8430,  thumbnail: 'https://images.unsplash.com/photo-1712971404080-87271ce2e473?w=400&q=80',  source: '@founders',    views: '3.1M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=founders' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0004' },
  { id: 5,  title: 'Design review walkthrough',      duration: '1:07',  date: 'Feb 20', words: 3210,  thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',    source: '@designops',   views: '567K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=designops' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000005' },
  { id: 6,  title: 'Sales call – Acme Corp',         duration: '0:47',  date: 'Feb 19', words: 4670,  thumbnail: 'https://images.unsplash.com/photo-1605568985653-3d8e43f4efa6?w=400&q=80',  source: '@sales',       views: '1.2M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=sales' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0006' },
  { id: 7,  title: 'Podcast Episode 12',             duration: '1:33',  date: 'Feb 18', words: 6890,  thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  source: '@tokcast',     views: '2.8M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0007' },
  { id: 8,  title: 'Team Strategy Sprint',           duration: '1:58',  date: 'Feb 17', words: 9150,  thumbnail: 'https://images.unsplash.com/photo-1763739532819-401f6a041b54?w=400&q=80',  source: '@strategy',    views: '445K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=strategy' , status: 'complete', url: 'https://www.instagram.com/reel/mock0008/' },
  { id: 9,  title: 'Growth Webinar – Feb',           duration: '0:39',  date: 'Feb 16', words: 8200,  thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80',  source: '@growth',      views: '1.6M', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=growth' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000009' },
  { id: 10, title: 'Customer Feedback Round 3',      duration: '1:22',  date: 'Feb 15', words: 4920,  thumbnail: 'https://images.unsplash.com/photo-1763318156213-37e41cd0dfec?w=400&q=80',  source: '@cx',          views: '739K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=cx' , status: 'processing', url: 'https://www.youtube.com/watch?v=mock0010' },
  { id: 11, title: 'Backend Architecture Talk',      duration: '0:55',  date: 'Feb 14', words: 7310,  thumbnail: 'https://images.unsplash.com/photo-1590530794437-ad29186f324f?w=400&q=80',  source: '@engineering', views: '3.4M', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=engineering' , status: 'failed', url: 'https://www.instagram.com/reel/mock0011/' },
  { id: 12, title: 'All-Hands February',             duration: '1:48',  date: 'Feb 13', words: 11040, thumbnail: 'https://images.unsplash.com/photo-1718224326658-489bbfbeb2ca?w=400&q=80',  source: '@company',     views: '912K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=company' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0012' },
  { id: 13, title: 'Marketing Q1 Debrief',           duration: '1:05',  date: 'Feb 12', words: 3890,  thumbnail: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?w=400&q=80',  source: '@marketing',   views: '288K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=marketing' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000013' },
  { id: 14, title: 'Roadmap Planning 2026',          duration: '1:37',  date: 'Feb 11', words: 5600,  thumbnail: 'https://images.unsplash.com/photo-1676276374782-39159bc5e7b4?w=400&q=80',  source: '@product',     views: '1.1M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=product' , status: 'failed', url: 'https://www.youtube.com/watch?v=mock0014' },
  { id: 15, title: 'Support Team Sync',              duration: '0:44',  date: 'Feb 10', words: 2480,  thumbnail: 'https://images.unsplash.com/photo-1553775282-20af80779df7?w=400&q=80',    source: '@support',     views: '504K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=support' , status: 'processing', url: 'https://www.instagram.com/reel/mock0015/' },
  { id: 16, title: 'Finance Review Q4',              duration: '1:19',  date: 'Feb 9',  words: 6120,  thumbnail: 'https://images.unsplash.com/photo-1753955900083-b62ee8d97805?w=400&q=80',  source: '@finance',     views: '678K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=finance' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0016' },
  { id: 17, title: 'Hiring Panel – Engineering',     duration: '1:52',  date: 'Feb 8',  words: 8340,  thumbnail: 'https://images.unsplash.com/photo-1758520144437-f068ecaf0d83?w=400&q=80',  source: '@people',      views: '2.2M', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=people' , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000017' },
  { id: 18, title: 'Brand Voice Workshop',           duration: '0:28',  date: 'Feb 7',  words: 3060,  thumbnail: 'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?w=400&q=80',  source: '@brand',       views: '991K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=brand' , status: 'processing', url: 'https://www.instagram.com/reel/mock0018/' },
  { id: 19, title: 'Demo Day Spring 2026',           duration: '1:44',  date: 'Feb 6',  words: 10200, thumbnail: 'https://images.unsplash.com/photo-1757876598533-749f56cd1c66?w=400&q=80',  source: '@demos',       views: '1.8M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=demos' , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0019' },
  { id: 20, title: 'Usability Test – Onboarding',   duration: '1:11',  date: 'Feb 5',  words: 4730,  thumbnail: 'https://images.unsplash.com/photo-1552257079-e48b715185fa?w=400&q=80',    source: '@ux',          views: '356K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=ux' , status: 'processing', url: 'https://www.tiktok.com/@creator/video/10000000020' },
];

const SNIPPETS: Record<number, string> = {
  1:  "Welcome everyone to our biggest launch of the year. Today we're unveiling the product that changes everything.",
  2:  "Sarah, can you walk us through your first impression of the onboarding flow? — Sure, so when I first signed up...",
  3:  "Quick recap from today's standup: design is unblocked, engineering hit the milestone, and QA starts tomorrow.",
  4:  "Great question on unit economics. The LTV-to-CAC ratio we're targeting for Q2 is roughly 4.5x, and here's why...",
  5:  "So on this screen we have the revised component library. Notice how the spacing tokens align with the new grid...",
  6:  "The Acme team asked about enterprise SSO and bulk seat pricing. We walked them through the admin dashboard live.",
  7:  "This week on Tokcast we're diving deep into async-first culture, distributed teams, and the tools that actually work.",
  8:  "Our north star for the sprint: reduce time-to-value for new users from 14 days down to 3. Here's the playbook.",
  9:  "Conversion rate optimisation, SEO fundamentals, and the paid acquisition channels that drove 40% growth this quarter.",
  10: "Three themes kept surfacing: faster exports, better search, and a mobile app. We're prioritising in that order.",
  11: "The new service mesh cuts p99 latency by 38%. Here's the architecture decision record and the trade-offs we made.",
  12: "Good morning everyone. Before we dive in, I want to acknowledge the incredible quarter the whole company just shipped.",
  13: "CAC came in 12% above forecast due to rising CPMs. We're pivoting budget to organic and partnership channels in Q2.",
  14: "Themes for 2026: AI-assisted workflows, deeper integrations, and finally shipping the mobile app we promised last year.",
  15: "Tickets are down 18% week-over-week. The self-serve help centre redesign is clearly making a difference for customers.",
  16: "EBITDA margin held at 22% despite headcount additions. The unit economics story is getting stronger every quarter.",
  17: "We're looking for engineers who thrive in ambiguity, ship fast, and treat code review as a learning opportunity.",
  18: "Brand voice is specific, not generic. Confident, not arrogant. Here are the ten words we now ban from all copy.",
  19: "Fifteen teams, ninety seconds each. The energy in the room was electric and three projects are already in pipeline.",
  20: "Participants struggled with step four consistently. We're cutting it entirely and merging the flow into two steps.",
  // Collections
  201: "This January demo was the first time we showed the redesigned product flow to a live audience. The reception was incredible.",
  202: "A two-hour deep dive into our core feature set. We went screen by screen and addressed every edge case raised by the team.",
  203: "Walking stakeholders through the new roadmap and explaining the rationale behind each prioritisation decision we made.",
  204: "Side-by-side comparison of our product against the top three competitors. Spoiler: we win on speed and simplicity.",
  205: "Alex's feedback on the onboarding flow was invaluable. He surfaced three pain points we hadn't seen in any prior testing.",
  206: "Priya uses the product for an entirely different workflow than we assumed. This interview completely shifted our roadmap.",
  207: "A twelve-person focus group that surfaced the core frustration: users want fewer steps, not more customisation options.",
  208: "The brand story told in 90 seconds. Authentic, fast-paced, and built around real user moments from our community.",
  209: "The agency reviewed three ad scripts and gave line-by-line feedback. Script B was the clear winner with the panel.",
  210: "Briefing fifteen influencers on the campaign goals, messaging dos and don'ts, and the creative direction for Q2.",
  211: "A quick recap of the launch event: what went well, what broke, and what we're doing differently for the next one.",
  212: "Three weeks post-launch debrief. Metrics are above target. The biggest surprise was retention in the enterprise segment.",
  // Bulk
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

const COLLECTIONS: GroupItem[] = [
  {
    id: 101, name: 'Q1 Product Reviews', count: 4,
    videos: [
      { id: 201, title: 'Jan product demo',        duration: '1:03', date: 'Jan 15, 2026', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80', source: '@jasonlee',   views: '1.2M', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=jasonlee' },
      { id: 202, title: 'Feb deep-dive session',   duration: '0:51', date: 'Feb 3, 2026',  thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80', source: '@sarahkim',   views: '678K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=sarahkim' },
      { id: 203, title: 'Stakeholder walkthrough', duration: '1:28', date: 'Feb 10, 2026', thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80', source: '@mikepatel',  views: '341K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=mikepatel' },
      { id: 204, title: 'Feature comparison talk', duration: '0:37', date: 'Feb 18, 2026', thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80', source: '@emilychan',  views: '892K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=emilychan' },
    ],
  },
  {
    id: 102, name: 'User Research Series', count: 3,
    videos: [
      { id: 205, title: 'Interview – Alex M.',  duration: '1:45', date: 'Feb 5, 2026',  thumbnail: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=400&q=80', source: '@alexmorgan',   views: '2.1M', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=alexmorgan' },
      { id: 206, title: 'Interview – Priya S.', duration: '1:17', date: 'Feb 7, 2026',  thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', source: '@priyasharma', views: '445K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=priyasharma' },
      { id: 207, title: 'Focus group session',  duration: '0:43', date: 'Feb 12, 2026', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', source: '@davidsoto',   views: '987K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=davidsoto' },
    ],
  },
  {
    id: 103, name: 'Marketing Campaigns', count: 5,
    videos: [
      { id: 208, title: 'Brand storytelling video', duration: '0:29', date: 'Jan 28, 2026', thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80', source: '@ninawoods',  views: '3.2M', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=ninawoods' },
      { id: 209, title: 'Ad script review',         duration: '1:06', date: 'Feb 1, 2026',  thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', source: '@tombrady',   views: '512K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=tombrady' },
      { id: 210, title: 'Influencer briefing',      duration: '1:38', date: 'Feb 8, 2026',  thumbnail: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80', source: '@lucyzhang',  views: '1.9M', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=lucyzhang' },
      { id: 211, title: 'Launch event recap',       duration: '0:52', date: 'Feb 14, 2026', thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80', source: '@carlosrey',  views: '732K', platform: 'YouTube',   avatar: 'https://i.pravatar.cc/80?u=carlosrey' },
      { id: 212, title: 'Post-launch debrief',      duration: '1:23', date: 'Feb 20, 2026', thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80', source: '@amandafox',  views: '289K', platform: 'TikTok',    avatar: 'https://i.pravatar.cc/80?u=amandafox' },
    ],
  },
];

const BULK: GroupItem[] = [
  {
    id: 301, name: 'Conference 2026 Batch', count: 6,
    videos: [
      { id: 401, title: 'Opening keynote',         duration: '1:56', date: 'Feb 10, 2026', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', source: '@keynoteking',  views: '1.7M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=keynoteking' },
      { id: 402, title: 'Panel: Future of AI',     duration: '1:31', date: 'Feb 10, 2026', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', source: '@aifuturist',   views: '4.2M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=aifuturist' },
      { id: 403, title: 'Workshop – UX trends',    duration: '0:46', date: 'Feb 11, 2026', thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80', source: '@uxtrends',     views: '891K', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=uxtrends' },
      { id: 404, title: 'Startup pitch session',   duration: '1:14', date: 'Feb 11, 2026', thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80', source: '@startuplife',  views: '2.3M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=startuplife' },
      { id: 405, title: 'Closing remarks',         duration: '0:33', date: 'Feb 11, 2026', thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80', source: '@closingnotes', views: '556K', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=closingnotes' },
      { id: 406, title: 'Networking highlight reel', duration: '1:49', date: 'Feb 12, 2026', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80', source: '@networkpro',   views: '1.1M', platform: 'YouTube', avatar: 'https://i.pravatar.cc/80?u=networkpro' },
    ],
  },
  {
    id: 302, name: 'Onboarding Videos', count: 3,
    videos: [
      { id: 407, title: 'Welcome & orientation', duration: '0:57', date: 'Jan 20, 2026', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', source: '@hrteam',    views: '445K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=hrteam' },
      { id: 408, title: 'Platform walkthrough',  duration: '1:22', date: 'Jan 20, 2026', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', source: '@devops101', views: '338K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=devops101' },
      { id: 409, title: 'Team intro session',    duration: '0:41', date: 'Jan 21, 2026', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', source: '@ceofounder', views: '201K', platform: 'Instagram', avatar: 'https://i.pravatar.cc/80?u=ceofounder' },
    ],
  },
];

const FAVOURITES_FOLDER_ID = 500;

const FOLDERS: GroupItem[] = [
  { id: FAVOURITES_FOLDER_ID, name: 'Favourites', count: 0, videos: [] },
  {
    id: 501, name: 'Client Projects', count: 4,
    videos: [
      { id: 601, title: 'Acme Corp kickoff call',      duration: '1:08',  date: 'Feb 22, 2026' },
      { id: 602, title: 'Globex review session',       duration: '0:55',  date: 'Feb 18, 2026' },
      { id: 603, title: 'Initech product feedback',    duration: '1:34',  date: 'Feb 14, 2026' },
      { id: 604, title: 'Umbrella Corp debrief',       duration: '0:48',  date: 'Feb 10, 2026' },
    ],
  },
  {
    id: 502, name: 'Internal Training', count: 3,
    videos: [
      { id: 605, title: 'New hire orientation Q1',     duration: '1:47',  date: 'Jan 15, 2026' },
      { id: 606, title: 'Security compliance 2026',    duration: '1:16',  date: 'Jan 22, 2026' },
      { id: 607, title: 'Sales methodology deep-dive', duration: '1:59',    date: 'Feb 2, 2026' },
    ],
  },
  {
    id: 503, name: 'Archived Interviews', count: 5,
    videos: [
      { id: 608, title: 'Interview – Dana R.',         duration: '1:43',  date: 'Dec 10, 2025' },
      { id: 609, title: 'Interview – Marcus T.',       duration: '0:36',  date: 'Dec 14, 2025' },
      { id: 610, title: 'Interview – Yuki N.',         duration: '1:25',  date: 'Dec 18, 2025' },
      { id: 611, title: 'Interview – Omar B.',         duration: '0:53',  date: 'Jan 6, 2026' },
      { id: 612, title: 'Interview – Leila S.',        duration: '1:18',  date: 'Jan 9, 2026' },
    ],
  },
  {
    id: 504, name: 'Event Recordings', count: 2,
    videos: [
      { id: 613, title: 'Summit panel – AI futures',   duration: '1:54',    date: 'Feb 5, 2026' },
      { id: 614, title: 'Workshop – data storytelling', duration: '1:39',  date: 'Feb 6, 2026' },
    ],
  },
];

// Extra videos belonging to saved profiles (beyond SINGLES)
const PROFILE_EXTRAS: Transcript[] = [
  // @productteam
  { id: 701, title: 'Sprint retrospective Q1',  duration: '0:42', date: 'Feb 16', words: 2890, thumbnail: 'https://images.unsplash.com/photo-1560804624-8798f895c85f?w=400&q=80',  source: '@productteam', views: '872K', avatar: 'https://i.pravatar.cc/80?u=productteam' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX701' },
  { id: 702, title: 'Design system rollout',    duration: '1:02', date: 'Feb 10', words: 3540, thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80',  source: '@productteam', views: '1.4M', avatar: 'https://i.pravatar.cc/80?u=productteam' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX702' },
  // @founders
  { id: 703, title: 'Series A announcement',    duration: '0:36', date: 'Feb 19', words: 1980, thumbnail: 'https://images.unsplash.com/photo-1605568985653-3d8e43f4efa6?w=400&q=80',  source: '@founders',    views: '4.8M', avatar: 'https://i.pravatar.cc/80?u=founders' , status: 'failed', url: 'https://www.youtube.com/watch?v=mockX703' },
  { id: 704, title: 'Team culture deep-dive',   duration: '1:18', date: 'Feb 14', words: 6220, thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',  source: '@founders',    views: '2.1M', avatar: 'https://i.pravatar.cc/80?u=founders' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX704' },
  { id: 705, title: 'Vision for 2026',          duration: '0:54', date: 'Feb 9',  words: 4410, thumbnail: 'https://images.unsplash.com/photo-1763739532819-401f6a041b54?w=400&q=80',  source: '@founders',    views: '3.7M', avatar: 'https://i.pravatar.cc/80?u=founders' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX705' },
  // @tokcast
  { id: 706, title: 'Podcast Episode 13',       duration: '1:22', date: 'Feb 15', words: 7120, thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  source: '@tokcast',     views: '1.9M', avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'processing', url: 'https://www.youtube.com/watch?v=mockX706' },
  { id: 707, title: 'Tokcast Live AMA – Feb',   duration: '0:48', date: 'Feb 11', words: 5340, thumbnail: 'https://images.unsplash.com/photo-1718224326658-489bbfbeb2ca?w=400&q=80',  source: '@tokcast',     views: '1.1M', avatar: 'https://i.pravatar.cc/80?u=tokcast' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX707' },
  // @research
  { id: 708, title: 'Synthetic data study',     duration: '1:09', date: 'Feb 18', words: 4820, thumbnail: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=400&q=80',  source: '@research',    views: '643K', avatar: 'https://i.pravatar.cc/80?u=research' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX708' },
  { id: 709, title: 'Usability findings Q1',    duration: '0:55', date: 'Feb 13', words: 3670, thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',  source: '@research',    views: '478K', avatar: 'https://i.pravatar.cc/80?u=research' , status: 'failed', url: 'https://www.youtube.com/watch?v=mockX709' },
  // @marketing
  { id: 710, title: 'Campaign results – Jan',   duration: '0:31', date: 'Feb 20', words: 1890, thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80',  source: '@marketing',   views: '612K', avatar: 'https://i.pravatar.cc/80?u=marketing' , status: 'processing', url: 'https://www.youtube.com/watch?v=mockX710' },
  { id: 711, title: 'Content strategy 2026',    duration: '1:16', date: 'Feb 15', words: 5030, thumbnail: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80',  source: '@marketing',   views: '1.7M', avatar: 'https://i.pravatar.cc/80?u=marketing' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX711' },
  // @engineering
  { id: 712, title: 'Infra migration update',   duration: '1:04', date: 'Feb 13', words: 6740, thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',  source: '@engineering', views: '1.8M', avatar: 'https://i.pravatar.cc/80?u=engineering' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX712' },
  { id: 713, title: 'Code review guidelines',   duration: '0:38', date: 'Feb 8',  words: 3160, thumbnail: 'https://images.unsplash.com/photo-1590530794437-ad29186f324f?w=400&q=80',  source: '@engineering', views: '921K', avatar: 'https://i.pravatar.cc/80?u=engineering' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX713' },
  // @growth
  { id: 714, title: 'Q1 growth metrics',        duration: '0:57', date: 'Feb 17', words: 7840, thumbnail: 'https://images.unsplash.com/photo-1769596722738-99460fa78dd6?w=400&q=80',  source: '@growth',      views: '2.3M', avatar: 'https://i.pravatar.cc/80?u=growth' , status: 'processing', url: 'https://www.youtube.com/watch?v=mockX714' },
  { id: 715, title: 'Acquisition channel mix',  duration: '1:11', date: 'Feb 12', words: 9120, thumbnail: 'https://images.unsplash.com/photo-1676276374782-39159bc5e7b4?w=400&q=80',  source: '@growth',      views: '1.5M', avatar: 'https://i.pravatar.cc/80?u=growth' , status: 'complete', url: 'https://www.youtube.com/watch?v=mockX715' },
];

const S = (id: number) => SINGLES.find(s => s.id === id)!;
const E = (id: number) => PROFILE_EXTRAS.find(s => s.id === id)!;

const PROFILE_GROUPS: GroupItem[] = [
  { id: 1, name: 'Product Team',  count: 3, videos: [S(1),  E(701), E(702)]                as unknown as VideoItem[] },
  { id: 2, name: 'Founders Hub',  count: 4, videos: [S(4),  E(703), E(704), E(705)]         as unknown as VideoItem[] },
  { id: 3, name: 'Tokcast',       count: 3, videos: [S(7),  E(706), E(707)]                 as unknown as VideoItem[] },
  { id: 4, name: 'Research Lab',  count: 3, videos: [S(2),  E(708), E(709)]                 as unknown as VideoItem[] },
  { id: 5, name: 'Marketing',     count: 3, videos: [S(13), E(710), E(711)]                 as unknown as VideoItem[] },
  { id: 6, name: 'Engineering',   count: 3, videos: [S(11), E(712), E(713)]                 as unknown as VideoItem[] },
  { id: 7, name: 'Growth',        count: 3, videos: [S(9),  E(714), E(715)]                 as unknown as VideoItem[] },
];

// Combined lookup for the transcript detail panel
const ALL_VIDEOS: Transcript[] = [...SINGLES, ...PROFILE_EXTRAS];

// ─── Sort / Filter helpers ────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'date-desc',     label: 'Newest first' },
  { value: 'date-asc',      label: 'Oldest first' },
  { value: 'title-asc',     label: 'Title A–Z' },
  { value: 'title-desc',    label: 'Title Z–A' },
  { value: 'duration-desc', label: 'Longest first' },
  { value: 'duration-asc',  label: 'Shortest first' },
  { value: 'words-desc',    label: 'Most words' },
  { value: 'words-asc',     label: 'Fewest words' },
];

const ALL_SOURCES = Array.from(new Set(SINGLES.map(t => t.source))).sort();

const parseDuration = _parseDuration;

// ─── Inline Transcript mock data ──────────────────────────────────────────────
const IV_VIDEO = {
  title: 'Building Scalable APIs with Go',
  creator: '@techguru',
  likes: '85k',
  duration: '0:58',
  language: 'EN',
  date: 'Feb 18, 2026',
  wordCount: 51,
  charCount: 307,
  sentences: 10,
  readability: 'Grade 2',
  thumbnail: 'https://images.unsplash.com/photo-1758599879795-536d5f203de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBmaWxtaW5nJTIwcGhvbmUlMjBjb250ZW50JTIwY3JlYXRvcnxlbnwxfHx8fDE3NzIwMDExODd8MA&ixlib=rb-4.1.0&q=80&w=800',
  avatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYXZhdGFyJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTI5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
};
const IV_TRANSCRIPT = [
  "Welcome back to my kitchen! Today we're diving deep into pasta perfection. I'm going to share some professional secrets that will completely transform your pasta game.",
  "First thing first — let's talk about water. You need a large pot. The ratio is crucial: for every 100 grams of pasta, use at least one liter of water.",
  "Salt is your best friend here. Add about 10 grams of coarse sea salt per liter of water. This might seem like a lot, but trust me — this is how you get that restaurant-quality flavor.",
  "While we're waiting for the water to boil, let's prepare our sauce. Today I'm making a classic aglio e olio — garlic and olive oil. Simple ingredients, incredible results.",
  "Here's a pro tip: slice your garlic, don't crush it. Slicing gives you better control over the cooking process and prevents burning. We want golden, not brown.",
  "Start with cold oil and cold garlic in the pan. This is crucial — if you add garlic to hot oil, it will burn immediately and become bitter. We're building flavors slowly.",
  "Now the water is boiling. Drop your pasta in and give it a good stir. Don't add oil to the water — that's a myth! The oil prevents the sauce from sticking later.",
  "Check the package for cooking time, but here's the secret: we're going to undercook it by two minutes. Two full minutes less than the package says.",
  "While the pasta is cooking, get your garlic going over low heat. Watch it carefully — it should sizzle gently and become fragrant. This takes about 3–4 minutes.",
];
const IV_RELATED: RelatedVideo[] = [
  { title: '5 Morning Habits That Changed My Life', creator: '@productivityhacks', duration: '0:58', views: '2.4M', thumb: 'https://images.unsplash.com/photo-1770368787779-8472da646193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwcm91dGluZSUyMGhhYml0cyUyMHByb2R1Y3Rpdml0eXxlbnwxfHx8fDE3NzIwMDExOTB8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { title: 'The Secret to Perfect Pasta Every Time', creator: '@chefmike', duration: '1:23', views: '892K', thumb: 'https://images.unsplash.com/photo-1633253037289-b1cec78fd209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBjaGVmJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzIwMDExOTN8MA&ixlib=rb-4.1.0&q=80&w=400' },
  { title: '30-Day Fitness Challenge Results', creator: '@fitnesswithsarah', duration: '0:47', views: '1.6M', thumb: 'https://images.unsplash.com/photo-1758875570256-6510adffb1de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2hhbGxlbmdlJTIwd29ya291dCUyMGdyb3VwfGVufDF8fHx8MTc3MjAwMTE5M3ww&ixlib=rb-4.1.0&q=80&w=400' },
];

// ─── Helpers to derive TranscriptDetailVideo from a Transcript row ───────────
function likesFromWords(w: number): string {
  if (w > 8000) return '142K'; if (w > 5000) return '98K';
  if (w > 2000) return '61K';  if (w > 1000) return '34K';
  return '18K';
}
function readabilityFromWords(w: number): string {
  if (w > 8000) return 'Grade 6'; if (w > 4000) return 'Grade 4';
  if (w > 1500) return 'Grade 3';
  return 'Grade 2';
}
function transcriptToDetailVideo(t: Transcript): TranscriptDetailVideo {
  const words = t.words ?? 0;
  return {
    title:       t.title,
    creator:     t.source,
    platform:    'TikTok',
    likes:       likesFromWords(words),
    duration:    t.duration,
    language:    'EN',
    date:        `${t.date}, 2026`,
    wordCount:   words,
    charCount:   Math.round(words * 5.1),
    sentences:   Math.round(words / 13),
    readability: readabilityFromWords(words),
    thumbnail:   t.thumbnail,
    avatar:      IV_VIDEO.avatar,
  };
}

// ─── Types for view state ─────────────────────────────────────────────────────
type Category = 'dashboard' | 'singles' | 'favourites' | 'collections' | 'bulk' | 'folders' | 'profiles';

interface ViewState {
  category: Category;
  groupId?: number;
}

// ─── Download format list ─────────────────────────────────────────────────────
const DOWNLOAD_FORMATS: DownloadFormat[] = [
  { label: 'Plain Text (.txt)',  free: true  },
  { label: 'Subtitles (.srt)',   free: false },
  { label: 'WebVTT (.vtt)',      free: false },
  { label: 'JSON (beta)',        free: false },
];

// ─── Group / Folder Stat Cards ────────────────────────────────────────────────
function parseViews(v: string): number {
  const n = parseFloat(v);
  if (v.includes('M')) return n * 1_000_000;
  if (v.includes('K')) return n * 1_000;
  return n || 0;
}
function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
function fmtRuntime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

function GroupStatCards({ videos, isDark, border, text, muted }: {
  videos: VideoItem[]; isDark: boolean; border: string; text: string; muted: string;
}) {
  const count       = videos.length;
  const totalSecs   = videos.reduce((s, v) => s + parseDuration(v.duration), 0);
  const creators    = new Set(videos.map(v => v.source).filter(Boolean)).size;
  const totalViews  = videos.reduce((s, v) => s + (v.views ? parseViews(v.views) : 0), 0);
  const avgSecs     = count > 0 ? Math.round(totalSecs / count) : 0;

  const stats = [
    { icon: <Film       className="w-3.5 h-3.5" />, label: 'Videos',        value: count,                     sub: 'in this group' },
    { icon: <Clock      className="w-3.5 h-3.5" />, label: 'Total Runtime', value: fmtRuntime(totalSecs),      sub: `avg ${fmtRuntime(avgSecs)} each` },
    { icon: <Users      className="w-3.5 h-3.5" />, label: 'Creators',      value: creators,                  sub: 'unique sources' },
    { icon: <Eye        className="w-3.5 h-3.5" />, label: 'Total Views',   value: fmtViews(totalViews),       sub: 'across all videos' },
  ];

  return (
    <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map(s => (
        <div
          key={s.label}
          className="flex flex-col px-4 pt-3 pb-3 rounded-xl"
          style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
            {s.icon}
            <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{s.label}</span>
          </div>
          <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {s.value}
          </p>
          <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

function FolderStatCards({ items, isDark, border, text, muted }: {
  items: { type: string }[]; isDark: boolean; border: string; text: string; muted: string;
}) {
  const total      = items.length;
  const transcripts = items.filter(i => i.type === 'transcript').length;
  const profiles    = items.filter(i => i.type === 'profile').length;
  const prompts     = items.filter(i => i.type === 'prompt').length;

  const stats = [
    { icon: <Folder   className="w-3.5 h-3.5" />, label: 'Total Saved',  value: total,       sub: 'items in folder' },
    { icon: <FileText className="w-3.5 h-3.5" />, label: 'Transcripts',  value: transcripts, sub: 'saved transcripts' },
    { icon: <Users    className="w-3.5 h-3.5" />, label: 'Profiles',     value: profiles,    sub: 'saved creators' },
    { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Prompts',      value: prompts,     sub: 'saved prompts' },
  ];

  return (
    <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map(s => (
        <div
          key={s.label}
          className="flex flex-col px-4 pt-3 pb-3 rounded-xl"
          style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
            {s.icon}
            <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{s.label}</span>
          </div>
          <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {s.value}
          </p>
          <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Discover Strip ───────────────────────────────────────────────────────────

function PlatformIconSVG({ platform }: { platform: string }) {
  if (platform === 'YouTube') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
  if (platform === 'TikTok') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" />
    </svg>
  );
  if (platform === 'Instagram') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
  return null;
}

function VideoPlatformBadge({ platform }: { platform?: string }) {
  if (!platform) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontWeight: 500,
      }}
    >
      <PlatformIconSVG platform={platform} />
      {platform}
    </span>
  );
}

interface DiscoverEntry {
  id: number; title: string; creator: string; platform: string;
  duration: string; date: string; thumbnail: string; snippet: string;
  avatar: string;
}

const DISCOVER_ENTRIES: DiscoverEntry[] = [
  { id: 1,  platform: 'YouTube',   duration: '0:58', date: 'Feb 24, 2026', title: 'Product launch keynote',    creator: '@productteam',  avatar: 'https://i.pravatar.cc/80?u=productteam',  thumbnail: 'https://images.unsplash.com/photo-1759496434742-771c92e66103?w=400&q=80',  snippet: "Welcome everyone to our biggest launch of the year. Today we're unveiling features that will fundamentally change how you think about productivity..." , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0001' },
  { id: 2,  platform: 'TikTok',    duration: '1:44', date: 'Feb 23, 2026', title: 'User interview – Sarah K.',  creator: '@research',     avatar: 'https://i.pravatar.cc/80?u=research',     thumbnail: 'https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?w=400&q=80',  snippet: "So what I found really interesting in my workflow was the amount of time I was spending just trying to organise all the notes from these sessions..." , status: 'complete', url: 'https://www.tiktok.com/@creator/video/10000000002' },
  { id: 3,  platform: 'Instagram', duration: '0:32', date: 'Feb 22, 2026', title: 'Weekly standup recap',        creator: '@teamlead',     avatar: 'https://i.pravatar.cc/80?u=teamlead',     thumbnail: 'https://images.unsplash.com/photo-1573497619860-6d82917e4ec8?w=400&q=80',  snippet: "Team, quick recap from today: we're blocking Wednesday morning for deep work, shipping is on track, and the design review is Friday at 2pm..." , status: 'complete', url: 'https://www.instagram.com/reel/mock0003/' },
  { id: 4,  platform: 'YouTube',   duration: '1:51', date: 'Feb 21, 2026', title: 'Investor Q&A session',        creator: '@founders',     avatar: 'https://i.pravatar.cc/80?u=founders',     thumbnail: 'https://images.unsplash.com/photo-1712971404080-87271ce2e473?w=400&q=80',  snippet: "The question everyone keeps asking is how we plan to monetise at scale. The short answer is that we're not chasing revenue first — we're chasing retention..." , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0004' },
  { id: 6,  platform: 'YouTube',   duration: '1:33', date: 'Feb 18, 2026', title: 'Podcast Episode 12',          creator: '@tokcast',      avatar: 'https://i.pravatar.cc/80?u=tokcast',      thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  snippet: "My guest today has built three companies from zero to acquisition. The one thing all three had in common? They were all solving a problem the founder personally had..." , status: 'complete', url: 'https://www.youtube.com/watch?v=mock0006' },
];

function DiscoverCard({
  entry, isDark, border, text, muted, hoverBg, onNavigate,
}: {
  entry: DiscoverEntry; isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  onNavigate: () => void;
}) {
  const [copied, setCopied]         = React.useState(false);
  const [favourited, setFavourited] = React.useState(false);
  const [showMenu, setShowMenu]     = React.useState(false);
  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
      style={{ width: 192, border: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
      onClick={onNavigate}
    >
      {/* Portrait thumbnail — 9:16 */}
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white opacity-80" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <VideoPlatformBadge platform={entry.platform} />
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-shrink-0">
            <img src={entry.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
            {VERIFIED_CREATORS.has(entry.creator) && (
              <span className="absolute flex items-center justify-center rounded-full"
                style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                </svg>
              </span>
            )}
          </div>
          <span className="text-[10px]" style={{ color: muted }}>{entry.creator}</span>
        </div>
        <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{entry.title}</p>
        <p
          className="text-[10px]"
          style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
        >
          {entry.snippet}
        </p>

        {/* Footer: date + action buttons */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: muted }}>{entry.date}</span>
          <div className="flex items-center gap-1">

            {/* Favourite */}
            <button
              className="p-1 rounded-md transition-colors"
              style={{
                color: favourited ? '#ef4444' : muted,
                background: favourited ? (isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                border: `1px solid ${favourited ? 'rgba(239,68,68,0.28)' : border}`,
              }}
              onClick={e => { e.stopPropagation(); setFavourited(v => !v); }}
              title={favourited ? 'Remove from favourites' : 'Add to favourites'}
              onMouseEnter={ev => { if (!favourited) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { if (!favourited) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              <Heart className="w-2.5 h-2.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
            </button>

            {/* Copy */}
            <button
              className="p-1 rounded-md transition-colors"
              style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
              onClick={e => {
                e.stopPropagation();
                navigator.clipboard.writeText(entry.snippet).catch(() => {});
                setCopied(true); setTimeout(() => setCopied(false), 2000);
              }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              {copied ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            </button>

            {/* 3-dot menu */}
            <div className="relative">
              <button
                className="p-1 rounded-md transition-colors"
                style={{
                  color: showMenu ? text : muted,
                  background: showMenu ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                  border: `1px solid ${border}`,
                }}
                onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
                title="More options"
                onMouseEnter={ev => { if (!showMenu) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={ev => { if (!showMenu) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
              >
                <MoreHorizontal className="w-2.5 h-2.5" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setShowMenu(false); }} />
                  <div
                    className="absolute bottom-full right-0 mb-1 rounded-xl overflow-hidden z-50 py-1 flex flex-col"
                    style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', minWidth: 148 }}
                  >
                    {[
                      { label: 'Open transcript', icon: <FileText className="w-3 h-3" />, action: () => { onNavigate(); setShowMenu(false); } },
                      { label: copied ? 'Copied!' : 'Copy snippet', icon: copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />, action: () => { navigator.clipboard.writeText(entry.snippet).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); setShowMenu(false); } },
                      { label: favourited ? 'Unfavourite' : 'Favourite', icon: <Heart className="w-3 h-3" style={{ fill: favourited ? '#ef4444' : 'none', color: favourited ? '#ef4444' : 'inherit' }} />, action: () => { setFavourited(v => !v); setShowMenu(false); } },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2 px-3 py-1.5 text-[11px] w-full text-left transition-colors"
                        style={{ color: muted, background: 'transparent' }}
                        onClick={e => { e.stopPropagation(); item.action(); }}
                        onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverStrip({
  isDark, border, text, muted, hoverBg,
}: {
  isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p style={{ color: text, fontWeight: 600, fontSize: '0.875rem' }}>Discover</p>
          <span
            className="px-2 py-0.5 rounded-full text-[10px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: muted, fontWeight: 600 }}
          >
            Trending
          </span>
        </div>
        <button
          onClick={() => navigate('/discover')}
          className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
          style={{ color: muted, fontWeight: 500 }}
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Scrollable single row */}
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {DISCOVER_ENTRIES.map(entry => (
          <DiscoverCard
            key={entry.id}
            entry={entry}
            isDark={isDark}
            border={border}
            text={text}
            muted={muted}
            hoverBg={hoverBg}
            onNavigate={() => navigate('/discover')}
          />
        ))}
      </div>
    </div>
  );
}

// ─── This Month Panel ─────����───────────────────────────────────────────────────
// ─── Prompt Library Strip ─────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; bgDark: string; color: string }> = {
  Hooks:      { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  Repurpose:  { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  Summary:    { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  Script:     { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  Analysis:   { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  Engagement: { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
  SEO:        { bg: 'rgba(0,0,0,0.06)',  bgDark: 'rgba(255,255,255,0.08)',  color: '#6b7280' },
};

function PromptLibraryStrip({
  isDark, border, text, muted, hoverBg,
}: {
  isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
}) {
  const navigate = useNavigate();
  const featured = PROMPTS.filter(p => p.featured).slice(0, 3);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);

  const handleCopy = (e: React.MouseEvent, prompt: typeof PROMPTS[0]) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt).catch(() => {});
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p style={{ color: text, fontWeight: 600, fontSize: '0.875rem' }}>Prompt Library</p>
          
        </div>
        <button
          onClick={() => navigate('/prompt-base')}
          className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
          style={{ color: muted, fontWeight: 500 }}
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {featured.map(p => {
          const cat = CATEGORY_COLORS[p.category] ?? CATEGORY_COLORS['Summary'];
          const copied = copiedId === p.id;
          return (
            <div
              key={p.id}
              onClick={() => navigate('/prompt-base')}
              className="rounded-xl flex flex-col gap-3 p-4 cursor-pointer transition-colors"
              style={{ border: `1px solid ${border}`, background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Category + uses */}
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{ background: isDark ? cat.bgDark : cat.bg, color: cat.color, fontWeight: 600 }}
                >
                  {p.category}
                </span>
                <span className="text-[10px] tabular-nums" style={{ color: muted }}>
                  {(p.uses / 1000).toFixed(1)}k uses
                </span>
              </div>

              {/* Title */}
              <p style={{ color: text, fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.3 }}>
                {p.title}
              </p>

              {/* Description */}
              <p className="line-clamp-2 flex-1" style={{ color: muted, fontSize: '0.72rem', lineHeight: 1.5 }}>
                {p.description}
              </p>

              {/* Tags + copy */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <div className="flex items-center gap-1 flex-wrap">
                  {p.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: muted }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={e => handleCopy(e, p)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all flex-shrink-0"
                  style={{
                    background: copied
                      ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: muted,
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; }}
                >
                  {copied
                    ? <><CheckCheck className="w-3 h-3" strokeWidth={2.5} />&nbsp;Copied</>
                    : <><Copy className="w-3 h-3" strokeWidth={2} />&nbsp;Copy</>
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThisMonthPanel({
  isDark, border, text, muted, hoverBg,
  audioProcessed, totalWords, avgWordsPerVideo, longestEntry, singlesCount, onViewAll,
}: {
  isDark: boolean; border: string; text: string; muted: string; hoverBg: string;
  audioProcessed: string; totalWords: number; avgWordsPerVideo: number;
  longestEntry: Transcript; singlesCount: number; onViewAll: () => void;
}) {
  const iconBg   = isDark ? 'rgba(255,255,255,0.08)' : '#efefef';
  const iconFill = isDark ? '#ffffff' : '#111111';

  const rows: { icon: React.ReactNode; label: string; sub: string; value: string }[] = [
    { icon: <Film className="w-4 h-4" />,       label: 'Transcripts created', sub: `${singlesCount} total in your library`,   value: String(singlesCount) },
    { icon: <Clock className="w-4 h-4" />,      label: 'Audio processed',     sub: 'total runtime across all videos',         value: audioProcessed },
    { icon: <FileText className="w-4 h-4" />,   label: 'Words extracted',     sub: 'across all transcripts',                  value: `${(totalWords / 1000).toFixed(1)}K` },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Avg. words / video',  sub: 'words per transcript',                    value: avgWordsPerVideo.toLocaleString() },
    { icon: <Zap className="w-4 h-4" />,        label: 'Longest transcript',  sub: longestEntry.title,                        value: `${(longestEntry.words / 1000).toFixed(1)}K w` },
  ];

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `1px solid ${border}` }}>
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div>
          <p style={{ color: text, fontWeight: 600, fontSize: '0.875rem' }}>This Month</p>
          <p className="mt-0.5" style={{ color: muted, fontSize: '0.72rem' }}>{audioProcessed} of audio processed</p>
        </div>
        
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="flex items-center gap-3 px-5 py-3 transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg, color: iconFill }}
          >
            {row.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: text, fontWeight: 500, fontSize: '0.8125rem' }}>{row.label}</p>
            <p className="truncate mt-0.5" style={{ color: muted, fontSize: '0.6875rem' }}>{row.sub}</p>
          </div>
          <span style={{ color: text, fontWeight: 600, fontSize: '0.8125rem', flexShrink: 0 }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── First-Time User Dashboard ───────────────────────────────────────────────
function FirstTimeDashboardOverview({ onNewTranscript }: { onNewTranscript: () => void }) {
  const { isDark } = useContext(ThemeContext);

  const bg       = isDark ? '#0d0d0d' : '#ffffff';
  const border   = isDark ? '#262626' : '#e5e7eb';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#888888' : '#6b7280';
  const cardBg   = isDark ? '#141414' : '#f9fafb';
  const iconBg   = isDark ? 'rgba(255,255,255,0.07)' : '#efefef';
  const iconFill = isDark ? '#ffffff' : '#111111';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const steps = [
    {
      number: '01',
      icon: <ExternalLink className="w-4 h-4" />,
      title: 'Paste a video link',
      description: 'Grab any TikTok, YouTube, or Instagram URL and drop it in the input.',
    },
    {
      number: '02',
      icon: <Globe className="w-4 h-4" />,
      title: 'Choose your language',
      description: "Select from 12 languages. We'll transcribe and optionally retranslate.",
    },
    {
      number: '03',
      icon: <FileText className="w-4 h-4" />,
      title: 'Get your transcript',
      description: 'Your full transcript is ready to copy, download, or analyze instantly.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: bg }}>
      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-7">
          <h1 style={{ color: text, fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.01em' }}>
            {greeting}, James
          </h1>
          
        </div>

        {/* ── Welcome hero ── */}
        <div
          className="rounded-xl px-8 py-10 mb-3 flex flex-col items-center text-center"
          style={{ border: `1px solid ${border}` }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
            style={{ background: iconBg }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#00b8b2' }} />
          </div>
          <h2 style={{ color: text, fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
            Welcome to Tokscript
          </h2>
          <p style={{ color: muted, fontSize: '0.8125rem', lineHeight: 1.75, maxWidth: 400 }}>
            You're all set up. Transcribe your first video in seconds —<br />
            just paste a link and we'll handle the rest.
          </p>
          <button
            onClick={onNewTranscript}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#e8e8e8' : '#2a2a2a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#ffffff' : '#111111'; }}
          >
            <Plus className="w-4 h-4" />
            Create your first transcript
          </button>
        </div>

        {/* ── How it works: 3 steps ── */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl px-5 py-5 flex flex-col gap-3"
              style={{ border: `1px solid ${border}` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: iconBg, color: iconFill }}
                >
                  {step.icon}
                </div>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)', fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.03em' }}>
                  {step.number}
                </span>
              </div>
              <div>
                <p style={{ color: text, fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.3rem' }}>{step.title}</p>
                <p style={{ color: muted, fontSize: '0.71rem', lineHeight: 1.65 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Supported platforms ── */}
        

      </div>
    </div>
  );
}

// ─── Dashboard Banner ─────────────────────────────────────────────────────────
function DashboardBanner({
  isDark,
  onUpgrade,
}: {
  isDark: boolean;
  plan: 'free' | 'pro';
  onUpgrade: () => void;
}) {
  if (!isDark) {
    // ── Light variant ──────────────────────────────────────────────────────────
    return (
      <div className="relative mb-4 flex-shrink-0" style={{ width: '100%', height: 126 }}>
        <div className="bg-white border border-[#e5e7eb] border-solid overflow-clip relative rounded-[10px] size-full">

          {/* Background screenshot */}
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[297px] left-[calc(50%-0.5px)] top-[calc(50%-50.28px)] w-[896px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBannerBgLight} />
          </div>

          {/* Text stack */}
          <div className="absolute h-[75.281px] left-[27px] top-[23px] w-[707px]">
            <div className="absolute h-[21px] left-0 top-0 w-[246.68px]">
              <p className="absolute font-bold leading-[21px] left-0 text-[#111] text-[14px] top-0 whitespace-nowrap">
                Unlock the full Tokscript experience
              </p>
            </div>
            <div className="absolute h-[17.281px] left-0 top-[24px] w-[505.453px]">
              <p className="absolute font-normal leading-[17.28px] left-0 text-[#888] text-[12px] top-0 whitespace-nowrap">
                Unlimited transcriptions · All languages · Bulk scanning · Priority queue · Advanced export
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="absolute bg-[#111] flex h-[28px] items-center justify-center left-0 rounded-[10px] top-[47.28px] w-[171px] transition-opacity hover:opacity-85 cursor-pointer border-none"
            >
              <p className="font-medium leading-[16px] text-[12px] text-center text-white whitespace-nowrap">
                Upgrade now for $10/mo
              </p>
            </button>
          </div>

          {/* Rocket image */}
          <div className="absolute h-[291px] left-[529px] top-[9px] w-[194px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBannerRocket} />
          </div>

        </div>
      </div>
    );
  }

  // ── Dark variant ─────────────────────────────────────────────────────────────
  return (
    <div className="relative mb-4 flex-shrink-0" style={{ width: '100%', height: 126 }}>
      <div className="bg-[#0d0d0d] border border-[#262626] border-solid overflow-clip relative rounded-[10px] size-full">

        {/* Background screenshot — 20% opacity, centered */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[271px] left-[calc(50%-29px)] opacity-20 top-[calc(50%+0.5px)] w-[1052px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBannerBg} />
        </div>

        {/* Text stack */}
        <div className="absolute content-stretch flex flex-col gap-[3px] items-start left-[27px] top-[23px] w-[707px]">
          <p className="font-bold h-[22px] leading-[21px] relative shrink-0 text-[14px] text-white w-full">
            Unlock the full Tokscript experience
          </p>
          <p className="font-normal h-[23px] leading-[17.28px] relative shrink-0 text-[12px] text-white w-full">
            Unlimited transcriptions · All languages · Bulk scanning · Priority queue · Advanced export
          </p>
          <button
            onClick={onUpgrade}
            className="bg-white h-[28px] relative rounded-[10px] shrink-0 w-[171px] transition-opacity hover:opacity-85 cursor-pointer border-none"
          >
            <p className="-translate-x-1/2 absolute font-medium leading-[16px] left-1/2 text-[#111] text-[12px] text-center top-[6.5px] whitespace-nowrap">
              Upgrade now for $10/mo
            </p>
          </button>
        </div>

        {/* Rocket image */}
        <div className="-translate-y-1/2 absolute h-[291px] left-[529px] top-[calc(50%+92.5px)] w-[194px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBannerRocket} />
        </div>

      </div>
    </div>
  );
}

// ─── Inline Dashboard Overview ────────────────────────────────────────────────
function InlineDashboardOverview({
  onNewTranscript,
  onSelectSingles,
  onSelectCollections,
  onSelectBulk,
  onSelectTranscript,
}: {
  onNewTranscript: () => void;
  onSelectSingles: () => void;
  onSelectCollections: () => void;
  onSelectBulk: () => void;
  onSelectTranscript: (id: number) => void;
}) {
  const { isDark } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);

  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const cardBg  = isDark ? '#141414' : '#f9fafb';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#f3f2f0';

  const totalWords     = SINGLES.reduce((a, t) => a + t.words, 0);
  const totalColVideos   = COLLECTIONS.reduce((a, c) => a + c.count, 0);
  const totalBulkVids    = BULK.reduce((a, b) => a + b.count, 0);
  const recentFive       = SINGLES.slice(0, 5);
  const totalSeconds     = SINGLES.reduce((a, t) => a + parseDuration(t.duration), 0);
  const audioProcessed   = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
  const avgWordsPerVideo = Math.round(totalWords / SINGLES.length);
  const longestEntry     = SINGLES.reduce((a, t) => t.words > a.words ? t : a, SINGLES[0]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    {
      label: 'Transcripts',
      value: SINGLES.length,
      icon: <Film className="w-3.5 h-3.5" />,
      change: '+15%',
      positive: true,
      onClick: onSelectSingles,
    },
    {
      label: 'Collections',
      value: COLLECTIONS.length,
      icon: <Layers className="w-3.5 h-3.5" />,
      change: '-12.5%',
      positive: false,
      onClick: onSelectCollections,
    },
    {
      label: 'Bulk Batches',
      value: BULK.length,
      icon: <List className="w-3.5 h-3.5" />,
      change: '+25%',
      positive: true,
      onClick: onSelectBulk,
    },
    {
      label: 'Words Transcribed',
      value: Math.round(totalWords / 1000) + 'K',
      icon: <FileText className="w-3.5 h-3.5" />,
      change: '+12.5%',
      positive: true,
      onClick: onSelectSingles,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: bg }}>
      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* ── Header: title + date range + CTA ── */}
        <div className="flex items-center justify-between mb-7">
          <h1 style={{ color: text, fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.01em' }}>
            {greeting}, James
          </h1>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ border: `1px solid ${border}`, color: muted, background: cardBg }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Feb 1 – Feb 28, 2026
            </div>
            
          </div>
        </div>

        {/* ── Stat Cards — unified panel ── */}
        <div
          className="grid gap-3 mb-3"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {stats.map((s, i) => (
            <button
              key={s.label}
              onClick={s.onClick}
              className="flex flex-col px-4 pt-3 pb-3 text-left rounded-lg transition-colors"
              style={{ border: `1px solid ${border}`, background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {/* Icon + label */}
              <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                {s.icon}
                <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{s.label}</span>
              </div>
              {/* Big number */}
              <p style={{ color: text, fontWeight: 700, fontSize: '1.375rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {s.value}
              </p>
              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <span style={{ color: muted, fontSize: '0.6875rem' }}>last 30 days</span>
                <span style={{ color: s.positive ? '#22c55e' : '#ef4444', fontSize: '0.6875rem', fontWeight: 500 }}>
                  {s.change}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Dashboard Banner ── */}
        {plan === 'free' && (
          <DashboardBanner
            isDark={isDark}
            plan={plan}
            onUpgrade={openUpgrade}
          />
        )}

        {/* ── Main grid: recent transcripts + this month ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

          {/* ── Recent Transcripts panel ── */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ border: `1px solid ${border}` }}>
            {/* Panel header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4">
              <div>
                <p style={{ color: text, fontWeight: 600, fontSize: '0.875rem' }}>Recent Transcripts</p>
                <p className="mt-0.5" style={{ color: muted, fontSize: '0.72rem' }}>You transcribed 8 videos this month.</p>
              </div>
              
            </div>

            {/* Rows */}
            <div className="flex flex-col">
              {recentFive.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-5 py-3 transition-colors cursor-pointer"
                  style={{
                    background: 'transparent',
                  }}
                  onClick={() => onSelectTranscript(t.id)}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  {/* Avatar / thumbnail circle */}
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: `1px solid ${border}` }}
                  >
                    <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ color: text, fontWeight: 500, fontSize: '0.8125rem' }}>{t.title}</p>
                    <p className="mt-0.5 truncate" style={{ color: muted, fontSize: '0.6875rem' }}>{t.source}</p>
                  </div>
                  {/* Right value */}
                  <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                    <span style={{ color: text, fontWeight: 600, fontSize: '0.75rem' }}>
                      {t.date}
                    </span>
                    <span style={{ color: muted, fontSize: '0.6875rem' }}>
                      {formatDuration(t.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── This Month panel ── */}
          <ThisMonthPanel
            isDark={isDark}
            border={border}
            text={text}
            muted={muted}
            hoverBg={hoverBg}
            audioProcessed={audioProcessed}
            totalWords={totalWords}
            avgWordsPerVideo={avgWordsPerVideo}
            longestEntry={longestEntry}
            singlesCount={SINGLES.length}
            onViewAll={onSelectSingles}
          />

        </div>

        {/* ── Prompt Library strip ── */}
        <PromptLibraryStrip isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg} />

        {/* ── Discover strip ── */}
        <DiscoverStrip isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg} />

      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const _nav = useNavigate();
  // Wrap navigate so any /profile/... navigation auto-stamps sessionStorage with the
  // correct 'from' value — keeps CreatorProfilePage breadcrumb accurate without
  // touching every individual onViewCreator call site.
  const navigate: typeof _nav = (path: any, opts?: any) => {
    if (typeof path === 'string' && path.startsWith('/profile/')) {
      sessionStorage.setItem('creatorNavFrom', (opts?.state as any)?.from ?? 'transcript');
    }
    return _nav(path, opts);
  };
  const location = useLocation();
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);
  const { open: openNewTranscript } = useNewTranscript();

  const initialView = (): ViewState => {
    const s = (location.state as any);
    if (s?.view === 'singles')     return { category: 'singles' };
    if (s?.view === 'collections') return { category: 'collections', groupId: s.groupId };
    if (s?.view === 'bulk')        return { category: 'bulk', groupId: s.groupId };
    return { category: 'dashboard' };
  };

  const [view, setView] = useState<ViewState>(initialView);

  // Safety net: if view somehow ends up as 'favourites' or 'folders', redirect to FolderPage
  useEffect(() => {
    if (view.category === 'favourites') {
      navigate('/folder/500', { replace: true });
    } else if (view.category === 'folders' && view.groupId != null) {
      navigate(`/folder/${view.groupId}`, { replace: true });
    }
  }, [view.category, view.groupId]);

  const [selectedTranscriptId, setSelectedTranscriptId] = useState<number | null>(null);
  const [folders, setFolders] = useState<GroupItem[]>(FOLDERS);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterSources, setFilterSources] = useState<string[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isFirstTimeUser] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [favouritedIds, setFavouritedIds] = useState<Set<number>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [customTitles, setCustomTitles] = useState<Record<number, string>>({});
  const [editingItem, setEditingItem] = useState<{ id: number; title: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [moveSubMenuOpen, setMoveSubMenuOpen] = useState(false);
  const [singlesViewMode, setSinglesViewMode] = useState<'hybrid' | 'list' | 'grid'>('grid');
  const [groupViewMode, setGroupViewMode] = useState<'hybrid' | 'list' | 'grid'>('grid');
  const [groupSlideId, setGroupSlideId] = useState<number | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<number | null>(null);
  const [singlesSlideId, setSinglesSlideId] = useState<number | null>(null);
  const [folderModalFor, setFolderModalFor] = useState<{ id: number; rect: DOMRect; title: string } | null>(null);
  // Unified filter bar state — multi-select
  const [singlesActiveDurations, setSinglesActiveDurations] = useState<string[]>([]);
  const [singlesActiveWords, setSinglesActiveWords] = useState<string[]>([]);
  const [singlesActivePlatform, setSinglesActivePlatform] = useState('All');
  const [singlesActiveDateRanges, setSinglesActiveDateRanges] = useState<string[]>([]);
  const [openSinglesDropdown, setOpenSinglesDropdown] = useState<string | null>(null);
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
  const [openColDropdown, setOpenColDropdown] = useState<string | null>(null);
  const [colSortBy, setColSortBy] = useState('date-desc');
  const [colActiveDateRanges, setColActiveDateRanges] = useState<string[]>([]);
  const [colActivePlatform, setColActivePlatform] = useState('All');
  const [groupActiveDurations, setGroupActiveDurations] = useState<string[]>([]);
  const [groupActiveWords, setGroupActiveWords] = useState<string[]>([]);
  const [groupActiveDateRanges, setGroupActiveDateRanges] = useState<string[]>([]);
  const [groupActivePlatform, setGroupActivePlatform] = useState('All');
  const [singlesSelectedIds, setSinglesSelectedIds] = useState<Set<number>>(new Set());
  const [groupSelectedIds, setGroupSelectedIds] = useState<Set<number>>(new Set());

  // Clear singles selection when leaving grid view
  useEffect(() => {
    if (singlesViewMode !== 'grid') {
      setSinglesSelectedIds(new Set());
    }
  }, [singlesViewMode]);

  // Clear group selection when leaving grid view
  useEffect(() => {
    if (groupViewMode !== 'grid') {
      setGroupSelectedIds(new Set());
    }
  }, [groupViewMode]);

  // Clear all selection on view/category change
  useEffect(() => {
    setSinglesSelectedIds(new Set());
    setGroupSelectedIds(new Set());
  }, [view.category, view.groupId]);

  const toggleSinglesSelect = (id: number) => {
    setSinglesSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleGroupSelect = (id: number) => {
    setGroupSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const showToast = (msg: string) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => setToast(t => (t?.id === id ? null : t)), 2500);
  };

  // Colours
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#888888' : '#6b7280';
  const hoverBg   = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const cardBg    = isDark ? '#141414' : '#f9fafb';
  const subtle    = isDark ? '#262626' : '#d1d5db';

  // ── Derived ──────────────────────────────────────────────────────────────────
  const activeGroup =
    view.groupId != null && view.category !== 'dashboard'
      ? (view.category === 'collections' ? COLLECTIONS
          : view.category === 'bulk' ? BULK
          : view.category === 'profiles' ? PROFILE_GROUPS
          : folders
        ).find(g => g.id === view.groupId)
      : null;

  const isGroupActive = (id: number) => view.groupId === id;

  // ── Sidebar nav helpers ───────────────────────────────────────────────────────
  const selectSingles = () => {
    setView({ category: 'singles' });
    setSelectedTranscriptId(null);
  };

  const toggleCollections = () => {
    setView({ category: 'collections' });
    setSelectedTranscriptId(null);
  };

  const toggleBulk = () => {
    setView({ category: 'bulk' });
    setSelectedTranscriptId(null);
  };

  const selectGroup = (cat: 'collections' | 'bulk' | 'folders' | 'profiles', id: number) => {
    if (cat === 'folders') {
      navigate(`/folder/${id}`);
      return;
    }
    setView({ category: cat, groupId: id });
    setSelectedTranscriptId(null);
  };

  const openNewFolderModal = () => {
    setNewFolderName('');
    setShowNewFolderModal(true);
  };

  const createFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const newId = Date.now();
    setFolders(prev => [...prev, { id: newId, name, count: 0, videos: [] }]);
    setShowNewFolderModal(false);
    setNewFolderName('');
    navigate(`/folder/${newId}`);
  };

  // ── List panel content ─────���──────────────────��──────────────────────────────
  const getListItems = (): { items: (Transcript | VideoItem | GroupItem)[], title: string, isGroups: boolean } => {
    if (view.category === 'dashboard') {
      return { items: [], title: 'Dashboard', isGroups: false };
    }
    if (view.category === 'favourites') {
      const allItems: (Transcript | VideoItem)[] = [
        ...SINGLES,
        ...PROFILE_EXTRAS,
        ...COLLECTIONS.flatMap(g => g.videos),
        ...BULK.flatMap(g => g.videos),
        ...(PROFILE_GROUPS.flatMap(g => g.videos) as unknown as VideoItem[]),
        ...folders.filter(f => f.id !== FAVOURITES_FOLDER_ID).flatMap(f => f.videos),
      ];
      const favItems = allItems.filter(t => favouritedIds.has(t.id) && !deletedIds.has(t.id));
      return { items: favItems, title: 'Favourites', isGroups: false };
    }
    if (view.category === 'singles') {
      let results = SINGLES.filter(t => {
        if (deletedIds.has(t.id)) return false;
        const q = searchQuery.toLowerCase();
        const matchQ = !q || t.title.toLowerCase().includes(q) || t.source.toLowerCase().includes(q);
        const [m, s] = t.duration.split(':').map(Number);
        const mins = m + (s || 0) / 60;
        const matchD = singlesActiveDurations.length === 0 || (
          (singlesActiveDurations.includes('<1 min')  && mins < 1) ||
          (singlesActiveDurations.includes('1–3 min') && mins >= 1 && mins < 3) ||
          (singlesActiveDurations.includes('3+ min')  && mins >= 3)
        );
        const matchW = singlesActiveWords.length === 0 || (
          (singlesActiveWords.includes('<1K')   && t.words < 1000) ||
          (singlesActiveWords.includes('1K–5K') && t.words >= 1000 && t.words <= 5000) ||
          (singlesActiveWords.includes('5K+')   && t.words > 5000)
        );
        const matchSrc = filterSources.length === 0 || filterSources.includes(t.source);
        const matchP = singlesActivePlatform === 'All' || singlesActivePlatform === t.platform;
        return matchQ && matchD && matchW && matchSrc && matchP;
      });
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':      return a.id - b.id;
          case 'title-asc':     return a.title.localeCompare(b.title);
          case 'title-desc':    return b.title.localeCompare(a.title);
          case 'duration-desc': return parseDuration(b.duration) - parseDuration(a.duration);
          case 'duration-asc':  return parseDuration(a.duration) - parseDuration(b.duration);
          case 'words-desc':    return b.words - a.words;
          case 'words-asc':     return a.words - b.words;
          default:              return b.id - a.id;
        }
      });
      return { items: results, title: 'Singles', isGroups: false };
    }

    if (view.groupId && activeGroup) {
      let vids = [...activeGroup.videos];
      if (collectionSearchQuery) {
        const cq = collectionSearchQuery.toLowerCase();
        vids = vids.filter(v => v.title.toLowerCase().includes(cq) || (v.source ?? '').toLowerCase().includes(cq));
      }
      if (groupActivePlatform !== 'All') {
        vids = vids.filter(v => (v.platform ?? '') === groupActivePlatform);
      }
      vids = vids.sort((a, b) => {
        switch (colSortBy) {
          case 'date-asc':      return a.id - b.id;
          case 'title-asc':     return a.title.localeCompare(b.title);
          case 'title-desc':    return b.title.localeCompare(a.title);
          case 'duration-desc': return parseDuration(b.duration) - parseDuration(a.duration);
          case 'duration-asc':  return parseDuration(a.duration) - parseDuration(b.duration);
          default:              return b.id - a.id;
        }
      });
      return { items: vids, title: activeGroup.name, isGroups: false };
    }

    const allGroups = view.category === 'collections' ? COLLECTIONS
      : view.category === 'bulk' ? BULK
      : view.category === 'profiles' ? PROFILE_GROUPS
      : folders;
    let groups = [...allGroups] as GroupItem[];
    if (collectionSearchQuery) {
      const cq = collectionSearchQuery.toLowerCase();
      groups = groups.filter(g => g.name.toLowerCase().includes(cq));
    }
    if (colActivePlatform !== 'All') {
      groups = groups.filter(g => g.videos.some(v => (v.platform ?? '') === colActivePlatform));
    }
    if (colSortBy === 'title-asc') groups.sort((a, b) => a.name.localeCompare(b.name));
    else if (colSortBy === 'title-desc') groups.sort((a, b) => b.name.localeCompare(a.name));
    const titles: Record<string, string> = { collections: 'Collections', bulk: 'Bulk Transcripts', profiles: 'Profiles', folders: 'Folders' };
    return { items: groups, title: titles[view.category] ?? 'Folders', isGroups: true };
  };

  const { items, title: listTitle, isGroups } = getListItems();

  // ── List panel title ─────────────────────────────────────────────────────────
  const listPanelTitle = view.groupId && activeGroup
    ? activeGroup.name
    : listTitle;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      {/* ════════════════════════════════════════════════════════════════════
          TOP HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      {/* ── All three panels ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

      {/* ═══════════════════════════════════════════���════════════════════════
          LEFT SIDEBAR
      ════════════════════════════════════════════════════════════════════ */}
      <AppSidebar
        activePage="dashboard"
        collapsed={sidebarCollapsed}
        activeLibraryItem={
          view.category === 'singles'     ? 'singles'
          : view.category === 'collections' ? 'collections'
          : view.category === 'bulk'        ? 'bulk'
          : view.category === 'favourites'  ? 'favourites'
          : undefined
        }
        activeGroupId={view.groupId}
        onSelectSingles={selectSingles}
        onSelectCollections={toggleCollections}
        onSelectBulk={toggleBulk}
        onSelectGroup={(cat, id) => selectGroup(cat as 'collections' | 'bulk' | 'folders' | 'profiles', id)}
        onSelectFavourites={() => navigate('/folder/500')}
        favouritesCount={favouritedIds.size}
      />


      {/* ══���═════════════════════════════════════════════════════════════════
          MAIN CONTENT (always rendered; New Transcript opens as modal)
      ════════════════════════════════════════════════════════════════════ */}
      {view.category === 'dashboard' ? (
        isFirstTimeUser ? (
          <FirstTimeDashboardOverview
            onNewTranscript={() => { openNewTranscript(); setSelectedTranscriptId(null); }}
          />
        ) : (
          <InlineDashboardOverview
            onNewTranscript={() => { openNewTranscript(); setSelectedTranscriptId(null); }}
            onSelectSingles={selectSingles}
            onSelectCollections={toggleCollections}
            onSelectBulk={toggleBulk}
            onSelectTranscript={(id) => { setSelectedTranscriptId(prev => prev === id ? null : id); }}
          />
        )
      ) : view.category === 'singles' ||
          view.category === 'collections' ||
          view.category === 'bulk' ? (
        view.category === 'singles' ? (
        /* ══════════════════════════════════════════════════════════════
           SINGLES FULL-PAGE VIEW  (list / grid mode)
        ══════════════════════════════════════════════════════════════ */
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 pt-5 pb-4">
              <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                Singles
              </h1>
              <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                Your individual transcript library — {items.length} transcript{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* ── Unified Filter Bar ───────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}`, color: muted, width: 220 }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search transcripts or sources…"
                className="flex-1 bg-transparent outline-none text-xs min-w-0"
                style={{ color: text }}
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ color: muted }}><X className="w-3 h-3" /></button>}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Platform tabs */}
            {(['All', 'TikTok', 'Instagram', 'YouTube'] as const).map(tab => {
              const isActive = singlesActivePlatform === tab;
              const tabIcons: Record<string, JSX.Element | null> = {
                All: null,
                TikTok: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>,
                Instagram: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                YouTube: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
              };
              return (
                <button key={tab}
                  onClick={() => setSinglesActivePlatform(tab)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 transition-all"
                  style={{
                    background: isActive ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)') : 'transparent',
                    color: isActive ? text : muted,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tabIcons[tab]}
                  {tab}
                </button>
              );
            })}

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            <div className="flex-1" />

            {/* Duration multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: singlesActiveDurations.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: singlesActiveDurations.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${singlesActiveDurations.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenSinglesDropdown(openSinglesDropdown === 'duration' ? null : 'duration')}
              >
                <Clock className="w-3 h-3" />
                {singlesActiveDurations.length === 0 ? 'Duration' : singlesActiveDurations.length === 1 ? singlesActiveDurations[0] : `${singlesActiveDurations.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openSinglesDropdown === 'duration' ? 'rotate-180' : ''}`} />
              </button>
              {openSinglesDropdown === 'duration' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSinglesDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['<1 min', '1–3 min', '3+ min'].map(opt => {
                      const sel = singlesActiveDurations.includes(opt);
                      return (
                        <button key={opt} onClick={e => { e.stopPropagation(); setSinglesActiveDurations(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Words multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: singlesActiveWords.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: singlesActiveWords.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${singlesActiveWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenSinglesDropdown(openSinglesDropdown === 'words' ? null : 'words')}
              >
                <FileText className="w-3 h-3" />
                {singlesActiveWords.length === 0 ? 'Words' : singlesActiveWords.length === 1 ? singlesActiveWords[0] : `${singlesActiveWords.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openSinglesDropdown === 'words' ? 'rotate-180' : ''}`} />
              </button>
              {openSinglesDropdown === 'words' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSinglesDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}>
                    {['<1K', '1K–5K', '5K+'].map(opt => {
                      const sel = singlesActiveWords.includes(opt);
                      return (
                        <button key={opt} onClick={e => { e.stopPropagation(); setSinglesActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Source multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: filterSources.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: filterSources.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${filterSources.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenSinglesDropdown(openSinglesDropdown === 'source' ? null : 'source')}
              >
                <Users className="w-3 h-3" />
                {filterSources.length === 0 ? 'Source' : filterSources.length === 1 ? filterSources[0] : `${filterSources.length} sources`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openSinglesDropdown === 'source' ? 'rotate-180' : ''}`} />
              </button>
              {openSinglesDropdown === 'source' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSinglesDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 172, maxHeight: 240, overflowY: 'auto' }}>
                    {ALL_SOURCES.map(src => {
                      const sel = filterSources.includes(src);
                      return (
                        <button key={src} onClick={e => { e.stopPropagation(); setFilterSources(prev => sel ? prev.filter(s => s !== src) : [...prev, src]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{src}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Date multi-select */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: singlesActiveDateRanges.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: singlesActiveDateRanges.length > 0 ? '#00b8b2' : muted,
                  border: `1px solid ${singlesActiveDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                  fontWeight: singlesActiveDateRanges.length > 0 ? 500 : 400,
                }}
                onClick={() => setOpenSinglesDropdown(openSinglesDropdown === 'date' ? null : 'date')}
              >
                <Calendar className="w-3 h-3" />
                {singlesActiveDateRanges.length === 0 ? 'Date' : singlesActiveDateRanges.length === 1 ? singlesActiveDateRanges[0] : `${singlesActiveDateRanges.length} selected`}
                <ChevronDown className={`w-3 h-3 transition-transform ${openSinglesDropdown === 'date' ? 'rotate-180' : ''}`} />
              </button>
              {openSinglesDropdown === 'date' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSinglesDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                    {['Today', 'This week', 'This month'].map(opt => {
                      const sel = singlesActiveDateRanges.includes(opt);
                      return (
                        <button key={opt}
                          onClick={e => { e.stopPropagation(); setSinglesActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                          style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                          onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sortBy !== 'date-desc' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: sortBy !== 'date-desc' ? '#00b8b2' : muted,
                  border: `1px solid ${sortBy !== 'date-desc' ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenSinglesDropdown(openSinglesDropdown === 'sort' ? null : 'sort')}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest first'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openSinglesDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openSinglesDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenSinglesDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 156 }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenSinglesDropdown(null); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                        style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={e => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={e => { if (sortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}{sortBy === opt.value && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Clear all */}
            {(filterSources.length > 0 || singlesActivePlatform !== 'All' || singlesActiveDateRanges.length > 0 || singlesActiveDurations.length > 0 || singlesActiveWords.length > 0 || sortBy !== 'date-desc' || searchQuery) && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button className="flex items-center gap-1 text-xs hover:opacity-70 flex-shrink-0" style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setFilterSources([]); setSinglesActivePlatform('All'); setSinglesActiveDateRanges([]); setSinglesActiveDurations([]); setSinglesActiveWords([]); setSortBy('date-desc'); setSearchQuery(''); }}>
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}

            {/* View toggle */}
            <div className="flex items-center p-0.5 rounded-lg flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}>
              {([
                { mode: 'grid'   as const, icon: <LayoutGrid className="w-3.5 h-3.5" />, title: 'Grid view'   },
                { mode: 'list'   as const, icon: <List       className="w-3.5 h-3.5" />, title: 'List view'   },
                { mode: 'hybrid' as const, icon: <Columns2   className="w-3.5 h-3.5" />, title: 'Hybrid view' },
              ] as const).map(({ mode, icon, title }) => (
                <button key={mode} title={title} onClick={() => setSinglesViewMode(mode)}
                  className="p-1.5 rounded-md transition-all"
                  style={{
                    background: singlesViewMode === mode ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                    color: singlesViewMode === mode ? text : muted,
                    boxShadow: singlesViewMode === mode ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  }}
                >{icon}</button>
              ))}
            </div>

          </div>
          </div>

          {/* Content */}
          {singlesViewMode === 'hybrid' ? (
            /* ── Hybrid: left compact list + right detail panel ── */
            <div className="flex-1 overflow-hidden">
            <div className="flex max-w-[1280px] mx-auto w-full h-full min-h-0 overflow-hidden px-6 py-5">
              {/* Left: compact scrollable list */}
              <div className="flex-shrink-0 flex flex-col" style={{ width: 240, borderRight: `1px solid ${border}` }}>
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: `${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} transparent` }}
                >
                  {items.length > 0 ? (
                    <div className="flex flex-col gap-0.5 p-2">
                      {(items as Transcript[]).map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                          style={{
                            background: singlesSlideId === item.id
                              ? (isDark ? 'rgba(255,255,255,0.07)' : '#f0eeeb')
                              : 'transparent',
                            border: `1px solid ${singlesSlideId === item.id ? border : 'transparent'}`,
                            transition: 'background 0.1s',
                          }}
                          onClick={() => setSinglesSlideId(item.id)}
                          onMouseEnter={ev => { if (singlesSlideId !== item.id) (ev.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                          onMouseLeave={ev => { if (singlesSlideId !== item.id) (ev.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                        >
                          <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 30, aspectRatio: '9/16' }}>
                            <ImageWithFallback src={(item as Transcript).thumbnail ?? ''} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <p
                              className="text-[11px] leading-snug"
                              style={{ color: text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}
                            >{item.title}</p>
                            <div className="flex items-center gap-1">
                              {(item as Transcript).avatar && (
                                <div className="relative flex-shrink-0">
                                  <img src={(item as Transcript).avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                                  {VERIFIED_CREATORS.has((item as Transcript).source) && (
                                    <span className="absolute flex items-center justify-center rounded-full"
                                      style={{ bottom: -1, right: -1, width: 7, height: 7, background: '#1d9bf0', border: '1px solid #fff' }}>
                                      <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                                        <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              )}
                              <p className="text-[10px] truncate" style={{ color: muted }}>{(item as Transcript).source}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 flex-shrink-0" style={{ color: muted }} />
                              <span className="text-[9px]" style={{ color: muted }}>{item.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-2 px-4">
                      <Film className="w-6 h-6" style={{ color: muted }} />
                      <p className="text-xs text-center" style={{ color: muted }}>No transcripts match your filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: detail panel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {singlesSlideId !== null ? (() => {
                  const si = (SINGLES.find(s => s.id === singlesSlideId) ?? SINGLES[0]) as Transcript;
                  const svid = transcriptToDetailVideo(si);
                  const panelBg = isDark ? '#141414' : '#ffffff';
                  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
                  return (
                    <TranscriptDetailPanel
                      video={svid}
                      transcript={IV_TRANSCRIPT}
                      related={IV_RELATED}
                      downloadFormats={DOWNLOAD_FORMATS}
                      isDark={isDark}
                      bg={panelBg}
                      border={border}
                      text={text}
                      muted={muted}
                      hoverBg={hoverBg}
                      cardBg={innerCardBg}
                      onBack={() => setSinglesSlideId(null)}
                      onViewCreator={creator => goToCreator(creator)}
                      plan={plan}
                      onUpgrade={openUpgrade}
                    />
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', border: `1px solid ${border}` }}>
                      <FileText className="w-5 h-5" style={{ color: muted }} />
                    </div>
                    <p className="text-sm" style={{ color: muted }}>Select a transcript to view</p>
                  </div>
                )}
              </div>
            </div>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto w-full px-6 py-5">
            {/* Selection bar */}
            {view.category === 'singles' && singlesSelectedIds.size > 0 && (
              <SelectionBar
                selectedCount={singlesSelectedIds.size}
                isDark={isDark}
                accentColor="#00b8b2"
                onDeselect={() => { setSinglesSelectedIds(new Set()); }}
                onSelectPage={() => {
                  const allIds = new Set(items.map((t: any) => t.id));
                  setSinglesSelectedIds(allIds);
                }}
                totalPageCount={items.length}
                onDownloadVideos={() => { simulateZipDownload(Array.from(singlesSelectedIds).map(String), 'selected-videos'); }}
                onDownloadCovers={() => { simulateZipDownload(Array.from(singlesSelectedIds).map(String), 'selected-covers'); }}
                onDownloadTranscripts={() => { simulateZipDownload(Array.from(singlesSelectedIds).map(String), 'selected-transcripts'); }}
                onDownloadData={() => { simulateZipDownload(Array.from(singlesSelectedIds).map(String), 'selected-data'); }}
                onDownloadAll={() => { simulateZipDownload(Array.from(singlesSelectedIds).map(String), 'selected-all'); }}
              />
            )}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Film className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db' }} />
                <p style={{ color: muted }}>No transcripts match your filters</p>
                <button className="text-xs" style={{ color: '#00b8b2' }} onClick={() => { setSearchQuery(''); setFilterSources([]); setSinglesActiveDurations([]); setSinglesActiveWords([]); }}>Clear filters</button>
              </div>
            ) : singlesViewMode === 'list' ? (
              <div className="flex flex-col" style={{ borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
                {/* Table header */}
                <div className="flex items-center px-4 py-2 text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: muted, borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                  <div style={{ width: 48 }} className="mr-3 flex-shrink-0" />
                  <div style={{ width: 220 }} className="flex-shrink-0">Content</div>
                  <div className="flex-1 min-w-0">Transcript</div>
                  <div style={{ width: 80 }} className="text-right mr-4 flex-shrink-0">Date</div>
                  <div style={{ width: 60 }} className="text-center mr-4 flex-shrink-0">Duration</div>
                  <div style={{ width: 80 }} className="text-center mr-2 flex-shrink-0">Status</div>
                  <div style={{ width: 32 }} className="flex-shrink-0" />
                </div>
                {(items as Transcript[]).map((item) => {
                  const itemStatus: string = (item as Transcript & { status?: string }).status || 'complete';
                  const statusColors = {
                    complete:      { bg: isDark ? 'rgba(34,197,94,0.12)'  : 'rgba(34,197,94,0.10)',  color: isDark ? '#4ade80' : '#16a34a' },
                    failed:        { bg: isDark ? 'rgba(239,68,68,0.12)'  : 'rgba(239,68,68,0.10)',  color: isDark ? '#f87171' : '#dc2626' },
                    'in-progress': { bg: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.10)', color: isDark ? '#fbbf24' : '#d97706' },
                  };
                  const sc = statusColors[itemStatus as keyof typeof statusColors] ?? statusColors.complete;
                  const statusLabel = itemStatus === 'in-progress' ? 'In Progress' : itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1);
                  const snippet = SNIPPETS[item.id] ?? '';
                  return (
                  <div
                    key={item.id}
                    className="flex items-center px-4 cursor-pointer transition-colors relative"
                    style={{ borderBottom: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff', minHeight: 52 }}
                    onClick={() => setSinglesSlideId(item.id)}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 relative mr-3" style={{ minHeight: 40 }}>
                      <ImageWithFallback src={(item as Transcript).thumbnail ?? ''} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    {/* Content */}
                    <div style={{ width: 220 }} className="flex-shrink-0 py-2.5 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {(item as Transcript).avatar && (
                          <div className="relative flex-shrink-0">
                            <img src={(item as Transcript).avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                            {VERIFIED_CREATORS.has((item as Transcript).source) && (
                              <span className="absolute flex items-center justify-center rounded-full"
                                style={{ bottom: -1, right: -1, width: 7, height: 7, background: '#1d9bf0', border: '1px solid #fff' }}>
                                <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] truncate" style={{ color: muted }}>{(item as Transcript).source}</span>
                      </div>
                      <p className="truncate text-[12px]" style={{ color: text, fontWeight: 500 }}>{item.title}</p>
                    </div>
                    {/* Transcript snippet */}
                    <div className="flex-1 min-w-0 py-2.5 mr-4">
                      {itemStatus === 'failed' ? (
                        <span className="text-[11px]" style={{ color: isDark ? '#f87171' : '#dc2626' }}>Failed to process</span>
                      ) : (
                        <p className="text-[11px] leading-relaxed" style={{ color: muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                          {snippet || '—'}
                        </p>
                      )}
                    </div>
                    {/* Date */}
                    <div style={{ width: 80 }} className="flex-shrink-0 text-right mr-4 py-2.5">
                      <p className="text-[11px]" style={{ color: text }}>{item.date}</p>
                    </div>
                    {/* Duration */}
                    <div style={{ width: 60 }} className="flex-shrink-0 text-center mr-4 py-2.5">
                      <span className="text-[11px]" style={{ color: muted }}>{formatDuration(item.duration)}</span>
                    </div>
                    {/* Status pill */}
                    <div style={{ width: 80 }} className="flex-shrink-0 text-center mr-2 py-2.5">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: sc.bg, color: sc.color }}>
                        {statusLabel}
                      </span>
                    </div>
                    {/* Three-dot menu */}
                    <div style={{ width: 32 }} className="flex-shrink-0 flex items-center justify-center py-2.5">
                      <button
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: openMenuId === item.id ? text : muted, background: openMenuId === item.id ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : 'transparent' }}
                        onClick={e => {
                          e.stopPropagation();
                          if (openMenuId === item.id) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }
                          else { const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect(); setOpenMenuId(item.id); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setMoveSubMenuOpen(false); }
                        }}
                        title="More options"
                        onMouseEnter={ev => { if (openMenuId !== item.id) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { if (openMenuId !== item.id) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Backdrop */}
                    {openMenuId === item.id && (
                      <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }} />
                    )}
                    {/* Dropdown portal */}
                    {openMenuId === item.id && menuPos && (() => {
                      const isFav = favouritedIds.has(item.id);
                      const slMenuItems: { icon: React.ReactNode; label: string; destructive?: boolean; separator?: boolean; keepOpen?: boolean; action: () => void }[] = [
                        { icon: <Copy className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Copy Transcript', action: () => { const t = customTitles[item.id] || item.title; navigator.clipboard.writeText(`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`).then(() => showToast('Transcript copied to clipboard')).catch(() => showToast('Could not access clipboard')); } },
                        { icon: <Download className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Download', action: () => { const t = customTitles[item.id] || item.title; const blob = new Blob([`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${t.replace(/[^a-z0-9]/gi, '_')}.txt`; a.click(); URL.revokeObjectURL(url); showToast('Transcript downloaded'); } },
                        { icon: <Link2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Share Link', action: () => { navigator.clipboard.writeText(`https://app.tokscript.com/results/${item.id}`).then(() => showToast('Share link copied to clipboard')).catch(() => showToast('Could not access clipboard')); } },
                        { icon: <Heart className="w-3.5 h-3.5 flex-shrink-0" style={isFav ? { fill: 'currentColor' } : {}} />, label: isFav ? 'Remove from Favourites' : 'Favourite', action: () => { setFavouritedIds(prev => { const s = new Set(prev); s.has(item.id) ? s.delete(item.id) : s.add(item.id); return s; }); showToast(isFav ? 'Removed from Favourites' : 'Added to Favourites'); } },
                        { icon: <FolderInput className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Move to Folder', keepOpen: true, action: () => { setMoveSubMenuOpen(true); } },
                        { icon: <Pencil className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Edit Transcript', action: () => { setEditingItem({ id: item.id, title: customTitles[item.id] || item.title }); } },
                        { icon: <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Reprocess', action: () => { showToast('Reprocessing transcript…'); } },
                        { icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Delete', destructive: true, separator: true, action: () => { setDeletedIds(prev => new Set([...prev, item.id])); setSelectedTranscriptId(prev => prev === item.id ? null : prev); showToast('Transcript deleted'); } },
                      ];
                      return (
                        <div key="singles-list-ctx" className="fixed z-50 rounded-xl shadow-xl py-1" style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}`, minWidth: 204, top: menuPos.top, right: menuPos.right }} onClick={e => e.stopPropagation()}>
                          {moveSubMenuOpen ? (
                            <>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs" style={{ color: muted, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); setMoveSubMenuOpen(false); }}>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ transform: 'rotate(180deg)' }} /> Back
                              </button>
                              <div style={{ height: 1, background: border, margin: '2px 0' }} />
                              <p className="px-3 pt-2 pb-1 text-[10px] uppercase" style={{ color: muted, letterSpacing: '0.08em' }}>Choose folder</p>
                              {folders.map(f => (
                                <button key={f.id} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left" style={{ color: text, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); const title = customTitles[item.id] || item.title; setFolders(prev => prev.map(folder => folder.id === f.id ? { ...folder, count: folder.count + 1, videos: [...folder.videos, { id: item.id, title, duration: item.duration, date: (item as Transcript).date || '' }] } : folder)); showToast(`Moved to "${f.name}"`); setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }}>
                                  <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />{f.name}
                                </button>
                              ))}
                            </>
                          ) : (
                            slMenuItems.flatMap(opt => [
                              opt.separator ? <div key={`sep-${opt.label}`} style={{ height: 1, background: border, margin: '4px 0' }} /> : null,
                              <button key={opt.label} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left" style={{ color: opt.destructive ? '#d95656' : text, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); opt.action(); if (!opt.keepOpen) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); } }}>
                                {opt.icon}{opt.label}
                                {opt.label === 'Move to Folder' && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: muted }} />}
                              </button>,
                            ])
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  );
                })}
              </div>
            ) : (
              /* grid */
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                {(items as Transcript[]).map((item) => {
                  return (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all relative"
                    style={{
                      border: singlesSelectedIds.has(item.id) ? '2px solid #00b8b2' : `1px solid ${border}`,
                      background: singlesSelectedIds.has(item.id)
                        ? (isDark ? 'rgba(0,184,178,0.05)' : 'rgba(0,184,178,0.03)')
                        : (isDark ? '#141414' : '#ffffff'),
                    }}
                    onClick={() => { setSinglesSlideId(item.id); }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = singlesSelectedIds.has(item.id) ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.06)') : hoverBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = singlesSelectedIds.has(item.id) ? (isDark ? 'rgba(0,184,178,0.05)' : 'rgba(0,184,178,0.03)') : (isDark ? '#141414' : '#ffffff'); }}
                  >
                    <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback src={(item as Transcript).thumbnail ?? ''} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white opacity-80" />
                      </div>
                      <div
                          className="absolute top-2 left-2 flex items-center justify-center"
                          style={{ width: 28, height: 28 }}
                          onClick={e => { e.stopPropagation(); toggleSinglesSelect(item.id); }}
                        >
                          <div
                            style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: singlesSelectedIds.has(item.id) ? '#00b8b2' : 'rgba(0,0,0,0.4)',
                              border: singlesSelectedIds.has(item.id) ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {singlesSelectedIds.has(item.id) && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                        <VideoPlatformBadge platform={(item as Transcript).platform} />
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>{formatDuration(item.duration)}</span>
                      </div>
                      {/* ── Action overlays ── */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{
                            background: favouritedIds.has(item.id) ? 'rgba(239,68,68,0.25)' : 'rgba(0,0,0,0.45)',
                            color: favouritedIds.has(item.id) ? '#ef4444' : '#ffffff',
                            border: `1px solid ${favouritedIds.has(item.id) ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)'}`,
                            backdropFilter: 'blur(8px)',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setFavouritedIds(prev => {
                              const next = new Set(prev);
                              next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                              return next;
                            });
                          }}
                          title={favouritedIds.has(item.id) ? 'Remove from favourites' : 'Add to favourites'}
                        >
                          <Heart className="w-3.5 h-3.5" style={{ fill: favouritedIds.has(item.id) ? '#ef4444' : 'none' }} />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{
                            background: 'rgba(0,0,0,0.45)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setFolderModalFor({ id: item.id, rect: e.currentTarget.getBoundingClientRect(), title: item.title });
                          }}
                          title="Save to folder"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        {(item as Transcript).avatar && (
                          <div className="relative flex-shrink-0">
                            <img src={(item as Transcript).avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            {VERIFIED_CREATORS.has((item as Transcript).source) && (
                              <span className="absolute flex items-center justify-center rounded-full"
                                style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                                <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-[10px]" style={{ color: muted }}>{(item as Transcript).source}</span>
                      </div>
                      <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{item.title}</p>
                      <p className="text-[10px]" style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                        {SNIPPETS[item.id] ?? ''}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <span className="text-[10px]" style={{ color: muted }}>{item.date}</span>
                        <div className="flex items-center gap-1">
                          {/* Copy */}
                          <button
                            className="p-1 rounded-md transition-colors"
                            style={{ color: copiedCardId === item.id ? '#00b8b2' : muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
                            onClick={e => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(SNIPPETS[item.id] ?? item.title).catch(() => {});
                              setCopiedCardId(item.id);
                              setTimeout(() => setCopiedCardId(null), 2000);
                            }}
                            title="Copy snippet"
                          >
                            {copiedCardId === item.id ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                          {/* More */}
                          <button
                            className="p-1 rounded-md transition-colors"
                            style={{
                              color: openMenuId === item.id ? text : muted,
                              background: openMenuId === item.id ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                              border: `1px solid ${border}`,
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              if (openMenuId === item.id) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }
                              else { const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect(); setOpenMenuId(item.id); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setMoveSubMenuOpen(false); }
                            }}
                            title="More options"
                          >
                            <MoreHorizontal className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Backdrop */}
                    {openMenuId === item.id && (
                      <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }} />
                    )}
                    {/* Dropdown portal */}
                    {openMenuId === item.id && menuPos && (() => {
                      const isFav = favouritedIds.has(item.id);
                      const gMenuItems: { icon: React.ReactNode; label: string; destructive?: boolean; separator?: boolean; keepOpen?: boolean; action: () => void }[] = [
                        { icon: <Copy className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Copy Transcript', action: () => { const t = customTitles[item.id] || item.title; navigator.clipboard.writeText(`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`).then(() => showToast('Transcript copied to clipboard')).catch(() => showToast('Could not access clipboard')); } },
                        { icon: <Download className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Download', action: () => { const t = customTitles[item.id] || item.title; const blob = new Blob([`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${t.replace(/[^a-z0-9]/gi, '_')}.txt`; a.click(); URL.revokeObjectURL(url); showToast('Transcript downloaded'); } },
                        { icon: <Link2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Share Link', action: () => { navigator.clipboard.writeText(`https://app.tokscript.com/results/${item.id}`).then(() => showToast('Share link copied to clipboard')).catch(() => showToast('Could not access clipboard')); } },
                        { icon: <Heart className="w-3.5 h-3.5 flex-shrink-0" style={isFav ? { fill: 'currentColor' } : {}} />, label: isFav ? 'Remove from Favourites' : 'Favourite', action: () => { setFavouritedIds(prev => { const s = new Set(prev); s.has(item.id) ? s.delete(item.id) : s.add(item.id); return s; }); showToast(isFav ? 'Removed from Favourites' : 'Added to Favourites'); } },
                        { icon: <FolderInput className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Move to Folder', keepOpen: true, action: () => { setMoveSubMenuOpen(true); } },
                        { icon: <Pencil className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Edit Transcript', action: () => { setEditingItem({ id: item.id, title: customTitles[item.id] || item.title }); } },
                        { icon: <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Reprocess', action: () => { showToast('Reprocessing transcript…'); } },
                        { icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Delete', destructive: true, separator: true, action: () => { setDeletedIds(prev => new Set([...prev, item.id])); setSelectedTranscriptId(prev => prev === item.id ? null : prev); showToast('Transcript deleted'); } },
                      ];
                      return (
                        <div key="grid-ctx" className="fixed z-50 rounded-xl shadow-xl py-1" style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}`, minWidth: 204, top: menuPos.top, right: menuPos.right }} onClick={e => e.stopPropagation()}>
                          {moveSubMenuOpen ? (
                            <>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs" style={{ color: muted, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); setMoveSubMenuOpen(false); }}>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ transform: 'rotate(180deg)' }} /> Back
                              </button>
                              <div style={{ height: 1, background: border, margin: '2px 0' }} />
                              <p className="px-3 pt-2 pb-1 text-[10px] uppercase" style={{ color: muted, letterSpacing: '0.08em' }}>Choose folder</p>
                              {folders.map(f => (
                                <button key={f.id} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left" style={{ color: text, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); const title = customTitles[item.id] || item.title; setFolders(prev => prev.map(folder => folder.id === f.id ? { ...folder, count: folder.count + 1, videos: [...folder.videos, { id: item.id, title, duration: item.duration, date: (item as Transcript).date || '' }] } : folder)); showToast(`Moved to "${f.name}"`); setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }}>
                                  <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />{f.name}
                                </button>
                              ))}
                            </>
                          ) : (
                            gMenuItems.flatMap(opt => [
                              opt.separator ? <div key={`sep-${opt.label}`} style={{ height: 1, background: border, margin: '4px 0' }} /> : null,
                              <button key={opt.label} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left" style={{ color: opt.destructive ? '#d95656' : text, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); opt.action(); if (!opt.keepOpen) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); } }}>
                                {opt.icon}{opt.label}
                                {opt.label === 'Move to Folder' && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: muted }} />}
                              </button>,
                            ])
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>
          )} {/* end hybrid / list / grid conditional */}

          {/* Save to Folder modal for singles grid */}
          {folderModalFor && (
            <SaveToFolderModal
              type="transcript"
              refId={folderModalFor.id}
              name={folderModalFor.title}
              triggerRect={folderModalFor.rect}
              onClose={() => setFolderModalFor(null)}
            />
          )}

          {/* Slide-over panel — only in grid / list mode */}
          {singlesSlideId !== null && singlesViewMode !== 'hybrid' && (() => {
            const si = (SINGLES.find(s => s.id === singlesSlideId) ?? SINGLES[0]) as Transcript;
            const svid = transcriptToDetailVideo(si);
            const panelBg = isDark ? '#141414' : '#ffffff';
            const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
            return (
              <>
                <div className="fixed inset-0 z-40" style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }} onClick={() => setSinglesSlideId(null)} />
                <div
                  className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
                  style={{ width: 860, background: panelBg, borderLeft: `1px solid ${border}`, boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)', animation: 'singlesSlideIn 0.22s cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <TranscriptDetailPanel
                    video={svid}
                    transcript={IV_TRANSCRIPT}
                    related={IV_RELATED}
                    downloadFormats={DOWNLOAD_FORMATS}
                    isDark={isDark}
                    bg={panelBg}
                    border={border}
                    text={text}
                    muted={muted}
                    hoverBg={hoverBg}
                    cardBg={innerCardBg}
                    onBack={() => setSinglesSlideId(null)}
                    onViewCreator={creator => goToCreator(creator)}
                    plan={plan}
                    onUpgrade={openUpgrade}
                  />
                </div>
                <style>{`@keyframes singlesSlideIn { from { transform: translateX(100%); opacity:0.5; } to { transform: translateX(0); opacity:1; } }`}</style>
              </>
            );
          })()}
        </div>
        ) : (
        /* ══════════════════════════════════════════════════════════════
           COLLECTIONS / BULK FULL-PAGE VIEW  (list / grid mode)
        ══════════════════════════════════════════════════════════════ */
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="max-w-[1280px] mx-auto w-full px-6 pt-5 pb-4">
              <div className="flex items-center gap-2">
                {view.groupId && (
                  <button
                    onClick={() => { setView({ category: view.category }); setSelectedTranscriptId(null); setGroupSlideId(null); }}
                    className="p-1 rounded-lg transition-colors flex-shrink-0"
                    style={{ color: muted }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h1 style={{ color: text, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  {view.groupId && activeGroup ? activeGroup.name : view.category === 'collections' ? 'Collections' : 'Bulk Transcripts'}
                </h1>
              </div>
              <p className="mt-1 text-xs" style={{ color: muted, lineHeight: 1.6 }}>
                {view.groupId && activeGroup
                  ? `${activeGroup.count} transcript${activeGroup.count !== 1 ? 's' : ''} in this ${view.category === 'collections' ? 'collection' : 'batch'}`
                  : view.category === 'collections' ? 'Your organised transcript collections' : 'Batch-processed transcript sets'}
              </p>
            </div>
          </div>

          {/* ── Unified Filter Bar ───────────────────────────────────────── */}
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="max-w-[1280px] mx-auto w-full flex items-center gap-2 px-6 py-3">

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}`, color: muted, width: 220 }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <input
                value={collectionSearchQuery}
                onChange={e => setCollectionSearchQuery(e.target.value)}
                placeholder={isGroups ? `Search ${view.category === 'collections' ? 'collections' : 'batches'}…` : 'Search videos…'}
                className="flex-1 bg-transparent outline-none text-xs min-w-0"
                style={{ color: text }}
              />
              {collectionSearchQuery && <button onClick={() => setCollectionSearchQuery('')} style={{ color: muted }}><X className="w-3 h-3" /></button>}
            </div>

            <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

            {/* Date chip — only on collections list */}
            {isGroups && (
              <div className="relative flex-shrink-0">
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: colActiveDateRanges.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                    color: colActiveDateRanges.length > 0 ? '#00b8b2' : muted,
                    border: `1px solid ${colActiveDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    fontWeight: colActiveDateRanges.length > 0 ? 500 : 400,
                  }}
                  onClick={() => setOpenColDropdown(openColDropdown === 'date' ? null : 'date')}
                >
                  <Calendar className="w-3 h-3" />
                  {colActiveDateRanges.length === 0 ? 'Date' : colActiveDateRanges.length === 1 ? colActiveDateRanges[0] : `${colActiveDateRanges.length} selected`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openColDropdown === 'date' ? 'rotate-180' : ''}`} />
                </button>
                {openColDropdown === 'date' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenColDropdown(null)} />
                    <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                      {['Today', 'This week', 'This month'].map(opt => {
                        const sel = colActiveDateRanges.includes(opt);
                        return (
                          <button key={opt}
                            onClick={e => { e.stopPropagation(); setColActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                            style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                            onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Duration, Words, Date — only inside a group */}
            {!isGroups && (
              <>
                {/* Platform tabs — inside group detail */}
                {(['All', 'TikTok', 'Instagram', 'YouTube'] as const).map(tab => {
                  const isActive = groupActivePlatform === tab;
                  const tabIcons: Record<string, JSX.Element | null> = {
                    All: null,
                    TikTok: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>,
                    Instagram: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                    YouTube: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
                  };
                  return (
                    <button key={tab}
                      onClick={() => setGroupActivePlatform(tab)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 transition-all"
                      style={{
                        background: isActive ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)') : 'transparent',
                        color: isActive ? text : muted,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {tabIcons[tab]}
                      {tab}
                    </button>
                  );
                })}

                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

                <div className="flex-1" />

                {/* Duration multi-select */}
                <div className="relative flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: groupActiveDurations.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                      color: groupActiveDurations.length > 0 ? '#00b8b2' : muted,
                      border: `1px solid ${groupActiveDurations.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    }}
                    onClick={() => setOpenColDropdown(openColDropdown === 'duration' ? null : 'duration')}
                  >
                    <Clock className="w-3 h-3" />
                    {groupActiveDurations.length === 0 ? 'Duration' : groupActiveDurations.length === 1 ? groupActiveDurations[0] : `${groupActiveDurations.length} selected`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openColDropdown === 'duration' ? 'rotate-180' : ''}`} />
                  </button>
                  {openColDropdown === 'duration' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenColDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                        {['<1 min', '1–3 min', '3+ min'].map(opt => {
                          const sel = groupActiveDurations.includes(opt);
                          return (
                            <button key={opt} onClick={e => { e.stopPropagation(); setGroupActiveDurations(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs"
                              style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                              onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Words multi-select */}
                <div className="relative flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: groupActiveWords.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                      color: groupActiveWords.length > 0 ? '#00b8b2' : muted,
                      border: `1px solid ${groupActiveWords.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                    }}
                    onClick={() => setOpenColDropdown(openColDropdown === 'words' ? null : 'words')}
                  >
                    <FileText className="w-3 h-3" />
                    {groupActiveWords.length === 0 ? 'Words' : groupActiveWords.length === 1 ? groupActiveWords[0] : `${groupActiveWords.length} selected`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openColDropdown === 'words' ? 'rotate-180' : ''}`} />
                  </button>
                  {openColDropdown === 'words' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenColDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}>
                        {['<1K', '1K–5K', '5K+'].map(opt => {
                          const sel = groupActiveWords.includes(opt);
                          return (
                            <button key={opt} onClick={e => { e.stopPropagation(); setGroupActiveWords(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs"
                              style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                              onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >{opt}{sel && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Date multi-select */}
                <div className="relative flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: groupActiveDateRanges.length > 0 ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                      color: groupActiveDateRanges.length > 0 ? '#00b8b2' : muted,
                      border: `1px solid ${groupActiveDateRanges.length > 0 ? 'rgba(0,184,178,0.25)' : border}`,
                      fontWeight: groupActiveDateRanges.length > 0 ? 500 : 400,
                    }}
                    onClick={() => setOpenColDropdown(openColDropdown === 'group-date' ? null : 'group-date')}
                  >
                    <Calendar className="w-3 h-3" />
                    {groupActiveDateRanges.length === 0 ? 'Date' : groupActiveDateRanges.length === 1 ? groupActiveDateRanges[0] : `${groupActiveDateRanges.length} selected`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openColDropdown === 'group-date' ? 'rotate-180' : ''}`} />
                  </button>
                  {openColDropdown === 'group-date' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenColDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 140 }}>
                        {['Today', 'This week', 'This month'].map(opt => {
                          const sel = groupActiveDateRanges.includes(opt);
                          return (
                            <button key={opt}
                              onClick={e => { e.stopPropagation(); setGroupActiveDateRanges(prev => sel ? prev.filter(v => v !== opt) : [...prev, opt]); }}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors"
                              style={{ color: sel ? '#00b8b2' : muted, background: sel ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sel ? 500 : 400 }}
                              onMouseEnter={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={ev => { if (!sel) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >{opt}{sel && <CheckCheck className="w-3 h-3 flex-shrink-0" style={{ color: '#00b8b2' }} />}</button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Platform tabs — on collections list */}
            {isGroups && (
              <>
                {(['All', 'TikTok', 'Instagram', 'YouTube'] as const).map(tab => {
                  const isActive = colActivePlatform === tab;
                  const tabIcons: Record<string, JSX.Element | null> = {
                    All: null,
                    TikTok: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>,
                    Instagram: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                    YouTube: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
                  };
                  return (
                    <button key={tab}
                      onClick={() => setColActivePlatform(tab)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 transition-all"
                      style={{
                        background: isActive ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)') : 'transparent',
                        color: isActive ? text : muted,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {tabIcons[tab]}
                      {tab}
                    </button>
                  );
                })}
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
              </>
            )}

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: colSortBy !== 'date-desc' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                  color: colSortBy !== 'date-desc' ? '#00b8b2' : muted,
                  border: `1px solid ${colSortBy !== 'date-desc' ? 'rgba(0,184,178,0.25)' : border}`,
                }}
                onClick={() => setOpenColDropdown(openColDropdown === 'sort' ? null : 'sort')}
              >
                <SlidersHorizontal className="w-3 h-3" />
                {SORT_OPTIONS.find(o => o.value === colSortBy)?.label ?? 'Newest first'}
                <ChevronDown className={`w-3 h-3 transition-transform ${openColDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              {openColDropdown === 'sort' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenColDropdown(null)} />
                  <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl py-1 z-50" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 156 }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setColSortBy(opt.value); setOpenColDropdown(null); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left"
                        style={{ color: colSortBy === opt.value ? '#00b8b2' : muted, background: colSortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: colSortBy === opt.value ? 500 : 400 }}
                        onMouseEnter={e => { if (colSortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={e => { if (colSortBy !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{opt.label}{colSortBy === opt.value && <CheckCheck className="w-3 h-3" style={{ color: '#00b8b2' }} />}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {(collectionSearchQuery || colSortBy !== 'date-desc' || colActiveDateRanges.length > 0 || colActivePlatform !== 'All' || groupActiveDurations.length > 0 || groupActiveWords.length > 0 || groupActiveDateRanges.length > 0 || groupActivePlatform !== 'All') && (
              <>
                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                <button className="flex items-center gap-1 text-xs hover:opacity-70 flex-shrink-0" style={{ color: '#00b8b2', fontWeight: 500 }}
                  onClick={() => { setCollectionSearchQuery(''); setColSortBy('date-desc'); setColActiveDateRanges([]); setColActivePlatform('All'); setGroupActivePlatform('All'); setGroupActiveDurations([]); setGroupActiveWords([]); setGroupActiveDateRanges([]); }}>
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}


            <div className="flex-1" />

            {/* View toggle — only shown inside a specific group */}
            {!isGroups && (
              <div className="flex items-center p-0.5 rounded-lg flex-shrink-0"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}>
                {([
                  { mode: 'grid'   as const, icon: <LayoutGrid className="w-3.5 h-3.5" />, title: 'Grid view'   },
                  { mode: 'list'   as const, icon: <List       className="w-3.5 h-3.5" />, title: 'List view'   },
                  { mode: 'hybrid' as const, icon: <Columns2   className="w-3.5 h-3.5" />, title: 'Hybrid view' },
                ] as const).map(({ mode, icon, title }) => (
                  <button key={mode} title={title} onClick={() => setGroupViewMode(mode)}
                    className="p-1.5 rounded-md transition-all"
                    style={{
                      background: groupViewMode === mode ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                      color: groupViewMode === mode ? text : muted,
                      boxShadow: groupViewMode === mode ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >{icon}</button>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* Content */}
          {groupViewMode === 'hybrid' && !isGroups ? (
            /* ── Hybrid: left compact list + right detail panel ── */
            <div className="flex-1 overflow-hidden">
            <div className="flex max-w-[1280px] mx-auto w-full h-full min-h-0 overflow-hidden px-6 py-5">
              {/* Left: compact scrollable list */}
              <div className="flex-shrink-0 flex flex-col" style={{ width: 240, borderRight: `1px solid ${border}` }}>
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: `${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} transparent` }}
                >
                  {items.length > 0 ? (
                    <div className="flex flex-col gap-0.5 p-2">
                      {(items as VideoItem[]).map(item => {
                        const thumb = item.thumbnail ?? `https://picsum.photos/seed/${item.id}/80/140`;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                            style={{
                              background: groupSlideId === item.id
                                ? (isDark ? 'rgba(255,255,255,0.07)' : '#f0eeeb')
                                : 'transparent',
                              border: `1px solid ${groupSlideId === item.id ? border : 'transparent'}`,
                              transition: 'background 0.1s',
                            }}
                            onClick={() => setGroupSlideId(item.id)}
                            onMouseEnter={ev => { if (groupSlideId !== item.id) (ev.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (groupSlideId !== item.id) (ev.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                          >
                            <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 30, aspectRatio: '9/16' }}>
                              <ImageWithFallback src={thumb} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <p
                                className="text-[11px] leading-snug"
                                style={{ color: text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'block' }}
                              >{item.title}</p>
                              {item.source && (
                                <div className="flex items-center gap-1">
                                  {item.avatar && (
                                    <div className="relative flex-shrink-0">
                                      <img src={item.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                                      {VERIFIED_CREATORS.has(item.source) && (
                                        <span className="absolute flex items-center justify-center rounded-full"
                                          style={{ bottom: -1, right: -1, width: 7, height: 7, background: '#1d9bf0', border: '1px solid #fff' }}>
                                          <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                                            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <p className="text-[10px] truncate" style={{ color: muted }}>{item.source}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5 flex-shrink-0" style={{ color: muted }} />
                                <span className="text-[9px]" style={{ color: muted }}>{item.date}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-2 px-4">
                      <Film className="w-6 h-6" style={{ color: muted }} />
                      <p className="text-xs text-center" style={{ color: muted }}>No transcripts in this group</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: detail panel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {groupSlideId !== null ? (() => {
                  const allGroupVids: VideoItem[] = [
                    ...COLLECTIONS.flatMap(g => g.videos),
                    ...BULK.flatMap(g => g.videos),
                  ];
                  const gv = allGroupVids.find(v => v.id === groupSlideId) ?? allGroupVids[0];
                  const gvid: TranscriptDetailVideo = {
                    title:       gv.title,
                    creator:     gv.source ?? 'Unknown',
                    platform:    'YouTube',
                    likes:       '42K',
                    duration:    gv.duration,
                    language:    'EN',
                    date:        gv.date,
                    wordCount:   3500,
                    charCount:   17850,
                    sentences:   269,
                    readability: 'Grade 4',
                    thumbnail:   gv.thumbnail ?? `https://picsum.photos/seed/${gv.id}/800/450`,
                    avatar:      IV_VIDEO.avatar,
                  };
                  const panelBg = isDark ? '#141414' : '#ffffff';
                  const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
                  return (
                    <TranscriptDetailPanel
                      video={gvid}
                      transcript={IV_TRANSCRIPT}
                      related={IV_RELATED}
                      downloadFormats={DOWNLOAD_FORMATS}
                      isDark={isDark}
                      bg={panelBg}
                      border={border}
                      text={text}
                      muted={muted}
                      hoverBg={hoverBg}
                      cardBg={innerCardBg}
                      onBack={() => setGroupSlideId(null)}
                      onViewCreator={creator => goToCreator(creator)}
                      plan={plan}
                      onUpgrade={openUpgrade}
                    />
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6', border: `1px solid ${border}` }}>
                      <FileText className="w-5 h-5" style={{ color: muted }} />
                    </div>
                    <p className="text-sm" style={{ color: muted }}>Select a transcript to view</p>
                  </div>
                )}
              </div>
            </div>
            </div>
          ) : (
          <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto w-full px-6 py-5">
            {/* Stat cards — top-level collections/bulk overview */}
            {isGroups && (view.category === 'collections' || view.category === 'bulk') && (() => {
              const groups = items as GroupItem[];
              const allVids = groups.flatMap(g => g.videos);
              const totalGroups = groups.length;
              const totalVids   = groups.reduce((s, g) => s + g.count, 0);
              const totalSecs   = allVids.reduce((s, v) => s + parseDuration(v.duration), 0);
              const creators    = new Set(allVids.map(v => v.source).filter(Boolean)).size;
              const totalViews  = allVids.reduce((s, v) => s + (v.views ? parseViews(v.views) : 0), 0);
              const catLabel    = view.category === 'collections' ? 'Collections' : 'Batches';
              const vidLabel    = view.category === 'collections' ? 'collection' : 'batch';
              const stats = [
                { icon: <Layers   className="w-3.5 h-3.5" />, label: catLabel,        value: totalGroups,           sub: `total ${vidLabel}s` },
                { icon: <Film     className="w-3.5 h-3.5" />, label: 'Total Videos',  value: totalVids,             sub: `avg ${Math.round(totalVids / (totalGroups || 1))} per ${vidLabel}` },
                { icon: <Clock    className="w-3.5 h-3.5" />, label: 'Total Runtime', value: fmtRuntime(totalSecs), sub: 'combined duration' },
                { icon: <Users    className="w-3.5 h-3.5" />, label: 'Creators',      value: creators,              sub: 'unique sources' },
                { icon: <Eye      className="w-3.5 h-3.5" />, label: 'Total Views',   value: fmtViews(totalViews),  sub: 'across all videos' },
              ];
              return (
                <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {stats.map(s => (
                    <div key={s.label} className="flex flex-col px-4 pt-3 pb-3 rounded-xl"
                      style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                        {s.icon}
                        <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{s.label}</span>
                      </div>
                      <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</p>
                      <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
            {/* Stat cards — inside a specific group */}
            {!isGroups && view.groupId && (
              <GroupStatCards
                videos={items as VideoItem[]}
                isDark={isDark}
                border={border}
                text={text}
                muted={muted}
              />
            )}
            {isGroups && (
              <div style={{ borderTop: `1px solid ${border}`, opacity: 0.5, marginTop: 26, marginBottom: 26 }} />
            )}
            {/* Selection bar */}
            {(view.category === 'collections' || view.category === 'bulk') && view.groupId != null && groupSelectedIds.size > 0 && (
              <SelectionBar
                selectedCount={groupSelectedIds.size}
                isDark={isDark}
                accentColor={view.category === 'collections' ? '#8b5cf6' : '#00b8b2'}
                onDeselect={() => { setGroupSelectedIds(new Set()); }}
                onSelectPage={() => {
                  const allIds = new Set(items.map((v: any) => v.id));
                  setGroupSelectedIds(allIds);
                }}
                totalPageCount={items.length}
                onDownloadVideos={() => { simulateZipDownload(Array.from(groupSelectedIds).map(String), 'selected-videos'); }}
                onDownloadCovers={() => { simulateZipDownload(Array.from(groupSelectedIds).map(String), 'selected-covers'); }}
                onDownloadTranscripts={() => { simulateZipDownload(Array.from(groupSelectedIds).map(String), 'selected-transcripts'); }}
                onDownloadData={() => { simulateZipDownload(Array.from(groupSelectedIds).map(String), 'selected-data'); }}
                onDownloadAll={() => { simulateZipDownload(Array.from(groupSelectedIds).map(String), 'selected-all'); }}
              />
            )}
            {isGroups ? (
              /* Group folder tiles */
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {/* CTA card — first item */}
                <div
                  className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                  style={{
                    border: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
                    background: isDark ? '#141414' : '#ffffff',
                  }}
                  onClick={() => {
                    if (plan === 'free') {
                      const existing = view.category === 'collections' ? COLLECTIONS.length : BULK.length;
                      if (existing >= 1) { openUpgrade(); return; }
                    }
                    openNewTranscript();
                    setSelectedTranscriptId(null);
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#1a1a1a' : '#f5f5f5'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
                >
                  {/* Illustration area */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ height: 120, background: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9' }}
                  >
                    <div className="relative" style={{ width: 61, height: 61 }}>
                      <div className="absolute" style={{ inset: '18.31% 6.06% 2.18% 8%' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.4265 48.501">
                          <path d={svgNewCta.p3e3aac00} fill={isDark ? '#333' : '#C6C6C6'} />
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '1.78% 11.19% 27.05% 13.13%' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.1608 43.417">
                          <path d={svgNewCta.p19cf2500} fill={isDark ? '#2a2a2a' : '#F9F9F9'} />
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '1.78% 11.8% 27.66% 13.13%' }}>
                        <div className="absolute" style={{ inset: '0 1.88% 2.01% 0' }}>
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.9267 42.183">
                            <path d={svgNewCta.p39cffb80} fill={isDark ? 'rgba(255,255,255,0.04)' : 'url(#ctaGrad1)'} />
                            <defs>
                              <linearGradient gradientUnits="userSpaceOnUse" id="ctaGrad1" x1="24.5" x2="-6.1175" y1="23.1255" y2="-7.49225">
                                <stop stopColor="white" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div
                        className="absolute flex items-center justify-center rounded-[9px]"
                        style={{
                          inset: '12.21% 27.97% 45.69% 29.92%',
                          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          border: `0.642px solid ${isDark ? '#444' : '#e5e7eb'}`,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12.8421 12.8421" fill="none">
                          <path d="M2.6778 6.42183H10.169" stroke={isDark ? 'rgba(255,255,255,0.45)' : '#6B7280'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07018" />
                          <path d="M6.42257 2.67706V10.1683" stroke={isDark ? 'rgba(255,255,255,0.45)' : '#6B7280'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07018" />
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '39.08% 55.64% 48.08% 31.53%' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.82775 7.828">
                          <path d="M0 0L7.82775 7.828H0V0Z" fill="url(#ctaFold)" />
                          <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="ctaFold" x1="5.17175" x2="-4.29" y1="9.084" y2="-0.377503">
                              <stop stopColor="#C2CECE" stopOpacity="0" />
                              <stop offset="0.179" stopColor="#AFBCBC" stopOpacity="0.179" />
                              <stop offset="1" stopColor="#5B6A6A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '18.31% 6.06% 47.03% 88.81%' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.13275 21.1437">
                          <path d={svgNewCta.p23535e00} fill={isDark ? '#444' : '#C6C6C6'} />
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '37.36% 0 1.78% 0' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.0002 37.1273">
                          <path d={svgNewCta.p19345310} fill={isDark ? 'url(#ctaTrayDark)' : 'url(#ctaTray)'} />
                          <defs>
                            <linearGradient gradientUnits="userSpaceOnUse" id="ctaTray" x1="30.5" x2="30.5" y1="0" y2="37.1273">
                              <stop stopColor="#EEF0F4" />
                              <stop offset="0.927" stopColor="#E4E4E4" />
                            </linearGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" id="ctaTrayDark" x1="30.5" x2="30.5" y1="0" y2="37.1273">
                              <stop stopColor="#2a2a2a" />
                              <stop offset="0.927" stopColor="#222" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="absolute" style={{ inset: '72.29% 17.59% 19.25% 19.53%' }}>
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.3583 5.16475">
                          <path d={svgNewCta.p1aed67f2} fill={isDark ? '#444' : '#D5D5D5'} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="px-3.5 pt-2.5 pb-3">
                    <p className="text-xs" style={{ color: text, fontWeight: 600 }}>
                      {view.category === 'collections' ? 'Add New Collection' : 'Start a new bulk'}
                    </p>
                    <p className="text-[10px] mt-1 leading-snug" style={{ color: muted }}>
                      {view.category === 'collections'
                        ? 'Download TikTok Collections in 1 click'
                        : 'Process multiple videos together in one batch.'}
                    </p>
                  </div>
                </div>

                {(items as GroupItem[]).map(g => {
                  const thumbs = g.videos.slice(0, 4).map(v => v.thumbnail ?? `https://picsum.photos/seed/${v.id}/400/300`);
                  return (
                    <div
                      key={g.id}
                      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group transition-all"
                      style={{ border: `1px solid ${border}`, background: isDark ? '#111111' : '#fafafa' }}
                      onClick={() => selectGroup(view.category as 'collections' | 'bulk', g.id)}
                    >
                      {/* Ambient bg + fanned portrait thumbs */}
                      <div className="relative flex items-end justify-center overflow-hidden flex-shrink-0" style={{ height: 120 }}>
                        {/* Blurred ambient wash */}
                        {thumbs[0] && (
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url(${thumbs[0]})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'blur(22px) saturate(0.6)',
                              transform: 'scale(1.15)',
                              opacity: isDark ? 0.45 : 0.35,
                            }}
                          />
                        )}
                        <div className="absolute inset-0" style={{ background: isDark ? 'rgba(10,10,10,0.55)' : 'rgba(240,240,240,0.55)' }} />
                        {/* Bottom card-bleed fade */}
                        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${isDark ? '#111111' : '#fafafa'}, transparent)` }} />

                        {/* Three fanned portrait thumbnails */}
                        <div className="relative flex items-end justify-center pb-3" style={{ gap: 6, zIndex: 10 }}>
                          <div
                            className="rounded-xl overflow-hidden flex-shrink-0 shadow-xl"
                            style={{ width: 48, height: 72, transform: 'rotate(-6deg) translateY(6px)', border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, opacity: 0.85 }}
                          >
                            <img src={thumbs[1] ?? thumbs[0] ?? ''} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div
                            className="rounded-xl overflow-hidden flex-shrink-0 shadow-2xl"
                            style={{ width: 56, height: 88, border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}`, zIndex: 2 }}
                          >
                            <img src={thumbs[0] ?? ''} alt={g.name} className="w-full h-full object-cover" />
                          </div>
                          <div
                            className="rounded-xl overflow-hidden flex-shrink-0 shadow-xl"
                            style={{ width: 48, height: 72, transform: 'rotate(6deg) translateY(6px)', border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, opacity: 0.85 }}
                          >
                            <img src={thumbs[2] ?? thumbs[0] ?? ''} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      {/* Info row */}
                      <div className="px-3.5 pt-2.5 pb-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs truncate" style={{ color: text, fontWeight: 600 }}>{g.name}</p>
                          <p className="text-[10px] mt-1" style={{ color: muted }}>{g.count} video{g.count !== 1 ? 's' : ''}</p>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                            color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                            fontWeight: 500,
                          }}
                        >
                          <PlatformIconSVG platform={g.videos[0]?.platform ?? ''} />
                          {g.videos[0]?.platform ?? ''}
                        </span>
                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (
              /* Video cards — identical to singles grid */
              groupViewMode === 'list' ? (
                <div className="flex flex-col" style={{ borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
                  {/* Table header */}
                  <div className="flex items-center px-4 py-2 text-[10px] uppercase tracking-wider flex-shrink-0" style={{ color: muted, borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 48 }} className="mr-3 flex-shrink-0" />
                    <div style={{ width: 220 }} className="flex-shrink-0">Content</div>
                    <div className="flex-1 min-w-0">Transcript</div>
                    <div style={{ width: 80 }} className="text-right mr-4 flex-shrink-0">Date</div>
                    <div style={{ width: 60 }} className="text-center mr-4 flex-shrink-0">Duration</div>
                    <div style={{ width: 80 }} className="text-center mr-2 flex-shrink-0">Status</div>
                    <div style={{ width: 32 }} className="flex-shrink-0" />
                  </div>
                  {(items as VideoItem[]).map(item => {
                    const thumb = item.thumbnail ?? `https://picsum.photos/seed/${item.id}/80/140`;
                    const itemStatus: string = (item as VideoItem & { status?: string }).status || 'complete';
                    const statusColors = {
                      complete:      { bg: isDark ? 'rgba(34,197,94,0.12)'  : 'rgba(34,197,94,0.10)',  color: isDark ? '#4ade80' : '#16a34a' },
                      failed:        { bg: isDark ? 'rgba(239,68,68,0.12)'  : 'rgba(239,68,68,0.10)',  color: isDark ? '#f87171' : '#dc2626' },
                      'in-progress': { bg: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.10)', color: isDark ? '#fbbf24' : '#d97706' },
                    };
                    const sc = statusColors[itemStatus as keyof typeof statusColors] ?? statusColors.complete;
                    const statusLabel = itemStatus === 'in-progress' ? 'In Progress' : itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1);
                    const snippet = SNIPPETS[item.id] ?? '';
                    return (
                      <div
                        key={item.id}
                        className="flex items-center px-4 cursor-pointer transition-colors relative"
                        style={{ borderBottom: `1px solid ${border}`, background: isDark ? '#141414' : '#ffffff', minHeight: 52 }}
                        onClick={() => setGroupSlideId(item.id)}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? '#141414' : '#ffffff'; }}
                      >
                        {/* Thumbnail */}
                        <div className="w-12 aspect-[9/16] rounded-lg overflow-hidden flex-shrink-0 relative mr-3" style={{ minHeight: 40 }}>
                          <ImageWithFallback src={thumb} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                        {/* Content */}
                        <div style={{ width: 220 }} className="flex-shrink-0 py-2.5 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {item.avatar && (
                              <div className="relative flex-shrink-0">
                                <img src={item.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                                {VERIFIED_CREATORS.has(item.source ?? '') && (
                                  <span className="absolute flex items-center justify-center rounded-full"
                                    style={{ bottom: -1, right: -1, width: 7, height: 7, background: '#1d9bf0', border: '1px solid #fff' }}>
                                    <svg width="4" height="4" viewBox="0 0 16 16" fill="none">
                                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                    </svg>
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="text-[10px] truncate" style={{ color: muted }}>{item.source ?? ''}</span>
                          </div>
                          <p className="truncate text-[12px]" style={{ color: text, fontWeight: 500 }}>{item.title}</p>
                        </div>
                        {/* Transcript snippet */}
                        <div className="flex-1 min-w-0 py-2.5 mr-4">
                          {itemStatus === 'failed' ? (
                            <span className="text-[11px]" style={{ color: isDark ? '#f87171' : '#dc2626' }}>Failed to process</span>
                          ) : (
                            <p className="text-[11px] leading-relaxed" style={{ color: muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                              {snippet || '—'}
                            </p>
                          )}
                        </div>
                        {/* Date */}
                        <div style={{ width: 80 }} className="flex-shrink-0 text-right mr-4 py-2.5">
                          <p className="text-[11px]" style={{ color: text }}>{item.date}</p>
                        </div>
                        {/* Duration */}
                        <div style={{ width: 60 }} className="flex-shrink-0 text-center mr-4 py-2.5">
                          <span className="text-[11px]" style={{ color: muted }}>{formatDuration(item.duration)}</span>
                        </div>
                        {/* Status pill */}
                        <div style={{ width: 80 }} className="flex-shrink-0 text-center mr-2 py-2.5">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ background: sc.bg, color: sc.color }}>
                            {statusLabel}
                          </span>
                        </div>
                        {/* Three-dot menu */}
                        <div style={{ width: 32 }} className="flex-shrink-0 flex items-center justify-center py-2.5">
                          <button
                            className="p-1 rounded-lg transition-colors"
                            style={{ color: openMenuId === item.id ? text : muted, background: openMenuId === item.id ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : 'transparent' }}
                            onClick={e => {
                              e.stopPropagation();
                              if (openMenuId === item.id) { setOpenMenuId(null); setMenuPos(null); }
                              else { const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect(); setOpenMenuId(item.id); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); }
                            }}
                            title="More options"
                            onMouseEnter={ev => { if (openMenuId !== item.id) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (openMenuId !== item.id) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Backdrop */}
                        {openMenuId === item.id && (
                          <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenMenuId(null); setMenuPos(null); }} />
                        )}
                        {/* Dropdown portal */}
                        {openMenuId === item.id && menuPos && (() => {
                          const grpMenuItems: { icon: React.ReactNode; label: string; destructive?: boolean; separator?: boolean; action: () => void }[] = [
                            { icon: <Copy className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Copy Transcript', action: () => { const t = customTitles[item.id] || item.title; navigator.clipboard.writeText(`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`).then(() => showToast('Transcript copied to clipboard')).catch(() => showToast('Could not access clipboard')); } },
                            { icon: <Download className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Download', action: () => { const t = customTitles[item.id] || item.title; const blob = new Blob([`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${t.replace(/[^a-z0-9]/gi, '_')}.txt`; a.click(); URL.revokeObjectURL(url); showToast('Transcript downloaded'); } },
                            { icon: <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />, label: 'View Original', action: () => { const url = (item as VideoItem & { url?: string }).url; if (url) window.open(url, '_blank'); else showToast('No original URL available'); } },
                            { icon: <FolderInput className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Move to Folder', action: () => { setFolderModalFor({ id: item.id, rect: { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect, title: item.title }); } },
                            { icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Delete', destructive: true, separator: true, action: () => { setDeletedIds(prev => new Set([...prev, item.id])); showToast('Item deleted'); } },
                          ];
                          return (
                            <div key="group-list-ctx" className="fixed z-50 rounded-xl shadow-xl py-1" style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}`, minWidth: 204, top: menuPos.top, right: menuPos.right }} onClick={e => e.stopPropagation()}>
                              {grpMenuItems.flatMap(opt => [
                                opt.separator ? <div key={`sep-${opt.label}`} style={{ height: 1, background: border, margin: '4px 0' }} /> : null,
                                <button key={opt.label} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left" style={{ color: opt.destructive ? '#d95656' : text, background: 'transparent' }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')} onClick={e => { e.stopPropagation(); opt.action(); setOpenMenuId(null); setMenuPos(null); }}>
                                  {opt.icon}{opt.label}
                                </button>,
                              ])}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                  {(items as VideoItem[]).map(item => {
                    const thumb = item.thumbnail ?? `https://picsum.photos/seed/${item.id}/400/700`;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all"
                        style={{
                          border: groupSelectedIds.has(item.id) ? '2px solid #00b8b2' : `1px solid ${border}`,
                          background: groupSelectedIds.has(item.id)
                            ? (isDark ? 'rgba(0,184,178,0.05)' : 'rgba(0,184,178,0.03)')
                            : (isDark ? '#141414' : '#ffffff'),
                        }}
                        onClick={() => { setGroupSlideId(item.id); }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = groupSelectedIds.has(item.id) ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.06)') : hoverBg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = groupSelectedIds.has(item.id) ? (isDark ? 'rgba(0,184,178,0.05)' : 'rgba(0,184,178,0.03)') : (isDark ? '#141414' : '#ffffff'); }}
                      >
                        <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
                          <ImageWithFallback src={thumb} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white opacity-80" />
                          </div>
                          <div
                              className="absolute top-2 left-2 flex items-center justify-center"
                              style={{ width: 28, height: 28 }}
                              onClick={e => { e.stopPropagation(); toggleGroupSelect(item.id); }}
                            >
                              <div
                                style={{
                                  width: 20, height: 20, borderRadius: '50%',
                                  background: groupSelectedIds.has(item.id) ? '#00b8b2' : 'rgba(0,0,0,0.4)',
                                  border: groupSelectedIds.has(item.id) ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {groupSelectedIds.has(item.id) && (
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                            <VideoPlatformBadge platform={item.platform} />
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>{formatDuration(item.duration)}</span>
                          </div>
                          {/* ── Action overlays ── */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{
                                background: favouritedIds.has(item.id) ? 'rgba(239,68,68,0.25)' : 'rgba(0,0,0,0.45)',
                                color: favouritedIds.has(item.id) ? '#ef4444' : '#ffffff',
                                border: `1px solid ${favouritedIds.has(item.id) ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.15)'}`,
                                backdropFilter: 'blur(8px)',
                              }}
                              onClick={e => {
                                e.stopPropagation();
                                setFavouritedIds(prev => {
                                  const next = new Set(prev);
                                  next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                                  return next;
                                });
                              }}
                              title={favouritedIds.has(item.id) ? 'Remove from favourites' : 'Add to favourites'}
                            >
                              <Heart className="w-3.5 h-3.5" style={{ fill: favouritedIds.has(item.id) ? '#ef4444' : 'none' }} />
                            </button>
                            <button
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{
                                background: 'rgba(0,0,0,0.45)',
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(8px)',
                              }}
                              onClick={e => {
                                e.stopPropagation();
                                setFolderModalFor({ id: item.id, rect: e.currentTarget.getBoundingClientRect(), title: item.title });
                              }}
                              title="Save to folder"
                            >
                              <FolderPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 flex flex-col gap-1.5 flex-1">
                          <div className="flex items-center gap-1.5">
                            {item.avatar && (
                              <div className="relative flex-shrink-0">
                                <img src={item.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                                {VERIFIED_CREATORS.has(item.source ?? '') && (
                                  <span className="absolute flex items-center justify-center rounded-full"
                                    style={{ bottom: -1, right: -1, width: 8, height: 8, background: '#1d9bf0', border: '1px solid #fff' }}>
                                    <svg width="5" height="5" viewBox="0 0 16 16" fill="none">
                                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" fill="#fff"/>
                                    </svg>
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="text-[10px]" style={{ color: muted }}>{item.source ?? ''}</span>
                          </div>
                          <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{item.title}</p>
                          <p className="text-[10px]" style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                            {SNIPPETS[item.id] ?? ''}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <span className="text-[10px]" style={{ color: muted }}>{item.date}</span>
                            <div className="flex items-center gap-1">
                              {/* Copy */}
                              <button
                                className="p-1 rounded-md transition-colors"
                                style={{ color: copiedCardId === item.id ? '#00b8b2' : muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
                                onClick={e => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(SNIPPETS[item.id] ?? item.title).catch(() => {});
                                  setCopiedCardId(item.id);
                                  setTimeout(() => setCopiedCardId(null), 2000);
                                }}
                                title="Copy snippet"
                              >
                                {copiedCardId === item.id ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                              {/* More */}
                              <button
                                className="p-1 rounded-md transition-colors"
                                style={{
                                  color: openMenuId === item.id ? text : muted,
                                  background: openMenuId === item.id ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                                  border: `1px solid ${border}`,
                                }}
                                onClick={e => {
                                  e.stopPropagation();
                                  if (openMenuId === item.id) { setOpenMenuId(null); setMenuPos(null); }
                                  else { const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect(); setOpenMenuId(item.id); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); }
                                }}
                                title="More options"
                              >
                                <MoreHorizontal className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
          </div>
          )} {/* end hybrid / list / grid conditional */}

          {/* Slide-over panel — only in grid / list mode */}
          {groupSlideId !== null && groupViewMode !== 'hybrid' && (() => {
            const allGroupVids: VideoItem[] = [
              ...COLLECTIONS.flatMap(g => g.videos),
              ...BULK.flatMap(g => g.videos),
            ];
            const gv = allGroupVids.find(v => v.id === groupSlideId) ?? allGroupVids[0];
            const gvid: TranscriptDetailVideo = {
              title:       gv.title,
              creator:     gv.source ?? 'Unknown',
              platform:    'YouTube',
              likes:       '42K',
              duration:    gv.duration,
              language:    'EN',
              date:        gv.date,
              wordCount:   3500,
              charCount:   17850,
              sentences:   269,
              readability: 'Grade 4',
              thumbnail:   gv.thumbnail ?? `https://picsum.photos/seed/${gv.id}/800/450`,
              avatar:      IV_VIDEO.avatar,
            };
            const panelBg = isDark ? '#141414' : '#ffffff';
            const innerCardBg = isDark ? '#1a1a1a' : '#f3f4f6';
            return (
              <>
                <div className="fixed inset-0 z-40" style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }} onClick={() => setGroupSlideId(null)} />
                <div
                  className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
                  style={{ width: 860, background: panelBg, borderLeft: `1px solid ${border}`, boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)', animation: 'singlesSlideIn 0.22s cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <TranscriptDetailPanel
                    video={gvid}
                    transcript={IV_TRANSCRIPT}
                    related={IV_RELATED}
                    downloadFormats={DOWNLOAD_FORMATS}
                    isDark={isDark}
                    bg={panelBg}
                    border={border}
                    text={text}
                    muted={muted}
                    hoverBg={hoverBg}
                    cardBg={innerCardBg}
                    onBack={() => setGroupSlideId(null)}
                    onViewCreator={creator => goToCreator(creator)}
                    plan={plan}
                    onUpgrade={openUpgrade}
                  />
                </div>
              </>
            );
          })()}
        </div>
        )
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════════
              LIST PANEL
          ══════════════════════════════════════════════════════════════ */}
          <div
            className="flex flex-col flex-shrink-0 h-full overflow-hidden"
            style={{ width: 256, borderRight: `1px solid ${border}` }}
          >
            {/* List panel header */}
            <header
              className="flex items-center justify-between px-4 h-[52px] flex-shrink-0"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <span className="text-xs truncate" style={{ color: text, fontWeight: 500 }}>
                {listPanelTitle}
                <span className="ml-1.5" style={{ color: muted }}>({items.length})</span>
              </span>
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                {/* View toggle — only on singles */}
                {(view.category === 'singles' || view.category === 'collections' || view.category === 'bulk') && (() => {
                  const isS = view.category === 'singles';
                  const curMode = isS ? singlesViewMode : groupViewMode;
                  const setMode = isS ? setSinglesViewMode : setGroupViewMode;
                  return (
                    <div className="flex items-center p-0.5 rounded-md mr-1"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', border: `1px solid ${border}` }}>
                      {([
                        { mode: 'grid'   as const, icon: <LayoutGrid className="w-3 h-3" />, title: 'Grid view'   },
                        { mode: 'list'   as const, icon: <List       className="w-3 h-3" />, title: 'List view'   },
                        { mode: 'hybrid' as const, icon: <Columns2   className="w-3 h-3" />, title: 'Hybrid view' },
                      ] as const).map(({ mode, icon, title }) => (
                        <button key={mode} title={title} onClick={() => setMode(mode)}
                          className="p-1 rounded transition-all"
                          style={{
                            background: curMode === mode ? (isDark ? '#2a2a2a' : '#ffffff') : 'transparent',
                            color: curMode === mode ? text : muted,
                            boxShadow: curMode === mode ? '0 1px 2px rgba(0,0,0,0.12)' : 'none',
                          }}
                        >{icon}</button>
                      ))}
                    </div>
                  );
                })()}
                {/* Search toggle */}
                <button
                  onClick={() => setShowSearchBar(s => !s)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: showSearchBar ? text : muted, background: showSearchBar ? (isDark ? 'rgba(255,255,255,0.06)' : '#f0eeeb') : 'transparent' }}
                  onMouseEnter={e => { if (!showSearchBar) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                  onMouseLeave={e => { if (!showSearchBar) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>

                {/* Sort menu */}
                <div className="relative">
                  {showSortMenu && <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />}
                  <button
                    onClick={() => { setShowSortMenu(s => !s); setShowFilterMenu(false); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: sortBy !== 'date-desc' ? text : muted, background: sortBy !== 'date-desc' ? (isDark ? 'rgba(255,255,255,0.06)' : '#f0eeeb') : 'transparent' }}
                    onMouseEnter={e => { if (sortBy === 'date-desc') (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={e => { if (sortBy === 'date-desc') (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                  {showSortMenu && (
                    <div
                      className="absolute right-0 top-full mt-1 z-50 rounded-xl shadow-xl py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 156 }}
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors"
                          style={{ color: sortBy === opt.value ? text : muted, background: 'transparent' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                        >
                          {opt.label}
                          {sortBy === opt.value && <span style={{ color: text }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter menu */}
                <div className="relative">
                  {showFilterMenu && <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />}
                  <button
                    onClick={() => { setShowFilterMenu(f => !f); setShowSortMenu(false); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: filterSources.length > 0 ? text : muted, background: filterSources.length > 0 ? (isDark ? 'rgba(255,255,255,0.06)' : '#f0eeeb') : 'transparent' }}
                    onMouseEnter={e => { if (filterSources.length === 0) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={e => { if (filterSources.length === 0) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                  </button>
                  {showFilterMenu && (
                    <div
                      className="absolute right-0 top-full mt-1 z-50 rounded-xl shadow-xl py-1"
                      style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 172, maxHeight: 240, overflowY: 'auto' }}
                    >
                      {filterSources.length > 0 && (
                        <>
                          <button
                            onClick={() => setFilterSources([])}
                            className="w-full px-3 py-2 text-xs text-left transition-colors"
                            style={{ color: '#ef4444', background: 'transparent' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                          >
                            Clear all filters
                          </button>
                          <div style={{ height: 1, background: border, margin: '2px 0' }} />
                        </>
                      )}
                      {ALL_SOURCES.map(src => {
                        const active = filterSources.includes(src);
                        return (
                          <button
                            key={src}
                            onClick={() => setFilterSources(prev => active ? prev.filter(s => s !== src) : [...prev, src])}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors"
                            style={{ color: active ? text : muted, background: 'transparent' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                          >
                            {src}
                            {active && <span style={{ color: text }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Inline search bar */}
            {showSearchBar && (
              <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: isDark ? '#242424' : '#f5f4f2', border: `1px solid ${border}` }}
                >
                  <Search className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs"
                    style={{ color: text, caretColor: text }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="flex-shrink-0" style={{ color: muted }}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Back button when inside a group */}
            {view.groupId && (
              <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
                <button
                  onClick={() => { setView({ category: view.category }); setSelectedTranscriptId(null); }}
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: muted }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back
                </button>
              </div>
            )}

            {/* List items */}
            <div className="flex-1 overflow-y-auto">
              {isGroups ? (
                /* Group rows */
                (items as GroupItem[]).map(g => {
                  const accentColor = view.category === 'collections' ? (isDark ? '#ffffff' : '#111111') : view.category === 'bulk' ? (isDark ? '#ffffff' : '#111111') : (isDark ? '#ffffff' : '#111111');
                  const iconBg = view.category === 'collections' ? (isDark ? 'rgba(255,255,255,0.08)' : '#efefef') : view.category === 'bulk' ? (isDark ? 'rgba(255,255,255,0.08)' : '#efefef') : (isDark ? 'rgba(255,255,255,0.08)' : '#efefef');
                  const icon = view.category === 'collections'
                    ? <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: isDark ? '#ffffff' : '#111111' }}>
                        <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8Z" stroke="currentColor" strokeLinecap="round" strokeWidth={1.75} />
                        <path d="M6.03174 10.8997V10.7904C6.03174 9.51802 6.03174 8.88185 6.29976 8.49597C6.53384 8.15896 6.89576 7.93255 7.30121 7.86949C7.76546 7.79729 8.33752 8.07559 9.48165 8.63219L9.57799 8.67906C10.8284 9.28734 11.4535 9.59149 11.6825 10.0271C11.8822 10.4069 11.9097 10.854 11.758 11.2554C11.584 11.7157 11.0007 12.094 9.83413 12.8507L9.7378 12.9132C8.53146 13.6957 7.92829 14.0869 7.42916 14.0527C6.99422 14.0229 6.59377 13.8054 6.33207 13.4567C6.03174 13.0566 6.03174 12.3376 6.03174 10.8997Z" stroke="currentColor" strokeLinecap="round" strokeWidth={1.75} />
                      </svg>
                    : view.category === 'bulk'
                    ? <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: isDark ? '#ffffff' : '#111111' }}>
                        <path d="M5 6L13 6M5 10L13 10M5 14H9M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8Z" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
                      </svg>
                    : view.category === 'profiles'
                    ? <Users className="w-[18px] h-[18px] flex-shrink-0" style={{ color: isDark ? '#ffffff' : '#111111' }} strokeWidth={1.75} />
                    : <Folder className="w-3.5 h-3.5" style={{ color: isDark ? '#ffffff' : '#111111' }} />;
                  return (
                    <button
                      key={g.id}
                      onClick={() => selectGroup(view.category as 'collections' | 'bulk' | 'folders' | 'profiles', g.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        background: isGroupActive(g.id) ? (isDark ? 'rgba(255,255,255,0.05)' : '#f5f4f2') : 'transparent',
                        borderBottom: `1px solid ${border}`,
                      }}
                      onMouseEnter={e => { if (!isGroupActive(g.id)) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                      onMouseLeave={e => { if (!isGroupActive(g.id)) (e.currentTarget as HTMLButtonElement).style.background = isGroupActive(g.id) ? (isDark ? 'rgba(255,255,255,0.05)' : '#f5f4f2') : 'transparent'; }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
                        {view.category === 'profiles'
                          ? <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: isDark ? '#ffffff' : '#111111' }}>
                              <path d="M16 20C16 17.2386 13.7614 15 11 15H7C4.23858 15 2 17.2386 2 20M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8ZM11.5532 9C11.5532 10.4101 10.4101 11.5532 9 11.5532C7.58989 11.5532 6.44678 10.4101 6.44678 9C6.44678 7.58989 7.58989 6.44678 9 6.44678C10.4101 6.44678 11.5532 7.58989 11.5532 9Z" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
                            </svg>
                          : icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate" style={{ color: text, fontWeight: 500 }}>{view.category === 'profiles' ? ((g.videos[0] as any)?.source ?? g.name) : g.name}</p>
                        <p className="text-[11px]" style={{ color: muted }}>{g.count} video{g.count !== 1 ? 's' : ''}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
                    </button>
                  );
                })
              ) : (
                /* Transcript / video rows */
                (items as (Transcript | VideoItem)[]).map(item => {
                  const thumb = (item as Transcript).thumbnail || (item as VideoItem).thumbnail || `https://picsum.photos/seed/${item.id}/80/140`;
                  const src = (item as Transcript).source || (item as VideoItem).source || '';
                  const views = (item as Transcript).views || (item as VideoItem).views || '';
                  const isSelected = selectedTranscriptId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative flex items-center gap-3 mx-2 px-2 py-2.5 cursor-pointer group transition-colors rounded-md first:mt-1"
                      style={{
                        background: isSelected ? (isDark ? 'rgba(255,255,255,0.03)' : '#f5f4f2') : 'transparent',
                      }}
                      onClick={() => setSelectedTranscriptId(item.id)}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.025)' : '#f7f6f4'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Portrait thumbnail — 9/16 at fixed height 44px */}
                      <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 44, height: 44 }}>
                        <img src={thumb} alt={customTitles[item.id] || item.title} className="w-full h-full object-cover" />
                        <span
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded text-white"
                          style={{ background: 'rgba(0,0,0,0.72)', fontSize: 10, lineHeight: 1.3, letterSpacing: '0.01em' }}
                        >
                          {formatDuration(item.duration)}
                        </span>
                        {favouritedIds.has(item.id) && (
                          <div className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center rounded-full" style={{ background: 'rgba(0,0,0,0.55)' }}>
                            <Heart className="w-2.5 h-2.5" style={{ fill: '#e05252', color: '#e05252' }} strokeWidth={0} />
                          </div>
                        )}
                      </div>

                      {/* Info — text uses full width; 3-dot floats over it on hover */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-xs leading-snug truncate mb-0.5" style={{ color: text, fontWeight: 500 }}>{customTitles[item.id] || item.title}</p>
                        {(src || views) && (
                          <p className="text-[11px] truncate" style={{ color: muted }}>
                            {src}{src && views ? ' · ' : ''}{views}{views ? ' views' : ''}
                          </p>
                        )}
                      </div>

                      {/* 3-dot button — transform stays on button only, NOT wrapping fixed children */}
                      <button
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-opacity ${openMenuId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        style={{ color: muted }}
                        onClick={e => {
                          e.stopPropagation();
                          if (openMenuId === item.id) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }
                          else {
                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            setOpenMenuId(item.id);
                          }
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : '#e5e4e2')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {/* Backdrop + dropdown are siblings of the button — outside any transform, so fixed positioning works */}
                      {openMenuId === item.id && (
                        <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }} />
                      )}
                      {openMenuId === item.id && menuPos && (() => {
                        const isFav = favouritedIds.has(item.id);
                        const menuItems: { icon: React.ReactNode; label: string; destructive?: boolean; separator?: boolean; keepOpen?: boolean; action: () => void }[] = [
                          {
                            icon: <Copy className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Copy Transcript',
                            action: () => {
                              const t = customTitles[item.id] || item.title;
                              navigator.clipboard.writeText(`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`)
                                .then(() => showToast('Transcript copied to clipboard'))
                                .catch(() => showToast('Could not access clipboard'));
                            },
                          },
                          {
                            icon: <Download className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Download',
                            action: () => {
                              const t = customTitles[item.id] || item.title;
                              const blob = new Blob([`[Transcript: ${t}]\nDuration: ${formatDuration(item.duration)}\n\nSample transcript content for "${t}".`], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a'); a.href = url; a.download = `${t.replace(/[^a-z0-9]/gi, '_')}.txt`; a.click(); URL.revokeObjectURL(url);
                              showToast('Transcript downloaded');
                            },
                          },
                          {
                            icon: <Link2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Share Link',
                            action: () => {
                              navigator.clipboard.writeText(`https://app.tokscript.com/results/${item.id}`)
                                .then(() => showToast('Share link copied to clipboard'))
                                .catch(() => showToast('Could not access clipboard'));
                            },
                          },
                          {
                            icon: <Heart className="w-3.5 h-3.5 flex-shrink-0" style={isFav ? { fill: 'currentColor' } : {}} />,
                            label: isFav ? 'Remove from Favourites' : 'Favourite',
                            action: () => {
                              setFavouritedIds(prev => { const s = new Set(prev); s.has(item.id) ? s.delete(item.id) : s.add(item.id); return s; });
                              showToast(isFav ? 'Removed from Favourites' : 'Added to Favourites');
                            },
                          },
                          {
                            icon: <FolderInput className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Move to Folder',
                            keepOpen: true,
                            action: () => { setMoveSubMenuOpen(true); },
                          },
                          {
                            icon: <Pencil className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Edit Transcript',
                            action: () => { setEditingItem({ id: item.id, title: customTitles[item.id] || item.title }); },
                          },
                          {
                            icon: <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Reprocess',
                            action: () => { showToast('Reprocessing transcript…'); },
                          },
                          {
                            icon: <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />, label: 'Delete', destructive: true, separator: true,
                            action: () => {
                              setDeletedIds(prev => new Set([...prev, item.id]));
                              setSelectedTranscriptId(prev => prev === item.id ? null : prev);
                              showToast('Transcript deleted');
                            },
                          },
                        ];
                        return (
                          <div
                            key="row-context-menu"
                            className="fixed z-50 rounded-xl shadow-xl py-1"
                            style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}`, minWidth: 204, top: menuPos.top, right: menuPos.right }}
                          >
                            {moveSubMenuOpen ? (
                              <>
                                <button
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs"
                                  style={{ color: muted, background: 'transparent' }}
                                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                                  onClick={e => { e.stopPropagation(); setMoveSubMenuOpen(false); }}
                                >
                                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ transform: 'rotate(180deg)' }} />
                                  Back
                                </button>
                                <div style={{ height: 1, background: border, margin: '2px 0' }} />
                                <p className="px-3 pt-2 pb-1 text-[10px] uppercase" style={{ color: muted, letterSpacing: '0.08em' }}>Choose folder</p>
                                {folders.map(f => (
                                  <button
                                    key={f.id}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left"
                                    style={{ color: text, background: 'transparent' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                                    onClick={e => {
                                      e.stopPropagation();
                                      const title = customTitles[item.id] || item.title;
                                      setFolders(prev => prev.map(folder =>
                                        folder.id === f.id
                                          ? { ...folder, count: folder.count + 1, videos: [...folder.videos, { id: item.id, title, duration: item.duration, date: (item as Transcript).date || '' }] }
                                          : folder
                                      ));
                                      showToast(`Moved to "${f.name}"`);
                                      setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false);
                                    }}
                                  >
                                    <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
                                    {f.name}
                                  </button>
                                ))}
                              </>
                            ) : (
                              menuItems.flatMap(opt => [
                                opt.separator ? <div key={`sep-${opt.label}`} style={{ height: 1, background: border, margin: '4px 0' }} /> : null,
                                <button
                                  key={opt.label}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left"
                                  style={{ color: opt.destructive ? '#d95656' : text, background: 'transparent' }}
                                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                                  onClick={e => {
                                    e.stopPropagation();
                                    opt.action();
                                    if (!opt.keepOpen) { setOpenMenuId(null); setMenuPos(null); setMoveSubMenuOpen(false); }
                                  }}
                                >
                                  {opt.icon}
                                  {opt.label}
                                  {opt.label === 'Move to Folder' && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: muted }} />}
                                </button>,
                              ])
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ═══════════════��══════════════════════════════════════════════
              DETAIL PANEL — powered by TranscriptDetailPanel
              Edit TranscriptDetailPanel.tsx to update every surface.
          ═════════════════════════════════════════════════════════════�� */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {selectedTranscriptId !== null ? (() => {
              const allLookup: (Transcript | VideoItem)[] = [
                ...SINGLES, ...PROFILE_EXTRAS,
                ...COLLECTIONS.flatMap(g => g.videos),
                ...BULK.flatMap(g => g.videos),
                ...(PROFILE_GROUPS.flatMap(g => g.videos) as unknown as VideoItem[]),
                ...folders.filter(f => f.id !== FAVOURITES_FOLDER_ID).flatMap(f => f.videos),
              ];
              const item = (allLookup.find(s => s.id === selectedTranscriptId) ?? SINGLES[0]) as Transcript;
              const baseVideo = transcriptToDetailVideo(item);
              const detailVideo = customTitles[item.id] ? { ...baseVideo, title: customTitles[item.id] } : baseVideo;
              return (
                <TranscriptDetailPanel
                  video={detailVideo}
                  transcript={IV_TRANSCRIPT}
                  related={IV_RELATED}
                  downloadFormats={DOWNLOAD_FORMATS}
                  isDark={isDark}
                  bg={bg}
                  border={border}
                  text={text}
                  muted={muted}
                  hoverBg={hoverBg}
                  cardBg={cardBg}
                  onBack={() => setSelectedTranscriptId(null)}
                  onViewCreator={(creator) => goToCreator(creator, detailVideo.title)}
                  plan={plan}
                  onUpgrade={openUpgrade}
                />
              );
            })() : view.groupId && !isGroups ? (
              /* Group stat overview — shown before selecting a transcript */
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-5">
                  <p className="text-sm mb-0.5" style={{ color: text, fontWeight: 600 }}>
                    {activeGroup?.name ?? 'Group Overview'}
                  </p>
                  <p className="text-xs" style={{ color: muted }}>
                    {items.length} transcript{items.length !== 1 ? 's' : ''} · select one to view its detail
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    const vids = items as VideoItem[];
                    const totalSecs  = vids.reduce((s, v) => s + parseDuration(v.duration), 0);
                    const creators   = new Set(vids.map(v => v.source).filter(Boolean)).size;
                    const totalV     = vids.reduce((s, v) => s + (v.views ? parseViews(v.views) : 0), 0);
                    const avgSecs    = vids.length > 0 ? Math.round(totalSecs / vids.length) : 0;
                    const cards = [
                      { icon: <Film  className="w-3.5 h-3.5" />, label: 'Videos',        value: vids.length,              sub: 'in this group' },
                      { icon: <Clock className="w-3.5 h-3.5" />, label: 'Total Runtime', value: fmtRuntime(totalSecs),     sub: `avg ${fmtRuntime(avgSecs)}` },
                      { icon: <Users className="w-3.5 h-3.5" />, label: 'Creators',      value: creators,                 sub: 'unique sources' },
                      { icon: <Eye   className="w-3.5 h-3.5" />, label: 'Total Views',   value: fmtViews(totalV),         sub: 'across all videos' },
                    ];
                    return cards.map(c => (
                      <div key={c.label} className="flex flex-col px-4 pt-3 pb-3 rounded-xl"
                        style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.015)' : '#fafafa' }}>
                        <div className="flex items-center gap-1.5 mb-1.5" style={{ color: muted }}>
                          {c.icon}
                          <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{c.label}</span>
                        </div>
                        <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>{c.value}</p>
                        <p className="mt-1.5" style={{ color: muted, fontSize: '0.6875rem' }}>{c.sub}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <Film className="w-6 h-6" style={{ color: muted }} />
                </div>
                <div className="text-center">
                  <p className="text-sm mb-1" style={{ color: text, fontWeight: 500 }}>Select a transcript</p>
                  <p className="text-xs" style={{ color: muted }}>Click any item in the list to view its transcript</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      </div>{/* end panels row */}

      {/* ── Dashboard Recent Transcript Detail Overlay ───────────────────────── */}
      {view.category === 'dashboard' && selectedTranscriptId !== null && (() => {
        const allLookup: (Transcript | VideoItem)[] = [
          ...SINGLES, ...PROFILE_EXTRAS,
          ...COLLECTIONS.flatMap(g => g.videos),
          ...BULK.flatMap(g => g.videos),
          ...(PROFILE_GROUPS.flatMap(g => g.videos) as unknown as VideoItem[]),
          ...folders.filter(f => f.id !== FAVOURITES_FOLDER_ID).flatMap(f => f.videos),
        ];
        const item = (allLookup.find(s => s.id === selectedTranscriptId) ?? SINGLES[0]) as Transcript;
        const baseVideo = transcriptToDetailVideo(item);
        const detailVideo = customTitles[item.id] ? { ...baseVideo, title: customTitles[item.id] } : baseVideo;
        const panelBg = isDark ? '#141414' : '#ffffff';
        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }}
              onClick={() => setSelectedTranscriptId(null)}
            />
            {/* Slide-in panel */}
            <div
              className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
              style={{
                width: 860,
                background: panelBg,
                borderLeft: `1px solid ${border}`,
                boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)',
                animation: 'dashboardPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <TranscriptDetailPanel
                video={detailVideo}
                transcript={IV_TRANSCRIPT}
                related={IV_RELATED}
                downloadFormats={DOWNLOAD_FORMATS}
                isDark={isDark}
                bg={panelBg}
                border={border}
                text={text}
                muted={muted}
                hoverBg={hoverBg}
                cardBg={cardBg}
                onBack={() => setSelectedTranscriptId(null)}
                onViewCreator={(creator) => goToCreator(creator, detailVideo.title)}
                plan={plan}
                onUpgrade={openUpgrade}
              />
            </div>
            <style>{`
              @keyframes dashboardPanelIn {
                from { transform: translateX(100%); opacity: 0.5; }
                to   { transform: translateX(0);    opacity: 1;   }
              }
            `}</style>
          </>
        );
      })()}


      {/* ── Edit Transcript Modal ─────────────────────────────────────────────── */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setEditingItem(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6' }}>
                  <Pencil className="w-4 h-4" style={{ color: isDark ? '#ffffff' : '#111111' }} />
                </div>
                <span className="text-sm" style={{ color: text, fontWeight: 600 }}>Edit Transcript</span>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg" style={{ color: muted }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              ><X className="w-4 h-4" /></button>
            </div>
            <label className="block mb-1.5">
              <span className="text-xs" style={{ color: muted, fontWeight: 500 }}>Title</span>
            </label>
            <input
              autoFocus
              type="text"
              value={editingItem.title}
              onChange={e => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
              onKeyDown={e => {
                if (e.key === 'Enter') { setCustomTitles(prev => ({ ...prev, [editingItem.id]: editingItem.title })); showToast('Transcript renamed'); setEditingItem(null); }
                if (e.key === 'Escape') setEditingItem(null);
              }}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-5"
              style={{ background: isDark ? '#242424' : '#f9fafb', border: `1px solid ${border}`, color: text, caretColor: text }}
            />
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setEditingItem(null)} className="px-3 py-2 rounded-lg text-xs"
                style={{ color: muted, background: 'transparent', border: `1px solid ${border}` }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              >Cancel</button>
              <button
                onClick={() => { setCustomTitles(prev => ({ ...prev, [editingItem.id]: editingItem.title })); showToast('Transcript renamed'); setEditingItem(null); }}
                className="px-4 py-2 rounded-lg text-xs"
                style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#ffffff', fontWeight: 500 }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? '#222222' : '#2a2a2a')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111')}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl shadow-xl text-xs pointer-events-none"
          style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#ffffff', border: `1px solid ${isDark ? '#262626' : 'transparent'}`, fontWeight: 500, whiteSpace: 'nowrap' }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── New Folder Modal ────────────────────────────────────────────────────── */}
      {showNewFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowNewFolderModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${border}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7' }}>
                  <FolderPlus className="w-4 h-4" style={{ color: '#d97706' }} />
                </div>
                <span className="text-sm" style={{ color: text, fontWeight: 600 }}>New Folder</span>
              </div>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: muted }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block mb-1.5">
              <span className="text-xs" style={{ color: muted, fontWeight: 500 }}>Folder name</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Client Calls"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setShowNewFolderModal(false); }}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-5"
              style={{
                background: isDark ? '#242424' : '#f9fafb',
                border: `1px solid ${border}`,
                color: text,
                caretColor: text,
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-3 py-2 rounded-lg text-xs transition-colors"
                style={{ color: muted, background: 'transparent', border: `1px solid ${border}` }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 rounded-lg text-xs transition-colors"
                style={{
                  background: newFolderName.trim() ? '#d97706' : (isDark ? '#242424' : '#e5e7eb'),
                  color: newFolderName.trim() ? '#ffffff' : muted,
                  fontWeight: 500,
                  cursor: newFolderName.trim() ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={e => { if (newFolderName.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#b45309'; }}
                onMouseLeave={e => { if (newFolderName.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#d97706'; }}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
