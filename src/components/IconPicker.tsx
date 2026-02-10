"use client";
import { cn } from '@/lib/utils';
import { Box, Compass, Heart, List, ShoppingCart, Tag, Users } from 'lucide-react';
import React from 'react';

const icons: Record<string, React.FC<any>> = {
  shopping: ShoppingCart,
  users: Users,
  tag: Tag,
  list: List,
  heart: Heart,
  box: Box,
  compass: Compass,
};

export default function IconPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
<div className="grid grid-cols-4 gap-4">
  {Object.entries(icons).map(([key, Icon]) => {
    const isSelected = value === key;
    
    return (
      <button
        key={key}
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange(key); }}
        className={cn(
          "aspect-square w-full rounded-2xl flex items-center justify-center transition-all duration-200",
          isSelected 
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 scale-105" 
            
            : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        )}
        aria-pressed={isSelected}
        aria-label={`Selecionar ${key}`}
      >
        <Icon 
          className={cn(
            "transition-all duration-200",
            isSelected ? "h-6 w-6" : "h-5 w-5 opacity-70"
          )} 
          strokeWidth={isSelected ? 2.5 : 2}
        />
      </button>
    );
  })}
</div>
  );
}
