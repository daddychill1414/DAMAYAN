import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { ArrowRight, Eye, EyeOff, LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const { login, showToast } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
      return;
    }

    showToast(`Welcome back, ${result.user.name}!`, 'success');

    // Redirect based on role and verification status
    const { user } = result;
    if (user.role === 'Admin') navigate('/admin');
    else if (user.role === 'Coordinator') {
      if (user.status === 'approved') navigate('/dashboard');
      else if (user.status === 'rejected') navigate('/appeal');
      else navigate('/pending');
    }
    else navigate('/donor-dashboard');
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden bg-dark">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618090584126-129cd1f3f4e2?q=80&w=2070&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-primary/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        {/* Left: Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="fade-up inline-flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="font-mono text-xs tracking-widest uppercase text-accent">Authentication</span>
          </div>
          <h1 className="fade-up font-sans font-extrabold text-5xl md:text-7xl text-background mb-4 leading-tight">
            Enter the <br /><span className="font-drama italic text-primary/80">Network.</span>
          </h1>
          <p className="fade-up font-outfit text-background/60 text-lg max-w-md mx-auto lg:mx-0">
            Sign in with your credentials to access the Damayan disaster relief platform.
          </p>

          {/* Demo accounts info */}
          <div className="fade-up mt-8 bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-5 max-w-md mx-auto lg:mx-0">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {[
                { label: 'Admin', email: 'admin@damayan.ph', pw: 'admin123' },
                { label: 'Coordinator (Approved)', email: 'maria@brgy.ph', pw: 'coord123' },
                { label: 'Coordinator (Pending)', email: 'juan@brgy.ph', pw: 'coord123' },
                { label: 'Donor', email: 'donor@email.com', pw: 'donor123' },
              ].map(acc => (
                <button
                  key={acc.email} type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pw); setError(''); }}
                  className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-background/5 hover:bg-background/10 transition-colors group"
                >
                  <div>
                    <span className="font-outfit text-xs font-semibold text-background/70">{acc.label}</span>
                    <span className="font-mono text-[10px] text-background/40 block">{acc.email}</span>
                  </div>
                  <ArrowRight size={14} className="text-background/30 group-hover:text-accent transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="fade-up flex-1 w-full max-w-md">
          <div className="bg-background/10 backdrop-blur-2xl border border-background/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-accent/20 rounded-xl">
                <LogIn size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-lg text-background">Sign In</h2>
                <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider">Secure Authentication</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Email Address</label>
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@email.com"
                  className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                />
              </div>

              <div>
                <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 pr-12 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background/70 transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${remember ? 'bg-accent border-accent' : 'border-background/30 bg-background/5'}`}
                  >
                    {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="font-outfit text-xs text-background/50 group-hover:text-background/70 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="font-outfit text-xs text-accent hover:underline font-semibold">Forgot Password?</Link>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="font-outfit text-xs text-red-400">{error}</p>
                </div>
              )}

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl text-sm font-outfit font-semibold btn-magnetic hover:shadow-lg hover:shadow-accent/20 transition-all">
                Sign In <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-outfit text-xs text-background/40">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:underline font-semibold">Create Account</Link>
              </p>
            </div>

            <p className="font-mono text-[10px] text-center text-background/30 mt-4 uppercase tracking-widest">
              Secured via Damayan Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
