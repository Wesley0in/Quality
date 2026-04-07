import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WellnessProvider } from "@/lib/WellnessContext";
import { AppLayout } from "@/components/AppLayout";
import HomePage from "./pages/HomePage";
import ExercisesPage from "./pages/ExercisesPage";
import MeditationPage from "./pages/MeditationPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WellnessProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exercicios" element={<ExercisesPage />} />
              <Route path="/meditacao" element={<MeditationPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </WellnessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
