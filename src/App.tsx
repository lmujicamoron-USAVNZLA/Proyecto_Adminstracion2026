import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard';
import { PropertyList } from './pages/Properties/PropertyList';
import { PropertyDetail } from './pages/Properties/PropertyDetail';

import { AgentList } from './pages/Agents/AgentList';
import { AdminSettings } from './pages/Admin/AdminSettings';
import { FinanceDashboard } from './pages/Finance/FinanceDashboard';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import { RequireAuth } from './components/auth/RequireAuth';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/agents" element={<AgentList />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/admin" element={<AdminSettings />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
