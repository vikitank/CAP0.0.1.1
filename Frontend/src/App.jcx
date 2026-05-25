import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { initApiHeaders } from './services/api';

import LoginPage      from './pages/LoginPage.jsx';
import SignupPage     from './pages/SignupPage.jsx';
import AppLayout      from './components/layout/AppLayout.jsx';
import Dashboard      from './pages/Dashboard.jsx';
import VouchersPage   from './pages/VouchersPage.jsx';
import AccountingPage from './pages/AccountingPage.jsx';
import SalesPage      from './pages/SalesPage.jsx';
import InventoryPage  from './pages/InventoryPage.jsx';
import GSTPage        from './pages/GSTPage.jsx';
import EInvoicePage   from './pages/EInvoicePage.jsx';
import ReportsPage    from './pages/ReportsPage.jsx';
import PayrollPage    from './pages/PayrollPage.jsx';
import SettingsPage   from './pages/SettingsPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { accessToken, activeCompanyId } = useAuthStore();

  useEffect(() => {
    initApiHeaders(accessToken, activeCompanyId);
  }, [accessToken, activeCompanyId]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"  element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="vouchers"     element={<VouchersPage />} />
        <Route path="accounting"   element={<AccountingPage />} />
        <Route path="sales"        element={<SalesPage />} />
        <Route path="inventory"    element={<InventoryPage />} />
        <Route path="gst"          element={<GSTPage />} />
        <Route path="einvoice"     element={<EInvoicePage />} />
        <Route path="reports"      element={<ReportsPage />} />
        <Route path="payroll"      element={<PayrollPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="settings"     element={<SettingsPage />} />
        <Route path="import"       element={<Navigate to="/accounting" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
