import { cn } from '@/lib/utils';
import React from 'react';

export function Badge({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex px-2 py-1 rounded bg-gray-800 text-sm', className)}>{children}</span>;
}
