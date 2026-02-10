"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
  items: number;
  members: number;
}

export default function ListCard({ id, title, items, members }: Props) {
  const router = useRouter();
  return (
    <Card
      className="p-4 active:scale-95 transition-transform cursor-pointer hover:bg-zinc-900/50"
      onClick={() => router.push(`/list/${id}`)}
    >
      <CardTitle className="text-lg font-semibold mb-3 truncate">{title}</CardTitle>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="h-4 w-4" />
            <span>{items} itens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{members} membros</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">&gt;</div>
      </div>
    </Card>
  );
}
