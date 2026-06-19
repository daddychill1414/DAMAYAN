import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Shield, Phone, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('donor'); // 'donor' | 'coordinator'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { loginAsCoordinator, loginAsDonor, showToast } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'coordinator') {
      const res = loginAsCoordinator(email, password);
      if (res.success) {
        showToast('Welcome back, Coordinator');
        navigate('/coordinator');
      } else {
        setError(res.error);
      }
    } else {
      const res = loginAsDonor(phone, password);
      if (res.success) {
        showToast('Welcome back');
        navigate('/needs');
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-sans font-bold text-2xl text-primary mb-2">Damayan Match</Link>
          <p className="font-outfit text-dark/60 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl border border-primary/10 shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-primary/5">
            <button
              onClick={() => { setActiveTab('donor'); setError(''); }}
              className={`flex-1 py-4 font-outfit text-sm font-semibold transition-colors ${
                activeTab === 'donor' ? 'bg-primary text-background' : 'bg-transparent text-primary/60 hover:bg-primary/5'
              }`}
            >
              Donor
            </button>
            <button
              onClick={() => { setActiveTab('coordinator'); setError(''); }}
              className={`flex-1 py-4 font-outfit text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'coordinator' ? 'bg-primary text-background' : 'bg-transparent text-primary/60 hover:bg-primary/5'
              }`}
            >
              <Shield size={14} /> Barangay
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            
            {activeTab === 'donor' ? (
              <div>
                <label className="block font-outfit text-xs font-semibold text-primary mb-2 uppercase tracking-widest">Phone Number</label>
                <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                  <Phone size={16} className="text-primary/40" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09171234567"
                    className="w-full bg-transparent font-outfit text-sm outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-outfit text-xs font-semibold text-primary mb-2 uppercase tracking-widest">Barangay Email</label>
                <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                  <Mail size={16} className="text-primary/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. brgy@gov.ph"
                    className="w-full bg-transparent font-outfit text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-outfit text-xs font-semibold text-primary uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="font-outfit text-xs text-accent hover:underline">Forgot?</Link>
              </div>
              <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                <Lock size={16} className="text-primary/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent font-outfit text-sm outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-outfit text-xs text-red-500">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full py-4 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors mt-2">
              Sign In
            </button>

          </form>
        </div>
        
        {activeTab === 'donor' && (
          <p className="text-center mt-6 font-outfit text-sm text-dark/60">
            Want to help? <Link to="/register" className="text-primary font-bold hover:text-accent">Register here</Link>
          </p>
        )}
      </div>
    </div>
  );
};
