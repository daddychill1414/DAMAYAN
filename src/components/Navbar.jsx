import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import { useStore } from '../store';
import { Menu, X } from 'lucide-react';
import logoBlue from '../assets/damayan logo blue.png';
import logoWhite from '../assets/damayan white.png';

gsap.registerPlugin(ScrollTrigger);

export const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setIsScrolled(window.scrollY > 50);
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          start: 'top -50',
          end: 99999,
          onToggle: (self) => setIsScrolled(self.isActive),
        });
      });
      return () => ctx.revert();
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Dynamic nav links based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { to: '/needs', label: 'Needs Board' },
        { to: '/help', label: 'Help' },
      ];
    }

    if (currentUser.userType === 'coordinator') {
      return [
        { to: '/coordinator', label: 'Coordinator Dashboard' },
        { to: '/verify', label: 'Verify Donation' },
        { to: '/needs', label: 'Needs Board' },
        { to: '/help', label: 'Help' },
      ];
    }

    // Donor
    return [
      { to: '/donor', label: 'My Dashboard' },
      { to: '/needs', label: 'Needs Board' },
      { to: '/help', label: 'Help' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl rounded-full px-5 py-3 transition-all duration-500 flex items-center justify-between ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-xl text-primary border border-neutralGray/10 shadow-lg' 
            : 'text-background border border-transparent'
        }`}
      >
        <Link to="/" className="font-sans font-bold text-xl tracking-tight shrink-0 flex items-center gap-3">
          <img 
            src={isScrolled ? logoBlue : logoWhite} 
            alt="Damayan Logo" 
            className="w-7 h-auto"
          />
          Damayan
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-outfit font-semibold">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover-lift transition-colors whitespace-nowrap ${
                location.pathname === link.to 
                  ? 'text-accent' 
                  : isScrolled ? 'hover:text-accent' : 'text-background/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right flex flex-col justify-center">
                <span className="font-sans text-xs font-bold leading-tight">{currentUser.name || currentUser.coordinatorName}</span>
                <span className={`font-mono text-[9px] uppercase leading-tight ${currentUser.userType === 'coordinator' ? 'text-accent' : 'opacity-60'}`}>
                  {currentUser.userType}
                </span>
              </div>
              <button 
                onClick={logout}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                  isScrolled 
                    ? 'bg-background/10 hover:bg-urgency-critical/10 hover:text-urgency-critical border-current/10' 
                    : 'bg-white/10 hover:bg-red-500/20 hover:text-white border-white/20'
                }`}
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex">
              <MagneticButton className={`px-6 py-2.5 text-xs font-bold transition-all bg-accent text-white ${
                isScrolled
                  ? 'shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.6)]'
                  : 'shadow-[0_8px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_10px_30px_rgba(245,158,11,0.6)]'
              }`}>
                Sign In
              </MagneticButton>
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className={`lg:hidden p-1 ${isScrolled ? 'text-primary' : 'text-white'}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-neutralGray/10 shadow-2xl z-50 p-6 lg:hidden">
          <div className="flex flex-col gap-3 font-outfit text-sm font-semibold">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-primary text-background' : 'text-primary hover:bg-primary/5'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-[1px] w-full bg-neutralGray/10 my-2"></div>
            
            {currentUser ? (
              <div className="flex items-center justify-between p-3">
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-primary">{currentUser.name || currentUser.coordinatorName}</span>
                  <span className="font-mono text-[10px] uppercase text-neutralGray">{currentUser.userType}</span>
                </div>
                <button 
                  onClick={logout}
                  className="bg-urgency-critical/10 text-urgency-critical px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="w-full text-center bg-accent text-background p-3 rounded-xl font-bold transition-colors hover:bg-accent/90">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};
