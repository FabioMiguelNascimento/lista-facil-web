"use client";
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import InvitesPopover from './InvitesPopover';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onNotify?: () => void;
}

export default function Header({ onSearch, onNotify }: HeaderProps) {
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [expanded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(q.trim());
      setExpanded(false);
    }
    if (e.key === 'Escape') {
      setExpanded(false);
      setQ('');
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="relative flex items-center justify-between p-4 h-16">
        
        <div className={cn(
            "flex-1 transition-opacity duration-200",
            expanded ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
            Minhas Listas
          </h1>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-muted-foreground hover:text-foreground p-2 transition-colors"
            aria-label="Abrir busca"
          >
            <Search className="h-5 w-5" />
          </button>

          {expanded && (
            <div
              className="absolute inset-0 z-30 flex items-center px-1 sm:px-6 bg-background/95 backdrop-blur"
              onClick={() => {
                setExpanded(false);
                setQ('');
              }}
            >
              <div className="flex-1 max-w-3xl mx-auto w-full relative" onClick={(e) => e.stopPropagation()}>
                <Input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar listas..."
                  className="w-full h-10 pr-10"
                  aria-label="Buscar listas"
                />

                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    setExpanded(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors p-1"
                  aria-label="Fechar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className={cn(
              "transition-all duration-200",
              expanded ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            <InvitesPopover />
          </div>

        </div>
      </div>
    </header>
  );
}