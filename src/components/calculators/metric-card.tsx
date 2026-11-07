import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'neutral' | 'accent';
  icon?: React.ReactNode;
  badge?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  variant = 'neutral',
  icon,
  badge,
}: MetricCardProps) {
  const styles = {
    primary: {
      bg: 'bg-[var(--primary-container)]/50 dark:bg-[var(--primary-container)]/30 border-[var(--postal-red)]/30',
      valueColor: 'text-[var(--postal-red)]',
      labelColor: 'text-[var(--text-secondary)]',
    },
    secondary: {
      bg: 'bg-[var(--secondary-container)]/50 dark:bg-[var(--secondary-container)]/30 border-[var(--postal-green)]/30',
      valueColor: 'text-[var(--postal-green)]',
      labelColor: 'text-[var(--text-secondary)]',
    },
    accent: {
      bg: 'bg-[var(--tertiary-container)]/50 dark:bg-[var(--tertiary-container)]/30 border-[var(--postal-amber)]/40',
      valueColor: 'text-amber-700 dark:text-amber-400',
      labelColor: 'text-[var(--text-secondary)]',
    },
    neutral: {
      bg: 'bg-[var(--surface-container-low)] border-[var(--border-subtle)]',
      valueColor: 'text-[var(--text-primary)]',
      labelColor: 'text-[var(--text-secondary)]',
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${current.bg}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs sm:text-sm font-medium ${current.labelColor}`}>
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface-container-highest)] text-[var(--text-secondary)]">
              {badge}
            </span>
          )}
          {icon && <div className="text-[var(--text-secondary)] opacity-80">{icon}</div>}
        </div>
      </div>
      <div>
        <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${current.valueColor}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
