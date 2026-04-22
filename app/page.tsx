"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown, BarChart3, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@foodsync.es");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Panel izquierdo - Branding (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3D7F35] via-[#4A9340] to-[#3D7F35] p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5841F]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="FoodSync Logo"
            width={160}
            height={50}
            className="brightness-0 invert"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
        
        <div className="space-y-6 relative z-10">
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-background min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm">
          {/* Logo movil */}
          <div className="lg:hidden flex items-center justify-center mb-6">
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
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold">Bienvenido</CardTitle>
              <CardDescription className="text-sm">
                Inicia sesion para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10"
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
                    className="h-10"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-10 text-sm font-semibold bg-[#3D7F35] hover:bg-[#346B2D]"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  No tienes cuenta?{" "}
                  <button className="text-primary font-medium hover:underline">
                    Solicitar demo
                  </button>
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-[#F5841F]/10 border border-[#F5841F]/20 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  <strong className="text-[#F5841F]">Demo:</strong> Usa las credenciales precargadas
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Features movil - muy compactas */}
          <div className="lg:hidden mt-4 grid grid-cols-3 gap-2">
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
