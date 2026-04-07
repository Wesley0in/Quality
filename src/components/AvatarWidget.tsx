import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avatarImg from "@/assets/quality-life-avatar.png";

const tips = [
  "💧 Bebeu água hoje? Hidrate-se!",
  "🧘 Que tal uma pausa para respirar?",
  "🏃 Levante e alongue-se por 2 minutos!",
  "😊 Sorria! Faz bem para a saúde.",
  "🍎 Já comeu uma fruta hoje?",
  "👀 Descanse os olhos da tela por 20 segundos.",
  "🌿 Respire fundo 3 vezes agora.",
  "💪 Você está indo muito bem! Continue assim.",
];

export function AvatarWidget() {
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3">
      <motion.button
        onClick={() => setShowTip(!showTip)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex-shrink-0"
      >
        <img
          src={avatarImg}
          alt="Quality Life Avatar"
          className="w-14 h-14 rounded-full border-2 border-primary/30 shadow-md"
        />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-wellness-green border-2 border-card animate-pulse" />
      </motion.button>
      <AnimatePresence mode="wait">
        {showTip && (
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="wellness-card p-3 text-sm max-w-xs"
          >
            <p className="text-foreground">{tips[tipIndex]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
