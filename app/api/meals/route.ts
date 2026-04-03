import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const mealSchema = z.object({
  name: z.string().min(1, "O nome da refeição é obrigatório"),
  type: z.string().min(1, "O tipo da refeição é obrigatório"),
  calories: z.number().min(0, "Calorias devem ser 0 ou mais"),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const json = await req.json()
    const result = mealSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: "Dados inválidos", details: result.error }, { status: 400 })
    }

    const meal = {
      user_id: user.id,
      name: result.data.name,
      meal_type: result.data.type,
      calories: result.data.calories,
      protein: result.data.protein,
      carbs: result.data.carbs,
      fat: result.data.fat,
      logged_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("meals").insert(meal).select().single()

    if (error) {
      return NextResponse.json({ error: "Erro ao salvar refeição" }, { status: 500 })
    }

    return NextResponse.json({ meal: data }, { status: 201 })
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
      return NextResponse.json({ error: "ID da refeição não fornecido" }, { status: 400 })
    }

    const { error } = await supabase.from("meals").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      return NextResponse.json({ error: "Erro ao deletar refeição" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
