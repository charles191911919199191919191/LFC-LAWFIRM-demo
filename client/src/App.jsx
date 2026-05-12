import { Navigate, Route, Routes } from "react-router-dom";
import DashboardShell from "./components/DashboardShell";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import AppointmentManagement from "./pages/AppointmentManagement";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Lawyers from "./pages/Lawyers";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import LawyerDashboard from "./pages/dashboards/LawyerDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/lawyers" element={<Lawyers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={["client", "lawyer", "staff", "admin"]} />}>
        <Route element={<DashboardShell />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/lawyer" element={<LawyerDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/appointments" element={<AppointmentManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
