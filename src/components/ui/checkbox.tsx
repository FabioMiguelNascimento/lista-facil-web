import { cn } from '@/lib/utils';
import React from 'react';

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={cn('rounded', className)} {...props} />;
}
