import { motion } from "framer-motion";
import { AvatarWidget } from "@/components/AvatarWidget";
import { ProgressRing } from "@/components/ProgressRing";
import { Activity, Brain, Dumbbell, TrendingUp, Calendar, Heart } from "lucide-react";
import { useWellness } from "@/lib/WellnessContext";
import { Link } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { getTotalProgress, moodLog, diagnosticCompleted } = useWellness();
  const progress = getTotalProgress();
  const todayMoods = moodLog.filter(
    (m) => m.timestamp.toDateString() === new Date().toDateString()
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome + Avatar */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Olá! Bem-vindo ao seu espaço de bem-estar 👋
          </h1>
          <p className="text-muted-foreground mt-1">Continue sua jornada de saúde e qualidade de vida.</p>
        </div>
        <AvatarWidget />
      </motion.div>

      {/* Diagnostic Alert */}
      {!diagnosticCompleted && (
        <motion.div variants={item}>
          <Link to="/perfil" className="block">
            <div className="wellness-gradient-soft rounded-xl border border-primary/20 p-4 flex items-center gap-3 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-full wellness-gradient-bg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Questionário de Diagnóstico Pendente</p>
                <p className="text-sm text-muted-foreground">Complete para personalizar sua experiência.</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="wellness-card flex items-center gap-4">
          <ProgressRing progress={progress} size={60} />
          <div>
            <p className="text-sm text-muted-foreground">Progresso Geral</p>
            <p className="text-xl font-bold font-display text-foreground">{progress}%</p>
          </div>
        </div>

        <div className="wellness-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-wellness-teal" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Exercícios</p>
            <p className="text-xl font-bold font-display text-foreground">3 módulos</p>
          </div>
        </div>

        <div className="wellness-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Brain className="w-6 h-6 text-wellness-blue" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Meditações</p>
            <p className="text-xl font-bold font-display text-foreground">4 sessões</p>
          </div>
        </div>

        <div className="wellness-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
            <Activity className="w-6 h-6 text-wellness-green" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Humor Hoje</p>
            <p className="text-xl font-bold font-display text-foreground">
              {todayMoods.length > 0 ? todayMoods[todayMoods.length - 1].mood : "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-lg font-display font-semibold text-foreground mb-3">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/exercicios">
            <div className="wellness-card group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-5 h-5 text-wellness-teal" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Ginástica Laboral</h3>
              </div>
              <p className="text-sm text-muted-foreground">Continue seus exercícios de alongamento e postura.</p>
            </div>
          </Link>
          <Link to="/meditacao">
            <div className="wellness-card group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5 text-wellness-blue" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Meditação</h3>
              </div>
              <p className="text-sm text-muted-foreground">Sessões guiadas de mindfulness e relaxamento.</p>
            </div>
          </Link>
          <Link to="/chat">
            <div className="wellness-card group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-wellness-green" />
                </div>
                <h3 className="font-display font-semibold text-foreground">Chat IA</h3>
              </div>
              <p className="text-sm text-muted-foreground">Tire dúvidas sobre saúde e bem-estar com IA.</p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Mood */}
      {moodLog.length > 0 && (
        <motion.div variants={item}>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Registro de Humor Recente
          </h2>
          <div className="flex flex-wrap gap-2">
            {moodLog.slice(-10).map((m) => (
              <div key={m.id} className="wellness-card p-3 text-center text-sm">
                <p className="text-muted-foreground text-xs">{m.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                <p className="font-medium text-foreground">{m.mood}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
