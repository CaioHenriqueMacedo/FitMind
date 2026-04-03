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

interface AddMealDialogProps {
  userId: string
}

const mealTypes = [
  { value: "breakfast", label: "Cafe da Manha" },
  { value: "lunch", label: "Almoco" },
  { value: "dinner", label: "Jantar" },
  { value: "snack", label: "Lanche" },
]

export function AddMealDialog({ userId }: AddMealDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          calories: calories ? parseInt(calories) : 0,
          protein: protein ? parseFloat(protein) : undefined,
          carbs: carbs ? parseFloat(carbs) : undefined,
          fat: fat ? parseFloat(fat) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao registrar refeição")
      }

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Erro ao registrar refeição.")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setName("")
    setType("")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFat("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Refeicao
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Refeicao</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Nome</Label>
            <Input
              id="meal-name"
              placeholder="Ex: Omelete com queijo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Tipo de Refeicao</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="protein">Proteina (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="20"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                placeholder="30"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Gorduras (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                placeholder="10"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
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
                "Adicionar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
