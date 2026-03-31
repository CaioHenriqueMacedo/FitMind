"use client"

import { Flame, Dumbbell, Droplets, Target } from "lucide-react"

interface DailyGoals {
  calorie_goal: number
  protein_goal: number
  workout_goal: number
  water_goal: number
  calories_consumed: number
  protein_consumed: number
  workouts_completed: number
  water_consumed: number
}

interface StatsCardsProps {
  dailyGoals: DailyGoals | null
}

export function StatsCards({ dailyGoals }: StatsCardsProps) {
  const goals = dailyGoals || {
    calorie_goal: 2000,
    protein_goal: 150,
    workout_goal: 1,
    water_goal: 8,
    calories_consumed: 0,
    protein_consumed: 0,
    workouts_completed: 0,
    water_consumed: 0,
  }

  const stats = [
    {
      label: "Calorias",
      value: goals.calories_consumed,
      goal: goals.calorie_goal,
      unit: "kcal",
      icon: Flame,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      label: "Proteina",
      value: goals.protein_consumed,
      goal: goals.protein_goal,
      unit: "g",
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Treinos",
      value: goals.workouts_completed,
      goal: goals.workout_goal,
      unit: "",
      icon: Dumbbell,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Agua",
      value: goals.water_consumed,
      goal: goals.water_goal,
      unit: "copos",
      icon: Droplets,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const percentage = Math.min((stat.value / stat.goal) * 100, 100)
        return (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}/{stat.goal}{stat.unit && ` ${stat.unit}`}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${stat.color.replace("text-", "bg-")}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
