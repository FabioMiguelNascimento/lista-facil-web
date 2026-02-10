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

export const authFormStyles = {
  form: "space-y-5",
  input: "h-11 md:h-12 text-base md:text-base w-full",
  button: "w-full h-12 md:h-14 bg-emerald-600 hover:bg-emerald-700 text-base md:text-lg font-medium transition-all rounded-md",
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const isLoading = useAuthStore((s) => s.isLoading);
  const { setValue } = useTabs();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Bem-vindo de volta!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao entrar. Verifique suas credenciais.");
    }
  };

  return (
    <form onSubmit={handleLogin} className={authFormStyles.form}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={authFormStyles.input} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={authFormStyles.input} required />
      </div>

      <Button type="submit" className={authFormStyles.button} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Acessar"
        )}
      </Button>

      <div className="text-center mt-2">
        <button type="button" onClick={() => setValue('register')} className="text-xs text-muted-foreground underline decoration-dotted">Ainda não tem conta?</button>
      </div>
    </form>
  );
}
