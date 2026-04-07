import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, Play, ChevronDown, ChevronRight } from "lucide-react";
import { useWellness } from "@/lib/WellnessContext";
import { MoodPopup } from "@/components/MoodPopup";
import { ProgressRing } from "@/components/ProgressRing";

export default function ExercisesPage() {
  const { exerciseModules, completeExercise, getModuleProgress, addMood } = useWellness();
  const [expandedModule, setExpandedModule] = useState<string | null>(exerciseModules[0]?.id || null);
  const [playingVideo, setPlayingVideo] = useState<{ moduleId: string; itemId: string; videoId: string } | null>(null);
  const [showMood, setShowMood] = useState(false);
  const [completedItemId, setCompletedItemId] = useState<string | null>(null);

  const handleComplete = (moduleId: string, itemId: string) => {
    completeExercise(moduleId, itemId);
    setCompletedItemId(itemId);
    setPlayingVideo(null);
    setShowMood(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Ginástica Laboral</h1>
        <p className="text-muted-foreground mt-1">Exercícios guiados para seu bem-estar no trabalho.</p>
      </div>

      {/* Video Player */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="wellness-card p-0 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full"
                  title="Exercise video"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Assistiu o vídeo completo?</p>
                <button
                  onClick={() => handleComplete(playingVideo.moduleId, playingVideo.itemId)}
                  className="px-4 py-2 rounded-lg wellness-gradient-bg text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Marcar como Concluído ✓
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modules */}
      <div className="space-y-4">
        {exerciseModules.map((mod) => {
          const progress = getModuleProgress(mod.id);
          const isExpanded = expandedModule === mod.id;

          return (
            <motion.div
              key={mod.id}
              layout
              className={`wellness-card p-0 overflow-hidden ${mod.locked ? "opacity-60" : ""}`}
            >
              <button
                onClick={() => !mod.locked && setExpandedModule(isExpanded ? null : mod.id)}
                disabled={mod.locked}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  {mod.locked ? (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <ProgressRing progress={progress} size={48} strokeWidth={4} />
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{mod.title}</h3>
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                    {mod.locked && <p className="text-xs text-destructive mt-1">Complete o módulo anterior para desbloquear</p>}
                  </div>
                </div>
                {!mod.locked && (
                  isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && !mod.locked && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 py-3 space-y-2">
                      {mod.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            item.completed ? "bg-accent/50" : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-wellness-green flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                            )}
                            <div>
                              <p className={`font-medium text-sm ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.description} · {item.duration}</p>
                            </div>
                          </div>
                          {!item.completed && item.videoId && (
                            <button
                              onClick={() => setPlayingVideo({ moduleId: mod.id, itemId: item.id, videoId: item.videoId! })}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <Play className="w-4 h-4" /> Assistir
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <MoodPopup
        open={showMood}
        onClose={(mood) => {
          if (mood) addMood(mood, completedItemId || undefined);
          setShowMood(false);
        }}
      />
    </div>
  );
}
