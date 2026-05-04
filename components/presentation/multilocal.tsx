"use client";

import { Building2, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const locations = [
  {
    id: "tienda-centro",
    name: "Tienda Centro",
    type: "Tienda minorista",
    address: "Calle Mayor, 42",
    staff: "3-5 personas",
    produced: 500,
    wasted: 30,
    wastePercentage: 6.0,
    target: 5.0,
    status: "en-línea",
  },
  {
    id: "obrador",
    name: "Obrador",
    type: "Producción",
    address: "Polígono Industrial, s/n",
    staff: "6 personas",
    produced: 600,
    wasted: 20,
    wastePercentage: 3.3,
    target: 5.0,
    status: "en-línea",
  },
  {
    id: "tienda-norte",
    name: "Tienda Norte",
    type: "Tienda minorista",
    address: "Avenida Principal, 100",
    staff: "2-3 personas",
    produced: 300,
    wasted: 18,
    wastePercentage: 6.0,
    target: 5.0,
    status: "en-línea",
  },
];

const multiLocationData = [
  { date: "Lun 14", "Tienda Centro": 520, "Obrador": 600, "Tienda Norte": 300 },
  { date: "Mar 15", "Tienda Centro": 540, "Obrador": 620, "Tienda Norte": 320 },
  { date: "Mié 16", "Tienda Centro": 515, "Obrador": 580, "Tienda Norte": 310 },
  { date: "Jue 17", "Tienda Centro": 560, "Obrador": 630, "Tienda Norte": 330 },
  { date: "Vie 18", "Tienda Centro": 600, "Obrador": 700, "Tienda Norte": 350 },
  { date: "Sab 19", "Tienda Centro": 560, "Obrador": 640, "Tienda Norte": 340 },
  { date: "Dom 20", "Tienda Centro": 500, "Obrador": 580, "Tienda Norte": 300 },
];

export default function MultiLocalSection() {
  const totalLocations = locations.length;
  const averageWaste = (
    locations.reduce((sum, loc) => sum + loc.wastePercentage, 0) / totalLocations
  ).toFixed(2);
  const totalProduced = locations.reduce((sum, loc) => sum + loc.produced, 0);
  const totalWasted = locations.reduce((sum, loc) => sum + loc.wasted, 0);

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <Badge variant="outline" className="border-[#3D7F35]/20 bg-[#3D7F35]/10 text-[#3D7F35] mb-3">
          Multi-local
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Gestiona múltiples ubicaciones
        </h1>
        <p className="mt-2 text-muted-foreground">
          Monitorea y coordina la producción, ventas y desperdicio en todas tus sucursales desde un solo lugar.
        </p>
      </div>

      {/* Resumen general */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#3D7F35]" />
              Total de locales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalLocations}</div>
            <p className="text-xs text-muted-foreground mt-1">conectados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Producción total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D7F35]">{totalProduced}</div>
            <p className="text-xs text-muted-foreground mt-1">unidades/día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">% Desperdicio prom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F5841F]">{averageWaste}%</div>
            <p className="text-xs text-muted-foreground mt-1">entre todas las sucursales</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparativa de producción */}
      <Card>
        <CardHeader>
          <CardTitle>Producción por local - Últimos 7 días</CardTitle>
          <CardDescription>Visualiza las tendencias de cada sucursal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={multiLocationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Tienda Centro" fill="#3D7F35" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Obrador" fill="#F5841F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tienda Norte" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de locales */}
      <Tabs defaultValue="tienda-centro" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {locations.map((loc) => (
            <TabsTrigger key={loc.id} value={loc.id} className="text-xs sm:text-sm">
              {loc.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {locations.map((location) => (
          <TabsContent key={location.id} value={location.id}>
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#3D7F35]" />
                        {location.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{location.address}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50/50 border-green-200/50 text-green-700 dark:bg-green-950/20 dark:border-green-800/50 dark:text-green-400"
                    >
                      ● {location.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="font-semibold text-foreground">{location.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Personal</p>
                      <p className="font-semibold text-foreground">{location.staff}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Produce/día</p>
                      <p className="font-semibold text-[#3D7F35]">{location.produced} uds</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Meta desperdicio</p>
                      <p className="font-semibold text-foreground">{location.target}%</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Desperdicio hoy</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-destructive">
                            {location.wasted}
                          </span>
                          <span className="text-sm text-muted-foreground">uds</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">% Desperdicio</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  location.wastePercentage > location.target
                                    ? "bg-destructive"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(location.wastePercentage * 20, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-semibold min-w-fit">
                            {location.wastePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Sincronización */}
      <Card className="border-[#3D7F35]/20 bg-gradient-to-r from-[#3D7F35]/5 to-transparent">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#3D7F35]" />
                Sincronización de datos
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Los datos se sincronizan automáticamente cada hora. Última actualización: hace 2 minutos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
