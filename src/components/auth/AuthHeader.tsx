"use client";
import { Clipboard } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-md bg-emerald-600/10 flex items-center justify-center">
        <Clipboard className="h-6 w-6 md:h-7 md:w-7 text-emerald-400" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">Lista Fácil</h1>
        <p className="text-sm md:text-base text-muted-foreground truncate">Sincronize suas compras em tempo real.</p>
      </div>
    </div>
  );
}
