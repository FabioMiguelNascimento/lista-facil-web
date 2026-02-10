"use client";

import ListCard from "@/components/ListCard";
import BottomNav from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListSummary {
  id: string;
  title: string;
  _count: { items: number; members: number };
}

export default function Dashboard() {
  const { user, isCheckingAuth: authChecking } = useAuthStore();
  const router = useRouter();
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    if (user) {
      api.get("/lists")
        .then((res: any) => setLists(res.data))
        .catch(() => toast.error("Erro ao carregar listas"))
        .finally(() => setLoadingLists(false));
    }
  }, [user]);

  const createList = async () => {
    const title = prompt("Nome da nova lista:");
    if (!title?.trim()) return;

    try {
      const { data } = await api.post("/lists", { title: title.trim() });
      setLists([...lists, { ...data, _count: { items: 0, members: 1 } }]);
      toast.success("Lista criada!");
    } catch (error) {
      toast.error("Erro ao criar lista");
    }
  };

  if (authChecking || !user) return null;

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Minhas Listas</h1>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => useAuthStore.getState().logout()}
            className="shrink-0"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4 pb-36">

        {loadingLists ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : lists.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma lista ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Crie sua primeira lista de compras</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {lists.map((list) => (
              <ListCard key={list.id} id={list.id} title={list.title} items={list._count.items} members={list._count.members} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-4 sm:right-6 z-20 hidden md:block">
        <Button
          onClick={createList}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-transform"
          title="Nova Lista"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav onAdd={createList} />
    </div>
  );
}
