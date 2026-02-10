"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success("Bem-vindo de volta!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({ email, password });
      toast.success("Conta criada! Bem-vindo.");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh px-4 py-6 sm:px-6 sm:py-8">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Lista Fácil
          </CardTitle>
          <CardDescription className="text-center text-base sm:text-lg text-zinc-400">
            Sincronize suas compras em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
              <TabsTrigger value="login" className="text-sm sm:text-base">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="text-sm sm:text-base">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-11 text-base"
                    autoComplete="email"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="h-11 text-base"
                    autoComplete="current-password"
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-base font-medium transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Acessar"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="r-email" className="text-sm font-medium">E-mail</Label>
                  <Input 
                    id="r-email" 
                    type="email" 
                    placeholder="seu@email.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-11 text-base"
                    autoComplete="email"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-password" className="text-sm font-medium">Senha</Label>
                  <Input 
                    id="r-password" 
                    type="password" 
                    placeholder="Mínimo 6 caracteres"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="h-11 text-base"
                    autoComplete="new-password"
                    minLength={6}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="w-full h-11 text-base font-medium transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Conta Grátis"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
