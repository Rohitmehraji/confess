import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import DevicesPage from './pages/DevicesPage';
import AllPage from './pages/AllPage';

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/all" element={<AllPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppLayout>
);

export default App;
