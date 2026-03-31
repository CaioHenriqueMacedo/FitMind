import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TodayWorkout } from "@/components/dashboard/today-workout"
import { NutritionSummary } from "@/components/dashboard/nutrition-summary"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  // Get today's goals
  const today = new Date().toISOString().split("T")[0]
  const { data: dailyGoals } = await supabase
    .from("daily_goals")
    .select("*")
    .eq("user_id", user!.id)
    .eq("date", today)
    .single()

  // Get today's workouts
  const { data: todayWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user!.id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false })

  // Get today's meals
  const { data: todayMeals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user!.id)
    .gte("logged_at", `${today}T00:00:00`)
    .lte("logged_at", `${today}T23:59:59`)

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
