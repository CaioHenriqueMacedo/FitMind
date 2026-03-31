import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { DangerZone } from "@/components/profile/danger-zone"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Perfil</h1>
        <p className="mt-1 text-muted-foreground">Gerencie suas informacoes pessoais</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <ProfileForm profile={profile} userId={user!.id} userEmail={user!.email || ""} />
        <DangerZone />
      </div>
    </div>
  )
}
