import { cn } from '@/lib/utils';
import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('px-2 py-2 rounded bg-slate-700 text-white', props.className)} {...props} />;
}
