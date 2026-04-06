import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createGroq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Consulta não fornecida" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Serviço de IA não configurado" }, { status: 503 })
    }

    const groq = createGroq({ apiKey })

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        calories: z.number().describe("Total de calorias estimadas"),
        protein: z.number().describe("Total de proteínas estimadas em gramas"),
        carbs: z.number().describe("Total de carboidratos estimados em gramas"),
        fat: z.number().describe("Total de gorduras estimadas em gramas"),
        name: z.string().describe("Um nome curto, capitalizado e amigável para a refeição (ex: 'Omelete de Carne', 'Arroz e Feijão')"),
      }),
      prompt: `Você é um especialista em nutrição. Estime as informações nutricionais para: "${query}".
      
      Regras:
      1. Se a quantidade não for especificada, use uma porção média comum (ex: 1 concha, 1 fatia, 1 unidade de 100g).
      2. Considere ingredientes comuns da culinária brasileira se for o caso.
      3. Forneça o nome formatado e bonito para a refeição.
      4. Retorne apenas valores numéricos realistas.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Erro na estimativa de nutrição:", error)
    return NextResponse.json({ error: "Erro interno ao estimar nutrição" }, { status: 500 })
  }
}
