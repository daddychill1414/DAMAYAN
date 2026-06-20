import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Shield, Phone, Mail, Lock, ArrowLeft } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import bgGradient from '../assets/blue gradient.png';
import logoBlue from '../assets/damayan logo blue.png';

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
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Left side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgGradient} alt="Background Gradient" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-primary/40"></div>
        </div>
        
        <div className="relative z-10 p-16 text-white max-w-lg">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-12 bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/10">
            <ArrowLeft size={24} className="mb-4" />
            <span className="font-outfit font-medium text-sm tracking-widest uppercase">Back to Home</span>
          </Link>
          
          <img src={logoBlue} alt="Damayan Logo" className="w-24 h-auto mb-8 brightness-0 invert" />
          <h1 className="font-sans font-extrabold text-5xl leading-tight mb-6">
            Connecting aid directly to those in need.
          </h1>
          <p className="font-outfit text-white/70 text-lg leading-relaxed">
            The official barangay relief matching system. No guesswork, no waste. Just exact aid delivered to the right hands.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <Link to="/" className="absolute top-8 left-8 lg:hidden text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} />
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <img src={logoBlue} alt="Damayan Logo" className="w-16 h-auto mx-auto lg:mx-0 mb-6 lg:hidden" />
            <h2 className="font-sans font-bold text-3xl text-primary mb-3">Welcome Back</h2>
            <p className="font-outfit text-neutralGray text-base">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-neutralGray/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
            {/* Tabs */}
            <div className="flex border-b border-neutralGray/10 p-2 gap-2 bg-background/50">
              <button
                onClick={() => { setActiveTab('donor'); setError(''); }}
                className={`flex-1 py-3 px-4 font-outfit text-sm font-bold rounded-xl transition-all ${
                  activeTab === 'donor' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-neutralGray/5' 
                    : 'bg-transparent text-neutralGray hover:text-primary hover:bg-white/50'
                }`}
              >
                Donor
              </button>
              <button
                onClick={() => { setActiveTab('coordinator'); setError(''); }}
                className={`flex-1 py-3 px-4 font-outfit text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'coordinator' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-neutralGray/5' 
                    : 'bg-transparent text-neutralGray hover:text-primary hover:bg-white/50'
                }`}
              >
                <Shield size={16} /> Barangay
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              
              {activeTab === 'donor' ? (
                <div className="space-y-1.5">
                  <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Phone Number</label>
                  <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                    <Phone size={18} className="text-neutralGray" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 09171234567"
                      className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Barangay Email</label>
                  <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                    <Mail size={18} className="text-neutralGray" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. brgy@gov.ph"
                      className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Password</label>
                  <Link to="/forgot-password" className="font-outfit text-xs font-bold text-accent hover:text-accent/80 transition-colors">Forgot?</Link>
                </div>
                <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                  <Lock size={18} className="text-neutralGray" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-urgency-critical/5 border border-urgency-critical/20 rounded-xl flex items-start gap-3">
                  <div className="text-urgency-critical mt-0.5"><Shield size={16} /></div>
                  <p className="font-outfit text-sm text-urgency-critical font-medium">{error}</p>
                </div>
              )}

              <MagneticButton type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-outfit font-bold text-base hover:shadow-lg hover:shadow-primary/20 transition-all mt-4 flex items-center justify-center">
                Sign In to Account
              </MagneticButton>

            </form>
          </div>
          
          {activeTab === 'donor' && (
            <p className="text-center font-outfit text-sm text-neutralGray">
              Don't have an account yet? <Link to="/register" className="text-primary font-bold hover:text-accent transition-colors">Create one now</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
