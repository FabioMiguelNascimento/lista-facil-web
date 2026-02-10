import React, { cloneElement, createContext, useContext, useState } from 'react';

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function Dialog({ children, open: controlledOpen, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpenState] = useState(false);
  const isControlled = typeof controlledOpen === 'boolean';
  const openValue = isControlled ? (controlledOpen as boolean) : open;

  const setOpen = (v: boolean) => {
    if (!isControlled) setOpenState(v);
    onOpenChange?.(v);
  };

  return <DialogContext.Provider value={{ open: openValue, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children, asChild }: { children: React.ReactElement<any>; asChild?: boolean }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return null;
  const { setOpen } = ctx;

  if (asChild) {
    // cast to any to allow injecting onClick for arbitrary child elements
    return cloneElement(children as React.ReactElement<any>, { onClick: () => setOpen(true) } as any);
  }

  return <button onClick={() => setOpen(true)}>{children}</button>;
}

export function DialogContent({ children }: { children?: React.ReactNode }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return null;
  const { open, setOpen } = ctx;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative z-10 bg-popover text-popover-foreground p-4 rounded max-w-md w-full">{children}</div>
    </div>
  );
}

export function DialogHeader({ children }: { children?: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
