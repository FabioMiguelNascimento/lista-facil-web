"use client";
import { Clipboard } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-12 w-12 rounded-md bg-emerald-600/10 flex items-center justify-center">
        <Clipboard className="h-6 w-6 text-emerald-400" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-white leading-tight">Lista Fácil</h1>
        <p className="text-sm text-muted-foreground truncate">Sincronize suas compras em tempo real.</p>
      </div>
    </div>
  );
}
