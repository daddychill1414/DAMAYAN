import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ expiresAt, onExpire, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const end = new Date(expiresAt);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
        onExpire?.();
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 60 * 60 * 1000; // < 1 hour
  const isExpired = timeLeft.total <= 0;
  const progress = timeLeft.total > 0 ? (timeLeft.total / (24 * 60 * 60 * 1000)) * 100 : 0;

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 ${compact ? 'text-[9px]' : 'text-xs'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        <span className="font-mono text-red-500 font-bold uppercase tracking-wider">Expired</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
        isUrgent ? 'bg-red-500/10 border-red-500/20' : 'bg-accent/10 border-accent/20'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-accent'}`}></span>
        <span className={`font-mono text-[10px] font-bold ${isUrgent ? 'text-red-500' : 'text-accent'}`}>
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border ${
      isUrgent ? 'bg-red-500/5 border-red-500/20' : 'bg-accent/5 border-accent/20'
    }`}>
      {/* Circular progress ring */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2"
            className="text-primary/10" />
          <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
            strokeDasharray="100" strokeDashoffset={100 - progress}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${isUrgent ? 'text-red-500' : 'text-accent'}`}
            stroke="currentColor" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono text-xs font-bold ${isUrgent ? 'text-red-500' : 'text-primary'}`}>
            {timeLeft.hours}h
          </span>
        </div>
      </div>

      {/* Digital readout */}
      <div className={`font-mono text-lg font-bold tracking-wider ${isUrgent ? 'text-red-500' : 'text-primary'}`}>
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </div>

      <p className={`font-outfit text-[10px] uppercase tracking-wider ${isUrgent ? 'text-red-500/70' : 'text-dark/50'}`}>
        {isUrgent ? '⚠ Expiring Soon' : 'Time Remaining'}
      </p>
    </div>
  );
};
