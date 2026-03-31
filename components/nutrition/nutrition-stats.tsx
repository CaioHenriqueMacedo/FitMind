"use client"

import { Flame, Target, Droplets } from "lucide-react"

interface Meal {
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
}

interface DailyGoals {
  calorie_goal: number
  protein_goal: number
}

interface NutritionStatsProps {
  meals: Meal[]
  dailyGoals: DailyGoals | null
}

export function NutritionStats({ meals, dailyGoals }: NutritionStatsProps) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const calorieGoal = dailyGoals?.calorie_goal || 2000
  const proteinGoal = dailyGoals?.protein_goal || 150
  const caloriePercentage = Math.min((totals.calories / calorieGoal) * 100, 100)
  const proteinPercentage = Math.min((totals.protein / proteinGoal) * 100, 100)

  // Calculate macros distribution
  const totalMacroCalories = (totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9)
  const proteinPercent = totalMacroCalories > 0 ? ((totals.protein * 4) / totalMacroCalories) * 100 : 0
  const carbsPercent = totalMacroCalories > 0 ? ((totals.carbs * 4) / totalMacroCalories) * 100 : 0
  const fatPercent = totalMacroCalories > 0 ? ((totals.fat * 9) / totalMacroCalories) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Calorie Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Resumo do Dia</h3>
        
        {/* Calorie Ring */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <svg className="h-36 w-36 -rotate-90 transform">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * caloriePercentage / 100)}
                strokeLinecap="round"
                className="text-primary transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{totals.calories}</span>
              <span className="text-sm text-muted-foreground">de {calorieGoal} kcal</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <Flame className="mx-auto mb-1 h-5 w-5 text-chart-5" />
            <p className="text-lg font-semibold text-foreground">
              {calorieGoal - totals.calories > 0 ? calorieGoal - totals.calories : 0}
            </p>
            <p className="text-xs text-muted-foreground">kcal restantes</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <Target className="mx-auto mb-1 h-5 w-5 text-accent" />
            <p className="text-lg font-semibold text-foreground">{Math.round(totals.protein)}g</p>
            <p className="text-xs text-muted-foreground">de {proteinGoal}g prot</p>
          </div>
        </div>
      </div>

      {/* Macros Breakdown */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Macronutrientes</h3>
        
        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Proteina</span>
              <span className="font-medium text-foreground">{Math.round(totals.protein)}g</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Carboidratos</span>
              <span className="font-medium text-foreground">{Math.round(totals.carbs)}g</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gorduras</span>
              <span className="font-medium text-foreground">{Math.round(totals.fat)}g</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-chart-4 transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Macro percentages */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {Math.round(proteinPercent)}% prot
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {Math.round(carbsPercent)}% carb
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-chart-4" />
            {Math.round(fatPercent)}% gord
          </span>
        </div>
      </div>
    </div>
  )
}
