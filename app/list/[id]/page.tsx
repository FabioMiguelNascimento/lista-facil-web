"use client";

import { InviteDialog } from "@/components/InviteDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useListState from "@/hooks/useListState";
import { api } from "@/lib/api";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Info, Plus, ShoppingCart, Trash2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';

interface Item {
  id: string;
  content: string;
  checked: boolean;
  owner?: { id: string; email: string; avatarUrl?: string | null } | null;
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteList = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/lists/${id}`);
      toast.success("Lista deletada com sucesso");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao deletar lista");
      setIsDeleting(false);
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
        <div className="flex items-center gap-2 shrink-0">
          <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Informações da Lista</DialogTitle>
                <DialogDescription>Detalhes e configurações da lista</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Título</span>
                    <span className="text-sm text-muted-foreground">{list.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Itens</span>
                    <span className="text-sm text-muted-foreground">{list.items.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Colaboradores</span>
                    <span className="text-sm text-muted-foreground">{list.members?.length || 0}</span>
                  </div>
                </div>
                
                {list.members && list.members.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Membros</span>
                    </div>
                    <div className="space-y-1">
                      {list.members.map((member: any) => (
                        <div key={member.userId} className="text-sm text-muted-foreground pl-6">
                          {member.user.email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setIsInfoOpen(false);
                      setIsDeleteAlertOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar Lista
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <InviteDialog listId={list.id} />
        </div>
      </header>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a lista
              &quot;{list.title}&quot; e todos os seus itens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteList}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-6 w-6">
            {item.owner?.avatarUrl && <AvatarImage src={item.owner.avatarUrl} />}
            <AvatarFallback className="text-xs font-semibold text-white">
              {(item.owner?.email?.[0] || useAuthStore.getState().user?.email?.[0] || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>

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
