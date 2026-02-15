import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ListSummary {
  id: string;
  title: string;
  icon?: string;
  _count: { items: number; members: number };
  // nova propriedade retornada pela API: membros com dados do usuário
  members?: Array<{ user: { id: string; email: string; avatarUrl?: string | null } }>;
}

export function useDashboardState() {
  const { user } = useAuthStore();
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/lists");
      setLists(data);
    } catch (error) {
      toast.error("Erro ao carregar listas");
    } finally {
      setLoading(false);
    }
  };

  const createList = async (title: string, icon?: string): Promise<string | undefined> => {
    if (!title?.trim()) {
      toast.error("Informe um nome para a lista");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticList: ListSummary = {
      id: tempId,
      title: title.trim(),
      icon,
      _count: { items: 0, members: 1 },
      // otimista: o criador aparece como único membro (email preenchido do user store)
      members: [{ user: { id: useAuthStore.getState().user?.id ?? tempId, email: useAuthStore.getState().user?.email ?? 'you', avatarUrl: useAuthStore.getState().user?.avatarUrl ?? null } }],
    };

    setLists((prev) => [...prev, optimisticList]);

    try {
      const { data } = await api.post("/lists", { title: title.trim(), icon });
      
      setLists((prev) =>
        prev.map((list) => (list.id === tempId ? { ...data, icon, _count: { items: 0, members: 1 } } : list))
      );
      
      toast.success("Lista criada!");
      return data.id;
    } catch (error) {
      setLists((prev) => prev.filter((list) => list.id !== tempId));
      toast.error("Erro ao criar lista");
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchLists();
    }
  }, [user]);

  return {
    lists,
    loading,
    createList,
    fetchLists,
  };
}
