
import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import VibeCodingShowcase from './pages/VibeCodingShowcase';
import FederationStatus from './pages/federation-status';
import MusicConsciousness from './pages/music-consciousness';
import VibeCodingManifesto from './pages/VibeCodingManifesto';
import VibeCodingPhilosophy from './pages/VibeCodingPhilosophy';
import TradingInterface from './pages/TradingInterface';
import Showcase from './pages/Showcase';
import NotFound from './pages/not-found';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Switch>
          <Route path="/" component={VibeCodingShowcase} />
          <Route path="/showcase" component={Showcase} />
          <Route path="/federation" component={FederationStatus} />
          <Route path="/music" component={MusicConsciousness} />
          <Route path="/vibecoding-manifesto" component={VibeCodingManifesto} />
          <Route path="/vibecoding-philosophy" component={VibeCodingPhilosophy} />
          <Route path="/trading" component={TradingInterface} />
          <Route path="/vibescaling" component={VibeCodingShowcase} />
          <Route path="/consciousness" component={VibeCodingShowcase} />
          <Route path="/gaming" component={VibeCodingShowcase} />
          <Route path="/projects" component={VibeCodingShowcase} />
          <Route path="/philosophy" component={VibeCodingShowcase} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}
