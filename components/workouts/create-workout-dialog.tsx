"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateWorkoutDialogProps {
  userId: string
}

const workoutTypes = [
  { value: "gym", label: "Academia" },
  { value: "home", label: "Casa" },
  { value: "outdoor", label: "Ar Livre" },
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Forca" },
  { value: "flexibility", label: "Flexibilidade" },
]

export function CreateWorkoutDialog({ userId }: CreateWorkoutDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [duration, setDuration] = useState("")
  const [calories, setCalories] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          duration_minutes: duration ? parseInt(duration) : null,
          calories_burned: calories ? parseInt(calories) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar treino")
      }

      setOpen(false)
      setName("")
      setType("")
      setDuration("")
      setCalories("")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Ocorreu um erro ao criar o treino.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Treino
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Treino</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Treino</Label>
            <Input
              id="name"
              placeholder="Ex: Treino de Perna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duracao (min)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias</Label>
              <Input
                id="calories"
                type="number"
                placeholder="300"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !name || !type}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar Treino"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
