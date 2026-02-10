import { cn } from '@/lib/utils';
import React from 'react';

export function Label({ 
  children, 
  htmlFor, 
  className 
}: { 
  children?: React.ReactNode; 
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={cn("text-sm block mb-1 text-muted-foreground", className)}
    >
      {children}
    </label>
  );
}
