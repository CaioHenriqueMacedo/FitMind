"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckCircle, Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface Workout {
  id: string
  completed: boolean
}

interface WorkoutActionsProps {
  workout: Workout
}

export function WorkoutActions({ workout }: WorkoutActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleComplete() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from("workouts")
      .update({ 
        completed: true, 
        completed_at: new Date().toISOString() 
      })
      .eq("id", workout.id)

    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este treino?")) return
    
    setLoading(true)
    const supabase = createClient()
    await supabase.from("workouts").delete().eq("id", workout.id)
    
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      {!workout.completed && (
        <Button
          size="sm"
          onClick={handleComplete}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Concluir
            </>
          )}
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={loading}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
