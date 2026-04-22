// Datos mock para FoodSync Demo

export interface DailyRecord {
  id: string;
  date: string;
  produced: number;
  sold: number;
  wasted: number;
  wastePercentage: number;
}

export interface Location {
  id: string;
  name: string;
  type: "cafeteria" | "panaderia" | "restaurante";
  records: DailyRecord[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  plan: "basic" | "plus" | "premium";
  locations: Location[];
}

// Datos predefinidos para evitar problemas de hidratacion
const predefinedRecords: DailyRecord[] = [
  { id: "record-13", date: "2026-04-07", produced: 142, sold: 128, wasted: 14, wastePercentage: 9.9 },
  { id: "record-12", date: "2026-04-08", produced: 155, sold: 139, wasted: 16, wastePercentage: 10.3 },
  { id: "record-11", date: "2026-04-09", produced: 148, sold: 135, wasted: 13, wastePercentage: 8.8 },
  { id: "record-10", date: "2026-04-10", produced: 160, sold: 142, wasted: 18, wastePercentage: 11.3 },
  { id: "record-9", date: "2026-04-11", produced: 145, sold: 132, wasted: 13, wastePercentage: 9.0 },
  { id: "record-8", date: "2026-04-12", produced: 152, sold: 140, wasted: 12, wastePercentage: 7.9 },
  { id: "record-7", date: "2026-04-13", produced: 158, sold: 145, wasted: 13, wastePercentage: 8.2 },
  { id: "record-6", date: "2026-04-14", produced: 140, sold: 125, wasted: 15, wastePercentage: 10.7 },
  { id: "record-5", date: "2026-04-15", produced: 155, sold: 143, wasted: 12, wastePercentage: 7.7 },
  { id: "record-4", date: "2026-04-16", produced: 162, sold: 148, wasted: 14, wastePercentage: 8.6 },
  { id: "record-3", date: "2026-04-17", produced: 150, sold: 138, wasted: 12, wastePercentage: 8.0 },
  { id: "record-2", date: "2026-04-18", produced: 147, sold: 135, wasted: 12, wastePercentage: 8.2 },
  { id: "record-1", date: "2026-04-19", produced: 156, sold: 144, wasted: 12, wastePercentage: 7.7 },
  { id: "record-0", date: "2026-04-20", produced: 152, sold: 140, wasted: 12, wastePercentage: 7.9 },
];

const multiLocationRecords1: DailyRecord[] = [
  { id: "mloc1-13", date: "2026-04-07", produced: 195, sold: 172, wasted: 23, wastePercentage: 11.8 },
  { id: "mloc1-12", date: "2026-04-08", produced: 205, sold: 185, wasted: 20, wastePercentage: 9.8 },
  { id: "mloc1-11", date: "2026-04-09", produced: 198, sold: 178, wasted: 20, wastePercentage: 10.1 },
  { id: "mloc1-10", date: "2026-04-10", produced: 210, sold: 190, wasted: 20, wastePercentage: 9.5 },
  { id: "mloc1-9", date: "2026-04-11", produced: 188, sold: 165, wasted: 23, wastePercentage: 12.2 },
  { id: "mloc1-8", date: "2026-04-12", produced: 202, sold: 185, wasted: 17, wastePercentage: 8.4 },
  { id: "mloc1-7", date: "2026-04-13", produced: 215, sold: 198, wasted: 17, wastePercentage: 7.9 },
  { id: "mloc1-6", date: "2026-04-14", produced: 190, sold: 168, wasted: 22, wastePercentage: 11.6 },
  { id: "mloc1-5", date: "2026-04-15", produced: 208, sold: 192, wasted: 16, wastePercentage: 7.7 },
  { id: "mloc1-4", date: "2026-04-16", produced: 212, sold: 195, wasted: 17, wastePercentage: 8.0 },
  { id: "mloc1-3", date: "2026-04-17", produced: 195, sold: 178, wasted: 17, wastePercentage: 8.7 },
  { id: "mloc1-2", date: "2026-04-18", produced: 200, sold: 182, wasted: 18, wastePercentage: 9.0 },
  { id: "mloc1-1", date: "2026-04-19", produced: 205, sold: 188, wasted: 17, wastePercentage: 8.3 },
  { id: "mloc1-0", date: "2026-04-20", produced: 198, sold: 180, wasted: 18, wastePercentage: 9.1 },
];

const multiLocationRecords2: DailyRecord[] = [
  { id: "mloc2-13", date: "2026-04-07", produced: 175, sold: 158, wasted: 17, wastePercentage: 9.7 },
  { id: "mloc2-12", date: "2026-04-08", produced: 182, sold: 165, wasted: 17, wastePercentage: 9.3 },
  { id: "mloc2-11", date: "2026-04-09", produced: 178, sold: 162, wasted: 16, wastePercentage: 9.0 },
  { id: "mloc2-10", date: "2026-04-10", produced: 185, sold: 168, wasted: 17, wastePercentage: 9.2 },
  { id: "mloc2-9", date: "2026-04-11", produced: 172, sold: 155, wasted: 17, wastePercentage: 9.9 },
  { id: "mloc2-8", date: "2026-04-12", produced: 180, sold: 165, wasted: 15, wastePercentage: 8.3 },
  { id: "mloc2-7", date: "2026-04-13", produced: 188, sold: 172, wasted: 16, wastePercentage: 8.5 },
  { id: "mloc2-6", date: "2026-04-14", produced: 170, sold: 152, wasted: 18, wastePercentage: 10.6 },
  { id: "mloc2-5", date: "2026-04-15", produced: 185, sold: 170, wasted: 15, wastePercentage: 8.1 },
  { id: "mloc2-4", date: "2026-04-16", produced: 190, sold: 175, wasted: 15, wastePercentage: 7.9 },
  { id: "mloc2-3", date: "2026-04-17", produced: 178, sold: 162, wasted: 16, wastePercentage: 9.0 },
  { id: "mloc2-2", date: "2026-04-18", produced: 182, sold: 168, wasted: 14, wastePercentage: 7.7 },
  { id: "mloc2-1", date: "2026-04-19", produced: 186, sold: 172, wasted: 14, wastePercentage: 7.5 },
  { id: "mloc2-0", date: "2026-04-20", produced: 180, sold: 166, wasted: 14, wastePercentage: 7.8 },
];

const multiLocationRecords3: DailyRecord[] = [
  { id: "mloc3-13", date: "2026-04-07", produced: 218, sold: 192, wasted: 26, wastePercentage: 11.9 },
  { id: "mloc3-12", date: "2026-04-08", produced: 225, sold: 200, wasted: 25, wastePercentage: 11.1 },
  { id: "mloc3-11", date: "2026-04-09", produced: 220, sold: 198, wasted: 22, wastePercentage: 10.0 },
  { id: "mloc3-10", date: "2026-04-10", produced: 230, sold: 205, wasted: 25, wastePercentage: 10.9 },
  { id: "mloc3-9", date: "2026-04-11", produced: 212, sold: 185, wasted: 27, wastePercentage: 12.7 },
  { id: "mloc3-8", date: "2026-04-12", produced: 228, sold: 208, wasted: 20, wastePercentage: 8.8 },
  { id: "mloc3-7", date: "2026-04-13", produced: 235, sold: 215, wasted: 20, wastePercentage: 8.5 },
  { id: "mloc3-6", date: "2026-04-14", produced: 210, sold: 185, wasted: 25, wastePercentage: 11.9 },
  { id: "mloc3-5", date: "2026-04-15", produced: 228, sold: 210, wasted: 18, wastePercentage: 7.9 },
  { id: "mloc3-4", date: "2026-04-16", produced: 232, sold: 215, wasted: 17, wastePercentage: 7.3 },
  { id: "mloc3-3", date: "2026-04-17", produced: 218, sold: 200, wasted: 18, wastePercentage: 8.3 },
  { id: "mloc3-2", date: "2026-04-18", produced: 222, sold: 205, wasted: 17, wastePercentage: 7.7 },
  { id: "mloc3-1", date: "2026-04-19", produced: 226, sold: 210, wasted: 16, wastePercentage: 7.1 },
  { id: "mloc3-0", date: "2026-04-20", produced: 220, sold: 202, wasted: 18, wastePercentage: 8.2 },
];

export const mockUser: User = {
  id: "user-1",
  email: "demo@foodsync.es",
  name: "Maria Garcia",
  businessName: "Panaderia El Buen Pan",
  plan: "plus",
  locations: [
    {
      id: "loc-1",
      name: "Panaderia Central",
      type: "panaderia",
      records: predefinedRecords,
    },
  ],
};

export const mockMultiLocationUser: User = {
  id: "user-2",
  email: "franquicia@foodsync.es",
  name: "Carlos Rodriguez",
  businessName: "Cafe Delicia",
  plan: "premium",
  locations: [
    {
      id: "loc-1",
      name: "Cafe Delicia - Centro",
      type: "cafeteria",
      records: multiLocationRecords1,
    },
    {
      id: "loc-2",
      name: "Cafe Delicia - Plaza Mayor",
      type: "cafeteria",
      records: multiLocationRecords2,
    },
    {
      id: "loc-3",
      name: "Cafe Delicia - Estacion",
      type: "cafeteria",
      records: multiLocationRecords3,
    },
  ],
};

export const plans = [
  {
    id: "basic",
    name: "Basico",
    price: 40,
    features: [
      "Registro manual de datos",
      "Dashboard basico",
      "Alertas simples",
      "Soporte por email",
    ],
    recommended: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: 80,
    features: [
      "Todo lo del plan Basico",
      "Prediccion avanzada",
      "Informes ampliados",
      "Soporte prioritario",
      "Mayor nivel de analisis",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 100,
    features: [
      "Todo lo del plan Plus",
      "Multiusuario",
      "Analitica avanzada",
      "Reportes personalizados",
      "Soporte dedicado",
      "API access",
    ],
    recommended: false,
  },
];

// Funcion para calcular recomendacion basada en historico
export const calculateRecommendation = (records: DailyRecord[]): number => {
  if (records.length === 0) return 0;
  
  // Promedio de ventas de los ultimos 7 dias + pequeno buffer
  const last7Days = records.slice(-7);
  const avgSold = last7Days.reduce((acc, r) => acc + r.sold, 0) / last7Days.length;
  
  // Anadir un 5% de buffer para evitar quedarse sin stock
  return Math.round(avgSold * 1.05);
};

// Funcion para calcular estadisticas agregadas
export const calculateStats = (records: DailyRecord[]) => {
  if (records.length === 0) {
    return {
      totalProduced: 0,
      totalSold: 0,
      totalWasted: 0,
      avgWastePercentage: 0,
      trend: 0,
    };
  }
  
  const totalProduced = records.reduce((acc, r) => acc + r.produced, 0);
  const totalSold = records.reduce((acc, r) => acc + r.sold, 0);
  const totalWasted = records.reduce((acc, r) => acc + r.wasted, 0);
  const avgWastePercentage = Math.round((totalWasted / totalProduced) * 100 * 10) / 10;
  
  // Calcular tendencia comparando ultima semana con anterior
  const lastWeek = records.slice(-7);
  const previousWeek = records.slice(-14, -7);
  
  const lastWeekWaste = lastWeek.reduce((acc, r) => acc + r.wastePercentage, 0) / lastWeek.length;
  const previousWeekWaste = previousWeek.length > 0 
    ? previousWeek.reduce((acc, r) => acc + r.wastePercentage, 0) / previousWeek.length 
    : lastWeekWaste;
  
  const trend = Math.round((lastWeekWaste - previousWeekWaste) * 10) / 10;
  
  return {
    totalProduced,
    totalSold,
    totalWasted,
    avgWastePercentage,
    trend,
  };
};

// Funcion para formatear fecha en espanol
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00');
  const days = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

export const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00');
  const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
};
