import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2 text-sm text-[#F8FAFC] bg-[#0F172A] border border-[#334155] rounded-md shadow-sm placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8] transition-colors disabled:bg-[#1E293B] disabled:text-[#64748B]',
              error && 'border-[#EF4444] focus:ring-[#EF4444]/40 focus:border-[#EF4444]',
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#F87171] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#94A3B8]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
