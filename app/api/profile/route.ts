import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().optional(),
  age: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  goal: z.string().nullable().optional(),
})

export async function PUT(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const result = profileSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: "Dados inválidos", details: result.error }, { status: 400 })
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: result.data.name,
        age: result.data.age,
        weight: result.data.weight,
        height: result.data.height,
        goal: result.data.goal,
      })
      .eq("id", user.id)

    if (error) {
      return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
