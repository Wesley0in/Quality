// Simple in-memory store for v1
import { useState, useCallback } from "react";

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  videoId?: string; // YouTube video ID
  audioSrc?: string;
  duration: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  items: ModuleItem[];
  locked: boolean;
}

export interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  activityId?: string;
}

const initialExerciseModules: Module[] = [
  {
    id: "mod1",
    title: "Módulo 1 — Fundamentos",
    description: "Alongamentos básicos e postura",
    locked: false,
    items: [
      { id: "ex1", title: "Alongamento Cervical", description: "Relaxe a tensão do pescoço", videoId: "dQw4w9WgXcQ", duration: "5 min", completed: false },
      { id: "ex2", title: "Postura na Cadeira", description: "Ajuste ergonômico", videoId: "dQw4w9WgXcQ", duration: "7 min", completed: false },
      { id: "ex3", title: "Exercícios para Punhos", description: "Previna lesões por esforço", videoId: "dQw4w9WgXcQ", duration: "4 min", completed: false },
    ],
  },
  {
    id: "mod2",
    title: "Módulo 2 — Intermediário",
    description: "Fortalecimento e mobilidade",
    locked: true,
    items: [
      { id: "ex4", title: "Fortalecimento Core", description: "Exercícios de estabilização", videoId: "dQw4w9WgXcQ", duration: "10 min", completed: false },
      { id: "ex5", title: "Mobilidade Articular", description: "Amplitude de movimentos", videoId: "dQw4w9WgXcQ", duration: "8 min", completed: false },
      { id: "ex6", title: "Relaxamento Ativo", description: "Técnicas de recuperação", videoId: "dQw4w9WgXcQ", duration: "6 min", completed: false },
    ],
  },
  {
    id: "mod3",
    title: "Módulo 3 — Avançado",
    description: "Rotinas completas de bem-estar",
    locked: true,
    items: [
      { id: "ex7", title: "Rotina Matinal Completa", description: "15 minutos para começar o dia", videoId: "dQw4w9WgXcQ", duration: "15 min", completed: false },
      { id: "ex8", title: "Power Stretch", description: "Alongamento intenso", videoId: "dQw4w9WgXcQ", duration: "12 min", completed: false },
    ],
  },
];

const meditationTracks = [
  { id: "med1", title: "Respiração Consciente", description: "Técnica básica de mindfulness", duration: "5 min", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", completed: false },
  { id: "med2", title: "Body Scan", description: "Escaneamento corporal guiado", duration: "10 min", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", completed: false },
  { id: "med3", title: "Meditação para Foco", description: "Aumente sua concentração", duration: "8 min", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", completed: false },
  { id: "med4", title: "Relaxamento Profundo", description: "Para final do dia", duration: "15 min", audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", completed: false },
];

const diagnosticQuestions = [
  { id: "q1", question: "Como você avalia sua qualidade de sono?", options: ["Excelente", "Boa", "Regular", "Ruim", "Péssima"] },
  { id: "q2", question: "Com que frequência sente dores no corpo?", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"] },
  { id: "q3", question: "Como está seu nível de estresse?", options: ["Muito baixo", "Baixo", "Moderado", "Alto", "Muito alto"] },
  { id: "q4", question: "Você pratica atividade física regularmente?", options: ["Sim, diariamente", "3-4x/semana", "1-2x/semana", "Raramente", "Nunca"] },
  { id: "q5", question: "Como está sua alimentação?", options: ["Muito saudável", "Saudável", "Regular", "Pouco saudável", "Muito pouco saudável"] },
  { id: "q6", question: "Como avalia sua saúde mental?", options: ["Excelente", "Boa", "Regular", "Ruim", "Péssima"] },
];

export function useWellnessStore() {
  const [exerciseModules, setExerciseModules] = useState<Module[]>(initialExerciseModules);
  const [meditations] = useState(meditationTracks);
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, string>>({});
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);

  const completeExercise = useCallback((moduleId: string, itemId: string) => {
    setExerciseModules((prev) => {
      const updated = prev.map((mod) => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          items: mod.items.map((item) =>
            item.id === itemId ? { ...item, completed: true } : item
          ),
        };
      });
      // Unlock next module if current is 100% complete
      const currentIdx = updated.findIndex((m) => m.id === moduleId);
      const current = updated[currentIdx];
      if (current && current.items.every((i) => i.completed) && currentIdx + 1 < updated.length) {
        updated[currentIdx + 1] = { ...updated[currentIdx + 1], locked: false };
      }
      return updated;
    });
  }, []);

  const addMood = useCallback((mood: string, activityId?: string) => {
    setMoodLog((prev) => [...prev, { id: Date.now().toString(), mood, timestamp: new Date(), activityId }]);
  }, []);

  const submitDiagnostic = useCallback((answers: Record<string, string>) => {
    setDiagnosticAnswers(answers);
    setDiagnosticCompleted(true);
  }, []);

  const getModuleProgress = (moduleId: string) => {
    const mod = exerciseModules.find((m) => m.id === moduleId);
    if (!mod) return 0;
    const done = mod.items.filter((i) => i.completed).length;
    return Math.round((done / mod.items.length) * 100);
  };

  const getTotalProgress = () => {
    const allItems = exerciseModules.flatMap((m) => m.items);
    const done = allItems.filter((i) => i.completed).length;
    return Math.round((done / allItems.length) * 100);
  };

  return {
    exerciseModules,
    meditations,
    moodLog,
    diagnosticAnswers,
    diagnosticCompleted,
    diagnosticQuestions,
    completeExercise,
    addMood,
    submitDiagnostic,
    getModuleProgress,
    getTotalProgress,
  };
}
