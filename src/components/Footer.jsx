import React from 'react';
import { Link } from 'react-router-dom';
export const Footer = () => {
  return (
    <footer className="bg-[#0f2136] text-background rounded-t-[4rem] px-8 md:px-16 pt-24 pb-12 mt-12 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="font-sans font-bold text-3xl mb-4 text-background">Damayan Match</div>
          <p className="font-outfit text-background/60 max-w-sm text-lg">Barangay-Based Relief Goods Matching System. Connecting barangay evacuation centers directly with donors.</p>
        </div>
        <div>
          <h4 className="font-mono text-accent text-sm mb-6 uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-4 font-outfit text-background/80">
            <li><Link to="/needs" className="hover:text-accent transition-colors">Live Needs Board</Link></li>
            <li><Link to="/login" className="hover:text-accent transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-accent transition-colors">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-accent text-sm mb-6 uppercase tracking-widest">Legal</h4>
          <ul className="space-y-4 font-outfit text-background/80">
            <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-outfit text-background/40 text-sm">© 2026 Damayan Network. All rights reserved.</div>
        <div className="flex items-center gap-3 bg-background/5 px-4 py-2 rounded-full border border-background/10">
          <div className="w-2.5 h-2.5 rounded-full bg-urgency-stable animate-pulse"></div>
          <span className="font-mono text-xs text-background/80 uppercase tracking-wider">System Operational</span>
        </div>
      </div>
    </footer>
  );
};
