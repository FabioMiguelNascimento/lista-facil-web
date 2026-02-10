import { cn } from '@/lib/utils';
import React from 'react';


export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 rounded-md border border-zinc-800 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30',
        props.className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
