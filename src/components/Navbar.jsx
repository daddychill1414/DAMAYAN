import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import { useStore } from '../store';
import { Menu, X, ShieldAlert } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const { language, setLanguage, currentUser, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          start: 'top -50',
          end: 99999,
          toggleClass: { className: 'nav-scrolled', targets: navRef.current },
        });
      });
      return () => ctx.revert();
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isScrolledDefault = location.pathname !== '/';

  // Dynamic nav links based on role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { to: '/needs', label: 'Needs Board' },
        { to: '/ledger', label: 'Financial Ledger' },
        { to: '/map', label: 'Map' },
      ];
    }

    if (currentUser.role === 'Admin') {
      return [
        { to: '/admin', label: 'Admin Center' },
        { to: '/ledger', label: 'Financial Ledger' },
        { to: '/needs', label: 'Needs Board' },
        { to: '/qr', label: 'Verify Delivery' },
      ];
    }

    if (currentUser.role === 'Coordinator') {
      if (currentUser.status === 'approved') {
        return [
          { to: '/smart-match', label: 'Match Donations' },
          { to: '/ledger', label: 'Financial Ledger' },
          { to: '/needs', label: 'Needs Board' },
          { to: '/map', label: 'Map' },
          { to: '/qr', label: 'QR Scanner' },
        ];
      }
      return [
        { to: '/pending', label: 'Verification Status' },
        { to: '/needs', label: 'Needs Board' },
      ];
    }

    // Donor/Volunteer
    return [
      { to: '/donor-dashboard', label: 'My Dashboard' },
      { to: '/ledger', label: 'Financial Ledger' },
      { to: '/needs', label: 'Needs Board' },
      { to: '/donate', label: 'Donate' },
      { to: '/map', label: 'Map' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl rounded-full px-5 py-3 transition-all duration-500 flex items-center justify-between
        ${isScrolledDefault ? 'bg-background/90 backdrop-blur-xl text-primary border border-primary/10 shadow-lg' : 'text-background'}
        [&.nav-scrolled]:bg-background/90 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:text-primary [&.nav-scrolled]:border [&.nav-scrolled]:border-primary/10 [&.nav-scrolled]:shadow-lg`}
      >
        <Link to="/" className="font-sans font-bold text-xl tracking-tight shrink-0 flex items-center gap-2">
          Damayan
          {currentUser?.role === 'Coordinator' && currentUser.status === 'pending' && (
            <span className="hidden md:flex items-center gap-1 bg-yellow-500/20 text-yellow-500 text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-yellow-500/30">
              <ShieldAlert size={10} /> Pending Verification
            </span>
          )}
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-outfit font-semibold">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover-lift hover:text-accent transition-colors whitespace-nowrap ${location.pathname === link.to ? 'text-accent' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-[10px] font-mono font-bold outline-none cursor-pointer border border-current/20 rounded-full px-2 py-1"
          >
            <option value="EN" className="text-dark">EN</option>
            <option value="TL" className="text-dark">TL</option>
            <option value="CEB" className="text-dark">CEB</option>
            <option value="ILO" className="text-dark">ILO</option>
          </select>
          
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right flex flex-col justify-center">
                <span className="font-sans text-xs font-bold leading-tight">{currentUser.name}</span>
                <span className={`font-mono text-[9px] uppercase leading-tight ${currentUser.role === 'Admin' ? 'text-violet-500' : 'opacity-60'}`}>
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={logout}
                className="bg-background/10 hover:bg-red-500/10 hover:text-red-500 border border-current/10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <MagneticButton className="bg-accent text-background px-5 py-2 text-xs hidden sm:flex">
              <Link to="/login">Sign In</Link>
            </MagneticButton>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-background/95 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl z-50 p-6 lg:hidden">
          <div className="flex flex-col gap-3 font-outfit text-sm font-semibold">
            {currentUser?.role === 'Coordinator' && currentUser.status === 'pending' && (
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-xl mb-2">
                <ShieldAlert size={14} /> Account Pending Verification
              </div>
            )}

            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-primary text-background' : 'text-primary hover:bg-primary/5'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-[1px] w-full bg-primary/10 my-2"></div>
            
            {currentUser ? (
              <div className="flex items-center justify-between p-3">
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-primary">{currentUser.name}</span>
                  <span className="font-mono text-[10px] uppercase text-primary/60">{currentUser.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
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
