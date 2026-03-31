"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function DangerZone() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Sair da Conta</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Voce sera desconectado de todos os dispositivos. Seus dados permanecerao salvos.
      </p>
      <Button variant="destructive" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}
