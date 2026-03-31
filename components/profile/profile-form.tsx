"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Profile {
  id: string
  name: string | null
  email: string | null
  age: number | null
  weight: number | null
  height: number | null
  goal: string | null
}

interface ProfileFormProps {
  profile: Profile | null
  userId: string
  userEmail: string
}

const goals = [
  { value: "lose_weight", label: "Perder Peso" },
  { value: "gain_muscle", label: "Ganhar Massa Muscular" },
  { value: "maintain", label: "Manter Forma" },
  { value: "endurance", label: "Melhorar Resistencia" },
]

export function ProfileForm({ profile, userId, userEmail }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState(profile?.name || "")
  const [age, setAge] = useState(profile?.age?.toString() || "")
  const [weight, setWeight] = useState(profile?.weight?.toString() || "")
  const [height, setHeight] = useState(profile?.height?.toString() || "")
  const [goal, setGoal] = useState(profile?.goal || "")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const supabase = createClient()
    await supabase
      .from("profiles")
      .upsert({
        id: userId,
        name,
        email: userEmail,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        goal: goal || null,
        updated_at: new Date().toISOString(),
      })

    setLoading(false)
    setSuccess(true)
    router.refresh()

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{name || "Seu Nome"}</h2>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70.5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Objetivo Principal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu objetivo" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alteracoes"
            )}
          </Button>
          {success && (
            <span className="text-sm text-accent">Perfil atualizado com sucesso!</span>
          )}
        </div>
      </form>
    </div>
  )
}
