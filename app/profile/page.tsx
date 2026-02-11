"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuthStore } from "@/store/useAuthStore";
import {
    ArrowLeft,
    CheckCircle2,
    LogOut,
    ShoppingBag,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, setAvatarUrl } = useAuthStore();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>(user?.avatarUrl || "");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarUrlError, setAvatarUrlError] = useState("");

  const stats = [
    { label: "Listas", value: "8", icon: ShoppingBag },
    { label: "Itens", value: "142", icon: CheckCircle2 },
    { label: "Collabs", value: "3", icon: Users },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] pb-24 animate-in fade-in duration-500">
      
      <div className="px-4 pt-6 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center pt-4 pb-8 px-4">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button 
              className="relative group cursor-pointer focus:outline-none"
              aria-label="Editar foto de perfil"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200" />
              <Avatar className="h-28 w-28 border-4 border-background relative">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback className="bg-zinc-800 text-2xl font-bold">
                  {user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  {avatarUrlInput && <AvatarImage src={avatarUrlInput} />}
                  <AvatarFallback className="bg-zinc-800 text-xl font-bold">{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>

                <Input
                  value={avatarUrlInput}
                  onChange={(e) => { setAvatarUrlInput(e.target.value); if (avatarUrlError) setAvatarUrlError(""); }}
                  placeholder="https://..."
                  className="w-full h-9"
                />
              </div>

              {avatarUrlError && <p className="text-xs text-destructive">{avatarUrlError}</p>}
              <p className="text-xs text-muted-foreground">Deixe vazio para remover a imagem personalizada.</p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { setIsPopoverOpen(false); setAvatarUrlInput(user?.avatarUrl || ""); setAvatarUrlError(""); }}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={async () => {
                  const url = avatarUrlInput.trim();
                  if (url) {
                    try {
                      new URL(url);
                    } catch (e) {
                      setAvatarUrlError('URL inválida');
                      return;
                    }
                  }

                  setIsSavingAvatar(true);
                  try {
                    await setAvatarUrl(url ? url : null);
                    toast.success('Imagem de perfil atualizada');
                    setIsPopoverOpen(false);
                  } catch (e) {
                    toast.error('Não foi possível atualizar a imagem');
                  } finally {
                    setIsSavingAvatar(false);
                  }
                }} disabled={isSavingAvatar}>
                  {isSavingAvatar ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <h2 className="mt-4 text-2xl font-bold text-foreground">{user?.email?.split('@')[0]}</h2>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
        
        <div className="mt-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
              Pro Member
            </span>
        </div>
      </div>

      <div className="px-4 space-y-4 flex-1">
        
        <div className="pt-6">
            <Button 
                variant="destructive" 
                className="w-full h-12 rounded-2xl font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                onClick={logout}
            >
                <LogOut className="mr-2 h-5 w-5" />
                Sair da Conta
            </Button>
            <p className="text-center text-xs text-zinc-600 mt-4">Versão 1.0.0 • Lista Fácil</p>
        </div>

      </div>
    </div>
  );
}