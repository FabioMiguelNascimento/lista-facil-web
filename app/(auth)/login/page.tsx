"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {


  return (
    <div className="flex items-start justify-center min-h-dvh px-4 pt-[12vh] sm:pt-[10vh] md:pt-[8vh] sm:px-6">
      <Card className="w-full max-w-sm border-zinc-800 bg-transparent shadow-2xl">
        <CardHeader className="pb-4">
          <div className="px-2">
            <AuthHeader />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
              <TabsTrigger value="login" className="text-sm sm:text-base">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="text-sm sm:text-base">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
