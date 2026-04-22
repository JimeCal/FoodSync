"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown, BarChart3, Sparkles } from "lucide-react";
import Image from "next/image";
import { loadAdminClientsSnapshot } from "@/lib/admin-storage";
import { isHumanRole, platformRoleLabels } from "@/lib/role-permissions";
import { usePlatformSession } from "@/lib/platform-session";

export default function LoginPage() {
  const router = useRouter();
  const { login } = usePlatformSession();
  const [email, setEmail] = useState("demo@foodsync.es");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const isDemoClientAccess = normalizedEmail === "demo@foodsync.es" && normalizedPassword === "demo123";
    const isDemoAdminAccess = normalizedEmail === "admin@foodsync.es" && normalizedPassword === "admin123";
    const storedClients = loadAdminClientsSnapshot();
    const storedCredential = storedClients
      .flatMap((client) => client.credentials)
      .find(
        (credential) =>
          credential.username.trim().toLowerCase() === normalizedEmail &&
          credential.passwordMask === normalizedPassword &&
          credential.status !== "caducada",
      );
    
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isDemoAdminAccess) {
      login({
        credentialId: "demo-admin",
        email: "admin@foodsync.es",
        role: "admin",
        title: "Administrador FoodSync",
        userName: "FoodSync Admin",
      });
      router.push("/admin");
      return;
    }

    if (isDemoClientAccess) {
      login({
        credentialId: "cred-client-1-owner",
        clientId: "client-1",
        email: "demo@foodsync.es",
        locationId: "client-1-loc-1",
        role: "owner",
        title: "Propietaria",
        userName: "Maria Garcia",
      });
      router.push("/dashboard");
      return;
    }

    if (storedCredential) {
      if (!isHumanRole(storedCredential.type)) {
        setIsLoading(false);
        window.alert("Este acceso es tecnico y no puede iniciar sesion en la app.");
        return;
      }

      const storedClient = storedClients.find((client) => client.id === storedCredential.clientId);
      const resolvedLocationId =
        storedCredential.locationId ?? storedClient?.locations[0]?.id;

      login({
        credentialId: storedCredential.id,
        clientId: storedCredential.clientId,
        email: storedCredential.username,
        locationId: resolvedLocationId,
        role: storedCredential.type,
        title: storedCredential.role || platformRoleLabels[storedCredential.type],
        userName: storedCredential.label,
      });

      router.push(storedCredential.type === "admin" ? "/admin" : "/dashboard");
      return;
    }

    setIsLoading(false);
    window.alert("Credenciales no validas o acceso caducado.");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden lg:h-[100dvh] lg:flex-row">
      {/* Panel izquierdo - Branding (solo desktop) */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#3D7F35] via-[#4A9340] to-[#3D7F35] lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:px-8 lg:pb-8 lg:pt-2 xl:px-12 xl:pb-10 xl:pt-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5841F]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="FoodSync Logo"
            width={160}
            height={50}
            className="h-auto w-[420px] max-w-full brightness-0 invert xl:w-[460px]"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
        
        <div className="relative z-10 space-y-5 xl:space-y-6">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight text-balance">
            Reduce el desperdicio alimentario de tu negocio
          </h1>
          <p className="text-base xl:text-lg text-white/80">
            Predice la demanda, optimiza la produccion y ahorra dinero con decisiones basadas en datos.
          </p>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-9 h-9 bg-[#F5841F] rounded-lg flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Reduce desperdicio</h3>
                <p className="text-xs text-white/70">Hasta un 30% menos de perdidas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-9 h-9 bg-[#F5841F] rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Analiza tu negocio</h3>
                <p className="text-xs text-white/70">Visualiza patrones de consumo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-9 h-9 bg-[#F5841F] rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Predicciones inteligentes</h3>
                <p className="text-xs text-white/70">Recomendaciones personalizadas</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-white/60 relative z-10">
          <span>Sin permanencia</span>
          <span>-</span>
          <span>Soporte incluido</span>
          <span>-</span>
          <span>Facil de usar</span>
        </div>
      </div>
      
      {/* Panel derecho - Login */}
      <div className="flex min-h-[100dvh] flex-1 items-center justify-center bg-background p-3 sm:p-4 lg:min-h-0 lg:h-[100dvh] lg:p-6">
        <div className="flex w-full max-w-sm flex-col justify-center">
          {/* Logo movil */}
          <div className="mb-4 flex items-center justify-center lg:hidden sm:mb-5">
            <Image
              src="/logo.png"
              alt="FoodSync Logo"
              width={140}
              height={45}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>
          
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold">Bienvenido</CardTitle>
              <CardDescription className="text-sm">
                Inicia sesion para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 sm:h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm">Contrasena</Label>
                    <button type="button" className="text-xs text-primary hover:underline">
                      Olvidaste tu contrasena?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 sm:h-10"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="h-9 w-full bg-[#3D7F35] text-sm font-semibold hover:bg-[#346B2D] sm:h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
                </Button>
              </form>
              
              <div className="pt-1 text-center">
                <p className="text-xs text-muted-foreground">
                  No tienes cuenta?{" "}
                  <button className="text-primary font-medium hover:underline">
                    Solicitar demo
                  </button>
                </p>
              </div>
              
              <div className="rounded-lg border border-[#F5841F]/20 bg-[#F5841F]/10 p-3">
                <div className="space-y-1 text-center text-xs text-muted-foreground">
                  <p>
                    <strong className="text-[#F5841F]">Cliente demo:</strong> demo@foodsync.es / demo123
                  </p>
                  <p>
                    <strong className="text-[#3D7F35]">Admin demo:</strong> admin@foodsync.es / admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Features movil - muy compactas */}
          <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden [@media(max-height:760px)]:hidden">
            <div className="text-center p-2 bg-[#3D7F35]/10 rounded-lg">
              <TrendingDown className="w-4 h-4 text-[#3D7F35] mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">-30% desperdicio</p>
            </div>
            <div className="text-center p-2 bg-[#F5841F]/10 rounded-lg">
              <BarChart3 className="w-4 h-4 text-[#F5841F] mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Analitica</p>
            </div>
            <div className="text-center p-2 bg-[#3D7F35]/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-[#3D7F35] mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Prediccion IA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
