import { cn } from '@/lib/utils';
import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 rounded-md border border-zinc-800 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30',
        props.className,
      )}
      {...props}
    />
  );
}
