import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicSite from './pages/PublicSite';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/Dashboard';
import AdminLayout from './admin/AdminLayout';
import ServicesManager from './admin/ServicesManager';
import DoctorsManager from './admin/DoctorsManager';
import BlogManager from './admin/BlogManager';
import FAQsManager from './admin/FAQsManager';
import AppointmentsManager from './admin/AppointmentsManager';
import MessagesManager from './admin/MessagesManager';
import SettingsManager from './admin/SettingsManager';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="doctors" element={<DoctorsManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="faqs" element={<FAQsManager />} />
            <Route path="appointments" element={<AppointmentsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
