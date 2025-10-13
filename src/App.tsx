import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import DataSources from "./pages/DataSources";
import LeadGeneration from "./pages/LeadGeneration";
import CRM from "./pages/CRM";
import AIAgent from "./pages/AIAgent";
import Marketing from "./pages/Marketing";
import Analytics from "./pages/Analytics";
import RegistryManagement from "./pages/RegistryManagement";
import DataNormalization from "./pages/DataNormalization";
import AITraining from "./pages/AITraining";
import ContentLibrary from "./pages/ContentLibrary";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import PipelinePerformance from "./pages/PipelinePerformance";
import CommunicationLogs from "./pages/CommunicationLogs";
import TaskScheduler from "./pages/TaskScheduler";
import CredentialVault from "./pages/CredentialVault";
import SystemHealth from "./pages/SystemHealth";
import Compliance from "./pages/Compliance";
import Documents from "./pages/Documents";
import InvestorIntelligence from "./pages/InvestorIntelligence";
import Performance from "./pages/Performance";
import Knowledge from "./pages/Knowledge";
import IntegrationLogs from "./pages/IntegrationLogs";
import Feedback from "./pages/Feedback";
import RulesScoring from "./pages/RulesScoring";
import Exports from "./pages/Exports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/lead-generation" element={<LeadGeneration />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/ai-agent" element={<AIAgent />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/registry-management" element={<RegistryManagement />} />
          <Route path="/data-normalization" element={<DataNormalization />} />
          <Route path="/ai-training" element={<AITraining />} />
          <Route path="/content-library" element={<ContentLibrary />} />
          <Route path="/workflow-builder" element={<WorkflowBuilder />} />
          <Route path="/pipeline-performance" element={<PipelinePerformance />} />
          <Route path="/communication-logs" element={<CommunicationLogs />} />
          <Route path="/task-scheduler" element={<TaskScheduler />} />
          <Route path="/credential-vault" element={<CredentialVault />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/investor-intelligence" element={<InvestorIntelligence />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/integration-logs" element={<IntegrationLogs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/rules-scoring" element={<RulesScoring />} />
          <Route path="/exports" element={<Exports />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
