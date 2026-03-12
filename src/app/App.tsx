import { createBrowserRouter, RouterProvider } from 'react-router';
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
import { SettingsPage } from './components/SettingsPage';
import { FolderPage } from './components/FolderPage';
import { UpgradeModal } from './components/UpgradeModal';
import { PlanDevToggle } from './components/PlanDevToggle';

const router = createBrowserRouter([
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
  { path: '/profile/:creator', Component: CreatorProfilePage },
  { path: '/settings', Component: SettingsPage },
  { path: '/folder/:id', Component: FolderPage },
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
