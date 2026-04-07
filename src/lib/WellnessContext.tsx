import { createContext, useContext, ReactNode } from "react";
import { useWellnessStore } from "@/lib/store";

type WellnessContextType = ReturnType<typeof useWellnessStore>;

const WellnessContext = createContext<WellnessContextType | null>(null);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const store = useWellnessStore();
  return <WellnessContext.Provider value={store}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error("useWellness must be used within WellnessProvider");
  return ctx;
}
