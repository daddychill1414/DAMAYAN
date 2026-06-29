import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export const HelperTooltip = ({ text, children, position = 'top' }) => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="p-0.5 text-neutralGray/60 hover:text-accent transition-colors rounded-full hover:bg-accent/10 cursor-help"
        aria-label="Show help"
      >
        {children || <HelpCircle size={14} />}
      </button>

      {open && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[position] || positionClasses.top}`}
        >
          <div className="bg-primary text-background px-4 py-3 rounded-xl shadow-xl shadow-primary/20 border border-primary/80 max-w-[260px] min-w-[200px]">
            <div className="flex items-start gap-2">
              <p className="font-outfit text-xs leading-relaxed flex-1">{text}</p>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 p-0.5 hover:bg-white/10 rounded transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};
