"use client"

import Link from "next/link"
import { Utensils, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Meal {
  id: string
  name: string
  meal_type: string
  calories: number | null
  protein: number | null
}

interface DailyGoals {
  calorie_goal: number
  calories_consumed: number
}

interface NutritionSummaryProps {
  meals: Meal[]
  dailyGoals: DailyGoals | null
}

const mealTypeLabels: Record<string, string> = {
  breakfast: "Cafe da Manha",
  lunch: "Almoco",
  dinner: "Jantar",
  snack: "Lanche",
}

export function NutritionSummary({ meals, dailyGoals }: NutritionSummaryProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
  const calorieGoal = dailyGoals?.calorie_goal || 2000
  const remaining = calorieGoal - totalCalories

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Nutricao</h2>
        <Link href="/nutrition">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Calorie Ring */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <svg className="h-32 w-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={352}
              strokeDashoffset={352 - (352 * Math.min(totalCalories / calorieGoal, 1))}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{totalCalories}</span>
            <span className="text-xs text-muted-foreground">/{calorieGoal} kcal</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">{totalProtein}g</p>
          <p className="text-xs text-muted-foreground">Proteina</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {remaining > 0 ? remaining : 0}
          </p>
          <p className="text-xs text-muted-foreground">kcal restantes</p>
        </div>
      </div>

      {/* Recent Meals */}
      {meals.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Refeicoes de hoje</p>
          {meals.slice(0, 3).map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{meal.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {meal.calories || 0} kcal
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma refeicao registrada
          </p>
          <Link href="/nutrition">
            <Button variant="link" size="sm" className="mt-2">
              Adicionar refeicao
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
