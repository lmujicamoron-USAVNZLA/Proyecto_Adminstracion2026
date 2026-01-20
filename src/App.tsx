import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard';
import { PropertyList } from './pages/Properties/PropertyList';
import { PropertyDetail } from './pages/Properties/PropertyDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<PropertyList />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="agents" element={<div className="p-10 font-bold text-2xl">Agentes (En construcción)</div>} />
            <Route path="finance" element={<div className="p-10 font-bold text-2xl">Finanzas (En construcción)</div>} />
            <Route path="admin" element={<div className="p-10 font-bold text-2xl">Administración (En construcción)</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
