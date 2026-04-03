import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const workoutSchema = z.object({
  name: z.string().min(1, "O nome do treino é obrigatório"),
  type: z.string().min(1, "O tipo do treino é obrigatório"),
  duration_minutes: z.number().nullable().optional(),
  calories_burned: z.number().nullable().optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const result = workoutSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: "Dados inválidos", details: result.error }, { status: 400 })
    }

    const workout = {
      user_id: user.id,
      name: result.data.name,
      type: result.data.type,
      duration_minutes: result.data.duration_minutes,
      calories_burned: result.data.calories_burned,
    }

    const { data, error } = await supabase.from("workouts").insert(workout).select().single()

    if (error) {
      return NextResponse.json({ error: "Erro ao salvar o treino" }, { status: 500 })
    }

    return NextResponse.json({ workout: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do treino não fornecido" }, { status: 400 })
    }

    const { error } = await supabase.from("workouts").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      return NextResponse.json({ error: "Erro ao deletar o treino" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const { id, completed } = json

    if (!id) {
      return NextResponse.json({ error: "ID do treino não fornecido" }, { status: 400 })
    }

    const { error } = await supabase
      .from("workouts")
      .update({ 
        completed, 
        completed_at: completed ? new Date().toISOString() : null 
      })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      return NextResponse.json({ error: "Erro ao atualizar o treino" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
