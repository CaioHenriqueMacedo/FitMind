"use client"

import { useRouter } from "next/navigation"
import { Utensils, Clock, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Meal {
  id: string
  name: string
  meal_type: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  logged_at: string
}

interface MealsListProps {
  meals: Meal[]
}

const mealTypeLabels: Record<string, string> = {
  breakfast: "Cafe da Manha",
  lunch: "Almoco",
  dinner: "Jantar",
  snack: "Lanche",
}

const mealTypeColors: Record<string, string> = {
  breakfast: "bg-chart-4/20 text-chart-4",
  lunch: "bg-primary/20 text-primary",
  dinner: "bg-accent/20 text-accent",
  snack: "bg-chart-3/20 text-chart-3",
}

export function MealsList({ meals }: MealsListProps) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta refeicao?")) return
    const supabase = createClient()
    await supabase.from("meals").delete().eq("id", id)
    router.refresh()
  }

  if (meals.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-xl py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Utensils className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhuma refeicao hoje</h3>
        <p className="max-w-sm text-muted-foreground">
          Registre suas refeicoes para acompanhar sua nutricao diaria.
        </p>
      </div>
    )
  }

  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type || "snack"
    if (!acc[type]) acc[type] = []
    acc[type].push(meal)
    return acc
  }, {} as Record<string, Meal[]>)

  const mealOrder = ["breakfast", "lunch", "dinner", "snack"]

  return (
    <div className="space-y-6">
      {mealOrder.map((type) => {
        const typeMeals = mealsByType[type]
        if (!typeMeals || typeMeals.length === 0) return null

        return (
          <div key={type} className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${mealTypeColors[type]}`}>
                {mealTypeLabels[type]}
              </span>
              <span className="text-sm text-muted-foreground">
                {typeMeals.reduce((sum, m) => sum + (m.calories || 0), 0)} kcal total
              </span>
            </div>

            <div className="space-y-3">
              {typeMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{meal.name}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{meal.calories || 0} kcal</span>
                      {meal.protein && <span>{meal.protein}g prot</span>}
                      {meal.carbs && <span>{meal.carbs}g carb</span>}
                      {meal.fat && <span>{meal.fat}g gord</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(meal.logged_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(meal.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
