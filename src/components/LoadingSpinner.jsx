import React from 'react';

export const LoadingSpinner = ({ size = 'sm', label = '', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`loading-spinner ${sizeClasses[size] || sizeClasses.sm}`}></span>
      {label && <span className="font-outfit text-xs text-neutralGray animate-pulse">{label}</span>}
    </span>
  );
};
