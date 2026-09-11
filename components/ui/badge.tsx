import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'beige' | 'navy';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-md';

  const variants = {
    default: 'bg-[#0F1A36] text-[#D8CEBC] border border-[#1E3466]',
    primary: 'bg-[#E5BA73]/15 text-[#F3CA68] border border-[#E5BA73]/40',
    beige: 'bg-[#E5BA73]/20 text-[#F3CA68] border border-[#E5BA73]/50',
    navy: 'bg-[#0A1128] text-[#E5BA73] border border-[#1E3466]',
    secondary: 'bg-[#142247] text-[#CAD7EE] border border-[#1E3466]',
    success: 'bg-[#065F46]/25 text-[#34D399] border border-[#059669]/50',
    warning: 'bg-[#E5BA73]/20 text-[#F3CA68] border border-[#D4A253]/50',
    danger: 'bg-[#7F1D1D]/25 text-[#F87171] border border-[#DC2626]/50',
    outline: 'border border-[#1E3466] text-[#D8CEBC] bg-[#0A1128]/60',
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
