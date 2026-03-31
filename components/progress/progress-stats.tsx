"use client"

import { Scale, Dumbbell, Flame, Target } from "lucide-react"

interface WeightEntry {
  weight: number
  logged_at: string
}

interface Workout {
  calories_burned: number | null
  duration_minutes: number | null
}

interface Profile {
  weight: number | null
  goal: string | null
}

interface ProgressStatsProps {
  weightHistory: WeightEntry[]
  recentWorkouts: Workout[]
  profile: Profile | null
}

const goalLabels: Record<string, string> = {
  lose_weight: "Perder Peso",
  gain_muscle: "Ganhar Massa",
  maintain: "Manter Forma",
  endurance: "Resistencia",
}

export function ProgressStats({ weightHistory, recentWorkouts, profile }: ProgressStatsProps) {
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : profile?.weight || 0

  const startWeight = weightHistory.length > 0 
    ? weightHistory[0].weight 
    : profile?.weight || 0

  const totalChange = Number(currentWeight) - Number(startWeight)
  
  const totalWorkouts = recentWorkouts.length
  const totalCaloriesBurned = recentWorkouts.reduce(
    (sum, w) => sum + (w.calories_burned || 0),
    0
  )
  const totalMinutes = recentWorkouts.reduce(
    (sum, w) => sum + (w.duration_minutes || 0),
    0
  )

  const stats = [
    {
      label: "Peso Atual",
      value: `${Number(currentWeight).toFixed(1)} kg`,
      icon: Scale,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Variacao Total",
      value: `${totalChange >= 0 ? "+" : ""}${totalChange.toFixed(1)} kg`,
      icon: Target,
      color: totalChange < 0 ? "text-accent" : "text-chart-5",
      bgColor: totalChange < 0 ? "bg-accent/10" : "bg-chart-5/10",
    },
    {
      label: "Treinos (30 dias)",
      value: totalWorkouts.toString(),
      icon: Dumbbell,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Calorias Queimadas",
      value: `${totalCaloriesBurned.toLocaleString()} kcal`,
      icon: Flame,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Goal Card */}
      {profile?.goal && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Seu Objetivo
          </h3>
          <p className="text-xl font-semibold text-foreground">
            {goalLabels[profile.goal] || profile.goal}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Estatisticas</h3>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Tempo Treinando</h3>
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>
          <p className="mt-1 text-sm text-muted-foreground">nos ultimos 30 dias</p>
        </div>
      </div>
    </div>
  )
}
