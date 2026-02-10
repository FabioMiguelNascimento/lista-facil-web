"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteDialog({ listId }: { listId: string }) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    try {
      setIsLoading(true);
      await api.post("/invites", { email, listId });
      toast.success("Convite enviado!");
      setIsOpen(false);
      setEmail("");
    } catch (e) {
      toast.error("Erro ao convidar. Verifique o e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Colaborador</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email do convidado"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInvite(); } }}
            className="min-w-0"
          />
          <Button onClick={handleInvite} disabled={isLoading || !/\S+@\S+\.\S+/.test(email)}>{isLoading ? 'Enviando...' : 'Enviar'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
