import { cn } from '@/lib/utils';
import React from 'react';

export function DropdownMenu({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('relative', className)}>{children}</div>;
}
