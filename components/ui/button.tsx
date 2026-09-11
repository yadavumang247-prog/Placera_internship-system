import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#0A1128] disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm';

    const variants = {
      primary:
        'bg-[#E5BA73] text-[#0A1128] hover:bg-[#D4A253] focus:ring-[#F3CA68] shadow-md shadow-[#E5BA73]/15',
      navy:
        'bg-[#0F1A36] text-[#E5BA73] border border-[#1E3466] hover:bg-[#142247] hover:border-[#E5BA73]/60 focus:ring-[#E5BA73] shadow-sm',
      secondary:
        'bg-[#142247] text-[#FAF8F5] hover:bg-[#1A2C5B] border border-[#1E3466] focus:ring-[#E5BA73] shadow-sm',
      outline:
        'border border-[#1E3466] bg-[#0F1A36] text-[#FAF8F5] hover:bg-[#142247] hover:border-[#E5BA73]/60 focus:ring-[#E5BA73] shadow-sm',
      danger:
        'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#EF4444] shadow-sm',
      ghost:
        'text-[#D8CEBC] hover:text-[#FAF8F5] hover:bg-[#142247] focus:ring-[#E5BA73]',
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
