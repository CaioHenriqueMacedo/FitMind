import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodayWorkout } from "@/components/dashboard/today-workout"
import { NutritionSummary } from "@/components/dashboard/nutrition-summary"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split("T")[0]

  // Run all queries in parallel for maximum performance
  const [
    { data: profile },
    { data: dailyGoals },
    { data: todayWorkouts },
    { data: todayMeals },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, goal, weight")
      .eq("id", user!.id)
      .single(),

    supabase
      .from("daily_goals")
      .select("*")
      .eq("user_id", user!.id)
      .eq("date", today)
      .single(),

    supabase
      .from("workouts")
      .select("id, name, type, duration_minutes, calories_burned, completed, completed_at, created_at")
      .eq("user_id", user!.id)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false }),

    supabase
      .from("meals")
      .select("id, name, meal_type, calories, protein, carbs, fat, logged_at")
      .eq("user_id", user!.id)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`),
  ])

  return (
    <div className="min-h-screen p-6 md:p-8">
      <DashboardHeader profile={profile} />
      
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <StatsCards dailyGoals={dailyGoals} />
          <TodayWorkout workouts={todayWorkouts || []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NutritionSummary meals={todayMeals || []} dailyGoals={dailyGoals} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
