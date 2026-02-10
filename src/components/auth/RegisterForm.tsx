"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/ui/password-input";
import { useTabs } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authFormStyles } from "./LoginForm";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const isLoading = useAuthStore((s) => s.isLoading);
  const { setValue } = useTabs();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
      toast.success("Conta criada! Bem-vindo.");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao criar conta.");
    }
  };

  return (
    <form onSubmit={handleRegister} className={authFormStyles.form}>
      <div className="space-y-2">
        <Label htmlFor="r-email">E-mail</Label>
        <Input id="r-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={authFormStyles.input} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="r-password">Senha</Label>
        <PasswordInput id="r-password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className={authFormStyles.input} minLength={6} required />
      </div>

      <Button type="submit" variant="secondary" className={authFormStyles.button} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar Conta Grátis"
        )}
      </Button>

      <div className="text-center mt-2">
        <button type="button" onClick={() => setValue('login')} className="text-xs text-muted-foreground underline decoration-dotted">Já tem conta? Entrar</button>
      </div>
    </form>
  );
}
