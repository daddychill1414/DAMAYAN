import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const GlobalToast = () => {
  const { toast } = useStore();
  const [visible, setVisible] = useState(null);
  const toastRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (toast) {
      // Clear any pending exit timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Set toast data so the element renders
      setVisible(toast);
    }
  }, [toast]);

  // Animate in once the DOM element exists
  useEffect(() => {
    if (visible && toastRef.current) {
      gsap.fromTo(toastRef.current,
        { y: -40, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );

      // Schedule exit
      timerRef.current = setTimeout(() => {
        if (toastRef.current) {
          gsap.to(toastRef.current, {
            y: -40, opacity: 0, scale: 0.92, duration: 0.35, ease: 'power2.in',
            onComplete: () => setVisible(null)
          });
        } else {
          setVisible(null);
        }
      }, 3500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  const Icon = visible.type === 'success' ? CheckCircle2 : visible.type === 'warning' ? AlertTriangle : Info;

  const styles = {
    success: 'bg-primary/95 border-primary/30',
    warning: 'bg-yellow-700/95 border-yellow-500/30',
    info: 'bg-blue-700/95 border-blue-400/30',
  };

  return (
    <div
      ref={toastRef}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className={`${styles[visible.type] || styles.success} backdrop-blur-xl text-background px-6 py-4 rounded-2xl shadow-2xl shadow-black/30 flex items-center gap-4 min-w-[320px] max-w-[90vw] border`}>
        <div className="bg-white/15 p-2 rounded-xl shrink-0">
          <Icon size={18} />
        </div>
        <p className="font-outfit font-semibold text-sm flex-1">{visible.message}</p>
        <button
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            gsap.to(toastRef.current, {
              y: -40, opacity: 0, duration: 0.25, ease: 'power2.in',
              onComplete: () => setVisible(null)
            });
          }}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
