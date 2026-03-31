import { createClient } from "@/lib/supabase/server"
import { WeightChart } from "@/components/progress/weight-chart"
import { AddWeightDialog } from "@/components/progress/add-weight-dialog"
import { ProgressStats } from "@/components/progress/progress-stats"

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get weight history
  const { data: weightHistory } = await supabase
    .from("weight_history")
    .select("*")
    .eq("user_id", user!.id)
    .order("logged_at", { ascending: true })
    .limit(30)

  // Get workout stats (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user!.id)
    .eq("completed", true)
    .gte("completed_at", thirtyDaysAgo.toISOString())

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("weight, goal")
    .eq("id", user!.id)
    .single()

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Progresso</h1>
          <p className="mt-1 text-muted-foreground">Acompanhe sua evolucao</p>
        </div>
        <AddWeightDialog userId={user!.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeightChart weightHistory={weightHistory || []} />
        </div>
        <div>
          <ProgressStats 
            weightHistory={weightHistory || []} 
            recentWorkouts={recentWorkouts || []}
            profile={profile}
          />
        </div>
      </div>
    </div>
  )
}
