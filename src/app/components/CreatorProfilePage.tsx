/**
 * CreatorProfilePage  (/profile/:creator)
 * ─────────────────────────────────────────
 * Shows a creator's profile header + their videos in a Discover-style grid.
 * Clicking a video opens the TranscriptDetailPanel in a right-side split panel.
 */
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import {
  ChevronRight, Play, Calendar, Copy, CheckCheck,
  Users, Video, FileText, ExternalLink, BadgeCheck,
  Search, SlidersHorizontal, ChevronDown, Clock, X,
  Heart, MoreHorizontal, Download, Lock, Film, Image,
  Zap, ArrowRight, Loader2,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatDuration';
import { AppSidebar } from './AppSidebar';
import { AppLogo } from './AppLogo';
import { AppHeader } from './AppHeader';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  TranscriptDetailPanel,
  TranscriptDetailVideo,
  DownloadFormat,
  RelatedVideo,
} from './TranscriptDetailPanel';
import { UserContext } from '../context/UserContext';
import Rd from '../../imports/Rd';

// ─── Filter constants ─────────────────────────────────────────────────────────
const PLATFORMS = ['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X', 'Spotify'];
const SORT_OPTIONS = [
  { value: 'date-desc',  label: 'Newest first' },
  { value: 'date-asc',   label: 'Oldest first' },
  { value: 'words-desc', label: 'Most words'   },
  { value: 'words-asc',  label: 'Fewest words' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface CreatorProfile {
  displayName: string;
  handle: string;
  bio: string;
  platforms: string[];
  followers: string;
  videoCount: number;
  totalWords: string;
  avatar: string;
  verified?: boolean;
}

interface CreatorVideo {
  id: number;
  title: string;
  platform: string;
  duration: string;
  date: string;
  words: number;
  thumbnail: string;
  transcriptSnippet: string;
}

// ─── Mock creator database ────────────────────────────────────────────────────
const CREATOR_DB: Record<string, CreatorProfile> = {
  '@tokcast': {
    displayName: 'TokCast',
    handle: '@tokcast',
    bio: 'Weekly deep-dives with builders, founders, and operators. 200+ episodes on growth, product, and craft.',
    platforms: ['YouTube', 'Spotify'],
    followers: '284K',
    videoCount: 214,
    totalWords: '2.4M',
    avatar: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=200&q=80',
    verified: true,
  },
  '@fitwithjess': {
    displayName: 'Fit With Jess',
    handle: '@fitwithjess',
    bio: 'No-equipment home workouts that actually work. New sessions every Monday & Thursday.',
    platforms: ['YouTube', 'TikTok'],
    followers: '1.2M',
    videoCount: 347,
    totalWords: '890K',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80',
    verified: true,
  },
  '@roamingalex': {
    displayName: 'Roaming Alex',
    handle: '@roamingalex',
    bio: 'Slow travel, honest reviews, and stories from the road. Currently in Southeast Asia.',
    platforms: ['YouTube', 'Instagram'],
    followers: '542K',
    videoCount: 189,
    totalWords: '1.1M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    verified: false,
  },
  '@webdevdaily': {
    displayName: 'Web Dev Daily',
    handle: '@webdevdaily',
    bio: 'Practical tutorials for modern web developers. React, TypeScript, CSS and everything in between.',
    platforms: ['YouTube', 'Instagram'],
    followers: '398K',
    videoCount: 278,
    totalWords: '3.1M',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    verified: true,
  },
  '@techguru': {
    displayName: 'Tech Guru',
    handle: '@techguru',
    bio: 'Breaking down complex tech into plain English. APIs, DevOps, and backend architecture.',
    platforms: ['TikTok', 'YouTube'],
    followers: '218K',
    videoCount: 156,
    totalWords: '1.8M',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
    verified: false,
  },
  '@designsystem': {
    displayName: 'Design Systems',
    handle: '@designsystem',
    bio: 'Everything you need to build and maintain scalable design systems. Figma, tokens, and component architecture.',
    platforms: ['YouTube', 'LinkedIn'],
    followers: '167K',
    videoCount: 94,
    totalWords: '740K',
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=200&q=80',
    verified: false,
  },
  '@kitchenlabs': {
    displayName: 'Kitchen Labs',
    handle: '@kitchenlabs',
    bio: 'Food science meets home cooking. We test every technique so you don\'t have to.',
    platforms: ['TikTok', 'Instagram'],
    followers: '891K',
    videoCount: 412,
    totalWords: '620K',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80',
    verified: true,
  },
};

function getCreatorProfile(handle: string, stateAvatar?: string): CreatorProfile {
  const key = handle.startsWith('@') ? handle : `@${handle}`;
  if (CREATOR_DB[key]) return CREATOR_DB[key];
  // Generic fallback
  const clean = key.replace('@', '');
  return {
    displayName: clean.charAt(0).toUpperCase() + clean.slice(1),
    handle: key,
    bio: `Content creator sharing videos across multiple platforms.`,
    platforms: ['TikTok', 'YouTube'],
    followers: '45K',
    videoCount: 62,
    totalWords: '380K',
    avatar: stateAvatar ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    verified: false,
  };
}

// ─── Mock videos per creator ──────────────────────────────────────────────────
const ALL_CREATOR_VIDEOS: Record<string, CreatorVideo[]> = {
  '@tokcast': [
    { id: 1,  platform: 'YouTube', duration: '1:33', date: 'Feb 18, 2026', words: 6890,  title: 'Podcast Episode 12 — From 0 to acquisition',       thumbnail: 'https://images.unsplash.com/photo-1627667050609-d4ba6483a368?w=400&q=80',  transcriptSnippet: "My guest today has built three companies from zero to acquisition. The one thing all three had in common? They were all solving a problem the founder personally had..." },
    { id: 2,  platform: 'YouTube', duration: '1:28', date: 'Feb 11, 2026', words: 7650,  title: 'Podcast Episode 13 — $0 to $2M ARR in 18 months',   thumbnail: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&q=80',  transcriptSnippet: "Today I'm talking with someone who went from $0 to $2M ARR in 18 months without a single paid ad. The secret? They never stopped talking to customers..." },
    { id: 3,  platform: 'YouTube', duration: '1:42', date: 'Feb 4, 2026',  words: 8120,  title: 'Podcast Episode 14 — Hiring your first 10 engineers',  thumbnail: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&q=80',  transcriptSnippet: "The first engineering hire is the most important hire you'll ever make. Get it wrong and you're paying for it for years. Here's how to get it right..." },
    { id: 4,  platform: 'YouTube', duration: '2:05', date: 'Jan 28, 2026', words: 9340,  title: 'Podcast Episode 15 — Navigating a down round',        thumbnail: 'https://images.unsplash.com/photo-1553484771-047a44eee27b?w=400&q=80',  transcriptSnippet: "Nobody wants to talk about down rounds publicly. My guest did it and came out stronger. Here's the unfiltered story of what actually happened..." },
    { id: 5,  platform: 'YouTube', duration: '1:15', date: 'Jan 21, 2026', words: 5210,  title: 'Podcast Episode 16 — Building in public',            thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80',  transcriptSnippet: "Building in public changed everything for this founder. More customers, better investors, and a team that actually believed in the mission..." },
    { id: 6,  platform: 'YouTube', duration: '1:57', date: 'Jan 14, 2026', words: 8870,  title: 'Podcast Episode 17 — The product-led growth playbook', thumbnail: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&q=80',  transcriptSnippet: "Product-led growth isn't just a strategy — it's a complete rethink of how you build, sell, and retain. My guest has implemented it three times..." },
    { id: 7,  platform: 'YouTube', duration: '1:21', date: 'Jan 7, 2026',  words: 6100,  title: 'Podcast Episode 18 — Remote-first from day one',      thumbnail: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&q=80',  transcriptSnippet: "They've never had an office. 80 employees across 23 countries. Here's the exact operating system they use to stay aligned and move fast..." },
    { id: 8,  platform: 'YouTube', duration: '2:12', date: 'Dec 31, 2025', words: 10400, title: 'Podcast Episode 19 — The exit nobody saw coming',     thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',  transcriptSnippet: "The acquisition offer came in while they were in the middle of a Series B. Here's the decision matrix they used to decide whether to sell or keep going..." },
    { id: 9,  platform: 'YouTube', duration: '1:44', date: 'Dec 24, 2025', words: 7780,  title: 'Podcast Episode 20 — Community as a growth engine',   thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80',  transcriptSnippet: "100,000 community members. Zero ad spend. Here's how they built a passionate audience that sells the product better than any sales team could..." },
  ],
  '@fitwithjess': [
    { id: 1,  platform: 'YouTube', duration: '3:05', date: 'Feb 24, 2026', words: 11200, title: 'Full-body HIIT — 30 min no equipment',               thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',  transcriptSnippet: "No equipment, no excuses. This 30-minute session will hit every major muscle group and keep your heart rate elevated the entire time. Let's get into it..." },
    { id: 2,  platform: 'YouTube', duration: '2:47', date: 'Feb 17, 2026', words: 9800,  title: '20 min core crusher — beginner to advanced',           thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80',  transcriptSnippet: "Your core is more than just abs. Today we're training the entire core — front, sides, and back — in 20 minutes flat with zero equipment..." },
    { id: 3,  platform: 'YouTube', duration: '2:22', date: 'Feb 10, 2026', words: 8400,  title: 'Upper body burnout — shoulders arms chest',            thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',  transcriptSnippet: "Welcome to the upper body burnout. We're hitting shoulders, arms, and chest in one devastating circuit. You'll need a pair of dumbbells and a lot of willpower..." },
    { id: 4,  platform: 'TikTok',  duration: '0:58', date: 'Feb 7, 2026',  words: 3200,  title: 'Why you\'re not losing fat — the honest truth',        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',  transcriptSnippet: "I'm going to say what nobody else is saying. The reason most people aren't losing fat has nothing to do with their workout program..." },
    { id: 5,  platform: 'YouTube', duration: '2:58', date: 'Feb 3, 2026',  words: 10600, title: '30-day challenge results — before and after deep dive', thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',  transcriptSnippet: "Thirty days ago I started the challenge with 50,000 of you. Here are the results — the good, the surprising, and the things I'd change if I did it again..." },
    { id: 6,  platform: 'TikTok',  duration: '0:45', date: 'Jan 28, 2026', words: 2900,  title: '5 minute morning mobility routine',                   thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',  transcriptSnippet: "Do this every single morning. Five minutes, nine movements, and your body will feel completely different by the end of the week..." },
    { id: 7,  platform: 'YouTube', duration: '3:18', date: 'Jan 20, 2026', words: 12100, title: 'Leg day — complete lower body programme',              thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',  transcriptSnippet: "Full lower body. Quads, hamstrings, glutes, calves. This is the only leg workout you'll need this week and it doesn't require a single machine..." },
    { id: 8,  platform: 'TikTok',  duration: '0:37', date: 'Jan 13, 2026', words: 1800,  title: 'The one exercise you\'re probably skipping',           thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80',  transcriptSnippet: "If I could only do one exercise for the rest of my life it would be this. Most people skip it because it looks simple. It is not simple..." },
  ],
  '@roamingalex': [
    { id: 1,  platform: 'YouTube', duration: '2:30', date: 'Feb 1, 2026',  words: 10800, title: 'Japan vlog — Tokyo day 3',                            thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',  transcriptSnippet: "Day three in Tokyo and I finally figured out how to order from the vending machines. But seriously — the food scene here has completely blown my expectations..." },
    { id: 2,  platform: 'YouTube', duration: '2:15', date: 'Jan 25, 2026', words: 9700,  title: 'Japan vlog — Kyoto temples and unexpected kindness',   thumbnail: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&q=80',  transcriptSnippet: "I got completely lost in Arashiyama and it led to the best afternoon of the entire trip. Here's what happened when I put the phone down..." },
    { id: 3,  platform: 'YouTube', duration: '1:48', date: 'Jan 18, 2026', words: 7900,  title: 'Budget breakdown — one month in Japan on €1,800',    thumbnail: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80',  transcriptSnippet: "Everyone says Japan is expensive. I spent one full month there — including a bullet train pass and one fancy dinner — for under €1,800. Here's exactly how..." },
    { id: 4,  platform: 'Instagram',duration: '1:05', date: 'Jan 11, 2026', words: 4100,  title: 'Packing light — everything in a 20L backpack',        thumbnail: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',  transcriptSnippet: "Three months on the road and everything I own fits in a bag smaller than most people's gym kit. Here's what I actually use every single day..." },
    { id: 5,  platform: 'YouTube', duration: '2:02', date: 'Jan 4, 2026',  words: 9100,  title: 'Vietnam — the north is different from the south',      thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80',  transcriptSnippet: "I spent three weeks going from Hanoi to Ho Chi Minh City and I was wrong about almost everything I expected. Vietnam is genuinely the most surprising country I've visited..." },
    { id: 6,  platform: 'YouTube', duration: '1:55', date: 'Dec 28, 2025', words: 8600,  title: 'Solo travel — is it actually lonely?',               thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',  transcriptSnippet: "The question I get asked more than any other. The honest answer is more complicated than yes or no, and it depends completely on where you are in your life..." },
  ],
  '@webdevdaily': [
    { id: 1,  platform: 'Instagram',duration: '1:10', date: 'Feb 3, 2026',  words: 4560,  title: 'React hooks masterclass — useEffect done right',     thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&q=80',  transcriptSnippet: "If you're still writing class components in 2026 this video is for you. I'm going to show you how to rewrite them with hooks in a fraction of the code..." },
    { id: 2,  platform: 'YouTube', duration: '2:38', date: 'Jan 27, 2026', words: 11400, title: 'TypeScript generics — the complete guide',            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',  transcriptSnippet: "Generics are the feature that separates TypeScript beginners from intermediate developers. Once you understand them, you'll wonder how you ever coded without them..." },
    { id: 3,  platform: 'YouTube', duration: '1:55', date: 'Jan 20, 2026', words: 8700,  title: 'CSS Grid vs Flexbox — when to use which',           thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&q=80',  transcriptSnippet: "This is the question I see in every Discord server and every YouTube comment. The answer is not 'use whichever you prefer' — they genuinely serve different purposes..." },
    { id: 4,  platform: 'Instagram',duration: '0:52', date: 'Jan 13, 2026', words: 3100,  title: 'Stop overcomplicating your state management',       thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',  transcriptSnippet: "You don't need Redux. You probably don't need Zustand. Here's how to decide what state management solution your app actually needs..." },
    { id: 5,  platform: 'YouTube', duration: '2:22', date: 'Jan 6, 2026',  words: 10200, title: 'Build a design system in React from scratch',       thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',  transcriptSnippet: "We're building a complete design system: tokens, components, documentation, and a Storybook setup — all from scratch in a single video..." },
    { id: 6,  platform: 'YouTube', duration: '1:40', date: 'Dec 30, 2025', words: 7500,  title: 'Next.js App Router — the patterns that matter',    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',  transcriptSnippet: "After six months building production apps with App Router, here are the patterns and pitfalls you won't find in the official docs..." },
  ],
};

function getCreatorVideos(handle: string): CreatorVideo[] {
  const key = handle.startsWith('@') ? handle : `@${handle}`;
  return ALL_CREATOR_VIDEOS[key] ?? ALL_CREATOR_VIDEOS['@tokcast'];
}

// ─── Platform badge ───────────────────────────────────────────────────────────
const PLATFORM_META: Record<string, { color: string; brandColor: string }> = {
  TikTok:      { color: '#ffffff', brandColor: '#010101' },
  Instagram:   { color: '#ffffff', brandColor: '#e1306c' },
  YouTube:     { color: '#ffffff', brandColor: '#ff0000' },
  LinkedIn:    { color: '#ffffff', brandColor: '#0a66c2' },
  Spotify:     { color: '#ffffff', brandColor: '#1db954' },
  'Twitter/X': { color: '#ffffff', brandColor: '#14171a' },
};

function PlatformIcon({ platform }: { platform: string }) {
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
  if (platform === 'LinkedIn') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
  if (platform === 'Spotify') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.36a.75.75 0 0 1-1.03.27c-2.83-1.73-6.39-2.12-10.58-1.16a.75.75 0 0 1-.34-1.46c4.59-1.05 8.52-.6 11.69 1.32a.75.75 0 0 1 .26 1.03zm1.24-2.76a.94.94 0 0 1-1.29.31c-3.24-1.99-8.17-2.57-12-1.4a.94.94 0 0 1-.57-1.79c4.35-1.32 9.77-.68 13.48 1.59a.94.94 0 0 1 .38 1.29zm.11-2.88C14.26 8.6 8.25 8.4 4.89 9.4a1.12 1.12 0 1 1-.65-2.15C8.22 6.1 14.9 6.34 19.1 8.72a1.12 1.12 0 0 1-1.11 1.95v.05z" />
    </svg>
  );
  if (platform === 'Twitter/X') return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.252 2.25H8.08l4.226 5.593 5.938-5.593z" />
    </svg>
  );
  return null;
}

function PlatformBadge({ platform, isDark = false }: { platform: string; isDark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
      style={{
        background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.18)'}`,
        color: isDark ? '#ffffff' : '#111827',
        fontWeight: 600,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <PlatformIcon platform={platform} />
      {platform}
    </span>
  );
}

// ─── Download formats (shared) ────────────────────────────────────────────────
const DOWNLOAD_FORMATS: DownloadFormat[] = [
  { label: 'Plain Text (.txt)', free: true  },
  { label: 'Subtitles (.srt)',  free: false },
  { label: 'WebVTT (.vtt)',     free: false },
  { label: 'JSON (beta)',       free: false },
];

const FILLER_PARAGRAPHS = [
  "The framework I'm about to share has been tested across hundreds of different scenarios and consistently delivers results. Let me walk you through each step carefully.",
  "What most people miss is the importance of consistency over intensity. You don't need to go all-in every single day — you need to show up reliably and build momentum.",
  "Here's where it gets really interesting. The data collected over the past twelve months shows a clear pattern: the people who succeed work the smartest, not the hardest.",
  "One thing that surprised me early on was how much the environment shapes the outcome. Once I started optimising for the right inputs, everything began to fall into place.",
  "Before we wrap up, I want to give you one actionable takeaway you can implement right now. Take fifteen minutes today to audit what you're spending your time on.",
];

// ─── Platform badge (matches Discover exactly) ────────────────────────────────
const VIDEO_PLATFORM_META: Record<string, { color: string; bg: string }> = {
  TikTok:     { color: '#ffffff', bg: '#010101' },
  Instagram:  { color: '#ffffff', bg: '#e1306c' },
  YouTube:    { color: '#ffffff', bg: '#ff0000' },
  'Twitter/X':{ color: '#ffffff', bg: '#14171a' },
  LinkedIn:   { color: '#ffffff', bg: '#0a66c2' },
  Spotify:    { color: '#ffffff', bg: '#1db954' },
};

function VideoPlatformBadge({ platform, isDark }: { platform: string; isDark: boolean }) {
  if (isDark) {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.13)',
          color: '#ffffff',
          fontWeight: 600,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <PlatformIcon platform={platform} />
        {platform}
      </span>
    );
  }
  const meta = VIDEO_PLATFORM_META[platform] ?? { color: '#fff', bg: '#6b7280' };
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
      style={{ background: meta.bg, color: meta.color, fontWeight: 600 }}
    >
      <PlatformIcon platform={platform} />
      {platform}
    </span>
  );
}

// ─── Video Card (1-for-1 match with Discover HistoryCard) ─────────────────────
function VideoCard({
  video, creator, isDark, border, text, muted, hoverBg, onSelect,
}: {
  video: CreatorVideo;
  creator: string;
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  onSelect: (v: CreatorVideo) => void;
}) {
  const [copied, setCopied]       = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [showMenu, setShowMenu]   = useState(false);

  const restBg = isDark ? '#141414' : '#ffffff';

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all cursor-pointer"
      style={{ border: `1px solid ${border}`, background: restBg }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = restBg; }}
      onClick={() => onSelect(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] w-full overflow-hidden flex-shrink-0">
        <ImageWithFallback src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-white opacity-80" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <VideoPlatformBadge platform={video.platform} isDark={isDark} />
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>{formatDuration(video.duration)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px]" style={{ color: muted }}>{creator}</span>
        <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{video.title}</p>
        <p className="text-[10px]" style={{ color: muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {video.transcriptSnippet}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[10px]" style={{ color: muted }}>{video.date}</span>
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
              style={{ color: copied ? '#00b8b2' : muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', border: `1px solid ${border}` }}
              onClick={e => {
                e.stopPropagation();
                navigator.clipboard.writeText(video.transcriptSnippet).catch(() => {});
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
                      { label: 'Open transcript', icon: <FileText className="w-3 h-3" />, action: () => { onSelect(video); setShowMenu(false); } },
                      { label: copied ? 'Copied!' : 'Copy snippet', icon: copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />, action: () => { navigator.clipboard.writeText(video.transcriptSnippet).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); setShowMenu(false); } },
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

// ─── Export Profile Panel ─────────────────────────────────────────────────────
type ExportPhase = 'config' | 'running' | 'done';

interface ExportSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  proOnly: boolean;
  checked: boolean;
  options?: { key: string; label: string; choices: string[]; value: string }[];
}

function ExportProfilePanel({
  profile, videos, plan, isDark, border, text, muted, hoverBg, onClose, onUpgrade,
}: {
  profile: CreatorProfile;
  videos: { id: number }[];
  plan: 'free' | 'pro';
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  const panelBg   = isDark ? '#141414' : '#ffffff';
  const sectionBg = isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb';

  const [phase, setPhase] = useState<ExportPhase>('config');
  const [progress, setProgress] = useState(0);
  const [doneItems, setDoneItems] = useState<string[]>([]);

  const [sections, setSections] = useState<ExportSection[]>([
    {
      id: 'videos',
      label: 'Video Files',
      icon: <Film className="w-3.5 h-3.5" />,
      proOnly: true,
      checked: false,
      options: [
        { key: 'quality', label: 'Quality', choices: ['Best available', 'MP4 1080p', 'MP4 720p', 'MP4 480p'], value: 'Best available' },
        { key: 'scope',   label: 'Scope',   choices: [`All (${videos.length})`, 'Last 30', 'Last 100'], value: `All (${videos.length})` },
      ],
    },
    {
      id: 'covers',
      label: 'Cover Images',
      icon: <Image className="w-3.5 h-3.5" />,
      proOnly: true,
      checked: false,
      options: [
        { key: 'format', label: 'Format', choices: ['JPG (original)', 'PNG', 'WebP'], value: 'JPG (original)' },
        { key: 'scope',  label: 'Scope',  choices: [`All (${videos.length})`, 'Last 30', 'Last 100'], value: `All (${videos.length})` },
      ],
    },
    {
      id: 'transcripts_txt',
      label: 'Transcripts — Plain Text (.txt)',
      icon: <FileText className="w-3.5 h-3.5" />,
      proOnly: false,
      checked: true,
      options: [
        { key: 'scope', label: 'Scope', choices: [`All (${videos.length})`, 'Last 30', 'Last 100'], value: `All (${videos.length})` },
      ],
    },
    {
      id: 'transcripts_srt',
      label: 'Subtitles (.srt)',
      icon: <FileText className="w-3.5 h-3.5" />,
      proOnly: true,
      checked: false,
    },
    {
      id: 'json',
      label: 'Full Data Export (.json)',
      icon: <Download className="w-3.5 h-3.5" />,
      proOnly: true,
      checked: false,
    },
    {
      id: 'csv',
      label: 'Metadata Spreadsheet (.csv)',
      icon: <Download className="w-3.5 h-3.5" />,
      proOnly: true,
      checked: false,
    },
  ]);

  const checkedSections = sections.filter(s => s.checked);
  const hasProSelected  = checkedSections.some(s => s.proOnly) && plan === 'free';
  const canStart        = checkedSections.length > 0;

  function toggleSection(id: string) {
    const sec = sections.find(s => s.id === id)!;
    if (sec.proOnly && plan === 'free') { onUpgrade(); return; }
    setSections(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  }

  function setOption(sectionId: string, optKey: string, val: string) {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, options: s.options?.map(o => o.key === optKey ? { ...o, value: val } : o) }
        : s
    ));
  }

  function startExtraction() {
    if (hasProSelected) { onUpgrade(); return; }
    if (!canStart) return;
    setPhase('running');
    setProgress(0);
    setDoneItems([]);
    const items = checkedSections.map(s => s.label);
    let i = 0;
    const tick = () => {
      i++;
      const pct = Math.round((i / items.length) * 100);
      setProgress(pct);
      setDoneItems(items.slice(0, i));
      if (i < items.length) {
        setTimeout(tick, 900 + Math.random() * 600);
      } else {
        setTimeout(() => setPhase('done'), 400);
      }
    };
    setTimeout(tick, 700);
  }

  const [openOpts, setOpenOpts] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 520,
          background: panelBg,
          borderLeft: `1px solid ${border}`,
          boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)',
          animation: 'exportPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid ${border}` }}>
              <ImageWithFallback src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-[13px]" style={{ color: text, fontWeight: 700, letterSpacing: '-0.01em' }}>Export Profile Data</p>
              <p className="text-[11px]" style={{ color: muted }}>{profile.handle} · {videos.length} videos</p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}
            onClick={onClose}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'; }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {phase === 'config' && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] mb-2" style={{ color: muted }}>
                Choose what to extract from this profile. Pro items require an active Pro plan.
              </p>

              {/* Group: Video & Image assets */}
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}`, background: sectionBg }}>
                <p className="px-4 pt-3 pb-2 text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 600 }}>Media Files</p>
                {sections.filter(s => ['videos','covers'].includes(s.id)).map((sec, i, arr) => (
                  <div key={sec.id} style={{ borderTop: i > 0 ? `1px solid ${border}` : undefined }}>
                    <ExportRow
                      sec={sec} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg}
                      plan={plan} openOpts={openOpts} setOpenOpts={setOpenOpts}
                      onToggle={() => toggleSection(sec.id)}
                      onSetOption={(k, v) => setOption(sec.id, k, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Group: Transcripts & Data */}
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}`, background: sectionBg }}>
                <p className="px-4 pt-3 pb-2 text-[10px] uppercase tracking-wider" style={{ color: muted, fontWeight: 600 }}>Transcripts & Data</p>
                {sections.filter(s => !['videos','covers'].includes(s.id)).map((sec, i) => (
                  <div key={sec.id} style={{ borderTop: i > 0 ? `1px solid ${border}` : undefined }}>
                    <ExportRow
                      sec={sec} isDark={isDark} border={border} text={text} muted={muted} hoverBg={hoverBg}
                      plan={plan} openOpts={openOpts} setOpenOpts={setOpenOpts}
                      onToggle={() => toggleSection(sec.id)}
                      onSetOption={(k, v) => setOption(sec.id, k, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Plan note for free users */}
              {plan === 'free' && (
                <div
                  className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                  style={{ background: isDark ? 'rgba(0,184,178,0.07)' : 'rgba(0,184,178,0.06)', border: '1px solid rgba(0,184,178,0.2)' }}
                >
                  <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#00b8b2' }} />
                  <div>
                    <p className="text-[11.5px]" style={{ color: text, fontWeight: 600 }}>Unlock all exports with Pro</p>
                    <p className="text-[10.5px] mt-0.5" style={{ color: muted, lineHeight: 1.55 }}>
                      Video files, cover images, SRT subtitles, JSON & CSV exports are Pro-only. Upgrade to access them.
                    </p>
                    <button
                      className="mt-2 text-[11px] px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: '#00b8b2', color: '#fff', fontWeight: 600 }}
                      onClick={onUpgrade}
                    >
                      Upgrade to Pro →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'running' && (
            <div className="flex flex-col items-center gap-5 py-10">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'} strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#00b8b2" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28 * progress / 100} ${2 * Math.PI * 28 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dasharray 0.4s ease' }}
                  />
                </svg>
                <span className="text-[13px]" style={{ color: text, fontWeight: 700 }}>{progress}%</span>
              </div>
              <div className="text-center">
                <p className="text-[13px]" style={{ color: text, fontWeight: 600 }}>Extracting data…</p>
                <p className="text-[11px] mt-1" style={{ color: muted }}>Please keep this window open</p>
              </div>
              <div className="w-full flex flex-col gap-1.5">
                {checkedSections.map(sec => {
                  const done = doneItems.includes(sec.label);
                  const active = !done && doneItems.length === checkedSections.indexOf(sec) - 1 + (doneItems.length < checkedSections.length ? 1 : 0);
                  return (
                    <div
                      key={sec.id}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: done ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : sectionBg, border: `1px solid ${done ? 'rgba(0,184,178,0.2)' : border}` }}
                    >
                      {done
                        ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00b8b2' }} />
                        : <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ color: muted }} />
                      }
                      <span className="text-[12px]" style={{ color: done ? '#00b8b2' : text, fontWeight: done ? 600 : 400 }}>{sec.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,184,178,0.12)' }}>
                <CheckCheck className="w-6 h-6" style={{ color: '#00b8b2' }} />
              </div>
              <div>
                <p className="text-[14px]" style={{ color: text, fontWeight: 700 }}>Extraction complete!</p>
                <p className="text-[11.5px] mt-1" style={{ color: muted, lineHeight: 1.6 }}>
                  Your files have been prepared and are ready to download.<br />
                  Check your downloads folder.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-4 py-2 rounded-xl text-[12px] transition-all"
                  style={{ background: '#00b8b2', color: '#fff', fontWeight: 600 }}
                  onClick={onClose}
                >
                  Done
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-[12px] transition-all"
                  style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', fontWeight: 500 }}
                  onClick={() => { setPhase('config'); setProgress(0); setDoneItems([]); }}
                >
                  Export more
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        {phase === 'config' && (
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderTop: `1px solid ${border}` }}
          >
            <span className="text-[11px]" style={{ color: muted }}>
              {checkedSections.length} item{checkedSections.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={startExtraction}
              disabled={!canStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] transition-all"
              style={{
                background: canStart ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb'),
                color: canStart ? '#fff' : muted,
                fontWeight: 600,
                cursor: canStart ? 'pointer' : 'not-allowed',
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              Start Extraction
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes exportPanelIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}

// ─── Export Row (single item inside the export panel) ─────────────────────────
function ExportRow({
  sec, isDark, border, text, muted, hoverBg, plan, openOpts, setOpenOpts, onToggle, onSetOption,
}: {
  sec: ExportSection;
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  plan: 'free' | 'pro';
  openOpts: string | null;
  setOpenOpts: (k: string | null) => void;
  onToggle: () => void;
  onSetOption: (k: string, v: string) => void;
}) {
  const locked = sec.proOnly && plan === 'free';

  return (
    <div className="px-4 py-3">
      {/* Row header */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        {/* Checkbox */}
        <div
          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: sec.checked ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
            border: `1.5px solid ${sec.checked ? '#00b8b2' : (isDark ? 'rgba(255,255,255,0.18)' : '#d1d5db')}`,
          }}
        >
          {sec.checked && <CheckCheck className="w-2.5 h-2.5 text-white" />}
        </div>

        <span className="flex-shrink-0" style={{ color: muted }}>{sec.icon}</span>
        <span className="flex-1 text-[12px]" style={{ color: locked ? muted : text, fontWeight: 500 }}>{sec.label}</span>

        {locked ? (
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: muted, border: `1px solid ${border}`, fontWeight: 600 }}
          >
            <Lock className="w-2.5 h-2.5" /> Pro
          </span>
        ) : (
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]"
            style={{ background: 'rgba(0,184,178,0.1)', color: '#00b8b2', border: '1px solid rgba(0,184,178,0.2)', fontWeight: 600 }}
          >
            Free
          </span>
        )}
      </div>

      {/* Options (only when checked and has options) */}
      {sec.checked && !locked && sec.options && (
        <div className="mt-2.5 ml-7 flex flex-wrap gap-2">
          {sec.options.map(opt => (
            <div key={opt.key} className="relative">
              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : '#efefef',
                  color: text,
                  border: `1px solid ${border}`,
                  fontWeight: 500,
                }}
                onClick={e => { e.stopPropagation(); setOpenOpts(openOpts === `${sec.id}-${opt.key}` ? null : `${sec.id}-${opt.key}`); }}
              >
                <span style={{ color: muted, fontSize: '0.65rem', fontWeight: 500 }}>{opt.label}:</span>
                {opt.value}
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${openOpts === `${sec.id}-${opt.key}` ? 'rotate-180' : ''}`} style={{ color: muted }} />
              </button>
              {openOpts === `${sec.id}-${opt.key}` && (
                <>
                  <div className="fixed inset-0 z-40" onClick={e => { e.stopPropagation(); setOpenOpts(null); }} />
                  <div
                    className="absolute left-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1 flex flex-col"
                    style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, minWidth: 140 }}
                  >
                    {opt.choices.map(c => (
                      <button
                        key={c}
                        className="text-left px-3 py-1.5 text-[11px] w-full"
                        style={{ color: opt.value === c ? '#00b8b2' : muted, background: opt.value === c ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: opt.value === c ? 600 : 400 }}
                        onClick={e => { e.stopPropagation(); onSetOption(opt.key, c); setOpenOpts(null); }}
                        onMouseEnter={ev => { if (opt.value !== c) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'; }}
                        onMouseLeave={ev => { if (opt.value !== c) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >{c}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Creator Profile Header ───────────────────────────────────────────────────
function CreatorHeader({
  profile, isDark, border, text, muted, compact, onExport,
}: {
  profile: CreatorProfile;
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  compact: boolean;
  onExport?: () => void;
}) {
  const cardBg = isDark ? '#141414' : '#ffffff';

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${border}`, background: cardBg }}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm truncate" style={{ color: text, fontWeight: 600 }}>{profile.displayName}</span>
            {profile.verified && <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3b82f6' }} />}
          </div>
          <span className="text-[11px]" style={{ color: muted }}>{profile.handle}</span>
        </div>
        <div className="flex gap-1">
          {profile.platforms.map(p => <PlatformBadge key={p} platform={p} isDark={isDark} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>

      {/* ── Body: avatar left + info right ── */}
      <div
        className="flex items-start gap-5 px-6 py-5"
        style={{ background: isDark ? '#0d0d0d' : '#ffffff' }}
      >
        {/* Avatar */}
        <div
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: 72,
            height: 72,
            border: `1.5px solid ${border}`,
          }}
        >
          <ImageWithFallback
            src={profile.avatar}
            alt={profile.displayName}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0">

          {/* Identity + action buttons */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 style={{ color: text, fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  {profile.displayName}
                </h1>
                {profile.verified && (
                  <BadgeCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#3b82f6' }} />
                )}
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: muted }}>{profile.handle}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={{
                    background: isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)',
                    color: '#00b8b2',
                    border: '1px solid rgba(0,184,178,0.25)',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(0,184,178,0.2)' : 'rgba(0,184,178,0.14)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)'; }}
                >
                  <Download className="w-3 h-3" />
                  Export Profile
                </button>
              )}
            </div>
          </div>

          {/* Platform badges */}
          

          {/* Bio */}
          <p className="text-xs mb-3" style={{ color: muted, lineHeight: 1.65, maxWidth: 520 }}>
            {profile.bio}
          </p>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: <Users className="w-3 h-3" />,    val: profile.followers,          label: 'followers' },
              { icon: <Video className="w-3 h-3" />,    val: String(profile.videoCount), label: 'videos' },
              { icon: <FileText className="w-3 h-3" />, val: profile.totalWords,         label: 'words transcribed' },
            ].map(s => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${border}`,
                  color: muted,
                }}
              >
                <span style={{ color: muted }}>{s.icon}</span>
                <strong style={{ color: text }}>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CreatorProfilePage() {
  const { creator = '' } = useParams<{ creator: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggle } = useContext(ThemeContext);

  const { plan, openUpgrade } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<CreatorVideo | null>(null);
  const [panelVideo, setPanelVideo] = useState<CreatorVideo | null>(null);
  const [showExportPanel, setShowExportPanel] = useState(false);

  // Filter / search state
  const [searchQuery, setSearchQuery]                   = useState('');
  const [activePlatform, setActivePlatform]             = useState('All');
  const [sortBy, setSortBy]                             = useState('date-desc');
  const [filterSearchFocused, setFilterSearchFocused]   = useState(false);
  const [activeDuration, setActiveDuration]             = useState('All');
  const [activeWords, setActiveWords]                   = useState('All');
  const [openDropdown, setOpenDropdown]                 = useState<string | null>(null);
  const [currentPage, setCurrentPage]                   = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Theme tokens
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const cardBg  = isDark ? '#141414' : '#f9fafb';

  // Resolve creator data
  const stateAvatar = location.state?.avatar as string | undefined;
  const handle = creator.startsWith('@') ? creator : `@${creator}`;
  const profile = useMemo(() => getCreatorProfile(handle, stateAvatar), [handle, stateAvatar]);
  const videos  = useMemo(() => getCreatorVideos(handle), [handle]);

  // Filtered + sorted videos
  const filteredVideos = useMemo(() => {
    let result = videos.filter(v => {
      if (activePlatform !== 'All' && v.platform !== activePlatform) return false;
      const q = searchQuery.toLowerCase();
      if (q && !v.title.toLowerCase().includes(q) && !v.transcriptSnippet.toLowerCase().includes(q)) return false;
      if (activeDuration !== 'All') {
        const [m, s] = v.duration.split(':').map(Number);
        const totalSec = (m || 0) * 60 + (s || 0);
        if (activeDuration === '<1 min'  && totalSec >= 60)  return false;
        if (activeDuration === '1–3 min' && (totalSec < 60 || totalSec > 180)) return false;
        if (activeDuration === '3+ min'  && totalSec <= 180) return false;
      }
      if (activeWords !== 'All') {
        if (activeWords === '<1K'   && v.words >= 1000) return false;
        if (activeWords === '1K–5K' && (v.words < 1000 || v.words > 5000)) return false;
        if (activeWords === '5K+'   && v.words <= 5000) return false;
      }
      return true;
    });
    if (sortBy === 'date-asc')   result = [...result].reverse();
    if (sortBy === 'words-desc') result = [...result].sort((a, b) => b.words - a.words);
    if (sortBy === 'words-asc')  result = [...result].sort((a, b) => a.words - b.words);
    return result;
  }, [videos, searchQuery, activePlatform, activeDuration, activeWords, sortBy]);

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest first';
  const hasActiveFilters = activePlatform !== 'All' || activeDuration !== 'All' || activeWords !== 'All' || sortBy !== 'date-desc' || !!searchQuery;
  const clearFilters = () => { setSearchQuery(''); setActivePlatform('All'); setActiveDuration('All'); setActiveWords('All'); setSortBy('date-desc'); setCurrentPage(1); };
  const paginatedVideos = filteredVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Platform stats (based on full video list, not filtered)
  const platformStats = useMemo(() => {
    const src = activePlatform === 'All' ? videos : videos.filter(v => v.platform === activePlatform);
    const totalWords = src.reduce((sum, v) => sum + v.words, 0);
    return { count: src.length, words: totalWords };
  }, [videos, activePlatform]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, activePlatform, activeDuration, activeWords, sortBy]);

  // Clear the nav-source tag whenever this page unmounts (browser Back, link click, etc.)
  // so a stale 'profiles' value never bleeds into a later navigation from Dashboard or elsewhere.
  useEffect(() => {
    return () => { sessionStorage.removeItem('creatorNavFrom'); };
  }, []);

  // Build TranscriptDetailVideo from selected CreatorVideo
  const detailVideo = useMemo<TranscriptDetailVideo | null>(() => {
    if (!selectedVideo) return null;
    return {
      title:       selectedVideo.title,
      creator:     profile.handle,
      platform:    selectedVideo.platform,
      likes:       '61K',
      duration:    selectedVideo.duration,
      language:    'EN',
      date:        selectedVideo.date,
      wordCount:   selectedVideo.words,
      charCount:   Math.round(selectedVideo.words * 5.1),
      sentences:   Math.round(selectedVideo.words / 13),
      readability: selectedVideo.words > 5000 ? 'Grade 5' : 'Grade 3',
      thumbnail:   selectedVideo.thumbnail,
      avatar:      profile.avatar,
    };
  }, [selectedVideo, profile]);

  const detailTranscript = useMemo<string[]>(() => {
    if (!selectedVideo) return [];
    return [selectedVideo.transcriptSnippet, ...FILLER_PARAGRAPHS];
  }, [selectedVideo]);

  const relatedVideos = useMemo<RelatedVideo[]>(() => {
    return videos
      .filter(v => v.id !== selectedVideo?.id)
      .slice(0, 3)
      .map(v => ({
        title:    v.title,
        creator:  profile.handle,
        duration: v.duration,
        views:    `${Math.round(v.words / 420)}K`,
        thumb:    v.thumbnail,
      }));
  }, [videos, selectedVideo, profile]);

  const showDetail = !!selectedVideo && !!detailVideo;

  // Panel overlay (Discover-style) data
  const panelDetailVideo = useMemo<TranscriptDetailVideo | null>(() => {
    if (!panelVideo) return null;
    return {
      title:       panelVideo.title,
      creator:     profile.handle,
      platform:    panelVideo.platform,
      likes:       '61K',
      duration:    panelVideo.duration,
      language:    'EN',
      date:        panelVideo.date,
      wordCount:   panelVideo.words,
      charCount:   Math.round(panelVideo.words * 5.1),
      sentences:   Math.round(panelVideo.words / 13),
      readability: panelVideo.words > 5000 ? 'Grade 5' : 'Grade 3',
      thumbnail:   panelVideo.thumbnail,
      avatar:      profile.avatar,
    };
  }, [panelVideo, profile]);

  const panelTranscript = useMemo<string[]>(() => {
    if (!panelVideo) return [];
    return [panelVideo.transcriptSnippet, ...FILLER_PARAGRAPHS];
  }, [panelVideo]);

  const panelRelated = useMemo<RelatedVideo[]>(() => {
    return videos
      .filter(v => v.id !== panelVideo?.id)
      .slice(0, 3)
      .map(v => ({
        title:    v.title,
        creator:  profile.handle,
        duration: v.duration,
        views:    `${Math.round(v.words / 420)}K`,
        thumb:    v.thumbnail,
      }));
  }, [videos, panelVideo, profile]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bg }}>

      {/* ══ TOP HEADER ══════════════════════════════════════════════════════ */}
      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar activePage="discover" collapsed={sidebarCollapsed} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Sub-header / breadcrumb ── */}
          <header
            className="flex items-center justify-between px-5 h-[52px] flex-shrink-0"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            {(() => {
              // sessionStorage is written by the originating page before navigate() is
              // called, making it more reliable than React Router state (which can be
              // stale from a previous history entry). Use it as the primary source.
              const _ss = sessionStorage.getItem('creatorNavFrom');
              const navFrom = _ss ?? location.state?.from ?? 'discover';
              const fromTranscript = navFrom === 'transcript';
              const fromProfiles   = navFrom === 'profiles';
              const backLabel = fromTranscript
                ? (location.state?.videoTitle as string) || 'Transcript'
                : fromProfiles
                  ? 'Profiles'
                  : 'Discover';
              const handleBack = () => {
                // Clear the tag so navigating directly to a creator later starts fresh.
                sessionStorage.removeItem('creatorNavFrom');
                navigate(-1);
              };
              return (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
                    style={{ color: muted }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={handleBack}
                    className="text-xs transition-colors truncate max-w-[180px]"
                    style={{ color: muted }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                    title={backLabel}
                  >
                    {backLabel}
                  </button>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: isDark ? '#444444' : '#d1d5db' }} />
                  <span className="text-xs" style={{ color: text, fontWeight: 600 }}>{profile.displayName}</span>
                </div>
              );
            })()}
          </header>

          {showDetail ? (
            /* ── SPLIT VIEW: left panel + detail panel ── */
            <div className="flex flex-1 overflow-hidden">

              {/* Left: compact creator header + scrollable video list */}
              <div
                className="flex flex-col flex-shrink-0 overflow-hidden"
                style={{ width: 320, borderRight: `1px solid ${border}` }}
              >
                <CreatorHeader
                  profile={profile}
                  isDark={isDark}
                  border={border}
                  text={text}
                  muted={muted}
                  compact
                  onExport={() => setShowExportPanel(true)}
                />
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {videos.map(v => (
                      <VideoCard
                        key={v.id}
                        video={v}
                        creator={profile.handle}
                        isDark={isDark}
                        border={border}
                        text={text}
                        muted={muted}
                        hoverBg={hoverBg}
                        onSelect={setSelectedVideo}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: TranscriptDetailPanel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TranscriptDetailPanel
                  video={detailVideo!}
                  transcript={detailTranscript}
                  related={relatedVideos}
                  downloadFormats={DOWNLOAD_FORMATS}
                  isDark={isDark}
                  bg={bg}
                  border={border}
                  text={text}
                  muted={muted}
                  hoverBg={hoverBg}
                  cardBg={cardBg}
                  onBack={() => setSelectedVideo(null)}
                  onViewCreator={(c) => { sessionStorage.setItem('creatorNavFrom', 'transcript'); navigate(`/profile/${encodeURIComponent(c)}`, {
                    state: { from: 'transcript', videoTitle: selectedVideo?.title ?? '', fromPath: location.pathname }
                  }); }}
                />
              </div>

            </div>
          ) : (
            /* ── FULL VIEW: creator header + filter bar + video grid ── */
            <div className="flex flex-col flex-1 overflow-hidden">
              <CreatorHeader
                profile={profile}
                isDark={isDark}
                border={border}
                text={text}
                muted={muted}
                compact={false}
                onExport={() => setShowExportPanel(true)}
              />

              {/* ── Filter Bar ── */}
              <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0 overflow-x-auto" style={{ borderBottom: `1px solid ${border}` }}>

                {/* Search */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
                  style={{
                    background: filterSearchFocused ? (isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6') : 'transparent',
                    border: `1px solid ${filterSearchFocused ? border : 'transparent'}`,
                    color: muted, width: 220, transition: 'all 0.15s',
                  }}
                >
                  <Search className="w-3.5 h-3.5 flex-shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setFilterSearchFocused(true)}
                    onBlur={() => setFilterSearchFocused(false)}
                    placeholder="Search videos…"
                    className="flex-1 bg-transparent outline-none text-xs min-w-0"
                    style={{ color: text }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="flex-shrink-0 hover:opacity-60" style={{ color: muted }}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />

                {/* Platform tabs */}
                {(['All', 'TikTok', 'Instagram', 'YouTube'] as const).map(tab => {
                  const isActive = activePlatform === tab;
                  const tabIcons: Record<string, JSX.Element | null> = {
                    All: null,
                    TikTok: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>,
                    Instagram: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
                    YouTube: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => { setActivePlatform(tab); setCurrentPage(1); }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] flex-shrink-0 transition-all"
                      style={{
                        background: isActive
                          ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)')
                          : 'transparent',
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

                {/* Duration */}
                <div className="relative flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: activeDuration !== 'All' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                      color: activeDuration !== 'All' ? '#00b8b2' : muted,
                      border: `1px solid ${activeDuration !== 'All' ? 'rgba(0,184,178,0.25)' : border}`,
                      fontWeight: activeDuration !== 'All' ? 500 : 400,
                    }}
                    onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
                  >
                    <Clock className="w-3 h-3" />
                    {activeDuration !== 'All' ? activeDuration : 'Duration'}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'duration' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'duration' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 120 }}>
                        {['All', '<1 min', '1–3 min', '3+ min'].map(opt => (
                          <button key={opt} onClick={() => { setActiveDuration(opt); setOpenDropdown(null); }}
                            className="w-full text-left px-3 py-2 text-xs transition-colors"
                            style={{ color: activeDuration === opt ? '#00b8b2' : muted, background: activeDuration === opt ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: activeDuration === opt ? 500 : 400 }}
                            onMouseEnter={ev => { if (activeDuration !== opt) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (activeDuration !== opt) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >{opt}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Words */}
                <div className="relative flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: activeWords !== 'All' ? (isDark ? 'rgba(0,184,178,0.12)' : 'rgba(0,184,178,0.08)') : (isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'),
                      color: activeWords !== 'All' ? '#00b8b2' : muted,
                      border: `1px solid ${activeWords !== 'All' ? 'rgba(0,184,178,0.25)' : border}`,
                      fontWeight: activeWords !== 'All' ? 500 : 400,
                    }}
                    onClick={() => setOpenDropdown(openDropdown === 'words' ? null : 'words')}
                  >
                    <FileText className="w-3 h-3" />
                    {activeWords !== 'All' ? activeWords : 'Words'}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'words' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'words' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 110 }}>
                        {['All', '<1K', '1K–5K', '5K+'].map(opt => (
                          <button key={opt} onClick={() => { setActiveWords(opt); setOpenDropdown(null); }}
                            className="w-full text-left px-3 py-2 text-xs transition-colors"
                            style={{ color: activeWords === opt ? '#00b8b2' : muted, background: activeWords === opt ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: activeWords === opt ? 500 : 400 }}
                            onMouseEnter={ev => { if (activeWords !== opt) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (activeWords !== opt) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >{opt}</button>
                        ))}
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
                      fontWeight: sortBy !== 'date-desc' ? 500 : 400,
                    }}
                    onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    {sortLabel}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'sort' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute left-0 top-full mt-1 rounded-xl shadow-xl overflow-hidden z-50 py-1" style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, minWidth: 130 }}>
                        {SORT_OPTIONS.map(opt => (
                          <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                            className="w-full text-left px-3 py-2 text-xs transition-colors"
                            style={{ color: sortBy === opt.value ? '#00b8b2' : muted, background: sortBy === opt.value ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,184,178,0.05)') : 'transparent', fontWeight: sortBy === opt.value ? 500 : 400 }}
                            onMouseEnter={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (sortBy !== opt.value) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >{opt.label}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <>
                    <div className="w-px h-4 flex-shrink-0" style={{ background: border }} />
                    <button
                      className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70 flex-shrink-0"
                      style={{ color: '#00b8b2', fontWeight: 500 }}
                      onClick={clearFilters}
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  </>
                )}

              </div>

              {/* ── Platform Stats Row — only visible when a specific platform is active ── */}
              {activePlatform !== 'All' && (
                <div
                  className="flex items-center gap-4 px-6 py-2.5 flex-shrink-0"
                  style={{
                    borderBottom: `1px solid ${border}`,
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <span className="text-[11px]" style={{ color: muted }}>
                    <strong style={{ color: text }}>{platformStats.count}</strong>{' '}
                    {activePlatform} video{platformStats.count !== 1 ? 's' : ''}
                  </span>
                  <span className="w-px h-3 flex-shrink-0" style={{ background: border }} />
                  <span className="text-[11px]" style={{ color: muted }}>
                    <strong style={{ color: text }}>
                      {platformStats.words >= 1000
                        ? `${(platformStats.words / 1000).toFixed(1)}K`
                        : platformStats.words}
                    </strong>{' '}
                    words transcribed
                  </span>
                  <span className="w-px h-3 flex-shrink-0" style={{ background: border }} />
                  <span className="text-[11px]" style={{ color: muted }}>
                    <strong style={{ color: text }}>
                      {platformStats.count > 0
                        ? (platformStats.words / platformStats.count >= 1000
                            ? `${((platformStats.words / platformStats.count) / 1000).toFixed(1)}K`
                            : Math.round(platformStats.words / platformStats.count))
                        : 0}
                    </strong>{' '}
                    avg words/video
                  </span>
                  <span className="w-px h-3 flex-shrink-0" style={{ background: border }} />
                  <span className="text-[11px]" style={{ color: muted }}>
                    <strong style={{ color: text }}>
                      {platformStats.words > 0 ? `${Math.round(platformStats.words / 200)}m` : '0m'}
                    </strong>{' '}
                    est. read time
                  </span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-5">
                
                {filteredVideos.length > 0 ? (
                  <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}>
                    {paginatedVideos.map(v => (
                      <VideoCard
                        key={v.id}
                        video={v}
                        creator={profile.handle}
                        isDark={isDark}
                        border={border}
                        text={text}
                        muted={muted}
                        hoverBg={hoverBg}
                        onSelect={setPanelVideo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Search className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db' }} />
                    <p style={{ color: muted, fontSize: '0.875rem' }}>No videos match your filters</p>
                    <button className="text-xs" style={{ color: '#00b8b2' }} onClick={clearFilters}>Clear all filters</button>
                  </div>
                )}

                {/* ── Pagination ── */}
                {filteredVideos.length > ITEMS_PER_PAGE && (() => {
                  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
                  const pages: (number | '…')[] = [];
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                      pages.push(i);
                    } else if (pages[pages.length - 1] !== '…') {
                      pages.push('…');
                    }
                  }
                  const btnBase: React.CSSProperties = {
                    minWidth: 30, height: 30, borderRadius: 8, fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.12s', border: `1px solid ${border}`,
                  };
                  return (
                    <div className="flex items-center justify-center gap-1 pt-6 pb-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{ ...btnBase, color: currentPage === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted, background: 'transparent', borderColor: currentPage === 1 ? 'transparent' : border, paddingLeft: 8, paddingRight: 8 }}
                        onMouseEnter={ev => { if (currentPage !== 1) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                      </button>

                      {pages.map((p, i) =>
                        p === '…' ? (
                          <span key={`ellipsis-${i}`} style={{ color: muted, fontSize: 12, padding: '0 4px' }}>…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p as number)}
                            style={{
                              ...btnBase,
                              background: currentPage === p ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent',
                              color: currentPage === p ? text : muted,
                              borderColor: border,
                              fontWeight: currentPage === p ? 600 : 400,
                            }}
                            onMouseEnter={ev => { if (currentPage !== p) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                            onMouseLeave={ev => { if (currentPage !== p) (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >{p}</button>
                        )
                      )}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{ ...btnBase, color: currentPage === totalPages ? (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') : muted, background: 'transparent', borderColor: currentPage === totalPages ? 'transparent' : border, paddingLeft: 8, paddingRight: 8 }}
                        onMouseEnter={ev => { if (currentPage !== totalPages) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Export Profile Panel ─────────────────────────────────────────────── */}
      {showExportPanel && (
        <ExportProfilePanel
          profile={profile}
          videos={videos}
          plan={plan}
          isDark={isDark}
          border={border}
          text={text}
          muted={muted}
          hoverBg={hoverBg}
          onClose={() => setShowExportPanel(false)}
          onUpgrade={() => { setShowExportPanel(false); openUpgrade(); }}
        />
      )}

      {/* ── Discover-style transcript overlay panel ── */}
      {panelVideo && panelDetailVideo && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)' }}
            onClick={() => setPanelVideo(null)}
          />
          {/* Slide-in panel */}
          <div
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
            style={{
              width: 860,
              background: isDark ? '#141414' : '#ffffff',
              borderLeft: `1px solid ${border}`,
              boxShadow: isDark ? '-12px 0 40px rgba(0,0,0,0.6)' : '-6px 0 32px rgba(0,0,0,0.1)',
              animation: 'creatorPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <TranscriptDetailPanel
              video={panelDetailVideo}
              transcript={panelTranscript}
              related={panelRelated}
              downloadFormats={DOWNLOAD_FORMATS}
              isDark={isDark}
              bg={isDark ? '#141414' : '#ffffff'}
              border={border}
              text={text}
              muted={muted}
              hoverBg={isDark ? 'rgba(255,255,255,0.04)' : '#efefed'}
              cardBg={isDark ? '#1a1a1a' : '#f3f4f6'}
              onBack={() => setPanelVideo(null)}
              onViewCreator={(c) => {
                sessionStorage.setItem('creatorNavFrom', 'transcript');
                setPanelVideo(null);
                navigate(`/profile/${encodeURIComponent(c)}`, {
                  state: { from: 'transcript', videoTitle: panelVideo?.title ?? '', fromPath: location.pathname },
                });
              }}
            />
          </div>
          <style>{`
            @keyframes creatorPanelIn {
              from { transform: translateX(100%); opacity: 0.5; }
              to   { transform: translateX(0);    opacity: 1;   }
            }
          `}</style>
        </>
      )}
    </div>
  );
}