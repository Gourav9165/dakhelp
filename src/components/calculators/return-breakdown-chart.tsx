'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AppFormatters } from '@/core/formatters/currency-formatter';
import { useLanguage } from '@/core/localization/language-context';

interface ReturnBreakdownChartProps {
  principal: number;
  interest: number;
  total: number;
  title?: string;
}

export function ReturnBreakdownChart({
  principal,
  interest,
  total,
  title,
}: ReturnBreakdownChartProps) {
  const { isHindi } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || total <= 0) {
    return (
      <div className="h-64 rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-[var(--postal-red)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const principalRatio = total > 0 ? (principal / total) * 100 : 0;
  const interestRatio = total > 0 ? (interest / total) * 100 : 0;

  const data = [
    {
      name: isHindi ? 'मूलधन (जमा)' : 'Principal (Invested)',
      value: Math.max(0, principal),
      color: '#245B50', // Postal Green
    },
    {
      name: isHindi ? 'अर्जित ब्याज' : 'Total Interest',
      value: Math.max(0, interest),
      color: '#D85B48', // Postal Red
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[var(--surface-container-low)] border border-[var(--border-subtle)] p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">
          {title || (isHindi ? 'प्रतिफल विभाजन (Breakdown)' : 'Investment Breakdown')}
        </h4>
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          100%
        </span>
      </div>

      <div className="w-full h-52 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload, coordinate }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0];
                const value = Number(item.value) || 0;
                const ratio = total > 0 ? (value / total) * 100 : 0;
                const color = (item.payload as { color?: string })?.color || '#245B50';
                const name = item.name ? String(item.name) : '';
                const isLowerHalf =
                  coordinate?.y != null
                    ? coordinate.y >= 104
                    : name.includes('Interest') || name.includes('ब्याज');

                return (
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 ${
                      isLowerHalf ? 'top-1' : 'bottom-1'
                    } pointer-events-none z-30 transition-all duration-150 ease-out`}
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-container-highest)] border border-[var(--border-subtle)] shadow-md backdrop-blur-sm">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">
                        {name}:
                      </span>
                      <span className="text-xs font-extrabold text-[var(--text-primary)] whitespace-nowrap">
                        {AppFormatters.formatCurrency(value)}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--surface-container-high)] px-1.5 py-0.5 rounded-md">
                        {ratio.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              }}
              wrapperStyle={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-medium text-[var(--text-secondary)]">
            {isHindi ? 'कुल परिपक्वता' : 'Total Value'}
          </span>
          <span className="text-sm font-extrabold text-[var(--text-primary)]">
            {AppFormatters.formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#245B50] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
              {isHindi ? 'मूलधन' : 'Principal'}
            </span>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {principalRatio.toFixed(1)}% ({AppFormatters.formatCurrency(principal)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#D85B48] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
              {isHindi ? 'ब्याज' : 'Interest'}
            </span>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {interestRatio.toFixed(1)}% ({AppFormatters.formatCurrency(interest)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
