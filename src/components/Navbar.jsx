import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import { useStore } from '../store';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { to: '/needs', label: 'Needs Board' },
  { to: '/donate', label: 'Donate' },
  { to: '/map', label: 'Map' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/qr', label: 'Verify' },
  { to: '/feedback', label: 'Feedback' },
];

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

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl rounded-full px-5 py-3 transition-all duration-500 flex items-center justify-between
        ${isScrolledDefault ? 'bg-background/90 backdrop-blur-xl text-primary border border-primary/10 shadow-lg' : 'text-background'}
        [&.nav-scrolled]:bg-background/90 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:text-primary [&.nav-scrolled]:border [&.nav-scrolled]:border-primary/10 [&.nav-scrolled]:shadow-lg`}
      >
        <Link to="/" className="font-sans font-bold text-xl tracking-tight shrink-0">Damayan</Link>
        
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
            <option value="EN">EN</option>
            <option value="TL">TL</option>
            <option value="CEB">CEB</option>
            <option value="ILO">ILO</option>
          </select>
          
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right flex flex-col justify-center">
                <span className="font-sans text-xs font-bold leading-tight">{currentUser.name}</span>
                <span className="font-mono text-[9px] uppercase opacity-60 leading-tight">{currentUser.role}</span>
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
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-primary text-background' : 'text-primary hover:bg-primary/5'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
