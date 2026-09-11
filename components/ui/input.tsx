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
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#D8CEBC]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2 text-sm text-[#FAF8F5] bg-[#0A1128] border border-[#1E3466] rounded-lg shadow-sm placeholder-[#7E8CA8] focus:outline-none focus:ring-2 focus:ring-[#E5BA73]/40 focus:border-[#E5BA73] transition-colors disabled:bg-[#142247] disabled:text-[#7E8CA8]',
              error && 'border-[#EF4444] focus:ring-[#EF4444]/40 focus:border-[#EF4444]',
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#F87171] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#D8CEBC]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
