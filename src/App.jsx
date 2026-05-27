import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NeedsBoard } from './pages/NeedsBoard';
import { SmartMatch } from './pages/SmartMatch';
import { MapView } from './pages/MapView';
import { VolunteerHub } from './pages/VolunteerHub';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { QRScanner } from './pages/QRScanner';
import { Feedback } from './pages/Feedback';
import { GlobalToast } from './components/GlobalToast';
import { useStore } from './store';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/needs" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <div className="noise-overlay"></div>
      <GlobalToast />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/needs" element={<NeedsBoard />} />
        <Route path="/donate" element={<SmartMatch />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/volunteer" element={<VolunteerHub />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator']}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/qr" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator', 'Center Admin']}>
              <QRScanner />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
