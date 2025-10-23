
import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import DrillsPage from "./pages/DrillsPage";
import AnalysisPage from "./pages/AnalysisPage";
// import ProfilePage from "./pages/ProfilePage"; // Removed - legacy code
import AuthPage from "./pages/AuthPage";
import HighlightReelPage from "./pages/HighlightReelPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => {
  console.log('App component rendering');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Has Supabase Key:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* All routes are now public for testing */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/sports/:sportId" element={<DrillsPage />} />
                <Route path="/sports/:sportId/drills/:drillId" element={<AnalysisPage />} />
                <Route path="/analysis/:sportId/:drillId" element={<AnalysisPage />} />
                <Route path="/analysis/:sportId/team/:analysisId" element={<AnalysisPage />} />
                <Route path="/highlight-reel" element={<HighlightReelPage />} />
                {/* <Route path="/profile" element={<ProfilePage />} /> */}
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
