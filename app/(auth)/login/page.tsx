"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {


  return (
    <div className="flex items-center justify-center min-h-dvh px-4 py-8 sm:py-12 sm:px-6">
      <Card className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl xl:max-w-7xl border-zinc-800 bg-transparent md:bg-slate-800 md:p-6 shadow-2xl">
        <div className="md:flex md:items-start md:gap-6">
          <div className="md:w-1/3 px-2 hidden md:block">
            <AuthHeader />
          </div>

          <div className="md:w-2/3 px-2">
            <CardHeader className="pb-2 md:p-0 md:pb-4 md:pl-0 md:pr-0">
              <div className="block md:hidden">
                <AuthHeader />
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-11 md:justify-start">
                  <TabsTrigger value="login" className="text-sm sm:text-base md:text-base">Entrar</TabsTrigger>
                  <TabsTrigger value="register" className="text-sm sm:text-base md:text-base">Criar Conta</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
