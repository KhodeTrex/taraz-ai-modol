
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
