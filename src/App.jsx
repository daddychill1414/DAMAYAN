import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { NeedsBoard } from './pages/NeedsBoard';
import { SmartMatch } from './pages/SmartMatch';
import { MapView } from './pages/MapView';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { DonorDashboard } from './pages/DonorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PendingVerification } from './pages/PendingVerification';
import { Appeal } from './pages/Appeal';
import { QRScanner } from './pages/QRScanner';
import { FinancialLedger } from './pages/FinancialLedger';
import { Feedback } from './pages/Feedback';
import { GlobalToast } from './components/GlobalToast';
import { useStore } from './store';

const ProtectedRoute = ({ children, allowedRoles, requireVerification = false }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/needs" replace />;
  }

  if (requireVerification && currentUser.role === 'Coordinator' && currentUser.status !== 'approved') {
    if (currentUser.status === 'rejected') return <Navigate to="/appeal" replace />;
    return <Navigate to="/pending" replace />;
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
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/needs" element={<NeedsBoard />} />
        <Route path="/donate" element={<SmartMatch />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/ledger" element={<FinancialLedger />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator']} requireVerification={true}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/donor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pending" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator']}>
              <PendingVerification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appeal" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator']}>
              <Appeal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/qr" 
          element={
            <ProtectedRoute allowedRoles={['Coordinator', 'Admin']} requireVerification={true}>
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
