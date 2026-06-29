import React from 'react';
import { AlertTriangle, Zap, ShieldCheck, Flame } from 'lucide-react';

const config = {
  critical: {
    bg: 'bg-urgency-critical/10',
    border: 'border-urgency-critical/20',
    text: 'text-urgency-critical',
    dot: 'bg-urgency-critical',
    pulse: true,
    label: 'Critical',
    icon: AlertTriangle,
  },
  moderate: {
    bg: 'bg-urgency-warning/10',
    border: 'border-urgency-warning/20',
    text: 'text-urgency-warning',
    dot: 'bg-urgency-warning',
    pulse: false,
    label: 'Moderate',
    icon: Zap,
  },
  stable: {
    bg: 'bg-urgency-stable/10',
    border: 'border-urgency-stable/20',
    text: 'text-urgency-stable',
    dot: 'bg-urgency-stable',
    pulse: false,
    label: 'Stable',
    icon: ShieldCheck,
  },
};

export const UrgencyBadge = ({ urgency, size = 'default', showUrgentTag = false }) => {
  const c = config[urgency] || config.stable;
  const IconComponent = c.icon;

  if (size === 'small') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${c.bg} border ${c.border}`}>
          <IconComponent size={10} className={c.text} />
          <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
        </span>
        {showUrgentTag && urgency === 'critical' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-urgency-critical text-white animate-pulse">
            <Flame size={10} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider">URGENT</span>
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${c.bg} border ${c.border}`}>
        <IconComponent size={14} className={c.text} />
        <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
      </span>
      {showUrgentTag && urgency === 'critical' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-urgency-critical text-white animate-pulse shadow-lg shadow-urgency-critical/30">
          <Flame size={12} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">URGENT</span>
        </span>
      )}
    </span>
  );
};

// ── Status Badge Component ──────────────────────────
const statusConfig = {
  active: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-600', label: 'Active', icon: '🔵' },
  reserved: { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', label: 'Pending', icon: '⏳' },
  verified_full: { bg: 'bg-urgency-stable/10', border: 'border-urgency-stable/20', text: 'text-urgency-stable', label: 'Verified', icon: '✅' },
  verified_partial: { bg: 'bg-urgency-warning/10', border: 'border-urgency-warning/20', text: 'text-urgency-warning', label: 'Partial', icon: '⚠️' },
  rejected: { bg: 'bg-urgency-critical/10', border: 'border-urgency-critical/20', text: 'text-urgency-critical', label: 'Rejected', icon: '❌' },
  expired: { bg: 'bg-neutralGray/10', border: 'border-neutralGray/20', text: 'text-neutralGray', label: 'Expired', icon: '⏰' },
  fulfilled: { bg: 'bg-urgency-stable/10', border: 'border-urgency-stable/20', text: 'text-urgency-stable', label: 'Fulfilled', icon: '✅' },
  closed: { bg: 'bg-neutralGray/10', border: 'border-neutralGray/20', text: 'text-neutralGray', label: 'Closed', icon: '🔒' },
};

export const StatusBadge = ({ status }) => {
  const c = statusConfig[status] || statusConfig.active;
  return (
    <span className={`status-badge ${c.bg} ${c.border} ${c.text}`}>
      <span className="text-[10px]">{c.icon}</span>
      <span>{c.label}</span>
    </span>
  );
};
