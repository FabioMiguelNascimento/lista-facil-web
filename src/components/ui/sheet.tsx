import React from 'react';

export function Sheet({ children }: { children?: React.ReactNode }) {
  return <div className="fixed inset-0 bg-black/50">{children}</div>;
}
