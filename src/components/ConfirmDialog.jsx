import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be easily undone.',
  confirmLabel = 'Yes, Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  icon: IconComponent = AlertTriangle,
  isLoading = false,
}) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (open && overlayRef.current && cardRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(cardRef.current,
        { scale: 0.88, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.6)', delay: 0.05 }
      );
    }
  }, [open]);

  if (!open) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-urgency-critical/10',
      iconColor: 'text-urgency-critical',
      confirmBg: 'bg-urgency-critical hover:bg-urgency-critical/90',
      confirmText: 'text-white',
      border: 'border-urgency-critical/20',
    },
    warning: {
      iconBg: 'bg-urgency-warning/10',
      iconColor: 'text-urgency-warning',
      confirmBg: 'bg-urgency-warning hover:bg-urgency-warning/90',
      confirmText: 'text-primary',
      border: 'border-urgency-warning/20',
    },
    info: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      confirmBg: 'bg-primary hover:bg-primary/90',
      confirmText: 'text-background',
      border: 'border-primary/20',
    },
  };

  const s = variantStyles[variant] || variantStyles.danger;

  const handleCancel = () => {
    if (cardRef.current && overlayRef.current) {
      gsap.to(cardRef.current, { scale: 0.92, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.2, delay: 0.05,
        onComplete: () => onCancel?.(),
      });
    } else {
      onCancel?.();
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={handleCancel}></div>

      {/* Card */}
      <div ref={cardRef} className={`relative bg-background rounded-[2rem] shadow-2xl border ${s.border} w-full max-w-sm overflow-hidden`}>
        {/* Top accent bar */}
        <div className={`h-1 w-full ${variant === 'danger' ? 'bg-urgency-critical' : variant === 'warning' ? 'bg-urgency-warning' : 'bg-primary'}`}></div>

        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <IconComponent size={28} className={s.iconColor} />
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-xl text-primary mb-2">{title}</h3>
          <p className="font-outfit text-sm text-neutralGray leading-relaxed mb-6">{message}</p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => !isLoading && onConfirm?.()}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-outfit font-bold text-sm transition-all ${s.confirmBg} ${s.confirmText} disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner w-4 h-4"></span>
                  Processing…
                </>
              ) : (
                confirmLabel
              )}
            </button>

            {/* VERY VISIBLE Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-outfit font-bold text-sm
                bg-white border-2 border-neutralGray/30 text-primary
                hover:border-urgency-critical hover:text-urgency-critical hover:bg-urgency-critical/5
                transition-all"
            >
              <X size={16} />
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
