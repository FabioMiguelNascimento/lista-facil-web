import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "./useSocket";

export interface Invite {
  id: string;
  email: string;
  list: { id: string; title: string } | null;
  inviter: { email: string; name?: string } | null;
  createdAt?: string;
}

export function useInvites() {
  const { socket } = useSocket();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState<Set<string>>(new Set());

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/invites/inbox");
      setInvites(data || []);
    } catch (error) {
      toast.error("Erro ao carregar convites");
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (id: string) => {
    setAccepting((prev) => new Set(prev).add(id));
    
    try {
      await api.patch(`/invites/${id}/accept`);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Convite aceito!");
    } catch (error) {
      toast.error("Erro ao aceitar convite");
    } finally {
      setAccepting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const rejectInvite = async (id: string) => {
    setRejecting((prev) => new Set(prev).add(id));
    
    try {
      await api.delete(`/invites/${id}/reject`);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Convite recusado");
    } catch (error) {
      toast.error("Erro ao recusar convite");
    } finally {
      setRejecting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Fetch inicial
  useEffect(() => {
    fetchInvites();
  }, []);

  // Socket listener para novos convites
  useEffect(() => {
    if (!socket) return;

    const handleNewInvite = (payload: any) => {
      fetchInvites();
      toast.info("Você recebeu um novo convite!", {
        description: payload?.listTitle || "Clique no sino para ver",
      });
    };

    socket.on("new_invite", handleNewInvite);
    
    return () => {
      socket.off("new_invite", handleNewInvite);
    };
  }, [socket]);

  return {
    invites,
    loading,
    count: invites.length,
    acceptInvite,
    rejectInvite,
    fetchInvites,
    isAccepting: (id: string) => accepting.has(id),
    isRejecting: (id: string) => rejecting.has(id),
  };
}
