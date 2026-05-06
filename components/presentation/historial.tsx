"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, TrendingDown, Package, Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const historicalData = [
  { date: "Lun 14", producido: 520, vendido: 489, desperdicio: 31, porcentaje: 6.0 },
  { date: "Mar 15", producido: 540, vendido: 508, desperdicio: 32, porcentaje: 5.9 },
  { date: "Mié 16", producido: 515, vendido: 488, desperdicio: 27, porcentaje: 5.2 },
  { date: "Jue 17", producido: 560, vendido: 529, desperdicio: 31, porcentaje: 5.5 },
  { date: "Vie 18", producido: 600, vendido: 580, desperdicio: 20, porcentaje: 3.3 },
  { date: "Sab 19", producido: 560, vendido: 534, desperdicio: 26, porcentaje: 4.6 },
  { date: "Dom 20", producido: 500, vendido: 470, desperdicio: 30, porcentaje: 6.0 },
];

const stats = {
  totalProduced: 3795,
  totalSold: 3598,
  totalWasted: 197,
  avgWastePercentage: 5.22,
  bestDay: "Vie 18",
  worstDay: "Mar 15",
};

export default function HistorialSection() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (format: "csv" | "pdf") => {
    if (isDownloading) return;

    setIsDownloading(format);
    try {
      if (format === "csv") {
        // Generar CSV real
        const csvContent = [
          "Fecha,Producido,Vendido,Desperdicio,Porcentaje",
          ...historicalData.map(row =>
            `${row.date},${row.producido},${row.vendido},${row.desperdicio},${row.porcentaje}`
          )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `historial-produccion-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const encoder = new TextEncoder();
        const dateString = new Date().toISOString().split("T")[0];

        // Template elegante con diseño profesional FoodSync
        const headerText = `BT
/F1 28 Tf
50 780 Td (🍞 FoodSync) Tj
0 -35 Td
/F2 18 Tf
(Reporte Ejecutivo de Producción) Tj
0 -25 Td
/F3 12 Tf
(Análisis Inteligente de Merma y Eficiencia) Tj
0 -20 Td
/F4 10 Tf
(Generado: ${dateString}) Tj
0 -15 Td
(Período: Últimos 14 días) Tj
ET`;

        const statsText = `BT
/F2 16 Tf
50 680 Td (📊 Estadísticas Clave) Tj
0 -30 Td
/F3 12 Tf
(🏭 Total Producido) Tj
150 0 Td
(${stats.totalProduced.toLocaleString()} unidades) Tj
0 -20 Td
(💰 Total Vendido) Tj
150 0 Td
(${stats.totalSold.toLocaleString()} unidades) Tj
0 -20 Td
(🗑️ Total Desperdiciado) Tj
150 0 Td
(${stats.totalWasted.toLocaleString()} unidades) Tj
0 -20 Td
(📈 Porcentaje Promedio de Merma) Tj
150 0 Td
(${stats.avgWastePercentage}%) Tj
0 -30 Td
/F2 14 Tf
(🎯 Rendimiento) Tj
0 -25 Td
/F3 12 Tf
(✅ Mejor Día de Producción) Tj
180 0 Td
(${stats.bestDay}) Tj
0 -20 Td
(⚡ Día con Mayor Eficiencia) Tj
180 0 Td
(${stats.bestDay}) Tj
ET`;

        const tableHeader = `BT
/F2 14 Tf
50 550 Td (📅 Historial Detallado de Producción) Tj
0 -30 Td
/F3 11 Tf
50 520 Td (📅 Fecha) Tj
150 0 Td (🏭 Producido) Tj
250 0 Td (💰 Vendido) Tj
350 0 Td (🗑️ Desperdicio) Tj
450 0 Td (📈 % Merma) Tj
ET`;

        // Generar filas de tabla
        let tableRows = "";
        let yPos = 500;
        historicalData.forEach((row, index) => {
          if (index % 2 === 0 && index > 0) yPos -= 10; // Espacio entre grupos
          tableRows += `BT
/F4 10 Tf
50 ${yPos} Td (${row.date}) Tj
150 0 Td (${row.producido.toLocaleString()}) Tj
250 0 Td (${row.vendido.toLocaleString()}) Tj
350 0 Td (${row.desperdicio.toLocaleString()}) Tj
450 0 Td (${row.porcentaje}%) Tj
ET\n`;
          yPos -= 15;
        });

        const footerText = `BT
/F4 9 Tf
50 100 Td (📋 Este reporte fue generado automáticamente por FoodSync) Tj
0 -12 Td
(🌐 Para más información visite: www.foodsync.es) Tj
0 -12 Td
(© 2026 FoodSync - Tecnología para la eficiencia alimentaria) Tj
ET`;

        const contentText = headerText + statsText + tableHeader + tableRows + footerText;

        const contentBytes = encoder.encode(contentText);

        // Objetos PDF mejorados
        const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
        const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
        const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R /F4 8 0 R >> >> /Contents 4 0 R >>\nendobj\n`;
        const obj4 = `4 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n${contentText}\nendstream\nendobj\n`;
        const obj5 = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;
        const obj6 = `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;
        const obj7 = `7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
        const obj8 = `8 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

        const parts = ["%PDF-1.4\n", obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8];
        let offset = 0;
        const offsets = parts.map((part) => {
          const current = offset;
          offset += encoder.encode(part).length;
          return current;
        });

        const xref = [
          "xref\n0 9\n",
          "0000000000 65535 f \n",
          ...offsets.map((value) => `${String(value).padStart(10, "0")} 00000 n \n`),
        ].join("");

        const trailer = `trailer\n<< /Size 9 /Root 1 0 R >>\n`;
        const startxref = `startxref\n${offset}\n%%EOF`;
        const pdfContent = parts.join("") + xref + trailer + startxref;

        const blob = new Blob([pdfContent], { type: "application/pdf" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte-ejecutivo-foodsync-${dateString}.pdf`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Reporte Ejecutivo Generado",
        description: `El reporte PDF profesional de FoodSync ha sido descargado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al Generar Reporte",
        description: `Ha ocurrido un error al generar el reporte ${format.toUpperCase()}. Inténtalo de nuevo.`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShare = async () => {
    if (isDownloading === "share") return;

    setIsDownloading("share");
    try {
      const shareData = {
        title: "Historial de Producción - Levaduramadre",
        text: `Resumen semanal: ${stats.totalProduced} unidades producidas, ${stats.totalSold} vendidas, ${stats.totalWasted} desperdiciadas (${stats.avgWastePercentage}% promedio)`,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare(shareData)) {
        // Usar Web Share API si está disponible
        await navigator.share(shareData);
      } else {
        // Fallback: copiar al portapapeles
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Enlace copiado",
          description: "El enlace y resumen han sido copiados al portapapeles.",
        });
      }

      toast({
        title: "Compartido exitosamente",
        description: "El historial ha sido compartido con tu equipo.",
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast({
          title: "Error al compartir",
          description: "Ha ocurrido un error al compartir el historial. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDownloading(null);
    }
  };
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Historial
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Análisis de últimos 7 días
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualiza tendencias en producción, ventas y desperdicio. Usa estos datos para tomar decisiones informadas.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-[#3D7F35]" />
              Total producido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalProduced}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total vendido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5841F]">{stats.totalSold}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Total desperdicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.totalWasted}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">% Desperdicio prom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-[#3D7F35]">
              {stats.avgWastePercentage.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">promedio de 7 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>Producción vs Ventas</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="producido" fill="#3D7F35" name="Producido" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vendido" fill="#F5841F" name="Vendido" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolución del desperdicio</CardTitle>
          <CardDescription>Porcentaje diario - Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 8]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="porcentaje"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-green-200/50 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/10">
          <CardHeader>
            <CardTitle className="text-base">Mejor día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.bestDay}</span>
              <span className="text-sm text-muted-foreground">con 3.3% de desperdicio</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Viernes fue tu día más eficiente. Revisa qué cambios hiciste ese día para replicarlos.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
          <CardHeader>
            <CardTitle className="text-base">Día con más desperdicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.worstDay}</span>
              <span className="text-sm text-muted-foreground">con 5.9% de desperdicio</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Martes fue el día con mayor porcentaje. Investiga qué factores contribuyeron.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exportar */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Exportar datos</CardTitle>
          <CardDescription>Reporte ejecutivo profesional con logo FoodSync, estadísticas clave y análisis detallado</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleDownload("csv")}
            disabled={isDownloading === "csv"}
          >
            📄 {isDownloading === "csv" ? "Descargando..." : "Descargar como CSV"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleDownload("pdf")}
            disabled={isDownloading === "pdf"}
          >
            📥 {isDownloading === "pdf" ? "Generando Reporte..." : "Descargar Reporte Ejecutivo PDF"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleShare}
            disabled={isDownloading === "share"}
          >
            📈 {isDownloading === "share" ? "Compartiendo..." : "Compartir con equipo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
