"use client";
import IconPicker from "@/components/IconPicker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/api";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  id: string;
  title: string;
  items: number;
  members: number;
  icon?: string;
}

export default function ListCard({ id, title, items, members, icon }: Props) {
  const router = useRouter();
  const initial = title?.trim().charAt(0).toUpperCase() || "L";
  const count = Math.min(members, 3);
  const [currentIcon, setCurrentIcon] = useState(icon ?? 'list');
  const [open, setOpen] = useState(false);

  const updateIcon = async (newIcon: string) => {
    try {
      await api.patch(`/lists/${id}`, { icon: newIcon });
      setCurrentIcon(newIcon);
      setOpen(false);
      toast.success('Ícone atualizado');
    } catch (e) {
      toast.error('Erro ao atualizar ícone');
    }
  };

  return (
    <Card
      className="p-4 rounded-xl bg-popover/80  transition-transform cursor-pointer hover:bg-popover"
      onClick={() => router.push(`/list/${id}`)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  onPointerDown={(e) => { e.stopPropagation(); }}
                  onClick={(e) => { e.stopPropagation(); }}
                  className="cursor-pointer aspect-square h-6 rounded-md flex items-center justify-center bg-muted/40 text-foreground"
                  aria-label="Editar ícone"
                >
                  {(() => {
                    const map: Record<string, any> = {
                      shopping: require('lucide-react').ShoppingCart,
                      users: require('lucide-react').Users,
                      tag: require('lucide-react').Tag,
                      list: require('lucide-react').List,
                      heart: require('lucide-react').Heart,
                      box: require('lucide-react').Box,
                      compass: require('lucide-react').Compass,
                    };
                    const IconComp = map[currentIcon];
                    return IconComp ? <IconComp className="h-5 w-5" /> : null;
                  })()}
                </button>
              </PopoverTrigger>

              <PopoverContent align="start" sideOffset={6} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                <IconPicker value={currentIcon} onChange={(v: string) => { updateIcon(v); }} />
              </PopoverContent>
            </Popover>
          </div>

          <CardTitle className="text-lg font-semibold truncate text-foreground">{title}</CardTitle>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>{items} itens</span>
          </div>

          <div className="flex items-center shrink-0 text-muted-foreground">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center -space-x-2">
          {Array.from({ length: count }).map((_, i) => (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-semibold text-white">{initial}</AvatarFallback>
              </Avatar>
          ))}
        </div>
      </div>
    </Card>
  );
}
