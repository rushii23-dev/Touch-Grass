'use client';

import React from 'react';
import { MinimalCard } from './MinimalCard';

interface InteractiveGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Clean minimal card component with subtle hover transition.
 */
export function InteractiveGlassCard({ children, className = '' }: InteractiveGlassCardProps) {
  return <MinimalCard className={className}>{children}</MinimalCard>;
}
