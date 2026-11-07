'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/core/localization/language-context';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface ScheduleTableProps<T> {
  title?: string;
  description?: string;
  columns: ColumnDef<T>[];
  data: T[];
  footer?: React.ReactNode;
}

export function ScheduleTable<T extends object>({
  title,
  description,
  columns,
  data,
  footer,
}: ScheduleTableProps<T>) {
  const { isHindi } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScroll(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [data]);

  return (
    <div className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-container-low)] overflow-hidden shadow-xs">
      {(title || description) && (
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-container)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            {title && (
              <h4 className="font-bold text-base sm:text-lg text-[var(--text-primary)]">
                {title}
              </h4>
            )}
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
            )}
          </div>
          {canScroll && (
            <div className="flex sm:hidden items-center gap-1.5 text-[11px] font-semibold text-[var(--postal-red)] bg-[var(--primary-container)] px-2.5 py-1 rounded-full w-fit">
              <ArrowLeftRight className="w-3 h-3 animate-pulse" />
              <span>{isHindi ? 'दाईं ओर स्क्रॉल करें' : 'Scroll right to view all'}</span>
            </div>
          )}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto focus-visible:outline-none"
        tabIndex={0}
        aria-label={title || 'Data table'}
      >
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[var(--surface-container-high)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
              {columns.map((col) => {
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';
                return (
                  <th
                    key={col.key}
                    className={`py-3 px-4 font-bold tracking-wider text-[11px] sm:text-xs uppercase whitespace-nowrap ${alignClass} ${
                      col.className || ''
                    }`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-[var(--surface-container)] transition-colors duration-150 odd:bg-transparent even:bg-[var(--surface-container-lowest)]/40"
              >
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left';
                  const cellValue = (row as Record<string, unknown>)[col.key];

                  return (
                    <td
                      key={col.key}
                      className={`py-3 px-4 whitespace-nowrap font-medium text-[var(--text-primary)] ${alignClass} ${
                        col.className || ''
                      }`}
                    >
                      {col.render ? col.render(row, idx) : (cellValue as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="p-3 sm:p-4 bg-[var(--surface-container)] border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          {footer}
        </div>
      )}
    </div>
  );
}
