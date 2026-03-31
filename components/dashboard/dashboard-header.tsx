"use client"

interface Profile {
  name: string | null
  goal: string | null
}

interface DashboardHeaderProps {
  profile: Profile | null
}

const goalLabels: Record<string, string> = {
  lose_weight: "Perder Peso",
  gain_muscle: "Ganhar Massa",
  maintain: "Manter Forma",
  endurance: "Resistencia",
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const greeting = getGreeting()
  const name = profile?.name?.split(" ")[0] || "Usuario"

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        {greeting}, {name}!
      </h1>
      <p className="mt-1 text-muted-foreground">
        {profile?.goal 
          ? `Objetivo: ${goalLabels[profile.goal] || profile.goal}`
          : "Vamos conquistar seus objetivos hoje"
        }
      </p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}
