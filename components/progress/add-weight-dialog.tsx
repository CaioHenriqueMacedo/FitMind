"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Scale } from "lucide-react"
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

interface AddWeightDialogProps {
  userId: string
}

export function AddWeightDialog({ userId }: AddWeightDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [weight, setWeight] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.from("weight_history").insert({
      user_id: userId,
      weight: parseFloat(weight),
      logged_at: new Date().toISOString().split("T")[0],
    })

    // Also update profile weight
    await supabase
      .from("profiles")
      .update({ weight: parseFloat(weight) })
      .eq("id", userId)

    setLoading(false)
    setOpen(false)
    setWeight("")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Peso
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrar Peso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 rounded-full bg-primary/20 p-4">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <Label htmlFor="weight" className="sr-only">Peso em kg</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="h-14 text-center text-2xl font-bold"
              />
              <p className="text-sm text-muted-foreground">Peso em quilogramas</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !weight}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
