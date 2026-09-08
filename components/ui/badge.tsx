import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'purple';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded';

  const variants = {
    default: 'bg-[#0F172A] text-[#94A3B8] border border-[#334155]',
    primary: 'bg-[#0369A1]/25 text-[#38BDF8] border border-[#0284C7]/50',
    secondary: 'bg-[#4F46E5]/25 text-[#818CF8] border border-[#6366F1]/50',
    purple: 'bg-[#581C87]/25 text-[#C084FC] border border-[#9333EA]/50',
    success: 'bg-[#065F46]/25 text-[#34D399] border border-[#059669]/50',
    warning: 'bg-[#78350F]/25 text-[#FBBF24] border border-[#D97706]/50',
    danger: 'bg-[#7F1D1D]/25 text-[#F87171] border border-[#DC2626]/50',
    outline: 'border border-[#334155] text-[#CBD5E1] bg-[#0F172A]/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
}
