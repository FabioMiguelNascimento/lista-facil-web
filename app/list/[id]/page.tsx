"use client";

import { InviteDialog } from "@/components/InviteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import api from "@/lib/api";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Item {
  id: string;
  content: string;
  checked: boolean;
}

interface ListDetails {
  id: string;
  title: string;
  items: Item[];
}

export default function ListPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { socket } = useSocket();

  const [list, setList] = useState<ListDetails | null>(null);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    api.get(`/lists/${id}`)
      .then((res: any) => setList(res.data))
      .catch(() => {
        toast.error("Lista não encontrada");
        router.push("/");
      });
  }, [id, router]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_list", { listId: id });

    socket.on("item_created", (newItem: Item) => {
      setList((prev) => (prev ? { ...prev, items: [...prev.items, newItem] } : null));
    });

    socket.on("item_updated", (updatedItem: Item) => {
      setList((prev) => {
        if (!prev) return null;
        return { ...prev, items: prev.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)) };
      });
    });

    socket.on("item_deleted", ({ id }: { id: string }) => {
      setList((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== id) } : null));
    });

    return () => {
      socket.off("item_created");
      socket.off("item_updated");
      socket.off("item_deleted");
    };
  }, [socket, id]);

  const addItem = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newItemText.trim()) return;

    try {
      const text = newItemText;
      setNewItemText("");
      const { data } = await api.post("/items", { content: text, listId: id });
      setList((prev) => (prev ? { ...prev, items: [...prev.items, data] } : null));
    } catch (error) {
      toast.error("Erro ao adicionar item");
    }
  };

  const toggleItem = async (item: Item) => {
    const newStatus = !item.checked;
    setList((prev) => {
      if (!prev) return null;
      return { ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, checked: newStatus } : i)) };
    });

    try {
      await api.patch(`/items/${item.id}`, { checked: newStatus });
    } catch (error) {
      setList((prev) => {
        if (!prev) return null;
        return { ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, checked: item.checked } : i)) };
      });
      toast.error("Erro de conexão");
    }
  };

  const deleteItem = async (itemId: string) => {
    setList((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : null));
    try {
      await api.delete(`/items/${itemId}`);
    } catch (error) {
      toast.error("Erro ao deletar item");
    }
  };

  if (!list) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Carregando lista...</p>
        </div>
      </div>
    );
  }

  const pendingItems = list.items.filter((i) => !i.checked);
  const checkedItems = list.items.filter((i) => i.checked);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur z-10 sticky top-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="shrink-0"> 
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg truncate">{list.title}</h1>
        </div>
        <div className="shrink-0">
          <InviteDialog listId={list.id} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {pendingItems.map((item) => (
              <ItemRow key={item.id} item={item} onToggle={() => toggleItem(item)} onDelete={() => deleteItem(item.id)} />
            ))}
          </AnimatePresence>
          {pendingItems.length === 0 && checkedItems.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Lista vazia</p>
              <p className="text-xs mt-1">Adicione itens abaixo</p>
            </div>
          )}
        </div>

        {checkedItems.length > 0 && (
          <>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2 pt-2">Concluídos ({checkedItems.length})</div>
            <div className="space-y-2.5 opacity-60">
              <AnimatePresence mode="popLayout">
                {checkedItems.map((item) => (
                  <ItemRow key={item.id} item={item} onToggle={() => toggleItem(item)} onDelete={() => deleteItem(item.id)} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border pb-safe">
        <form onSubmit={addItem} className="flex gap-2 max-w-md mx-auto">
          <Input 
            value={newItemText} 
            onChange={(e) => setNewItemText(e.target.value)} 
            placeholder="Adicionar item..." 
            className="h-12 text-base" 
            autoComplete="off"
            autoFocus={false}
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-transform">
            <Plus className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ItemRow({ item, onToggle, onDelete }: { item: Item; onToggle: () => void; onDelete: () => void }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0, padding: 0 }}
      transition={{ duration: 0.18 }}
      className={clsx(
        "group flex items-center justify-between p-3.5 rounded-xl border transition-colors",
        item.checked ? "bg-zinc-900/30 border-transparent" : "bg-card border-border shadow-sm"
      )}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      whileTap={{ scale: 0.995 }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onToggle}>
        <motion.div
          initial={false}
          animate={item.checked ? { backgroundColor: "#10B981", borderColor: "#10B981" } : { backgroundColor: "transparent", borderColor: "var(--muted-foreground)" }}
          transition={{ duration: 0.18 }}
          className={clsx("h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors")}
        >
          {item.checked && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.12 }}>
              <Check className="h-3 w-3 text-black" strokeWidth={4} />
            </motion.div>
          )}
        </motion.div>

        <motion.span
          className="text-base transition-all min-w-0 wrap-break-word"
          initial={false}
          animate={item.checked ? { opacity: 0.6 } : { opacity: 1 }}
          style={{ textDecoration: item.checked ? "line-through" : "none" }}
          transition={{ duration: 0.18 }}
        >
          {item.content}
        </motion.span>
      </div>

      <motion.button 
        whileTap={{ scale: 0.9 }} 
        onClick={onDelete} 
        className={clsx(
          "shrink-0 p-2 rounded-lg transition-all",
          showDelete ? "opacity-100" : "opacity-0 md:opacity-0 md:group-hover:opacity-100"
        )}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </motion.button>
    </motion.div>
  );
}
