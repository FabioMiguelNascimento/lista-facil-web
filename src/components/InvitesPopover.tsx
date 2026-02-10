"use client";

import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { api } from "@/lib/api";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface InviteItem {
  id: string;
  email: string;
  list: { title: string } | null;
  inviter: { email: string } | null;
}

export default function InvitesPopover() {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<InviteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invites/inbox");
      setInvites(res.data || []);
    } catch (e) {
      toast.error("Erro ao carregar convites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewInvite = (payload: any) => {
      // simples: refazer fetch ao receber notificação
      fetchInvites();
      toast("Novo convite recebido");
    };

    socket.on("new_invite", onNewInvite);
    return () => {
      socket.off("new_invite", onNewInvite);
    };
  }, [socket]);

  const acceptInvite = async (id: string) => {
    try {
      await api.patch(`/invites/${id}/accept`);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Convite aceito");
    } catch (e) {
      toast.error("Erro ao aceitar convite");
    }
  };

  const rejectInvite = async (id: string) => {
    try {
      await api.delete(`/invites/${id}/reject`);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Convite recusado");
    } catch (e) {
      toast.error("Erro ao recusar convite");
    }
  };

  const badge = invites.length;

  return (
    <div ref={wrapperRef} className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" title="Notificações">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {badge > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-rose-600 text-white text-xs leading-none px-1.5 py-0.5">{badge}</span>
          )}
        </div>
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-40">
          <div className="p-3">
            <h3 className="text-sm font-medium">Convites</h3>
          </div>
          <div className="max-h-64 overflow-auto divide-y">
            {loading && <div className="p-3 text-sm text-muted-foreground">Carregando...</div>}

            {!loading && invites.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">Nenhum convite</div>
            )}

            {!loading && invites.map((inv) => (
              <div key={inv.id} className="p-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{inv.list?.title ?? 'Lista'}</div>
                  <div className="text-xs text-muted-foreground truncate">Convidado por {inv.inviter?.email ?? inv.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => acceptInvite(inv.id)} className="text-emerald-600 hover:underline text-sm">Aceitar</button>
                  <button onClick={() => rejectInvite(inv.id)} className="text-muted-foreground hover:underline text-sm">Recusar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
