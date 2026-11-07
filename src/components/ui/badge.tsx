import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'neutral' | 'outline' | 'success';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    primary:
      'bg-[var(--primary-container)] text-[var(--on-primary-container)] font-semibold',
    secondary:
      'bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-semibold',
    amber:
      'bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)] font-semibold',
    neutral:
      'bg-[var(--surface-container-high)] text-[var(--text-secondary)] font-medium',
    outline:
      'bg-transparent border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium',
    success:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
