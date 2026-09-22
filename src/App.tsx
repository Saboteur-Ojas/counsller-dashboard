import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CasesPage } from './components/cases/CasesPage';
import { CaseDetailPage } from './components/cases/CaseDetailPage';
import { SessionsPage } from './components/sessions/SessionsPage';
import { FollowUpsPage } from './components/followups/FollowUpsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ToastContainer } from './components/layout/ToastContainer';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeRoute, selectedCaseId } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    if (activeRoute === '/cases') {
      return <CasesPage />;
    }

    if (activeRoute.startsWith('/cases/')) {
      const caseIdFromRoute = activeRoute.replace('/cases/', '');
      const targetId = selectedCaseId || caseIdFromRoute;
      return <CaseDetailPage caseId={targetId} />;
    }

    if (activeRoute === '/sessions') {
      return <SessionsPage />;
    }

    if (activeRoute === '/follow-ups') {
      return <FollowUpsPage />;
    }

    if (activeRoute === '/settings') {
      return <SettingsPage />;
    }

    // Default route: /dashboard
    return <DashboardPage />;
  };

  return <Layout>{renderActiveView()}</Layout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
