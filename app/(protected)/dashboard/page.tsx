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

  // Compute actual consumption from records
  const consumedCalories = todayMeals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0
  const consumedProtein = todayMeals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 0
  const completedWorkouts = todayWorkouts?.filter(w => w.completed).length || 0

  const computedDailyGoals = {
    ...(dailyGoals || {
      calorie_goal: 2000,
      protein_goal: 150,
      workout_goal: 1,
      water_goal: 8,
      water_consumed: 0,
    }),
    calories_consumed: consumedCalories,
    protein_consumed: consumedProtein,
    workouts_completed: completedWorkouts,
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <DashboardHeader profile={profile} />
      
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <StatsCards dailyGoals={computedDailyGoals} />
          <TodayWorkout workouts={todayWorkouts || []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NutritionSummary meals={todayMeals || []} dailyGoals={computedDailyGoals} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
