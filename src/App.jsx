import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { NeedsBoard } from './pages/NeedsBoard';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { VerifyDonation } from './pages/VerifyDonation';
import { GlobalToast } from './components/GlobalToast';
import { PledgeModal } from './components/PledgeModal';
import { HelpCenter } from './pages/HelpCenter';
import { useStore } from './store';


const ProtectedRoute = ({ children, allowedType }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedType && currentUser.userType !== allowedType) {
    if (currentUser.userType === 'coordinator') {
      return <Navigate to="/coordinator" replace />;
    } else {
      return <Navigate to="/donor" replace />;
    }
  }
  
  return children;
};

function App() {
  const { expirePledges } = useStore();

  // Run expiration logic every minute
  useEffect(() => {
    expirePledges(); // Initial check
    const interval = setInterval(expirePledges, 60 * 1000);
    return () => clearInterval(interval);
  }, [expirePledges]);

  return (
    <>
      <div className="noise-overlay"></div>
      <GlobalToast />
      <PledgeModal />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/needs" element={<NeedsBoard />} />
        <Route path="/help" element={<HelpCenter />} />
        
        {/* Coordinator Routes */}
        <Route 
          path="/coordinator" 
          element={
            <ProtectedRoute allowedType="coordinator">
              <CoordinatorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verify" 
          element={
            <ProtectedRoute allowedType="coordinator">
              <VerifyDonation />
            </ProtectedRoute>
          } 
        />

        {/* Donor Routes */}
        <Route 
          path="/donor" 
          element={
            <ProtectedRoute allowedType="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
