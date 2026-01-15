import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { PropertyList } from './pages/Properties/PropertyList';
import { PropertyDetail } from './pages/Properties/PropertyDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="agents" element={<div className="p-10 font-bold text-2xl">Agentes (En construcción)</div>} />
          <Route path="finance" element={<div className="p-10 font-bold text-2xl">Finanzas (En construcción)</div>} />
          <Route path="admin" element={<div className="p-10 font-bold text-2xl">Administración (En construcción)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
