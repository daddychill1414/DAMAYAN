import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, Check, ArrowRight } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useStore();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (sent) {
      gsap.fromTo('.success-icon', { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' });
      gsap.from('.success-text', { y: 20, opacity: 0, duration: 0.5, delay: 0.3, stagger: 0.1, ease: 'power3.out' });
    }
  }, [sent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    const result = forgotPassword(email);
    if (!result.success) { setError(result.error); return; }
    setSent(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/login" className="fade-up inline-flex items-center gap-2 text-background/50 hover:text-accent font-outfit text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="fade-up bg-background/10 backdrop-blur-2xl border border-background/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/20 rounded-xl"><Mail size={20} className="text-accent" /></div>
                <div>
                  <h2 className="font-sans font-bold text-lg text-background">Reset Password</h2>
                  <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider">Password Recovery</p>
                </div>
              </div>

              <p className="font-outfit text-sm text-background/60 mb-6">Enter your registered email address and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Email Address</label>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@email.com"
                    className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="font-outfit text-xs text-red-400">{error}</p>
                  </div>
                )}

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl text-sm font-outfit font-semibold btn-magnetic hover:shadow-lg hover:shadow-accent/20 transition-all">
                  Send Reset Link <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="success-icon w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-full mx-auto flex items-center justify-center mb-6">
                <Check size={28} className="text-green-400" />
              </div>
              <h2 className="success-text font-sans font-bold text-xl text-background mb-2">Check Your Email</h2>
              <p className="success-text font-outfit text-sm text-background/60 mb-2">We've sent a password reset link to:</p>
              <p className="success-text font-mono text-sm text-accent mb-6">{email}</p>
              <p className="success-text font-outfit text-xs text-background/40 mb-6">
                If you don't see the email, check your spam folder. The link expires in 30 minutes.
              </p>
              <Link to="/login" className="success-text inline-flex items-center gap-2 bg-background/10 border border-background/20 text-background/70 hover:text-background py-3 px-6 rounded-xl text-sm font-outfit font-semibold transition-all btn-magnetic">
                <ArrowLeft size={16} /> Return to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
