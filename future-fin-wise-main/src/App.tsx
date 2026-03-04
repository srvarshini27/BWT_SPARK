import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFinancialStore } from "@/store/financialStore";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import BudgetPlanner from "./pages/BudgetPlanner";
import GoalTracker from "./pages/GoalTracker";
import EmergencyFund from "./pages/EmergencyFund";
import SIPCalculator from "./pages/SIPCalculator";
import RiskRadar from "./pages/RiskRadar";
import Insights from "./pages/Insights";
import Simulator from "./pages/Simulator";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const profile = useFinancialStore(s => s.profile);
  const onboarded = profile?.onboarded;

  return (
    <Routes>
      <Route path="/" element={onboarded ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/dashboard" element={onboarded ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/budget" element={onboarded ? <BudgetPlanner /> : <Navigate to="/" />} />
      <Route path="/goals" element={onboarded ? <GoalTracker /> : <Navigate to="/" />} />
      <Route path="/emergency" element={onboarded ? <EmergencyFund /> : <Navigate to="/" />} />
      <Route path="/sip-calculator" element={onboarded ? <SIPCalculator /> : <Navigate to="/" />} />
      <Route path="/risk-radar" element={onboarded ? <RiskRadar /> : <Navigate to="/" />} />
      <Route path="/insights" element={onboarded ? <Insights /> : <Navigate to="/" />} />
      <Route path="/simulator" element={onboarded ? <Simulator /> : <Navigate to="/" />} />
      <Route path="/learn" element={onboarded ? <Learn /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
