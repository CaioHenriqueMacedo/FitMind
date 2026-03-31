import Link from "next/link"
import { Dumbbell, Brain, Utensils, TrendingUp, MessageCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FitMind AI</span>
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Como Funciona
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Planos
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="glow-primary">
                Comecar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.2_195_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.25_160_/_0.1),transparent_50%)]" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Powered by AI</span>
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Seu Personal Trainer com{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Treinos personalizados, nutricao inteligente e um coach disponivel 24/7. 
            Transforme seu corpo e mente com a tecnologia mais avancada em fitness.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/sign-up">
              <Button size="lg" className="glow-primary px-8">
                Comecar Agora — Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Ver Recursos
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-foreground md:text-4xl">50K+</p>
              <p className="text-sm text-muted-foreground">Usuarios Ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground md:text-4xl">1M+</p>
              <p className="text-sm text-muted-foreground">Treinos Completados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground md:text-4xl">4.9</p>
              <p className="text-sm text-muted-foreground">Avaliacao Media</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">Recursos</p>
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Tudo que voce precisa para transformar seu corpo
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Treinos Personalizados</h3>
              <p className="text-muted-foreground">
                IA cria treinos sob medida para seus objetivos, nivel de condicionamento e equipamentos disponiveis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <Utensils className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Nutricao Inteligente</h3>
              <p className="text-muted-foreground">
                Planos alimentares adaptados ao seu metabolismo, preferencias e restricoes alimentares.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3/10">
                <Brain className="h-7 w-7 text-chart-3" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Coach IA 24/7</h3>
              <p className="text-muted-foreground">
                Tire duvidas, receba motivacao e ajuste seus planos a qualquer momento com nosso assistente.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-4/10">
                <TrendingUp className="h-7 w-7 text-chart-4" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Progresso Visual</h3>
              <p className="text-muted-foreground">
                Graficos detalhados do seu progresso em peso, medidas, forca e desempenho nos treinos.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-5/10">
                <MessageCircle className="h-7 w-7 text-chart-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Comunidade</h3>
              <p className="text-muted-foreground">
                Conecte-se com outros usuarios, compartilhe conquistas e encontre parceiros de treino.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card group rounded-2xl p-8 transition-all hover:border-primary/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Adaptacao Continua</h3>
              <p className="text-muted-foreground">
                O sistema aprende com seu progresso e ajusta automaticamente a intensidade e variedade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative border-t border-border py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">Como Funciona</p>
            <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              3 passos para sua transformacao
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Crie sua Conta</h3>
              <p className="text-muted-foreground">
                Cadastre-se e preencha seu perfil com seus objetivos, nivel atual e preferencias.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Receba seu Plano</h3>
              <p className="text-muted-foreground">
                Nossa IA cria instantaneamente um plano de treino e nutricao personalizado para voce.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chart-4/20 text-2xl font-bold text-chart-4">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Evolua Sempre</h3>
              <p className="text-muted-foreground">
                Acompanhe seu progresso e veja o plano se adaptar conforme voce evolui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.2_195_/_0.1),transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Pronto para transformar sua vida?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Junte-se a milhares de pessoas que ja estao alcancando seus objetivos com FitMind AI.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="glow-primary px-10">
              Comecar Agora — Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Dumbbell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">FitMind AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 FitMind AI. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Privacidade</a>
              <a href="#" className="transition-colors hover:text-foreground">Termos</a>
              <a href="#" className="transition-colors hover:text-foreground">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
