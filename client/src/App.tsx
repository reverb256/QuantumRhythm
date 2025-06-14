import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import QuincyInsights from "./pages/quincy-insights";
import DepinDashboard from "./pages/depin-dashboard";
import Home from "./pages/home";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quincy" component={DepinDashboard} />
          <Route path="/insights" component={QuincyInsights} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-400">Quincy's consciousness cannot locate this path.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;