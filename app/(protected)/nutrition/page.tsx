import { createClient } from "@/lib/supabase/server"
import { MealsList } from "@/components/nutrition/meals-list"
import { AddMealDialog } from "@/components/nutrition/add-meal-dialog"
import { NutritionStats } from "@/components/nutrition/nutrition-stats"

export default async function NutritionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split("T")[0]

  // Get today's meals
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user!.id)
    .gte("logged_at", `${today}T00:00:00`)
    .lte("logged_at", `${today}T23:59:59`)
    .order("logged_at", { ascending: true })

  // Get daily goals
  const { data: dailyGoals } = await supabase
    .from("daily_goals")
    .select("*")
    .eq("user_id", user!.id)
    .eq("date", today)
    .single()

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Nutricao</h1>
          <p className="mt-1 text-muted-foreground">Acompanhe sua alimentacao diaria</p>
        </div>
        <AddMealDialog userId={user!.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MealsList meals={meals || []} />
        </div>
        <div>
          <NutritionStats meals={meals || []} dailyGoals={dailyGoals} />
        </div>
      </div>
    </div>
  )
}
