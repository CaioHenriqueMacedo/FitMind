"use client"

import { TrendingUp, TrendingDown, Scale } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

interface WeightEntry {
  id: string
  weight: number
  logged_at: string
}

interface WeightChartProps {
  weightHistory: WeightEntry[]
}

export function WeightChart({ weightHistory }: WeightChartProps) {
  if (weightHistory.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Scale className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Sem dados de peso</h3>
        <p className="max-w-sm text-muted-foreground">
          Adicione seu peso regularmente para acompanhar sua evolucao ao longo do tempo.
        </p>
      </div>
    )
  }

  const chartData = weightHistory.map((entry) => ({
    date: new Date(entry.logged_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
    weight: Number(entry.weight),
  }))

  const firstWeight = weightHistory[0]?.weight || 0
  const lastWeight = weightHistory[weightHistory.length - 1]?.weight || 0
  const weightChange = Number(lastWeight) - Number(firstWeight)
  const isLoss = weightChange < 0

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historico de Peso</h3>
          <p className="text-sm text-muted-foreground">Ultimos 30 registros</p>
        </div>
        {weightHistory.length > 1 && (
          <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
            isLoss ? "bg-accent/20 text-accent" : "bg-chart-5/20 text-chart-5"
          }`}>
            {isLoss ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {Math.abs(weightChange).toFixed(1)} kg
          </div>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.7 0.2 195)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.7 0.2 195)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.02 240)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              tickFormatter={(value) => `${value}kg`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.015 240)",
                border: "1px solid oklch(0.25 0.02 240)",
                borderRadius: "8px",
                color: "oklch(0.98 0 0)",
              }}
              formatter={(value: number) => [`${value} kg`, "Peso"]}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="oklch(0.7 0.2 195)"
              strokeWidth={2}
              fill="url(#weightGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
