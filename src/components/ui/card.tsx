import { cn } from '@/lib/utils';
import React from 'react';

export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('rounded-lg bg-slate-800 p-4', className)}>{children}</div>;
}

export function CardHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}
