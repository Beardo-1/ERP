import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import PropertyPage from './pages/PropertyPage';
import LeasePage from './pages/LeasePage';
import FinancePage from './pages/FinancePage';
import MarketingPage from './pages/MarketingPage';
import DocumentPage from './pages/DocumentPage';
import CustomerPage from './pages/CustomerPage';
import SalesPage from './pages/SalesPage';
import ProductsPage from './pages/ProductsPage';
import ProjectsPage from './pages/ProjectsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import { ThemeProvider } from './themes/ThemeProvider';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Auto-login for demonstration purposes
  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated && !user) {
        // Uncomment to enable auto-login for demo
        // const authStore = useAuthStore.getState();
        // await authStore.login('john.doe@nexuserp.com', 'password123');
      }
    };
    
    autoLogin();
  }, [isAuthenticated, user]);
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          
          <Route
            path="/"
            element={<AppLayout />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="properties" element={<PropertyPage />} />
            <Route path="leases" element={<LeasePage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="customers/:id" element={<CustomerProfilePage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;