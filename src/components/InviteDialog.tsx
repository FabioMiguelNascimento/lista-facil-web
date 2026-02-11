"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Check, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteDialog({ listId }: { listId: string }) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInvite = async () => {
    if (!isValidEmail) {
      toast.error("Digite um e-mail válido");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/invites", { email: email.trim(), listId });
      
      setSuccess(true);
      toast.success("Convite enviado com sucesso!", {
        description: `Um e-mail foi enviado para ${email}`,
      });
      
      setTimeout(() => {
        setIsOpen(false);
        setEmail("");
        setSuccess(false);
      }, 1500);
    } catch (e: any) {
      const message = e?.response?.data?.message || "Erro ao enviar convite";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEmail("");
      setSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Convidar colaborador">
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Colaborador
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail do colaborador
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colaborador@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidEmail) {
                    e.preventDefault();
                    handleInvite();
                  }
                }}
                className="pl-9"
                disabled={isLoading || success}
              />
            </div>
            {email && !isValidEmail && (
              <p className="text-xs text-destructive">Digite um e-mail válido</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!isValidEmail || isLoading || success}
              className="min-w-[100px]"
            >
              {success ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enviado!
                </>
              ) : isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Convite"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
