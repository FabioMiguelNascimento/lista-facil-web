import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export function Tabs({ children, defaultValue, className }: { children: React.ReactNode; defaultValue?: string; className?: string }) {
  const [value, setValue] = useState(defaultValue ?? '');
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ 
  value, 
  children, 
  className 
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value || (!ctx.value && value === 'login');
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 transition-colors ${active ? 'bg-zinc-800' : 'bg-transparent'} ${className || ''}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  return <div style={{ display: ctx.value === value ? 'block' : 'none' }}>{children}</div>;
}
