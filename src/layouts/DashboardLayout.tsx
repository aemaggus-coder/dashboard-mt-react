import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';

export default function DashboardLayout() {
  return (
    <div className="app">
      <Topbar />
      <Navbar />
      <Dashboard />
    </div>
  );
}
