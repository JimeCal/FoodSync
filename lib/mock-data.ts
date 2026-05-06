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
  { id: "record-13", date: "2026-04-07", produced: 850, sold: 720, wasted: 130, wastePercentage: 15.3 },
  { id: "record-12", date: "2026-04-08", produced: 920, sold: 800, wasted: 120, wastePercentage: 13.0 },
  { id: "record-11", date: "2026-04-09", produced: 780, sold: 680, wasted: 100, wastePercentage: 12.8 },
  { id: "record-10", date: "2026-04-10", produced: 950, sold: 820, wasted: 130, wastePercentage: 13.7 },
  { id: "record-9", date: "2026-04-11", produced: 880, sold: 750, wasted: 130, wastePercentage: 14.8 },
  { id: "record-8", date: "2026-04-12", produced: 910, sold: 810, wasted: 100, wastePercentage: 11.0 },
  { id: "record-7", date: "2026-04-13", produced: 940, sold: 850, wasted: 90, wastePercentage: 9.6 },
  { id: "record-6", date: "2026-04-14", produced: 820, sold: 700, wasted: 120, wastePercentage: 14.6 },
  { id: "record-5", date: "2026-04-15", produced: 930, sold: 840, wasted: 90, wastePercentage: 9.7 },
  { id: "record-4", date: "2026-04-16", produced: 970, sold: 880, wasted: 90, wastePercentage: 9.3 },
  { id: "record-3", date: "2026-04-17", produced: 900, sold: 810, wasted: 90, wastePercentage: 10.0 },
  { id: "record-2", date: "2026-04-18", produced: 880, sold: 790, wasted: 90, wastePercentage: 10.2 },
  { id: "record-1", date: "2026-04-19", produced: 930, sold: 860, wasted: 70, wastePercentage: 7.5 },
  { id: "record-0", date: "2026-04-20", produced: 910, sold: 840, wasted: 70, wastePercentage: 7.7 },
];

const multiLocationRecords1: DailyRecord[] = [
  { id: "mloc1-13", date: "2026-04-07", produced: 1200, sold: 1050, wasted: 150, wastePercentage: 12.5 },
  { id: "mloc1-12", date: "2026-04-08", produced: 1300, sold: 1150, wasted: 150, wastePercentage: 11.5 },
  { id: "mloc1-11", date: "2026-04-09", produced: 1180, sold: 1020, wasted: 160, wastePercentage: 13.6 },
  { id: "mloc1-10", date: "2026-04-10", produced: 1250, sold: 1100, wasted: 150, wastePercentage: 12.0 },
  { id: "mloc1-9", date: "2026-04-11", produced: 1120, sold: 950, wasted: 170, wastePercentage: 15.2 },
  { id: "mloc1-8", date: "2026-04-12", produced: 1280, sold: 1150, wasted: 130, wastePercentage: 10.2 },
  { id: "mloc1-7", date: "2026-04-13", produced: 1350, sold: 1220, wasted: 130, wastePercentage: 9.6 },
  { id: "mloc1-6", date: "2026-04-14", produced: 1150, sold: 980, wasted: 170, wastePercentage: 14.8 },
  { id: "mloc1-5", date: "2026-04-15", produced: 1320, sold: 1200, wasted: 120, wastePercentage: 9.1 },
  { id: "mloc1-4", date: "2026-04-16", produced: 1380, sold: 1260, wasted: 120, wastePercentage: 8.7 },
  { id: "mloc1-3", date: "2026-04-17", produced: 1220, sold: 1100, wasted: 120, wastePercentage: 9.8 },
  { id: "mloc1-2", date: "2026-04-18", produced: 1250, sold: 1130, wasted: 120, wastePercentage: 9.6 },
  { id: "mloc1-1", date: "2026-04-19", produced: 1290, sold: 1180, wasted: 110, wastePercentage: 8.5 },
  { id: "mloc1-0", date: "2026-04-20", produced: 1240, sold: 1140, wasted: 100, wastePercentage: 8.1 },
];

const multiLocationRecords2: DailyRecord[] = [
  { id: "mloc2-13", date: "2026-04-07", produced: 1050, sold: 920, wasted: 130, wastePercentage: 12.4 },
  { id: "mloc2-12", date: "2026-04-08", produced: 1100, sold: 970, wasted: 130, wastePercentage: 11.8 },
  { id: "mloc2-11", date: "2026-04-09", produced: 1020, sold: 890, wasted: 130, wastePercentage: 12.7 },
  { id: "mloc2-10", date: "2026-04-10", produced: 1080, sold: 950, wasted: 130, wastePercentage: 12.0 },
  { id: "mloc2-9", date: "2026-04-11", produced: 980, sold: 840, wasted: 140, wastePercentage: 14.3 },
  { id: "mloc2-8", date: "2026-04-12", produced: 1120, sold: 1000, wasted: 120, wastePercentage: 10.7 },
  { id: "mloc2-7", date: "2026-04-13", produced: 1180, sold: 1060, wasted: 120, wastePercentage: 10.2 },
  { id: "mloc2-6", date: "2026-04-14", produced: 950, sold: 800, wasted: 150, wastePercentage: 15.8 },
  { id: "mloc2-5", date: "2026-04-15", produced: 1150, sold: 1040, wasted: 110, wastePercentage: 9.6 },
  { id: "mloc2-4", date: "2026-04-16", produced: 1200, sold: 1090, wasted: 110, wastePercentage: 9.2 },
  { id: "mloc2-3", date: "2026-04-17", produced: 1060, sold: 950, wasted: 110, wastePercentage: 10.4 },
  { id: "mloc2-2", date: "2026-04-18", produced: 1090, sold: 980, wasted: 110, wastePercentage: 10.1 },
  { id: "mloc2-1", date: "2026-04-19", produced: 1130, sold: 1030, wasted: 100, wastePercentage: 8.8 },
  { id: "mloc2-0", date: "2026-04-20", produced: 1070, sold: 970, wasted: 100, wastePercentage: 9.3 },
];

const multiLocationRecords3: DailyRecord[] = [
  { id: "mloc3-13", date: "2026-04-07", produced: 1400, sold: 1220, wasted: 180, wastePercentage: 12.9 },
  { id: "mloc3-12", date: "2026-04-08", produced: 1450, sold: 1280, wasted: 170, wastePercentage: 11.7 },
  { id: "mloc3-11", date: "2026-04-09", produced: 1380, sold: 1200, wasted: 180, wastePercentage: 13.0 },
  { id: "mloc3-10", date: "2026-04-10", produced: 1420, sold: 1250, wasted: 170, wastePercentage: 12.0 },
  { id: "mloc3-9", date: "2026-04-11", produced: 1320, sold: 1120, wasted: 200, wastePercentage: 15.2 },
  { id: "mloc3-8", date: "2026-04-12", produced: 1480, sold: 1320, wasted: 160, wastePercentage: 10.8 },
  { id: "mloc3-7", date: "2026-04-13", produced: 1520, sold: 1380, wasted: 140, wastePercentage: 9.2 },
  { id: "mloc3-6", date: "2026-04-14", produced: 1280, sold: 1080, wasted: 200, wastePercentage: 15.6 },
  { id: "mloc3-5", date: "2026-04-15", produced: 1500, sold: 1370, wasted: 130, wastePercentage: 8.7 },
  { id: "mloc3-4", date: "2026-04-16", produced: 1550, sold: 1420, wasted: 130, wastePercentage: 8.4 },
  { id: "mloc3-3", date: "2026-04-17", produced: 1400, sold: 1270, wasted: 130, wastePercentage: 9.3 },
  { id: "mloc3-2", date: "2026-04-18", produced: 1430, sold: 1300, wasted: 130, wastePercentage: 9.1 },
  { id: "mloc3-1", date: "2026-04-19", produced: 1470, sold: 1350, wasted: 120, wastePercentage: 8.2 },
  { id: "mloc3-0", date: "2026-04-20", produced: 1410, sold: 1290, wasted: 120, wastePercentage: 8.5 },
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
