import React from 'react';

export const MagneticButton = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`group relative overflow-hidden rounded-full font-bold transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] hover:-translate-y-[1px] ${className}`}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
