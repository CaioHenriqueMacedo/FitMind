import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const weightSchema = z.object({
  weight: z.number().min(1, "O peso deve ser maior que 0"),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const result = weightSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: "Dados inválidos", details: result.error }, { status: 400 })
    }

    const weightEntry = {
      user_id: user.id,
      weight: result.data.weight,
      date: new Date().toISOString().split("T")[0],
    }

    // Add entry to weight_history
    const { error } = await supabase.from("weight_history").insert(weightEntry)

    if (error) {
      return NextResponse.json({ error: "Erro ao registrar peso" }, { status: 500 })
    }

    // Update profile with current weight
    await supabase
      .from("profiles")
      .update({ current_weight: result.data.weight })
      .eq("id", user.id)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
