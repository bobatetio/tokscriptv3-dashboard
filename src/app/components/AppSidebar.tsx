/**
 * AppSidebar – universal left navigation used across ALL logged-in pages.
 */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus, LayoutDashboard, BookOpen, Compass,
  ChevronRight, ChevronDown, Settings, HelpCircle, LogOut, Folder, Zap,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { FolderContext } from '../context/FolderContext';
import { UserContext, FREE_LIMITS } from '../context/UserContext';
import svgPathsLock from '../../imports/svg-ri7w7ruor2';
import svgPathsLockLight from '../../imports/svg-hfbknm512l';
import imgBannerBg from '../../assets/b3a148853965f0eea6c20b8748026b122bc3fc9c.png';
import imgBannerBgLight from '../../assets/ad9c0482dcac9cb102e3083cdd68a90c0bd9c4dc.png';
import imgRocket from '../../assets/9bf39e8d7f131ea242d7146ac4fd23d28eccaa3e.png';

export type SidebarPage =
  | 'dashboard' | 'new-transcription' | 'prompt-base'
  | 'discover' | 'settings' | 'profiles';

export type LibraryItem = 'singles' | 'collections' | 'bulk' | 'favourites';

interface AppSidebarProps {
  activePage: SidebarPage;
  collapsed: boolean;
  activeFolderId?: number;
  // Dashboard-specific overrides
  onNewTranscript?: () => void;
  activeLibraryItem?: LibraryItem;
  activeGroupId?: number;
  onSelectSingles?: () => void;
  onSelectCollections?: () => void;
  onSelectBulk?: () => void;
  onSelectGroup?: (cat: 'collections' | 'bulk', id: number) => void;
  onSelectFavourites?: () => void;
  favouritesCount?: number;
}

// ── Mirror of DashboardPage mock data ─────────────────────────────────────────
const COLLECTIONS = [
  { id: 101, name: 'Q1 Product Reviews',    count: 4 },
  { id: 102, name: 'User Research Series',  count: 3 },
  { id: 103, name: 'Marketing Campaigns',   count: 5 },
];

const BULK = [
  { id: 301, name: 'Conference 2026 Batch', count: 6 },
  { id: 302, name: 'Onboarding Videos',     count: 3 },
];

const SINGLES_COUNT = 20;
const FAVOURITES_ID = 500;

export function AppSidebar({
  activePage,
  collapsed,
  activeFolderId,
  onNewTranscript,
  activeLibraryItem,
  activeGroupId,
  onSelectSingles,
  onSelectCollections,
  onSelectBulk,
  onSelectGroup,
  onSelectFavourites,
  favouritesCount,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const { folders, createFolder } = useContext(FolderContext);
  const { plan, openUpgrade, transcriptionsUsed, transcriptionsLimit } = useContext(UserContext);

  const [collectionsOpen, setCollectionsOpen] = useState(activeLibraryItem === 'collections');
  const [bulkOpen,        setBulkOpen]        = useState(activeLibraryItem === 'bulk');
  const [foldersOpen,     setFoldersOpen]     = useState(true);
  const [userMenuOpen,    setUserMenuOpen]     = useState(false);
  const [newFolderMode,   setNewFolderMode]   = useState(false);
  const [newFolderName,   setNewFolderName]   = useState('');
  const menuRef          = useRef<HTMLDivElement>(null);
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  // Keep expandable sections open when parent drives them active
  useEffect(() => {
    if (activeLibraryItem === 'collections') setCollectionsOpen(true);
    if (activeLibraryItem === 'bulk')        setBulkOpen(true);
  }, [activeLibraryItem]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // ── Colour tokens ─────────────────────────────────────────────────────────
  const sidebarBg = isDark ? '#111111' : '#fafafa';
  const border    = isDark ? '#262626' : '#e5e7eb';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#888888' : '#6b7280';
  const subtle    = isDark ? '#262626' : '#d1d5db';

  const isActive   = (page: SidebarPage) => activePage === page;
  const navBg      = (page: SidebarPage) => isActive(page) ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent';
  const navColor   = (page: SidebarPage) => isActive(page) ? text : (isDark ? 'rgba(255,255,255,0.55)' : muted);
  const navIcon    = (page: SidebarPage) => isActive(page) ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.45)' : muted);
  const goToDash   = () => navigate('/dashboard');

  // ── Library item active helpers ────────────────────────────────────────────
  const isLibActive  = (item: LibraryItem) => activeLibraryItem === item;
  const libBg        = (item: LibraryItem) => isLibActive(item) ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent';
  const libColor     = (item: LibraryItem) => isLibActive(item) ? text : (isDark ? 'rgba(255,255,255,0.55)' : muted);
  const libIconColor = (item: LibraryItem) => isLibActive(item) ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.45)' : muted);
  const isGroupActive = (id: number) => activeGroupId === id;

  // ── New folder helpers ────────────────────────────────────────────────────
  const handleNewFolder = () => {
    if (plan === 'free' && folders.length >= FREE_LIMITS.folders) {
      openUpgrade();
      return;
    }
    setFoldersOpen(true);
    setNewFolderMode(true);
    setTimeout(() => newFolderInputRef.current?.focus(), 50);
  };

  const commitNewFolder = () => {
    const trimmed = newFolderName.trim();
    if (trimmed) {
      const id = createFolder(trimmed);
      navigate(`/folder/${id}`);
    }
    setNewFolderName('');
    setNewFolderMode(false);
  };

  // ── Collapsed state ───────────────────────────────────────────────────────
  if (collapsed) {
    const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    const visibleFolders = plan === 'free' ? folders.slice(0, FREE_LIMITS.folders) : folders;

    return (
      <aside
        className="flex flex-col flex-shrink-0 h-full"
        style={{ width: 52, borderRight: `1px solid ${border}`, background: sidebarBg }}
      >
        {/* + New Transcript button */}
        <div className="flex items-center justify-center pt-4 pb-2 flex-shrink-0">
          <button
            title="New Transcript"
            onClick={onNewTranscript ?? goToDash}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#ffffff' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#2a2a2a' : '#333'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111'; }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Icon-only navigation */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center gap-0.5 pt-3">
          {/* ── MENU ── */}
          <button
            title="Dashboard"
            onClick={goToDash}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: navBg('dashboard') }}
            onMouseEnter={e => { if (!isActive('dashboard')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isActive('dashboard')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <LayoutDashboard className="w-[18px] h-[18px]" style={{ color: navIcon('dashboard') }} strokeWidth={isActive('dashboard') ? 2 : 1.75} />
          </button>
          <button
            title="Prompt Base"
            onClick={() => navigate('/prompt-base')}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: navBg('prompt-base') }}
            onMouseEnter={e => { if (!isActive('prompt-base')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isActive('prompt-base')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <BookOpen className="w-[18px] h-[18px]" style={{ color: navIcon('prompt-base') }} strokeWidth={isActive('prompt-base') ? 2 : 1.75} />
          </button>
          <button
            title="Discover"
            onClick={() => navigate('/discover')}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: navBg('discover') }}
            onMouseEnter={e => { if (!isActive('discover')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isActive('discover')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <Compass className="w-[18px] h-[18px]" style={{ color: navIcon('discover') }} strokeWidth={isActive('discover') ? 2 : 1.75} />
          </button>

          {/* Separator */}
          <div className="my-1.5 flex-shrink-0" style={{ width: 20, height: 1, background: border }} />

          {/* ── LIBRARY ── */}
          <button
            title="Singles"
            onClick={onSelectSingles ?? (() => navigate('/dashboard', { state: { view: 'singles' } }))}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: libBg('singles') }}
            onMouseEnter={e => { if (!isLibActive('singles')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isLibActive('singles')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: libIconColor('singles') }}>
              <path d="M2 20L5.52396 14.9098C5.86325 14.4198 6.0329 14.1747 6.25638 14.0603C6.45278 13.9597 6.67692 13.9269 6.8939 13.967C7.1408 14.0126 7.37353 14.1988 7.83898 14.5712L8.38213 15.0057C8.59864 15.1789 8.70689 15.2655 8.82352 15.29C8.92612 15.3115 9.0329 15.3002 9.12875 15.2578C9.2377 15.2095 9.32549 15.1022 9.50105 14.8876L12.3804 11.3683C12.7684 10.8942 12.9624 10.6571 13.1997 10.5613C13.4081 10.477 13.6389 10.4655 13.8547 10.5286C14.1004 10.6004 14.317 10.817 14.7502 11.2502L17 13.5M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8ZM9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7Z" stroke="currentColor" strokeWidth={isLibActive('singles') ? 2 : 1.75} strokeLinejoin="round" />
            </svg>
          </button>
          <button
            title="Collections"
            onClick={() => {
              if (onSelectCollections) onSelectCollections();
              else navigate('/dashboard', { state: { view: 'collections' } });
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: libBg('collections') }}
            onMouseEnter={e => { if (!isLibActive('collections')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isLibActive('collections')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: libIconColor('collections') }}>
              <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8Z" stroke="currentColor" strokeLinecap="round" strokeWidth={isLibActive('collections') ? 2 : 1.75} />
              <path d="M6.03174 10.8997V10.7904C6.03174 9.51802 6.03174 8.88185 6.29976 8.49597C6.53384 8.15896 6.89576 7.93255 7.30121 7.86949C7.76546 7.79729 8.33752 8.07559 9.48165 8.63219L9.57799 8.67906C10.8284 9.28734 11.4535 9.59149 11.6825 10.0271C11.8822 10.4069 11.9097 10.854 11.758 11.2554C11.584 11.7157 11.0007 12.094 9.83413 12.8507L9.7378 12.9132C8.53146 13.6957 7.92829 14.0869 7.42916 14.0527C6.99422 14.0229 6.59377 13.8054 6.33207 13.4567C6.03174 13.0566 6.03174 12.3376 6.03174 10.8997Z" stroke="currentColor" strokeLinecap="round" strokeWidth={isLibActive('collections') ? 2 : 1.75} />
            </svg>
          </button>
          <button
            title="Bulks"
            onClick={() => {
              if (onSelectBulk) onSelectBulk();
              else navigate('/dashboard', { state: { view: 'bulk' } });
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: libBg('bulk') }}
            onMouseEnter={e => { if (!isLibActive('bulk')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isLibActive('bulk')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: libIconColor('bulk') }}>
              <path d="M5 6L13 6M5 10L13 10M5 14H9M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8Z" stroke="currentColor" strokeWidth={isLibActive('bulk') ? 2 : 1.75} strokeLinecap="round" />
            </svg>
          </button>
          <button
            title="Profiles"
            onClick={() => navigate('/profiles')}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: isActive('profiles') ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent' }}
            onMouseEnter={e => { if (!isActive('profiles')) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { if (!isActive('profiles')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: isActive('profiles') ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.45)' : muted) }}>
              <path d="M16 20C16 17.2386 13.7614 15 11 15H7C4.23858 15 2 17.2386 2 20M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8ZM11.5532 9C11.5532 10.4101 10.4101 11.5532 9 11.5532C7.58989 11.5532 6.44678 10.4101 6.44678 9C6.44678 7.58989 7.58989 6.44678 9 6.44678C10.4101 6.44678 11.5532 7.58989 11.5532 9Z" stroke="currentColor" strokeWidth={isActive('profiles') ? 2 : 1.75} strokeLinecap="round" />
            </svg>
          </button>

          {/* Separator before folders */}
          {visibleFolders.length > 0 && (
            <div className="my-1.5 flex-shrink-0" style={{ width: 20, height: 1, background: border }} />
          )}

          {/* ── FOLDERS ── */}
          {visibleFolders.map((f) => {
            const isFavourites = f.id === FAVOURITES_ID;
            const isActiveFolder = activeFolderId === f.id ||
              (isFavourites && activeLibraryItem === 'favourites');
            const handleClick = isFavourites && onSelectFavourites
              ? onSelectFavourites
              : () => navigate(`/folder/${f.id}`);

            return (
              <button
                key={f.id}
                title={f.name}
                onClick={handleClick}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                style={{ background: isActiveFolder ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent' }}
                onMouseEnter={e => { if (!isActiveFolder) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={e => { if (!isActiveFolder) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <Folder className="w-4 h-4" style={{ color: isActiveFolder ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.35)' : muted) }} />
              </button>
            );
          })}
        </div>

        {/* Bottom group */}
        <div className="flex flex-col items-center gap-2 py-3 flex-shrink-0">
          {plan === 'free' && (
            <button
              onClick={openUpgrade}
              title="Upgrade to Pro"
              className="w-7 h-7 rounded-[10px] flex items-center justify-center transition-all overflow-hidden flex-shrink-0"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 28 28\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(1.4 1.4 -2.8 2.8 14 14)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgb(49, 230, 231) 0%, rgb(75, 233, 234) 6.25%, rgb(101, 236, 237) 12.5%, rgb(152, 243, 243) 25%, rgb(204, 249, 249) 37.5%, rgb(255, 255, 255) 50%, rgb(250, 191, 215) 62.5%, rgb(245, 128, 175) 75%, rgb(242, 96, 154) 81.25%, rgb(239, 64, 134) 87.5%, rgb(237, 32, 114) 93.75%, rgb(235, 16, 104) 96.875%, rgb(234, 0, 94) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')" }}
            >
              <svg
                width="14" height="19"
                viewBox="0 0 11.6667 15.8334"
                fill="none"
                style={{ display: 'block', flexShrink: 0 }}
              >
                <path
                  d="M7.76667 0.416677C7.76667 0.249637 7.66691 0.0987421 7.51322 0.0333088C7.35953 -0.0321244 7.18161 0.000552895 7.0612 0.11633L5.57958 1.54097C3.37356 3.66215 1.50953 6.11232 0.0538383 8.80429C0.0195648 8.86482 0 8.93477 0 9.00929C0 9.23941 0.186548 9.42596 0.416667 9.42596H4.00833V15.4167C4.00833 15.5817 4.1057 15.7311 4.25663 15.7978C4.40756 15.8645 4.58361 15.8358 4.70559 15.7247L5.36852 15.1208C7.68911 13.0069 9.65847 10.5372 11.2027 7.80419L11.6128 7.07848C11.6857 6.94947 11.6846 6.79147 11.6099 6.66349C11.5352 6.53552 11.3982 6.45683 11.25 6.45683H7.76667V0.416677Z"
                  fill="#0D0D0D"
                />
              </svg>
            </button>
          )}
          <img
            src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTk0MzA3Mnww&ixlib=rb-4.1.0&q=80&w=200"
            alt="James Brown"
            className="w-7 h-7 rounded-full flex-shrink-0 object-cover cursor-pointer"
          />
        </div>
      </aside>
    );
  }

  // ── Expanded state ────────────────────────────────────────────────────────
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-full overflow-hidden"
      style={{ width: 216, borderRight: `1px solid ${border}`, background: sidebarBg }}
    >
      {/* New Transcript button */}
      <div className="px-3 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={onNewTranscript ?? goToDash}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs transition-all"
          style={{
            border: `1px solid ${isDark ? '#262626' : 'transparent'}`,
            background: isDark ? '#1a1a1a' : '#111111',
            color: '#ffffff', fontWeight: 500,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#222222' : '#2a2a2a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111'; }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Transcript
        </button>
      </div>

      {/* Transcription quota bar — free users only */}
      {plan === 'free' && (
        null
      )}

      {/* Menu section */}
      <div className="flex-shrink-0">
        <div className="px-3 pt-3 pb-1.5">
          <p style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted, fontWeight: 600, fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Menu
          </p>
        </div>
        <div className="px-2">
          <button onClick={goToDash} className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
            style={{ height: 38, background: navBg('dashboard'), color: navColor('dashboard') }}
            onMouseEnter={e => { if (!isActive('dashboard')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!isActive('dashboard')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            <LayoutDashboard className="w-[18px] h-[18px] flex-shrink-0" style={{ color: navIcon('dashboard') }} strokeWidth={isActive('dashboard') ? 2 : 1.75} />
            <span className="flex-1 truncate">Dashboard</span>
          </button>

          <button onClick={() => navigate('/prompt-base')} className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
            style={{ height: 38, background: navBg('prompt-base'), color: navColor('prompt-base') }}
            onMouseEnter={e => { if (!isActive('prompt-base')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!isActive('prompt-base')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            <BookOpen className="w-[18px] h-[18px] flex-shrink-0" style={{ color: navIcon('prompt-base') }} strokeWidth={isActive('prompt-base') ? 2 : 1.75} />
            <span className="flex-1 truncate">Prompt Base</span>
          </button>

          <button onClick={() => navigate('/discover')} className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
            style={{ height: 38, background: navBg('discover'), color: navColor('discover') }}
            onMouseEnter={e => { if (!isActive('discover')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!isActive('discover')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            <Compass className="w-[18px] h-[18px] flex-shrink-0" style={{ color: navIcon('discover') }} strokeWidth={isActive('discover') ? 2 : 1.75} />
            <span className="flex-1 truncate">Discover</span>
          </button>
        </div>
      </div>

      {/* Library label */}
      <div className="px-3 pt-4 pb-1.5 flex-shrink-0">
        <p style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted, fontWeight: 600, fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
          Library
        </p>
      </div>

      {/* Scrollable nav body */}
      <div className="flex-1 overflow-y-auto pb-2 px-2">

        {/* Singles */}
        <button
          onClick={onSelectSingles ?? (() => navigate('/dashboard', { state: { view: 'singles' } }))}
          className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
          style={{ height: 38, background: libBg('singles'), color: libColor('singles') }}
          onMouseEnter={e => { if (!isLibActive('singles')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={e => { if (!isLibActive('singles')) (e.currentTarget as HTMLButtonElement).style.background = libBg('singles'); }}
        >
          <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: libIconColor('singles') }}>
            <path d="M2 20L5.52396 14.9098C5.86325 14.4198 6.0329 14.1747 6.25638 14.0603C6.45278 13.9597 6.67692 13.9269 6.8939 13.967C7.1408 14.0126 7.37353 14.1988 7.83898 14.5712L8.38213 15.0057C8.59864 15.1789 8.70689 15.2655 8.82352 15.29C8.92612 15.3115 9.0329 15.3002 9.12875 15.2578C9.2377 15.2095 9.32549 15.1022 9.50105 14.8876L12.3804 11.3683C12.7684 10.8942 12.9624 10.6571 13.1997 10.5613C13.4081 10.477 13.6389 10.4655 13.8547 10.5286C14.1004 10.6004 14.317 10.817 14.7502 11.2502L17 13.5M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8ZM9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7Z" stroke="currentColor" strokeWidth={isLibActive('singles') ? 2 : 1.75} strokeLinejoin="round" />
          </svg>
          <span className="flex-1 truncate">Singles</span>
          <span className="text-[11px] flex-shrink-0 tabular-nums" style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)' }}>
            {SINGLES_COUNT}
          </span>
        </button>

        {/* Collections */}
        <div>
          <button
            onClick={() => {
              setCollectionsOpen(o => !o);
              if (onSelectCollections) onSelectCollections();
              else navigate('/dashboard', { state: { view: 'collections' } });
            }}
            className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
            style={{ height: 38, background: libBg('collections'), color: libColor('collections') }}
            onMouseEnter={e => { if (!isLibActive('collections')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!isLibActive('collections')) (e.currentTarget as HTMLButtonElement).style.background = libBg('collections'); }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: libIconColor('collections') }}>
              <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8Z" stroke="currentColor" strokeLinecap="round" strokeWidth={isLibActive('collections') ? 2 : 1.75} />
              <path d="M6.03174 10.8997V10.7904C6.03174 9.51802 6.03174 8.88185 6.29976 8.49597C6.53384 8.15896 6.89576 7.93255 7.30121 7.86949C7.76546 7.79729 8.33752 8.07559 9.48165 8.63219L9.57799 8.67906C10.8284 9.28734 11.4535 9.59149 11.6825 10.0271C11.8822 10.4069 11.9097 10.854 11.758 11.2554C11.584 11.7157 11.0007 12.094 9.83413 12.8507L9.7378 12.9132C8.53146 13.6957 7.92829 14.0869 7.42916 14.0527C6.99422 14.0229 6.59377 13.8054 6.33207 13.4567C6.03174 13.0566 6.03174 12.3376 6.03174 10.8997Z" stroke="currentColor" strokeLinecap="round" strokeWidth={isLibActive('collections') ? 2 : 1.75} />
            </svg>
            <span className="flex-1 truncate">Collections</span>
            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${collectionsOpen ? 'rotate-90' : ''}`} strokeWidth={2.5} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted }} />
          </button>
          {collectionsOpen && (
            <div className="ml-[38px] mr-1 mt-0.5 mb-0.5" style={{ borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : border}` }}>
              {COLLECTIONS.map(col => (
                <button
                  key={col.id}
                  onClick={() => onSelectGroup ? onSelectGroup('collections', col.id) : navigate('/dashboard', { state: { view: 'collections', groupId: col.id } })}
                  className="w-full flex items-center gap-2 pl-3 pr-2 py-2 rounded-md text-xs transition-all text-left"
                  style={{
                    background: isGroupActive(col.id) ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)') : 'transparent',
                    color: isGroupActive(col.id) ? text : (isDark ? 'rgba(255,255,255,0.45)' : muted),
                  }}
                  onMouseEnter={e => { if (!isGroupActive(col.id)) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}
                  onMouseLeave={e => { if (!isGroupActive(col.id)) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : subtle }} />
                  <span className="truncate flex-1">{col.name}</span>
                  <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted }}>{col.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulks */}
        <div>
          <button
            onClick={() => {
              setBulkOpen(o => !o);
              if (onSelectBulk) onSelectBulk();
              else navigate('/dashboard', { state: { view: 'bulk' } });
            }}
            className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
            style={{ height: 38, background: libBg('bulk'), color: libColor('bulk') }}
            onMouseEnter={e => { if (!isLibActive('bulk')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
            onMouseLeave={e => { if (!isLibActive('bulk')) (e.currentTarget as HTMLButtonElement).style.background = libBg('bulk'); }}
          >
            <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: libIconColor('bulk') }}>
              <path d="M5 6L13 6M5 10L13 10M5 14H9M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8Z" stroke="currentColor" strokeWidth={isLibActive('bulk') ? 2 : 1.75} strokeLinecap="round" />
            </svg>
            <span className="flex-1 truncate">Bulks</span>
            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${bulkOpen ? 'rotate-90' : ''}`} strokeWidth={2.5} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted }} />
          </button>
          {bulkOpen && (
            <div className="ml-[38px] mr-1 mt-0.5 mb-0.5" style={{ borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : border}` }}>
              {BULK.map(b => (
                <button
                  key={b.id}
                  onClick={() => onSelectGroup ? onSelectGroup('bulk', b.id) : navigate('/dashboard', { state: { view: 'bulk', groupId: b.id } })}
                  className="w-full flex items-center gap-2 pl-3 pr-2 py-2 rounded-md text-xs transition-all text-left"
                  style={{
                    background: isGroupActive(b.id) ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)') : 'transparent',
                    color: isGroupActive(b.id) ? text : (isDark ? 'rgba(255,255,255,0.45)' : muted),
                  }}
                  onMouseEnter={e => { if (!isGroupActive(b.id)) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}
                  onMouseLeave={e => { if (!isGroupActive(b.id)) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : subtle }} />
                  <span className="truncate flex-1">{b.name}</span>
                  <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted }}>{b.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profiles */}
        <button onClick={() => navigate('/profiles')} className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
          style={{ height: 38, background: isActive('profiles') ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent', color: isActive('profiles') ? text : (isDark ? 'rgba(255,255,255,0.55)' : muted) }}
          onMouseEnter={e => { if (!isActive('profiles')) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={e => { if (!isActive('profiles')) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
          <svg width="18" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0" style={{ color: isActive('profiles') ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.45)' : muted) }}>
            <path d="M16 20C16 17.2386 13.7614 15 11 15H7C4.23858 15 2 17.2386 2 20M17 5.8V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H5.8C4.11984 21 3.27976 21 2.63803 20.673C2.07354 20.3854 1.6146 19.9265 1.32698 19.362C1 18.7202 1 17.8802 1 16.2V5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8ZM11.5532 9C11.5532 10.4101 10.4101 11.5532 9 11.5532C7.58989 11.5532 6.44678 10.4101 6.44678 9C6.44678 7.58989 7.58989 6.44678 9 6.44678C10.4101 6.44678 11.5532 7.58989 11.5532 9Z" stroke="currentColor" strokeWidth={isActive('profiles') ? 2 : 1.75} strokeLinecap="round" />
          </svg>
          <span className="flex-1 truncate">Profiles</span>
        </button>

        {/* Folders section */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : muted, fontWeight: 600, fontSize: 10, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              Folders
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleNewFolder}
                className="p-1 rounded transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : muted, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
                title={plan === 'free' && folders.length >= FREE_LIMITS.folders ? 'Upgrade to add more folders' : 'New folder'}
              >
                {plan === 'free' && folders.length >= FREE_LIMITS.folders
                  ? <Zap className="w-3.5 h-3.5" style={{ color: '#00b8b2' }} strokeWidth={2.5} />
                  : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                }
              </button>
              <button onClick={() => setFoldersOpen(o => !o)} className="p-1 rounded transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : muted, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${foldersOpen ? '' : 'rotate-180'}`} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {foldersOpen && (
            <div>
              {(plan === 'free' ? folders.slice(0, FREE_LIMITS.folders) : folders).map((f) => {
                const isFavourites = f.id === FAVOURITES_ID;
                const isActiveFolder = activeFolderId === f.id ||
                  (isFavourites && activeLibraryItem === 'favourites');
                const handleClick = isFavourites && onSelectFavourites
                  ? onSelectFavourites
                  : () => navigate(`/folder/${f.id}`);
                const displayCount = isFavourites && favouritesCount != null
                  ? favouritesCount
                  : f.items.length;

                return (
                  <button
                    key={f.id}
                    onClick={handleClick}
                    className="w-full flex items-center gap-2.5 px-3 rounded-md text-xs transition-all text-left"
                    style={{
                      height: 36,
                      background: isActiveFolder ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent',
                      color: isActiveFolder ? text : (isDark ? 'rgba(255,255,255,0.55)' : muted),
                    }}
                    onMouseEnter={e => { if (!isActiveFolder) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={e => { if (!isActiveFolder) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Folder className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: isActiveFolder ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.35)' : muted) }} />
                    <span className="truncate flex-1">{f.name}</span>
                    {displayCount > 0 && (
                      <span className="text-[10px] tabular-nums flex-shrink-0"
                        style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
                        {displayCount}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Inline new-folder input */}
              {newFolderMode && (
                <div className="flex items-center gap-1.5 px-2 py-1">
                  <Folder className="w-3.5 h-3.5 flex-shrink-0" style={{ color: muted }} />
                  <input
                    ref={newFolderInputRef}
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitNewFolder();
                      if (e.key === 'Escape') { setNewFolderMode(false); setNewFolderName(''); }
                    }}
                    onBlur={commitNewFolder}
                    placeholder="Folder name…"
                    className="flex-1 text-xs bg-transparent outline-none border-b"
                    style={{ color: text, borderColor: isDark ? '#444' : '#d1d5db', caretColor: text }}
                  />
                </div>
              )}

              {/* Free-user folder usage: "1 of 3 folders used" */}
              {plan === 'free' && foldersOpen && (
                null
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile row at bottom */}
      <div className="flex-shrink-0 px-2 py-3">

        {/* Upgrade banner — free users only */}
        {plan === 'free' && (
          <div
            onClick={openUpgrade}
            className="w-full relative overflow-clip rounded-[14px] mb-2 cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: isDark ? '#111' : '#ffffff',
              height: 96,
              border: `1px solid ${isDark ? '#262626' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            {isDark ? (
              <>
                {/* Dark — background screenshot */}
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[271px] left-[calc(50%+255.5px)] opacity-20 top-[calc(50%-17px)] w-[1052px] pointer-events-none">
                  <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgBannerBg} />
                </div>
                {/* Dark — rocket image */}
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[150px] left-[calc(50%+36.5px)] top-[calc(50%+33.5px)] w-[100px] pointer-events-none">
                  <img alt="" className="absolute inset-0 max-w-none object-cover opacity-20 size-full" src={imgRocket} />
                </div>
                {/* Dark — text content */}
                <div className="absolute flex flex-col gap-[3px] items-start left-[13px] top-[11px] w-[181px]">
                  <div className="flex gap-[3px] items-center">
                    <div className="relative shrink-0 size-[16px]">
                      <div className="absolute inset-[9.49%_19.87%_11%_19.87%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.64237 12.7216">
                          <path clipRule="evenodd" d={svgPathsLock.p14548200} fill="white" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="font-bold leading-[21px] text-[12px] text-white whitespace-nowrap">Upgrade to PRO</p>
                  </div>
                  <p className="font-normal leading-[17.28px] opacity-80 text-[10px] text-white w-full">Unlock the full Tokscript experience</p>
                  <div className="bg-white h-[28px] rounded-[10px] w-[125px] flex items-center justify-center mt-0.5">
                    <p className="font-medium text-[#111] text-[12px] text-center whitespace-nowrap">Upgrade Now</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Light — background screenshot (full opacity, creates the light look) */}
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[297px] left-[calc(50%-284.5px)] top-[calc(50%-17px)] w-[896px] pointer-events-none">
                  <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgBannerBgLight} />
                </div>
                {/* Light — rocket image */}
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[150px] left-[calc(50%+36.5px)] top-[calc(50%+33.5px)] w-[100px] pointer-events-none">
                  <img alt="" className="absolute inset-0 max-w-none object-cover opacity-20 size-full" src={imgRocket} />
                </div>
                {/* Light — text content */}
                <div className="absolute flex flex-col gap-[3px] items-start left-[13px] top-[11px] w-[181px]">
                  <div className="flex gap-[3px] items-center">
                    <div className="relative shrink-0 size-[16px]">
                      <div className="absolute inset-[9.49%_19.87%_11%_19.87%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.64237 12.7216">
                          <path clipRule="evenodd" d={svgPathsLockLight.p14548200} fill="#111111" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="font-bold leading-[21px] text-[12px] text-[#111] whitespace-nowrap">Upgrade to PRO</p>
                  </div>
                  <p className="font-normal leading-[17.28px] opacity-80 text-[10px] text-[rgba(17,17,17,0.8)] w-full">Unlock the full Tokscript experience</p>
                  <div className="bg-[#111] h-[28px] rounded-[10px] w-[125px] flex items-center justify-center mt-0.5">
                    <p className="font-medium text-white text-[12px] text-center whitespace-nowrap">Upgrade Now</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mb-3" style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.08)' : border }} />
        <div ref={menuRef} className="relative">
          {userMenuOpen && (
            <div className="absolute bottom-full mb-1.5 left-0 right-0 rounded-xl overflow-hidden z-50"
              style={{ background: isDark ? '#141414' : '#ffffff', border: `1px solid ${isDark ? '#262626' : '#e5e7eb'}`, boxShadow: isDark ? '0 -8px 24px rgba(0,0,0,0.5)' : '0 -4px 16px rgba(0,0,0,0.08)' }}>
              <button onClick={() => { window.open('mailto:support@tokscript.com', '_blank'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#374151', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? '#888888' : '#6b7280' }} />
                Support
              </button>
              <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#374151', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <Settings className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? '#888888' : '#6b7280' }} />
                Settings
              </button>
              <div style={{ height: 1, background: isDark ? '#262626' : '#e5e7eb', margin: '2px 0' }} />
              <button onClick={() => { navigate('/login'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#374151', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? '#888888' : '#6b7280' }} />
                Sign Out
              </button>
            </div>
          )}

          <button onClick={() => setUserMenuOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all text-left"
            style={{ background: userMenuOpen ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)') }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = userMenuOpen ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'); }}>
            <img src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTk0MzA3Mnww&ixlib=rb-4.1.0&q=80&w=200"
              alt="James Brown" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs truncate" style={{ color: text, fontWeight: 500 }}>James Brown</p>
                {plan === 'free' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0', color: isDark ? '#888' : '#6b7280', fontWeight: 600 }}>
                    FREE
                  </span>
                )}
                {plan === 'pro' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(0,184,178,0.15)', color: '#00b8b2', fontWeight: 600 }}>
                    PRO
                  </span>
                )}
              </div>
              <p className="text-[10px] truncate" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : muted }}>james@alignui.com</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : muted }} />
          </button>
        </div>
      </div>
    </aside>
  );
}