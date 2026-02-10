import { cn } from '@/lib/utils';
import React from 'react';

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-full bg-gray-400', className)} {...props} />;
}
