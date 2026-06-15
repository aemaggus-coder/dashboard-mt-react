import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import './App.css';

function DashboardLayout() {
  return (
    <div className="app">
      <Topbar />
      <Navbar />
      <Dashboard />
    </div>
  );
}

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
