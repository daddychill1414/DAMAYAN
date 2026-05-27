import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { Heart, Package, Shield, Activity, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

const ROLES = [
  { id: 'Donor', icon: Heart, desc: 'Pledge supplies and track donations' },
  { id: 'Volunteer', icon: Package, desc: 'Claim micro-tasks and deliver aid' },
  { id: 'Center Admin', icon: Shield, desc: 'Manage local evacuation center' },
  { id: 'Coordinator', icon: Activity, desc: 'Oversee network & dispatch alerts' }
];

export const Login = () => {
  const [selectedRole, setSelectedRole] = useState('Donor');
  const [name, setName] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole, name || 'Guest User');
    
    // Redirect based on role
    if (selectedRole === 'Coordinator') navigate('/dashboard');
    else if (selectedRole === 'Center Admin') navigate('/qr');
    else if (selectedRole === 'Volunteer') navigate('/volunteer');
    else navigate('/needs');
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden bg-dark">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618090584126-129cd1f3f4e2?q=80&w=2070&auto=format&fit=crop" 
          alt="Organic Tech Background" 
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
            Enter the <br/><span className="font-drama italic text-primary/80">Network.</span>
          </h1>
          <p className="fade-up font-outfit text-background/60 text-lg max-w-md mx-auto lg:mx-0">
            Damayan relies on verified roles to maintain absolute precision during disaster relief operations.
          </p>
        </div>

        {/* Right: Glassmorphism Form */}
        <div className="fade-up flex-1 w-full max-w-md">
          <div className="bg-background/10 backdrop-blur-2xl border border-background/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
            <form onSubmit={handleLogin} className="space-y-6">
              
              <div>
                <label className="block font-outfit text-sm font-semibold text-background/80 mb-3">Select Authorization Role</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 btn-magnetic ${
                        selectedRole === r.id
                          ? 'bg-primary/90 border-primary text-background shadow-lg scale-[1.02]'
                          : 'bg-background/5 border-background/10 text-background/60 hover:bg-background/10'
                      }`}
                    >
                      <r.icon size={18} className={selectedRole === r.id ? 'text-accent' : ''} />
                      <div>
                        <div className="font-sans font-bold text-sm">{r.id}</div>
                        <div className={`font-mono text-[9px] uppercase tracking-wider mt-1 ${selectedRole === r.id ? 'text-background/70' : 'text-background/40'}`}>
                          {r.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Display Name (Optional)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                />
              </div>

              <MagneticButton type="submit" className="w-full bg-accent text-white py-4 text-sm mt-4">
                Initialize Session <ArrowRight size={16} />
              </MagneticButton>
            </form>
            <p className="font-mono text-[10px] text-center text-background/40 mt-6 uppercase tracking-widest">
              Secured via Damayan Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
