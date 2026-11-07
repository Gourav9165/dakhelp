import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[var(--postal-red)] text-white hover:brightness-110 active:brightness-95 shadow-sm focus-visible:ring-[var(--postal-red)]',
      secondary:
        'bg-[var(--postal-green)] text-white hover:brightness-110 active:brightness-95 shadow-sm focus-visible:ring-[var(--postal-green)]',
      amber:
        'bg-[var(--postal-amber)] text-[var(--charcoal)] hover:brightness-105 active:brightness-95 shadow-sm focus-visible:ring-[var(--postal-amber)]',
      outline:
        'bg-transparent border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-container)] active:bg-[var(--surface-container-high)] focus-visible:ring-[var(--postal-red)]',
      ghost:
        'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)] focus-visible:ring-[var(--postal-red)]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
