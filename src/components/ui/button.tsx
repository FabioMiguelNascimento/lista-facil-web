'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'ghost' | string;
  size?: 'icon' | string;
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const base = 'px-3 py-2 rounded inline-flex items-center justify-center';
  const variants: Record<string, string> = {
    outline: 'border border-gray-600 bg-transparent text-white',
    ghost: 'bg-transparent text-white',
  };
  const sizes: Record<string, string> = {
    icon: 'p-0',
  };
  return <button className={cn(base, variants[variant as string] ?? 'bg-indigo-600 text-white', sizes[size as string] ?? '', className)} {...props} />;
}
