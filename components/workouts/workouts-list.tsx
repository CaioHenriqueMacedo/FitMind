"use client"

import { Dumbbell, Clock, Flame, Calendar, CheckCircle2 } from "lucide-react"
import { WorkoutActions } from "./workout-actions"

interface Workout {
  id: string
  name: string
  type: string
  duration_minutes: number | null
  calories_burned: number | null
  exercises: any
  completed: boolean
  completed_at: string | null
  created_at: string
}

interface WorkoutsListProps {
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

const typeColors: Record<string, string> = {
  gym: "bg-primary/20 text-primary",
  home: "bg-accent/20 text-accent",
  outdoor: "bg-chart-4/20 text-chart-4",
  cardio: "bg-chart-5/20 text-chart-5",
  strength: "bg-chart-3/20 text-chart-3",
  flexibility: "bg-chart-2/20 text-chart-2",
}

export function WorkoutsList({ workouts }: WorkoutsListProps) {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Dumbbell className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum treino ainda</h3>
        <p className="max-w-sm text-muted-foreground">
          Crie seu primeiro treino para comecar a acompanhar seu progresso fitness.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className={`glass-card rounded-xl p-6 transition-all hover:border-primary/30 ${
            workout.completed ? "border-accent/30" : ""
          }`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                typeColors[workout.type] || "bg-muted text-muted-foreground"
              }`}>
                {typeLabels[workout.type] || workout.type}
              </span>
            </div>
            {workout.completed && (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            )}
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground">{workout.name}</h3>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {workout.duration_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {workout.duration_minutes} min
              </span>
            )}
            {workout.calories_burned && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                {workout.calories_burned} kcal
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(workout.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {workout.exercises && Array.isArray(workout.exercises) && workout.exercises.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Exercicios
              </p>
              <div className="flex flex-wrap gap-1">
                {workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
                  <span
                    key={index}
                    className="rounded bg-muted px-2 py-1 text-xs text-foreground"
                  >
                    {exercise.name || exercise}
                  </span>
                ))}
                {workout.exercises.length > 3 && (
                  <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    +{workout.exercises.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <WorkoutActions workout={workout} />
        </div>
      ))}
    </div>
  )
}
