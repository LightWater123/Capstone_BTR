import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/login";
import AdminRegister from "./pages/admin_register";
import ServiceRegister from "./pages/service_register";
import AdminDashboard from "./pages/admin_dashboard";
import ServiceDashboard from "./pages/service_dashboard";
import DirectorDashboard from "./pages/director_dashboard";
import Inventory from "./pages/inventory";
import ServiceMessages from "./pages/service_messages";
import AdminMessages from "./pages/admin_messages";
import MaintenanceList from "./pages/maintenance_list";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ServiceInventory from "./pages/service_inventory";
import SettingsPage from './pages/settings_page';

export const queryClient = new QueryClient();

export default function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/register/service" element={<ServiceRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/service/dashboard" element={<ServiceDashboard />} />
          <Route path="/oic/dashboard" element={<DirectorDashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/service/messages" element={<ServiceMessages />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/maintenance-list" element={<MaintenanceList />} />
          <Route path="/service/inventory" element={<ServiceInventory />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    </Router>
    </QueryClientProvider>
  );
}
