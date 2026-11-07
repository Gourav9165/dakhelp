import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
  presets?: { label: string; value: number }[];
  onPresetSelect?: (val: number) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      prefixText,
      suffixText,
      presets,
      onPresetSelect,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {prefixText && (
            <span className="absolute left-3.5 text-sm font-medium text-[var(--text-secondary)] pointer-events-none select-none">
              {prefixText}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl bg-[var(--surface-container-lowest)] border px-3.5 py-2.5 text-sm sm:text-base font-medium text-[var(--text-primary)] transition-all outline-none focus:ring-2 placeholder:text-[var(--text-secondary)]/50 ${
              prefixText ? 'pl-9' : ''
            } ${suffixText ? 'pr-12' : ''} ${
              error
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-[var(--border-subtle)] focus:border-[var(--postal-red)] focus:ring-[var(--postal-red)]/15'
            } ${className}`}
            {...props}
          />
          {suffixText && (
            <span className="absolute right-3.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)] pointer-events-none select-none">
              {suffixText}
            </span>
          )}
        </div>

        {presets && presets.length > 0 && onPresetSelect && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onPresetSelect(preset.value)}
                className="text-xs px-2.5 py-1 rounded-md bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer select-none"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
