import React from 'react';

const config = {
  critical: {
    bg: 'bg-urgency-critical/10',
    border: 'border-urgency-critical/20',
    text: 'text-urgency-critical',
    dot: 'bg-urgency-critical',
    pulse: true,
    label: 'Critical',
  },
  moderate: {
    bg: 'bg-urgency-warning/10',
    border: 'border-urgency-warning/20',
    text: 'text-urgency-warning',
    dot: 'bg-urgency-warning',
    pulse: false,
    label: 'Moderate',
  },
  stable: {
    bg: 'bg-urgency-stable/10',
    border: 'border-urgency-stable/20',
    text: 'text-urgency-stable',
    dot: 'bg-urgency-stable',
    pulse: false,
    label: 'Stable',
  },
};

export const UrgencyBadge = ({ urgency, size = 'default' }) => {
  const c = config[urgency] || config.stable;

  if (size === 'small') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${c.bg} border ${c.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`}></span>
        <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${c.bg} border ${c.border}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`}></span>
      <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
    </span>
  );
};
