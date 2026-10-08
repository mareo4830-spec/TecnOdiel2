import { LoaderCircle } from 'lucide-react';
import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './features/auth/LoginPage';
import { useAuth } from './features/auth/authContext';
import { CheckinProvider } from './features/checkin/CheckinProvider';
import { APP_CONFIG } from './lib/config';

// Cada sección se descarga al entrar en ella; AppLayout muestra un spinner mientras tanto.
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ProjectsPage = lazy(() => import('./features/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() =>
  import('./features/projects/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
);
const KanbanPage = lazy(() => import('./features/kanban/KanbanPage').then((m) => ({ default: m.KanbanPage })));
const HoursPage = lazy(() => import('./features/hours/HoursPage').then((m) => ({ default: m.HoursPage })));
const CrmPage = lazy(() => import('./features/crm/CrmPage').then((m) => ({ default: m.CrmPage })));
const ChatsPage = lazy(() => import('./features/chats/ChatsPage').then((m) => ({ default: m.ChatsPage })));
const TenantWizardPage = lazy(() => import('./features/tenants/TenantWizardPage').then((m) => ({ default: m.TenantWizardPage })));
const TenantDetailPage = lazy(() => import('./features/tenants/TenantDetailPage').then((m) => ({ default: m.TenantDetailPage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

export default function App() {
  const { status } = useAuth();

  useEffect(() => {
    document.title = APP_CONFIG.name;
  }, []);

  if (status === 'loading') {
    return (
      <div className="grid min-h-dvh place-items-center bg-gray-950">
        <LoaderCircle className="h-8 w-8 animate-spin text-indigo-400" aria-label="Cargando" />
      </div>
    );
  }

  if (status === 'unauthenticated') return <LoginPage />;

  return (
    <CheckinProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="/proyectos/:projectId" element={<ProjectDetailPage />} />
          <Route path="/proyectos/:projectId/tenants/nuevo" element={<TenantWizardPage />} />
          <Route path="/proyectos/:projectId/tenants/:tenantId" element={<TenantDetailPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/horas" element={<HoursPage />} />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </CheckinProvider>
  );
}
