import Link from "next/link"
import { Dumbbell, AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.25_25_/_0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FitMind AI</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h1 className="mb-3 text-2xl font-bold text-foreground">Erro de Autenticacao</h1>
          <p className="mb-8 text-muted-foreground">
            Ocorreu um erro durante o processo de autenticacao. 
            Por favor, tente novamente.
          </p>

          <div className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
