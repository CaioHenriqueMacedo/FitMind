"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Dumbbell, 
  LayoutDashboard, 
  Utensils, 
  MessageCircle, 
  TrendingUp, 
  User,
  LogOut
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

interface AppSidebarProps {
  user: SupabaseUser
  profile: Profile | null
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/workouts", icon: Dumbbell, label: "Treinos" },
  { href: "/nutrition", icon: Utensils, label: "Nutricao" },
  { href: "/progress", icon: TrendingUp, label: "Progresso" },
  { href: "/coach", icon: MessageCircle, label: "Coach IA" },
  { href: "/profile", icon: User, label: "Perfil" },
]

export function AppSidebar({ user, profile }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">FitMind AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {profile?.name || "Usuario"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
