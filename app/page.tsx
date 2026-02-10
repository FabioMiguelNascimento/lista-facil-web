"use client";

import Header from "@/components/Header";
import IconPicker from "@/components/IconPicker";
import ListCard from "@/components/ListCard";
import BottomNav from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListSummary {
  id: string;
  title: string;
  icon?: string;
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

  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createIcon, setCreateIcon] = useState<string | undefined>("shopping");
  const [creating, setCreating] = useState(false);

  const createList = async () => {
    if (!createTitle?.trim()) return toast.error("Informe um nome para a lista");
    try {
      setCreating(true);
      const { data } = await api.post("/lists", { title: createTitle.trim(), icon: createIcon });
      setLists([...lists, { ...data, icon: createIcon, _count: { items: 0, members: 1 } }]);
      setCreateTitle("");
      setCreateIcon("shopping");
      setCreateOpen(false);
      toast.success("Lista criada!");
    } catch (error) {
      toast.error("Erro ao criar lista");
    } finally {
      setCreating(false);
    }
  };

  if (authChecking || !user) return null;

  return (
    <div className="flex flex-col h-full">
      <Header onNotify={() => toast.info('Notificações (a implementar)')} onSearch={(q) => toast.info(q ? `Buscar: ${q}` : 'Digite para buscar')} />

      <div className="flex-1 overflow-auto space-y-4 pb-36">

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
              <ListCard key={list.id} id={list.id} title={list.title} items={list._count.items} members={list._count.members} icon={list.icon} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-4 sm:right-6 z-20 hidden md:block">
        <Button
          onClick={() => setCreateOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-transform"
          title="Nova Lista"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav onAdd={() => setCreateOpen(true)} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Lista</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <Input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="Nome da lista" />

            <div>
              <div className="text-sm text-muted-foreground mb-2">Ícone</div>
              <IconPicker value={createIcon} onChange={setCreateIcon} />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button onClick={createList} disabled={creating}>{creating ? 'Criando...' : 'Criar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
