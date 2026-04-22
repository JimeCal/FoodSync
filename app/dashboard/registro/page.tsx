"use client";

import { useState } from "react";
import { PermissionGate } from "@/components/permission-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/lib/user-context";
import { 
  Package, 
  ShoppingCart, 
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function RegistroPage() {
  const { currentLocation } = useUser();
  const [produced, setProduced] = useState("");
  const [sold, setSold] = useState("");
  const [wasted, setWasted] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const calculatedWaste = produced && sold 
    ? Math.max(0, parseInt(produced) - parseInt(sold))
    : 0;

  const wastePercentage = produced && parseInt(produced) > 0
    ? Math.round((calculatedWaste / parseInt(produced)) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <PermissionGate
        permission="manageRecords"
        title="Tu rol no puede registrar datos"
        description="Solo los usuarios con permisos operativos pueden crear o modificar registros diarios."
      >
        <div className="p-6 lg:p-8">
          <div className="max-w-lg mx-auto">
            <Card className="border-[#3D7F35]/20">
              <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#3D7F35]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#3D7F35]" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Datos guardados correctamente
              </h2>
              <p className="text-muted-foreground mb-6">
                Hemos registrado tu produccion del dia. Ahora puedes ver tu recomendacion actualizada.
              </p>
              
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#3D7F35]">{produced}</p>
                    <p className="text-xs text-muted-foreground">Producidas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F5841F]">{sold}</p>
                    <p className="text-xs text-muted-foreground">Vendidas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{wasted || calculatedWaste}</p>
                    <p className="text-xs text-muted-foreground">Desperdicio</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard/recomendacion">
                  <Button className="w-full bg-[#3D7F35] hover:bg-[#346B2D]">
                    Ver recomendacion para manana
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-[#3D7F35]/30 hover:bg-[#3D7F35]/10">
                    Volver al dashboard
                  </Button>
                </Link>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PermissionGate>
    );
  }

  return (
    <PermissionGate
      permission="manageRecords"
      title="Tu rol no puede registrar datos"
      description="Solo los usuarios con permisos operativos pueden crear o modificar registros diarios."
    >
      <div className="p-6 lg:p-8">
        <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Registrar datos
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 text-[#F5841F]" />
            <span className="capitalize">{today}</span>
            {currentLocation && (
              <span className="text-xs text-muted-foreground">- {currentLocation.name}</span>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos de produccion</CardTitle>
            <CardDescription>
              Introduce los datos de hoy para obtener mejores predicciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Unidades producidas */}
              <div className="space-y-2">
                <Label htmlFor="produced" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#3D7F35]" />
                  Unidades producidas
                </Label>
                <Input
                  id="produced"
                  type="number"
                  placeholder="Ej: 150"
                  value={produced}
                  onChange={(e) => setProduced(e.target.value)}
                  className="h-12 text-lg"
                  min="0"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Total de unidades que has producido hoy
                </p>
              </div>

              {/* Unidades vendidas */}
              <div className="space-y-2">
                <Label htmlFor="sold" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-[#F5841F]" />
                  Unidades vendidas
                </Label>
                <Input
                  id="sold"
                  type="number"
                  placeholder="Ej: 135"
                  value={sold}
                  onChange={(e) => setSold(e.target.value)}
                  className="h-12 text-lg"
                  min="0"
                  max={produced || undefined}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Total de unidades que has vendido hoy
                </p>
              </div>

              {/* Unidades desperdiciadas (calculado automatico) */}
              <div className="space-y-2">
                <Label htmlFor="wasted" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  Unidades desperdiciadas
                </Label>
                <Input
                  id="wasted"
                  type="number"
                  placeholder="Se calcula automaticamente"
                  value={wasted || (produced && sold ? calculatedWaste : "")}
                  onChange={(e) => setWasted(e.target.value)}
                  className="h-12 text-lg"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Se calcula automaticamente o puedes ajustarlo manualmente
                </p>
              </div>

              {/* Preview */}
              {produced && sold && (
                <div className={`p-4 rounded-lg border ${wastePercentage > 10 ? 'bg-destructive/10 border-destructive/20' : 'bg-[#3D7F35]/10 border-[#3D7F35]/20'}`}>
                  <p className="text-sm font-medium text-foreground">
                    Resumen del dia
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${wastePercentage > 10 ? 'text-destructive' : 'text-[#3D7F35]'}`}>
                    {wastePercentage}% de desperdicio
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {wastePercentage > 10 
                      ? "El desperdicio esta por encima del objetivo (10%)"
                      : "Buen trabajo, estas dentro del objetivo"}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-[#3D7F35] hover:bg-[#346B2D]"
                disabled={isLoading || !produced || !sold}
              >
                {isLoading ? "Guardando..." : "Guardar datos"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </PermissionGate>
  );
}
