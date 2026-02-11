"use client";

import { InviteDialog } from "@/components/InviteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useListState from "@/hooks/useListState";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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


  const [newItemText, setNewItemText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { list, addItem, toggleItem, deleteItem, fetchList } = useListState(id);

  useEffect(() => {
    fetchList().catch(() => {
      toast.error("Lista não encontrada");
      router.push("/");
    });
  }, [fetchList, router]);

  const handleAddItem = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newItemText.trim()) return;

    const text = newItemText;
    setNewItemText("");
    try {
      await addItem(text);
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Erro ao adicionar item");
    }
  };

  const handleToggleItem = async (item: Item) => {
    try {
      await toggleItem(item);
    } catch (error) {
      toast.error("Erro de conexão");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
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

  const items = list.items;

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
            <div className="divide-y divide-border rounded-xl overflow-hidden shadow-sm">
              {items.map((item: Item) => (
                <ItemRow key={item.id} item={item} onToggle={() => handleToggleItem(item)} onDelete={() => handleDeleteItem(item.id)} />
              ))}
            </div>
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="h-14 w-14 mx-auto mb-4 opacity-40" />
              <p className="text-sm font-semibold mb-2">Sua lista está vazia</p>
              <p className="text-xs mb-4">Adicione itens para começar a compartilhar tarefas com colaboradores.</p>
              <Button variant="outline" onClick={() => inputRef.current?.focus()}>Adicionar primeiro item</Button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border pb-safe">
        <form onSubmit={handleAddItem} className="flex gap-4 max-w-md mx-auto items-center">
          <Input
            ref={inputRef}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Adicionar item..."
            className="w-full h-10 text-sm rounded-tl-md rounded-bl-md"
            autoComplete="off"
            autoFocus={false}
          />  
          <Button
            type="submit"
            className="h-10 w-10 shrink-0 rounded-tr-md rounded-br-md bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-transform flex items-center justify-center"
            aria-label="Adicionar item"
          >
            <Plus className="h-5 w-5" />
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, height: 0, margin: 0, padding: 0 }}
      transition={{ duration: 0.16 }}
      className={clsx(
        "group flex items-center justify-between px-4 py-3 bg-card",
        item.checked ? "opacity-70" : ""
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
