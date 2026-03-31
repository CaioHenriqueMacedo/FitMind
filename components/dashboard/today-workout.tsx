"use client"

import Link from "next/link"
import { Dumbbell, Clock, Flame, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Workout {
  id: string
  name: string
  type: string
  duration_minutes: number | null
  calories_burned: number | null
  completed: boolean
}

interface TodayWorkoutProps {
  workouts: Workout[]
}

const typeLabels: Record<string, string> = {
  gym: "Academia",
  home: "Casa",
  outdoor: "Ar Livre",
  cardio: "Cardio",
  strength: "Forca",
  flexibility: "Flexibilidade",
}

export function TodayWorkout({ workouts }: TodayWorkoutProps) {
  const hasWorkouts = workouts.length > 0

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Treino de Hoje</h2>
        <Link href="/workouts">
          <Button variant="ghost" size="sm">
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {hasWorkouts ? (
        <div className="space-y-3">
          {workouts.slice(0, 3).map((workout) => (
            <div
              key={workout.id}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                workout.completed
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className={`rounded-lg p-3 ${
                workout.completed ? "bg-accent/20" : "bg-primary/20"
              }`}>
                <Dumbbell className={`h-5 w-5 ${
                  workout.completed ? "text-accent" : "text-primary"
                }`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{workout.name}</p>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{typeLabels[workout.type] || workout.type}</span>
                  {workout.duration_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {workout.duration_minutes} min
                    </span>
                  )}
                  {workout.calories_burned && (
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" />
                      {workout.calories_burned} kcal
                    </span>
                  )}
                </div>
              </div>
              {workout.completed && (
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  Concluido
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mb-2 text-foreground">Nenhum treino hoje</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece seu dia com um treino personalizado
          </p>
          <Link href="/workouts">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Criar Treino
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
