"use client";

import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  labelMap?: Record<string, string>;
  unit?: string;
  suffix?: string;
}

export function CustomChartTooltip({ 
  active, 
  payload, 
  label,
  labelMap = {},
  unit = "",
  suffix = ""
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
      <p className="text-sm font-semibold text-foreground mb-2 border-b border-border pb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const name = labelMap[entry.dataKey as string] || entry.name || entry.dataKey;
          const color = entry.color;
          
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-muted-foreground">{name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {unit}{entry.value}{suffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WasteTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0]?.value || 0;
  const isHigh = value > 10;

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
      <p className="text-sm font-semibold text-foreground mb-2 border-b border-border pb-2">
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">Desperdicio</span>
        <span className={`text-sm font-bold ${isHigh ? 'text-destructive' : 'text-primary'}`}>
          {value}%
        </span>
      </div>
      {isHigh && (
        <p className="text-xs text-destructive mt-2 pt-2 border-t border-border">
          Por encima del objetivo (10%)
        </p>
      )}
    </div>
  );
}
