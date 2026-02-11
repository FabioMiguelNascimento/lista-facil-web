"use client";

import { Button } from "@/components/ui/button";
import { useInvites } from "@/hooks/useInvites";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Inbox, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function InvitesPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  
  const { invites, loading, count, acceptInvite, rejectInvite, isAccepting, isRejecting } =
    useInvites();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleAccept = async (id: string, listId?: string) => {
    await acceptInvite(id);
    if (listId) {
      setTimeout(() => {
        setOpen(false);
        router.push(`/list/${listId}`);
      }, 300);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        title="Convites"
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-rose-600 text-white text-xs font-semibold leading-none px-1.5 py-0.5 min-w-[18px] shadow-sm"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Convites Pendentes</h3>
                {count > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {count} {count === 1 ? "convite" : "convites"}
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading && (
                <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p className="text-sm">Carregando convites...</p>
                </div>
              )}

              {!loading && invites.length === 0 && (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Inbox className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">Nenhum convite</p>
                  <p className="text-xs text-muted-foreground">
                    Você está em dia! Não há convites pendentes.
                  </p>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {!loading &&
                  invites.map((invite) => {
                    const isProcessing = isAccepting(invite.id) || isRejecting(invite.id);
                    
                    return (
                      <motion.div
                        key={invite.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2 shrink-0">
                            <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate mb-0.5">
                              {invite.list?.title || "Lista sem título"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              Convidado por {invite.inviter?.email || invite.email}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                size="sm"
                                onClick={() => handleAccept(invite.id, invite.list?.id)}
                                disabled={isProcessing}
                                className="h-8 text-xs"
                              >
                                {isAccepting(invite.id) ? (
                                  <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Aceitando...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Aceitar
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => rejectInvite(invite.id)}
                                disabled={isProcessing}
                                className="h-8 text-xs"
                              >
                                {isRejecting(invite.id) ? (
                                  <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Recusando...
                                  </>
                                ) : (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Recusar
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
