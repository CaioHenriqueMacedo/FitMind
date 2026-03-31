import { createClient } from "@/lib/supabase/server"
import { WorkoutsList } from "@/components/workouts/workouts-list"
import { CreateWorkoutDialog } from "@/components/workouts/create-workout-dialog"

export default async function WorkoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Treinos</h1>
          <p className="mt-1 text-muted-foreground">Gerencie e acompanhe seus treinos</p>
        </div>
        <CreateWorkoutDialog userId={user!.id} />
      </div>

      <WorkoutsList workouts={workouts || []} />
    </div>
  )
}
