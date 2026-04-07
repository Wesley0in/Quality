import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Feliz", color: "bg-yellow-100" },
  { emoji: "😢", label: "Triste", color: "bg-blue-100" },
  { emoji: "😲", label: "Surpreso", color: "bg-purple-100" },
  { emoji: "😠", label: "Raiva", color: "bg-red-100" },
  { emoji: "🤩", label: "Animado", color: "bg-green-100" },
  { emoji: "😞", label: "Desapontado", color: "bg-gray-100" },
];

interface MoodPopupProps {
  open: boolean;
  onClose: (mood?: string) => void;
}

export function MoodPopup({ open, onClose }: MoodPopupProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (label: string) => {
    setSelected(label);
    setTimeout(() => {
      onClose(label);
      setSelected(null);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            Como você está se sentindo?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {moods.map((mood, i) => (
            <motion.button
              key={mood.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(mood.label)}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-colors ${
                selected === mood.label
                  ? "ring-2 ring-primary bg-accent"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
