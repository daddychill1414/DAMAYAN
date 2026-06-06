import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { Clock, Shield, FileText, MapPin, User, ArrowRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const PendingVerification = () => {
  const { currentUser } = useStore();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pv-fade', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
      // Pulsing clock animation
      gsap.to('.pulse-ring', {
        scale: 1.4, opacity: 0, duration: 1.5, repeat: -1, ease: 'power2.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role === 'Coordinator' && currentUser.status === 'approved') return <Navigate to="/dashboard" />;
  if (currentUser.role === 'Coordinator' && currentUser.status === 'rejected') return <Navigate to="/appeal" />;

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/95 to-dark/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Animated Clock Icon */}
        <div className="pv-fade relative w-24 h-24 mx-auto mb-8">
          <div className="pulse-ring absolute inset-0 rounded-full border-2 border-accent/40"></div>
          <div className="w-full h-full bg-accent/10 border-2 border-accent/30 rounded-full flex items-center justify-center">
            <Clock size={36} className="text-accent" />
          </div>
        </div>

        <h1 className="pv-fade font-sans font-extrabold text-3xl md:text-4xl text-background mb-3">
          Verification <span className="font-drama italic text-primary/80">Pending</span>
        </h1>
        <p className="pv-fade font-outfit text-background/60 text-base max-w-md mx-auto mb-8">
          Your coordinator application is currently under review by the Damayan admin team. This process typically takes 24-48 hours.
        </p>

        {/* Application Details Card */}
        <div className="pv-fade bg-background/10 backdrop-blur-2xl border border-background/15 rounded-[2rem] p-6 mb-6 text-left">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">Your Application</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background/5 rounded-xl">
              <User size={16} className="text-background/40 shrink-0" />
              <div>
                <span className="font-mono text-[9px] uppercase text-background/35 block">Full Name</span>
                <span className="font-outfit text-sm text-background/80">{currentUser.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/5 rounded-xl">
              <MapPin size={16} className="text-background/40 shrink-0" />
              <div>
                <span className="font-mono text-[9px] uppercase text-background/35 block">Barangay</span>
                <span className="font-outfit text-sm text-background/80">{currentUser.barangay || 'Not specified'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/5 rounded-xl">
              <Shield size={16} className="text-background/40 shrink-0" />
              <div>
                <span className="font-mono text-[9px] uppercase text-background/35 block">Position</span>
                <span className="font-outfit text-sm text-background/80">{currentUser.position || 'Not specified'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/5 rounded-xl">
              <FileText size={16} className="text-background/40 shrink-0" />
              <div>
                <span className="font-mono text-[9px] uppercase text-background/35 block">Document</span>
                <span className="font-outfit text-sm text-background/80">{currentUser.documentName || 'No document uploaded'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="pv-fade inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full px-5 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
          <span className="font-mono text-xs uppercase tracking-wider">Status: Under Review</span>
        </div>

        <div className="pv-fade">
          <p className="font-outfit text-xs text-background/40 mb-4">
            You will gain full access to the coordinator dashboard once your credentials are verified.
          </p>
          <Link to="/needs" className="inline-flex items-center gap-2 bg-background/10 border border-background/20 text-background/60 hover:text-background py-3 px-6 rounded-xl text-sm font-outfit font-semibold transition-all btn-magnetic">
            Browse Needs Board <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
