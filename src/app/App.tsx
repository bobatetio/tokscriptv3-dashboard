import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { FolderProvider } from './context/FolderContext';
import { UserProvider, UserContext } from './context/UserContext';
import { useContext } from 'react';
import { LandingPage } from './components/LandingPage';
import { TranscriptResultPage } from './components/TranscriptResultPage';
import { FreeResultPage } from './components/FreeResultPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { DashboardPage } from './components/DashboardPage';
import { NewTranscriptionPage } from './components/NewTranscriptionPage';
import { PromptBasePage } from './components/PromptBasePage';
import { PromptDetailPage } from './components/PromptDetailPage';
import { DiscoverPage } from './components/DiscoverPage';
import { CreatorProfilePage } from './components/CreatorProfilePage';
import { ProfilesPage } from './components/ProfilesPage';
import { VideosPage } from './components/VideosPage';
import { VideoResultsPage } from './components/videos/VideoResultsPage';
import { SettingsPage } from './components/SettingsPage';
import { FolderPage } from './components/FolderPage';
import { SelectionBarPreview } from './components/SelectionBarPreview';
import { UpgradeModal } from './components/UpgradeModal';
import { PlanDevToggle } from './components/PlanDevToggle';
import { NewTranscriptProvider } from './context/NewTranscriptContext';
import NewTranscriptModal from './components/NewTranscriptModal';
import { BulkProcessingProvider } from './context/BulkProcessingContext';
import { ChromeExtensionModalProvider } from './context/ChromeExtensionModalContext';
import ChromeExtensionModal from './components/ChromeExtensionModal';
import { TourProvider } from './context/TourContext';
import { TourGuide } from './components/TourGuide';

function AppLayout() {
  return (
    <BulkProcessingProvider>
      <ChromeExtensionModalProvider>
        <NewTranscriptProvider>
          <TourProvider>
            <Outlet />
            <NewTranscriptModal />
            <ChromeExtensionModal />
            <TourGuide />
          </TourProvider>
        </NewTranscriptProvider>
      </ChromeExtensionModalProvider>
    </BulkProcessingProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', Component: LandingPage },
      { path: '/results', Component: TranscriptResultPage },
      { path: '/freeresult', Component: FreeResultPage },
      { path: '/login', Component: LoginPage },
      { path: '/signup', Component: SignUpPage },
      { path: '/forgot-password', Component: ForgotPasswordPage },
      { path: '/dashboard', Component: DashboardPage },
      { path: '/transcribe', Component: NewTranscriptionPage },
      { path: '/prompt-base', Component: PromptBasePage },
      { path: '/prompt-base/:id', Component: PromptDetailPage },
      { path: '/discover', Component: DiscoverPage },
      { path: '/profiles', Component: ProfilesPage },
      { path: '/videos/results', Component: VideoResultsPage },
      { path: '/videos', Component: VideosPage },
      { path: '/profile/:creator', Component: CreatorProfilePage },
      { path: '/settings', Component: SettingsPage },
      { path: '/folder/:id', Component: FolderPage },
      { path: '/selection-bar-preview', Component: SelectionBarPreview },
    ],
  },
]);

function AppInner() {
  const { upgradeOpen } = useContext(UserContext);
  return (
    <>
      <RouterProvider router={router} />
      {upgradeOpen && <UpgradeModal />}
      <PlanDevToggle />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <FolderProvider>
          <AppInner />
        </FolderProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
