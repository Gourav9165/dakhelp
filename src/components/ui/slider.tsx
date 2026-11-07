import React from 'react';

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  displayValue?: string;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  displayValue,
  className = '',
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {(label || displayValue) && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          {label && <span className="text-[var(--text-primary)]">{label}</span>}
          {displayValue && (
            <span className="font-bold text-[var(--postal-red)]">{displayValue}</span>
          )}
        </div>
      )}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--postal-red) 0%, var(--postal-red) ${percentage}%, var(--surface-container-highest) ${percentage}%, var(--surface-container-highest) 100%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--postal-red)] outline-none"
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-medium">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
