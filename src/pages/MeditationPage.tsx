import { useState } from "react";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MoodPopup } from "@/components/MoodPopup";
import { useWellness } from "@/lib/WellnessContext";
import { Headphones, Clock, CheckCircle2 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function MeditationPage() {
  const { meditations, addMood } = useWellness();
  const [activeMeditation, setActiveMeditation] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [showMood, setShowMood] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);

  const handleComplete = (id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
    setLastCompleted(id);
    setShowMood(true);
  };

  const active = meditations.find((m) => m.id === activeMeditation);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-2xl font-display font-bold text-foreground">Meditação</h1>
        <p className="text-muted-foreground mt-1">Encontre paz interior com sessões guiadas de mindfulness.</p>
      </motion.div>

      {/* Active Player */}
      {active && (
        <motion.div variants={item}>
          <AudioPlayer
            title={active.title}
            artist="Quality Life"
            src={active.audioSrc}
            onComplete={() => handleComplete(active.id)}
          />
        </motion.div>
      )}

      {/* Track List */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meditations.map((med) => {
          const isCompleted = completedIds.has(med.id);
          const isActive = activeMeditation === med.id;

          return (
            <motion.button
              key={med.id}
              variants={item}
              onClick={() => setActiveMeditation(med.id)}
              className={`wellness-card text-left transition-all ${
                isActive ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? "bg-accent" : "wellness-gradient-bg"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-wellness-green" />
                  ) : (
                    <Headphones className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{med.title}</h3>
                  <p className="text-sm text-muted-foreground">{med.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{med.duration}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <MoodPopup
        open={showMood}
        onClose={(mood) => {
          if (mood) addMood(mood, lastCompleted || undefined);
          setShowMood(false);
        }}
      />
    </motion.div>
  );
}
