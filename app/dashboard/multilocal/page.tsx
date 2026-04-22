"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  mockMultiLocationUser, 
  calculateStats, 
  calculateRecommendation,
  formatDate,
  formatDateFull
} from "@/lib/mock-data";
import { useUser } from "@/lib/user-context";
import { 
  ArrowLeft,
  Building2,
  TrendingDown,
  TrendingUp,
  MapPin,
  Package,
  ShoppingCart,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Trophy,
  Lock,
  Calendar
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomChartTooltip } from "@/components/chart-tooltip";

export default function MultilocalPage() {
  const { user: userSettings, hasFeature } = useUser();
  const canAccessMultiLocal = hasFeature("multiLocation");
  
  const [expandedLocations, setExpandedLocations] = useState<string[]>([]);
  
  const user = mockMultiLocationUser;
  
  const allRecords = user.locations.flatMap(loc => loc.records);
  const aggregatedStats = calculateStats(allRecords);
  
  const locationStats = user.locations.map(location => {
    const stats = calculateStats(location.records);
    const recommendation = calculateRecommendation(location.records);
    const todayRecord = location.records[location.records.length - 1];
    
    return {
      ...location,
      stats,
      recommendation,
      todayRecord,
    };
  });

  const comparisonData = user.locations[0].records.slice(-7).map((_, index) => {
    const date = formatDate(user.locations[0].records.slice(-7)[index].date);
    const dataPoint: Record<string, string | number> = { date };
    
    user.locations.forEach((location, locIndex) => {
      const record = location.records.slice(-7)[index];
      dataPoint[`local${locIndex + 1}`] = record.wastePercentage;
    });
    
    return dataPoint;
  });

  const discountPerLocal = 7;
  const basePlanPrice = 100;
  const totalWithoutDiscount = basePlanPrice * user.locations.length;
  const totalWithDiscount = (basePlanPrice - discountPerLocal) * user.locations.length;
  const totalSavings = totalWithoutDiscount - totalWithDiscount;

  const locationNames = user.locations.map(loc => loc.name.split(' - ')[1] || loc.name);
  const barColors = ['#3D7F35', '#F5841F', '#5BA052'];

  const toggleLocationExpand = (locationId: string) => {
    setExpandedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // Si no tiene acceso a multi-local, mostrar mensaje de upgrade
  if (!canAccessMultiLocal) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#3D7F35]" />
            Vista Multi-local
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
              La gestion multi-local esta disponible unicamente en el Plan Premium. 
              Actualiza tu plan para gestionar varios establecimientos desde una sola cuenta.
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
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-[#3D7F35]" />
            Vista Multi-local
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {user.businessName} - {user.locations.length} establecimientos
          </p>
        </div>
        <div className="bg-[#F5841F]/10 border border-[#F5841F]/20 px-3 sm:px-4 py-2 rounded-lg">
          <p className="text-xs sm:text-sm text-muted-foreground">Ahorro mensual multi-local</p>
          <p className="text-lg sm:text-xl font-bold text-[#F5841F]">{totalSavings}EUR/mes</p>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3D7F35]/20 rounded-lg flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Produccion total</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{aggregatedStats.totalProduced}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F5841F]/20 rounded-lg flex items-center justify-center shrink-0">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5841F]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Ventas totales</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{aggregatedStats.totalSold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-destructive/20 rounded-lg flex items-center justify-center shrink-0">
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">Desperdicio</p>
                <p className="text-lg sm:text-2xl font-bold text-destructive">{aggregatedStats.totalWasted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${aggregatedStats.trend < 0 ? 'bg-[#3D7F35]/20' : 'bg-destructive/20'}`}>
                {aggregatedStats.trend < 0 ? (
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#3D7F35]" />
                ) : (
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">% Promedio</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{aggregatedStats.avgWastePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations Grid with Expandable Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Establecimientos</h2>
        <div className="grid gap-4">
          {locationStats.map((location, index) => {
            const isExpanded = expandedLocations.includes(location.id);
            const last7Records = [...location.records].reverse().slice(0, 7);
            
            return (
              <Card key={location.id} className="overflow-hidden">
                {/* Header - siempre visible */}
                <button
                  onClick={() => toggleLocationExpand(location.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="pb-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${barColors[index]}20` }}
                        >
                          <MapPin className="h-5 w-5" style={{ color: barColors[index] }} />
                        </div>
                        <div>
                          <CardTitle className="text-sm sm:text-base">{location.name}</CardTitle>
                          <CardDescription className="capitalize text-xs sm:text-sm">{location.type}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-foreground">{location.todayRecord.produced}</p>
                            <p className="text-[10px] text-muted-foreground">Producido</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{location.todayRecord.sold}</p>
                            <p className="text-[10px] text-muted-foreground">Vendido</p>
                          </div>
                          <div>
                            <p className={`text-lg font-bold ${location.todayRecord.wastePercentage > 10 ? 'text-destructive' : 'text-[#3D7F35]'}`}>
                              {location.todayRecord.wastePercentage}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">Desperdicio</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile summary */}
                    <div className="sm:hidden grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                      <div className="text-center">
                        <p className="text-base font-bold text-foreground">{location.todayRecord.produced}</p>
                        <p className="text-[10px] text-muted-foreground">Producido</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-foreground">{location.todayRecord.sold}</p>
                        <p className="text-[10px] text-muted-foreground">Vendido</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-base font-bold ${location.todayRecord.wastePercentage > 10 ? 'text-destructive' : 'text-[#3D7F35]'}`}>
                          {location.todayRecord.wastePercentage}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">Desperdicio</p>
                      </div>
                    </div>
                  </CardHeader>
                </button>
                
                {/* Expandable content */}
                {isExpanded && (
                  <CardContent className="border-t border-border pt-4 space-y-4">
                    {/* Recommendation */}
                    <div className="bg-[#3D7F35]/10 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">Recomendacion para manana</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#3D7F35]">{location.recommendation} unidades</p>
                    </div>
                    
                    {/* Stats summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-lg sm:text-xl font-bold text-foreground">{location.stats.totalProduced}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Producido (14d)</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-lg sm:text-xl font-bold text-foreground">{location.stats.totalSold}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Vendido (14d)</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-lg sm:text-xl font-bold text-destructive">{location.stats.totalWasted}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Desperdicio (14d)</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className={`text-lg sm:text-xl font-bold ${location.stats.avgWastePercentage > 10 ? 'text-destructive' : 'text-[#3D7F35]'}`}>
                          {location.stats.avgWastePercentage}%
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Promedio</p>
                      </div>
                    </div>
                    
                    {/* Recent records table */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#3D7F35]" />
                        Ultimos 7 dias
                      </h4>
                      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <table className="w-full min-w-[400px] text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-2 font-medium text-muted-foreground">Fecha</th>
                              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Prod.</th>
                              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Vend.</th>
                              <th className="text-right py-2 px-2 font-medium text-muted-foreground">Desp.</th>
                              <th className="text-right py-2 px-2 font-medium text-muted-foreground">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {last7Records.map((record, i) => (
                              <tr key={record.id} className={`border-b border-border ${i === 0 ? 'bg-[#3D7F35]/5' : ''}`}>
                                <td className="py-2 px-2">
                                  <span className="capitalize">{formatDate(record.date)}</span>
                                  {i === 0 && (
                                    <span className="ml-1 text-[10px] bg-[#F5841F] text-white px-1 py-0.5 rounded">Hoy</span>
                                  )}
                                </td>
                                <td className="text-right py-2 px-2 font-medium">{record.produced}</td>
                                <td className="text-right py-2 px-2 font-medium">{record.sold}</td>
                                <td className="text-right py-2 px-2 font-medium text-destructive">{record.wasted}</td>
                                <td className="text-right py-2 px-2">
                                  <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
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
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-5 w-5 text-[#3D7F35]" />
            Comparativa de desperdicio
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Porcentaje de desperdicio diario - Ultimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip 
                  content={
                    <CustomChartTooltip 
                      labelMap={{ 
                        local1: locationNames[0], 
                        local2: locationNames[1], 
                        local3: locationNames[2] 
                      }}
                      suffix="%"
                    />
                  }
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                />
                {user.locations.map((location, index) => (
                  <Bar 
                    key={location.id}
                    dataKey={`local${index + 1}`}
                    name={location.name.split(' - ')[1] || location.name}
                    fill={barColors[index]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-border">
            {user.locations.map((location, index) => (
              <div key={location.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: barColors[index] }}
                />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {location.name.split(' - ')[1] || location.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-5 w-5 text-[#F5841F]" />
            Ranking de eficiencia
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Locales ordenados por menor porcentaje de desperdicio promedio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[...locationStats]
              .sort((a, b) => a.stats.avgWastePercentage - b.stats.avgWastePercentage)
              .map((location, index) => (
                <div 
                  key={location.id}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                    index === 0 ? 'bg-[#3D7F35]/10 border border-[#3D7F35]/20' : 'bg-muted/50'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                    index === 0 
                      ? 'bg-[#F5841F] text-white' 
                      : index === 1 
                        ? 'bg-[#3D7F35] text-white'
                        : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate">{location.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Promedio: <span className={index === 0 ? 'text-[#3D7F35] font-semibold' : ''}>{location.stats.avgWastePercentage}%</span>
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] sm:text-xs bg-[#F5841F] text-white px-2 py-1 rounded-full whitespace-nowrap">
                      Mejor
                    </span>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
