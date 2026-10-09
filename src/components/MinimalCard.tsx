import React from 'react';

interface MinimalCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MinimalCard({ children, className = '' }: MinimalCardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.035] hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}
