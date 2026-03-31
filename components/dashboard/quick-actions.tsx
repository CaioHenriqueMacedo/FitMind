"use client"

import Link from "next/link"
import { Dumbbell, Utensils, MessageCircle, TrendingUp } from "lucide-react"

const actions = [
  {
    href: "/workouts",
    icon: Dumbbell,
    label: "Novo Treino",
    color: "text-primary",
    bgColor: "bg-primary/10 hover:bg-primary/20",
  },
  {
    href: "/nutrition",
    icon: Utensils,
    label: "Registrar Refeicao",
    color: "text-accent",
    bgColor: "bg-accent/10 hover:bg-accent/20",
  },
  {
    href: "/coach",
    icon: MessageCircle,
    label: "Falar com Coach",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10 hover:bg-chart-3/20",
  },
  {
    href: "/progress",
    icon: TrendingUp,
    label: "Ver Progresso",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10 hover:bg-chart-4/20",
  },
]

export function QuickActions() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Acoes Rapidas</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-colors ${action.bgColor}`}
          >
            <action.icon className={`h-6 w-6 ${action.color}`} />
            <span className="text-center text-xs font-medium text-foreground">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
