import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/HelpPage";
import DocumentPage from "./pages/DocumentPage";
import LeasePage from "./pages/LeasePage";
import PropertyPage from "./pages/PropertyPage";
import ReportsPage from "./pages/ReportsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import MarketingPage from "./pages/MarketingPage";
import FinancePage from "./pages/FinancePage";
import SalesPage from "./pages/SalesPage";
import CustomerPage from "./pages/CustomerPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Dashboard route without AppLayout */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* ERP routes with AppLayout and sidebar */}
          <Route path="/*" element={<AppLayout />}>
            <Route path="help" element={<HelpPage />} />
            <Route path="documents" element={<DocumentPage />} />
            <Route path="leases" element={<LeasePage />} />
            <Route path="properties" element={<PropertyPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="customers/:id" element={<CustomerProfilePage />} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
