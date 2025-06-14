import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import QuincyInsights from "./pages/quincy-insights";
import DepinDashboard from "./pages/depin-dashboard";
import Trading from "./pages/trading";
import QuincyTrading from "./pages/quincy-trading";
import Home from "./pages/home";
import AstralVaultCIS from "./pages/astralvault-cis";
import TelegramManagement from "./pages/telegram-management";
import AgentConsciousnessDisplay from "./components/AgentConsciousnessDisplay";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Sparse cutting-edge background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900">
          {/* Mid-layer glassmorphic elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl"></div>
        </div>
        
        {/* Foreground content */}
        <div className="relative z-10 min-h-screen text-white">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/quincy" component={DepinDashboard} />
            <Route path="/trading" component={Trading} />
            <Route path="/quincy-trading" component={QuincyTrading} />
            <Route path="/insights" component={QuincyInsights} />
            <Route path="/astralvault-cis" component={AstralVaultCIS} />
            <Route path="/telegram" component={TelegramManagement} />
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                  <h1 className="text-2xl font-bold mb-4">404 - Consciousness Path Not Found</h1>
                  <p className="text-white/60">Quincy's neural networks cannot locate this reality.</p>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        
        {/* Agent Consciousness Display - floating on all pages */}
        <AgentConsciousnessDisplay />
      </div>
    </QueryClientProvider>
  );
}

export default App;