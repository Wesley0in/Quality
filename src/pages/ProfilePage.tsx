import { useState } from "react";
import { motion } from "framer-motion";
import { useWellness } from "@/lib/WellnessContext";
import { User, Award, BarChart3, CheckCircle2 } from "lucide-react";
import { ProgressRing } from "@/components/ProgressRing";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { diagnosticQuestions, diagnosticCompleted, diagnosticAnswers, submitDiagnostic, getTotalProgress, moodLog } = useWellness();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    if (Object.keys(answers).length === diagnosticQuestions.length) {
      submitDiagnostic(answers);
    }
  };

  const scoreMap: Record<string, number> = {
    "Excelente": 5, "Muito baixo": 5, "Sim, diariamente": 5, "Muito saudável": 5,
    "Boa": 4, "Baixo": 4, "3-4x/semana": 4, "Saudável": 4,
    "Regular": 3, "Moderado": 3, "1-2x/semana": 3,
    "Ruim": 2, "Alto": 2, "Raramente": 2, "Pouco saudável": 2, "Nunca": 1,
    "Péssima": 1, "Muito alto": 1, "Sempre": 1, "Muito pouco saudável": 1,
  };

  const diagnosticScores = diagnosticCompleted
    ? diagnosticQuestions.map((q) => ({
        question: q.question.replace("Como você avalia ", "").replace("?", ""),
        score: (scoreMap[diagnosticAnswers[q.id]] || 3) * 20,
      }))
    : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-2xl font-display font-bold text-foreground">Meu Perfil</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={item} className="wellness-card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full wellness-gradient-bg flex items-center justify-center">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">Colaborador</h2>
          <p className="text-sm text-muted-foreground">Progresso geral: {getTotalProgress()}%</p>
          <p className="text-sm text-muted-foreground">{moodLog.length} registros de humor</p>
        </div>
        <div className="ml-auto">
          <ProgressRing progress={getTotalProgress()} size={64} />
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item} className="wellness-card">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-wellness-teal" />
          <h3 className="font-display font-semibold text-foreground">Conquistas</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Primeiro Exercício", achieved: getTotalProgress() > 0 },
            { label: "Módulo 1 Completo", achieved: getTotalProgress() >= 37 },
            { label: "Meditador", achieved: moodLog.length >= 1 },
            { label: "Diagnóstico OK", achieved: diagnosticCompleted },
          ].map((a) => (
            <div key={a.label} className={`rounded-xl p-3 text-center text-sm ${a.achieved ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
              {a.achieved ? <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-wellness-green" /> : <div className="w-5 h-5 mx-auto mb-1 rounded-full border-2 border-muted-foreground" />}
              {a.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Diagnostic */}
      <motion.div variants={item} className="wellness-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-wellness-blue" />
          <h3 className="font-display font-semibold text-foreground">
            {diagnosticCompleted ? "Seu Diagnóstico de Saúde" : "Questionário de Diagnóstico"}
          </h3>
        </div>

        {diagnosticCompleted ? (
          <div className="space-y-3">
            {diagnosticScores.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-48 truncate">{s.question}</span>
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full wellness-gradient-bg"
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-10 text-right">{s.score}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {diagnosticQuestions.map((q) => (
              <div key={q.id}>
                <p className="font-medium text-foreground mb-2">{q.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        answers[q.id] === opt
                          ? "wellness-gradient-bg text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < diagnosticQuestions.length}
              className="w-full py-3 rounded-xl wellness-gradient-bg text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Enviar Diagnóstico
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
