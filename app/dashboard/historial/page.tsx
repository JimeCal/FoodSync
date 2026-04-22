"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  mockUser, 
  formatDateFull,
  calculateStats
} from "@/lib/mock-data";
import { useUser } from "@/lib/user-context";
import { 
  ArrowLeft,
  Download,
  TrendingDown,
  TrendingUp,
  Calendar,
  Package,
  ShoppingCart,
  Trash2,
  Lock,
  Check
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HistorialPage() {
  const { user: userSettings, hasFeature } = useUser();
  const location = mockUser.locations[0];
  const records = [...location.records].reverse();
  const stats = calculateStats(location.records);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const canAccessHistorical = hasFeature("historicalData");

  const handleExportCSV = () => {
    // Crear contenido CSV
    const headers = ["Fecha", "Producidas", "Vendidas", "Desperdicio", "% Desperdicio"];
    const rows = records.map(record => [
      formatDateFull(record.date),
      record.produced,
      record.sold,
      record.wasted,
      record.wastePercentage + "%"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `historial_${location.name.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // Si no tiene acceso al historial, mostrar mensaje de upgrade
  if (!canAccessHistorical) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Historial de datos
          </h1>
        </div>
        
        <Card className="border-[#F5841F]/30">
          <CardContent className="p-6 sm:p-12 text-center">
            <div className="w-16 h-16 bg-[#F5841F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-[#F5841F]" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Funcionalidad no disponible
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              El acceso al historial de datos (90 dias) esta disponible a partir del Plan Plus. 
              Actualiza tu plan para acceder a esta funcionalidad.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Tu plan actual: <span className="font-semibold text-foreground">Plan {userSettings.plan === "basic" ? "Basico" : userSettings.plan === "plus" ? "Plus" : "Premium"}</span>
            </p>
            <Link href="/dashboard/configuracion">
              <Button className="bg-[#F5841F] hover:bg-[#E07316]">
                Ver planes disponibles
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-[#3D7F35] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <Check className="h-4 w-4" />
          <span className="text-sm">CSV exportado correctamente</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Historial de datos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {location.name} - Ultimos 14 dias
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-[#3D7F35] text-[#3D7F35] hover:bg-[#3D7F35]/10 w-full sm:w-auto"
          onClick={handleExportCSV}
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#3D7F35]/20 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Producido</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalProduced}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#F5841F]/20 flex items-center justify-center shrink-0">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5841F]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Vendido</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalSold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Desperdicio</p>
                <p className="text-lg sm:text-2xl font-bold text-destructive">{stats.totalWasted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${stats.trend < 0 ? 'bg-[#3D7F35]/20' : 'bg-destructive/20'}`}>
                {stats.trend < 0 ? (
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35]" />
                ) : (
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Promedio</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.avgWastePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-5 w-5 text-[#3D7F35]" />
            Registro diario
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Datos de produccion y ventas de los ultimos 14 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
                    Producidas
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
                    Vendidas
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
                    Desperdicio
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${index === 0 ? 'bg-[#3D7F35]/5' : ''}`}
                  >
                    <td className="py-2 sm:py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-[10px] sm:text-xs bg-[#F5841F] text-white px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                            Hoy
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none capitalize">
                          {formatDateFull(record.date)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right">
                      <span className="text-xs sm:text-sm text-foreground font-medium">
                        {record.produced}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right">
                      <span className="text-xs sm:text-sm text-foreground font-medium">
                        {record.sold}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right">
                      <span className="text-xs sm:text-sm text-destructive font-medium">
                        {record.wasted}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right">
                      <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                        record.wastePercentage > 10 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-[#3D7F35]/10 text-[#3D7F35]'
                      }`}>
                        {record.wastePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
