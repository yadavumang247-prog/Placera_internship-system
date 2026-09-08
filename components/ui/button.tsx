import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#0B1120] disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm';

    const variants = {
      primary:
        'bg-[#0284C7] text-white hover:bg-[#0369A1] focus:ring-[#38BDF8] shadow-sm',
      secondary:
        'bg-[#334155] text-[#F8FAFC] hover:bg-[#475569] focus:ring-[#64748B] shadow-sm',
      outline:
        'border border-[#334155] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1E293B] hover:border-[#475569] focus:ring-[#38BDF8] shadow-sm',
      danger:
        'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#EF4444] shadow-sm',
      ghost:
        'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] focus:ring-[#38BDF8]',
      success:
        'bg-[#059669] text-white hover:bg-[#047857] focus:ring-[#10B981] shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
